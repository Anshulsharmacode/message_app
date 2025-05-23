import dbconnect from "@/lib/db";
import UserModel from "@/model/user";
import { Message } from "@/model/user";



export async function POST(request: Request){
    await dbconnect();

    const {username, content } = await request.json();

    try {
        // Use findOneAndUpdate instead of findOne + save to avoid version conflicts
        const user = await UserModel.findOneAndUpdate(
            { username: { $regex: new RegExp(`^${username}$`, 'i') } },
            { $push: { messages: { content, createdAt: new Date() } } },
            { new: true }
        );
        
        if(!user){
            return Response.json({
                success: false,
                message: "User not found",
            });
        }
        
        //validate the user is accepting messages
        if(!user.isAcceptiveMessage){
            return Response.json({
                success: false,
                message: "User is not accepting messages",
            });
        }

        return Response.json({
            success: true,
            message: "Message sent successfully",
        });
        
    } 
    catch (error) {
        console.error("Error in send message:", error);
        return Response.json({
            success: false,
            message: "Error sending message",
        });
    }
}