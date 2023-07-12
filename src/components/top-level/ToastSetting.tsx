import { ToastContainer, toast } from "react-toastify";
import { useColorScheme } from "@mui/material/styles";

const ToastSetting = () => {
    const { mode } = useColorScheme();

    return (
        <ToastContainer
            position={toast.POSITION.BOTTOM_RIGHT}
            theme={mode === "dark" ? "dark" : "light"}
        />
    );
};

export default ToastSetting;
