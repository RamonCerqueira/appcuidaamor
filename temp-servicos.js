const { PrismaClient } = require('./src/generated/client');
const prisma = new PrismaClient();
async function main() {
  const user = await prisma.cLIENTEs.findFirst({
    where: { CPF: '37968882591' }
  });
  console.log('User CodCli:', user.CodCli);
  
  const servicos = await prisma.servico.findMany({
    where: { Codcli: user.CodCli },
    select: { Pedido: true }
  });
  console.log('User Pedidos:', servicos);
}
main().catch(console.error).finally(() => prisma.$disconnect());
