import { TextField } from "@mui/material";
import { type Control, Controller } from "react-hook-form";
import { type FrontPostSchemaKeys, type FrontPostSchema } from "~/utils/schema";

interface Props {
    controle: Control<FrontPostSchema>;
    name: FrontPostSchemaKeys;
}

export const TextInpupt = (props: Props) => {
    return (
        <Controller
            name={props.name}
            control={props.controle}
            defaultValue={""}
            render={({ field, fieldState }) => (
                <TextField
                    {...field}
                    id="outlined-required"
                    label="ひとこと"
                    placeholder="味・見た目・コスパ・本数など"
                    error={fieldState.invalid}
                    helperText={fieldState.error?.message}
                />
            )}
        />
    );
};
