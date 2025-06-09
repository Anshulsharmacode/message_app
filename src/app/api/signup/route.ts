import dbconnect from "@/lib/db";
import { sendVerificationEmail } from "@/helper/sendVerifcationEmail";
import bcrypt from "bcryptjs";
import UserModel from "@/model/user";

export async function POST(request: Request) {
    await dbconnect();

    try {
        const { email, username, password } = await request.json();
        // console.log("Email:", email);
        // console.log("Username:", username);

        const existingUserVerified = await UserModel.findOne({
            email,
            isVerified: true,
        });

        if (existingUserVerified) {
            return Response.json({
                success: false,
                message: "User already exists",
                isAcceptingMessages: false,
            });
        }

        const existingUserByEmail = await UserModel.findOne({ email });
        
        const verifycode = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedPassword = await bcrypt.hash(password, 10);

        if (existingUserByEmail) {
            existingUserByEmail.password = hashedPassword;
            existingUserByEmail.verifycode = verifycode;
            existingUserByEmail.verifyexpire = new Date(Date.now() + 60 * 60 * 1000);
            await existingUserByEmail.save();
        } else {
            const expirydate = new Date();
            expirydate.setHours(expirydate.getHours() + 1);

            const newUser = new UserModel({
                
                username,
                email,
                password: hashedPassword,
                verifycode,
                verifyexpire: expirydate,
                isVerified: false,
                isAcceptingMessages: true,
                messages: [],
            });

            await newUser.save();
        }

        const emailResponse = await sendVerificationEmail(email, username, verifycode);
        if (!emailResponse.success) {
            return Response.json({
                success: false,
                message: emailResponse.message,
                isAcceptingMessages: false,
            });
        }

        return Response.json({
            success: true,
            message: "Verification email sent successfully",
            isAcceptingMessages: true,
        });

    } catch (error) {
        console.log("Error in signup route:", error);
        return Response.json({
            success: false,
            message: "Internal server error",
            isAcceptingMessages: false,
        });
    }
}
