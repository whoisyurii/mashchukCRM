import React from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate } from "react-router-dom";
import { Workflow } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { RegisterForm } from "./index";

export const RegisterPage: React.FC = () => {
  const { register: registerUser, user } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    watch,
  } = useForm<RegisterForm>();

  const password = watch("password");

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = async (data: RegisterForm) => {
    try {
      await registerUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      });
    } catch (error: any) {
      setError("root", {
        message: error.response?.data?.message || "Registration failed",
      });
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <Workflow className="w-12 h-12 text-emerald-400 flex-shrink-0" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-white">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Or{" "}
            <Link
              to="/login"
              className="font-medium text-emerald-400 hover:text-emerald-300"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {errors.root && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <p className="text-sm text-red-400">{errors.root.message}</p>
            </div>
          )}

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First name"
                autoComplete="given-name"
                {...register("firstName", {
                  required: "First name is required",
                })}
                error={errors.firstName?.message}
              />

              <Input
                label="Last name"
                autoComplete="family-name"
                {...register("lastName", {
                  required: "Last name is required",
                })}
                error={errors.lastName?.message}
              />
            </div>

            <Input
              label="Email address"
              type="email"
              autoComplete="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email address",
                },
              })}
              error={errors.email?.message}
            />

            <Input
              label="Password"
              type="password"
              autoComplete="new-password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              error={errors.password?.message}
            />

            <Input
              label="Confirm password"
              type="password"
              autoComplete="new-password"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
              error={errors.confirmPassword?.message}
            />
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating account..." : "Create account"}
          </Button>
        </form>
      </div>
    </div>
  );
};
