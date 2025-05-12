import dbconnect from '@/lib/db';
import UserModel from '@/model/user';

export async function POST (request:Request){

    await dbconnect();
    try {
        const{username,code} = await request.json();
        const user = await UserModel.findOne({
            username
        })

        if (!user) {
            return Response.json({
                success: false,
                message: "User not found",
                isAcceptingMessages: false,
            });
            
        }
        const verifycode = user.verifycode ===code;
        const isCodeExpired =  new Date(user.verifyexpire) > new Date();

        if(verifycode && isCodeExpired){
            user.isVerified = true;
            await user.save();
            return Response.json({
                success: true,
                message: "Code verified successfully",
                isAcceptingMessages: true,
            });
        }else if(!isCodeExpired){
            return Response.json({
                success: false,
                message: "Code expired",
                isAcceptingMessages: false,
            });
        }else{
            return Response.json({
                success: false,
                message: "Invalid code",
                isAcceptingMessages: false,
            }); 
        }


        
    } catch (error) {
        console.error("Error in verify request:", error);
        return Response.json({
            success: false,
            message: "verify code error",
            isAcceptingMessages: false,
        });
    }

}