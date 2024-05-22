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

const page = () => {
  const [username,setUsername] = useState("");
  const [usernameMessage,setUsernameMessage] = useState("");

  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debounced = useDebounceCallback(setUsername,200);
  const { toast } = useToast();
  const router = useRouter();

  //Using Zod
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues : {
      username : "",
      email : "",
      password : ""
    }
  })

  useEffect(()=>{
    const checkUsernameUnique = async ()=>{
      if(username){
        setIsCheckingUsername(true);
        setUsernameMessage("");
        try {
          const response = await axios.get(`/api/check-username-unique?username=${username}`);
        //   console.log("This is response from axios call ",response)
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<apiResponse>;
          setUsernameMessage(axiosError.response?.data.message ?? "Error while Checking username ")
        } finally{
          setIsCheckingUsername(false)
        }
      }
    }
    checkUsernameUnique();
  },[username])

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
        // console.log("This is data in onSubmit from form ",data)
        // console.log("before before");
      const response = await axios.post('/api/sign-up', data);
    //   console.log("after after")
    //   console.log("This is error from onSubmit response",response)

      toast({
        title: 'Success',
        description: response.data.message,
      });

      router.replace(`/verify/${username}`);

      setIsSubmitting(false);
    } catch (error) {   
        console.log("hmmmmm, eroor from catch on onSubmit")
      console.error('Error during sign-up:', error);

      const axiosError = error as AxiosError<apiResponse>;

      // Default error message
      let errorMessage = axiosError.response?.data.message;
      ('There was a problem with your sign-up. Please try again.');

      toast({
        title: 'Sign Up Failed',
        description: errorMessage,
        variant: 'destructive',
      });

      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800 " >
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
              Join Surpeise Message
          </h1>
          <p className="mb-4">
              Sign up to start with others
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            name="username"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Username" {...field} 
                    onChange={(e)=>{
                      field.onChange(e);
                      debounced(e.target.value)
                  }}/>
                 
                </FormControl>
                {
                    isCheckingUsername && <Loader2 className="animate-spin" />
                }
                <p className={`text-sm ${usernameMessage === 
                    "Username is Unique and available" ? "text-green-500" : "text-red-500"}`}>
                    Testing {usernameMessage}
                </p>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" {...field}/>
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
                ) : "Sign up"
              }
            </Button>

          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
           Already a member?{' '}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default page
