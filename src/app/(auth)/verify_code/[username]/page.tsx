'use client'
import { Button } from '@/components/ui/button'
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage, Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { verifySchema } from '@/schemas/verifySchema'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const VerifyCodePage = () => {
    const router = useRouter()
    const params = useParams()
    
    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        defaultValues: {
            code: ''
        }
    })

    const onSubmit = async(data: z.infer<typeof verifySchema>) => {
        try {
            await axios.post('/api/verify_code', {
                username: params.username,
                code: data.code
            })
            toast.success('Code verified successfully')
            router.replace('/signin')
        } catch (error) {
            console.error(error)
            toast.error('Error verifying code')
        }
    }

    return (
        <div className='flex flex-col items-center justify-center h-screen bg-gray-100'>
            <div className='bg-white p-6 rounded shadow-md w-96'>
                <div className='text-center mb-4'>
                    <h2 className='text-2xl font-bold'>Join a feedback message app</h2>
                    <p className='text-gray-600'>Create an account</p>
                </div>
                
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Verification Code</FormLabel>
                                    <FormControl>
                                        <Input 
                                            placeholder="Enter verification code" 
                                            type="text"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Enter the verification code sent to you
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full">
                            Verify Code
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default VerifyCodePage