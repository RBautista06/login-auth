"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useParams } from "react-router-dom";

export default function ResetPasswordPage() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isSubmitted, setIsSubmitted] = useState(false);
  const { resetPassword, message, error } = useAuthStore();
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Clear previous errors
    setLocalError(null);

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }

    if (!token) {
      setLocalError("Reset Token is missing");
      return;
    }

    try {
      await resetPassword(token, password); // assumes this sets `message` or throws
      setIsSubmitted(true); // ✅ show success screen
    } catch (err) {
      // localError stays null here so Zustand error shows
    }
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
                {isSubmitted ? "Password Reset Successful" : "Reset Password"}
              </CardTitle>
            </motion.div>
          </CardHeader>

          <CardContent>
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div variants={itemVariants} className="space-y-4">
                  {/* Password */}
                  <div>
                    <Label
                      htmlFor="password"
                      className="text-sm font-medium text-gray-700">
                      New Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter new password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                        required
                      />
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <Label
                      htmlFor="confirmPassword"
                      className="text-sm font-medium text-gray-700">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                        required
                      />
                    </div>
                  </div>

                  {/* Error Message */}
                  {(localError || error) && (
                    <motion.p
                      variants={itemVariants}
                      className="text-red-600 text-sm bg-red-100 border border-red-200 rounded px-3 py-2">
                      {localError || error}
                    </motion.p>
                  )}
                </motion.div>

                {/* Submit Button */}
                <motion.div variants={itemVariants}>
                  <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap">
                    <Button
                      type="submit"
                      className="w-full h-12 mt-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-200">
                      Reset Password
                    </Button>
                  </motion.div>
                </motion.div>

                {/* Back to Login */}
                <motion.div
                  variants={itemVariants}
                  className="text-center pt-6">
                  <Link to="/login">
                    <motion.span
                      className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}>
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Log In
                    </motion.span>
                  </Link>
                </motion.div>
              </form>
            ) : (
              <div className="space-y-6 text-center">
                <motion.div variants={itemVariants}>
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-8 h-8 text-green-600" />
                  </div>
                  {message && (
                    <motion.p
                      variants={itemVariants}
                      className="text-green-600 text-sm bg-green-100 border border-green-200 rounded px-3 py-2">
                      {message}
                    </motion.p>
                  )}
                </motion.div>

                <motion.div variants={itemVariants} className="pt-4">
                  <Link to="/login">
                    <motion.span
                      className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}>
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Log In
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
