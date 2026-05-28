const { PrismaClient } = require('./src/generated/client');
const prisma = new PrismaClient();
async function main() {
  const c = await prisma.cLIENTEs.findMany({ where: { CPF: { contains: '41991605' } } });
  console.log('Clientes in DB:', c.map(cl => ({ CPF: cl.CPF, CodUsu: cl.CodUsu })));
}
main().catch(console.error).finally(() => prisma.$disconnect());
