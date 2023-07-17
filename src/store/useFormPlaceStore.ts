import { create } from "zustand";

interface State {
    placeId: string;
    title: string;
    address: string;
    lat: number | null;
    lng: number | null;
}

interface Actions {
    setPlaceDetails: (data: {
        placeId: State["placeId"];
        title: State["title"];
        address: State["address"];
        lat: State["lat"];
        lng: State["lng"];
    }) => void;
    removePlaceDetails: () => void;
}

/** 投稿・編集用 */
export const useFormPlaceStore = create<State & Actions>((set) => ({
    placeId: "",
    title: "",
    address: "",
    lat: null,
    lng: null,
    setPlaceDetails: ({ placeId, title, address, lat, lng }) =>
        set({ placeId, title, address, lat, lng }),
    removePlaceDetails: () =>
        set({ placeId: "", title: "", address: "", lat: null, lng: null }),
}));
