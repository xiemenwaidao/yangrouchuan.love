import { useUser } from "@clerk/nextjs";
import type { NextPage } from "next";
import Head from "next/head";
import { Layout } from "~/components/Layout";
import { SITE } from "~/config";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type PostSchema, postSchema } from "~/utils/schema";
import { toHalfWidth } from "~/utils/helpers";
import { api } from "~/utils/api";
import { toast } from "react-hot-toast";
import { SearchMap } from "~/components/form/SearchMap";
import { Rating } from "~/components/form/Rating";
import { TextInpupt } from "~/components/form/TextInput";
import { NumberInput } from "~/components/form/NumberInput";
import Button from "@mui/material/Button";
import { SearchPlaceMap } from "~/components/form/SearchPlace";

const CreatePostWizard = () => {
    const { user } = useUser();
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
        control,
    } = useForm<PostSchema>({
        resolver: zodResolver(postSchema),
    });

    const { mutate } = api.post.create.useMutation({
        onSuccess: () => {
            console.log("success");
            // 投稿ページに遷移させる
        },
        onError: (error) => {
            toast.error(
                error.message ??
                    "更新に失敗しました。時間をおいて再度お試しください。"
            );
        },
    });

    if (!user) return null;

    return (
        <form
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onSubmit={handleSubmit((data) => {
                mutate({
                    ...data,
                    rating: data.rating,
                });
                console.log(data);
            })}
        >
            {/* google map */}
            <SearchPlaceMap />
            {/* <div className="form-control mb-6 w-full">
                <label htmlFor="map" className="label">
                    <span>住所</span>
                </label>
                <SearchMap />
            </div> */}
            {/* rating */}
            <div className="">
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

const New: NextPage = () => {
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

export default New;
