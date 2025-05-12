import dbconnect from '@/lib/db';
import UserModel from '@/model/user';
import { User } from 'next-auth';
import {authOption} from '@/app/api/auth/[...nextauth]/option';
import { NextAuthOptions } from 'next-auth';
import { getServerSession } from 'next-auth';

export async function POST (request:Request){ 
    await dbconnect();
    const session = await getServerSession(authOption);
    // const user = session?.user as User
    const user = session?.user

    if(!session || !session?.user){
        return Response.json({
            success: false,
            message: "User not found",
            isAcceptingMessages: false,
        });
    }
    const userId = user.id;
    const {acceptMessage}=await request.json();

    try {
        const updateUser = await UserModel.findByIdAndUpdate(userId, {
            isAcceptingMessages: acceptMessage
        }, { new: true });
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


export async function GET (request:Request){
    await dbconnect();
    const session = await getServerSession(authOption);
    // const user = session?.user as User
    const user = session?.user

    if(!session || !session?.user){
        return Response.json({
            success: false,
            message: "User not found",
            isAcceptingMessages: false,
        });
    }
    const userId = user.id;
    
    try {
        const findUser = await UserModel.findById(userId);
        if (!findUser) {
            return Response.json({
                success: false,
                message: "User not found",
                isAcceptingMessages: false,
            });
        }
        return Response.json({
            success: true,
            message: "User found successfully",
            isAcceptingMessages: findUser.isAcceptiveMessage,
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