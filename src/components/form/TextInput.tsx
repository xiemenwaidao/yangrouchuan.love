import { TextField } from "@mui/material";
import { type Control, Controller } from "react-hook-form";
import { type PostSchemaKeys, type PostSchema } from "~/utils/schema";

interface Props {
    controle: Control<PostSchema>;
    name: PostSchemaKeys;
}

export const TextInpupt = (props: Props) => {
    return (
        <Controller
            name={props.name}
            control={props.controle}
            render={({ field, fieldState }) => (
                <TextField
                    {...field}
                    id="outlined-required"
                    label="Required"
                    defaultValue=""
                    error={fieldState.invalid}
                    helperText={fieldState.error?.message}
                />
            )}
        />
    );
};
