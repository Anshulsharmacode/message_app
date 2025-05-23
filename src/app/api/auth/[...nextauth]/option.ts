import UserModel from "@/model/user";
import bcrypt from "bcryptjs";
import dbconnect from "@/lib/db";
import { NextAuthOptions } from "next-auth";
  
import CredentialsProvider from "next-auth/providers/credentials";
// import user from "@/model/user";


// interface Credentials {
//    s
//   }



export const authOption:NextAuthOptions={

    
    providers:[
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials:{
                email:{
                    label: "Email or Username",
                    type: "email", 
                    placeholder: "jsmith"
                },
                password:{
                    label: "Password", 
                    type: "password", 
                    placeholder: "********"
                }
            },
            // Remove the stray 'c' character that was here
            async authorize(credentials) {
                console.log("Auth attempt with:", { 
                    email: credentials?.email,
                    hasPassword: !!credentials?.password 
                });

                console.log("Credentials:", credentials);

                if (!credentials?.email || !credentials?.password) {
                    console.log("Missing credentials");
                    throw new Error("Missing credentials");
                }
                
                await dbconnect();
                try {
                    // console.log("Looking for user with email/username:", credentials.email);
                    
                    const user = await UserModel.findOne({
                        $or: [
                            { email: credentials.email },
                            { username: credentials.email }
                        ]
                    }).select('+password');
                    
                    // console.log("User found:", !!user); //

                    if (!user) {
                        console.log("No user found with provided credentials");
                        throw new Error("Invalid email or password");
                    }

                    // console.log("Verification status:", user.isVerified);
                    if (!user.isVerified) {
                        console.log("User not verified");
                        throw new Error("Please verify your email first");
                    }

                    // console.log("Comparing passwords...");
                    const passwordCorrect = await bcrypt.compare(
                        credentials.password, 
                        user.password
                    );
                    
                    // console.log("Password correct:", passwordCorrect);
                    if (!passwordCorrect) {
                        console.log("Password comparison failed");
                        throw new Error("Invalid email or password");
                    }

                    const userToReturn = {
                        id: user.id.toString(),
                        email: user.email,
                        username: user.username,
                        isVerified: user.isVerified,
                        isAcceptiveMessage: user.isAcceptiveMessage
                    };
                    //  console.log("Authentication successful, returning user:", {
                    //     ...userToReturn,
                    //     password: undefined
                    // });

                    return userToReturn;

                } catch (error) {
                    console.error("Error during authentication:", error);
                    throw error;
                }
            }
        })
        
    ],
    callbacks:{
        async jwt({token, user}){
            // console.log("JWT Callback - Input:", { 
            //     tokenSub: token?.sub,
            //     userId: user?.id 
            // });
            
            if (user) {
                const newToken = {
                    ...token,
                    _id: user.id,
                    username: user.username,
                    isVerified: user.isVerified,
                    isAcceptiveMessage: user.isAcceptiveMessage,
                    email: user.email
                };
                //  console.log("JWT Callback - New token created:", newToken);
                return newToken;
            }
            // console.log("JWT Callback - Returning existing token");
            return token;
        },
        async session({session, token}){
            //          console.log("Session Callback - Input:", {
            //     sessionId: token?._id,
            //     tokenSub: token?.sub
            // });
            
            const newSession = {
                ...session,
                user: {
                    ...session.user,
                    username: token.username,
                    isVerified: token.isVerified,
                    isAcceptiveMessage: token.isAcceptiveMessage,
                    email: token.email,
                    _id: token._id || token.sub, // Added fallback to token.sub
                    id: token._id || token.sub // Added fallback to token.sub
                }
            };
            // console.log("Session Callback - New session created:", newSession);
            return newSession;
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