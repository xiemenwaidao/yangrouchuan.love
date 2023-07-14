// MUI
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import FormHelperText from "@mui/material/FormHelperText";
import IconButton from "@mui/material/IconButton";
import CancelIcon from "@mui/icons-material/Cancel";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";

import { useState } from "react";
import { Controller, type Control } from "react-hook-form";
import { type FrontPostSchema } from "~/utils/schema";
import { FORM_MAX_IMAGE_COUNT } from "~/config";
import NextImage from "next/image";
import { imageUrl } from "~/utils/cloudflareHelpers";
import Alert from "@mui/material/Alert";

interface Props {
    controle: Control<FrontPostSchema>;
    defaultValue?: (File | string)[];
}

export const ImagePostInput = ({ controle, defaultValue }: Props) => {
    const [images, setImages] = useState<(File | string)[]>(defaultValue ?? []);

    return (
        <Controller
            name="images"
            control={controle}
            defaultValue={[]}
            render={({
                field: { onChange, onBlur, name, ref },
                fieldState,
            }) => (
                <FormControl error={fieldState.invalid}>
                    <label style={{ width: "fit-content" }}>
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
                    <FormHelperText>{fieldState.error?.message}</FormHelperText>

                    <Grid
                        container
                        spacing={{ xs: 2, md: 3 }}
                        columns={{ xs: 2, sm: 12 }}
                        py={1}
                    >
                        {Array.from({ length: FORM_MAX_IMAGE_COUNT }).map(
                            (_, index) => {
                                const image = images[index];

                                return (
                                    <Grid xs={2} sm={4} md={4} key={index}>
                                        <Box
                                            sx={{
                                                bgcolor: "text.disabled",
                                                width: "100%",
                                                height: "300px",
                                                position: "relative",
                                            }}
                                        >
                                            {image && (
                                                <>
                                                    <IconButton
                                                        aria-label="delete image"
                                                        style={{
                                                            position:
                                                                "absolute",
                                                            top: 10,
                                                            right: 10,
                                                            color: "#aaa",
                                                            zIndex: 1,
                                                        }}
                                                        onClick={() => {
                                                            const newImages = [
                                                                ...images,
                                                            ];
                                                            newImages.splice(
                                                                index,
                                                                1
                                                            );
                                                            setImages(
                                                                newImages
                                                            );
                                                            onChange(newImages);
                                                        }}
                                                    >
                                                        <CancelIcon />
                                                    </IconButton>
                                                    <NextImage
                                                        src={
                                                            typeof image ===
                                                            "string"
                                                                ? imageUrl(
                                                                      image
                                                                  )
                                                                : URL.createObjectURL(
                                                                      image
                                                                  )
                                                        }
                                                        alt=""
                                                        fill
                                                        style={{
                                                            objectFit: "cover",
                                                        }}
                                                    />
                                                </>
                                            )}
                                        </Box>
                                    </Grid>
                                );
                            }
                        )}
                    </Grid>

                    <Alert severity="info" sx={{ mt: 1 }}>
                        できるだけ羊肉串の写真を投稿してください。羊肉串以外の写真は食べます🐐
                    </Alert>
                </FormControl>
            )}
        />
    );
};
