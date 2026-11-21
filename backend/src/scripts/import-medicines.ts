import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { pool } from '../database/db';

export const importMedicinesFromCsv = async (filePath?: string) => {
  const targetPath =
    filePath ||
    path.resolve(__dirname, '../../../sample-data/indian_pharma_converted.csv');

  console.log(`[Import Medicines] Reading dataset: ${targetPath}`);

  if (!fs.existsSync(targetPath)) {
    throw new Error(`CSV file not found: ${targetPath}`);
  }

  const fileContent = fs.readFileSync(targetPath, 'utf-8');

  const records: any[] = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  console.log(`Total records found: ${records.length}`);

  const client = await pool.connect();

  let inserted = 0;
  let skipped = 0;

  try {
    // Read existing records once to avoid repeated database queries.
    const existing = await client.query(`
      SELECT external_source_id, medicine_name, brand_name,
             manufacturer_name, strength, dosage_form
      FROM medicines
    `);

    const existingKeys = new Set<string>();

    for (const row of existing.rows) {
      if (row.external_source_id) {
        existingKeys.add(`id:${row.external_source_id}`);
      } else {
        existingKeys.add(
          `fallback:${[
            row.medicine_name,
            row.brand_name,
            row.manufacturer_name,
            row.strength,
            row.dosage_form,
          ].map(v => String(v || '').toLowerCase()).join('|')}`
        );
      }
    }

    const newRecords: any[][] = [];

    for (const row of records) {
      const medicineName = row.medicine_name;
      if (!medicineName) {
        skipped++;
        continue;
      }

      const brandName = row.brand_name || null;
      const manufacturer = row.manufacturer_name || null;
      const composition = row.composition || null;
      const strength = row.strength || null;
      const dosageForm = row.dosage_form || null;
      const therapeuticClass = row.therapeutic_class || null;
      const externalId = row.id || null;

      const key = externalId
        ? `id:${externalId}`
        : `fallback:${[
            medicineName,
            brandName,
            manufacturer,
            strength,
            dosageForm,
          ].map(v => String(v || '').toLowerCase()).join('|')}`;

      if (existingKeys.has(key)) {
        skipped++;
        continue;
      }

      existingKeys.add(key);

      newRecords.push([
        medicineName,
        brandName,
        manufacturer,
        composition,
        strength,
        dosageForm,
        therapeuticClass,
        externalId,
      ]);
    }

    console.log(`New records to insert: ${newRecords.length}`);
    console.log(`Duplicate/invalid records skipped: ${skipped}`);

    // Insert records in batches of 500.
    const batchSize = 500;

    for (let i = 0; i < newRecords.length; i += batchSize) {
      const batch = newRecords.slice(i, i + batchSize);
      const values: any[] = [];

      const placeholders = batch.map((row, index) => {
        const offset = index * 8;

        values.push(...row);

        return `(
          $${offset + 1},
          $${offset + 2},
          $${offset + 3},
          $${offset + 4},
          $${offset + 5},
          $${offset + 6},
          $${offset + 7},
          'indian_pharma_dataset',
          $${offset + 8}
        )`;
      });

      await client.query(
        `INSERT INTO medicines (
          medicine_name,
          brand_name,
          manufacturer_name,
          composition,
          strength,
          dosage_form,
          therapeutic_class,
          source,
          external_source_id
        ) VALUES ${placeholders.join(',')}`,
        values
      );

      inserted += batch.length;

      console.log(
        `Progress: ${inserted} / ${newRecords.length} records inserted`
      );
    }

    console.log('Medicine dataset import completed!');
    console.log(`Inserted: ${inserted}`);
    console.log(`Skipped: ${skipped}`);

  } finally {
    client.release();
  }
};

if (require.main === module) {
  const customPath = process.argv[2];

  importMedicinesFromCsv(customPath)
    .then(() => pool.end())
    .catch(async (err) => {
      console.error('[Import Medicines Error]', err);
      await pool.end();
      process.exit(1);
    });
}