import { DataObject, usePageContext } from "../page.context";
import { formatPrice } from "@/utils/formatPrice";

type Props = {
    index: number;
    item: DataObject;
};

const DataTableRow = (props: Props) => {
    const { index, item } = props;
    const { editObject, deleteObject } = usePageContext();

    const onEdit = () => {
        editObject(item);
    };

    const onDelete = () => {
        deleteObject(item);
    };

    const formatDate = (dateString: string | number | Date) => {
        const date = new Date(dateString);
        date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
        return date.toLocaleDateString('es-MX');
    }

    return (
        <tr className='border-b border-gray-200 hover:bg-gray-100' key={item.id + '_' + index}>
            <td className='px-2 py-1 md:px-4 md:py-2'>{formatDate(item.date)}</td>
            <td className='px-2 py-1 md:px-4 md:py-2'>{item.dispatcher}</td>
            <td className='px-2 py-1 md:px-4 md:py-2'>{item.movement_type}</td>
            <td className='px-2 py-1 md:px-4 md:py-2'>{formatPrice(item.incoming)}</td>
            <td className='px-2 py-1 md:px-4 md:py-2'>{formatPrice(item.outgoing)}</td>
        </tr>
    );
};

export default DataTableRow;
