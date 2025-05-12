
import {z} from 'zod'

export const signUpSchema = z.object({
    email: z.string().email({message: 'invalid email address'}),
    password: z.string({message: 'invalid password '}),
})