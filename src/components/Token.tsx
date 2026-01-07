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
  const mapScale = useGameStore((state) => state.mapScale);
  
  // Controle GM
  const isGM = useGameStore((state) => state.isGM);
  const gmTool = useGameStore((state) => state.gmTool);

  const isMe = player.id === activeSessionPlayerId;
  
  // Permissão de Arraste
  const canDrag = isGM && gmTool === 'select';

  // Motion Values (Coordenadas visuais)
  const x = useMotionValue(player.x);
  const y = useMotionValue(player.y);
  
  const [isDragging, setIsDragging] = useState(false);
  
  // Refs para guardar a posição inicial EXATA do clique
  const dragStartPos = useRef({ x: 0, y: 0 }); // Onde o mouse clicou (tela)
  const tokenStartPos = useRef({ x: 0, y: 0 }); // Onde o token estava (mapa)

  // Sincroniza posição com o banco de dados (se não estiver arrastando)
  useEffect(() => {
    if (!isDragging) {
      x.set(player.x);
      y.set(player.y);
    }
  }, [player.x, player.y, isDragging, x, y]);

  // --- HANDLERS DE ARRASTE ---

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!canDrag) return;
    
    e.stopPropagation();
    e.preventDefault();
    
    setIsDragging(true);
    
    // Salva o ponto de ancoragem inicial
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    tokenStartPos.current = { x: x.get(), y: y.get() };
    
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    e.stopPropagation();

    // CÁLCULO DE DESLOCAMENTO (OFFSET)
    // Calcula quanto o mouse andou desde o clique inicial e divide pelo zoom
    const deltaX = (e.clientX - dragStartPos.current.x) / mapScale;
    const deltaY = (e.clientY - dragStartPos.current.y) / mapScale;

    // Aplica na posição original do token
    x.set(tokenStartPos.current.x + deltaX);
    y.set(tokenStartPos.current.y + deltaY);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    e.stopPropagation();
    
    setIsDragging(false);
    (e.target as Element).releasePointerCapture(e.pointerId);

    // Salva no banco de dados
    updatePosition(player.id, x.get(), y.get());
  };

  return (
    <motion.div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      
      // CONFIGURAÇÃO CRÍTICA DO FRAMER MOTION
      style={{ x, y, touchAction: 'none' }}
      
      // Controlamos o Scale aqui para não brigar com o Translate
      animate={{ 
        scale: isDragging ? 1.2 : 1, // Aumenta ao arrastar
        zIndex: isDragging ? 100 : 50 // Fica por cima de todos ao arrastar
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      
      // Adicionado 'left-0 top-0' para garantir a origem correta do translate
      className={`absolute left-0 top-0 flex flex-col items-center cursor-grab active:cursor-grabbing ${
        canDrag ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
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
      <div className={`relative w-14 h-14 rounded-full border-2 ${player.color} shadow-[0_0_15px_rgba(0,0,0,0.8)] overflow-hidden bg-slate-900 group select-none`}>
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