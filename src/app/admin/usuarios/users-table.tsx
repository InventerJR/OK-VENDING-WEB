import Image from "next/image";
import { useUsersAdminContext } from "./users-admin.context";
import { useEffect } from "react";
import { localStorageWrapper } from '@/utils/localStorageWrapper';

const UsersTable = () => {
    const {
        users,
        setIsOpenUpdateModal,
        setIsOpenDeleteModal,
        setSelectUser,
        fetchUsers,
        currentPage,
        totalPages,
        nextUrl,
        prevUrl
    } = useUsersAdminContext();

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handlePageChange = (url: string) => {
        fetchUsers(url);
    };

    const openUpdate = (user: any) => {
        localStorageWrapper.setItem('selectedUserUUID', user.uuid);
        setSelectUser(user);
        setIsOpenUpdateModal(true);
    };

    const openDelete = (user: any) => {
        localStorageWrapper.setItem('selectedUserUUID', user.uuid);
        setSelectUser(user);
        setIsOpenDeleteModal(true);
    };

    const getUserType = (type_user: number) => {
        switch (type_user) {
            case 1:
                return 'Administrador';
            case 2:
                return 'Supervisor';
            case 3:
                return 'Operador';
            case 4:
                return 'Almacenista';
            default:
                return '';
        }
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
                    {users.map((user, index) => (
                        <tr
                            className="border-b border-gray-200 hover:bg-gray-100"
                            key={user.id + "_" + index}
                        >
                            <td className="px-2 py-1 md:px-4 md:py-2">
                                {`${user.first_name} ${user.last_name} ${user.second_last_name}`}
                            </td>
                            <td className="px-2 py-1 md:px-4 md:py-2">{user.phone}</td>
                            <td className="px-2 py-1 md:px-4 md:py-2">{user.email}</td>
                            <td className="px-2 py-1 md:px-4 md:py-2">{getUserType(user.type_user)}</td>
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
                    {prevUrl && (
                        <li>
                            <button
                                onClick={() => handlePageChange(prevUrl)}
                                className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300"
                            >
                                Anterior
                            </button>
                        </li>
                    )}
                    {nextUrl && (
                        <li>
                            <button
                                onClick={() => handlePageChange(nextUrl)}
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