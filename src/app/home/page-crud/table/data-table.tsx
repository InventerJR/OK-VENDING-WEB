import Image from "next/image";
import { DataObject, usePageContext } from "../page.context";
import DataTableRow from "./data-table-row";


export default function DataTable() {

    const { data, createObject, editObject, deleteObject } = usePageContext();

    return (
        <>
            <table className='w-full'>
                <thead >
                    <tr className='bg-[#2C3375] text-white'>
                        <th className='px-2 py-1 md:px-4 md:py-2 text-left'>Id</th>
                        <th className='px-2 py-1 md:px-4 md:py-2 text-left'>Name</th>
                        <th className='px-2 py-1 md:px-4 md:py-2 text-left'></th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) =>
                        <DataTableRow
                            key={item.id + '_' + index}
                            index={index}
                            item={item}
                        />
                    )}
                </tbody>
            </table>
        </>
    )
}