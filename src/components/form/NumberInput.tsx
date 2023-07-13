import TextField from "@mui/material/TextField";
import { type Control, Controller } from "react-hook-form";
import { toHalfWidth } from "~/utils/helpers";
import { type FrontPostSchemaKeys, type FrontPostSchema } from "~/utils/schema";

interface Props {
    controle: Control<FrontPostSchema>;
    name: FrontPostSchemaKeys;
}

export const NumberInput = (props: Props) => {
    return (
        <Controller
            name={props.name}
            control={props.controle}
            defaultValue={""}
            render={({ field, fieldState }) => (
                <TextField
                    {...field}
                    id="outlined-required"
                    label="値段"
                    placeholder={`500`}
                    onBlur={(e) => {
                        const currentValue = e.target.value;
                        const newValue = toHalfWidth(currentValue);

                        // 数値にキャスト可能時のみ値を更新
                        // ""の場合は0になっってしまうので除外
                        if (newValue !== "" && !isNaN(Number(newValue))) {
                            // console.log("onBlur", Number(newValue));
                        }
                    }}
                    error={fieldState.invalid}
                    helperText={fieldState.error?.message}
                />
            )}
        />
    );
};
