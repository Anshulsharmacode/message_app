'use client'
import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { signinSchema } from '@/schemas/signInSchema'
import Link from 'next/link'
import { toast } from "sonner"
import { useRouter } from 'next/navigation'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { signIn } from 'next-auth/react'
import { z } from 'zod'

type SignInFormValues = z.infer<typeof signinSchema>

const SignInPage = () => {
    const router = useRouter()

    const form = useForm<SignInFormValues>({
        resolver: zodResolver(signinSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    })

    const onSubmit = async (values: SignInFormValues) => { 
        try {
            const response = await signIn('credentials', {
                email: values.email,  // Changed from email to identifier
                password: values.password,
                callbackUrl: '/dashboard',     // Added callback URL
                redirect: false
            })
            
            if (response?.error) {
                console.error('Login error:', response.error)
                toast.error('Invalid email or password')
            } else {
                toast.success('Login successful')
                router.push('/dashboard')
                router.refresh() // Add refresh to update session
            }
        } catch (error) {
            console.error('Sign in error:', error)
            toast.error('An unexpected error occurred')
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="w-full max-w-md space-y-8 p-8 rounded-lg shadow-2xl">
                <div className="text-center">
                    <h2 className="text-2xl font-bold">Sign In</h2>
                    <p className="mt-2 text-gray-600">Welcome back!</p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="Enter your email" {...field} />
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
                                        <Input type="password" placeholder="Enter your password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full">
                            Sign In
                        </Button>
                    </form>
                </Form>

                <div className="text-center mt-4">
                    <p className="text-sm text-gray-600">
                        Don&apos;t have an account
                        <Link href="/signup" className="text-blue-600 hover:underline">
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )   
}

export default SignInPage