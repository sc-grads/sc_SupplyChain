import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed script...");

  // 1. Create global SKUs (catalog) if they don't exist
  const skus = [
    { code: "M8-BOLT-20", name: "M8 x 20mm Steel Bolt" },
    { code: "WOOD-SCREW-50", name: "50mm Wood Screws (Pack 200)" },
    { code: "PAINT-BRUSH-4", name: "4-inch Paint Brush" },
    { code: "HAMMER-CLAW-16OZ", name: "16oz Claw Hammer" },
    { code: "DRILL-BIT-SET-10PC", name: "10-Piece Drill Bit Set" },
    { code: "STEEL-ROD-10MM-6M", name: "10mm Steel Rod (6m)" },
    { code: "WELDING-ROD-3.2MM-5KG", name: "3.2mm Welding Rods (5kg)" },
    {
      code: "METAL-SHEET-2MM-1220x2440",
      name: "2mm Metal Sheet (1220x2440mm)",
    },
    { code: "ANGLE-IRON-50x50x6MM-6M", name: "50x50x6mm Angle Iron (6m)" },
    { code: "ELECTRICAL-TAPE-RED-19MM", name: "19mm Red Electrical Tape" },
    { code: "PLIERS-COMB-8INCH", name: "8-inch Combination Pliers" },
    { code: "SCREWDRIVER-SET-6PC", name: "6-Piece Screwdriver Set" },
    { code: "TAPE-MEASURE-5M", name: "5m Tape Measure" },
  ];

  console.log("📦 Creating/updating global SKU catalog...");
  for (const sku of skus) {
    await prisma.sku.upsert({
      where: { code: sku.code },
      update: { name: sku.name }, // Update name if SKU exists
      create: sku,
    });
  }
  console.log(`✅ Created/updated ${skus.length} SKUs`);

  // 2. Find all registered suppliers from database
  const suppliers = await prisma.user.findMany({
    where: { role: "SUPPLIER" },
    include: { supplierProfile: true },
  });

  if (suppliers.length === 0) {
    console.log("⚠️  No suppliers found in database. Register suppliers first!");
    return;
  }

  console.log(`👥 Found ${suppliers.length} supplier(s) in database`);

  // 3. Allocate inventory and catalog entries to each supplier
  for (let i = 0; i < suppliers.length; i++) {
    const user = suppliers[i];

    // Ensure supplier profile exists (for users created before profile logic)
    let profile = user.supplierProfile;
    if (!profile) {
      console.log(`⚠️  Creating missing profile for ${user.email}`);
      profile = await prisma.supplierProfile.create({
        data: {
          supplierId: user.id,
          address: user.address || "Address not specified",
          primaryGoods: "General Hardware",
          serviceAreas: user.address
            ? [user.address]
            : ["Johannesburg CBD"], // Use address or default
        },
      });
    }

    // Distribute SKUs across suppliers using modulo (round-robin)
    // Supplier 0 gets SKUs 0, N, 2N, ...
    // Supplier 1 gets SKUs 1, N+1, 2N+1, ...
    const mySkus = skus.filter(
      (_, index) => index % suppliers.length === i % suppliers.length,
    );

    console.log(
      `📋 Allocating ${mySkus.length} SKUs to ${user.name || user.email}...`,
    );

    for (const skuData of mySkus) {
      const sku = await prisma.sku.findUnique({
        where: { code: skuData.code },
      });

      if (!sku) {
        console.warn(`⚠️  SKU ${skuData.code} not found, skipping...`);
        continue;
      }

      // Create/update Inventory entry
      const status = i % 3 === 0 ? "AVAILABLE" : i % 3 === 1 ? "LOW" : "AVAILABLE"; // Mix of statuses
      const quantity = Math.floor(Math.random() * 1000) + 100; // Random quantity 100-1099

      await prisma.inventory.upsert({
        where: {
          supplierId_skuId: {
            supplierId: profile.id,
            skuId: sku.id,
          },
        },
        update: {
          status, // Update status on re-run
          quantity,
        },
        create: {
          supplierId: profile.id,
          skuId: sku.id,
          status,
          quantity,
        },
      });

      // CRITICAL: Create SupplierSku catalog entry (required for order distribution)
      await prisma.supplierSku.upsert({
        where: {
          supplierId_skuId: {
            supplierId: profile.id,
            skuId: sku.id,
          },
        },
        update: {}, // Catalog entry exists, no update needed
        create: {
          supplierId: profile.id,
          skuId: sku.id,
        },
      });
    }

    console.log(
      `✅ Allocated ${mySkus.length} items to ${user.name || user.email}`,
    );
  }

  console.log("\n🎉 Seed completed successfully!");
  console.log(`   - SKUs: ${skus.length}`);
  console.log(`   - Suppliers: ${suppliers.length}`);
  console.log(
    `   - Total inventory entries: ${suppliers.length * Math.ceil(skus.length / suppliers.length)}`,
  );
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
