import { useState } from "react"
import { MatchReportImageUpload } from "./team/scrape/update-match-sections/MatchReportImageUpload"
import { UploadedImage } from "../types/UploadedImage"
import ImageService from "../services/ImageService";
import { v4 as uuidv4 } from "uuid";

export const Test = () => {

    const [images, setImages] = useState<UploadedImage[]>([]);

    const uploadImages = async () => {
        for (const img of images) {
            const id = uuidv4();
            const res = await ImageService.uploadImage(img.file, id);
            console.log(id);
            console.log(res);
        }
    }

    return (
        <div>
            <MatchReportImageUpload
                images={images}
                setImages={setImages}
            />
            <button
                onClick={uploadImages}
            >
                Submit
            </button>
        </div>
    )
}