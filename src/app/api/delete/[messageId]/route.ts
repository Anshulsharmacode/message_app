import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOption } from "@/app/api/auth/[...nextauth]/option";
import dbconnect from "@/lib/db";
import UserModel from "@/model/user";
import mongoose from "mongoose";

// Single route handler with only one parameter
export async function DELETE(req: NextRequest) {
  await dbconnect();
  
  // Extract messageId from the URL
  const url = new URL(req.url);
  const pathParts = url.pathname.split('/');
  const messageId = pathParts[pathParts.length - 1];
  
  const session = await getServerSession(authOption);
  const _user = session?.user;

  if (!session || !_user) {
    return NextResponse.json(
      { success: false, message: "User not authenticated" },
      { status: 401 }
    );
  }

  if (!messageId) {
    return NextResponse.json(
      { success: false, message: "Message ID is required" },
      { status: 400 }
    );
  }

  try {
    const userId = new mongoose.Types.ObjectId(_user.id);

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        $pull: { messages: { _id: new mongoose.Types.ObjectId(messageId) } },
      },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}