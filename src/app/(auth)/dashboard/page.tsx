"use client"

import { acceptMessageSchema } from '@/schemas/acceptMessageSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import React, { useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Card, CardContent} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Copy, Loader2, RefreshCcw, MessageCircle } from "lucide-react"
import { Message } from '@/model/user'
import { Switch } from '@/components/ui/switch'
import MessageCard  from '@/components/messageCard'

const Page = () => {
    const [messages, setMessages] = React.useState<Message[]>([])
    const [loading, setLoading] = React.useState(true)
    const [isSwitchLoading, setIsSwitchLoading] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)

    const { data: session } = useSession()
    
    // Add this check to safely access username
    const username = session?.user?.name || ''

    const form = useForm({
        resolver: zodResolver(acceptMessageSchema),
        defaultValues: {
            acceptMessage: false
        }
    })
    
    const { setValue, watch } = form
    const acceptMessage = watch("acceptMessage")

    const handleDeleteMessage = async (messageId: string) => {
        if (!messageId) {
            toast.error('Invalid message ID');
            return;
        }
    
        try {
            const response = await axios.delete(`/api/delete/${messageId}`);
            
            if (response.data.success) {
                setMessages(prevMessages => 
                    prevMessages.filter((message) => message._id.toString() !== messageId.toString())
                );
                toast.success('Message deleted successfully');
            } else {
                toast.error(response.data.message || 'Failed to delete message');
            }
        } catch (error) {
            console.error('Error deleting message:', error);
            
            toast.error("error in handle delete");
        }
    }

    const fetchAcceptiveMessage = useCallback(async () => {
        setIsSwitchLoading(true)
        try {
            const response = await axios.get('/api/accept_message')
            setValue('acceptMessage', response.data.isAcceptiveMessage ?? false)
        } catch (error) {
            // const axiosError = error as AxiosError
            console.log(error , "error")
            toast.error("Error fetching message preferences")
        } finally {
            setIsSwitchLoading(false)
        }
    }, [setValue])

    const fetchMessages = useCallback(async (refresh: boolean = false) => {
        setLoading(true)
        setError(null)
        try {
            const response = await axios.get('/api/get_message')
            if (response.data.success) {
                setMessages(response.data.messages)
                if (refresh) {
                    toast.success('Messages refreshed successfully')
                }
            }
        } catch (error) {
            
            // const errorMessage = axiosError.response?.data?.message ?? "Failed to fetch messages"
            // setError(errorMessage)

            console.log(error)
            toast.error("failed to fetch ")
            setMessages([])
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        if (!session?.user) return
        
        Promise.all([
            fetchMessages(),
            fetchAcceptiveMessage()
        ]).catch(error => {
            console.error("Error initializing dashboard:", error)
            toast.error("Error loading dashboard data")
        })
    }, [session, fetchMessages, fetchAcceptiveMessage])

    const handleSwitchChange = async () => {
        const previousState = acceptMessage;
        try {
            setIsSwitchLoading(true);
            
            const response = await axios.post('/api/accept_message', { 
                acceptMessage: !previousState 
            });
            
            if (response.data.success) {
                setValue('acceptMessage', !previousState);
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message || "Failed to update preferences");
            }
        } catch (error) {
            toast.error("Failed to update preferences");
            console.error("Error:", error);
        } finally {
            setIsSwitchLoading(false);
        }
    }

    // Update the baseUrl declaration
    const baseUrl = `http://localhost:3000/u/${username}`||`https://message-app-pied.vercel.app/u/${username}`

    const handleCopyLink = () => {
        if (!username) {
            toast.error("Username not available")
            return
        }
        navigator.clipboard.writeText(baseUrl)
        toast.success("Profile URL copied to clipboard")
    }

    if (!session?.user) {
        return (
            <div className="container mx-auto p-6">
                <Card>
                    <CardContent className="pt-6">
                        <Alert>
                            <AlertTitle>Not authenticated</AlertTitle>
                            <AlertDescription>
                                Please sign in to view your dashboard.
                            </AlertDescription>
                        </Alert>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
            <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

            <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">Your Profile Link</h2>
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={baseUrl}
                        disabled
                        className="input input-bordered w-full p-2"
                    />
                    <Button onClick={handleCopyLink} variant="outline">
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                    </Button>
                </div>
            </div>

            <div className="mb-4 flex items-center gap-2">
                <Switch
                    checked={acceptMessage}
                    onCheckedChange={handleSwitchChange}
                    disabled={isSwitchLoading}
                />
                <span className="text-sm">
                    Accept Messages: {acceptMessage ? 'On' : 'Off'}
                </span>
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Messages</h2>
                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => fetchMessages(true)}
                    disabled={loading}
                >
                    {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <RefreshCcw className="h-4 w-4" />
                    )}
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {error ? (
                    <Alert variant="destructive">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                ) : messages.length === 0 ? (
                    <Alert>
                        <MessageCircle className="h-4 w-4" />
                        <AlertTitle>
                            {loading ? 'Loading Messages...' : 'No Messages'}
                        </AlertTitle>
                        <AlertDescription>
                            {loading 
                                ? 'Please wait while we fetch your messages...'
                                : 'Share your profile link to start receiving messages.'}
                        </AlertDescription>
                    </Alert>
                ) : (
                    messages.map((message) => (
                        <MessageCard
                            key={message._id}
                            message={message}
                            onMessageDelete={handleDeleteMessage}
                        />
                    ))
                )}
            </div>
        </div>
    )
}

export default Page