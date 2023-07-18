import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import { type Control, Controller } from "react-hook-form";
import { type FrontPostSchema } from "~/utils/schema";

interface Props {
    controle: Control<FrontPostSchema>;
}

function valuetext(value: number) {
    return `${value}本`;
}

const marks = Array.from({ length: 10 + 1 }).map((_, i) => ({
    value: i * 2,
    label: `${i * 2}`,
}));

const SkewerCountSlider = ({ controle }: Props) => {
    return (
        <Box>
            <Typography>串数</Typography>
            <Controller
                name={`skewerCount`}
                control={controle}
                defaultValue={0}
                render={({ field, fieldState }) => (
                    <FormControl
                        error={fieldState.invalid}
                        sx={{ width: "100%" }}
                    >
                        <Slider
                            {...field}
                            aria-label="本数"
                            // defaultValue={1}
                            getAriaValueText={valuetext}
                            valueLabelDisplay="auto"
                            step={1}
                            marks={marks}
                            min={0}
                            max={20}
                            onChange={(e, value) => {
                                if (typeof value === "number")
                                    field.onChange(value);
                            }}
                        />
                        <FormHelperText>
                            {fieldState.error?.message}
                        </FormHelperText>
                    </FormControl>
                )}
            />
        </Box>
    );
};

export default SkewerCountSlider;
