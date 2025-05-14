'use client'

import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from '@/components/ui/button'
import { MessageCircle, LogOut, User as UserIcon, Settings, Home, Send, Inbox } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

const Navbar = () => {
    const { data: session } = useSession()
    const user: User = session?.user

    return (
        <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center">
                <div className="mr-8">
                    <Link 
                        href="/" 
                        className="flex items-center space-x-2 mx-4 text-xl font-semibold"
                    >
                        <MessageCircle className="h-6 w-6 mx-4 text-primary" />
                        <span>Mysterious Message</span>
                    </Link>
                </div>

                {session ? (
                    <>
                        <nav className="flex items-center space-x-6 text-sm font-medium flex-1">
                            <Link 
                                href="/"
                                className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors"
                            >
                                <Home className="h-4 w-4" />
                                <span>Home</span>
                            </Link>
                            <Link 
                                href="/dashboard"
                                className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors"
                            >
                                <Inbox className="h-4 w-4" />
                                <span>Inbox</span>
                            </Link>
                            <Link 
                                href="/send"
                                className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors"
                            >
                                <Send className="h-4 w-4" />
                                <span>Send Message</span>
                            </Link>
                        </nav>

                        <div className="flex items-center space-x-6">
                            <Separator orientation="vertical" className="h-6" />
                            
                            <div className="flex items-center space-x-4">
                                <div className="text-sm text-muted-foreground">
                                    <div className="font-medium text-foreground">
                                        {user.username || user.email?.split('@')[0]}
                                    </div>
                                    <div className="text-xs">
                                        {user.email}
                                    </div>
                                </div>
                                
                                <Avatar className="h-8 w-8 transition-all hover:scale-105 border-2 border-primary/10">
                                    <AvatarImage src={user.image || undefined} alt={user.username || user.email || ''} />
                                    <AvatarFallback className="bg-primary/5 text-primary">
                                        {(user.username || user.email || '')?.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>

                                <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => signOut({ callbackUrl: '/' })}
                                    className="text-muted-foreground hover:text-destructive"
                                >
                                    <LogOut className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex justify-end">
                        <Link href="/signin">
                            <Button variant="default" size="sm" className="gap-2">
                                <UserIcon className="h-4 w-4" />
                                Sign In
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Navbar