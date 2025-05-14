import dbconnect from '@/lib/db';
import UserModel from '@/model/user';
import { User } from 'next-auth';
import {authOption} from '@/app/api/auth/[...nextauth]/option';
import { NextAuthOptions } from 'next-auth';
import { getServerSession } from 'next-auth';
import mongoose from 'mongoose';


export async function GET(request: Request) {
    await dbconnect();
    const session = await getServerSession(authOption);
    const _user = session?.user;

    if (!session || !_user) {
        console.log("No session or user found:", { session, _user });
        return Response.json({
            success: false,
            message: "User not authenticated",
            messages: [],
        });
    }

    try {
        // Check for user._id instead of user.id
        if (!_user._id) {
            console.error("User ID is missing from session:", _user);
            return Response.json({
                success: false,
                message: "User ID not found in session",
                messages: [],
            });
        }

        const userId = new mongoose.Types.ObjectId(_user._id);
        console.log("Fetching messages for user ID:", userId);

        const user = await UserModel.findById(userId);
        if (!user) {
            return Response.json({
                success: false,
                message: "User not found",
                messages: []
            });
        }

        // Sort messages by date directly
        const sortedMessages = user.messages.sort((a, b) => 
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
