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
        // Use email instead of ID for finding the user
        const userEmail = user.email;
        if (!userEmail) {
            console.error("User email is missing from session:", user);
            return Response.json({
                success: false,
                message: "User email not found in session",
                messages: [],
            });
        }

        console.log("Fetching messages for user email:", userEmail);

        const foundUser = await UserModel.findOne({ email: userEmail });
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
