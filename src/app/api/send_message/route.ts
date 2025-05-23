import dbconnect from "@/lib/db";
import UserModel from "@/model/user";
import { Message } from "@/model/user";



export async function POST(request: Request){
    await dbconnect();

    const {username, content } = await request.json();

    try {
        // First find the user without updating
        const user = await UserModel.findOne(
            { username: { $regex: new RegExp(`^${username}$`, 'i') } }
        );
        
        if(!user){
            return Response.json({
                success: false,
                message: "User not found",
            });
        }
        
        // Check if the user is accepting messages before adding the message
        if(!user.isAcceptiveMessage){
            return Response.json({
                success: false,
                message: "User is not accepting messages",
            });
        }

        // Use findOneAndUpdate instead of manually pushing and saving
        // This avoids the version error by doing the update atomically
        const updatedUser = await UserModel.findOneAndUpdate(
            { email: user.email },  // Use email as the identifier instead of _id
            { $push: { messages: { content, createdAt: new Date() } } },
            { new: true }  // Return the updated document
        );

        if (!updatedUser) {
            return Response.json({
                success: false,
                message: "Failed to update user",
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