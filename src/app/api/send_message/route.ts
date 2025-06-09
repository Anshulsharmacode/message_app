import dbconnect from "@/lib/db";
import UserModel from "@/model/user";




export async function POST(request: Request){
    await dbconnect();

    const {username, content } = await request.json();

    try {
        // First find the user without updating
        const user = await UserModel.findOne(
            {username }
        );
        
        if(!user){
            return Response.json({
                success: false,
                message: "User not found",
            });
        }
        
   
        if(!user.isAcceptiveMessage){
            return Response.json({
                success: false,
                message: "User is not accepting messages",
            });
        }

        const updatedUser = await UserModel.findOneAndUpdate(
            { email: user.email },  
            { $push: { messages: { content, createdAt: new Date() } } },
            { new: true } 
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