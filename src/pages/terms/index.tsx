import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { type NextPage } from "next";
import Head from "next/head";
import { SITE } from "~/config";
import { MyLink } from "~/components/parts/MyLink";
import Divider from "@mui/material/Divider";

const TermsPage: NextPage = () => {
    return (
        <>
            <Head>
                <title>{`利用規約 | ${SITE.title}`}</title>
            </Head>

            <Box>
                <Typography
                    variant="h2"
                    fontWeight={`bold`}
                    fontSize={`1.25rem`}
                    py={2}
                >
                    利用規約
                </Typography>
                <Divider />
                <Box py={2}>
                    <Typography variant="body1">
                        本利用規約（以下「本規約」といいます）は、
                        <MyLink
                            nextProps={{
                                href: "/",
                            }}
                        >
                            https://yangrouchuan.love
                        </MyLink>
                        上で提供されるサービス（以下「本サービス」といいます）の利用条件を定めるものです。本サービスの利用者（以下「利用者」といいます）は、本規約に同意したうえで、本サービスをご利用いただきます。
                    </Typography>
                    {/* 規約の適用範囲 */}
                    <Box mt={3}>
                        <Typography
                            variant="h3"
                            fontWeight={`bold`}
                            fontSize={`1.1rem`}
                        >
                            第1条（規約の適用範囲）
                        </Typography>
                        <Typography variant="body1" mt={1}>
                            本規約は、本サービスの提供条件及び運営者と利用者との間の権利義務関係を定めることを目的とし、利用者と運営者との間のサービスの利用に関わる一切の関係に適用されるものとします。
                        </Typography>
                    </Box>
                    {/* 利用資格 */}
                    <Box mt={3}>
                        <Typography
                            variant="h3"
                            fontWeight={`bold`}
                            fontSize={`1.1rem`}
                        >
                            第2条（利用資格）
                        </Typography>
                        <Box mt={1}>
                            <Typography variant="body1">
                                本サービスは以下の条件をすべて満たす方に限りご利用いただくことができます。
                            </Typography>
                            <ol>
                                <li>本規約に同意かつ遵守できる方</li>
                                <li>過去に本規約に違反したことのない方</li>
                            </ol>
                        </Box>
                    </Box>
                    {/* 禁止事項 */}
                    <Box mt={3}>
                        <Typography
                            variant="h3"
                            fontWeight={`bold`}
                            fontSize={`1.1rem`}
                        >
                            第3条（禁止事項）
                        </Typography>
                        <Box mt={1}>
                            <Typography variant="body1">
                                利用者は、本サービスの利用にあたり、以下の行為をしてはなりません。
                            </Typography>
                            <ol>
                                <li>法令または公序良俗に違反する行為</li>
                                <li>犯罪行為に関連する行為</li>
                                <li>
                                    運営者のサーバーまたはネットワークの機能を破壊したり、妨害したりする行為
                                </li>
                                <li>
                                    本サービスの運営を妨害する行為、または妨害するおそれのある行為
                                </li>
                                <li>
                                    他者の個人情報等を収集または蓄積する行為
                                </li>
                                <li>他者に成りすます行為</li>
                                <li>
                                    反社会的勢力に対して直接的または間接的に利益を供与する行為
                                </li>
                                <li>
                                    本サービスの利用者および運営者、第三者の知的財産権、肖像権、プライバシー、名誉その他の権利または利益を侵害する行為
                                </li>
                                <li>
                                    他の利用者および第三者を欺く虚偽の内容を記載する行為
                                </li>
                                <li>
                                    スパムとみなされる行為（同一内容の文章を繰り返し投稿する行為など）
                                </li>
                                <li>
                                    以下に該当する内容を投稿する行為
                                    <ul>
                                        <li>過度に暴力的な表現</li>
                                        <li>露骨な性的表現</li>
                                        <li>
                                            人種、国籍、信条、性別、社会的身分、門地等による差別につながる表現
                                        </li>
                                        <li>
                                            自殺、自傷行為、薬物乱用を誘引または助長する表現
                                        </li>
                                        <li>他者に対する嫌がらせや誹謗中傷</li>

                                        <li>他人に不快感を与える表現</li>
                                    </ul>
                                </li>
                                <li>出会いや交際を目的とする行為</li>
                                <li>宗教活動または宗教団体への勧誘行為</li>
                                <li>
                                    本サービスの認証情報の使用権限を第三者に譲渡または貸与する行為
                                </li>
                                <li>その他、運営者が不適切と判断する行為</li>
                            </ol>
                            <Typography variant="body1">
                                前項のいずれかの行為が発覚した場合、予告なく当該コンテンツの削除、およびその利用者のアカウントを停止・削除する場合があります。
                            </Typography>
                        </Box>
                    </Box>
                    {/* 本サービスの提供の停止等 */}
                    <Box mt={3}>
                        <Typography
                            variant="h3"
                            fontWeight={`bold`}
                            fontSize={`1.1rem`}
                        >
                            第4条（本サービスの提供の停止等）
                        </Typography>
                        <Box mt={1}>
                            <Typography variant="body1">
                                運営者は、以下のいずれかの事由があると判断した場合、利用者に事前に通知することなく本サービスの全部または一部の提供を停止または中断することができるものとします。
                            </Typography>
                            <ol>
                                <li>
                                    本サービスにかかるコンピュータシステムの保守点検または更新を行う場合
                                </li>
                                <li>
                                    コンピュータまたは通信回線等が事故により停止した場合
                                </li>
                                <li>
                                    本サービスが利用しているクラウドサービスやAPIサービスの提供が停止した場合
                                </li>
                                <li>
                                    その他、運営者が本サービスの提供が困難と判断した場合
                                </li>
                            </ol>
                            <Typography variant="body1">
                                運営者は、本サービスの提供の停止または中断により、利用者または第三者が被ったいかなる損害または不利益について、理由を問わず一切の責任を負わないものとします。
                            </Typography>
                        </Box>
                    </Box>
                    <Box mt={3}>
                        <Typography
                            variant="h3"
                            fontWeight={`bold`}
                            fontSize={`1.1rem`}
                        >
                            第5条（退会）
                        </Typography>
                        <Typography variant="body1" mt={1}>
                            利用者は所定の方法に従い、いつでも登録アカウントを削除することができます。
                            <br />
                            また、利用者が本規約への違反行為を行ったと運営者が判断した場合、運営者は事前の催告を要することなく、本サービスの利用の一時的な停止、または登録アカウントを削除することができるものとします。
                            <br />
                            登録アカウント削除後は過去に本サービスに投稿された一切のデータにアクセスすることはできません。登録アカウント削除に伴い利用者に生じる損失または不利益について、運営者は責任を負わないものとします。
                        </Typography>
                    </Box>
                    <Box mt={3}>
                        <Typography
                            variant="h3"
                            fontWeight={`bold`}
                            fontSize={`1.1rem`}
                        >
                            第6条（サービス内容の変更・停止）
                        </Typography>
                        <Box mt={1}>
                            <ol>
                                <li>
                                    運営者は、利用者に通知することなく、本サービスの内容の変更および一部機能の停止をすることができるものとし、これによって利用者に生じた損害または不利益について一切の責任を負いません。
                                </li>
                                <li>
                                    本サービスを終了する場合、30日前までに本サービスを停止する旨を本ウェブサイト上で告知するものとします。
                                </li>
                                <li>
                                    運営者は、本サービスの終了に伴い利用者に生じる損害または不利益について責任を負いません。
                                </li>
                            </ol>
                        </Box>
                    </Box>
                    <Box mt={3}>
                        <Typography
                            variant="h3"
                            fontWeight={`bold`}
                            fontSize={`1.1rem`}
                        >
                            第7条（利用規約の変更）
                        </Typography>
                        <Box mt={1}>
                            <Typography variant="body1">
                                運営者は、利用者に通知または本ウェブサイト上に告知することにより、本規約を変更することができます。ただし、その変更が利用者にとって大きな影響がある考えられる場合、運営者は可能な限り事前に通知または告知するよう努めるものとします。運営者は、本規約の変更により生じたいかなる損害等についても責任を負いません。
                            </Typography>
                        </Box>
                    </Box>
                    <Box mt={3}>
                        <Typography
                            variant="h3"
                            fontWeight={`bold`}
                            fontSize={`1.1rem`}
                        >
                            第8条（通知または連絡）
                        </Typography>
                        <Box mt={1}>
                            <Typography variant="body1">
                                利用者と運営者との間の通知または連絡は、運営者の定める方法によって行うものとします。
                            </Typography>
                        </Box>
                    </Box>
                    <Box mt={3}>
                        <Typography
                            variant="h3"
                            fontWeight={`bold`}
                            fontSize={`1.1rem`}
                        >
                            第9条（準拠法・裁判管轄）
                        </Typography>
                        <Box mt={1}>
                            <Typography variant="body1">
                                本規約の解釈にあたっては、日本法を準拠法とします。本サービスに関して紛争が生じた場合には、運営者の所在地を管轄する裁判所第一審の専属的合意管轄裁判所とします。
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </>
    );
};

export default TermsPage;
