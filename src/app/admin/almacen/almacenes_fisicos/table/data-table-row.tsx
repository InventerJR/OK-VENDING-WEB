import Image from "next/image";
import { DataObject, usePurchasesAdminContext } from "../purchases-admin.context";
import TooltipDefault from "@/components/tooltip-default";
import Link from "next/link";
import { APP_ROUTES } from "@/constants";

type Props = {
    index: number;
    item: DataObject;
};

const DataTableRow = (props: Props) => {
    const { index, item } = props;
    const { editObject, deleteObject, setSelectedWarehouse } = usePurchasesAdminContext();

    const onEdit = () => {
        editObject(item);
        setSelectedWarehouse(item);
    };

    const onDelete = () => {
        setSelectedWarehouse(item); // Asegúrate de que el objeto se pase correctamente aquí
        localStorage.setItem('selectedWarehouseUUID', item.uuid); // Guarda el UUID en el localStorage
        deleteObject(item.id);
    };

    return (
        <tr className='border-b border-gray-200 hover:bg-gray-100' key={item.id + '_' + index}>
            {/* <td className='px-2 py-1 md:px-4 md:py-2'>{item.id}</td> */}
            <td className='px-2 py-1 md:px-4 md:py-2'>{item.name}</td>
            <td className='px-2 py-1 md:px-4 md:py-2'>{item.zipcode}</td>
            <td className='px-2 py-1 md:px-4 md:py-2'>{item.address}</td>
            <td className='px-2 py-1 md:px-4 md:py-2'>{item.phone}</td>
            <td className='px-2 py-1 md:px-4 md:py-2 min-w-[90px]'>
                <div className='flex flex-row gap-3'>
                    <TooltipDefault tooltip="Inventario">
                        <Link href={APP_ROUTES.ADMIN.STOCK_WAREHOUSE} className='w-2/3 md:w-[30%]'>
                            <button type="button" className=''>
                                {/* delete */}
                                <Image src='/img/actions/stock.svg' alt='edit icon' width={24} height={24} className='w-[24px] h-[24px]' />
                            </button>
                        </Link>
                    </TooltipDefault>

                    <button type="button" onClick={onEdit} className=''>
                        {/* edit */}
                        <Image src='/img/actions/edit.svg' alt='edit icon' width={24} height={24} className='w-[24px] h-[24px]' />
                    </button>
                    <button type="button" onClick={onDelete} className=''>
                        {/* delete */}
                        <Image src='/img/actions/trash.svg' alt='edit icon' width={24} height={24} className='w-[24px] h-[24px]' />
                    </button>
                </div>
            </td>
        </tr>
    );
};
export default DataTableRow;
