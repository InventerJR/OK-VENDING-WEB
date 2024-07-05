import React from 'react';
import Image from 'next/image';
import { DataObject, usePageContext } from "../page.context";

type Props = {
    index: number;
    item: DataObject;
}

const DataTableRow = (props: Props) => {
    const { index, item } = props;
    const { brands, editObject, deleteObject, setSelectedProduct } = usePageContext();

    const onEdit = () => {
        editObject(item.uuid);
        setSelectedProduct(item.uuid);
    }

    const onDelete = () => {
        deleteObject(item);
    }

    // Convert brand_uuid to brand name
    const brandName = brands.find(brand => brand.uuid === item.brand_uuid)?.name || "Sin marca";

    return (
        <tr className='border-b border-gray-200 hover:bg-gray-100' key={item.id + '_' + index}>
            <td className='px-2 py-1 md:px-4 md:py-2'>{item.name}</td>
            <td className='px-2 py-1 md:px-4 md:py-2'>
                <div>
                    <Image src={item.image || ''} alt={item.name} width={60} height={60} className='w-[60px] h-[60px] bg-gray-200' />
                </div>
            </td>
            <td className='px-2 py-1 md:px-4 md:py-2'>{brandName}</td>
            <td className='px-2 py-1 md:px-4 md:py-2'>{item.grammage}</td>
            <td className='px-2 py-1 md:px-4 md:py-2'>{item.sale_price}</td>
            <td className='px-2 py-1 md:px-4 md:py-2 min-w-[90px]'>
                <div className='flex flex-row gap-3'>
                    <button type="button" onClick={onEdit} className=''>
                        <Image src='/img/actions/edit.svg' alt='edit icon' width={24} height={24} className='w-[24px] h-[24px]' />
                    </button>
                    <button type="button" onClick={onDelete} className=''>
                        <Image src='/img/actions/trash.svg' alt='delete icon' width={24} height={24} className='w-[24px] h-[24px]' />
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default DataTableRow;
