"use client"

import { acceptMessageSchema } from '@/schemas/acceptMessageSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import React, { useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
// import { Switch } from "@/components/ui/switch"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Copy, Link, Loader2, RefreshCcw, Trash2, MessageCircle } from "lucide-react"
import  { Message } from '@/model/user'

const Page = () => {
    const [messages, setMessages] = React.useState([])
    const [loading, setLoading] = React.useState(true)
    const [baseUrl, setBaseUrl] = React.useState('')
    const [error, setError] = React.useState<string | null>(null)

    const { data: session } = useSession()

    const form = useForm({
        resolver: zodResolver(acceptMessageSchema),
        defaultValues: {
            acceptMessage: false
        }
    })
    
    const {  setValue } = form
    // const acceptMessage = watch("acceptMessage")

    const handleDeleteMessage = async (messageId: string) => {
        try {
            await axios.delete(`/api/delete`);
            setMessages(messages.filter((message: Message) => message._id !== messageId));
            toast.success('Message deleted successfully');
        } catch (error) {
            console.error('Error deleting message:', error);
            toast.error('Failed to delete message');
        }
    }

    const fetchAcceptiveMessage = useCallback(async () => {
        try {
            const response = await axios.get('/api/accept_message')
            setValue('acceptMessage', response.data.isAcceptiveMessage ?? false)
            toast.success(response.data.message)
        } catch (error) {
            console.error("Error fetching acceptive message:", error)
            toast.error("Error fetching acceptive message")
        }
    }, [setValue])

    const fetchMessages = useCallback(async (refresh: boolean = false) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('/api/get_message');
            if (response.data.success) {
                setMessages(response.data.messages);
                if (refresh) {
                    toast.success('Messages refreshed successfully');
                }
            } else {
                const errorMsg = response.data.message || 'Failed to fetch messages';
                console.error("API Error:", errorMsg);
                setError(errorMsg);
                toast.error(errorMsg);
                setMessages([]);
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            console.error("Error fetching messages:", errorMessage);
            setError(errorMessage);
            toast.error(`Error fetching messages: ${errorMessage}`);
            setMessages([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!session?.user) {
            return
        }
        
        const username = session?.user.username;
        console.log(username, "username");
        if (username) {
            const baseUrlHost = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000' || `https://mysterymessage-pr.vercel.app/`;
            setBaseUrl(`${baseUrlHost}/u/${username}`);
        }
        
        fetchMessages()
        fetchAcceptiveMessage()
    }, [session, setValue, fetchMessages, fetchAcceptiveMessage])

    // const handleSwitchChange = async () => {
    //     try {
    //         const response = await axios.post('/api/accept_message', { acceptMessage: !acceptMessage })   
    //         setValue('acceptMessage', !acceptMessage)
    //         toast.success(response.data.message)
    //     } catch (error) {
    //         console.error("Error updating acceptive message:", error)
    //         toast.error("Error updating message preferences")
    //     }
    // }

    const handleCopyLink = () => {
        if (!baseUrl) {
            toast.error("Profile link not available")
            return
        }
        navigator.clipboard.writeText(baseUrl)
        toast.success("Link copied to clipboard")
    }

    // Protect against session being undefined
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
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">Manage your messages and settings</p>
                </div>
                <Button onClick={handleCopyLink} variant="outline" className="gap-2">
                    <Copy className="h-4 w-4" />
                    Copy Profile Link
                </Button>
            </div>

            <Separator />

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div>
                        <CardTitle>Messages</CardTitle>
                        <CardDescription>View and manage your received messages</CardDescription>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* <div className="flex items-center space-x-2">
                            <Switch
                                checked={acceptMessage}
                                onCheckedChange={handleSwitchChange}
                            />
                            <label htmlFor="accept-messages" className="text-sm text-muted-foreground">
                                Accept New Messages
                            </label>
                        </div> */}
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
                </CardHeader>
                <CardContent className="space-y-4">
                    <Alert>
                        <Link className="h-4 w-4" />
                        <AlertTitle>Your Profile Link</AlertTitle>
                        <AlertDescription className="font-mono text-sm">
                            {baseUrl || 'Loading...'}
                        </AlertDescription>
                    </Alert>

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
                        <div className="space-y-4">
                            {messages.map((message: Message) => (
                                <Card key={message._id} className="hover:shadow-md transition-shadow">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <div className="flex flex-col gap-1">
                                            <CardDescription className="text-sm text-muted-foreground">
                                                Received: {new Date(message.createdAt).toLocaleString()}
                                            </CardDescription>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDeleteMessage(message._id)}
                                            title="Delete message"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-gray-700 whitespace-pre-wrap break-words">
                                            {message.content}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default Page