import Image from "next/image";
import { useCartContext, DataObject } from "../cart.context";
import classNames from "classnames";

type Props = {
    index: number;
    item: DataObject;
}

export default function CartTableRow(props: Props) {
    const { index, item } = props;
    const { deleteObject } = useCartContext();

    const onDelete = () => {
        deleteObject(item);
    }

    return (
        <tr key={item.id + '_' + index}
            className={classNames({
                'border-b border-gray-200': true,
                'bg-gray-100': index % 2 === 0
            })}>
            {/* <td className='px-2 py-1 md:px-4 md:py-2'>{item.id}</td> */}
            <td className='px-2 py-1 md:px-4 md:py-2'>{item.name}</td>
            <td className='px-2 py-1 md:px-4 md:py-2'>
                {/* product image */}
                <div className=' w-full flex flex-row justify-center '>
                    <Image src={item.image} alt={item.name} width={40} height={40} className="bg-gray-200" />
                </div>
            </td>
            <td className='px-2 py-1 md:px-4 md:py-2'>
                {/* quantity */}
                <div>
                    <input type="number" className="rounded-lg border border-gray-400 w-24" />
                </div>
            </td>
            <td className='px-2 py-1 md:px-4 md:py-2'>
                {/* proveedor */}
                <div>
                    <select className=" rounded-lg border border-gray-400" >
                        <option value="proveedor1">Marca 1 </option>
                        <option value="proveedor2">Marca 2</option>
                    </select>
                </div>
            </td>
            <td className='px-2 py-1 md:px-4 md:py-2'>
                <div className='flex flex-row gap-3'>
                    <button type="button" onClick={onDelete} className='w-[22px]'>
                        {/* delete */}
                        <Image src='/img/actions/trash.svg' alt='edit icon' width={24} height={24} />
                    </button>
                </div>
            </td>
        </tr>
    )
}