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
            <div className="form-control mb-6 w-full">
                <label htmlFor="content" className="label">
                    <span>ひとこと</span>
                </label>
                <input
                    id="content"
                    className="input-bordered input w-full "
                    {...register("content")}
                />
                {/* error message */}
                {errors.content?.message && (
                    <div className="text-red-500">{errors.content.message}</div>
                )}
            </div>
            <div className="form-control mb-6 w-full">
                <label htmlFor="price" className="label">
                    <span>価格／串</span>
                </label>
                <input
                    id="price"
                    className="input-bordered input w-full "
                    {...register("price", {
                        // valueAsNumber: true,
                        // setValueAs: (v: unknown) => {
                        //     if (v === "") return undefined;
                        //     if (typeof v === "string") {
                        //         console.log(Number(toHalfWidth(v)));
                        //         return Number(toHalfWidth(v));
                        //     }
                        //     return v;
                        // },
                    })}
                    onBlur={(e) => {
                        const currentValue = e.target.value;
                        const newValue = toHalfWidth(currentValue);

                        // 数値にキャスト可能時のみ値を更新
                        // ""の場合は0になっってしまうので除外
                        if (newValue !== "" && !isNaN(Number(newValue))) {
                            setValue("price", Number(newValue));
                        }
                    }}
                />
                {errors.price?.message && (
                    <div className="text-red-500">{errors.price.message}</div>
                )}
            </div>
            <div>
                <button className="btn-primary btn-outline btn" type="submit">
                    submit
                </button>
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
