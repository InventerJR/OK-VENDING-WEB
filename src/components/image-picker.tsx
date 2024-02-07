import { useRef, useState } from "react";
// import Webcam from "react-webcam";
import CameraIcon from "@public/img/actions/camera.svg";

type Props = {
    // isOpen?: boolean;
    // onClose?: () => void;
}


export default function ImagePicker(props: Props) {

    // const [currentMode, setCurrentMode] = useState<"pick-image" | "webcam-capture">("pick-image");
    // const webcamRef = useRef<Webcam>(null);

    const [imgSrc, setImgSrc] = useState<string | null>(null);

    // const onCaptureWebcam = () => {
    //     const imageSrc = webcamRef.current?.getScreenshot();
    //     if (imageSrc) {
    //         setImgSrc(imageSrc);
    //     }
    // }

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

    return (
        <div className="flex flex-col items-center">
            {/* {currentMode === "pick-image" && ( */}
            <section id="pick-image" className="flex flex-col items-center">
                <button type="button" className="border-black border-[2px] rounded-3xl flex flex-col items-center justify-center w-[140px] h-[140px] overflow-hidden"
                    onClick={onRetake}>
                    {imgSrc ? (
                        <img src={imgSrc} alt="caputre" className="w-full h-full object-cover" />
                    ) : (
                        <CameraIcon className="w-8 h-8" />
                    )}
                    <input ref={inputRef} type="file" id="myfile" name="myfile" accept="image/*" hidden
                        onInput={(e) => {
                            const file = (e.target as HTMLInputElement).files?.[0];
                            if (file) {
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

                    {/* {imgSrc ? (
                                <button onClick={onRetake}>Retake photo</button>
                            ) : (
                                <button onClick={onCapture}>Capture photo</button>
                            )} */}
                </div>
            </section>
            {/* )} */}
            {/* {currentMode === "webcam-capture" && (
                <section id="webcam-capture" className="hidden">
                    {imgSrc ? (
                        <img src={imgSrc} alt="webcam" />
                    ) : (
                        <Webcam ref={webcamRef} className="w-full h-full"
                            forceScreenshotSourceSize
                            screenshotFormat="image/jpeg"
                            videoConstraints={{
                                width: { ideal: 4096 }, //up to 4k
                                height: { ideal: 2160 } //up to 4k
                            }} />
                    )}
                    <div className="btn-container">
                        {imgSrc ? (
                            <button onClick={onRetake}>Retake photo</button>
                        ) : (
                            <button onClick={onCaptureWebcam}>Capture photo</button>
                        )}
                    </div>
                </section>
            )} */}
        </div>
    );
}