import Image from "next/image";
import { useCartContext, DataObject } from "../cart.context";
import classNames from "classnames";

type Props = {
    index: number;
    item: DataObject;
    onProductChange: (index: number, field: string, value: any) => void; // Añadir esta prop
}

export default function CartTableRow(props: Props) {
    const { index, item, onProductChange } = props;
    const { deleteObject } = useCartContext();

    const onDelete = () => {
        deleteObject(index);
    }

    const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        onProductChange(index, field, event.target.value);
    }

    return (
        <tr key={item.id + '_' + index}
            className={classNames({
                'border-b border-gray-200': true,
                'bg-gray-100': index % 2 === 0
            })}>
            <td className='px-2 py-1 md:px-4 md:py-2'>{item.name}</td>
            <td className='px-2 py-1 md:px-4 md:py-2'>
                <div className=' w-full flex flex-row justify-center '>
                    <Image src={item.image} alt={item.name} width={40} height={40} className="bg-gray-200" />
                </div>
            </td>
            <td className='px-2 py-1 md:px-4 md:py-2'>
                <div>
                    <input 
                        type="number" 
                        className="rounded-lg border border-gray-400 w-24"
                        value={item.quantity}
                        onChange={handleChange('quantity')}
                    />
                </div>
            </td>
            <td className='px-2 py-1 md:px-4 md:py-2 text-center'>
                <div>
                    <input 
                        type="number" 
                        className="rounded-lg border border-gray-400 w-24"
                        value={item.package_quantity}
                        onChange={handleChange('package_quantity')}
                    />
                </div>
            </td>
            <td className='px-2 py-1 md:px-4 md:py-2'>
                <div>
                    <input 
                        type="date" 
                        className="rounded-lg border border-gray-400 w-24"
                        value={item.expiration}
                        onChange={handleChange('expiration')}
                    />
                </div>
            </td>
            <td className='px-2 py-1 md:px-4 md:py-2 text-center'>
                <div>
                    <input 
                        type="number" 
                        className="rounded-lg border border-gray-400 w-24"
                        value={item.purchase_price}
                        onChange={handleChange('purchase_price')}
                    />
                </div>
            </td>
            <td className='px-2 py-1 md:px-4 md:py-2'>
                <div className='flex flex-row gap-3'>
                    <button type="button" onClick={onDelete} className='w-[22px]'>
                        <Image src='/img/actions/trash.svg' alt='delete icon' width={24} height={24} />
                    </button>
                </div>
            </td>
        </tr>
    )
}
