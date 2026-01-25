'use client'
import { Card, CardContent } from "@/components/ui/card";
import Logo from "@/public/assets/images/flappy.png"
import Image from "next/image";
import {zodResolver} from "@hookform/resolvers/zod"
import { zSchema } from "@/lib/zodSchema";
import {useForm} from 'react-hook-form'
import {z} from "zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ButtonLoading } from "@/components/Application/ButtonLoading";
import { useState } from "react";
import { FaRegEyeSlash } from "react-icons/fa6";
import {FaRegEye} from "react-icons/fa6"
import Link from "next/link";
import { USER_DASHBOARD, WEBSITE_REGISTER, WEBSITE_RESETPASSWORD } from "@/routes/WebsiteRoute";
import axios from "axios";
import { showToast } from "@/lib/showToast";
import OTPVerification from "@/components/Application/OTPVerification";
import { useDispatch } from "react-redux";
import { login } from "@/store/reducer/authReducer";
import { useRouter, useSearchParams } from "next/navigation";
import { ADMIN_DASHBOARD } from "@/routes/AdminPanelRoute";

function LoginPage() {
  const dispatch = useDispatch()
  const searchParams = useSearchParams();
  const router = useRouter()
    const [loading,setLoading] = useState(false)
    const [otpVerificationLoading, setOtpVerificationLoading] = useState(false)
    const [isTypePassword,setIsTypePassword] = useState(true)
    const [otpEmail,setOtpEmail] = useState();
    
    const formSchema = zSchema.pick({
        email:true
    }).extend({
        password:z.string().min('3','Password field is required')
    })

    const form = useForm({
        resolver:zodResolver(formSchema),
        defaultValues:{
           email:"",
           password:"",
        }
    })
    const handleLoginSubmit = async(values)=>{
      try{
        setLoading(true)
        const {data: loginResponse} = await axios.post('/api/auth/login', values)
        if(!loginResponse.success){
          throw new Error(loginResponse.message)
        }
        setOtpEmail(values.email)
        form.reset();
        showToast('success',loginResponse.message)
      }catch(error){
        console.log(error)
        showToast('error',error.message)
        
      }finally{
        setLoading(false)
      }
    }

    //otp verification
    const handleOtpVerification = async(values)=>{
      try{
        setOtpVerificationLoading(true)
        const {data: OtpResponse} = await axios.post('/api/auth/verify-otp', values)
        console.log(OtpResponse)
        if(!OtpResponse.success){
          throw new Error(OtpResponse.message)
        }
        setOtpEmail('')
       
        showToast('success',OtpResponse.message)
        dispatch(login(OtpResponse.data))
        if(searchParams.has('callback')){
          router.push(searchParams.get('callback'))
        }else{
          OtpResponse.data.role === 'admin' ? router.push(ADMIN_DASHBOARD)
           : router.push(USER_DASHBOARD)
        }

      }catch(error){
        console.log(error)
        showToast('error',error.message)
        
      }finally{
        setOtpVerificationLoading(false)
      }
    }
    return (
        <div>
            <Card className="w-[400px]">
                <CardContent>
                    <div className="flex justify-center">
                        <Image src={Logo.src}
                         width={Logo.width} 
                         height={Logo.height} alt="Logo" className="max-w-[150px]"/>
                    </div>

                    {!otpEmail ? 
                    <>
                        <div className="text-center">
                        <h1 className="text-3xl font-bold">Login Into Account</h1>
                        <p>Login into your account by filling out the form below.</p>
                    </div>

                    <div className="mt-5">
                    <Form {...form}>
                <form onSubmit={form.handleSubmit(handleLoginSubmit)}>
                <div className="mb-5">
            <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="example@gmail.com"
                 {...field} />
              </FormControl>
             
              <FormMessage />
            </FormItem>
          )}
        />
        </div>

        <div className="mb-3">
            <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="relative">
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type={isTypePassword ? 'password': 'text'} 
                placeholder="**********"
                 {...field} />
                
              </FormControl>
              <button type="button"
               className="absolute right-2 top-1/2 cursor-pointer"
               onClick={()=>setIsTypePassword(!isTypePassword)}>
                {isTypePassword ? <FaRegEyeSlash/> : <FaRegEye/> }
                 </button>
              <FormMessage />
            </FormItem>
          )}
        />
        </div>
        <div className="mb-3">
            <ButtonLoading loading={loading} type="submit" text="Login"
             className="w-full cursor-pointer"/>
        </div>
        <div className="text-center">
            <div className="flex justify-center items-center gap-2">
              <p>Don&apos;t have account</p>
              <Link 
              className="text-primary underline"
               href={WEBSITE_REGISTER}>Create account</Link>
            </div>
            <div className="mt-3">
            <Link 
              className="text-primary underline"
               href={WEBSITE_RESETPASSWORD}>Forget Password?</Link>
            </div>
        </div>
      </form>
    </Form>
                    </div>
                    </> :
                    <>
                    <OTPVerification email={otpEmail} 
                    onSubmit={handleOtpVerification}
                    loading={otpVerificationLoading}/>
                    </>}
                  
                </CardContent>
            </Card>
        </div>
    )
}

export default LoginPage;
