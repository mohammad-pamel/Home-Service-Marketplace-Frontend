"use client";

import { useSearchParams } from 'next/navigation';
import React from 'react'

export default function VerifyAccountForm() {

      const searchParams = useSearchParams();

      
      const email = searchParams.get('email')
      
      console.log(email);

  return (
    <div>User Email: {email}</div>
  )
}
