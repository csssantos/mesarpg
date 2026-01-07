import { motion } from 'framer-motion';
import { useGameStore, type Player } from '../store/useGameStore';

interface TokenProps {
  player: Player;
}

export const Token = ({ player }: TokenProps) => {
  const updatePosition = useGameStore((state) => state.updatePosition);
  const activeSessionPlayerId = useGameStore((state) => state.activeSessionPlayerId);
  
  // Controle GM
  const isGM = useGameStore((state) => state.isGM);
  const gmTool = useGameStore((state) => state.gmTool);

  const isMe = player.id === activeSessionPlayerId;
  
  // LÓGICA DE PERMISSÃO:
  // O pino só é interativo se for GM e a ferramenta for 'select'
  const canDrag = isGM && gmTool === 'select';

  return (
    <motion.div
      drag={canDrag} 
      dragMomentum={false}
      initial={{ x: player.x, y: player.y }}
      onDragEnd={(_, info) => {
        if (canDrag) {
            updatePosition(player.id, player.x + info.offset.x, player.y + info.offset.y);
        }
      }}
      // CORREÇÃO CRÍTICA AQUI:
      // Paramos a propagação do clique. Se clicou no pino, o Mapa não fica sabendo.
      onPointerDown={(e) => {
        if (canDrag) {
          e.stopPropagation(); 
        }
      }}
      className={`absolute flex flex-col items-center z-50 ${canDrag ? 'cursor-move hover:scale-110 active:scale-95' : ''}`}
      
      // Sincronização suave
      animate={{ x: player.x, y: player.y }}
      transition={{ type: "spring", stiffness: 60, damping: 15 }}
      
      style={{ 
        // LÓGICA DE FANTASMA:
        // Se a ferramenta for CAMERA ('camera'), o pino ignora cliques (none).
        // Assim, você clica "através" dele para arrastar o mapa.
        // Se a ferramenta for SELECT ('select'), o pino recebe cliques (auto).
        pointerEvents: canDrag ? 'auto' : 'none' 
      }} 
    >
      {isMe && (
        <motion.div 
          initial={{ y: 0 }} 
          animate={{ y: -5 }} 
          transition={{ repeat: Infinity, repeatType: "reverse", duration: 1 }}
          className="mb-1 bg-yellow-400 text-black text-[10px] font-black px-2 py-0.5 rounded-full shadow-[0_0_10px_rgba(250,204,21,0.8)] border border-yellow-200 z-50"
        >
          VOCÊ
        </motion.div>
      )}

      <div className={`relative w-14 h-14 rounded-full border-2 ${player.color} shadow-[0_0_20px_rgba(0,0,0,0.8)] overflow-hidden bg-slate-900 group transition-transform`}>
        <img src={player.avatar} alt={player.name} className="w-full h-full object-cover" />
      </div>

      <span className={`mt-1 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-tighter backdrop-blur-sm border border-white/10 shadow-lg ${isMe ? 'bg-yellow-500/20 text-yellow-200' : 'bg-black/80 text-white'}`}>
        {player.name}
      </span>
    </motion.div>
  );
};