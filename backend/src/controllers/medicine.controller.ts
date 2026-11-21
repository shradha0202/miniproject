
import { Request, Response } from 'express';
import { parse } from 'csv-parse/sync';
import { query } from '../database/db';
import { createMedicineSchema } from '../validators';

export class MedicineController {
  /**
   * Search / List Medicines
   * Accessible to Admin, Manufacturer, and Public.
   * Supports filtering and pagination.
   */
  public static async listMedicines(req: Request, res: Response): Promise<void> {
    try {
      const {
        search,
        dosage_form,
        source,
        active_only,
      } = req.query;

      // Validate pagination parameters
      const page = Math.max(1, Number.parseInt(String(req.query.page || '1'), 10) || 1);
      const requestedLimit = Number.parseInt(String(req.query.limit || '50'), 10) || 50;
      const limit = Math.min(200, Math.max(1, requestedLimit));
      const offset = (page - 1) * limit;

      let whereClause = 'WHERE 1=1';
      const params: any[] = [];

      // By default, return only active medicines.
      // Pass active_only=false to include inactive medicines.
      if (active_only !== 'false') {
        whereClause += ' AND is_active = true';
      }

      // Filter by dosage form
      if (typeof dosage_form === 'string' && dosage_form.trim()) {
        params.push(`%${dosage_form.trim()}%`);
        whereClause += ` AND dosage_form ILIKE $${params.length}`;
      }

      // Filter by source
      if (typeof source === 'string' && source.trim()) {
        params.push(source.trim());
        whereClause += ` AND source = $${params.length}`;
      }

      // Search by medicine name, brand, composition, or manufacturer
      if (typeof search === 'string' && search.trim()) {
        params.push(`%${search.trim()}%`);

        whereClause += ` AND (
          medicine_name ILIKE $${params.length}
          OR brand_name ILIKE $${params.length}
          OR composition ILIKE $${params.length}
          OR manufacturer_name ILIKE $${params.length}
        )`;
      }

      // Get total number of matching medicines
      const countResult = await query(
        `SELECT COUNT(*) AS total FROM medicines ${whereClause}`,
        params
      );

      const total = Number.parseInt(countResult.rows[0].total, 10) || 0;

      // Fetch medicines for the requested page
      const dataParams = [...params, limit, offset];

      const result = await query(
        `SELECT *
         FROM medicines
         ${whereClause}
         ORDER BY medicine_name ASC
         LIMIT $${params.length + 1}
         OFFSET $${params.length + 2}`,
        dataParams
      );

      res.status(200).json({
        success: true,
        data: {
          items: result.rows,
          pagination: {
            total,
            page,
            limit,
            pages: Math.ceil(total / limit),
          },
        },
      });
    } catch (err: any) {
      console.error('[MedicineController] List medicines error:', err);

      res.status(500).json({
        success: false,
        error: err.message || 'Failed to list medicines.',
      });
    }
  }

  /**
   * Get a single medicine by ID
   */
  public static async getMedicineById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const result = await query(
        'SELECT * FROM medicines WHERE id = $1',
        [id]
      );

