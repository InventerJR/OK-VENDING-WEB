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
            "flex flex-col items-center h-dvh bg-cover overflow-y-auto p-6": true,
            "bg-[#7f7fd5] bg-gradient-to-r from-[#86a8e7] to-[#91eae4]": backgroundImage === 'gradient'
        })}
            style={{
                backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
                justifyItems: 'center safe',
            }}>
            {blur_bg && <div className="backdrop-filter backdrop-blur-sm absolute left top-0 bottom-0 left-0 right-0">

            </div>}
            <div id="modal" className="bg-white rounded-3xl shadow-lg z-10 h-fit m-auto">
                {children}
            </div>
        </div>
    )
}