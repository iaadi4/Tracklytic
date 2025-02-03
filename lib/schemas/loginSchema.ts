import { z } from "zod";

const loginSchema = z.object({
    email: z.string().min(5).max(50),
    password: z.string().min(6).max(50)
})

export default loginSchema;