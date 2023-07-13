import { create } from "zustand";

interface State {
    placeId: string;
    title: string;
    address: string;
}

interface Actions {
    setPlaceDetails: (data: {
        placeId: State["placeId"];
        title: State["title"];
        address: State["address"];
    }) => void;
    removePlaceDetails: () => void;
}

/** 投稿・編集用 */
export const useGoogleMapStore = create<State & Actions>((set) => ({
    placeId: "",
    title: "",
    address: "",
    setPlaceDetails: ({ placeId, title, address }) =>
        set({ placeId, title, address }),
    removePlaceDetails: () => set({ placeId: "", title: "", address: "" }),
}));
