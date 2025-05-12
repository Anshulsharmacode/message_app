import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmails";
import { ApiResponse } from "@/types/ApiResponse"; 

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifycode: string
): Promise<ApiResponse> {
    try {
        const { data, error } = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Verification Email',
            react: VerificationEmail({ username, otp: verifycode }),
        });

        if (error) {
            console.error("Resend API Error:", error);
            return {
                success: false,
                message: "Failed to send verification email",
                isAccesptingMessages: false,
            };
        }

        return {
            success: true,
            message: "Verification email sent successfully",
            isAccesptingMessages: true,
        };
        
    } catch (error) {
        console.error("Error sending verification email:", error);
        return {
            success: false,
            message: "Failed to send verification email",
            isAccesptingMessages: false,
        };
    }
}
