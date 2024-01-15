'use client'

import { APP_ROUTES } from "@/constants"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function HomePage() {

  const router = useRouter()

  useEffect(() => {
    router.push(APP_ROUTES.USER_ADMIN)
  }, [])

  return (
    <main className="container">
      {/* <span>Home works</span> */}
    </main>
  )
}
