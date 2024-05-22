"use client";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import Link from "next/link";
import * as z from "zod";
import { useDebounceCallback, useDebounceValue } from 'usehooks-ts'
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from "axios"
import { apiResponse } from "@/types/apiResponse";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader, Loader2 } from "lucide-react";
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";

const page = () => {
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

  //Using Zod
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues : {
      identifier : "",
      password : ""
    }
  })

 

  const onSubmit = async (data: any) => {
    setIsSubmitting(true)
    const result = await signIn('credentials',{
      redirect : false,
      identifier : data.identifier,
      password : data.password
    })
    console.log("This is result from the sign-in page ",result)
    if(result?.error){
      if(result.error == 'CredentialsSignIn'){
        toast({
          title : "Login Failed",
          description : "Incorrect username or password",
          variant : "destructive"
        })
        setIsSubmitting(false)
      }else{
        toast({
          title : "Test : Go and check the result.error in the sign-in page",
          description : result.error,
          variant : "destructive"
        })
        setIsSubmitting(false)
      }
    }else{
      toast({
        title : "Login successful",
        description : "You are login now"
      })
      setIsSubmitting(false)
    }

    if(result?.url){
      setIsSubmitting(false)
      router.replace('/dashboard')
    }
    setIsSubmitting(false)
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800 " >
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
              Join Surpeise Message
          </h1>
          <p className="mb-4">
              Sign in to start with others
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          
          <FormField
            name="identifier"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email or Username</FormLabel>
                <FormControl>
                  <Input placeholder="Email or Username" {...field}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="password"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Password" {...field}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

            <Button type="submit" disabled={isSubmitting}>
              {
                isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Please Wait
                  </>
                ) : "Sign in"
              }
            </Button>

          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
           Create your account. {' '}
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default page
