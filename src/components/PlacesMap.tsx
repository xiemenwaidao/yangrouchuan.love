import Skeleton from "@mui/material/Skeleton";
import { useColorScheme } from "@mui/material/styles";

import { GoogleMap } from "@react-google-maps/api";
import { useCallback } from "react";
import { MAP_JP_CENTER } from "~/config";
import { useGoogleMapStore } from "~/store/useGoogleMapStore";
import { api } from "~/utils/api";
import styles from "~/utils/googlemapThemeStyles";
import { type PlaceWithPosts } from "~/utils/types";
import {
    MarkerClusterer,
    SuperClusterAlgorithm,
} from "@googlemaps/markerclusterer";
import { type NextRouter, useRouter } from "next/router";

const addMarkers = (
    map: google.maps.Map,
    data: PlaceWithPosts[] | undefined,
    router: NextRouter
) => {
    const infoWindow = new google.maps.InfoWindow();

    const markers = data?.map(({ lat, lng, title, id }) => {
        const marker = new google.maps.Marker({ position: { lat, lng } });

        marker.addListener("click", () => {
            infoWindow.setPosition({ lat, lng });
            infoWindow.setContent(`
                <div class="info-window">
                    <h3><a id="p-${id}" href="#">${title}</a></h3>
                </div>
            `);
            infoWindow.open({ map });

            google.maps.event.addListenerOnce(infoWindow, "domready", () => {
                document
                    .getElementById(`p-${id}`)
                    ?.addEventListener("click", (e) => {
                        e.preventDefault();
                        void router.push(`/place/${id}`);
                    });
            });
        });

        return marker;
    });

    new MarkerClusterer({
        markers,
        map,
        algorithm: new SuperClusterAlgorithm({ radius: 200 }),
    });
};

const Map = () => {
    const router = useRouter();
    const isLoaded = useGoogleMapStore((state) => state.isLoaded);
    const { data, isLoading: isPlaceLoading } = api.place.getAll.useQuery();

    const { mode } = useColorScheme();

    const onLoad = useCallback(
        (map: google.maps.Map, data: PlaceWithPosts[] | undefined) =>
            addMarkers(map, data, router),
        [router]
    );

    return isLoaded && !isPlaceLoading ? (
        <GoogleMap
            center={MAP_JP_CENTER}
            zoom={5}
            mapContainerClassName="google-map"
            options={{
                styles: mode === "dark" ? styles["night"] : styles["default"],
            }}
            onLoad={(map) => onLoad(map, data)}
        ></GoogleMap>
    ) : (
        <Skeleton
            variant="rectangular"
            width={`100%`}
            sx={{
                height: { xs: "250px", sm: "300px", md: "400px" },
            }}
        />
    );
};

export default Map;
