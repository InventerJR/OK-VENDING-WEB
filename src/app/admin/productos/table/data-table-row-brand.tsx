import { useState } from "react";
import Image from "next/image";
import { BrandDataObject, usePageContext } from "../page.context";

type Props = {
    index: number;
    brand: BrandDataObject;
};

const BrandTableRow = (props: Props) => {
    const { index, brand } = props;
    const { editObject, deleteBrandObject } = usePageContext();

    const onDelete = () => {
        deleteBrandObject(brand); // Aquí puedes agregar la lógica para eliminar la marca
    };

    return (
        <tr className="border-b border-gray-200 hover:bg-gray-100" key={brand + "_" + index}>
            <td className="px-2 py-1 md:px-4 md:py-2">{brand.name}</td>
            <td className="px-2 py-1 md:px-4 md:py-2 min-w-[90px]">
                <div className="flex flex-row gap-3">
                    <button type="button" onClick={onDelete} className="">
                        {/* delete */}
                        <Image
                            src="/img/actions/trash.svg"
                            alt="edit icon"
                            width={24}
                            height={24}
                            className="w-[24px] h-[24px]"
                        />
                    </button>
                </div>
            </td>
        </tr>
    );
};
export default BrandTableRow;