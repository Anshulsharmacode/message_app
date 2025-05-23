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
  const user = session?.user;

  if (!session || !user) {
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
    // Check if the messageId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(messageId)) {
      return NextResponse.json(
        { success: false, message: "Invalid message ID format" },
        { status: 400 }
      );
    }

    const updatedUser = await UserModel.findOneAndUpdate(
      { email: user.email },
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