const { PrismaClient } = require('./src/generated/client');
const prisma = new PrismaClient();
async function main() {
  const resp = await prisma.cLIENTEs.findUnique({ where: { CodCli: 59 } });
  
  const servicos = await prisma.servico.findMany({
    where: { Responsavel: { contains: 'LILIAN' } },
    take: 1
  });
  console.log('Servico with Lilian:', servicos.length > 0 ? servicos[0].Cliente : 'none');

  const linked = await prisma.cLIENTEs.findMany({
    where: { 
       OR: [
         { ResponsavelTecnico: { contains: 'LILIAN' } },
         { ContatoDireto: { contains: 'LILIAN' } }
       ]
    },
    take: 1
  });
  console.log('Linked client via text:', linked.length > 0 ? linked[0].Cliente : 'none');
}
main().catch(console.error).finally(() => prisma.$disconnect());
