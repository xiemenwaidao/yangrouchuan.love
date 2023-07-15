// MUI
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
import Stack from "@mui/material/Stack";
import Skeleton from "@mui/material/Skeleton";
import { useColorScheme } from "@mui/material/styles";
import { debounce } from "@mui/material/utils";
import Alert from "@mui/material/Alert";

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
import {
    Controller,
    type Control,
    type UseFormSetValue,
    type UseFormResetField,
    type UseFormSetError,
} from "react-hook-form";
import type { FrontPostSchema } from "~/utils/schema";
import { useGoogleMapStore } from "~/store/useGoogleMapStore";
import { api } from "~/utils/api";
import { useUser } from "@clerk/nextjs";
import { MyLink } from "../parts/MyLink";
import { getMapHrefByPlaceId } from "~/utils/googlemapHelpers";
import { toast } from "react-toastify";
import { MAP_DEFAULT_ZOOM } from "~/config";
import styles from "~/utils/googlemapThemeStyles";

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
    setError: UseFormSetError<FrontPostSchema>;
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

    // 投稿済みの場所を取得
    const { user } = useUser();
    const { data: posted } = api.post.getPostsByUserId.useQuery({
        userId: user?.id ?? "",
    });
    const postedPlaceIds = posted?.map((obj) => obj.post.placeId);

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
            // console.log("handleChange", { newValue, reason });
            setOptions(newValue ? [newValue, ...options] : options);
            setValue(newValue);

            //
            if (reason === "clear") {
                clearValues();
            }

            if (newValue === null) return;

            const { description, place_id, structured_formatting } = newValue;

            // 投稿済みの場所かどうか
            if (postedPlaceIds?.includes(place_id)) {
                props.setError("address", {
                    type: "manual",
                    message: `あなたは既に「${structured_formatting.main_text}」のレビューを投稿しています。`,
                });

                setValue(null);
                return;
            }

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

                    // TODO: アンチパターンっぽい？
                    props.setValue("address", description);

                    //
                    setPlaceDetails({
                        placeId: place_id,
                        title: structured_formatting.main_text,
                        address: description,
                    });
                })
                .catch((error) => {
                    toast.error(
                        "エラーが発生しました。しばらくしてから再度お試しください。"
                    );
                    console.error("😱 Error: ", error);
                });
        },
        [clearValues, options, postedPlaceIds, props, setPlaceDetails]
    );

    const handleInputChange = useCallback(
        (
            _: SyntheticEvent<Element, Event>,
            newInputValue: string,
            reason: AutocompleteInputChangeReason
        ) => {
            // console.log("inputChange", reason, { newInputValue });

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
            // console.log('inputValue === ""');

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
                    // sx={{ width: 300 }}
                    getOptionLabel={(option) =>
                        typeof option === "string" ? option : option.description
                    }
                    filterOptions={(x) => x}
                    options={options}
                    autoComplete
                    includeInputInList
                    filterSelectedOptions
                    fullWidth
                    value={value}
                    noOptionsText="検索結果がありません"
                    onChange={handleChange}
                    onInputChange={handleInputChange}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="店舗検索"
                            fullWidth
                            // onChange={(e) => console.log(e.target.value)}
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

interface SearchPlaceMapProps {
    controle: Control<FrontPostSchema>;
    setValue: UseFormSetValue<FrontPostSchema>;
    setError: UseFormSetError<FrontPostSchema>;
    resetField: UseFormResetField<FrontPostSchema>;
}

const Map = (props: SearchPlaceMapProps) => {
    const center = useMemo(() => {
        return { lat: 34.6937, lng: 135.5021 };
    }, []);

    const [selected, setSelected] = useState<SelectedAddressProps | null>(null);

    const [map, setMap] = useState<google.maps.Map | null>(null);

    const { mode } = useColorScheme();

    const onLoad = useCallback((map: google.maps.Map) => {
        setMap(map);
    }, []);

    const onUnmount = useCallback(() => {
        // console.log("onUnmount map");
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
        <Stack spacing={1}>
            <GoogleMap
                zoom={MAP_DEFAULT_ZOOM}
                center={center}
                mapContainerClassName="google-map"
                onLoad={onLoad}
                onUnmount={onUnmount}
                options={{
                    styles:
                        mode === "dark" ? styles["night"] : styles["default"],
                }}
            >
                {selected && (
                    <MarkerF position={selected}>
                        <InfoWindowF
                            position={selected}
                            // options={infoWindowOptions}
                            // onLoad={() => console.log("onLoad infoWindow")}
                        >
                            <Box sx={{ color: "black" }}>
                                <strong>{selected.title}</strong>
                                <p>{selected.address}</p>
                                <MyLink
                                    nextProps={{
                                        href: getMapHrefByPlaceId(
                                            selected.title,
                                            selected.place_id
                                        ),
                                    }}
                                    target="_blank"
                                >
                                    Google Mapで開く
                                </MyLink>
                            </Box>
                        </InfoWindowF>
                    </MarkerF>
                )}
            </GoogleMap>
            <AutocompleteInput
                setSelected={setSelected}
                controle={props.controle}
                setValue={props.setValue}
                setError={props.setError}
                resetField={props.resetField}
            />
        </Stack>
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

    if (loadError) {
        toast.error("Google Mapの読み込みに失敗しました。");
        return <div>Google Mapの読み込みに失敗しました。</div>;
    }

    return (
        <Box>
            {isLoaded ? (
                <Map
                    controle={props.controle}
                    setValue={props.setValue}
                    setError={props.setError}
                    resetField={props.resetField}
                />
            ) : (
                <Box>
                    <Skeleton
                        variant="rectangular"
                        width={`100%`}
                        sx={{
                            height: { xs: "250px", sm: "300px", md: "400px" },
                        }}
                    />
                    <Skeleton
                        variant="rectangular"
                        width={`100%`}
                        height={56}
                        sx={{ mt: 1 }}
                    />
                </Box>
            )}
            <Alert severity="info" sx={{ mt: 1 }}>
                店名や住所を入力して、店舗を検索してください。マーカーの置かれた場所が正しいか確認してください。
            </Alert>
        </Box>
    );
};
