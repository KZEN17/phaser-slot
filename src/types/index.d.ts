// Type definitions for our slot game
import SymbolObject from '../components/Symbol';

// Win line definition
export interface WinLine {
  indexes: number[];  // Symbol indexes to check
  color: number;      // Line color for visualization
}

// Win result definition
export interface Win {
  line: number;       // Index of winning pay line
  symbols: SymbolObject[];  // Symbols in the winning line - changed from Symbol to SymbolObject
  amount: number;     // Win amount
}

// Symbol value definition
export interface SymbolValues {
  [key: string]: number;
}

// Reel stop information
export interface ReelStop {
  reel: number;       // Reel index
  outcome: string[];  // Symbol outcomes
}