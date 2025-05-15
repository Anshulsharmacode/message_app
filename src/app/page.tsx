import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import Link from 'next/link';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-16 flex flex-col items-center text-center space-y-8">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-12 w-12 text-primary" />
          <h1 className="text-4xl font-bold">Mysterious Message</h1>
        </div>
        
        <p className="text-xl text-muted-foreground max-w-2xl">
          Send and receive anonymous messages. Connect with others in a unique way through honest feedback and meaningful conversations.
        </p>

        <div className="grid gap-4 mt-8">
          <Link href="/signup">
            <Button size="lg" className="px-8">
              Get Started
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" size="lg" className="px-8">
              Check Your Messages
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="p-6 bg-card rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Anonymous Messaging</h3>
            <p className="text-muted-foreground">Send private messages without revealing your identity</p>
          </div>
          <div className="p-6 bg-card rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Smart Suggestions</h3>
            <p className="text-muted-foreground">Get AI-powered message suggestions for meaningful conversations</p>
          </div>
          <div className="p-6 bg-card rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Easy Sharing</h3>
            <p className="text-muted-foreground">Share your profile link and start receiving messages</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;