import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import VerificationEmail from "../../emails/VerificationEmails";
import { ApiResponse } from "@/types/ApiResponse";
import React from "react";

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifycode: string
){
    try {
        const emailHtml = await render(
            React.createElement(VerificationEmail, { username, otp: verifycode })
        );

        await transporter.sendMail({
            from: '"Acme" <no-reply@acme.com>',
            to: email,
            subject: "Verification Email",
            html: emailHtml, 
        });

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
