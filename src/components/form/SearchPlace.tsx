import Autocomplete, {
    type AutocompleteChangeReason,
    type AutocompleteInputChangeReason,
} from "@mui/material/Autocomplete";
import Grid from "@mui/material/Grid";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { getGeocode, getLatLng } from "use-places-autocomplete";
import TextField from "@mui/material/TextField";
import parse from "autosuggest-highlight/parse";
import {
    useMemo,
    useState,
    type Dispatch,
    type SetStateAction,
    type FC,
    type SyntheticEvent,
    useCallback,
    useEffect,
} from "react";
import {
    GoogleMap,
    InfoWindowF,
    MarkerF,
    useLoadScript,
} from "@react-google-maps/api";
import { env } from "~/env.mjs";
import CircularProgress from "@mui/material/CircularProgress";
import {
    Controller,
    type Control,
    type UseFormSetValue,
    type UseFormResetField,
} from "react-hook-form";
import type { FrontPostSchema } from "~/utils/schema";
import { useGoogleMapStore } from "~/store/useGoogleMapStore";
import { debounce } from "@mui/material/utils";

interface SelectedAddressProps {
    lat: number;
    lng: number;
    place_id: string;
    title: string;
    address: string;
}

interface PlacesAutocompleteProps {
    setSelected: Dispatch<SetStateAction<SelectedAddressProps | null>>;
    controle: Control<FrontPostSchema>;
    setValue: UseFormSetValue<FrontPostSchema>;
    resetField: UseFormResetField<FrontPostSchema>;
}

const autocompleteService: {
    current: google.maps.places.AutocompleteService | null;
} = { current: null };
const AutocompleteInput: FC<PlacesAutocompleteProps> = (props) => {
    const [value, setValue] =
        useState<google.maps.places.AutocompletePrediction | null>(null);
    const [inputValue, setInputValue] = useState("");
    const [options, setOptions] = useState<
        readonly google.maps.places.AutocompletePrediction[]
    >([]);

    // store
    const setPlaceDetails = useGoogleMapStore((state) => state.setPlaceDetails);
    const removePlaceDetails = useGoogleMapStore(
        (state) => state.removePlaceDetails
    );

    const fetch = useMemo(
        () =>
            debounce(
                (
                    request: { input: string },
                    callback: (
                        results:
                            | google.maps.places.AutocompletePrediction[]
                            | null,
                        b: google.maps.places.PlacesServiceStatus
                    ) => void
                ) => {
                    if (autocompleteService.current)
                        void autocompleteService.current.getPlacePredictions(
                            request,
                            callback
                        );
                },
                400
            ),
        []
    );

    const clearValues = useCallback(() => {
        removePlaceDetails(); // store初期化
        props.resetField("address"); // react-hook-formのaddress初期化
        props.setSelected(null); // marker削除
    }, [props, removePlaceDetails]);

    const handleChange = useCallback(
        (
            _e: SyntheticEvent<Element, Event>,
            newValue: google.maps.places.AutocompletePrediction | null,
            reason: AutocompleteChangeReason
        ) => {
            console.log("handleChange", { newValue, reason });
            setOptions(newValue ? [newValue, ...options] : options);
            setValue(newValue);

            //
            if (reason === "clear") {
                clearValues();
            }

            if (newValue === null) return;
            const { description, place_id, structured_formatting } = newValue;

            getGeocode({ address: description })
                .then((results) => {
                    if (!results[0]) throw new Error("No results found");
                    return {
                        ...getLatLng(results[0]),
                    };
                })
                .then(({ lat, lng }) => {
                    props.setSelected({
                        lat,
                        lng,
                        place_id: place_id,
                        title: structured_formatting.main_text,
                        address: description,
                    });

                    props.setValue("address", description);

                    //
                    setPlaceDetails({
                        placeId: place_id,
                        title: structured_formatting.main_text,
                        address: description,
                    });
                })
                .catch((error) => console.error("😱 Error: ", error));
        },
        [clearValues, options, props, setPlaceDetails]
    );

    const handleInputChange = useCallback(
        (
            _: SyntheticEvent<Element, Event>,
            newInputValue: string,
            reason: AutocompleteInputChangeReason
        ) => {
            console.log("inputChange", reason, { newInputValue });

            setInputValue(newInputValue);

            if (reason === "clear") {
                clearValues();
            }
        },
        [clearValues]
    );

    useEffect(() => {
        let active = true;

        if (!autocompleteService.current && window.google) {
            autocompleteService.current =
                new window.google.maps.places.AutocompleteService();
        }
        if (!autocompleteService.current) {
            return undefined;
        }

        if (inputValue === "") {
            console.log('inputValue === ""');

            setOptions(value ? [value] : []);
            // removePlaceDetails(); // store初期化
            // props.resetField("address"); // react-hook-formのaddress初期化
            // props.setSelected(null); // marker削除
            return undefined;
        }

        fetch(
            { input: inputValue },
            (
                results: google.maps.places.AutocompletePrediction[] | null,
                _b: google.maps.places.PlacesServiceStatus
            ) => {
                if (active) {
                    let newOptions: google.maps.places.AutocompletePrediction[] =
                        [];

                    if (value) {
                        newOptions = [value];
                    }

                    if (results) {
                        newOptions = [...newOptions, ...results];
                    }

                    setOptions(newOptions);
                }
            }
        );

        return () => {
            active = false;
        };
    }, [value, inputValue, fetch]);

    return (
        <Controller
            name="address"
            control={props.controle}
            render={({ field, fieldState }) => (
                <Autocomplete
                    {...field}
                    id="google-map-demo"
                    sx={{ width: 300 }}
                    getOptionLabel={(option) =>
                        typeof option === "string" ? option : option.description
                    }
                    filterOptions={(x) => x}
                    options={options}
                    autoComplete
                    includeInputInList
                    filterSelectedOptions
                    value={value}
                    noOptionsText="No locations"
                    onChange={handleChange}
                    onInputChange={handleInputChange}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Add a location"
                            fullWidth
                            error={fieldState.invalid}
                            helperText={fieldState.error?.message}
                        />
                    )}
                    renderOption={(props, option) => {
                        const matches =
                            option.structured_formatting
                                .main_text_matched_substrings || [];

                        const parts = parse(
                            option.structured_formatting.main_text,
                            matches.map((match) => [
                                match.offset,
                                match.offset + match.length,
                            ])
                        );

                        return (
                            <li {...props}>
                                <Grid container alignItems="center">
                                    <Grid
                                        item
                                        sx={{ display: "flex", width: 44 }}
                                    >
                                        <LocationOnIcon
                                            sx={{ color: "text.secondary" }}
                                        />
                                    </Grid>
                                    <Grid
                                        item
                                        sx={{
                                            width: "calc(100% - 44px)",
                                            wordWrap: "break-word",
                                        }}
                                    >
                                        {parts.map((part, index) => (
                                            <Box
                                                key={index}
                                                component="span"
                                                sx={{
                                                    fontWeight: part.highlight
                                                        ? "bold"
                                                        : "regular",
                                                }}
                                            >
                                                {part.text}
                                            </Box>
                                        ))}
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            {
                                                option.structured_formatting
                                                    .secondary_text
                                            }
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </li>
                        );
                    }}
                />
            )}
        />
    );
};

