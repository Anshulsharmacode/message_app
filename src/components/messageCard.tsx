import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
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
import { Button } from './ui/button'
import { Message } from '@/model/user'
import { toast } from 'sonner'
import axios from 'axios'
import { Trash2, Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
}

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`/api/message/${message.id}`)
      toast.success("Message deleted successfully")
      onMessageDelete(message.id)
    } catch (error) {
      console.log(error)
      toast.error("Failed to delete message")
    }
  }

  return (
    <Card className="w-full max-w-2xl hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          {/* <CardTitle className="text-xl font-bold">{}</CardTitle> */}
          <CardDescription className="flex items-center text-sm text-gray-500">
            <Clock className="mr-1 h-4 w-4" />
            {message?.createdAt && formatDistanceToNow(new Date(message?.createdAt), { addSuffix: true })}
          </CardDescription>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className="text-gray-500 hover:text-red-500"
            >
              <Trash2 className="h-5 w-5" />
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
                onClick={handleDeleteConfirm}
                className="bg-red-500 hover:bg-red-600"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 whitespace-pre-wrap">{message?.content}</p>
      </CardContent>
      {/* <CardFooter className="text-sm text-gray-500">
        {message.author && (
          <p>By: {message.author}</p>
        )}
      </CardFooter> */}
    </Card>
  )
}

export default MessageCard