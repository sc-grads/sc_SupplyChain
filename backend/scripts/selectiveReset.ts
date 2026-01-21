import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting selective database reset...");

  // Order of deletion to respect foreign keys while avoiding CASCADE on Event logs
  // Event has FKs to Order and User (SetNull on delete)
  // Order has FKs to User
  // Rating has FKs to Order, User
  // Visibility has FKs to Order, User
  // Inventory has FKs to SupplierProfile, Sku

  const tables = [
    "OrderVisibility",
    "Rating",
    "Notification",
    "Inventory",
    "SupplierSku",
    "RetailerInventory",
    "SupplierProfile",
    "Order",
    "Sku",
  ];

  for (const table of tables) {
    try {
      console.log(`Clearing table: ${table}`);
      // Using DELETE instead of TRUNCATE CASCADE to safely handle the SetNull relations in Event
      await prisma.$executeRawUnsafe(`DELETE FROM "${table}";`);
    } catch (e) {
      console.error(`Error clearing ${table}:`, e);
    }
  }

  console.log("Reset complete. Event table preserved.");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
