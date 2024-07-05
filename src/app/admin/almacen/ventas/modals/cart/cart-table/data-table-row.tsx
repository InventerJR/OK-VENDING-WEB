import Image from "next/image";
import { useCartContext } from "../cart.context";
import classNames from "classnames";

type Props = {
    index: number;
    item: any;
}

export default function CartTableRow(props: Props) {
    const { index, item } = props;
    const { deleteObject, quantities } = useCartContext();

    const onDelete = () => {
        deleteObject(item);
    }

    return (
        <tr key={item.id + '_' + index}
            className={classNames({
                'border-b border-gray-200': true,
                'bg-gray-100': index % 2 === 0
            })}>
            <td className='px-2 py-1 md:px-4 md:py-2'>{item.product.name}</td>
            <td className='px-2 py-1 md:px-4 md:py-2'>
                <div className=' w-full flex flex-row justify-center '>
                    <Image src={item.product.image} alt={item.product.name} width={40} height={40} className="bg-gray-200" />
                </div>
            </td>
            <td className='px-2 py-1 md:px-4 md:py-2'>
                <div>
                    <input type="number" value={quantities[item.product.id] || ''} className="rounded-lg border border-gray-400 w-24" disabled />
                </div>
            </td>
            <td className='px-2 py-1 md:px-4 md:py-2'>
                <div>{item.product.brand_name}</div>
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
