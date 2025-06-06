'use client'
import React, { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [data, setData] = useState("nothing");

  const getUserDetails = async () => {
    try {
      const response = await axios.post("/api/users/me");
      console.log(response.data.data._id);
      setData(response.data.data._id);

    } catch (error:any) {
      console.error(error);
      toast.error(error.message);
    }
  }

  const logout = async () => {
    try {
      await axios.get("/api/users/logout");
      toast.success("logout successfully");
      router.push("/login");

    } catch (error: any) {
      console.error(error.message);
      toast.error(error.message);
    }
  }

  return (
    <div
    className='flex flex-col items-center justify-center min-h-screen py-2'>
      <h1>Profile page</h1>
      <hr />
      <h2>{data === "nothing" ? "Nothing" : <Link href={`/profile/${data}`}>{data}</Link>}</h2>
      <hr />
      <button
      className='bg-blue-500 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
      onClick={logout}>
        logout
      </button>
      <button
      className='bg-green-500 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
      onClick={getUserDetails}>
        Get User Details
      </button>
    </div>
  )
}