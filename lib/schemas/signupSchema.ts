import { z } from "zod";

const signupSchema = z.object({
    name: z.string().min(3).max(20),
    email: z.string().min(3).max(20),
    password: z.string().min(6).max(30),
    confirmPassword: z.string().min(6).max(30)
})

export default signupSchema;