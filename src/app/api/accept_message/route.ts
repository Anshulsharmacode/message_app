import dbconnect from '@/lib/db';
import UserModel from '@/model/user';
import {authOption} from '@/app/api/auth/[...nextauth]/option';
import { getServerSession } from 'next-auth';
import mongoose from 'mongoose';



export async function POST(request: Request) {
  await dbconnect();

  const session = await getServerSession(authOption);
  const user = session?.user;
  // console.log(user , "user")
  // console.log("user._id",user._id)
  if (!session || !user) {
    return Response.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
  }

  const { acceptMessage } = await request.json();

  try {
    // Use email instead of ID for finding and updating the user
    const userEmail = user.email;
    
    const updatedUser = await UserModel.findOneAndUpdate(
      { email: userEmail },
      { isAcceptiveMessage: acceptMessage },
      { new: true }
    );
    
    console.log(updatedUser, "updatedUser")
    if (!updatedUser) {
      return Response.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      message: `Messages ar e now ${acceptMessage ? 'enabled' : 'disabled'}`,
      // isAcceptiveMessage: updatedUser.isAcceptiveMessage
    });

  } catch (error) {
    console.error('Error updating message preferences:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error details:', { errorMessage });
    return Response.json(
      { success: false, message: 'Failed to update preferences', error: errorMessage },
      { status: 500 }
    );
  }
}

export async function GET() {
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
    // Use email instead of ID for finding the user
    const userEmail = user.email;
    console.log('Fetching message preferences for user email:', userEmail);
    
    const foundUser = await UserModel.findOne({ email: userEmail });

    if (!foundUser) {
      console.error('User not found in GET accept_message with email:', userEmail);
      return Response.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      isAcceptiveMessage: foundUser.isAcceptiveMessage
    });

  } catch (error) {
    console.error('Error fetching message preferences:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error details:', { errorMessage });
    return Response.json(
      { success: false, message: 'Failed to fetch preferences', error: errorMessage },
      { status: 500 }
    );
  }
}