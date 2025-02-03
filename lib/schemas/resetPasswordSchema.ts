import { z } from "zod";

const resetPasswordSchema = z.object({
    password: z.string()
        .min(6, { message: "Password should be atleast 6 characters long" })
        .max(30, { message: "Password cannot exceed 30 characters "})
})

export default resetPasswordSchema;