'use client'
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function VerifyEmailPage() {

    // const router = useRouter();

    const [token, setToken] = useState("");
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState(false);

    const verifyUserEmail = async function () {
        try {
            await axios.post("/api/users/verifyemail", { token })
            setVerified(true);
            setError(false);
        } catch (error: any) {
            setError(true);
            console.log(error.message.data);
        }
    }

    useEffect(() => {
        setError(false);
        const urlToken = window.location.search.split("=")[1]
        setToken(urlToken || "");

        // const { query } = router;
        // const urlTokenTwo = query.token;

    }, [])

    useEffect(() => {
        setError(false);
        if (token.length > 0) {
            verifyUserEmail();
        }
    }, [token])

  return (
    <div
    className='flex flex-col items-center justify-center min-h-screen py-2'
    >
        <h1 className='text-4xl p-2'>Verify Email</h1>
        <h2 className='p-2 bg-orange-500 text-black rounded-lg'>
            {token ? `${token}` : "No token provided"}
        </h2>
        {verified && (
            <div>
                <h2>Verified</h2>
                <Link href="/login">Login</Link>
            </div>
        )}
        {error && (
            <div>
                <h2>Error</h2>
            </div>
        )}
        
    </div>
  )
}