import TextField from "@mui/material/TextField";
import { type Control, Controller } from "react-hook-form";
import type { PostSchema, PostSchemaKeys } from "~/utils/schema";

interface Props {
    controle: Control<PostSchema>;
    name: PostSchemaKeys;
}

export const NumberInput = (props: Props) => {
    return (
        <Controller
            name={props.name}
            control={props.controle}
            defaultValue={0}
            render={({ field, fieldState }) => (
                <TextField
                    {...field}
                    id="outlined-required"
                    label="値段（¥）"
                    type="number"
                    placeholder="500"
                    error={fieldState.invalid}
                    helperText={fieldState.error?.message}
                />
            )}
        />
    );
};
