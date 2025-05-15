import dbconnect from '@/lib/db';
import UserModel from '@/model/user';
import {authOption} from '@/app/api/auth/[...nextauth]/option';
import { getServerSession } from 'next-auth';
import mongoose from 'mongoose';

export async function POST(request: Request) { 
    await dbconnect();
    const session = await getServerSession(authOption);
    const user = session?.user;

    if (!session || !user) {
        return Response.json({
            success: false,
            message: "User not authenticated",
            isAcceptingMessages: false,
        });
    }

    const userId = session?.user._id || session?.user.id;
    if (!userId) {
        console.log(userId , "userId")
        return Response.json({
            success: false,
            message: "User ID not found in session",
            isAcceptingMessages: false,
        });
    }

    const {acceptMessage} = await request.json();
    const userObjectId = new mongoose.Types.ObjectId(userId);

    try {
        const updateUser = await UserModel.findByIdAndUpdate(
            userObjectId,
            { isAcceptiveMessage: acceptMessage },
            { new: true }
        );

        if (!updateUser) {
            return Response.json({
                success: false,
                message: "User not found",
                isAcceptingMessages: false,
            });
        }

        return Response.json({
            success: true,
            message: "User updated successfully",
            isAcceptingMessages: updateUser.isAcceptiveMessage,
        });
        
    } catch (error) {
        console.error("Error in update user:", error);
        return Response.json({
            success: false,
            message: "Error updating user",
            isAcceptingMessages: false,
        });
    }
}

export async function GET() {
    await dbconnect();
    const session = await getServerSession(authOption);
    const user = session?.user;

    if (!session || !user) {
        return Response.json({
            success: false,
            message: "User not authenticated",
            isAcceptingMessages: false,
        });
    }

    const userId = session?.user._id || session?.user.id;
    if (!userId) {
        return Response.json({
            success: false,
            message: "User ID not found in session or user",
            isAcceptingMessages: false,
        });
    }

    try {
        const userObjectId = new mongoose.Types.ObjectId(userId);
        const foundUser = await UserModel.findById(userObjectId);
        
        if (!foundUser) {
            return Response.json({
                success: false,
                message: "User not found",
                isAcceptingMessages: false,
            });
        }

        return Response.json({
            success: true,
            message: "User found successfully",
            isAcceptingMessages: foundUser.isAcceptiveMessage,
        });
        
    } catch (error) {
        console.error("Error in find user:", error);
        return Response.json({
            success: false,
            message: "Error finding user",
            isAcceptingMessages: false,
        });
    }
}