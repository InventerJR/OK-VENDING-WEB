import { useRef, useState, useEffect } from "react";
import CameraIcon from "@public/img/actions/camera.svg";
import { UseFormRegister, UseFormSetValue } from "react-hook-form";

type Props = {
    register: UseFormRegister<any>;
    setValue: UseFormSetValue<any>;
    initialImage?: string | null;
    onImageSelect?: (file: File | null) => void;
}

export default function ImagePicker({ register, setValue, initialImage, onImageSelect }: Props) {
    const [imgSrc, setImgSrc] = useState<string | null>(initialImage || null);

    const onRetake = () => {
        inputRef.current?.click();
    }

    const downloadImage = () => {
        if (!imgSrc) return;
        var link = document.createElement('a');
        link.href = imgSrc!;
        link.download = 'Download.jpeg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        register("image");
    }, [register]);

    useEffect(() => {
        if (initialImage) {
            setImgSrc(initialImage);
        }
    }, [initialImage]);

    return (
        <div className="flex flex-col items-center">
            <section id="pick-image" className="flex flex-col items-center">
                <button type="button" className="border-black border-[2px] rounded-3xl flex flex-col items-center justify-center w-[140px] h-[140px] overflow-hidden"
                    onClick={onRetake}>
                    {imgSrc ? (
                        <img src={imgSrc} alt="capture" className="w-full h-full object-cover" />
                    ) : (
                        <CameraIcon className="w-8 h-8" />
                    )}
                    <input ref={inputRef} type="file" id="myfile" name="myfile" accept="image/*" hidden
                        onInput={(e) => {
                            const file = (e.target as HTMLInputElement).files?.[0];
                            if (file) {
                                setValue("image", file);
                                onImageSelect && onImageSelect(file);
                                const reader = new FileReader();
                                reader.onload = function (e) {
                                    setImgSrc(e.target?.result as string);
                                }
                                reader.readAsDataURL(file);
                            }
                        }} />
                </button>
                <div className="btn-container">
                    {imgSrc && (
                        <button type="button" onClick={onRetake} className="p-2">Elegir otra imagen</button>
                    )}
                </div>
            </section>
        </div>
    );
}
