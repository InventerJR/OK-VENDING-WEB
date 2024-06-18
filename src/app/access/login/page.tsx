'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import { FormInput } from '@/components/forms/form-input';
import { useAppContext } from '@/hooks/useAppContext';
import { useToast } from '@/components/toasts/use-toasts';
import { login } from '../../../../api'; // Asegúrate de que la ruta al archivo api.js es correcta

type FormValues = {
  email: string;
  password: string;
};

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      email: "mail@mail.com",
      password: "1234"
    }
  });

  const { setLoading, setIsOpenModal, setTitleModal, setMessageModal } = useAppContext();
  const { toastSuccess, toastError } = useToast();
  const router = useRouter();

  const onSubmit = async (data: FormValues) => {
    setLoading(true);

    try {
      const response = await login(data.email, data.password);
      localStorage.setItem('token', response.token);
      toastSuccess({ message: "Bienvenido" });
      setTimeout(() => {
        router.push('/dashboard');
        setLoading(false);
      }, 100);
    } catch (error) {
      toastError({ message: "Error al iniciar sesión: "  });
      setMessageModal("Error al iniciar sesión. Por favor verifica tus credenciales.");
      setTitleModal("Error de Autenticación");
      setIsOpenModal(true);
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-between py-6 px-12 md:px-24 max-w-2xl w-fit h-fit">
      <Image src="/logo.svg" width={200} height={68} alt="logo" className="mb-2 z-[999]" />
      <div className='border-b-[4px] w-full border-[#2C3375]'>
        <h2 className="text-center text-2xl font-bold">ACCESO</h2>
      </div>
      <p className="mt-2 text-center text-gray-600">Ingresa a tu cuenta para acceder al sistema</p>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 py-6 w-full">
        <FormInput
          id="email"
          name="email"
          label="Correo"
          placeholder="Ingrese tu correo"
          register={register}
          type='email'
          rules={{
            required: {
              value: true,
              message: "El correo es requerido"
            },
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "El correo no es válido"
            }
          }}
          errors={errors}
        />
        <FormInput
          id="password"
          name="password"
          label="Contraseña"
          placeholder="Ingrese tu contraseña"
          register={register}
          type='password'
          rules={{
            required: {
              value: true,
              message: "La contraseña es requerida"
            },
          }}
          errors={errors}
        />
        <div className='text-center py-6'>
          <button className="w-fit bg-[#58B7A3] px-8 py-2 rounded-md font-medium text-white">Entrar</button>
        </div>
      </form>
      <div className="text-center">
        <Link href="/forgot-password" className="font-medium text-[#2C3375] hover:text-[#5460CF] underline">¿Olvidaste tu contraseña?</Link>
      </div>
    </main>
  );
}
