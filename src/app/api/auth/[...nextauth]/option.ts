import UserModel from "@/model/user";
import bcrypt from "bcryptjs";
import dbconnect from "@/lib/db";
import { NextAuthOptions } from "next-auth";
  
import CredentialsProvider from "next-auth/providers/credentials";


// interface Credentials {
    //     identifier: string;
    //     password: string;
//   }



export const authOption:NextAuthOptions={

    
    providers:[
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials:{
                email:{
                    label: "Email or Username",
                    type: "text", 
                    placeholder: "jsmith"
                },
                password:{
                    label: "Password", 
                    type: "password", 
                    placeholder: "********"
                }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;
                
                await dbconnect();
                try {
                    const user = await UserModel.findOne({
                        $or:[
                            {email: credentials.email},
                            {username: credentials.email}
                        ]
                    }).select('+password')
                    
                    if (!user) {
                        throw new Error("User not found");
                    }
                    if(!user.isVerified){
                        throw new Error("User is not verified");
                    }

                    // if (user) {
                    //     // Ensure both id and _id are set
                    //     token.id = user.id || user._id;
                    //     token._id = user._id || user.id;
                    //     token.isVerified = user.isVerified;
                    //     token.isAcceptiveMessage = user.isAcceptiveMessage;
                    //     token.username = user.username;
                    //     token.email = user.email;
                    // }

                    const passwordCorrect = await bcrypt.compare(credentials.password, user.password)

                    if(passwordCorrect) {
                        return {
                            id: user.id.toString(),
                            _id: user.id.toString(),
                            email: user.email,
                            username: user.username,
                            isVerified: user.isVerified,
                            isAcceptiveMessage: user.isAcceptiveMessage
                        }
                    } else {
                        throw new Error("Invalid password");
                    }

                } catch (error) {
                    console.log(error)
                    throw new Error("Error authorizing user");
                }
            }
        })
        
    ],
    callbacks:{
        async jwt({token, user}){
            if(user){
                token.sub = user._id || user.id;
            }
            return token;
        },
        async session({session, token}){
            if(session.user){
                session.user._id = token.sub;
                session.user.id = token.sub;
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