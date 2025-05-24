"use client"

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import resetPasswordSchema from "@/lib/schemas/resetPasswordSchema";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { LoaderCircle } from "lucide-react";
import { redirect } from "next/navigation";

export default function ResetPassword() {
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  useEffect(() => {
    const searchToken = new URLSearchParams(window.location.search).get("token");
    if (!searchToken) {
      toast.error("Invalid token, failed to reset password");
      redirect("/login");
    } else {
      setToken(searchToken);
    }
  }, []);

  async function onSubmit(values: z.infer<typeof resetPasswordSchema>) {
    if (!token) return;

    const { password } = values;
    await authClient.resetPassword(
      {
        newPassword: password,
        token,
      },
      {
        onRequest: () => {
          setLoading(true);
          toast("Please wait", {
            position: "top-right",
            duration: 3000,
            icon: <LoaderCircle className="animate-spin h-4 w-4" />,
          });
        },
        onSuccess: () => {
          toast.success("Password reset successfully", {
            position: "top-right",
            duration: 3000,
          });
          setLoading(false);
          form.reset();
          redirect("/login");
        },
        onError: (ctx) => {
          setLoading(false);
          toast.error(ctx.error.message || "Failed to reset password, please try again!", {
            position: "top-right",
            duration: 3000,
          });
        },
      }
    );
  }

  return (
    <div className="flex h-screen w-screen justify-center items-center">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>Create a strong password</CardDescription>
        </CardHeader>
        <CardContent>
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter new password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={loading || !token}>
                Submit
              </Button>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
}
