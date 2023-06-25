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
import Button from "@mui/material/Button";
import { SearchPlaceMap } from "~/components/form/SearchPlace";
import { useGoogleMapStore } from "~/store/useGoogleMapStore";
import { ImagePostInput } from "~/components/form/ImagePostInput";

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

    // useEffect(() => {
    //     const un = watch((value) => console.log("watch", { value }));

    //     return () => un.unsubscribe();
    // }, [watch]);

    const { mutate: storeMutate } = api.post.store.useMutation({
        onSuccess: () => {
            console.log("success");
            // 投稿ページに遷移させる

            toast.success("投稿に成功しました。");
        },
        onError: (error) => {
            toast.error(
                error.message ??
                    "更新に失敗しました。時間をおいて再度お試しください。"
            );
        },
    });

    const { mutate: getUploadImageURLMutate } =
        api.cloudflareImages.getUploadImageURL.useMutation({
            onSuccess: (url) => {
                console.log("success", { url });

                const data = getValues();

                storeMutate({
                    ...data,
                    place: {
                        place_id: placeId,
                        title: title,
                        address: address,
                    },
                });
            },
            onError: (error) => {
                toast.error(
                    error.message ??
                        "画像更新に失敗しました。時間をおいて再度お試しください。"
                );
            },
        });

    // const onSubmit = handleSubmit((data) => {

    // })

    if (!user) return null;

    return (
        <form
            // handleSubmitはバリデーションが成功してないとと発火しない！！
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onSubmit={handleSubmit((data) => {
                getUploadImageURLMutate();
            })}
        >
            {/* google map */}
            <SearchPlaceMap
                controle={control}
                setValue={setValue}
                resetField={resetField}
            />
            {/* images */}
            <div className="form-control mb-6 w-full">
                <ImagePostInput />
            </div>
            {/* rating */}
            <div className="form-control mb-6 w-full">
                <Rating controle={control} />
            </div>
            {/* content */}
            <div className="form-control mb-6 w-full">
                <TextInpupt controle={control} name="content" />
            </div>
            {/* price */}
            <div className="form-control mb-6 w-full">
                <NumberInput controle={control} name="price" />
            </div>
            {/* submit */}
            <div>
                <Button variant="contained" type="submit">
                    Contained
                </Button>
            </div>
        </form>
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
