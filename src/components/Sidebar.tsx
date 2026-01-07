// src/components/Sidebar.tsx
import { Users, Scroll, Settings, Skull } from 'lucide-react';
import { useGameStore } from '../store/useGameStore'; // <--- Importação necessária

export const Sidebar = () => {
  // 1. O HOOK FICA AQUI (Dentro da função, no topo)
  const activatePlotTwist = useGameStore((state) => state.activatePlotTwist);
  const isPlotTwistActive = useGameStore((state) => state.isPlotTwistActive);

  return (
    <aside className="fixed left-4 top-4 bottom-4 w-20 flex flex-col items-center py-6 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl z-50 text-white gap-8 shadow-2xl">
      
      {/* Logo / Botão do Plot Twist (Agora funcional) */}
      <div 
        onClick={activatePlotTwist} // Ativa o Plot Twist ao clicar na Caveira
        className={`p-3 rounded-xl cursor-pointer transition-all duration-500 ${
          isPlotTwistActive 
            ? 'bg-red-600 hover:bg-red-700 animate-pulse' // Fica vermelho na pista
            : 'bg-purple-600 hover:bg-purple-500' // Fica roxo na floresta
        }`}
        title="Revelar a Verdade (Plot Twist)"
      >
        <Skull size={24} className={isPlotTwistActive ? "text-black" : "text-white"} />
      </div>

      {/* Menu Actions */}
      <nav className="flex flex-col gap-6 w-full items-center flex-1">
        <button className="group relative p-2 hover:bg-white/10 rounded-lg transition-all">
          <Users size={20} className="text-gray-300 group-hover:text-white" />
          <span className="absolute left-14 bg-black px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Jogadores
          </span>
        </button>
        
        <button className="group relative p-2 hover:bg-white/10 rounded-lg transition-all">
          <Scroll size={20} className="text-gray-300 group-hover:text-white" />
          <span className="absolute left-14 bg-black px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Missões
          </span>
        </button>
      </nav>

      {/* Configurações */}
      <button className="p-2 hover:bg-white/10 rounded-lg transition-all">
        <Settings size={20} />
      </button>
    </aside>
  );
};