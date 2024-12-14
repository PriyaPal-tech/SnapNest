const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
};

export const uploadMedia = async (mediaFiles: File[]): Promise<string[]> => {
    try {
        const base64Media: string[] = await Promise.all(mediaFiles.map(file => fileToBase64(file)));
        return base64Media;
    } catch (error) {
        console.error("Error converting media to Base64:", error);
        throw new Error("Failed to convert media to Base64");
    }
};

