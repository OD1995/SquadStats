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

    const changeImageOrder = (index:number, direction:"up"|"down") => {
        console.log(`Index:${index} and Direction:${direction}`);
        if (
            ((index == 0) && (direction == "up")) ||
            ((index == (props.images.length - 1)) && (direction == "down"))
        ) {
            return;
        }
        props.setImages(
            (oldImages:UploadedImage[]) => {
                var imgs = [...oldImages];
                var img = imgs[index];
                const newIndex = index + (direction == "up" ? -1 : 1);
                imgs.splice(index, 1);
                imgs.splice(newIndex, 0, img);
                return imgs;
            }
        )
    }

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
                                    <div
                                        key={index}
                                        className="match-report-image-preview-div"
                                    >
                                        <img 
                                            src={img.preview} 
                                            alt="upload preview" 
                                            // className="w-full h-32 object-cover rounded-md" 
                                            className="image-preview"
                                        />
                                        <div className="image-preview-buttons">
                                            <button onClick={() => changeImageOrder(index, "up")}>
                                                ⇧
                                            </button>
                                            <button 
                                                onClick={() => removeImage(index)}
                                                className="image-remove-button"
                                            >
                                                ✕
                                            </button>
                                            <button onClick={() => changeImageOrder(index, "down")}>
                                                ⇩
                                            </button>
                                        </div>
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