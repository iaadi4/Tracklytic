"use client"

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import forgotPassowordSchema from "@/lib/schemas/forgotPasswordSchema";
import Link from "next/link";
import { z } from "zod";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { redirect } from "next/navigation";

export default function Signup() {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof forgotPassowordSchema>>({
    resolver: zodResolver(forgotPassowordSchema),
    defaultValues: {
      email: ""
    },
  })

  async function onSubmit(values: z.infer<typeof forgotPassowordSchema>) {
    const { email } = values;
    await authClient.forgetPassword({
      email,
      redirectTo: "/login"
    }, {
      onRequest: () => {
        setLoading(true);
        toast("Please wait", {
          position: "top-right",
          duration: 4000,
          icon: <LoaderCircle className="animate-spin h-4 w-4" />
        })
      },
      onSuccess: () => {
        setLoading(false);
        toast.success("Reset link sent successfully", {
          position: "top-right"
        });
        form.reset();
        redirect("/login")
      },
      onError: (ctx) => {
        setLoading(false);
        toast.error(ctx.error.message || "Failed to send reset link, please try again!", {
          position: "top-right",
          duration: 3000
        })
      }
    });
  }

  return (
    <div className="flex h-screen w-screen justify-center items-center">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Reset password</CardTitle>
          <CardDescription>Enter you email address to get reset password link</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={loading}>Submit</Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <CardDescription>
            Dont&apos;t have an account yet?, <Link href="/signup" className="underline text-black font-semibold"> Sign up</Link>
          </CardDescription>
        </CardFooter>
      </Card>
    </div>
  )
}
