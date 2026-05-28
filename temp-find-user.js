const { PrismaClient } = require('./src/generated/client');
const prisma = new PrismaClient();
async function main() {
  // Find a patient who has CodCli1 set
  const patients = await prisma.cLIENTEs.findMany({
    where: { CodCli1: { not: null, gt: 0 } },
    take: 100
  });

  for (let p of patients) {
    // Check if the parent has a password
    const parent = await prisma.cLIENTEs.findUnique({ where: { CodCli: p.CodCli1 } });
    if (parent && parent.CodUsu && parent.CPF) {
      const senha = await prisma.senha.findUnique({ where: { CodUsu: parent.CodUsu } });
      if (senha && senha.Senha) {
        console.log('--- FOUND ---');
        console.log('Parent CPF:', parent.CPF);
        console.log('Parent Name:', parent.Cliente);
        console.log('Parent Password:', senha.Senha);
        console.log('Patient Name:', p.Cliente);
        break;
      }
    }
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
