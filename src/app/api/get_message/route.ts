import dbconnect from '@/lib/db';
import UserModel from '@/model/user';
import { User } from 'next-auth';
import {authOption} from '@/app/api/auth/[...nextauth]/option';
import { NextAuthOptions } from 'next-auth';
import { getServerSession } from 'next-auth';
import mongoose from 'mongoose';


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
    const userId = new mongoose.Types.ObjectId(user.id);

    try {
        const user = await UserModel.aggregate([
            {
                $match: {
                    _id: userId // Use the userId variable here
                }
            },
            {$unwind: "$messages"},//$because we want to get the messages from mongodb

            {$sort: { "messages.createdAt": -1 }},//$sort the messages by createdAt
            {
                $group: {
                    _id: "$_id",
                    message: { $push: "$messages" },//$push the messages into an array

                }
            }
        ])
        if (!user) {
            return Response.json({
                success: false,
                message: "User not found",
                // isAcceptingMessages: false,
            });
        }
        return Response.json({
            success: true,
            message: "User updated successfully",
            messages: user[0].message,
        });
    } catch (error) {
        
    }
    
   
       
}
