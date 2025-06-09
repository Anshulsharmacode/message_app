'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CardHeader, CardContent, Card } from '@/components/ui/card';
import { useParams } from 'next/navigation';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const Page = () => {
    const { username } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [message, setMessage] = useState('');

    const fetchSuggestions = async () => {
        try {
            const response = await axios.post('/api/ai');
            if (response.data.result) {
               
                const suggestionArray = response.data.result.split('||').map((s: string) => s.trim());
                setSuggestions(suggestionArray);
            }
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            toast.error('Failed to load message suggestions');
        }
    };

    const handleSendMessage = async () => {
        if (!message.trim()) {
            toast.error('Please enter a message');
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post('/api/send_message', {
                username,
                content: message
            });

            if (response.data.success) {
                toast.success('Message sent successfully');
                setMessage('');
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error('Failed to send message');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSuggestions();
    }, []);

    return (
        <div className="container mx-auto p-4 max-w-2xl">
            <Card>
                <CardHeader>
                    <h2 className="text-2xl font-bold text-center">Send Anonymous Message to {username}</h2>
                </CardHeader>
                <CardContent className="space-y-4">
                    {suggestions.length > 0 && (
                        <div className="space-y-2">
                            <p className="font-medium">Suggested Questions:</p>
                            <div className="space-y-2">
                                {suggestions.map((suggestion, index) => (
                                    <Button 
                                        key={index} 
                                        variant="outline" 
                                        className="w-full text-left"
                                        onClick={() => setMessage(suggestion)}
                                    >
                                        {suggestion}
                                    </Button>
                                ))}
                            </div>
                            <Separator className="my-4" />
                        </div>
                    )}
                    
                    <Textarea
                        placeholder="Type your message here..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="min-h-[100px]"
                    />
                    
                    <Button 
                        className="w-full" 
                        onClick={handleSendMessage}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Sending...
                            </>
                        ) : (
                            'Send Message'
                        )}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default Page;