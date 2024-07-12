import Image from "next/image";
import { useCartContext, DataObject } from "../cart.context";
import classNames from "classnames";

type Props = {
    index: number;
    item: DataObject;
}

const CartTableTicketRow = (props: Props) => {
    const { index, item } = props;
    const { deleteObject } = useCartContext();

    const onDelete = () => {
        deleteObject(item.id);
    }

    return (
        <tr key={item.id + '_' + index}
            className={classNames({
                'border-b border-gray-200': true,
                'bg-gray-100': index % 2 === 0
            })}>
            {/* <td className='px-2 py-1 md:px-4 md:py-2'>{item.id}</td> */}
            <td className='px-2 py-1 md:px-4 md:py-2'>{item.name}</td>
            <td className='px-2 py-1 md:px-4 md:py-2'>{item.stock}</td>
            <td className='px-2 py-1 md:px-4 md:py-2'>{item.sale_price}</td>
            <td className='px-2 py-1 md:px-4 md:py-2'></td>
            <td className='px-2 py-1 md:px-4 md:py-2'></td>
        </tr>
    );
};
export default CartTableTicketRow;