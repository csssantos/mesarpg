// src/App.tsx
import { useEffect } from 'react'; // <--- ADICIONE ESTA IMPORTAÇÃO AQUI
import { useGameStore } from './store/useGameStore';
import { MapBoard } from './components/MapBoard';
import { Sidebar } from './components/Sidebar';
import { GameMasterPanel } from './components/GameMasterPanel';
import { ClueJournal } from './components/ClueJournal';
import { CharacterSelectionPage } from './components/CharacterSelectionPage';
import "./App.css";

function App() {
  const isPlotTwistActive = useGameStore((state) => state.isPlotTwistActive);
  const activeSessionPlayerId = useGameStore((state) => state.activeSessionPlayerId);
  const connectToDB = useGameStore((state) => state.connectToDB);

  // Conectar ao Banco de Dados ao iniciar
  useEffect(() => {
    connectToDB();
  }, []);

  if (!activeSessionPlayerId) {
    return <CharacterSelectionPage />;
  }

  return (
    <div className={`bg-neutral-950 min-h-screen text-white font-sans transition-all duration-[3000ms] overflow-hidden ${isPlotTwistActive ? 'grayscale-0' : 'bg-slate-950'}`}>
      <Sidebar />
      <ClueJournal />
      <GameMasterPanel />
      
      <main className="pl-24 pr-4 py-4 h-screen relative">
        {!isPlotTwistActive && <div className="fog-overlay" />}

        <div className="absolute top-6 left-32 z-40 max-w-md pointer-events-none select-none">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 filter drop-shadow-lg">
            {isPlotTwistActive ? "Rodovia BR-101" : "Mistérios de Wychwood"}
          </h1>
          <p className="text-sm text-gray-300 mt-1 font-medium">
            {isPlotTwistActive ? "A Realidade se revela..." : "Sessão 01: O Despertar na Névoa"}
          </p>
        </div>

        <MapBoard />
      </main>
    </div>
  );
}

export default App;