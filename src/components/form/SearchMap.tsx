import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { type Dispatch, type SetStateAction, useMemo, useState } from "react";
import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
} from "use-places-autocomplete";
import { env } from "~/env.mjs";
import { Combobox } from "@headlessui/react";

interface PlacesAutocompleteProps {
    setSelected: Dispatch<SetStateAction<SelectedAddressProps | null>>;
}

const PlacesAutocomplete = (props: PlacesAutocompleteProps) => {
    const {
        ready,
        setValue,
        suggestions: { status, data },
        clearSuggestions,
    } = usePlacesAutocomplete();

    const handleSelect = async (address: string) => {
        setValue(address, false);
        clearSuggestions();

        const results = await getGeocode({ address });
        if (!results[0]) return;
        const { lat, lng } = getLatLng(results[0]);
        props.setSelected({ lat, lng });

        console.log(lat, lng);
    };

    const handleChange = (address: string) => {
        handleSelect(address).catch((error) => console.error(error));
    };

    return (
        <Combobox onChange={handleChange} disabled={!ready}>
            <Combobox.Input
                // value={value}
                onChange={(event) => setValue(event.target.value)}
            />
            {status === "OK" && (
                <Combobox.Options>
                    {data.map((item) => (
                        <Combobox.Option
                            key={item.place_id}
                            value={item.description}
                        >
                            {item.description}
                        </Combobox.Option>
                    ))}
                </Combobox.Options>
            )}
        </Combobox>
    );
};

interface SelectedAddressProps {
    lat: number;
    lng: number;
}

const Map = () => {
    const center = useMemo(() => {
        return { lat: 34.6937, lng: 135.5021 };
    }, []);

    const [selected, setSelected] = useState<SelectedAddressProps | null>(null);

    return (
        <div className="relative">
            <div>
                <PlacesAutocomplete setSelected={setSelected} />
            </div>

            <GoogleMap
                zoom={10}
                center={center}
                mapContainerClassName="google-map"
            >
                {selected && <Marker position={selected} />}
            </GoogleMap>
        </div>
    );
};

export const SearchMap = () => {
    const libraries: (
        | "drawing"
        | "geometry"
        | "localContext"
        | "places"
        | "visualization"
    )[] = useMemo(() => {
        return ["places"];
    }, []);

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
        libraries: libraries,
    });

    if (!isLoaded)
        return <div className="loading loading-infinity loading-lg"></div>;

    return <Map />;
};
