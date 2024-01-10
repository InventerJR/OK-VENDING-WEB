'use client';

import { Input } from '@/components/input'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation';

export default function Home() {

  const router = useRouter()

  const recoverPassword = (e:any) => {
    e.preventDefault()
    router.push('/nueva-pass')
  }

  return (
    <main className="flex flex-col items-center justify-between py-6 px-24 max-w-2xl w-fit">

      <Image src="/logo.svg" width={200} height={68} alt="logo" className="mb-2" />

      <div className=' border-b-[4px] w-full border-[#2C3375]'>
        <h2 className="text-center text-2xl font-extrabold">RECUPERAR</h2>
      </div>
      <p className="mt-2 text-center text-gray-600">Introduce tu correo para recuperar tu contraseña</p>
      <form className="mt-8 space-y-2 w-full max-w-[460px] ">
        <div>
          <label className="sr-only" htmlFor="email">
            Correo
          </label>
          <Input id="email" label="Correo" placeholder="Correo" type="email" />
        </div>
        <div className='text-center py-6'>
          <button className="w-fit bg-[#58B7A3] px-8 py-2 rounded-md font-medium text-white"
            onClick={recoverPassword}>Recuperar</button>
        </div>
      </form>
      <div className="text-center">
        <Link className="font-medium text-[#2C3375] hover:text-[#5460CF] underline" href="/login">
          ó accede a tu cuenta
        </Link>
      </div>
    </main>
  )
}
