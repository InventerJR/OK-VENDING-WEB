import Image from "next/image";
import { useUsersAdminContext } from "./users-admin.context";


export default function UsersTable() {

    const { users, setIsOpenUpdateModal, setIsOpenDeleteModal } = useUsersAdminContext();


    const openUpdate = () => {
        setIsOpenUpdateModal(true);
    }

    const openDelete = () => {
        setIsOpenDeleteModal(true);
    }

    return (
        <>
            <table className='w-full'>
                <thead >
                    <tr className='bg-[#2C3375] text-white'>
                        <th className='px-2 py-1 md:px-4 md:py-2 text-left'>Nombre</th>
                        <th className='px-2 py-1 md:px-4 md:py-2 text-left'>Teléfono</th>
                        <th className='px-2 py-1 md:px-4 md:py-2 text-left'>Email</th>
                        <th className='px-2 py-1 md:px-4 md:py-2 text-left'>Tipo</th>
                        <th className='px-2 py-1 md:px-4 md:py-2 text-left'></th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr className='border-b border-gray-200 hover:bg-gray-100' key={user.id}>
                            <td className='px-2 py-1 md:px-4 md:py-2'>{user.name}</td>
                            <td className='px-2 py-1 md:px-4 md:py-2'>{user.phone}</td>
                            <td className='px-2 py-1 md:px-4 md:py-2'>{user.email}</td>
                            <td className='px-2 py-1 md:px-4 md:py-2'>{user.type}</td>
                            <td className='px-2 py-1 md:px-4 md:py-2 min-w-[90px]'>
                                <div className='flex flex-row gap-3'>
                                    <button type="button" onClick={openUpdate} className=''>
                                        {/* edit */}
                                        <Image src='/img/actions/edit.svg' alt='edit icon' width={24} height={24} className='w-[24px] h-[24px]' />
                                    </button>
                                    <button type="button" onClick={openDelete} className=''>
                                        {/* delete */}
                                        <Image src='/img/actions/trash.svg' alt='edit icon' width={24} height={24} className='w-[24px] h-[24px]' />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    )
}