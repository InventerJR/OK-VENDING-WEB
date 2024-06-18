import Image from "next/image";
import { DataObject, useCartContext } from "../cart.context";
import DataTableRow from "./data-table-row";


export default function CartDataTable() {

    const { products, deleteObject } = useCartContext();

    return (
        <>
            <table className='w-full'>
                <thead >
                    <tr className='bg-[#2C3375] text-white'>
                        {/* <th className='px-2 py-1 md:px-4 md:py-2 text-left'>Id</th> */}
                        <th className='px-2 py-1 md:px-4 md:py-2 text-left'>Nombre</th>
                        <th className='px-2 py-1 md:px-4 md:py-2 text-left'>Producto</th>
                        <th className='px-2 py-1 md:px-4 md:py-2 text-left'>Cantidad</th>
                        <th className='px-2 py-1 md:px-4 md:py-2 text-left'>Marca</th>
                        <th className='px-2 py-1 md:px-4 md:py-2 text-left'></th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((item, index) =>
                        <DataTableRow
                            key={item.id + '_' + index}
                            index={index}
                            item={item}
                        />
                    )}
                </tbody>
            </table>
        </>
    )
}