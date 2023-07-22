import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { type NextPage } from "next";
import Head from "next/head";
import { MyLink } from "~/components/parts/MyLink";
import { SITE } from "~/config";

const PrivacyPage: NextPage = () => {
    return (
        <>
            <Head>
                <title>{`プライバシーポリシー | ${SITE.title}`}</title>
            </Head>
            <Box>
                <Typography
                    variant="h1"
                    fontWeight={`bold`}
                    fontSize={`1.25rem`}
                    py={2}
                >
                    プライバシーポリシー
                </Typography>
                <Divider />
                <Box py={2}>
                    <Typography variant="body1">
                        本サービスは、以下のプライバシーポリシーを定め、個人情報保護法を遵守すると共に、適切な個人情報の保護に努めます。
                    </Typography>
                </Box>
                {/*  */}
                <Box mt={3}>
                    <Typography
                        variant="h2"
                        fontWeight={`bold`}
                        fontSize={`1.1rem`}
                    >
                        プライバシーに関する情報の収集方法
                    </Typography>
                    <Typography variant="body1" mt={1}>
                        本サービスは、利便性の向上および違反行為（不正アクセス、スパム行為など）の検出のため、閲覧したページの情報や入力内容、利用日時、利用方法、利用環境、IPアドレス、Cookie、ローカルストレージなどの履歴情報および属性情報を、利用者が本サービスを閲覧または利用する際に収集します。
                        また、本サービスは、以下の目的のため、利用者が利用登録をする際にメールアドレスなどの個人情報をお尋ねすることがあります。
                    </Typography>
                    <ul>
                        <li>
                            アカウントの有効性の確認やアカウントの保護のため
                        </li>
                        <li>
                            本サービスの利用に際して、利用者に連絡を取るため
                        </li>
                    </ul>
                </Box>
                {/* cookie */}
                <Box mt={3}>
                    <Typography
                        variant="h2"
                        fontWeight={`bold`}
                        fontSize={`1.1rem`}
                    >
                        Cookieの利用について
                    </Typography>
                    <Typography variant="body1" mt={1}>
                        本サービスの一部の機能はCookieを利用します。WebブラウザでCookieの利用を無効に設定している場合、本サービスの一部の機能が正常に動作しない場合があります。
                    </Typography>

                    <Box mt={2}>
                        <Typography
                            variant="h3"
                            fontWeight={`bold`}
                            fontSize={`1.05rem`}
                        >
                            第三者が提供するサービスによるCookieの利用について
                        </Typography>
                        <Typography variant="body1" mt={1}>
                            本サービスでは、利用状況を把握し、より良いサービスを提供するためにGoogle
                            Analyticsを使用します。
                            これらの第三者提供のサービスでは、Cookieを使用してアクセスに関する情報を収集することがあります。
                            Google
                            Analyticsに関して、利用規約やポリシーおよびCookieの利用を停止する方法は
                            <MyLink
                                nextProps={{
                                    href: "https://policies.google.com/technologies/ads?gl=jp",
                                }}
                                target="_blank"
                            >
                                Googleのポリシーと規約
                            </MyLink>{" "}
                            および{" "}
                            <MyLink
                                nextProps={{
                                    href: "https://tools.google.com/dlpage/gaoptout?hl=ja",
                                }}
                                target="_blank"
                            >
                                Google Analytics オプトアウトアドオン
                            </MyLink>
                            をご確認ください。
                        </Typography>
                    </Box>
                </Box>
                {/*  */}
                <Box mt={3}>
                    <Typography
                        variant="h2"
                        fontWeight={`bold`}
                        fontSize={`1.1rem`}
                    >
                        個人情報の第三者への提供
                    </Typography>
                    <Typography variant="body1" mt={1}>
                        運営者は、次に掲げる場合を除き、予め利用者の同意を得ることなく第三者に個人情報を提供することはありません。
                    </Typography>
                    <ol>
                        <li>
                            人の生命、身体または財産の保護のために必要がある場合であって、本人の同意を得ることが困難であるとき
                        </li>
                        <li>
                            公衆衛生の向上または児童の健全な育成の推進のために特に必要がある場合であって、本人の同意を得ることが困難であるとき
                        </li>
                        <li>
                            国の機関もしくは地方公共団体またはその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合であって、本人の同意を得ることにより当該事務の遂行に支障を及ぼすおそれがあるとき
                        </li>
                        <li>
                            予め次の事項を告知あるいは公表している場合
                            <ul>
                                <li>利用目的に第三者への提供を含むこと</li>
                                <li>第三者に提供されるデータの項目</li>
                                <li>第三者への提供の手段または方法</li>
                            </ul>
                        </li>
                    </ol>
                    <Typography variant="body1" mt={1}>
                        前項の定めにかかわらず、個人情報保護法やその他の法令で認められる場合および次に掲げる場合は第三者には該当しないものとします。
                    </Typography>
                    <ol>
                        <li>
                            運営者が利用目的の達成に必要な範囲内において個人情報の取り扱いの全部または一部を委託する場合
                        </li>
                        <li>
                            合併その他の事由による事業の承継に伴って個人情報が提供される場合
                        </li>
                    </ol>
                </Box>
                {/*  */}
                <Box mt={3}>
                    <Typography
                        variant="h2"
                        fontWeight={`bold`}
                        fontSize={`1.1rem`}
                    >
                        プライバシーポリシーの変更
                    </Typography>
                    <Typography variant="body1" mt={1}>
                        本プライバシーポリシーの内容は、利用者に通知することなく、変更できるものとします。ただし、重要な変更がある場合や運営者が別途定める場合には、適切な方法で利用者に通知することとします。変更後のプライバシーポリシーは、本ページに掲載したときから効力を生じるものとします。
                    </Typography>
                </Box>
                {/*  */}
                <Box mt={3}>
                    <Typography
                        variant="h2"
                        fontWeight={`bold`}
                        fontSize={`1.1rem`}
                    >
                        お問い合わせ窓口
                    </Typography>
                    <Typography variant="body1" mt={1}>
                        本ポリシーに関するお問い合わせは、
                        <MyLink
                            nextProps={{
                                href: "https://forms.gle/W4qaj9A6fzgVzTtNA",
                            }}
                            target="_blank"
                        >
                            お問い合わせフォーム
                        </MyLink>
                        からお願いいたします。
                    </Typography>
                </Box>
            </Box>
        </>
    );
};

export default PrivacyPage;
