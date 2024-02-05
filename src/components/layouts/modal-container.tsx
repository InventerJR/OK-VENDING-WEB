import classNames from 'classnames';
import React, { ReactNode, useEffect, useState } from 'react'

interface ModalContainerProps {
    visible?: boolean;
    auto_width?: boolean;
    children?: ReactNode;
    onClose?: () => void; // Add a function prop for closing the modal
}

const ModalContainer = ({ visible, children, auto_width = true, onClose }: ModalContainerProps) => {

    // Call the onClose prop if the backdrop is clicked
    const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (event.target === event.currentTarget && onClose) {
            onClose();
        }
    }

    // Prevent the modal click from propagating to the backdrop
    const handleModalClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation();
    }

    // debounced visible value for smooth transition and hidding the content after the transition
    const [debouncedVisible, setDebouncedVisible] = useState(visible);
    useEffect(() => {
        if (visible) {
            setDebouncedVisible(true);
        } else {
            const timeout = setTimeout(() => {
                setDebouncedVisible(false);
            }, 500);
            return () => clearTimeout(timeout);
        }
    }, [visible]);

    return (
        <div className={
            classNames({
                "fixed top-[60px]  md:top-0 bottom-0 z-10 inset-0 flex items-center justify-center overflow-x-hidden  bg-[#000] transition-all duration-500 ease-in-out": true,
                "bg-opacity-50 backdrop-filter backdrop-blur-[3px]": visible,
                // backdrop-grayscale
                " bg-opacity-0 pointer-events-none select-none": !visible
            })
        }
        style={{ transition: "height 0s width 80ms" }}
            onClick={handleBackdropClick}>
                
            <div className={classNames({
                " h-[80dvh] overflow-y-auto bg-white rounded-3xl shadow-lg m-2  flex flex-col transition-all duration-[400ms] ease-in-out": true,
                "opacity-100 translate-y-0": visible,
                "opacity-0 -translate-y-20": !visible,
                "w-96 md:w-3/4 lg:w-1/2 min-h-[120px]": auto_width,
            })}
                onClick={handleModalClick}>
                <div className='overflow-y-auto flex flex-col'>
                    {debouncedVisible && children}
                </div>
            </div>
        </div>
    )
}


export default ModalContainer