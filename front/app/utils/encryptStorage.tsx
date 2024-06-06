import { AES, enc } from "crypto-js";
const salt = "HTTEAM";
export const encryptStorage = {
    setItem: (key: string, data: string) => {
        // console.log(data);
        const encryptedString = AES.encrypt(JSON.stringify(data), salt);
        sessionStorage.setItem(key, encryptedString.toString());
    },
    getItem: (key: string) => {
        const data = sessionStorage.getItem(key) || "";
        if (data) {
            const decrypted = AES.decrypt(data, salt);
            try {
                const parsedData = JSON.parse(decrypted.toString(enc.Utf8));
                // console.log(parsedData);
                return parsedData;
            } catch (e) {
                return null;
            }
        } else {
            return null;
        }
    },
    removeItem: (key: string) => {
        sessionStorage.removeItem(key);
    },
};
