import Image from "next/image";
import { DataObject, useSalesAdminContext } from "../sales-admin.context";
import TooltipDefault from "@/components/tooltip-default";
import Link from "next/link";
import { APP_ROUTES } from "@/constants";
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

type Props = {
    index: number;
    item: DataObject;
};

const DataTableRow = (props: Props) => {
    const { index, item } = props;
    const { editObject, deleteObject, setSelectedWagon, users } = useSalesAdminContext();

    const onEdit = () => {
        editObject(item);
        setSelectedWagon(item);
        localStorage.setItem('selectedWagonUUID', item.uuid); // Guarda el UUID en el localStorage
    };

    const onDelete = () => {
        setSelectedWagon(item);
        localStorage.setItem('selectedWagonUUID', item.uuid); // Guarda el UUID en el localStorage
        deleteObject(item); // Pasar el objeto en lugar del ID
    };

    const driver = users.find(user => user.uuid === item.driver.uuid);
    const driverName = driver ? `${driver.first_name} ${driver.last_name}` : 'No asignado';

    const formatDate = (dateString: string | number | Date) => {
        const date = new Date(dateString);
        date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
        return date.toLocaleDateString('es-MX');
    }
    return (
        <tr className='border-b border-gray-200 hover:bg-gray-100' key={item.id + '_' + index}>
            <td className='px-2 py-1 md:px-4 md:py-2'>{item.plate}</td>
            <td className='px-2 py-1 md:px-4 md:py-2'>{driverName}</td>
            <td className='px-2 py-1 md:px-4 md:py-2'>{formatDate(item.last_service_date)}</td>
            <td className='px-2 py-1 md:px-4 md:py-2'>{item.tank}</td>
            <td className='px-2 py-1 md:px-4 md:py-2'>{item.consumption}</td>
            <td className='px-2 py-1 md:px-4 md:py-2'>{item.mileage}</td>
            <td className='px-2 py-1 md:px-4 md:py-2'>{item.cash}</td>
            <td className='px-2 py-1 md:px-4 md:py-2'>{formatDate(item.insurance_end_date)}</td>
            <td className='px-2 py-1 md:px-4 md:py-2 min-w-[90px]'>
                <div className='flex flex-row gap-3'>
                <TooltipDefault tooltip="Inventario">
                        <Link href={APP_ROUTES.ADMIN.STOCK_WAGGON}>
                            <button type="button" onClick={() => localStorage.setItem('selectedWagonUUID', item.uuid)}>
                                <Image src='/img/actions/stock.svg' alt='stock icon' width={24} height={24} className='w-[24px] h-[24px]' />
                            </button>
                        </Link>
                    </TooltipDefault>
                    <button type="button" onClick={onEdit} className=''>
                        <Image src='/img/actions/edit.svg' alt='edit icon' width={24} height={24} className='w-[24px] h-[24px]' />
                    </button>
                    <button type="button" onClick={onDelete} className=''>
                        <Image src='/img/actions/trash.svg' alt='edit icon' width={24} height={24} className='w-[24px] h-[24px]' />
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default DataTableRow;
