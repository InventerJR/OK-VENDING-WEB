import { useState } from "react";
import Image from "next/image";
import { useUsersAdminContext } from "./users-admin.context";

const UsersTable = () => {
    const {
        users,
        setIsOpenUpdateModal,
        setIsOpenDeleteModal,
        setSelectUser,
    } = useUsersAdminContext();

    // Paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); // Número de elementos por página

    // Calcula el índice de inicio y fin de los elementos a mostrar en la página actual
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // Filtra los datos para mostrar solo los elementos de la página actual
    const currentData = users.slice(startIndex, endIndex);

    // Calcula el número total de páginas
    const totalPages = Math.ceil(users.length / itemsPerPage);

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const openUpdate = (user: any) => {
        setSelectUser(user);
        setIsOpenUpdateModal(true);
    };

    const openDelete = (user: any) => {
        setSelectUser(user);
        setIsOpenDeleteModal(true);
    };

    return (
        <>
            <table className="w-full">
                <thead>
                    <tr className="bg-[#2C3375] text-white">
                        <th className="px-2 py-1 md:px-4 md:py-2 text-left">Nombre</th>
                        <th className="px-2 py-1 md:px-4 md:py-2 text-left">Teléfono</th>
                        <th className="px-2 py-1 md:px-4 md:py-2 text-left">Email</th>
                        <th className="px-2 py-1 md:px-4 md:py-2 text-left">Tipo</th>
                        <th className="px-2 py-1 md:px-4 md:py-2 text-left"></th>
                    </tr>
                </thead>
                <tbody>
                    {currentData.map((user, index) => (
                        <tr
                            className="border-b border-gray-200 hover:bg-gray-100"
                            key={user.uuid} // Utiliza el UUID como clave
                        >
                            <td className="px-2 py-1 md:px-4 md:py-2">{user.first_name}</td>
                            <td className="px-2 py-1 md:px-4 md:py-2">{user.phone}</td>
                            <td className="px-2 py-1 md:px-4 md:py-2">{user.email}</td>
                            <td className="px-2 py-1 md:px-4 md:py-2">{user.type_user}</td>
                            <td className="px-2 py-1 md:px-4 md:py-2 min-w-[90px]">
                                <div className="flex flex-row gap-3">
                                    <button
                                        type="button"
                                        onClick={() => openUpdate(user)}
                                        className=""
                                    >
                                        <Image
                                            src="/img/actions/edit.svg"
                                            alt="edit icon"
                                            width={24}
                                            height={24}
                                            className="w-[24px] h-[24px]"
                                        />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => openDelete(user)}
                                        className=""
                                    >
                                        <Image
                                            src="/img/actions/trash.svg"
                                            alt="delete icon"
                                            width={24}
                                            height={24}
                                            className="w-[24px] h-[24px]"
                                        />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* Paginación */}
            <div className="mt-4 flex justify-center">
                <ul className="flex gap-2">
                    {/* Botón de página anterior */}
                    {currentPage > 1 && (
                        <li>
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300"
                            >
                                Anterior
                            </button>
                        </li>
                    )}
                    {/* Botones de número de página */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                            <li key={page}>
                                <button
                                    onClick={() => handlePageChange(page)}
                                    className={`px-3 py-1 rounded-md ${page === currentPage
                                        ? "bg-[#2C3375] text-white hover:bg-blue-600"
                                        : "bg-gray-200 hover:bg-gray-300"
                                        }`}
                                >
                                    {page}
                                </button>
                            </li>
                        )
                    )}
                    {/* Botón de página siguiente */}
                    {currentPage < totalPages && (
                        <li>
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300"
                            >
                                Siguiente
                            </button>
                        </li>
                    )}
                </ul>
            </div>
        </>
    );
};

export default UsersTable;
