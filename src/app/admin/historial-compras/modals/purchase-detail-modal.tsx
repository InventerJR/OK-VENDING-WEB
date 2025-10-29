import React from 'react';
import Image from 'next/image';
import { PurchaseDataObject } from '../page.context';

type Props = {
    purchase: PurchaseDataObject | null;
    onClose: () => void;
};

const PurchaseDetailModal = ({ purchase, onClose }: Props) => {
    if (!purchase) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white w-[90%] max-w-3xl p-6 rounded-lg shadow-lg relative overflow-y-auto">
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                    <Image src="/img/actions/close.svg" alt="close icon" width={20} height={20} />
                </button>
                
                <h2 className="text-2xl font-bold text-center mb-6">Detalles de la Compra</h2>
                
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="font-semibold">ID del Ticket:</span>
                        <span>{purchase.ticket_id}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                        <span className="font-semibold">Proveedor:</span>
                        <span>{purchase.supplier}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                        <span className="font-semibold">Total de la Compra:</span>
                        <span>${purchase.total_amount}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                        <span className="font-semibold">Fecha de Compra:</span>
                        <span>{new Date(purchase.purchase_date).toLocaleString()}</span>
                    </div>
                    
                    <div>
                        <span className="font-semibold">Productos:</span>
                        <table className="mt-2 w-full border border-gray-200 rounded-lg">
                            <thead>
                                <tr className="bg-[#2C3375]">
                                    <th className="p-2 text-white text-left border-b">Expiración</th>
                                    <th className="p-2 text-white text-left border-b">Cantidad</th>
                                    <th className="p-2 text-white text-left border-b">Producto</th>
                                    <th className="p-2 text-white text-left border-b">Precio</th>
                                    <th className="p-2 text-white text-left border-b">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {purchase.products.map((product, index) => {
                                    const subtotal = parseFloat(product.buying_price) * product.quantity;
                                    return (
                                        <tr key={index} className="border-b hover:bg-gray-50">
                                            <td className="p-2">{new Date(product.expiration).toLocaleDateString()}</td>
                                            <td className="p-2">{product.quantity}</td>
                                            <td className="p-2">{product.product}</td>
                                            <td className="p-2">${product.buying_price}</td>
                                            <td className="p-2">${subtotal.toFixed(2)}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    
                    <div className="flex flex-col items-center mt-4">
                        <span className="font-semibold mb-2">Ticket de la Compra:</span>
                        <Image 
                            src={purchase.ticket_image} 
                            alt="Imagen del Ticket" 
                            width={150} 
                            height={150} 
                            className="rounded-md object-cover"
                        />
                        <a 
                            href={purchase.ticket_image} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="mt-2 text-blue-500 hover:underline"
                        >
                            Ver imagen completa
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PurchaseDetailModal;
