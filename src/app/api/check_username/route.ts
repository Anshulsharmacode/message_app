import {UserNameValidation} from '@/schemas/signUpSchema';
import {z} from 'zod';
import dbconnect from '@/lib/db';
import UserModel from '@/model/user';


const UsernameQuery = z.object({
    username: UserNameValidation
});

export async function GET(request: Request) {
    await dbconnect();

    try {
        const {searchParams} = new URL(request.url);
        const queryParams ={
            username: searchParams.get('username')
        }
        const result =UsernameQuery.safeParse(queryParams);

        if(!result.success){
            const usernameError = result.error.format().username?._errors || []
            return Response.json({
                success: false,
                message: usernameError?.length > 0 ? usernameError[0] : 'Invalid username',
                isAcceptingMessages: false,
            })
        }

        const {username} = result.data;

        const existingUser = await UserModel.findOne({
            username,isVerified: true
        })
        if (existingUser) {
            return Response.json({
                success: false,
                message: "Username already exists",
                isAcceptingMessages: false,
            });
        }
        return Response.json({
            success: true,
            message: "Username is available",
            isAcceptingMessages: true,
        });



        
    } catch (error) {
        console.error("Error in GET request:", error);
        return Response.json({
            success: false,
            message: "Internal server error",
            isAcceptingMessages: false,
        });
        
    }
}