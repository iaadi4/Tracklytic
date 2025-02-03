import { z } from "zod";

const forgotPasswordSchema = z.object({
    email: z.string()
        .email({ message: "Enter your valid email address" })
        .min(5, { message: "Enter your valid email address" })
        .max(50, { message: "Email your valid email address" })
})

export default forgotPasswordSchema;