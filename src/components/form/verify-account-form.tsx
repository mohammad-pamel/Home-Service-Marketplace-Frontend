"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../ui/input-otp';
import { Field, FieldDescription, FieldError, FieldLabel } from '../ui/field';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { useVerifyAccount } from '@/hooks';
import { toast } from '../ui/toast';
import { VerifyAccountPayload } from '@/types';

const RESEND_COOLDOWN = 120;

export default function VerifyAccountForm() {

      const searchParams = useSearchParams();
      const [otp, setOtp] = useState("");
      const [isInvalid, setIsInvalid] = useState(false);
      const {mutate: verify, isPending: verifyPending} = useVerifyAccount();
      const router = useRouter();
       const [resendTimer, setResendTimer] = useState(RESEND_COOLDOWN);

      
      const email = searchParams.get('email') || "";
      
    //   console.log(email);

    useEffect(() => {
        if (!email) {
            router.push('/');
         }
    }, [email, router]);

    useEffect(() => {
    if (resendTimer <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [resendTimer]);
     

      const handleOTP = () => {
        if(otp.length !== 6){
            setIsInvalid(true);
            return;
        }

        const verifyData: VerifyAccountPayload = {
            email,
            otp
        }

        verify(verifyData, {
        onSuccess: (res) => {
          if (!res.success) {
            toast.add({
              title: "Server Failure",
              description: "Something went wrong. Please try again",
              type: "error",
            });
          }

          toast.add({
            title: "Account Verify Successful",
            description: "Welcome to Home Service Marketplace",
            type: "success",
          });
          
          router.push("/");
        },
        onError: (err) => {
            console.log(err)
          toast.add({
            title: "Authorization failure",
            description:
              err.message || "Something went wrong. Please try again",
            type: "error",
          });
        },
      });
      }

      

  return (
    <Card>
        <CardHeader>
            <CardTitle>Verify Account</CardTitle>
            <CardDescription>Please provide the OTP we send you in your email</CardDescription>
        </CardHeader>
        <CardContent>
            <form
            id='otp-form'
            onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleOTP();
            }}>
      <Field data-invalid={isInvalid}>
        <FieldLabel htmlFor='otp'>OTP</FieldLabel>
    <InputOTP 
    maxLength={6}
    onChange={(value) => {setOtp(value);
        if(isInvalid){
            setIsInvalid(false);
        }
    }}
    name='otp'
    id='otp'
    autoComplete='off'
    pattern={REGEXP_ONLY_DIGITS}>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
    {
        isInvalid && <FieldError errors={[{message: "Invalid code. Please try again."}]}></FieldError>
    }
    <FieldDescription>Resend in {resendTimer}</FieldDescription>
        </Field>
            </form>
        </CardContent>
        <CardFooter>
            <Button disabled={resendTimer > 0}>Resend</Button>
            <Button type='submit' form='otp-form'>Submit</Button>
        </CardFooter>
    </Card>
  )
}
