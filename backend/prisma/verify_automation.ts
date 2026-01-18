import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const latestOrder = await prisma.order.findFirst({
    orderBy: { createdAt: "desc" },
    include: {
      visibility: true,
      events: true,
    },
  });

  console.log("Latest Order ID:", latestOrder?.id);
  console.log(
    "Visibility Records:",
    JSON.stringify(latestOrder?.visibility, null, 2),
  );
  console.log("Events Logged:", JSON.stringify(latestOrder?.events, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
