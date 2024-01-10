import Image from "next/image"



export const CenteredForms = ({
    children,
}: {
    children: React.ReactNode
}) => {
    return (

        <div className="flex flex-row min-h-screen items-center justify-center bg-[#7f7fd5] bg-gradient-to-r from-[#86a8e7] to-[#91eae4] bg-cover"
            style={{
                backgroundImage: "url('/bg.png')",
            }}>
            <div className="backdrop-filter backdrop-blur-sm absolute left top-0 bottom-0 left-0 right-0 ">

            </div>
            <div className=" w-fit h-fit max-h-[75vh] max-w-2xl p-2 space-y-6 bg-white rounded-3xl shadow-md z-10 overflow-clip">
                {children}
            </div>
        </div>
    )
}