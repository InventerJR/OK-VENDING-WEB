'use client';

import { FormInput } from '@/components/forms/form-input';
import { Input } from '@/components/input'
import { APP_ROUTES } from '@/constants';
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

type FormValues = {
  email: string;
};

export default function Home() {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const router = useRouter()

  const onSubmit = (data: FormValues) => {
    router.push(APP_ROUTES.ACCESS.RESET_PASSWORD)
  }

  return (
    <main className="flex flex-col items-center justify-between py-6 px-24 max-w-2xl w-fit">

      <Image src="/logo.svg" width={200} height={68} alt="logo" className="mb-2" />

      <div className=' border-b-[4px] w-full border-[#2C3375]'>
        <h2 className="text-center text-2xl font-extrabold">RECUPERAR</h2>
      </div>
      <p className="mt-2 text-center text-gray-600">Introduce tu correo para recuperar tu contraseña</p>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 py-6 w-full">
        <div>
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
        <div className='text-center py-6'>
          <button
            className="w-fit bg-[#58B7A3] px-8 py-2 rounded-md font-medium text-white"
          >Recuperar</button>
        </div>
      </form>
      <div className="text-center">
        <Link className="font-medium text-[#2C3375] hover:text-[#5460CF] underline" href={APP_ROUTES.ACCESS.LOGIN}>
          ó accede a tu cuenta
        </Link>
      </div>
    </main>
  )
}
