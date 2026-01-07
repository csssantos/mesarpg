// src/components/CharacterSelectionPage.tsx
import { useGameStore } from '../store/useGameStore';
import { motion, type Variants } from 'framer-motion';
import mapa from "../assets/img/mapa.png" // <--- CORREÇÃO AQUI: adicione 'type'
import { Skull } from 'lucide-react';

// O restante do arquivo continua igual...
const containerVariants: Variants = { 
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.5,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    transition: { type: "spring", stiffness: 100 } 
  },
};

export const CharacterSelectionPage = () => {
  const players = useGameStore((state) => state.players);
  const startGameAs = useGameStore((state) => state.startGameAs);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-rpg-dark flex flex-col items-center justify-center font-sans">
      
      {/* --- FUNDO COM OVERLAY E BLUR --- */}
      <div className="absolute inset-0 z-0">
        <img 
          src={mapa}
          alt="Background Map" 
          className="w-full h-full object-cover blur-md scale-105 opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/60" />
        <div className="absolute inset-0 fog-overlay opacity-30" />
      </div>

      {/* --- CONTEÚDO --- */}
      <div className="relative z-10 container mx-auto px-4 flex flex-col items-center">
        
        {/* Título Animado */}
        <motion.div 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4 text-purple-500 animate-pulse">
            <Skull size={32} />
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-rpg-accent to-red-500 tracking-tighter drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]">
            Mistérios de Wychwood
          </h1>
          <p className="text-gray-400 text-lg mt-4 max-w-xl mx-auto leading-relaxed">
            A névoa densa cobre a floresta. Ninguém se lembra de como chegou aqui. <br/>
            <span className="text-white font-semibold">Quem você será nesta história?</span>
          </p>
        </motion.div>

        {/* Grid de Personagens */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl w-full"
        >
          {players.map((player) => (
            <motion.div
              key={player.id}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.05, 
                translateY: -10,
                boxShadow: "0 20px 30px -10px rgba(0, 0, 0, 0.5)"
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => startGameAs(player.id)}
              className={`group relative cursor-pointer overflow-hidden rounded-2xl border-2 ${player.color.split(' ')[0]} bg-black/40 backdrop-blur-xl p-1 flex flex-col items-center transition-colors duration-300 hover:bg-white/10 hover:border-white/40`}
            >
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-t ${player.color.replace('border', 'from').split(' ')[0]} to-transparent`}></div>

              <div className="relative z-10 flex flex-col items-center w-full p-4">
                <div className={`w-24 h-24 md:w-32 md:h-32 rounded-full border-4 ${player.color} shadow-2xl mb-4 overflow-hidden bg-black`}>
                    <img src={player.avatar} alt={player.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-1">{player.name}</h3>
                <p className="text-sm text-rpg-accent uppercase tracking-widest font-semibold">{player.role}</p>
                
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  className="mt-6 px-6 py-2 rounded-full bg-white/10 text-sm font-bold text-white group-hover:bg-rpg-accent transition-all opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 duration-300"
                >
                  SELECIONAR
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};