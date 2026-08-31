import { prisma } from './prisma';

export interface ResolucaoFamilia {
  responsavel: {
    CodCli: number;
    Cliente: string | null;
    Razao: string | null;
    CPF: string | null;
    EMail: string | null;
    Situacao: string | null;
    Caminho: string | null;
  };
  paciente: {
    CodCli: number;
    Cliente: string | null;
    Razao: string | null;
    CPF: string | null;
    Dia_Nasc?: number | null;
    Mes_Nasc?: number | null;
    Ano_Nasc?: number | null;
    Caminho: string | null;
    Situacao: string | null;
    CodSeg?: number | null;
  };
  pacientes: Array<{
    CodCli: number;
    Cliente: string | null;
    Razao: string | null;
    Caminho: string | null;
  }>;
  todosCodClis: number[];
  codClisPacientes: number[];
  codClisResponsaveis: number[];
}

/**
 * Resolve com precisão quem é o Responsável (familiar / titular financeiro)
 * e quem é o Paciente Assistido (idoso), independente de qual dos dois
 * foi utilizado para login ou gerou o token JWT.
 */
export async function resolverFamilia(usuarioId: number): Promise<ResolucaoFamilia | null> {
  const usuario = await prisma.cLIENTEs.findUnique({
    where: { CodCli: usuarioId },
    select: {
      CodCli: true,
      CodCli1: true,
      Cliente: true,
      Razao: true,
      CPF: true,
      EMail: true,
      Situacao: true,
      Caminho: true,
      CodSeg: true,
      Dia_Nasc: true,
      Mes_Nasc: true,
      Ano_Nasc: true,
    },
  });

  if (!usuario) return null;

  // 1. Busca possíveis pacientes vinculados onde CodCli1 = usuario.CodCli
  const filhos = await prisma.cLIENTEs.findMany({
    where: { CodCli1: usuario.CodCli },
    select: {
      CodCli: true,
      CodCli1: true,
      Cliente: true,
      Razao: true,
      CPF: true,
      EMail: true,
      Situacao: true,
      Caminho: true,
      CodSeg: true,
      Dia_Nasc: true,
      Mes_Nasc: true,
      Ano_Nasc: true,
    },
  });

  // 2. Se o usuário tiver CodCli1 preenchido, busca o responsável/familiar vinculado
  let pai = null;
  if (usuario.CodCli1 && usuario.CodCli1 !== usuario.CodCli) {
    pai = await prisma.cLIENTEs.findUnique({
      where: { CodCli: usuario.CodCli1 },
      select: {
        CodCli: true,
        CodCli1: true,
        Cliente: true,
        Razao: true,
        CPF: true,
        EMail: true,
        Situacao: true,
        Caminho: true,
        CodSeg: true,
        Dia_Nasc: true,
        Mes_Nasc: true,
        Ano_Nasc: true,
      },
    });
  }

  // Caso A: O usuário logado é o Responsável e tem filhos/pacientes cadastrados (CodCli1 = usuario.CodCli)
  if (filhos.length > 0) {
    const codClisPacientes = filhos.map((f) => f.CodCli);
    return {
      responsavel: usuario,
      paciente: filhos[0],
      pacientes: filhos,
      todosCodClis: [usuario.CodCli, ...codClisPacientes],
      codClisPacientes,
      codClisResponsaveis: [usuario.CodCli],
    };
  }

  // Caso B: O usuário logado é o Paciente (Idoso) e o pai/responsável está em CodCli1
  if (pai) {
    const outrosFilhos = await prisma.cLIENTEs.findMany({
      where: { CodCli1: pai.CodCli },
      select: {
        CodCli: true,
        Cliente: true,
        Razao: true,
        Caminho: true,
      },
    });

    const listaPacientes = outrosFilhos.length > 0 ? outrosFilhos : [usuario];
    const codClisPacientes = Array.from(new Set([usuario.CodCli, ...outrosFilhos.map((f) => f.CodCli)]));

    return {
      responsavel: pai,
      paciente: usuario,
      pacientes: listaPacientes,
      todosCodClis: Array.from(new Set([pai.CodCli, ...codClisPacientes])),
      codClisPacientes,
      codClisResponsaveis: [pai.CodCli],
    };
  }

  // Caso C: Se não houver vínculo em CodCli1, verifica se existem serviços ou ficha vinculados
  return {
    responsavel: usuario,
    paciente: usuario,
    pacientes: [usuario],
    todosCodClis: [usuario.CodCli],
    codClisPacientes: [usuario.CodCli],
    codClisResponsaveis: [usuario.CodCli],
  };
}
