import axios from "axios";
import { baseURL } from ".";

export const readEmails = async (mail, clientId, token, limit = 10) => {
    try {
        const res = await axios.post(`${baseURL}/api/hotmail/read-emails`, {
            mail,
            clientId,
            token,
            limit,
        });
        return res.data;
    } catch (err) {
        console.error("Lỗi khi đọc email:", err);
        throw err;
    }
};