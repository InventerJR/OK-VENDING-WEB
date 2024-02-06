import Image from "next/image";
import { useInventoryAdminContext } from "./inventory-admin.context";


export default function UsersTable() {

    const { products } = useInventoryAdminContext();

    return (
        <>
            <p className="w-full text-right">Valor actual del inventario <span className="font-bold">$20,000.00</span></p>
            <table className='w-full'>
                <thead >
                    <tr className='bg-[#2C3375] text-white'>
                        <th className='px-4 py-2 text-left min-w-[140px]'>Nombre</th>
                        <th className='px-4 py-2 text-left'>Producto</th>
                        <th className='px-4 py-2 text-left'>Precio Compra</th>
                        <th className='px-4 py-2 text-left'>Precio Venta</th>
                        <th className='px-4 py-2 text-left'>Stock</th>
                        <th className='px-4 py-2 text-left'>Inversión</th>
                        <th className='px-4 py-2 text-left'></th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr className='border-b border-gray-200 hover:bg-gray-100' key={product.id}>
                            <td className='pl-4 py-2'>{product.name}</td>
                            <td className='px-4 py-2 flex items-center justify-center'>
                                <Image src={product.image} alt='product image' width={24} height={24} className='w-[60px] h-[80px] ' />
                            </td>
                            <td className='px-4 py-2'>{product.purchase_price}</td>
                            <td className='px-4 py-2'>{product.sale_price}</td>
                            <td className='px-4 py-2'>{product.stock}</td>
                            <td className='px-4 py-2'>{product.investment}</td>
                            <td className='px-4 py-2'>
                                {/* <div className='flex flex-row gap-3'>
                                    <button type="button" onClick={openUpdate} className=''>
                                        <Image src='/img/actions/edit.svg' alt='edit icon' width={24} height={24} className='w-[24px] h-[24px]' />
                                    </button>
                                    <button type="button" onClick={openDelete} className=''>
                                        <Image src='/img/actions/trash.svg' alt='edit icon' width={24} height={24} className='w-[24px] h-[24px]' />
                                    </button>
                                </div> */}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    )
}