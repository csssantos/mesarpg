import { create } from 'zustand';
import { db } from '../firebaseConfig';
import { ref, onValue, set, update } from 'firebase/database';

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

  // Câmera
  mapScale: number;
  mapPosition: { x: number, y: number };

  // Actions Locais (Só mudam minha sessão)
  startGameAs: (playerId: string) => void;
  toggleGM: () => void;
  setGmTool: (tool: 'camera' | 'select') => void;

  // Actions Remotas (Mudam no Firebase e refletem para todos)
  updatePosition: (id: string, x: number, y: number) => void;
  activatePlotTwist: () => void;
  addClue: (clue: string) => void;
  updateMapState: (scale: number, position: { x: number, y: number }) => void;
  
  // Inicializador da Conexão
  connectToDB: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  // Estado Inicial Padrão
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
  mapScale: 0.4,
  mapPosition: { x: 0, y: 0 },

  // --- ACTIONS LOCAIS ---
  startGameAs: (playerId) => set({ activeSessionPlayerId: playerId }),
  toggleGM: () => set((state) => ({ isGM: !state.isGM })),
  setGmTool: (tool) => set({ gmTool: tool }),

  // --- CONEXÃO (OUVINTE) ---
  connectToDB: () => {
    const gameRef = ref(db, 'game-session-01'); // Sala do jogo

    // Ouve qualquer mudança no Firebase e atualiza o Zustand Local
    onValue(gameRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Atualiza apenas o que veio do banco, mantendo o que é sessão local (como activeSessionPlayerId)
        set((state) => ({
          ...state,
          players: data.players || state.players,
          isPlotTwistActive: data.isPlotTwistActive ?? state.isPlotTwistActive,
          discoveredClues: data.discoveredClues || [],
          mapScale: data.mapScale ?? state.mapScale,
          mapPosition: data.mapPosition ?? state.mapPosition
        }));
      } else {
        // Se o banco estiver vazio (primeira vez), salva o estado inicial lá
        set(ref(db, 'game-session-01'), {
          players: get().players,
          isPlotTwistActive: false,
          discoveredClues: [],
          mapScale: 0.4,
          mapPosition: { x: 0, y: 0 }
        });
      }
    });
  },

  // --- ACTIONS REMOTAS (ESCRITA) ---
  
  updatePosition: (id, x, y) => {
    // 1. Atualiza Localmente (Otimista) para não travar a UI
    const newPlayers = get().players.map((p) => (p.id === id ? { ...p, x, y } : p));
    set({ players: newPlayers });

    // 2. Envia para o Firebase
    // Nota: Estamos salvando o array inteiro de players para simplificar. 
    // Num app grande, atualizaríamos apenas `players/index/x`.
    update(ref(db, 'game-session-01'), { players: newPlayers });
  },

  activatePlotTwist: () => {
    update(ref(db, 'game-session-01'), { isPlotTwistActive: true });
  },

  addClue: (clue) => {
    const newClues = [...get().discoveredClues, clue];
    update(ref(db, 'game-session-01'), { discoveredClues: newClues });
  },

  updateMapState: (scale, position) => {
    // Atualiza local rápido
    set({ mapScale: scale, mapPosition: position });
    
    // Envia para DB
    update(ref(db, 'game-session-01'), { 
      mapScale: scale, 
      mapPosition: position 
    });
  }
}));