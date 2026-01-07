import { useGameStore } from '../store/useGameStore';
import { Volume2, Eye, FileText, Lock, Unlock, Move, Hand } from 'lucide-react';

export const GameMasterPanel = () => {
  const addClue = useGameStore((state) => state.addClue);
  const activatePlotTwist = useGameStore((state) => state.activatePlotTwist);
  const isPlotTwistActive = useGameStore((state) => state.isPlotTwistActive);
  
  // Controle do Modo GM e Ferramentas
  const isGM = useGameStore((state) => state.isGM);
  const toggleGM = useGameStore((state) => state.toggleGM);
  const gmTool = useGameStore((state) => state.gmTool);
  const setGmTool = useGameStore((state) => state.setGmTool);

  const playDisturbance = () => {
    const audio = new Audio('https://www.soundjay.com/transportation/tire-skid-01.mp3'); 
    audio.volume = 0.5;
    audio.play().catch(console.error);
    alert("🔊 SOM: Estrondo Alto enviado para todos!");
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-50">
      
      {/* 1. Toggle MESTRE GERAL (Cadeado) */}
      <button 
        onClick={toggleGM}
        className={`px-4 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-2 shadow-lg ${
          isGM ? 'bg-yellow-500 text-black animate-pulse' : 'bg-gray-900 text-gray-500 border border-gray-700'
        }`}
      >
        {isGM ? <Unlock size={12} /> : <Lock size={12} />}
        {isGM ? "MODO MESTRE ATIVO" : "MODO JOGADOR"}
      </button>

      {/* PAINEL DE FERRAMENTAS (Só aparece se for GM) */}
      {isGM && (
        <div className="glass-panel p-2 rounded-2xl flex gap-3 items-center bg-black/90 border border-yellow-500/30 shadow-[0_0_30px_rgba(234,179,8,0.2)]">
          
          {/* SELEÇÃO DE FERRAMENTA (Exclusiva) */}
          <div className="flex bg-white/10 rounded-lg p-1 gap-1">
            <button
              onClick={() => setGmTool('camera')}
              className={`p-2 rounded transition-all ${gmTool === 'camera' ? 'bg-yellow-500 text-black shadow' : 'text-gray-400 hover:text-white'}`}
              title="Mover Mapa (Pan)"
            >
              <Hand size={20} />
            </button>
            <button
              onClick={() => setGmTool('select')}
              className={`p-2 rounded transition-all ${gmTool === 'select' ? 'bg-yellow-500 text-black shadow' : 'text-gray-400 hover:text-white'}`}
              title="Mover Pinos (Select)"
            >
              <Move size={20} />
            </button>
          </div>

          <div className="w-px h-8 bg-gray-700 mx-1"></div>

          {/* AÇÕES GLOBAIS */}
          <button onClick={playDisturbance} className="p-2 hover:bg-red-500/20 text-red-400 rounded transition-colors relative group" title="Som">
            <Volume2 size={20} />
          </button>

          <button onClick={() => addClue("Uma pegada de lama aponta para o centro...")} className="p-2 hover:bg-blue-500/20 text-blue-400 rounded transition-colors" title="Pista">
            <FileText size={20} />
          </button>

          <button 
            onClick={activatePlotTwist}
            disabled={isPlotTwistActive}
            className={`p-2 rounded transition-colors ${isPlotTwistActive ? 'text-green-500 bg-green-900/20' : 'hover:bg-purple-500/20 text-purple-400'}`}
            title="Revelar Mapa"
          >
            <Eye size={20} />
          </button>
        </div>
      )}
    </div>
  );
};