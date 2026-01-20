import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    include: { supplierProfile: true },
  });
  console.log("Users:", JSON.stringify(users, null, 2));

  const skus = await prisma.sku.findMany();
  console.log("SKUs:", JSON.stringify(skus, null, 2));

  const inventory = await prisma.inventory.findMany({
    include: { sku: true },
  });
  console.log("Inventory:", JSON.stringify(inventory, null, 2));
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
