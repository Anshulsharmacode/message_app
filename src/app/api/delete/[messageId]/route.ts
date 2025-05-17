import dbconnect from '@/lib/db';
import UserModel from '@/model/user';
import { getServerSession } from 'next-auth';
import { authOption } from '@/app/api/auth/[...nextauth]/option';
import mongoose from 'mongoose';

export async function DELETE(
    request: Request,
    context: { params: { messageId: string } }
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
        const { messageId } = context.params;

        if (!messageId) {
            return Response.json({
                success: false,
                message: "Message ID is required"
            });
        }

        const userId = new mongoose.Types.ObjectId(_user.id);

        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {
                $pull: { messages: { _id: new mongoose.Types.ObjectId(messageId) } }
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
        console.error("Error deleting message:", error);
        return Response.json({
            success: false,
            message: "Error deleting message"
        });
    }
}