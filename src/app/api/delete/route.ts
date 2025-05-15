import dbconnect from '@/lib/db';
import UserModel from '@/model/user';
import { getServerSession } from 'next-auth';
import { authOption } from '@/app/api/auth/[...nextauth]/option';
import mongoose from 'mongoose';

export async function DELETE(
    request: Request,
) {
    await dbconnect();
    const session = await getServerSession(authOption);
    const _user = session?.user;

    if (!session || !_user) {
        return Response.json({
            success: false,
            message: "User not authenticated"
        });
    }

    try {
        // Get the message ID from the URL
        const url = new URL(request.url);
        const messageId = url.searchParams.get('id');

        if (!messageId) {
            return Response.json({
                success: false,
                message: "Message ID is required"
            });
        }

        const userId = new mongoose.Types.ObjectId(_user._id);

        // Find the user and update their messages array by removing the specified message
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {
                $pull: { messages: { _id: messageId } }
            },
            { new: true }
        );

        if (!updatedUser) {
            return Response.json({
                success: false,
                message: "User not found"
            });
        }

        return Response.json({
            success: true,
            message: "Message deleted successfully"
        });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error("Error deleting message:", errorMessage);
        console.log(error)
        console.log()
        return Response.json({
            success: false,
            message: `Error deleting message: ${errorMessage}`
        });
    }
}