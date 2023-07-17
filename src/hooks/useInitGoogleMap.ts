import { useLoadScript } from "@react-google-maps/api";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { libraries } from "~/config";
import { env } from "~/env.mjs";
import { useGoogleMapStore } from "~/store/useGoogleMapStore";

const useInitGoogleMap = () => {
    const setIsLoaded = useGoogleMapStore((state) => state.setIsLoaded);

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
        libraries: libraries,
    });

    useEffect(() => {
        setIsLoaded(isLoaded);
    }, [isLoaded, setIsLoaded]);

    if (loadError) {
        toast.error("Google Mapの読み込みに失敗しました。");
        console.error(loadError);
    }
};

export default useInitGoogleMap;
