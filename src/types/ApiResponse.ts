import { Message } from "@/model/user";

export interface ApiResponse {
    success: boolean;
    message: string;
    isAccesptingMessages: boolean;
    messages?:Array<Message>;  
}