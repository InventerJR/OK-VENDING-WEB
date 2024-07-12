import { DataObject, useCartContext } from "../cart.context";
import CartTableRow from "./data-table-row";

type Props = {
    onProductChange: (index: number, field: keyof DataObject, value: any) => void;
}

export default function CartDataTable({ onProductChange }: Props) {
    const { products } = useCartContext();

    return (
        <>
            <table className='w-full'>
                <thead >
                    <tr className='bg-[#2C3375] text-white'>
                        <th className='px-2 py-1 md:px-4 md:py-2 text-left'>Nombre</th>
                        <th className='px-2 py-1 md:px-4 md:py-2 text-left'>Producto</th>
                        <th className='px-2 py-1 md:px-4 md:py-2 text-left'>Cantidad</th>
                        <th className='px-2 py-1 md:px-4 md:py-2 text-left'></th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((item, index) =>
                        <CartTableRow
                            key={item.id + '_' + index}
                            index={index}
                            item={item}
                            onProductChange={onProductChange}
                        />
                    )}
                </tbody>
            </table>
        </>
    );
}