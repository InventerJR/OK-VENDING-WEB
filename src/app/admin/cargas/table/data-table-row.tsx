import Image from "next/image";
import { DataObject, usePageContext } from "../page.context";

type Props = {
    index: number;
    item: DataObject;
}

export default function DataTableRow(props: Props) {
    const { index, item } = props;


    return (
        <tr className='border-b border-gray-200 hover:bg-gray-100' key={item.id + '_' + index}>
            <td className='px-2 py-1 md:px-4 md:py-2'>{item.operator}</td>
            <td className='px-2 py-1 md:px-4 md:py-2'>{item.load}</td>
            <td className='px-2 py-1 md:px-4 md:py-2'>{item.plate}</td>
            <td className='px-2 py-1 md:px-4 md:py-2'>{item.last_service_date}</td>
            <td className='px-2 py-1 md:px-4 md:py-2 min-w-[90px]'>
                <div className='flex flex-row gap-3'>

                </div>
            </td>
        </tr>
    )
}