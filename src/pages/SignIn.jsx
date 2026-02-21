import React from "react";
import logo from "../assets/images/logo.jpg";
import bgImage from "../assets/images/signIn.jpg";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useLoginAdminMutation } from "../redux/apis/authApi";

// ✅ Validation Schema using Yup
const SignInSchema = Yup.object().shape({
    username: Yup.string()
        .min(3, "Username must be at least 3 characters")
        .required("Username is required"),
    password: Yup.string()
        .min(4, "Password must be at least 4 characters")
        .required("Password is required"),
});

const SignIn = () => {
    const navigate = useNavigate();
    const [Adminlogin, { isSuccess, isError, error, isLoading }] = useLoginAdminMutation();

    return (
        <div className="h-screen flex items-center justify-center bg-gray-100 overflow-hidden">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Header Section */}
                <div
                    className="flex flex-col items-center bg-cover bg-center"
                    style={{ backgroundImage: `url(${bgImage})` }}
                >
                    <img className="w-24" src={logo} alt="Logo" />
                    <h1 className="text-3xl font-bold text-white mt-2">S O N A L</h1>
                    <p className="text-white text-md">Cosmetics</p>
                </div>

                {/* Form Section */}
                <div className="p-6">
                    <h2 className="text-center text-pink-500 text-xl font-semibold mb-6">
                        Sign In Now
                    </h2>
                    
                    {/* ✅ Formik Integration */}
                    <Formik
                        initialValues={{
                            username: "",
                            password: "",
                        }}
                        validationSchema={SignInSchema}
                        onSubmit={async (values, { setSubmitting }) => {
                            try {
                                const response = await Adminlogin(values).unwrap();
                                // console.log("✅ Login Success:", response);
                                navigate("/app");
                            } catch (err) {
                                console.error("❌ Login Failed:", err);
                                alert("Invalid username or password!");
                            } finally {
                                setSubmitting(false);
                            }
                        }}
                    >
                        {({ isSubmitting }) => (
                            <Form>
                                {/* Enter Username */}
                                <div className="mb-5">
                                    <label className="block text-gray-700 text-sm mb-2">
                                        Enter Username
                                    </label>
                                    <Field
                                        type="text"
                                        name="username"
                                        placeholder="Enter your username"
                                        className="w-full px-3 py-2 border border-pink-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
                                    />
                                    <ErrorMessage
                                        name="username"
                                        component="p"
                                        className="text-pink-500 text-sm mt-1"
                                    />
                                </div>

                                {/* Enter Password */}
                                <div className="mb-10">
                                    <label className="block text-gray-700 text-sm mb-2">
                                        Enter Password
                                    </label>
                                    <Field
                                        type="password"
                                        name="password"
                                        placeholder="Enter your password"
                                        className="w-full px-3 py-2 border border-pink-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
                                    />
                                    <ErrorMessage
                                        name="password"
                                        component="p"
                                        className="text-pink-500 text-sm mt-1"
                                    />
                                </div>

                                {/* Sign In Button */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting || isLoading}
                                    className="w-full bg-pink-500 text-white py-2 rounded-md hover:bg-pink-600 transition-colors mb-4 disabled:opacity-70"
                                >
                                    {isLoading || isSubmitting ? "Signing In..." : "Sign In"}
                                </button>
                            </Form>
                        )}
                    </Formik>

                    {/* Show API Error Message */}
                    {isError && (
                        <p className="text-center text-red-500 text-sm mt-2">
                            {error?.data?.message || "Login failed. Please try again."}
                        </p>
                    )}

                    {/* Sign Up Link */}
                    {/* <p className="text-center text-gray-700 text-sm mt-4">
                        Don’t Have Account?{" "}
                        <span className="text-pink-500 font-semibold cursor-pointer hover:underline">
                            Sign Up
                        </span>
                    </p> */}
                </div>
            </div>
        </div>
    );
};

export default SignIn;
