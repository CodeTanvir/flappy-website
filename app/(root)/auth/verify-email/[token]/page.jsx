"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { WEBSITE_HOME } from "@/routes/WebsiteRoute";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { use, useEffect, useState } from "react"
import verificationFailedImg from "@/public/assets/images/verificationFailed.gif";
import verifiedImg from "@/public/assets/images/verified.gif"

function EmailVerification({params}) {
    const [isVerified, setIsVerified] = useState(false)
    const {token} = params
    
    useEffect(()=>{
        const verify = async()=>{
            const {data: verificationResponse} = 
            await axios.post('/api/auth/verify-email',{token});
            if(verificationResponse.success){
                setIsVerified(true)
            }
        }
        verify()
    },[token])
    return (
       <Card className="w-[400px]">
        <CardContent>
            {isVerified ? 
            <div>
                <div className="flex justify-center items-center">
                    <Image src={verifiedImg.src}
                     height={verifiedImg.height} className="h-[100px] w-auto"
                      width={verifiedImg.width} alt="verified"/>
                </div>
                <div className="text-center">
                    <h1 className="text-2xl font-bold
                    text-green-500 my-5">Email Verification success!</h1>
                    <Button>
                        <Link href={WEBSITE_HOME}>continue shopping</Link>
                    </Button>
                </div>
            </div> :
             <div>
                <div className="flex justify-center items-center">
                    <Image src={verificationFailedImg.src} 
                    height={verificationFailedImg.height} 
                    width={verificationFailedImg.width} className="h-[100px] w-auto" alt="failed"/>
                </div>
                <div className="text-center">
                    <h1 className="text-2xl 
                    font-bold text-red-500 my-5">Email Verification Failed!</h1>
                    <Button>
                        <Link href={WEBSITE_HOME}>continue Shopping</Link>
                    </Button>
                </div>
                </div>}
        </CardContent>
       </Card>
    )
}

export default EmailVerification
