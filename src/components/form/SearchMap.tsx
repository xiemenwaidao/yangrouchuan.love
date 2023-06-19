import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import {
    type Dispatch,
    type SetStateAction,
    useMemo,
    useState,
    Fragment,
} from "react";
import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
} from "use-places-autocomplete";
import { env } from "~/env.mjs";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

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
            <div className="relative mt-1">
                <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                    <Combobox.Input
                        // value={value}
                        onChange={(event) => setValue(event.target.value)}
                        className="input w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                    />
                    <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon
                            className="h-5 w-5 text-gray-400"
                            aria-hidden="true"
                        />
                    </Combobox.Button>
                </div>
                {status === "OK" && (
                    <Transition
                        as="div"
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                        afterLeave={() => setValue("")}
                    >
                        <div></div>
                        {data.length === 0 && (
                            <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                                Nothing found.
                            </div>
                        )}
                        <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                            {data.map((item) => (
                                <Combobox.Option
                                    key={item.place_id}
                                    value={item.description}
                                    className={({ active }) =>
                                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                            active
                                                ? "bg-teal-600 text-white"
                                                : "text-gray-900"
                                        }`
                                    }
                                >
                                    {({ selected, active }) => (
                                        <>
                                            <span
                                                className={`block truncate ${
                                                    selected
                                                        ? "font-medium"
                                                        : "font-normal"
                                                }`}
                                            >
                                                {item.description}
                                            </span>
                                            {selected ? (
                                                <span
                                                    className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                                        active
                                                            ? "text-white"
                                                            : "text-teal-600"
                                                    }`}
                                                >
                                                    <CheckIcon
                                                        className="h-5 w-5"
                                                        aria-hidden="true"
                                                    />
                                                </span>
                                            ) : null}
                                        </>
                                    )}
                                </Combobox.Option>
                            ))}
                        </Combobox.Options>
                    </Transition>
                )}
            </div>
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
        <div className="flex gap-4">
            <PlacesAutocomplete setSelected={setSelected} />

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

const libraries: (
    | "drawing"
    | "geometry"
    | "localContext"
    | "places"
    | "visualization"
)[] = ["places"];

export const SearchMap = () => {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
        libraries: libraries,
    });

    if (!isLoaded)
        return <div className="loading loading-infinity loading-lg"></div>;

    return <Map />;
};
