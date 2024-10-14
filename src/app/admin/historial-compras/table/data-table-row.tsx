import React from 'react';
import Image from 'next/image';
import { PurchaseDataObject, useContextPurchase } from '../page.context';
import TooltipDefault from '@/components/tooltip-default';

type Props = {
    index: number;
    item: PurchaseDataObject;
};

const DataTableRow = ({ index, item }: Props) => {
    const { setSelectedPurchase } = useContextPurchase();
    
    const isImage = /\.(jpg|jpeg|png|gif)$/i.test(item.ticket_image);

    const handleViewDetails = () => {
        setSelectedPurchase(item);
    };

    return (
        <tr className='border-b border-gray-200 hover:bg-gray-100' key={item.ticket_id + '_' + index}>
            <td className='px-2 py-1 md:px-4 md:py-2'>{item.ticket_id}</td>
            <td className='px-2 py-1 md:px-4 md:py-2'>{item.supplier}</td>
            <td className='px-2 py-1 md:px-4 md:py-2'>${item.total_amount}</td>
            <td className='px-2 py-1 md:px-4 md:py-2'>{new Date(item.purchase_date).toLocaleDateString()}</td>
            <td className='px-2 py-1 md:px-4 md:py-2'>
                {isImage ? (
                    <Image
                        src={item.ticket_image}
                        alt="Imagen del Ticket"
                        width={50}
                        height={50}
                        className="w-[50px] h-[50px] rounded-md object-cover"
                    />
                ) : (
                    <span className="text-red-500">Formato no válido</span>
                )}
            </td>
            <td className='px-2 py-1 md:px-4 md:py-2'>
                <div className='flex flex-row gap-3'>
                    <TooltipDefault tooltip="Ver Detalle">
                        <button type="button" onClick={handleViewDetails}>
                            <Image src='/img/actions/stock.svg' alt='view icon' width={24} height={24} className='w-[24px] h-[24px]' />
                        </button>
                    </TooltipDefault>
                </div>
            </td>
        </tr>
    );
};

export default DataTableRow;
