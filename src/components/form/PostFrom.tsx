// MUI
import LoadingButton from "@mui/lab/LoadingButton";
import SendIcon from "@mui/icons-material/Send";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import DeleteIcon from "@mui/icons-material/Delete";

import { useUser } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type FrontPostSchema, frontPostSchema } from "~/utils/schema";
import { api } from "~/utils/api";
import { Rating } from "~/components/form/Rating";
import { TextInpupt } from "~/components/form/TextInput";
import { NumberInput } from "~/components/form/NumberInput";
import { SearchPlaceMap } from "~/components/form/SearchPlace";
import { useGoogleMapStore } from "~/store/useGoogleMapStore";
import { ImagePostInput } from "~/components/form/ImagePostInput";
import { uploadImage } from "~/utils/cloudflareHelpers";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-toastify";

const UPDATE_IMAGE_FAILED_MESSAGE =
    "画像更新に失敗しました。時間をおいて再度お試しください。";

const isFile = (obj: string | File): obj is File => {
    return obj instanceof File;
};

const isString = (obj: string | File): obj is string => {
    return typeof obj === "string";
};

interface PostFromProps {
    defaultValues?: FrontPostSchema;
}

const PostForm = ({ defaultValues }: PostFromProps) => {
    const { user } = useUser();

    const router = useRouter();

    const [isPosting, setIsPosting] = useState(false);

    // form state
    const { handleSubmit, control, setValue, resetField, getValues, setError } =
        useForm<FrontPostSchema>({
            resolver: zodResolver(frontPostSchema),
            defaultValues: defaultValues,
        });

    // map state
    const [placeId, title, address] = useGoogleMapStore((state) => [
        state.placeId,
        state.title,
        state.address,
    ]);

    // const { mutate: deleteImagesMutate } =
    //     api.cloudflareImages.deleteImages.useMutation({
    //         onSuccess: () => {
    //             console.log("success delete images");
    //         },
    //         onError: (error) => {
    //             toast.error(error.message ?? UPDATE_IMAGE_FAILED_MESSAGE);
    //         },
    //     });

    const { mutate: storeMutate } = api.post.store.useMutation({
        onSuccess: (post) => {
            setIsPosting(false);

            // 投稿ページに遷移させる
            void router.push(`/place/${post.placeId}/`);
            toast.success("投稿に成功しました。");
        },
        onError: (error) => {
            // 画像を削除する

            setIsPosting(false);

            toast.error(error.message ?? UPDATE_IMAGE_FAILED_MESSAGE);
        },
    });

    const { mutate: getManyUploadImageURLMutate } =
        api.cloudflareImages.getManyUploadImageURL.useMutation({
            onSuccess: (results) => {
                console.log("success", { results });

                const data = getValues();

                // ファイルのみを抽出
                const imageFiles = data.images.filter(isFile);

                //
                const imageIds = data.images.filter(isString);

                if (imageFiles.length !== results.length) {
                    throw new Error(UPDATE_IMAGE_FAILED_MESSAGE);
                }

                const uploadImagePromises = imageFiles.map(
                    async (image, index) => {
                        const id = results[index]?.id;
                        const uploadURL = results[index]?.uploadURL;

                        if (!id)
                            throw new Error("id or uploadURL is undefined");
                        if (!uploadURL)
                            throw new Error("id or uploadURL is undefined");

                        try {
                            const json = await uploadImage(
                                image,
                                uploadURL,
                                id
                            );
                            return json.result.id; // Return the id from the uploaded image
                        } catch (error) {
                            if (error instanceof Error) {
                                throw new Error(error.message);
                            } else if (typeof error === "string") {
                                throw new Error(error);
                            } else {
                                throw new Error("unexpected error");
                            }
                        }
                    }
                );

                Promise.all(uploadImagePromises)
                    .then((ids) => {
                        console.log({ ids });

                        storeMutate({
                            ...data,
                            place: {
                                place_id: placeId,
                                title: title,
                                address: address,
                            },
                            images: [...imageIds, ...ids],
                        });
                    })
                    .catch((error) => {
                        setIsPosting(false);

                        if (error instanceof Error) {
                            toast.error(
                                error.message ?? UPDATE_IMAGE_FAILED_MESSAGE
                            );
                            // throw new Error(error.message);
                        } else if (typeof error === "string") {
                            toast.error(error ?? UPDATE_IMAGE_FAILED_MESSAGE);
                            // throw new Error(error);
                        } else {
                            toast.error(UPDATE_IMAGE_FAILED_MESSAGE);
                            // throw new Error("unexpected error");
                        }
                    });
            },
            onError: (error) => {
                // ぐるぐるローディングを消す
                setIsPosting(false);

                const errorMessage =
                    error.data?.zodError?.fieldErrors.count ??
                    error.data?.zodError?.fieldErrors.content;

                if (errorMessage && errorMessage[0]) {
                    toast.error(errorMessage[0]);
                } else {
                    toast.error(error.message ?? UPDATE_IMAGE_FAILED_MESSAGE);
                }
            },
        });

    // handleSubmitはsucsess時に実行される
    const onSubmit = handleSubmit((data: FrontPostSchema) => {
        // ぐるぐるローディング
        setIsPosting(true);

        // まずは画像アップロード用のURLを取得する
        getManyUploadImageURLMutate({
            count: data.images.filter(isFile).length,
        });
        console.log({ data });
    });

    if (!user) return null;

    return (
        <Stack
            spacing={3}
            component={`form`}
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onSubmit={onSubmit}
        >
            {/* google map */}
            {defaultValues ? null : (
                <SearchPlaceMap
                    controle={control}
                    setValue={setValue}
                    setError={setError}
                    resetField={resetField}
                />
            )}
            {/* images */}
            <ImagePostInput
                controle={control}
                defaultValue={defaultValues?.images}
            />
            {/* rating */}
            <Rating controle={control} />
            {/* content */}
            <TextInpupt controle={control} name="content" />
            {/* price */}
            <NumberInput controle={control} name="price" />

            {/* submit */}
            <Stack gap={2} direction={`row`}>
                <LoadingButton
                    endIcon={<SendIcon />}
                    loading={isPosting}
                    loadingPosition="end"
                    variant="contained"
                    type="submit"
                >
                    <span>{defaultValues ? "更新する" : "投稿する"}</span>
                </LoadingButton>
                {defaultValues && (
                    <LoadingButton
                        endIcon={<DeleteIcon />}
                        // loading={isPosting}
                        loadingPosition="end"
                        variant="contained"
                        type="button"
                        color="error"
                    >
                        <span>削除する</span>
                    </LoadingButton>
                )}
            </Stack>
        </Stack>
    );
};

export default PostForm;