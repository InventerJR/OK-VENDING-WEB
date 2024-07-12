import { useCartContext } from "../cart.context";
import CartTableRow from "./data-table-row";

type Props = {
    onProductChange: (index: number, field: string, value: any) => void;
}

export default function CartDataTable({ onProductChange }: Props) {
    const { products } = useCartContext();

    return (
        <>
            <table className='w-full'>
                <thead >
                    <tr className='bg-[#2C3375] text-white'>
                        <th className='px-2 py-1 md:px-4 md:py-2 text-center'>Nombre</th>
                        <th className='px-2 py-1 md:px-4 md:py-2 text-center'>Producto</th>
                        <th className='px-2 py-1 md:px-4 md:py-2 text-center'>Cantidad</th>
                        <th className='px-2 py-1 md:px-4 md:py-2 text-center'>Cantidad por paquete</th>
                        <th className='px-2 py-1 md:px-4 md:py-2 text-center'>Caducidad</th>
                        <th className='px-2 py-1 md:px-4 md:py-2 text-center'>Precio unitario de compra </th>
                        <th className='px-2 py-1 md:px-4 md:py-2 text-center'></th>
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
