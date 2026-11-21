import csv

input_file = "sample-data/indian_pharma_original.csv"
output_file = "sample-data/indian_pharma_converted.csv"

with open(input_file, "r", encoding="utf-8-sig", newline="") as source:
    reader = csv.DictReader(source)

    with open(output_file, "w", encoding="utf-8", newline="") as target:
        fieldnames = [
            "id",
            "medicine_name",
            "brand_name",
            "manufacturer_name",
            "composition",
            "strength",
            "dosage_form",
            "therapeutic_class"
        ]

        writer = csv.DictWriter(target, fieldnames=fieldnames)
        writer.writeheader()

        count = 0

        for row in reader:
            writer.writerow({
                "id": row.get("product_id", ""),
                "medicine_name": row.get("primary_ingredient", ""),
                "brand_name": row.get("brand_name", ""),
                "manufacturer_name": row.get("manufacturer", ""),
                "composition": row.get("active_ingredients", ""),
                "strength": row.get("primary_strength", ""),
                "dosage_form": row.get("dosage_form", ""),
                "therapeutic_class": row.get("therapeutic_class", "")
            })

            count += 1

print("Dataset conversion completed!")
print("Total records converted:", count)
print("Output file:", output_file)