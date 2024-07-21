import React from 'react';
import Image from 'next/image';
import { DataObject, useCartContext } from '../cart.context';

type Props = {
    index: number;
    item: DataObject;
    onProductChange: (index: number, field: keyof DataObject, value: any) => void;
};

const CartTableRow: React.FC<Props> = ({ index, item, onProductChange }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof DataObject) => {
        onProductChange(index, field, e.target.value);
    };

    const { deleteObject } = useCartContext();

    const onDelete = () => {
        deleteObject(index);
    }

    return (
        <tr>
            <td className='px-2 py-1 md:px-4 md:py-2'>{item.name}</td>
            <td className='px-2 py-1 md:px-4 md:py-2'>
                <Image src={item.image} alt={item.name} width={50} height={50} />
            </td>
            <td className='px-2 py-1 md:px-4 md:py-2'>
                <input
                    type='number'
                    value={item.quantity}
                    onChange={(e) => handleChange(e, 'quantity')}
                    className='border border-gray-300 rounded-md h-[30px] p-1'
                />
            </td>
            <td className='px-2 py-1 md:px-4 md:py-2'>
                <div className='flex flex-row gap-3'>
                    <button type="button" onClick={onDelete} className='w-[22px]'>
                        <Image src='/img/actions/trash.svg' alt='delete icon' width={24} height={24} />
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default CartTableRow;