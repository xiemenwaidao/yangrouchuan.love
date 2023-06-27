import { useUser } from "@clerk/nextjs";
import type { NextPage } from "next";
import Head from "next/head";
import { Layout } from "~/components/Layout";
import { SITE } from "~/config";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type FrontPostSchema, frontPostSchema } from "~/utils/schema";
import { api } from "~/utils/api";
import { toast } from "react-hot-toast";
import { Rating } from "~/components/form/Rating";
import { TextInpupt } from "~/components/form/TextInput";
import { NumberInput } from "~/components/form/NumberInput";
import { SearchPlaceMap } from "~/components/form/SearchPlace";
import { useGoogleMapStore } from "~/store/useGoogleMapStore";
import { ImagePostInput } from "~/components/form/ImagePostInput";
import { Box, Stack } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import SendIcon from "@mui/icons-material/Send";
import { uploadImage } from "~/utils/cloudflareHelpers";

const UPDATE_IMAGE_FAILED_MESSAGE =
    "画像更新に失敗しました。時間をおいて再度お試しください。";

const CreatePostWizard = () => {
    const { user } = useUser();
    const { handleSubmit, control, setValue, resetField, getValues } =
        useForm<FrontPostSchema>({
            resolver: zodResolver(frontPostSchema),
        });

    const [placeId, title, address] = useGoogleMapStore((state) => [
        state.placeId,
        state.title,
        state.address,
    ]);

    const { mutate: deleteImagesMutate } =
        api.cloudflareImages.deleteImages.useMutation({
            onSuccess: () => {
                console.log("success delete images");
            },
            onError: (error) => {
                toast.error(error.message ?? UPDATE_IMAGE_FAILED_MESSAGE);
            },
        });

    const { mutate: storeMutate, isLoading: isPosting } =
        api.post.store.useMutation({
            onSuccess: () => {
                console.log("success");
                // 投稿ページに遷移させる

                toast.success("投稿に成功しました。");
            },
            onError: (error) => {
                // 画像を削除する

                toast.error(error.message ?? UPDATE_IMAGE_FAILED_MESSAGE);
            },
        });

    const { mutate: getManyUploadImageURLMutate, isLoading: isLoadingGetURL } =
        api.cloudflareImages.getManyUploadImageURL.useMutation({
            onSuccess: (results) => {
                console.log("success", { results });

                const data = getValues();

                if (data.images.length !== results.length) {
                    throw new Error(UPDATE_IMAGE_FAILED_MESSAGE);
                }

                const uploadImagePromises = data.images.map(
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
                            images: ids,
                        });
                    })
                    .catch((error) => {
                        if (error instanceof Error) {
                            throw new Error(error.message);
                        } else if (typeof error === "string") {
                            throw new Error(error);
                        } else {
                            throw new Error("unexpected error");
                        }
                    });
            },
            onError: (error) => {
                toast.error(error.message ?? UPDATE_IMAGE_FAILED_MESSAGE);
            },
        });

    // const onSubmit = handleSubmit((data) => {

    // })

    if (!user) return null;

    return (
        <Stack
            spacing={3}
            component={`form`}
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onSubmit={handleSubmit((data) => {
                getManyUploadImageURLMutate({
                    count: data.images.length,
                });
                console.log({ data });
            })}
        >
            {/* google map */}
            <SearchPlaceMap
                controle={control}
                setValue={setValue}
                resetField={resetField}
            />
            {/* images */}
            <ImagePostInput controle={control} />
            {/* rating */}
            <Rating controle={control} />
            {/* content */}
            <TextInpupt controle={control} name="content" />
            {/* price */}
            <NumberInput controle={control} name="price" />

            {/* submit */}
            <Box>
                <LoadingButton
                    endIcon={<SendIcon />}
                    loading={isLoadingGetURL || isPosting}
                    loadingPosition="end"
                    variant="contained"
                    type="submit"
                >
                    <span>投稿</span>
                </LoadingButton>
            </Box>
        </Stack>
    );
};

const Create: NextPage = () => {
    return (
        <>
            <Head>
                <title>{`Post | ${SITE.title}`}</title>
            </Head>
            <Layout>
                <h2>Create new post</h2>

                <CreatePostWizard />
                {/* <TestForm /> */}
            </Layout>
        </>
    );
};

export default Create;
