import UserModel from "@/model/user";
import bcrypt from "bcryptjs";
import dbconnect from "@/lib/db";
import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth";   
import CredentialsProvider from "next-auth/providers/credentials";
import { use } from "react";




export const authOption:NextAuthOptions={
    providers:[
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials:{
                email:{
                    label: "email",type: "text", placeholder: "jsmith"
                },
                password:{label: "Password", type: "password", placeholder: "********"}
            },
            async authorize(credentials:any):Promise<any> {
                await dbconnect();
                try {
                    const user = await UserModel.findOne({
                        $or:[
                            {email: credentials.identifier},
                            {username: credentials.identifier}
                        ]
                    })
                    if (!user) {
                        throw new Error("User not this email found");
                    }
                    if(!user.isVerified){
                        throw new Error("User is not verified");
                    }

                    const passwordCorrect =await bcrypt.compare(credentials.password, user.password)

                    if(passwordCorrect) {
                        return user
                        
                    }else{
                        throw new Error("Invalid password");
                    }


                } catch (error) {
                    throw new Error("Error authorizing user");
                }

            }
        })
        
    ],
    callbacks:{
        async jwt({token, user}){
            if(user){
                token.id = user._id;
                token.isVerified = user.isVerified;
                token.isAcceptiveMessage = user.isAcceptiveMessage;
                token.username = user.username;
            }
            return token;
        },
        async session({session, token}){
            if(token){
                session.user._id = token.id;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptiveMessage = token.isAcceptiveMessage;
                session.user.username = token.username;
               

            }
            return session;
        }
    },
    pages:{
        signIn: "/signin",
    },
    session:{
        strategy:"jwt", 
    },

    secret: process.env.NEXTAUTH_SECRET,
}