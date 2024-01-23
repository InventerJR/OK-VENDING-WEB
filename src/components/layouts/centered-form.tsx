'use client d d'

import classNames from "classnames"

export const CenteredForms = ({
    children,
    backgroundImage = undefined,
    blur_bg = false
}: {
    children: React.ReactNode,
    backgroundImage?: string,
    blur_bg?: boolean
}) => {

    return (

        <div className={classNames({
            "flex flex-row min-h-screen items-center justify-center bg-cover relative": true,
            "bg-[#7f7fd5] bg-gradient-to-r from-[#86a8e7] to-[#91eae4]": backgroundImage === 'gradient'
        })}
            style={{
                backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
            }}>
            {blur_bg && <div className="backdrop-filter backdrop-blur-sm absolute left top-0 bottom-0 left-0 right-0 ">

            </div>}
            <div id="modal" className=" w-fit h-fit max-h-[85vh] max-w-2xl space-y-6 bg-white rounded-3xl shadow-lg z-10 overflow-clip">
                <div id="children-container" className="overflow-auto" style={{ maxHeight: '85vh' }}>
                    {children}
                </div>
            </div>
        </div>
    )
}