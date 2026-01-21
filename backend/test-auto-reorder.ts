import { PrismaClient } from "@prisma/client";
import { updateInventory } from "./controllers/inventory.controller";
import { Request, Response } from "express";

const prisma = new PrismaClient();

async function runTest() {
  console.log("Starting Auto-Reorder Test Script...");

  // 1. Find a Vendor User
  const vendor = await prisma.user.findFirst({
    where: { role: "VENDOR" },
  });

  if (!vendor) {
    console.error("No VENDOR user found in the database.");
    return;
  }
  console.log(`Using Vendor: ${vendor.name} (ID: ${vendor.id})`);

  // 2. Find an Inventory Item
  let inventoryItem = await prisma.retailerInventory.findFirst({
    where: { vendorId: vendor.id },
    include: { sku: true },
  });

  if (!inventoryItem) {
    console.log(
      "No existing inventory item found for this vendor. Attempting to create one...",
    );
    const sku = await prisma.sku.findFirst();
    if (!sku) {
      console.error("No SKUs found in the system to assign.");
      return;
    }

    // Create a dummy item
    try {
      inventoryItem = await prisma.retailerInventory.create({
        data: {
          vendorId: vendor.id,
          skuId: sku.id,
          currentStock: 100,
          reorderLevel: 10,
          autoReorderEnabled: false,
          reorderQuantity: 50,
          unit: "unit",
          category: "Test Category",
        } as any, // Cast to any in case types are stale
        include: { sku: true },
      });
      console.log("Created test inventory item.");
    } catch (e) {
      console.error("Failed to create inventory item:", e);
      return;
    }
  }

  console.log(
    `Testing with SKU: ${inventoryItem.sku.name} (ID: ${inventoryItem.skuId})`,
  );
  console.log(
    `Initial State -> Stock: ${inventoryItem.currentStock}, ReorderLevel: ${inventoryItem.reorderLevel}`,
  );

  // 3. Prepare Logic for Trigger
  // We will set Stock = 2, Reorder Level = 10, AutoReorder = true.
  const targetStock = 2;
  const targetReorderLevel = 10;
  const targetReorderQty = 55;

  console.log(`\n--- Simulating Update ---`);
  console.log(
    `Setting Stock to ${targetStock} (<= ${targetReorderLevel}) with Auto-Reorder ENABLED.`,
  );
  console.log(`EXPECTED DELIVERY LOCATION: Pretoria (Testing Default)`);

  // Mock Request
  const req = {
    user: { id: vendor.id, role: "VENDOR" },
    body: {
      skuId: inventoryItem.skuId,
      quantity: targetStock,
      reorderLevel: targetReorderLevel,
      autoReorderEnabled: true,
      reorderQuantity: targetReorderQty,
    },
    // Add other properties if needed by express/middleware (usually not used in controller body)
  } as unknown as Request;

  // Mock Response
  const res = {
    status: function (code: number) {
      console.log(`[Response Status]: ${code}`);
      return this;
    },
    json: function (data: any) {
      console.log(`[Response Body]:`);
      console.log(JSON.stringify(data, null, 2));

      if (data && data.autoReorder) {
        console.log("\n--- Auto-Reorder Result ---");
        if (data.autoReorder.triggered) {
          console.log(`✅ TRIGGERED! Success: ${data.autoReorder.success}`);
          console.log(`Message: ${data.autoReorder.message}`);
        } else {
          console.log("❌ NOT TRIGGERED.");
        }
      }
      return this;
    },
  } as unknown as Response;

  // 4. Run Controller
  try {
    await updateInventory(req, res);
  } catch (e) {
    console.error("Controller execution failed:", e);
  }
}

runTest()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
