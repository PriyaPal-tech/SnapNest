export const saveToken = (token: string) => {
    try {
        localStorage.setItem("accessToken", token);
    } catch (error) {
        console.error('AUTH LOCAL STORAGE SAVE ERROR', error);
    }
};

export const getToken = () => {
    try {
        const token = localStorage.getItem("accessToken");
        return token;
    } catch (error) {
        console.error('AUTH LOCAL STORAGE PARSE ERROR', error);
    }
};

export const clearToken = () => {
    try {
        localStorage.removeItem("accessToken");
    } catch (error) {
        console.error('AUTH LOCAL STORAGE REMOVE ERROR', error);
    }
};