import { getServerSession } from "next-auth";
import { authOption } from "../auth/[...nextauth]/option";
import UserModel from "@/model/user";
import dbconnect from "@/lib/db";
import mongoose from 'mongoose';

export async function GET() {
    await dbconnect();
    const session = await getServerSession(authOption);
    const user = session?.user;

    if (!session || !user) {
        console.log("No session or user found");
        return Response.json({
            success: false,
            message: "User not authenticated",
            messages: [],
        });
    }

    try {
        const userId = user._id || user.id;
        if (!userId) {
            console.error("User ID is missing from session:", user);
            return Response.json({
                success: false,
                message: "User ID not found in session",
                messages: [],
            });
        }

        // Convert string ID to ObjectId
        const userObjectId = new mongoose.Types.ObjectId(userId);
        console.log("Fetching messages for user ID:", userObjectId);

        const foundUser = await UserModel.findById(userObjectId);
        if (!foundUser) {
            return Response.json({
                success: false,
                message: "User not found",
                messages: []
            });
        }

        // Sort messages by date directly
        const sortedMessages = foundUser.messages.sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        return Response.json({
            success: true,
            message: "Messages retrieved successfully",
            messages: sortedMessages
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error("Error fetching messages:", errorMessage);
        return Response.json({
            success: false,
            message: `Error fetching messages: ${errorMessage}`,
            messages: []
        });
    }
}
