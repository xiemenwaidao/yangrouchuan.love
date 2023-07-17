import { create } from "zustand";

interface State {
    isLoaded: boolean;
}
interface Actions {
    setIsLoaded: (isLoaded: State["isLoaded"]) => void;
}

export const useGoogleMapStore = create<State & Actions>((set) => ({
    isLoaded: false,
    setIsLoaded: (isLoaded) => set({ isLoaded }),
}));
