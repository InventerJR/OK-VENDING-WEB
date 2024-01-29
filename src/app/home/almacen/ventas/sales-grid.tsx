import Image from "next/image";
import classNames from "classnames";
import { useSalesAdminContext } from "./sales-admin.context";


export default function InventoryGrid() {

    const { products } = useSalesAdminContext();

    return (
        <>

<div className="gap-4 gap-y-6 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 self-center md:self-auto overflow-auto">
                {products.map((product) => (
                    <div className={classNames({
                        ' col-span-1 border rounded-2xl border-gray-200 hover:bg-gray-50 p-3': true,
                        'w-full': true
                    })} key={product.id}>
                        <div className=" flex flex-col gap-2 leading-none">
                            <div className=' flex items-center justify-center'>
                                <Image src={product.image} alt='product image' width={24} height={24} className='w-[60px] h-[80px] bg-red-200' />
                            </div>
                            <div className='font-bold'>{product.name}</div>

                            <div className="flex flex-row gap-2">
                                <span className="">Stock</span>
                                <div className=''>{product.stock}</div>
                            </div>
                            <div className=" text-center w-full">
                                <button type='button' className='bg-[#58B7A3] text-white text-sm px-6 p-2 rounded-md w-full'>
                                    Registrar
                                </button>
                            </div>
                        </div>



                    </div>
                ))}
            </div>
        </>
    )
}