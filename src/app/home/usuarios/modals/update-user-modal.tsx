import ModalContainer from "@/components/layouts/modal-container";

type Props = {
    isOpen: boolean;
    onClose: () => void;
}

export default function UpdateUserModal(props: Props) {
    const { isOpen, onClose } = props;

    return (
        <ModalContainer visible={isOpen} onClose={onClose}>
            <div className="flex flex-col p-4 relative">
                <div className="absolute right-4">
                    <button className="font-bold font-sans" onClick={onClose}>X</button>
                </div>
                <div className="w-fit self-center border-b-[3px] border-b-[#2C3375] px-8">
                    <span className="font-bold text-xl">EDITAR USUARIO</span>
                </div>
            </div>
        </ModalContainer>
    );
}