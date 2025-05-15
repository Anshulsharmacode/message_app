import dbconnect from "@/lib/db";
import UserModel from "@/model/user";
import { Message } from "@/model/user";



export async function POST(request: Request){
    await dbconnect();

    const {username, content } = await request.json();

    try {

        const user =await UserModel.findOne({username})
        if(!user){
            return Response.json({
                success: false,
                message: "User not found",
            });
        }
        //validate the user is accepting messages
        //// here give sample value of isAcceptiveMessage
        if(!user.isAcceptiveMessage){
            return Response.json({
                success: false,
                message: "User is not accepting messages",
            });
        }

        const newMessage = {content , createdAt: new Date()};
        user.messages.push(newMessage as Message);
        await user.save();

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