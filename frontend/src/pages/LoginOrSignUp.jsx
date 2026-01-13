import React, { useState, useEffect, useId, useRef } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useFetch } from "../hooks/useFetch.js";
import { signup, login, getUserDetails } from "../utils/http.js";

const LoginOrSignUp = () => {
  const navigate = useNavigate();
  const id = useId();
  const toastId = useRef(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const {
    loading: loginLoading,
    error: loginError,
    data: loginData,
    refetch: loginRefetch,
  } = useFetch(["login"], () => login(email, password), {
    refetchOnWindowFocus: false,
    retry: false,
    enabled: false,
  });

  const {
    loading: signupLoading,
    error: signupError,
    data: signupData,
    refetch: signupRefetch,
  } = useFetch(["signup"], () => signup(email, password), {
    refetchOnWindowFocus: false,
    retry: false,
    enabled: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignUp) {
      signupRefetch();
    } else {
      loginRefetch();
    }
  };

  useEffect(() => {
    if (loginError || signupError) {
      if (
        loginError?.code === "ERR_BAD_REQUEST" ||
        signupError?.code === "ERR_BAD_REQUEST"
      ) {
        if (!toast.isActive(toastId.current)) {
          toastId.current = toast.error(
            loginError?.response?.data?.error?.message ||
              signupError?.response?.data?.error?.message,
          );
        }
      } else {
        toast.error(loginError.message || signupError.message, {
          toastId: id,
        });
      }
    }

    if (loginData?.status === 200) {
      if (!toast.isActive(toastId.current)) {
        toastId.current = toast.success("Logged in successfully");
      }
      navigate("/home", { replace: true });
    }

    if (signupData?.status === 200) {
      if (!toast.isActive(toastId.current)) {
        toastId.current = toast.success(
          "User created successfully, please log in",
        );
      }
      setIsSignUp(false);
      setEmail("");
      setPassword("");
    }
  }, [id, loginData, loginError, navigate, signupData?.status, signupError]);

  const { data } = useFetch(["getUserDetails"], () => getUserDetails(), {
    retry: false,
  });

  if (data?.status === 200) {
    return <Navigate to="/home" replace />;
  }

  return (
    <div className="font-custom min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl shadow-lg mb-4 transform hover:scale-105 transition-transform">
            <span className="text-4xl">📋</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            My Task Board
          </h1>
          <p className="text-gray-600">Tasks to keep organised</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 backdrop-blur-sm bg-opacity-90">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </h2>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-yellow-400 focus:outline-none transition-colors"
                placeholder="your@email.com"
                required={true}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-yellow-400 focus:outline-none transition-colors"
                placeholder="••••••••"
                required={true}
              />
            </div>

            {!isSignUp && (
              <div className="flex text-sm">
                <button className="text-orange-500 hover:text-orange-600 font-medium text-center">
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              className="w-full text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all bg-yellow"
            >
              {isSignUp ? "Sign Up" : "Sign In"}
            </button>
          </form>

          <p className="text-center text-gray-600 mt-6">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}
            &nbsp;&nbsp;
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setEmail("");
                setPassword("");
              }}
              type="button"
              className="text-orange hover:text-orange font-semibold"
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          By continuing, you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default LoginOrSignUp;
