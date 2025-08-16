import React, { useState, useContext } from "react";
import assets from "../assets/assets";
import { AuthContext } from "../../context/AuthContext";

const Login = () => {
  const [currState, setCurrState] = useState("Sign up");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  const { login } = useContext(AuthContext);

  const onSubmitHandler = (e) => {
    e.preventDefault();
    if (currState === "Sign up" && !isDataSubmitted) {
      setIsDataSubmitted(true);
      return;
    }
    login(
      currState === "Sign up" ? "signup" : "login",
      { fullName, email, password, bio }
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 px-4">
      {/* Heading outside the form container */}
      {currState === "Login" && (
        <h1 className="text-3xl font-bold text-indigo-400 mb-8 text-center">
          Welcome back
        </h1>
      )}

      {currState === "Sign up" && (
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-purple-400">
            Welcome to the Chit-Chat
          </h1>
          <p className="text-gray-400 mt-2">
            A place where you can connect with your friends and family
          </p>
        </div>
      )}

      {/* Form container */}
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-700">
        <h2 className="text-2xl font-semibold text-white mb-6 text-center">
          {currState}
          {isDataSubmitted && (
            <img
              onClick={() => setIsDataSubmitted(false)}
              src={assets.arrow_icon}
              alt=""
              className="w-5 cursor-pointer inline ml-2"
            />
          )}
        </h2>

        <form onSubmit={onSubmitHandler}>
          <table className="w-full text-white">
            <tbody>
              {currState === "Sign up" && !isDataSubmitted && (
                <tr className="border-b border-gray-600">
                  <td className="py-3 pr-4 text-right">Name:</td>
                  <td>
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none"
                      required
                    />
                  </td>
                </tr>
              )}
              {!isDataSubmitted && (
                <tr className="border-b border-gray-600">
                  <td className="py-3 pr-4 text-right">Email:</td>
                  <td>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none"
                      required
                    />
                  </td>
                </tr>
              )}
              {!isDataSubmitted && (
                <tr className="border-b border-gray-600">
                  <td className="py-3 pr-4 text-right">Password:</td>
                  <td>
                    <input
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none"
                      required
                    />
                  </td>
                </tr>
              )}

              {currState === "Sign up" && isDataSubmitted && (
                <tr className="border-b border-gray-600">
                  <td className="py-3 pr-4 text-right">Bio:</td>
                  <td>
                    <textarea
                      placeholder="Provide your bio..."
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none"
                      required
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="mt-6 text-center">
            <button
              type="submit"
              className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-2 rounded-md hover:opacity-90 transition duration-300"
            >
              {currState === "Sign up" ? "Create Account" : "Login Now"}
            </button>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-400 mt-5">
            <input type="checkbox" className="cursor-pointer" />
            <p>Agree to the terms of use & privacy policy.</p>
          </div>

          <div className="mt-4 text-sm text-center text-gray-400">
            {currState === "Sign up" ? (
              <p>
                Already have an account?{" "}
                <span
                  onClick={() => {
                    setCurrState("Login");
                    setIsDataSubmitted(false);
                  }}
                  className="text-violet-400 font-medium cursor-pointer"
                >
                  Login here
                </span>
              </p>
            ) : (
              <p>
                New user?{" "}
                <span
                  onClick={() => {
                    setCurrState("Sign up");
                    setIsDataSubmitted(false);
                  }}
                  className="text-violet-400 font-medium cursor-pointer"
                >
                  Create an account
                </span>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