const MAP_DEFAULT_ZOOM = 17;

interface SearchPlaceMapProps {
    controle: Control<FrontPostSchema>;
    setValue: UseFormSetValue<FrontPostSchema>;
    resetField: UseFormResetField<FrontPostSchema>;
}

const Map = (props: SearchPlaceMapProps) => {
    const center = useMemo(() => {
        return { lat: 34.6937, lng: 135.5021 };
    }, []);

    const [selected, setSelected] = useState<SelectedAddressProps | null>(null);

    const [map, setMap] = useState<google.maps.Map | null>(null);

    const onLoad = useCallback((map: google.maps.Map) => {
        setMap(map);
    }, []);

    const onUnmount = useCallback(() => {
        console.log("onUnmount map");
        setMap(null);
    }, []);

    // マーカーに合わせて中心を移動
    useEffect(() => {
        if (map && selected) {
            const bounds = new window.google.maps.LatLngBounds();
            bounds.extend(selected);
            map.fitBounds(bounds);
            map.setZoom(MAP_DEFAULT_ZOOM);
        }
    }, [map, selected]);

    return (
        <div className="grid gap-4">
            <GoogleMap
                zoom={MAP_DEFAULT_ZOOM}
                center={center}
                mapContainerClassName="google-map"
                onLoad={onLoad}
                onUnmount={onUnmount}
            >
                {selected && (
                    <MarkerF position={selected}>
                        <InfoWindowF
                            position={selected}
                            // options={infoWindowOptions}
                            // onLoad={() => console.log("onLoad infoWindow")}
                        >
                            <div>
                                <strong>{selected.title}</strong>
                                <div>{selected.address}</div>
                            </div>
                        </InfoWindowF>
                    </MarkerF>
                )}
            </GoogleMap>
            <div>
                {/* <AutocompletePlaceInput
                    setSelected={setSelected}
                    controle={props.controle}
                    setValue={props.setValue}
                    resetField={props.resetField}
                /> */}

                <AutocompleteInput
                    setSelected={setSelected}
                    controle={props.controle}
                    setValue={props.setValue}
                    resetField={props.resetField}
                />
            </div>
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

export const SearchPlaceMap = (props: SearchPlaceMapProps) => {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
        libraries: libraries,
    });

    if (loadError) return <div>エラーが発生しました。</div>;

    return isLoaded ? (
        <Map
            controle={props.controle}
            setValue={props.setValue}
            resetField={props.resetField}
        />
    ) : (
        <Box sx={{ display: "flex" }}>
            <CircularProgress />
        </Box>
    );
};
