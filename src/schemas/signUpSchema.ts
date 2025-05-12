import {z} from 'zod';

export const UserNameValidation = z
    .string()
    .min(3, {message: 'Username must be at least 3 characters long'})
    .max(20, {message: 'Username must be at most 20 characters long'})
    .regex(/^[a-zA-Z0-9_]+$/, {message: 'Username can only contain letters, numbers, and underscores'})


export const signUpSchema = z.object({
    username:UserNameValidation,
    email: z.string().email({message: 'invalid email address'}),
    password : z.string().min(2, {message: 'Password must be at least 2 characters long'})
    

})