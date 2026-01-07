// src/components/MapBoard.tsx
import { useState, useRef } from 'react';
import { useGameStore } from '../store/useGameStore';
import { Token } from './Token';
import mapa from "../assets/img/mapa.png";

export const MapBoard = () => {
  const players = useGameStore((state) => state.players);
  const isPlotTwistActive = useGameStore((state) => state.isPlotTwistActive);
  
  // Controle GM e Câmera Global
  const isGM = useGameStore((state) => state.isGM);
  const gmTool = useGameStore((state) => state.gmTool);
  const mapScale = useGameStore((state) => state.mapScale);
  const mapPosition = useGameStore((state) => state.mapPosition);
  const updateMapState = useGameStore((state) => state.updateMapState);

  // Controle local APENAS para o arraste (delta)
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);

  // --- LÓGICA DE ZOOM (Só GM) ---
  const handleWheel = (e: React.WheelEvent) => {
    if (!isGM) return;
    e.stopPropagation();
    const zoomSensitivity = 0.001;
    const newScale = Math.min(Math.max(0.2, mapScale - e.deltaY * zoomSensitivity), 4);
    updateMapState(newScale, mapPosition);
  };

  // --- LÓGICA DE INÍCIO DE ARRASTE ---
  const handleMouseDown = (e: React.MouseEvent) => {
    const canDragMap = isGM && gmTool === 'camera';
    if (e.button === 0 && canDragMap) { 
      setIsDragging(true);
      setLastMousePos({ x: e.clientX, y: e.clientY });
    }
  };

  // --- LÓGICA DE MOVIMENTO ---
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - lastMousePos.x;
    const deltaY = e.clientY - lastMousePos.y;
    const newPosition = {
      x: mapPosition.x + deltaX,
      y: mapPosition.y + deltaY,
    };
    setLastMousePos({ x: e.clientX, y: e.clientY });
    updateMapState(mapScale, newPosition);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const getCursorStyle = () => {
    if (isGM) {
      if (gmTool === 'camera') return isDragging ? 'cursor-grabbing' : 'cursor-grab';
      return 'cursor-default';
    }
    return 'cursor-default'; 
  };

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden bg-[#050505] ${getCursorStyle()}`}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* O Mundo (Container Transformável) */}
      <div 
        className="absolute w-full h-full flex justify-center items-center transform-gpu will-change-transform"
        style={{
          transition: isDragging ? 'none' : 'transform 0.1s linear', 
          transform: `translate(${mapPosition.x}px, ${mapPosition.y}px) scale(${mapScale})`,
          transformOrigin: 'center center'
        }}
      >
        {/* A Caixa do Mapa */}
        <div 
          // ADICIONADO: flex-none para impedir que telas pequenas esmaguem o mapa
          className="relative shadow-2xl shadow-black flex-none"
          style={{ width: '2500px', height: '1536px' }}
        >
          {/* Fundo do Mapa (Imagem) */}
          <div 
            // ALTERADO: Removemos 'bg-cover' e usamos style direto para garantir que não corte
            className="absolute inset-0 bg-no-repeat bg-center rounded-lg"
            style={{ 
              backgroundImage: isPlotTwistActive 
                ? "url('https://images.unsplash.com/photo-1519003722824-194d4455a60c?q=80&w=2075')" 
                : `url(${mapa})`,
              // MUDANÇA CRÍTICA: '100% 100%' força a imagem a caber na caixa inteira sem cortar nada
              backgroundSize: '100% 100%', 
              filter: isPlotTwistActive ? 'none' : 'contrast(1.1) brightness(0.8) saturate(0.8)'
            }}
          />

          {/* Tokens */}
          {players.map((player) => (
            <Token key={player.id} player={player} />
          ))}
        </div>
      </div>

      {/* HUD Zoom */}
      <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-50 pointer-events-none">
        <div className="bg-black/60 backdrop-blur text-white text-xs px-2 py-1 rounded border border-white/10 pointer-events-auto shadow-lg">
          Cam: {Math.round(mapScale * 100)}%
        </div>
      </div>
      
      {/* Vinheta Estática */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_80%,rgba(0,0,0,1)_100%)] z-40" />
    </div>
  );
};