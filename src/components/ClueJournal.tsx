import { useGameStore } from '../store/useGameStore';
import { motion, AnimatePresence } from 'framer-motion';

export const ClueJournal = () => {
  const clues = useGameStore((state) => state.discoveredClues);

  return (
    <div className="fixed right-6 top-6 w-72 z-40 pointer-events-none flex flex-col gap-4">
      {clues.length > 0 && (
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 text-right bg-black/50 p-1 rounded inline-self-end">
          Diário de Evidências
        </h3>
      )}
      
      <div className="flex flex-col gap-3 items-end">
        <AnimatePresence>
          {clues.map((clue, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="p-4 bg-white/10 backdrop-blur-md border-l-4 border-rpg-accent rounded-r-lg rounded-l-none pointer-events-auto shadow-2xl max-w-full text-right"
            >
              <p className="text-sm italic text-gray-200 leading-relaxed">"{clue}"</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};