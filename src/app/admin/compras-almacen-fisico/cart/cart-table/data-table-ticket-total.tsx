import Image from "next/image";
import { DataObject, useCartContext } from "../cart.context";
import DataTableTicketRow from "./data-table-ticket-row";
import DataTableTicketTotalRow from "./data-table-ticket-total";


const DataTableTicketTotal = () => {

    const { products, deleteObject } = useCartContext();

    return (
        <>
            <table className='w-full'>
                <thead >
                    <tr className='bg-[#2C3375] text-white'>
                        {/* <th className='px-2 py-1 md:px-4 md:py-2 text-left'>Id</th> */}
                        <th className='px-2 py-1 md:px-4 md:py-2 text-left'>Total</th>
                        <th className='px-2 py-1 md:px-4 md:py-2 text-left'></th>
                    </tr>
                </thead>
                <tbody>
                    <th>
                        Total
                    </th>
                </tbody>
            </table>
        </>
    );
};
export default DataTableTicketTotal;