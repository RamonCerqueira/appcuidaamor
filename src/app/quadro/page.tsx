'use client';

import Header from '@/components/Header';
import { Pill, Utensils, PersonStanding, Brain, ClipboardEdit } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Quadro() {
  const [fichas, setFichas] = useState<any[]>([]);
  const [fichaAtual, setFichaAtual] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/quadro')
      .then(res => res.json())
      .then(json => {
        if (json.sucesso && json.fichas && json.fichas.length > 0) {
          setFichas(json.fichas);
          setFichaAtual(json.fichas[0]);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-[var(--color-brand-background)] w-full relative pb-24">
        <Header title="Quadro de Saúde" />
        <main className="flex-1 px-5 pt-6 flex flex-col gap-8 animate-pulse">
          <div className="h-96 bg-gray-200 rounded-[2rem]" />
        </main>
      </div>
    );
  }

  const ultimaAtt = fichaAtual?.DataCriacao ? new Date(fichaAtual.DataCriacao).toLocaleDateString('pt-BR') : 'Sem registro';
  const medicamentosAtuais = fichaAtual?.FichaAnamnese_Medicamento || [];
  const historicoFichas = fichas.slice(1);

  // SVG Chart Interno
  const ScoreChart = ({ fichasArray }: { fichasArray: any[] }) => {
    // Se não tiver ao menos 2 avaliações, nem mostra o gráfico
    if (!fichasArray || fichasArray.length < 2) return null;

    // Pega os últimos 6 meses (ou menos) e inverte para ordem cronológica
    const data = [...fichasArray].slice(0, 6).reverse().map(f => {
      const dataHist = new Date(f.DataCriacao);
      return {
        label: dataHist.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', ''),
        score: f.ScoreSaude || 0 // Default 0 se não preenchido
      }
    });

    const width = 300;
    const height = 100;
    const padding = 20;
    
    const minScore = 0;
    const maxScore = 100;
    
    const getX = (index: number) => padding + (index * (width - 2 * padding) / (data.length - 1));
    const getY = (score: number) => height - padding - ((score - minScore) / (maxScore - minScore)) * (height - 2 * padding);

    const points = data.map((d, i) => `${getX(i)},${getY(d.score)}`).join(' ');
    const pathData = `M ${points}`;
    
    const lastScore = data[data.length - 1].score;
    const prevScore = data[data.length - 2].score;
    const diff = lastScore - prevScore;
    const trend = diff >= 0 ? 'up' : 'down';
    
    return (
      <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-[2rem] p-6 text-white shadow-xl shadow-pink-500/20 relative overflow-hidden">
        <div className="flex justify-between items-start mb-4 relative z-10">
          <div>
            <h3 className="font-extrabold text-[11px] opacity-90 uppercase tracking-widest">Score de Vitalidade</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-4xl font-black">{lastScore}</span>
              <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full ${trend === 'up' ? 'bg-white/20 text-white' : 'bg-red-500/50 text-white'}`}>
                {trend === 'up' ? '▲' : '▼'} {Math.abs(diff)} pts
              </span>
            </div>
          </div>
        </div>
        
        {/* SVG Dinâmico */}
        <div className="relative z-10 w-full flex justify-center mt-2">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible" style={{ filter: 'drop-shadow(0px 8px 8px rgba(0,0,0,0.2))' }}>
            {/* Linha */}
            <path d={pathData} fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            {/* Pontos e Labels */}
            {data.map((d, i) => (
              <g key={i}>
                <circle cx={getX(i)} cy={getY(d.score)} r="4.5" fill="#ec4899" stroke="#ffffff" strokeWidth="3" />
                <text x={getX(i)} y={height + 5} fill="rgba(255,255,255,0.7)" fontSize="10" fontWeight="bold" textAnchor="middle" className="uppercase">{d.label}</text>
              </g>
            ))}
          </svg>
        </div>
        
        {/* Brilho decorativo */}
        <div className="absolute top-[-50%] right-[-10%] w-64 h-64 bg-white/10 blur-3xl rounded-full pointer-events-none"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-brand-background)] w-full relative pb-24">
      <Header title="Quadro de Saúde" />

      <main className="flex-1 px-5 pt-6 flex flex-col gap-6">
        
        {/* Gráfico de Evolução (Renderiza apenas se tiver fichas) */}
        <ScoreChart fichasArray={fichas} />

        {/* Quadro Geral */}
        <div className="bg-white/70 backdrop-blur-md rounded-[2rem] p-3 shadow-lg shadow-gray-200/40 border border-white/60 relative overflow-hidden">
          {/* Efeito Glassmorphism Brilho */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/40 to-transparent pointer-events-none"></div>
          
          <div className="p-4 flex justify-between items-center border-b border-gray-100/50 mb-2 relative z-10">
            <h3 className="font-extrabold text-[var(--color-brand-text)] text-sm flex items-center gap-2">
              Prontuário Médico
            </h3>
          </div>

          <div className="flex flex-col gap-1 p-2">
            
            <div className="flex gap-4 p-3 items-start">
              <div className="w-12 h-12 rounded-[1rem] bg-[var(--color-brand-accent)]/10 flex items-center justify-center text-[var(--color-brand-accent)] shrink-0">
                <Pill size={24} />
              </div>
              <div className="flex flex-col pt-0.5 w-full">
                <h4 className="text-sm font-extrabold text-[var(--color-brand-text)]">Medicamentos</h4>
                <div className="flex flex-col gap-1 mt-1">
                  {medicamentosAtuais.length > 0 ? medicamentosAtuais.map((m: any, i: number) => (
                     <p key={i} className="text-xs text-[var(--color-brand-text-light)] font-medium leading-relaxed">• {m.Nome} ({m.Dose}) - {m.Horarios}</p>
                  )) : (
                     <p className="text-xs text-[var(--color-brand-text-light)] font-medium">Nenhum medicamento registrado.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-4 p-3 items-start">
              <div className="w-12 h-12 rounded-[1rem] bg-[var(--color-brand-secondary)]/10 flex items-center justify-center text-[var(--color-brand-secondary)] shrink-0">
                <Utensils size={24} />
              </div>
              <div className="flex flex-col pt-0.5 w-full">
                <h4 className="text-sm font-extrabold text-[var(--color-brand-text)]">Alimentação e Intestino</h4>
                <p className="text-xs text-[var(--color-brand-text-light)] mt-1 font-medium leading-relaxed">
                  {fichaAtual?.FuncionamentoIntestinal || 'Intestino não informado.'}<br/>
                  Consistência: {fichaAtual?.Consistencia || 'Não informada.'}
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-3 items-start">
              <div className="w-12 h-12 rounded-[1rem] bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                <PersonStanding size={24} />
              </div>
              <div className="flex flex-col pt-0.5 w-full">
                <h4 className="text-sm font-extrabold text-[var(--color-brand-text)]">Atividade Física</h4>
                <p className="text-xs text-[var(--color-brand-text-light)] mt-1 font-medium leading-relaxed">
                  {fichaAtual?.AtividadeFisica === 'S' || fichaAtual?.AtividadeFisica === true ? 'Pratica: Sim' : 'Pratica: Não'} 
                  {fichaAtual?.AtividadeFisica_Frequencia ? ` (${fichaAtual?.AtividadeFisica_Frequencia})` : ''}
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-3 items-start">
              <div className="w-12 h-12 rounded-[1rem] bg-[var(--color-brand-tertiary)]/10 flex items-center justify-center text-[var(--color-brand-tertiary)] shrink-0">
                <Brain size={24} />
              </div>
              <div className="flex flex-col pt-0.5 w-full">
                <h4 className="text-sm font-extrabold text-[var(--color-brand-text)]">Patologias Base</h4>
                <p className="text-xs text-[var(--color-brand-text-light)] mt-1 font-medium leading-relaxed">
                  {fichaAtual?.Patologias || 'Nenhuma patologia preenchida no sistema.'}
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-3 items-start border-t border-gray-50 mt-2 pt-4">
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
                <ClipboardEdit size={18} />
              </div>
              <div className="flex flex-col pt-0.5">
                <h4 className="text-[11px] font-extrabold text-[var(--color-brand-text-light)] uppercase tracking-wider">Avaliação Recente (Mês Atual)</h4>
                <p className="text-xs text-[var(--color-brand-text)] mt-0.5 font-bold">{ultimaAtt}</p>
              </div>
            </div>

          </div>
        </div>

        {/* Evolução Mensal (Histórico) Carrossel */}
        {historicoFichas.length > 0 && (
          <div className="flex flex-col gap-4 mt-2">
            <h3 className="font-extrabold text-[var(--color-brand-text)] text-sm ml-2">Evoluções Anteriores</h3>
            
            <div className="flex overflow-x-auto gap-4 pb-6 snap-x snap-mandatory hide-scrollbar -mx-5 px-5">
              {historicoFichas.map((f: any, idx: number) => {
                const dataHist = new Date(f.DataCriacao);
                const mes = dataHist.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
                const ano = dataHist.getFullYear();
                
                return (
                  <div key={idx} className="min-w-[280px] snap-center bg-white/80 backdrop-blur-md rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col gap-4">
                    
                    {/* Header do Card */}
                    <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-[1rem] bg-pink-50 flex items-center justify-center">
                          <span className="text-xs font-black text-pink-500 uppercase">{mes}</span>
                        </div>
                        <div className="flex flex-col">
                          <h4 className="text-sm font-extrabold text-gray-700">Avaliação</h4>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{ano}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end">
                        <span className="text-xs font-bold text-gray-400">Score</span>
                        <span className="text-lg font-black text-gray-700">{f.ScoreSaude || 0}</span>
                      </div>
                    </div>

                    {/* Resumo */}
                    <div className="flex flex-col gap-3">
                      <div>
                        <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-0.5">Intestino & Alimentação</p>
                        <p className="text-xs text-gray-600 font-semibold line-clamp-2">{f.FuncionamentoIntestinal || 'Não informado'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-0.5">Patologias</p>
                        <p className="text-xs text-gray-600 font-semibold line-clamp-2">{f.Patologias || 'Nenhuma informada'}</p>
                      </div>
                      {f.Observacoes && (
                        <div className="bg-blue-50/50 rounded-xl p-3 border border-blue-100/50 mt-1">
                          <p className="text-[9px] font-extrabold text-blue-400 uppercase tracking-wider mb-1">Anotações da Enfermagem</p>
                          <p className="text-[11px] text-blue-800 font-medium leading-relaxed line-clamp-3">{f.Observacoes}</p>
                        </div>
                      )}
                    </div>

                  </div>
                )
              })}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
