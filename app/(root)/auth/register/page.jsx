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
import { WEBSITE_LOGIN } from "@/routes/WebsiteRoute";
import axios from "axios";
import { showToast } from "@/lib/showToast";


function RegisterPage() {
    const [loading,setLoading] = useState(false)
    const [isTypePassword,setIsTypePassword] = useState(true)
    const formSchema = zSchema.pick({
       name:true, email:true,password:true
    }).extend({
        confirmPassword: z.string()
    }).refine((data)=> data.password === data.confirmPassword,{
        message:"Password and confirm password must be same",
        path:['confirmPassword']
    })

    const form = useForm({
        resolver:zodResolver(formSchema),
        defaultValues:{
            name:"",
           email:"",
           password:"",
           confirmPassword:"",
        }
    })
    const handleRegisterSubmit = async(values)=>{
      try{
        setLoading(true)
        const {data: registerResponse} = await axios.post('/api/auth/register', values)
        if(!registerResponse.success){
          throw new Error(registerResponse.message)
        }
        form.reset();
        showToast('success',registerResponse.message)
      }catch(error){
        showToast('error',error.message)
        
      }finally{
        setLoading(false)
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
                    <div className="text-center">
                        <h1 className="text-3xl font-bold">Create New Account</h1>
                        <p>Create new account by filling out the form below.</p>
                    </div>

                    <div className="mt-5">
                    <Form {...form}>
                <form onSubmit={form.handleSubmit(handleRegisterSubmit)}>
                <div className="mb-5">
            <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Adam smith"
                 {...field} />
              </FormControl>
             
              <FormMessage />
            </FormItem>
          )}
        />
        </div>
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
            <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem className="relative">
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type='password'
                placeholder="**********"
                 {...field} />
                
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        </div>
        <div className="mb-3">
            <ButtonLoading loading={loading} type="submit" text="Create Account"
             className="w-full cursor-pointer"/>
        </div>
        <div className="text-center">
            <div className="flex justify-center items-center gap-2">
              <p>Already have account ?</p>
              <Link 
              className="text-primary underline"
               href={WEBSITE_LOGIN}>Login!</Link>
            </div>
            <div className="mt-3">
            <Link 
              className="text-primary underline"
               href="">Forget Password?</Link>
            </div>
        </div>
      </form>
    </Form>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default RegisterPage
