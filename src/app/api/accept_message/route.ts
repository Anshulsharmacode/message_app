import dbconnect from '@/lib/db';
import UserModel, { User } from '@/model/user';
import {authOption} from '@/app/api/auth/[...nextauth]/option';
import { getServerSession } from 'next-auth';
import mongoose from 'mongoose';


export async function POST(request: Request) {
  await dbconnect();

  const session = await getServerSession(authOption);
  const user = session?.user;
  
  if (!session || !user) {
    return Response.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
  }

  const { acceptMessage } = await request.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      user._id,
      { isAcceptiveMessage: acceptMessage },  // Match this with your schema
      { new: true }
    );

    if (!updatedUser) {
      return Response.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      message: `Messages are now ${acceptMessage ? 'enabled' : 'disabled'}`,
      isAcceptiveMessage: updatedUser.isAcceptiveMessage
    });

  } catch (error) {
    console.error('Error:', error);
    return Response.json(
      { success: false, message: 'Failed to update preferences' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  await dbconnect();
  const session = await getServerSession(authOption);
  const user = session?.user;

  if (!session || !user) {
    return Response.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
  }

  try {
    const foundUser = await UserModel.findById(user._id);

    if (!foundUser) {
      return Response.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      isAcceptiveMessage: foundUser.isAcceptiveMessage  // Match this with your schema
    });

  } catch (error) {
    console.error('Error:', error);
    return Response.json(
      { success: false, message: 'Failed to fetch preferences' },
      { status: 500 }
    );
  }
}