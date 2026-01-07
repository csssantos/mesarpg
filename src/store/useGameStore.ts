import { create } from 'zustand';

const gameChannel = new BroadcastChannel('wychwood_game_sync');

export type PlayerStatus = 'alive' | 'dead' | 'insane' | 'unknown';

export interface Player {
  id: string;
  name: string;
  role: string;
  avatar: string;
  x: number;
  y: number;
  color: string;
  status: PlayerStatus;
}

interface GameState {
  players: Player[];
  activeSessionPlayerId: string | null;
  isPlotTwistActive: boolean;
  discoveredClues: string[];
  
  // Controle do Mestre
  isGM: boolean;
  gmTool: 'camera' | 'select';

  // ESTADO DA CÂMERA (Novo)
  mapScale: number;
  mapPosition: { x: number, y: number };

  // Actions
  startGameAs: (playerId: string) => void;
  updatePosition: (id: string, x: number, y: number) => void;
  activatePlotTwist: () => void;
  addClue: (clue: string) => void;
  toggleGM: () => void;
  setGmTool: (tool: 'camera' | 'select') => void;
  
  // Action para mover a câmera
  updateMapState: (scale: number, position: { x: number, y: number }) => void;
  
  syncState: (newState: Partial<GameState>) => void;
}

export const useGameStore = create<GameState>((set, get) => {
  
  gameChannel.onmessage = (event) => {
    const { type, payload } = event.data;
    if (type === 'SYNC_UPDATE') {
      set(payload);
    }
  };

  const broadcastUpdate = (updates: Partial<GameState>) => {
    gameChannel.postMessage({ type: 'SYNC_UPDATE', payload: updates });
  };

  return {
    players: [
      { id: '1', name: 'Investigador Alex', role: 'O Cético', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=P1&backgroundColor=b6e3f4', x: 750, y: 500, color: 'border-blue-500 shadow-blue-500/50', status: 'alive' },
      { id: '2', name: 'Beatriz & Carla', role: 'As Perdidas', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=P2&backgroundColor=c0aede', x: 200, y: 650, color: 'border-purple-500 shadow-purple-500/50', status: 'alive' },
      { id: '3', name: 'Daniel (Acampado)', role: 'O Sobrevivente', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=P4&backgroundColor=d1d4f9', x: 400, y: 250, color: 'border-green-500 shadow-green-500/50', status: 'alive' },
      { id: '4', name: 'Edu & Fernanda', role: 'Os Turistas', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=P5&backgroundColor=ffd5dc', x: 800, y: 100, color: 'border-red-500 shadow-red-500/50', status: 'alive' },
      { id: '5', name: 'Guia Gustavo', role: 'O Local', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=P6&backgroundColor=ffdfbf', x: 150, y: 150, color: 'border-yellow-500 shadow-yellow-500/50', status: 'unknown' },
      { id: '6', name: 'Helena', role: 'A Fotógrafa', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=P7&backgroundColor=c0aede', x: 600, y: 700, color: 'border-cyan-500 shadow-cyan-500/50', status: 'alive' },
    ],
    activeSessionPlayerId: null,
    isPlotTwistActive: false,
    discoveredClues: [],
    
    isGM: false,
    gmTool: 'camera',

    // Câmera começa centralizada e com zoom out
    mapScale: 0.4,
    mapPosition: { x: 0, y: 0 },

    startGameAs: (playerId) => set({ activeSessionPlayerId: playerId }),
    
    updatePosition: (id, x, y) => {
      const newPlayers = get().players.map((p) => (p.id === id ? { ...p, x, y } : p));
      set({ players: newPlayers });
      broadcastUpdate({ players: newPlayers });
    },
    
    activatePlotTwist: () => {
      set({ isPlotTwistActive: true });
      broadcastUpdate({ isPlotTwistActive: true });
    },

    addClue: (clue) => {
      const newClues = [...get().discoveredClues, clue];
      set({ discoveredClues: newClues });
      broadcastUpdate({ discoveredClues: newClues });
    },

    toggleGM: () => set((state) => ({ isGM: !state.isGM })),
    
    setGmTool: (tool) => set({ gmTool: tool }),

    // Atualiza a câmera e avisa todo mundo
    updateMapState: (scale, position) => {
      set({ mapScale: scale, mapPosition: position });
      broadcastUpdate({ mapScale: scale, mapPosition: position });
    },

    syncState: (newState) => set(newState),
  };
});