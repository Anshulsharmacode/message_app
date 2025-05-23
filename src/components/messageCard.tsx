import React from 'react'
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Message } from '@/model/user'
import { Trash2 } from 'lucide-react'


interface MessageCardProps {
  message: Message;
  onMessageDelete: (messageId: string) => Promise<void>;
}

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
  console.log('Rendering message:', message)
  
  const handleDelete = async () => {
    if (!message._id) {
      console.error('Message ID is missing');
      return;
    }
    
    try {
      await onMessageDelete(message._id.toString());
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  return (
    <Card className="w-full max-w-2xl hover:shadow-lg transition-shadow duration-300">
      <CardContent className="pt-6">
        <p className="text-gray-700 whitespace-pre-wrap">{message?.content || 'No content'}</p>
      </CardContent>
      <CardFooter className="justify-end">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant="destructive" 
              size="sm"
              className="text-gray-500 hover:text-red-500"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Message</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this message? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  )
}

export default MessageCard