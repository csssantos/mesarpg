import { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { useGameStore, type Player } from '../store/useGameStore';

interface TokenProps {
  player: Player;
}

export const Token = ({ player }: TokenProps) => {
  // Estado Global
  const updatePosition = useGameStore((state) => state.updatePosition);
  const activeSessionPlayerId = useGameStore((state) => state.activeSessionPlayerId);
  const mapScale = useGameStore((state) => state.mapScale); // <--- Precisamos do Scale para corrigir o movimento
  
  // Controle GM
  const isGM = useGameStore((state) => state.isGM);
  const gmTool = useGameStore((state) => state.gmTool);

  const isMe = player.id === activeSessionPlayerId;
  const canDrag = isGM && gmTool === 'select';

  // --- LÓGICA DE MOVIMENTO MANUAL (Correção do Zoom) ---
  // Usamos MotionValues para performance (não re-renderiza o React a cada pixel)
  const x = useMotionValue(player.x);
  const y = useMotionValue(player.y);
  
  const [isDragging, setIsDragging] = useState(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  // Sincroniza posição se o servidor/outro player atualizar (e se não estiver arrastando)
  useEffect(() => {
    if (!isDragging) {
      x.set(player.x);
      y.set(player.y);
    }
  }, [player.x, player.y, isDragging]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!canDrag) return;
    
    e.stopPropagation(); // Impede que o Mapa se mova
    e.preventDefault();  // Impede seleção de texto/imagem
    
    setIsDragging(true);
    lastMousePos.current = { x: e.clientX, y: e.clientY };
    
    // Trava o ponteiro no elemento (opcional, mas ajuda em navegadores modernos)
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    e.stopPropagation();

    // CÁLCULO MÁGICO: Divide o movimento pelo Zoom (mapScale)
    // Se o zoom é 2x, o movimento do mouse vale metade.
    // Se o zoom é 0.5x, o movimento vale o dobro.
    const deltaX = (e.clientX - lastMousePos.current.x) / mapScale;
    const deltaY = (e.clientY - lastMousePos.current.y) / mapScale;

    x.set(x.get() + deltaX);
    y.set(y.get() + deltaY);

    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    e.stopPropagation();
    
    setIsDragging(false);
    (e.target as Element).releasePointerCapture(e.pointerId);

    // Salva a posição final no estado global (Servidor)
    updatePosition(player.id, x.get(), y.get());
  };

  return (
    <motion.div
      // Removemos o 'drag' nativo do framer-motion pois ele buga com scale
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      
      // Animação suave (Spring) apenas visualmente
      style={{ x, y, touchAction: 'none' }} 
      
      className={`absolute flex flex-col items-center z-50 transition-shadow ${
        canDrag ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none'
      } ${isDragging ? 'scale-110 z-[100]' : 'z-50'}`} // Aumenta um pouco ao arrastar
    >
      {/* Indicador VOCÊ */}
      {isMe && (
        <motion.div 
          initial={{ y: 0 }} 
          animate={{ y: -5 }} 
          transition={{ repeat: Infinity, repeatType: "reverse", duration: 1 }}
          className="mb-1 bg-yellow-400 text-black text-[10px] font-black px-2 py-0.5 rounded-full shadow-[0_0_10px_rgba(250,204,21,0.8)] border border-yellow-200"
        >
          VOCÊ
        </motion.div>
      )}

      {/* Avatar do Pino */}
      <div className={`relative w-14 h-14 rounded-full border-2 ${player.color} shadow-[0_0_15px_rgba(0,0,0,0.8)] overflow-hidden bg-slate-900 group select-none pointer-events-none`}>
        <img src={player.avatar} alt={player.name} className="w-full h-full object-cover" draggable={false} />
        {/* Efeito Hover interno */}
        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors"></div>
      </div>

      {/* Nome */}
      <span className={`mt-1 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-tighter backdrop-blur-sm border border-white/10 shadow-lg select-none ${isMe ? 'bg-yellow-500/20 text-yellow-200' : 'bg-black/80 text-white'}`}>
        {player.name}
      </span>
    </motion.div>
  );
};