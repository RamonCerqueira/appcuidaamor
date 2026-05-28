'use client';

import Header from '@/components/Header';
import { UserMinus, CalendarClock, Coffee, FileText, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';

type Cuidador = {
  id: number;
  nome: string;
  plantoes?: string[];
};

export default function Pedidos() {
  const [cuidadores, setCuidadores] = useState<Cuidador[]>([]);
  const [historico, setHistorico] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [activeModal, setActiveModal] = useState<'REMOVER' | 'ESCALA' | 'FOLGA' | 'OUTRA' | null>(null);
  const [selectedCuidador, setSelectedCuidador] = useState<number | null>(null);
  const [observacao, setObservacao] = useState('');
  const [datasFolga, setDatasFolga] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showObservacao, setShowObservacao] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    // Busca cuidadores ativos
    fetch('/api/cuidadores-ativos')
      .then(res => res.json())
      .then(json => {
        if (json.sucesso) setCuidadores(json.cuidadores);
      });

    // Busca histórico de solicitações
    fetch('/api/solicitacoes')
      .then(res => res.json())
      .then(json => {
        if (json.sucesso) setHistorico(json.solicitacoes);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSubmit = async () => {
    if (activeModal === 'REMOVER' && !selectedCuidador) return;
    if (activeModal === 'FOLGA' && (!selectedCuidador || datasFolga.length === 0)) return;
    if (activeModal === 'OUTRA' && !observacao) return;

    setSubmitting(true);

    const payload = {
      tipo: activeModal,
      cuidadorId: selectedCuidador,
      datasFolga,
      observacao
    };

    try {
      const res = await fetch('/api/solicitacoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      if (data.sucesso) {
        setSuccess(true);
        // Atualiza histórico localmente
        const novosHistoricos = [];
        if (activeModal === 'FOLGA') {
          datasFolga.forEach(df => {
            novosHistoricos.push({
              id: Math.random(), // id temporário
              tipo: activeModal,
              data: new Date().toISOString(),
              status: 'Em Análise',
              respostaAdmin: null
            });
          });
        } else {
          novosHistoricos.push({
            id: data.solicitacao?.Lanc || Math.random(),
            tipo: activeModal,
            data: new Date().toISOString(),
            status: 'Em Análise',
            respostaAdmin: null
          });
        }
        
        setHistorico([...novosHistoricos, ...historico]);
        
        setTimeout(() => {
          setSuccess(false);
          setActiveModal(null);
          resetForm();
        }, 2000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedCuidador(null);
    setObservacao('');
    setDatasFolga([]);
    setShowObservacao(false);
    setCurrentMonth(new Date());
  };

  const closeModal = () => {
    setActiveModal(null);
    resetForm();
  };

  const formatTipo = (tipo: string) => {
    switch(tipo) {
      case 'REMOVER': return 'Remover Cuidadora';
      case 'ESCALA': return 'Alterar Escala';
      case 'FOLGA': return 'Solicitar Folga';
      default: return 'Outra Solicitação';
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-brand-background)] w-full relative pb-24">
      <Header title="Solicitações" />

      <main className="flex-1 px-5 pt-6 flex flex-col gap-6">
        
        {/* Nova Solicitação Grid */}
        <section className="flex flex-col gap-3">
          <h3 className="text-xs font-extrabold text-gray-400 tracking-widest uppercase px-1">Nova Solicitação</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => setActiveModal('REMOVER')}
              className="bg-white rounded-3xl p-5 shadow-sm border border-gray-50 flex flex-col items-center justify-center gap-3 hover:bg-gray-50 active:scale-95 transition-all h-32"
            >
              <UserMinus size={28} className="text-red-500" />
              <span className="text-xs font-bold text-gray-700 text-center uppercase tracking-wider">Remover<br/>Cuidadora</span>
            </button>
            
            <button 
              onClick={() => setActiveModal('ESCALA')}
              className="bg-white rounded-3xl p-5 shadow-sm border border-gray-50 flex flex-col items-center justify-center gap-3 hover:bg-gray-50 active:scale-95 transition-all h-32"
            >
              <CalendarClock size={28} className="text-pink-500" />
              <span className="text-xs font-bold text-gray-700 text-center uppercase tracking-wider">Alterar<br/>Escala</span>
            </button>

            <button 
              onClick={() => setActiveModal('FOLGA')}
              className="bg-white rounded-3xl p-5 shadow-sm border border-gray-50 flex flex-col items-center justify-center gap-3 hover:bg-gray-50 active:scale-95 transition-all h-32"
            >
              <Coffee size={28} className="text-amber-500" />
              <span className="text-xs font-bold text-gray-700 text-center uppercase tracking-wider">Solicitar<br/>Folga</span>
            </button>

            <button 
              onClick={() => setActiveModal('OUTRA')}
              className="bg-white rounded-3xl p-5 shadow-sm border border-gray-50 flex flex-col items-center justify-center gap-3 hover:bg-gray-50 active:scale-95 transition-all h-32"
            >
              <FileText size={28} className="text-emerald-500" />
              <span className="text-xs font-bold text-gray-700 text-center uppercase tracking-wider">Outra<br/>Solicitação</span>
            </button>
          </div>
        </section>

        {/* Histórico */}
        <section className="flex flex-col gap-3 mt-4">
          <h3 className="text-xs font-extrabold text-gray-400 tracking-widest uppercase px-1">Histórico de Solicitações</h3>
          
          <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 flex flex-col overflow-hidden min-h-[120px]">
            {loading ? (
              <div className="p-8 text-center text-sm font-bold text-gray-400 animate-pulse">Carregando histórico...</div>
            ) : historico.length > 0 ? (
              historico.map((hist, index) => {
                const date = new Date(hist.data);
                const dataFormatada = !isNaN(date.getTime()) ? `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')} às ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}` : '';

                const getStatusColor = (status: string) => {
                  switch(status?.toUpperCase()) {
                    case 'ACEITO': return 'bg-green-50 text-green-600 border-green-100';
                    case 'RECUSADO': return 'bg-red-50 text-red-600 border-red-100';
                    default: return 'bg-amber-50 text-amber-600 border-amber-100';
                  }
                };

                return (
                  <div key={index} className="p-5 flex flex-col gap-3 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <h4 className="text-sm font-extrabold text-[var(--color-brand-text)]">{formatTipo(hist.tipo)}</h4>
                        <p className="text-xs text-[var(--color-brand-text-light)] mt-1 font-medium">{dataFormatada}</p>
                      </div>
                      <div className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest border ${getStatusColor(hist.status)}`}>
                        {hist.status}
                      </div>
                    </div>
                    {hist.respostaAdmin && (
                      <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 mt-1">
                        <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Resposta da Administração:</p>
                        <p className="text-xs text-gray-700 font-medium">{hist.respostaAdmin}</p>
                      </div>
                    )}
                  </div>
                )
              })
            ) : (
              <div className="p-10 flex items-center justify-center text-sm font-bold text-gray-400 text-center">
                Nenhuma solicitação<br/>realizada ainda.
              </div>
            )}
          </div>
        </section>

      </main>

      {/* MODAL */}
      {activeModal && (
        <div className="fixed inset-0 z-[999] flex items-end justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-t-[2rem] p-6 pb-28 flex flex-col gap-6 animate-in slide-in-from-bottom-8 duration-300">
            
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-xl text-[var(--color-brand-text)]">{formatTipo(activeModal)}</h3>
              <button onClick={closeModal} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 font-bold hover:bg-gray-200">✕</button>
            </div>

            {success ? (
              <div className="flex flex-col items-center justify-center py-10 gap-4">
                <CheckCircle2 size={64} className="text-green-500" />
                <h4 className="font-bold text-lg text-gray-800">Solicitação Enviada!</h4>
                <p className="text-sm text-gray-500 text-center">Nossa equipe analisará o seu pedido em breve.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                
                {/* Cuidador Dropdown (REMOVER e FOLGA) */}
                {(activeModal === 'REMOVER' || activeModal === 'FOLGA') && (
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Qual cuidador?</label>
                    <select 
                      className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-2xl px-4 py-3 font-semibold focus:outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100"
                      value={selectedCuidador || ''}
                      onChange={(e) => setSelectedCuidador(Number(e.target.value))}
                    >
                      <option value="" disabled>Selecione um profissional</option>
                      {cuidadores.map(c => (
                        <option key={c.id} value={c.id}>{c.nome}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Data Picker (FOLGA) */}
                {activeModal === 'FOLGA' && (
                  <div className="flex flex-col gap-2 mt-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Selecione um ou mais dias no Calendário
                    </label>
                    
                    {!selectedCuidador ? (
                      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center text-sm font-semibold text-gray-400">
                        Selecione um cuidador acima para ver as datas escaladas.
                      </div>
                    ) : (
                      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-4">
                        {/* Header do Calendário */}
                        <div className="flex justify-between items-center mb-4 px-2">
                          <button 
                            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600 font-bold"
                          >
                            &lt;
                          </button>
                          <span className="font-extrabold text-gray-700 capitalize">
                            {currentMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                          </span>
                          <button 
                            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600 font-bold"
                          >
                            &gt;
                          </button>
                        </div>
                        
                        {/* Dias da semana */}
                        <div className="grid grid-cols-7 gap-1 mb-2">
                          {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
                            <div key={i} className="text-center text-[10px] font-extrabold text-gray-400">{d}</div>
                          ))}
                        </div>

                        {/* Grid de Dias */}
                        <div className="grid grid-cols-7 gap-1">
                          {(() => {
                            const plantoesCuidador = cuidadores.find(c => c.id === selectedCuidador)?.plantoes || [];
                            const plantoesDates = plantoesCuidador.map(p => {
                              const d = new Date(p);
                              return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
                            });

                            const year = currentMonth.getFullYear();
                            const month = currentMonth.getMonth();
                            const firstDay = new Date(year, month, 1).getDay();
                            const daysInMonth = new Date(year, month + 1, 0).getDate();
                            
                            const days = [];
                            // Espaços vazios
                            for (let i = 0; i < firstDay; i++) {
                              days.push(<div key={`empty-${i}`} className="h-10"></div>);
                            }
                            
                            // Dias do mês
                            for (let d = 1; d <= daysInMonth; d++) {
                              const date = new Date(year, month, d);
                              const isPlantao = plantoesDates.includes(date.getTime());
                              
                              // Check if it's the selected datasFolga
                              const dateIso = date.toISOString();
                              const isSelected = datasFolga.includes(dateIso);

                              let className = "h-10 flex items-center justify-center rounded-full text-sm font-bold transition-all ";
                              
                              if (isSelected) {
                                className += "bg-pink-500 text-white shadow-md shadow-pink-500/30 scale-110";
                              } else if (isPlantao) {
                                className += "bg-pink-50 text-pink-500 cursor-pointer hover:bg-pink-100";
                              } else {
                                className += "text-gray-300";
                              }

                              days.push(
                                <button
                                  key={d}
                                  disabled={!isPlantao}
                                  onClick={() => {
                                    if (!isPlantao) return;
                                    if (isSelected) {
                                      setDatasFolga(datasFolga.filter(iso => iso !== dateIso));
                                    } else {
                                      setDatasFolga([...datasFolga, dateIso]);
                                    }
                                  }}
                                  className={className}
                                >
                                  {d}
                                </button>
                              );
                            }
                            return days;
                          })()}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Observacao Collapsible (TODOS) */}
                <div className="flex flex-col mt-2">
                  <button 
                    onClick={() => setShowObservacao(!showObservacao)}
                    className="text-pink-500 text-sm font-bold text-left flex items-center gap-1 hover:text-pink-600 transition-colors py-2"
                  >
                    {showObservacao ? 'Ocultar observação' : '+ Adicionar observação (opcional)'}
                  </button>
                  
                  {showObservacao && (
                    <div className="flex flex-col gap-2 mt-2 animate-in slide-in-from-top-2 duration-200">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                        {activeModal === 'REMOVER' ? 'Motivo da remoção' : 'Descreva a solicitação'}
                      </label>
                      <textarea 
                        rows={3}
                        placeholder="Digite aqui os detalhes..."
                        className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-2xl px-4 py-3 font-medium focus:outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100 resize-none"
                        value={observacao}
                        onChange={(e) => setObservacao(e.target.value)}
                      />
                    </div>
                  )}
                </div>

                <button 
                  onClick={handleSubmit}
                  disabled={submitting || 
                    (activeModal === 'REMOVER' && !selectedCuidador) || 
                    (activeModal === 'FOLGA' && (!selectedCuidador || datasFolga.length === 0)) || 
                    (activeModal === 'OUTRA' && !observacao)
                  }
                  className="w-full bg-pink-500 text-white rounded-2xl py-4 font-bold mt-4 shadow-lg shadow-pink-500/30 active:scale-95 transition-all disabled:opacity-50 disabled:shadow-none"
                >
                  {submitting ? 'Enviando...' : 'Enviar Solicitação'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
