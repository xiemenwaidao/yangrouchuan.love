import Autocomplete from "@mui/material/Autocomplete";
import Grid from "@mui/material/Grid";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
} from "use-places-autocomplete";
import TextField from "@mui/material/TextField";
import parse from "autosuggest-highlight/parse";
import ClickAwayListener from "@mui/material/ClickAwayListener";
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
    InfoWindow,
    Marker,
    useLoadScript,
} from "@react-google-maps/api";
import { env } from "~/env.mjs";
import CircularProgress from "@mui/material/CircularProgress";
import {
    Controller,
    type Control,
    type UseFormSetValue,
} from "react-hook-form";
import type { FrontPostSchema } from "~/utils/schema";

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
}

const AutocompletePlaceInput: FC<PlacesAutocompleteProps> = (props) => {
    const {
        value,
        suggestions: { data },
        setValue,
    } = usePlacesAutocomplete({
        debounce: 300,
    });

    const handleInput = (
        e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
    ) => {
        setValue(e.target.value);
    };

    const handleSelect = (
        _: SyntheticEvent<Element, Event>,
        value: google.maps.places.AutocompletePrediction | null
    ) => {
        if (!value) return;

        const { description } = value;

        // console.log(value.structured_formatting.main_text);

        // setValue(description, false);
        // clearSuggestions();

        // Get latitude and longitude via utility functions
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
                    place_id: value.place_id,
                    title: value.structured_formatting.main_text,
                    address: description,
                });
                props.setValue("address", description);
            })
            .catch((error) => console.error("😱 Error: ", error));
    };

    return (
        <Controller
            name="address"
            control={props.controle}
            render={({ field, fieldState }) => (
                <ClickAwayListener
                    onClickAway={() => {
                        // clearSuggestions()
                    }}
                >
                    <Autocomplete
                        style={{ width: 300 }}
                        getOptionLabel={(option) =>
                            typeof option === "string"
                                ? option
                                : option.description
                        }
                        filterOptions={(x) => x}
                        onChange={handleSelect}
                        options={data}
                        autoComplete
                        includeInputInList
                        filterSelectedOptions
                        noOptionsText="該当なし"
                        // value={data.find((x) => x.description === value) ?? null}
                        value={data.find((x) => x.description === value)}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                size="small"
                                label="店舗住所"
                                variant="outlined"
                                fullWidth
                                onChange={(e) => handleInput(e)}
                                error={fieldState.invalid}
                                helperText={fieldState.error?.message}
                            />
                        )}
                        renderOption={(props, option) => {
                            const matches =
                                option.structured_formatting
                                    .main_text_matched_substrings;
                            const parts = parse(
                                option.structured_formatting.main_text,
                                matches.map((match) => [
                                    match.offset,
                                    match.offset + match.length,
                                ])
                            );

                            return (
                                <li {...props} key={option.place_id}>
                                    <Grid
                                        container
                                        alignItems="center"
                                        // onClick={handleSelect(option)}
                                    >
                                        <Grid item>
                                            <LocationOnIcon />
                                        </Grid>
                                        <Grid item xs>
                                            {parts.map((part, index) => (
                                                <span
                                                    key={index}
                                                    style={{
                                                        fontWeight:
                                                            part.highlight
                                                                ? 700
                                                                : 400,
                                                    }}
                                                >
                                                    {part.text}
                                                </span>
                                            ))}

                                            <Typography
                                                variant="body2"
                                                color="textSecondary"
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
                </ClickAwayListener>
            )}
        />
    );
};

const MAP_DEFAULT_ZOOM = 10;

interface SearchPlaceMapProps {
    controle: Control<FrontPostSchema>;
    setValue: UseFormSetValue<FrontPostSchema>;
}

const Map = (props: SearchPlaceMapProps) => {
    const center = useMemo(() => {
        return { lat: 34.6937, lng: 135.5021 };
    }, []);

    const [selected, setSelected] = useState<SelectedAddressProps | null>(null);

    // info window
    const [size, setSize] = useState<undefined | google.maps.Size>(undefined);
    const infoWindowOptions = {
        pixelOffset: size,
    };
    const createOffsetSize = () => {
        console.log("createOffsetSize");
        return setSize(new window.google.maps.Size(0, -45));
    };

    const [map, setMap] = useState<google.maps.Map | null>(null);

    const onLoad = useCallback((map: google.maps.Map) => {
        createOffsetSize();
        setMap(map);
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
            >
                {selected && (
                    <>
                        <InfoWindow
                            position={selected}
                            options={infoWindowOptions}
                        >
                            <div>info</div>
                        </InfoWindow>
                        <Marker position={selected}></Marker>
                    </>
                )}
            </GoogleMap>
            <div>
                <AutocompletePlaceInput
                    setSelected={setSelected}
                    controle={props.controle}
                    setValue={props.setValue}
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
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
        libraries: libraries,
    });

    if (!isLoaded)
        return (
            <Box sx={{ display: "flex" }}>
                <CircularProgress />
            </Box>
        );

    return <Map controle={props.controle} setValue={props.setValue} />;
};
