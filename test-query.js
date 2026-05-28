const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const f = await prisma.fichaAnamnese.findFirst({
    where: { AnamneseId: 6 },
    include: { FichaAnamnese_Medicamento: true }
  });
  console.log(JSON.stringify(f, null, 2));
}

run().catch(console.error).finally(() => prisma.$disconnect());
