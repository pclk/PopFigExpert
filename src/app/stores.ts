import {create} from 'zustand'

export const useUserInput = create<{
  userInput: string;
  setUserInput: (userInput: string) => void;
}>((set) => ({
  userInput: "",
  setUserInput: (userInput) => set({ userInput }),
}));