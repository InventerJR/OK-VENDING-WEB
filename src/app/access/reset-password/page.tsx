'use client';

import { FormInput } from '@/components/forms/form-input';
import { Input } from '@/components/input'
import { APP_ROUTES } from '@/constants'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

type FormValues = {
  email: string;
  password: string;
  confirm_password: string;
};

export default function ResetPassword() {

  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<FormValues>();
  const password = watch("password");

  const onSubmit = (data: FormValues) => {
    console.log(data);
    router.push(APP_ROUTES.ACCESS.LOGIN);
  }

  return (
    <main className="flex flex-col items-center justify-between py-6 px-24 max-w-2xl w-fit">

      <Image src="/logo.svg" width={200} height={68} alt="logo" className="mb-2" />

      <div className=' border-b-[4px] w-full border-[#2C3375]'>
        <h2 className="text-center text-2xl font-extrabold">RESTAURAR</h2>
      </div>
      <p className="mt-2 text-center text-gray-600">Introduce tu nueva contraseña y verificala</p>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2 py-4 w-full">
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
              minLength: {
                value: 8,
                message: "La contraseña debe tener mínimo 8 caracteres"
              }
            }}
            errors={errors}
          />
        </div>
        <div>
          <FormInput<FormValues>
            id={"confirm_password"}
            name={"confirm_password"}
            label={"Confirmar Contraseña"}
            placeholder="Ingrese su contraseña"
            register={register}
            type='password'
            rules={{
              required: {
                value: true,
                message: "La contraseña es requerida"
              },
              minLength: {
                value: 8,
                message: "La contraseña debe tener mínimo 8 caracteres"
              },
              validate: (value) => value === password || "Las contraseñas no coinciden"
            }}
            errors={errors}
          />
        </div>
        <div className='text-center py-6'>
          <button className="w-fit bg-[#58B7A3] px-8 py-2 rounded-md font-medium text-white">Entrar</button>
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
