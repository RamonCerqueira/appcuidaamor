const { PrismaClient } = require('./src/generated/client');
const prisma = new PrismaClient();
async function main() {
  const resp = await prisma.cLIENTEs.findUnique({ where: { CodCli: 59 } });
  console.log('Responsável:', resp?.Cliente);
  
  // Buscar na tabela SERVICO os pacientes desse responsável
  const servicos = await prisma.servico.findMany({
    where: { CodCon: 59 }, // talvez CodCon seja o contrato/responsável?
    take: 5
  });
  console.log('Serviços por CodCon:', servicos.map(s => ({ Codcli: s.Codcli, Paciente: s.Cliente })));

  const servicos2 = await prisma.servico.findMany({
    where: { Responsavel: { contains: 'SILVA' } },
    take: 5
  });
  console.log('Serviços com Silva:', servicos2.map(s => ({ Codcli: s.Codcli, Responsavel: s.Responsavel })));
}
main().catch(console.error).finally(() => prisma.$disconnect());
