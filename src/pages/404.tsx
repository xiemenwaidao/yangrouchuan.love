import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

export default function Custom404() {
    return (
        <Stack
            sx={{
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
            }}
        >
            <Box textAlign={`center`}>
                <h1>404</h1>
                <p>ページが見つかりませんでした。</p>
            </Box>
        </Stack>
    );
}
