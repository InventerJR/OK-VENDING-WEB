import Image from "next/image";
import { DataObject, usePageContext } from "../page.context";
import { useRouter } from "next/navigation";
import { APP_ROUTES } from "@/constants";

type Props = {
    index: number;
    item: DataObject;
}

export default function DataTableRow(props: Props) {
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

    return (
        <tr role="button" className='border-b border-gray-200 hover:bg-gray-100 cursor-pointer' key={item.id + '_' + index}
            onClick={rowClicked}>
            <td className='px-2 py-1 md:px-4 md:py-2'>{item.operator}</td>
            <td className='px-2 py-1 md:px-4 md:py-2'>{item.name}</td>
            <td className='px-2 py-1 md:px-4 md:py-2'>{!!item.pictures}</td>
            <td className='px-2 py-1 md:px-4 md:py-2'>{item.sales}</td>
            <td className='px-2 py-1 md:px-4 md:py-2'>{item.total_amount}</td>
            <td className='px-2 py-1 md:px-4 md:py-2'>{item.last_visit_date}</td>
            {/* <td className='px-2 py-1 md:px-4 md:py-2 min-w-[90px]'>
                <div className='flex flex-row gap-3'>
                    <button id="edit" type="button" onClick={onEdit} className=''>
                        <Image src='/img/actions/edit.svg' alt='edit icon' width={24} height={24} className='w-[24px] h-[24px]' />
                    </button>
                    <button id="delete" type="button" onClick={onDelete} className=''>
                        <Image src='/img/actions/trash.svg' alt='edit icon' width={24} height={24} className='w-[24px] h-[24px]' />
                    </button>
                </div>
            </td> */}
        </tr>
    )
}