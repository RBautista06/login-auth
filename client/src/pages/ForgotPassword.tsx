"use client";

import type React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { forgotPassword, message } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Password reset requested for:", email);
    await forgotPassword(email);
    setIsSubmitted(true);
    // Add your password reset logic here
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5 },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.02,
      transition: { duration: 0.2 },
    },
    tap: {
      scale: 0.98,
      transition: { duration: 0.1 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md">
        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 text-center pb-8">
            <motion.div variants={itemVariants}>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {isSubmitted ? "Check Your Email" : "Forgot Password?"}
              </CardTitle>
            </motion.div>
          </CardHeader>

          <CardContent>
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div variants={itemVariants} className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setEmail(e.target.value)
                      }
                      className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                      required
                    />
                  </div>
                  <motion.div variants={itemVariants}>
                    <CardDescription className="text-gray-400 text-xs">
                      {isSubmitted
                        ? "We've sent a password reset link to your email address"
                        : "Enter your email address and we'll send you a link to reset your password"}
                    </CardDescription>
                  </motion.div>
                </motion.div>

                <motion.div variants={itemVariants} className="">
                  <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap">
                    <Button
                      type="submit"
                      className="w-full h-12 mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-200">
                      Send Reset Link
                    </Button>
                  </motion.div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="text-center pt-6">
                  <Link to="/signup">
                    <motion.span
                      className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}>
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Sign In
                    </motion.span>
                  </Link>
                </motion.div>
              </form>
            ) : (
              <div className="space-y-6">
                <motion.div variants={itemVariants} className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-green-600" />
                  </div>
                  <p className="text-gray-600 mb-6">
                    If an account with <strong>{email}</strong> exists, you will
                    receive a password reset email shortly.
                  </p>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap">
                    <Button
                      onClick={() => setIsSubmitted(false)}
                      className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-200">
                      Send Another Email
                    </Button>
                  </motion.div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="text-center pt-4">
                  <Link to="/signup">
                    <motion.span
                      className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}>
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Sign In
                    </motion.span>
                  </Link>
                </motion.div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
