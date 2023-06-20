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
} from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { env } from "~/env.mjs";
import CircularProgress from "@mui/material/CircularProgress";

interface PlacesAutocompleteProps {
    setSelected: Dispatch<SetStateAction<SelectedAddressProps | null>>;
}

const AutocompletePlaceInput: FC<PlacesAutocompleteProps> = (props) => {
    const {
        value,
        suggestions: { data },
        setValue,
        clearSuggestions,
    } = usePlacesAutocomplete({
        debounce: 300,
    });

    const handleInput = (
        e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
    ) => {
        setValue(e.target.value);
    };

    const handleSelect =
        ({ description }: { description: string }) =>
        () => {
            setValue(description, false);
            clearSuggestions();

            // Get latitude and longitude via utility functions
            getGeocode({ address: description })
                .then((results) => {
                    if (!results[0]) throw new Error("No results found");
                    return getLatLng(results[0]);
                })
                .then(({ lat, lng }) => props.setSelected({ lat, lng }))
                .catch((error) => console.log("😱 Error: ", error));
        };

    return (
        <ClickAwayListener onClickAway={() => clearSuggestions()}>
            <Autocomplete
                style={{ width: 300 }}
                getOptionLabel={(option) =>
                    typeof option === "string" ? option : option.description
                }
                filterOptions={(x) => x}
                options={data}
                autoComplete
                includeInputInList
                filterSelectedOptions
                noOptionsText="No results"
                value={data.find((x) => x.description === value)} // <-- fixed TS error
                renderInput={(params) => (
                    <TextField
                        {...params}
                        size="small"
                        label="Trip location"
                        variant="outlined"
                        fullWidth
                        onChange={(e) => handleInput(e)} // <-- moved from Autocomplete prop to here
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
                        <Grid
                            container
                            alignItems="center"
                            onClick={handleSelect(option)}
                            key={option.place_id}
                        >
                            <Grid item>
                                <LocationOnIcon />
                            </Grid>
                            <Grid item xs>
                                {parts.map((part, index) => (
                                    <span
                                        key={index}
                                        style={{
                                            fontWeight: part.highlight
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
                    );
                }}
            />
        </ClickAwayListener>
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
        <div className="grid gap-4">
            <GoogleMap
                zoom={10}
                center={center}
                mapContainerClassName="google-map"
            >
                {selected && <Marker position={selected} />}
            </GoogleMap>
            <div>
                <AutocompletePlaceInput setSelected={setSelected} />
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

export const SearchPlaceMap = () => {
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

    return <Map />;
};
