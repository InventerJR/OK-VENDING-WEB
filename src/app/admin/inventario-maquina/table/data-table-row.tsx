import Image from "next/image";
import { StockDataObject, usePageContext } from "../page.context";

type Props = {
    index: number;
    item: StockDataObject;
}

export default function DataTableRow(props: Props) {
    const { index, item } = props;
    const { editObject, deleteObject } = usePageContext();

    const onEdit = () => {
        editObject(item);
    }

    const onDelete = () => {
        deleteObject(item);
    }

    return (
        <tr className='border-b border-gray-200 hover:bg-gray-100' key={item.id + '_' + index}>
            <td className='px-2 py-1 md:px-4 md:py-2'>{item.name}</td>
            <td className='px-2 py-1 md:px-4 md:py-2'>
                <div>
                    <Image src={item.image || ''} alt={item.name} width={60} height={60} className='w-[60px] h-[60px] bg-gray-200' />
                </div>
            </td>
            <td className='px-2 py-1 md:px-4 md:py-2'>{item.category_name}</td>
            <td className='px-2 py-1 md:px-4 md:py-2'>{item.sale_price}</td>
            <td className='px-2 py-1 md:px-4 md:py-2'>{item.stock}</td>
            <td className='px-2 py-1 md:px-4 md:py-2'>{item.investment}</td>
        </tr>
    );
}
