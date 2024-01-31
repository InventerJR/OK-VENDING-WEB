'use client';

import { FormInput } from '@/components/forms/form-input';
import { Input } from '@/components/input'
import { APP_ROUTES } from '@/constants';
import { useAppContext } from '@/hooks/useAppContext';
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form';

type FormValues = {
  email: string;
  password: string;
};

export default function Login() {


  const {
    register,
    handleSubmit,
    formState: { 
      errors
    },
  } = useForm<FormValues>({
    defaultValues: {
      email: "mail@mail.com",
      password: "1234"
    }
  });
  const { loading, setLoading } = useAppContext();
  const router = useRouter();

  const onSubmit = (data: FormValues) => {

    setLoading(true);
    setTimeout(() => {

      router.push(APP_ROUTES.HOME);
      setLoading(false);

    }, 1400);
  }

  return (
    <main className="flex flex-col items-center justify-between py-6 px-12 md:px-24 max-w-2xl w-fit">

      <Image src="/logo.svg" width={200} height={68} alt="logo" className="mb-2 z-[999]" />

      <div className=' border-b-[4px] w-full border-[#2C3375]'>
        <h2 className="text-center text-2xl font-bold">ACCESO</h2>
      </div>
      <p className="mt-2 text-center text-gray-600">Ingresa a tu cuenta para acceder al sistema</p>
      {/* <form className="mt-8 space-y-2 w-full max-w-[460px] "> */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 py-6 w-full">
        <div className=''>
          <FormInput<FormValues>
            id={"email"}
            name={"email"}
            label={"Correo"}
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
        </div>
        <div>
          <FormInput<FormValues>
            id={"password"}
            name={"password"}
            label={"Contraseña"}
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
        </div>
        <div className='text-center py-6'>
          <button className="w-fit bg-[#58B7A3] px-8 py-2 rounded-md font-medium text-white"
          >Entrar</button>
        </div>
      </form>
      <div className="text-center">
        <Link className="font-medium text-[#2C3375] hover:text-[#5460CF] underline" href={APP_ROUTES.ACCESS.FORGOT_PASSWORD}>
          ¿Olvidaste tu contraseña?
        </Link>
      </div>
    </main>
  )
}
