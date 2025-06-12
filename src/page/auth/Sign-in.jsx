import React from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import Logo from "../../components/logo";
import { useMutation } from "@tanstack/react-query";
import { loginMutationFn } from "../../lib/api";
import { toast } from "../../hooks/use-toast";
import { Loader } from "lucide-react";

const SignIn = () => {
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: loginMutationFn
  });

  const formSchema = z.object({
    cuscode: z.string().trim().min(1, {
      message: "Cuscode is required",
    }),
    password: z.string().trim().min(6, {
      message: "Password is required",
    }),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cuscode: "",
      password: "",
    },
  });

  const onSubmit = (values) => {
    if (isPending) return;

    mutate(values, {
      onSuccess: (data) => {
        const token = data.token;
        localStorage.setItem("token", token);

        if (data.requirePasswordChange) {
          toast({
            title: "Password Change Required",
            description: "Please change your password before proceeding.",
            variant: "warning",
          });
          navigate(`/change-password?cuscode=${data.cusCode}`)
        } else {
          toast({
            title: "Login Successful",
            description: "You have successfully logged in.",
            variant: "success",
          });
          navigate(`/workspace/:${data.workspaceRedirectUrl}`);
        }
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        })
      },
    });
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          to="/"
          className="flex items-center gap-2 self-center font-medium"
        >
          <Logo />
          phAMAcore Cloud.
        </Link>
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Welcome back</CardTitle>
              <CardDescription>
                Login with your CusCode
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <div className="grid gap-2">
                        <FormField
                          control={form.control}
                          name="cuscode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="dark:text-[#f1f7feb5] text-sm">
                                CusCode
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="JR8XTV"
                                  className="!h-[48px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid gap-2">
                        <FormField
                          control={form.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center">
                                <FormLabel className="dark:text-[#f1f7feb5] text-sm">
                                  Password
                                </FormLabel>
                                <a
                                  href="#"
                                  className="ml-auto text-sm underline-offset-4 hover:underline"
                                >
                                  Forgot your password?
                                </a>
                              </div>
                              <FormControl>
                                <Input
                                  type="password"
                                  className="!h-[48px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isPending}
                      >
                        {isPending && <Loader className="animate-spin" />}
                        Login
                      </Button>
                    </div>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
          <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
            By clicking continue, you agree to our{" "}
            <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
