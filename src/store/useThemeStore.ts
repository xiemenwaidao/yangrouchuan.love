import { type PaletteMode } from "@mui/material";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { PALETTE_M0DE_STORAGE_KEY } from "~/config";

interface State {
    theme: PaletteMode | undefined;
}

interface Actions {
    setTheme: (theme: State["theme"]) => void;
}

export const useThemeStore = create(
    persist<State & Actions>(
        (set) => ({
            theme: undefined,
            setTheme: (theme) => set({ theme }),
        }),
        {
            name: PALETTE_M0DE_STORAGE_KEY,
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);
