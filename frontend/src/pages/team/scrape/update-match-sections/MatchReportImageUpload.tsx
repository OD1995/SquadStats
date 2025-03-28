import { UploadedImage } from "../../../../types/UploadedImage";

interface OwnProps {
    images:UploadedImage[]
    setImages:Function
}

export const MatchReportImageUpload = (props:OwnProps) => {


    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files) return;
        
        const files = Array.from(event.target.files);
        const validFiles = files.filter(
            (file) => (
                [
                    "image/png",
                    "image/jpeg",
                    "image/jpg"
                ].includes(file.type)
            )
        );
    
        if (validFiles.length !== files.length) {
            alert("Some files were not valid image formats (PNG, JPG, JPEG)." );
        }
    
        const fileReaders = validFiles.map((file) => {
            return new Promise<UploadedImage>(
                (resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve({ file, preview: reader.result as string });
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                }
            );
        });
    
        Promise.all(fileReaders).then(
            (results) => { props.setImages((prevImages:UploadedImage[]) => [...prevImages, ...results])});
    };

    const removeImage = (index: number) => {
        props.setImages(props.images.filter((_, i) => i !== index));
    };

    return (
        <label className="cursor-pointer block p-4 border-2 border-dashed rounded-lg bg-white text-center">
            <input 
                type="file" 
                multiple 
                accept="image/png, image/jpeg, image/jpg" 
                onChange={handleFileChange} 
                className="hidden" 
            />
            {
                (props.images.length > 0) && (
                    <div id='image-previews'>
                        {
                            props.images.map(
                                (img, index) => (
                                    <div key={index} className="match-report-image-preview-div">
                                        <img 
                                            src={img.preview} 
                                            alt="upload preview" 
                                            // className="w-full h-32 object-cover rounded-md" 
                                            className="image-preview"
                                        />
                                        <button 
                                            onClick={() => removeImage(index)}
                                            className="image-remove-button"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                )
                            )
                        }
                    </div>
                )
            }
        </label>
    );
}