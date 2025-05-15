'use client'
import React, {useEffect } from 'react'
import {zodResolver} from '@hookform/resolvers/zod'
import {useForm} from 'react-hook-form'
import * as z from 'zod'
// import {zodSchema} from '@/app/(auth)/signup/schema'
import Link from 'next/link'
import {useState} from 'react'
import { useDebounceCallback } from 'usehooks-ts' //set value after delay
import { toast } from "sonner"
import { useRouter } from 'next/navigation'
import { signUpSchema } from '@/schemas/signUpSchema'
import axios from 'axios'
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'


const SignUpPage = () => {
  const [username, setUsername] = useState('')
  const [isChecking, setIsChecking] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const debouncedUsername = useDebounceCallback(setUsername, 300)

  const router = useRouter()

  //zod varif
  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues:{
      username: '',
      email: '',
      password: ''
    }
  })

  useEffect(()=>{
    const chechUsername = async()=>{
      setIsChecking(true)
      try {
        // const res = await axios.get(`/api/check_username?username=${username}`)
      } catch (error) {
        console.log(error)
        return Response.json({message: 'Error checking username in axios'}, {status: 500})


      }finally{
        setIsChecking(false )
      }
    }
    chechUsername()
  },[username])

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitted(true)

    try {
      const response = await axios.post('/api/signup', data)

      toast.success(response.data.message)
      router.replace(`/verify_code/${username}`)
      setIsSubmitted(false)
    } catch (error) {
      console.log(error)
      toast.error('Error signing up')
    }
  }

  return (
    <div className='flex flex-col items-center justify-center h-screen bg-gray-100'>
      <div className='bg-white p-6 rounded shadow-md w-96'>
        <div className='text-center mb-4'>
          <h2 className='text-2xl font-bold'>join a feedback message app</h2>
          <p className='text-gray-600'>Create an account</p>

        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="username" {...field} 
                     onChange={(e) => {
                      field.onChange(e)
                      debouncedUsername(e.target.value)
                    }}
                    />
                   
                  </FormControl>
                  {
                    isChecking && <span className='text-gray-500'>checking...</span>
                  }
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
              {
                isSubmitted ?(
                  <>
                  <div className="flex items-center gap-2">
                    <span>creating....</span>
                  </div>
                    
                  </>
                ):('sign up')
            
              }
            </Button>
          </form>
        </Form>
        <div className='mt-4 text-center'>
          <p className='text-gray-600'>Already have an account? <Link href="/sign-in" className='text-blue-500 hover:underline'>Sign in</Link></p>

        </div>

      </div>
    </div>
    

 
  )
}

export default SignUpPage