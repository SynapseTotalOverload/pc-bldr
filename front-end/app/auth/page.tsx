'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation' 
const Page = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        loginAdmin()
    }

    const loginAdmin = async () => {
        const loginAD = process.env.NEXT_PUBLIC_ADMIN_LOGIN
        const passwordAD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD

        if (loginAD === email && passwordAD === password) {
            console.log('Login successful')
            router.push('/')
            localStorage.setItem('isAdmin', 'true')
        } else {
            console.log('Login failed')
            setError('Invalid email or password')
        }
    }
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
        <h1 className='text-2xl font-bold'>Login</h1>
        <form onSubmit={handleSubmit} className='flex flex-col gap-2 w-full max-w-md'>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Email' className='border border-gray-300 rounded-md p-2 mt-4' />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password' className='border border-gray-300 rounded-md p-2 mt-4' />
            <button type="submit" className='bg-blue-500 text-white rounded-md p-2 mt-4 hover:bg-blue-600 transition-colors cursor-pointer'>Submit</button>
            {error && <p className='text-red-500'>{error}</p>}
        </form>
    </div>
  )
}

export default Page