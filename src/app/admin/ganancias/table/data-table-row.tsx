import Image from "next/image";
import { DataObject, usePageContext } from "../page.context";
import { useRouter } from "next/navigation";
import { APP_ROUTES } from "@/constants";
import { formatPrice } from "@/utils/formatPrice";

type Props = {
    index: number;
    item: DataObject;
}

const DataTableRow = (props: Props) => {
    const { index, item } = props;
    const { editObject, deleteObject } = usePageContext();
    const router = useRouter();

    const onEdit = () => {
        editObject(item);
    }

    const onDelete = () => {
        deleteObject(item);
    }

    const rowClicked = () => {
        console.log('row clicked');
        router.push(APP_ROUTES.ADMIN.PROFIT_DETAIL + "?id=" + item.id);
    }

    const formatDate = (dateString: string | number | Date) => {
        const date = new Date(dateString);
        date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
        return date.toLocaleDateString('es-MX');
    }

    return (
        <tr className='border-b border-gray-200 hover:bg-gray-100' key={item.id + '_' + index}>
            <td className='px-2 py-1 md:px-4 md:py-2'>{item.type === 'ganancias' ? formatDate(item.visit_date) : formatDate(item.date)}</td>
            <td className='px-2 py-1 md:px-4 md:py-2'>{item.type === 'ganancias' ? item.operator : item.dispatcher}</td>
            <td className='px-2 py-1 md:px-4 md:py-2'>{item.type === 'ganancias' ? item.machine_name : item.movement_type}</td>
            <td className='px-2 py-1 md:px-4 md:py-2'>{item.type === 'ganancias' ? formatPrice(item.sale) : formatPrice(item.incoming)}</td>
            <td className='px-2 py-1 md:px-4 md:py-2'>{item.type === 'ganancias' ? formatPrice(item.cash_left) : formatPrice(item.outgoing)}</td>
        </tr>
    );
};
export default DataTableRow;