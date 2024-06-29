import React from 'react';
import Image from 'next/image';
import { BrandDataObject, usePageContext } from '../page.context';
import TooltipDefault from '@/components/tooltip-default';

type Props = {
    index: number;
    item: BrandDataObject;
};

const BrandTableRow = (props: Props) => {
    const { index, item } = props;
    const { deleteBrand, setSelectedBrand } = usePageContext();

    const onDelete = () => {
        setSelectedBrand(item);
        deleteBrand(item);
    };

    return (
        <tr className='border-b border-gray-200 hover:bg-gray-100' key={item.id + '_' + index}>
            <td className='px-2 py-1 md:px-4 md:py-2'>{item.name}</td>
            <td className='px-2 py-1 md:px-4 md:py-2 min-w-[90px]'>
                <div className='flex flex-row gap-3'>
                    <TooltipDefault tooltip="Eliminar">
                        <button type="button" onClick={onDelete} className=''>
                            <Image src='/img/actions/trash.svg' alt='delete icon' width={24} height={24} className='w-[24px] h-[24px]' />
                        </button>
                    </TooltipDefault>
                </div>
            </td>
        </tr>
    );
};

export default BrandTableRow;