      if (result.rows.length === 0) {
        res.status(404).json({
          success: false,
          error: 'Medicine not found.',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: result.rows[0],
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        error: err.message || 'Failed to fetch medicine.',
      });
    }
  }

  /**
   * Create a medicine (Admin only)
   */
  public static async createMedicine(req: Request, res: Response): Promise<void> {
    try {
      const validated = createMedicineSchema.parse(req.body);

      // Check for duplicate medicine
      const dupCheck = await query(
        `SELECT id
         FROM medicines
         WHERE LOWER(medicine_name) = LOWER($1)
         AND COALESCE(LOWER(strength), '') = COALESCE(LOWER($2), '')
         AND COALESCE(LOWER(dosage_form), '') = COALESCE(LOWER($3), '')`,
        [
          validated.medicine_name,
          validated.strength || '',
          validated.dosage_form || '',
        ]
      );

      if (dupCheck.rows.length > 0) {
        res.status(409).json({
          success: false,
          error: `A medicine with name "${validated.medicine_name}", strength "${validated.strength || 'N/A'}", and dosage form "${validated.dosage_form || 'N/A'}" already exists.`,
        });
        return;
      }

      const result = await query(
        `INSERT INTO medicines (
          medicine_name,
          brand_name,
          manufacturer_name,
          composition,
          strength,
          dosage_form,
          therapeutic_class,
          source,
          is_active
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, 'manual', $8)
        RETURNING *`,
        [
          validated.medicine_name,
          validated.brand_name || null,
          validated.manufacturer_name || null,
          validated.composition || null,
          validated.strength || null,
          validated.dosage_form || null,
          validated.therapeutic_class || null,
          validated.is_active ?? true,
        ]
      );

      res.status(201).json({
        success: true,
        message: 'Medicine created in master catalogue.',
        data: result.rows[0],
      });
    } catch (err: any) {
      if (err.name === 'ZodError') {
        res.status(400).json({
          success: false,
          error: err.errors[0].message,
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: err.message || 'Failed to create medicine.',
      });
    }
  }

  /**
   * Update medicine (Admin only)
   */
  public static async updateMedicine(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const validated = createMedicineSchema.parse(req.body);

      const result = await query(
        `UPDATE medicines SET
          medicine_name = $1,
          brand_name = $2,
          manufacturer_name = $3,
          composition = $4,
          strength = $5,
          dosage_form = $6,
          therapeutic_class = $7,
          is_active = $8,
          updated_at = NOW()
        WHERE id = $9
        RETURNING *`,
        [
          validated.medicine_name,
          validated.brand_name || null,
          validated.manufacturer_name || null,
          validated.composition || null,
          validated.strength || null,
          validated.dosage_form || null,
          validated.therapeutic_class || null,
          validated.is_active ?? true,
          id,
        ]
      );

      if (result.rows.length === 0) {
        res.status(404).json({
          success: false,
          error: 'Medicine not found.',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Medicine updated successfully.',
        data: result.rows[0],
      });
    } catch (err: any) {
      if (err.name === 'ZodError') {
        res.status(400).json({
          success: false,
          error: err.errors[0].message,
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: err.message || 'Failed to update medicine.',
      });
    }
  }

  /**
   * Toggle medicine active status (Admin only)
   */
  public static async toggleMedicineStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { is_active } = req.body;

      const result = await query(
        `UPDATE medicines
         SET is_active = $1, updated_at = NOW()
         WHERE id = $2
         RETURNING id, medicine_name, is_active`,
        [Boolean(is_active), id]
      );

      if (result.rows.length === 0) {
        res.status(404).json({
          success: false,
          error: 'Medicine not found.',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: `Medicine marked as ${is_active ? 'active' : 'inactive'}.`,
        data: result.rows[0],
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        error: err.message || 'Failed to update medicine status.',
      });
    }
  }

  /**
   * Import medicines through CSV (Admin only)
   */
  public static async importMedicinesCsv(req: Request, res: Response): Promise<void> {
    try {
      let csvContent = '';

      if (req.file) {
        csvContent = req.file.buffer.toString('utf-8');
      } else if (req.body.csv_text) {
        csvContent = req.body.csv_text;
      } else {
        res.status(400).json({
          success: false,
          error: 'No CSV file or csv_text payload provided.',
        });
        return;
      }

      const records: any[] = parse(csvContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
      });

      let insertedCount = 0;
      let skippedCount = 0;
      const errors: string[] = [];

      for (let i = 0; i < records.length; i++) {
        const row = records[i];

        const medicineName =
          row.medicine_name || row.name || row.drug_name;

        if (!medicineName) {
          skippedCount++;
          errors.push(`Row ${i + 1}: Missing required medicine_name.`);
          continue;
        }

        const brandName = row.brand_name || row.brand || null;
        const manufacturer = row.manufacturer_name || row.manufacturer || null;
        const composition = row.composition || row.salt_composition || null;
        const strength = row.strength || null;
        const dosageForm = row.dosage_form || row.type || null;
        const therapeuticClass = row.therapeutic_class || row.category || null;

        try {
          const insertRes = await query(
            `INSERT INTO medicines (
              medicine_name,
              brand_name,
              manufacturer_name,
              composition,
              strength,
              dosage_form,
              therapeutic_class,
              source
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, 'csv_import')
            ON CONFLICT DO NOTHING
            RETURNING id`,
            [
              medicineName,
              brandName,
              manufacturer,
              composition,
              strength,
              dosageForm,
              therapeuticClass,
            ]
          );

          if (insertRes.rows.length > 0) {
            insertedCount++;
          } else {
            skippedCount++;
          }
        } catch (e: any) {
          skippedCount++;
          errors.push(`Row ${i + 1} (${medicineName}): ${e.message}`);
        }
      }

      res.status(200).json({
        success: true,
        message: `CSV import completed. Successfully inserted ${insertedCount} medicines. Skipped ${skippedCount} duplicate or invalid rows.`,
        data: {
          total_rows: records.length,
          inserted: insertedCount,
          skipped: skippedCount,
          errors: errors.slice(0, 10),
        },
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        error: err.message || 'CSV import failed.',
      });
    }
  }
}