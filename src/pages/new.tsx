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

const CreatePostWizard = () => {
    const { user } = useUser();
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
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
            onSubmit={handleSubmit((data) =>
                mutate({
                    ...data,
                })
            )}
        >
            <div className="mb-6">
                <label htmlFor="content">ひとこと</label>
                <input
                    id="content"
                    className="form-input mt-1 block w-full rounded-md border-transparent bg-gray-100 focus:border-gray-500 focus:bg-white focus:ring-0"
                    {...register("content")}
                />
                <div className="text-red-600">{errors.content?.message}</div>
            </div>
            <div className="mb-6">
                <label htmlFor="price">価格／串</label>
                <input
                    id="price"
                    className="form-input mt-1 block w-full rounded-md border-transparent bg-gray-100 focus:border-gray-500 focus:bg-white focus:ring-0"
                    {...register("price")}
                    onBlur={(e) => {
                        const currentValue = e.target.value;
                        const newValue = toHalfWidth(currentValue);
                        // 数値にキャスト可能時のみ値を更新
                        if (!isNaN(Number(newValue))) {
                            setValue("price", Number(newValue));
                        }
                    }}
                />
                <div className="text-red-600">{errors.price?.message}</div>
            </div>
            <div>
                <button type="submit">submit</button>
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
