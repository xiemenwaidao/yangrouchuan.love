import {
    Button,
    FormControl,
    FormHelperText,
    IconButton,
    ImageList,
    ImageListItem,
} from "@mui/material";
import { useState } from "react";
import { Controller, type Control } from "react-hook-form";
import { type FrontPostSchema } from "~/utils/schema";
import CancelIcon from "@mui/icons-material/Cancel";
import { FORM_MAX_IMAGE_COUNT } from "~/config";

interface Props {
    controle: Control<FrontPostSchema>;
}

export const ImagePostInput = (props: Props) => {
    const [images, setImages] = useState<File[]>([]);

    return (
        <Controller
            name="images"
            control={props.controle}
            defaultValue={[]}
            render={({
                field: { onChange, onBlur, name, ref },
                fieldState,
            }) => (
                <>
                    <FormControl error={fieldState.invalid}>
                        <label>
                            <Button
                                variant="contained"
                                component="span"
                                disabled={images.length >= FORM_MAX_IMAGE_COUNT}
                            >
                                画像追加（3枚まで）
                            </Button>
                            <input
                                // {...field}
                                ref={ref}
                                onChange={(e) => {
                                    const files = e.target.files;
                                    if (files === null) return;

                                    const newImages = [
                                        ...images,
                                        ...Array.from(files),
                                    ];

                                    onChange(newImages);
                                    setImages(newImages);
                                }}
                                onBlur={onBlur}
                                name={name}
                                type="file"
                                multiple
                                placeholder="画像を選択"
                                style={{ display: "none" }}
                                accept="image/*"
                            />
                        </label>
                        <FormHelperText>
                            {fieldState.error?.message}
                        </FormHelperText>
                    </FormControl>

                    {/* images */}
                    <ImageList
                        // sx={{ width: "100%", height: 300 }}
                        cols={3}
                        // rowHeight={164}
                        gap={8}
                        variant="masonry"
                    >
                        {images.map((image, index) => (
                            <ImageListItem
                                sx={{ position: "relative" }}
                                key={index}
                            >
                                <IconButton
                                    aria-label="delete image"
                                    style={{
                                        position: "absolute",
                                        top: 10,
                                        right: 10,
                                        color: "#aaa",
                                    }}
                                    onClick={() => {
                                        const newImages = [...images];
                                        newImages.splice(index, 1);
                                        setImages(newImages);
                                        onChange(newImages);
                                    }}
                                >
                                    <CancelIcon />
                                </IconButton>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={URL.createObjectURL(image)}
                                    alt={image.name}
                                />
                            </ImageListItem>
                        ))}
                    </ImageList>
                </>
            )}
        />
    );
};
