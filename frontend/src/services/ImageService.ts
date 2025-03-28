import { makeFormDataPostRequest } from "./api.ts";

class ImageService {

    base_url = "/combo"

    async uploadImage(
        file:File,
        imageName:string
    ) {
        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
        const uploadPreset = import.meta.env.VITE_CLOUDINARY_PRESET_NAME;
        const formData = new FormData();
        formData.append("file", file);
        formData.append("public_id", imageName);
        formData.append("upload_preset", uploadPreset);
        return makeFormDataPostRequest(
            `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
            formData
        );
    }
}

export default new ImageService();