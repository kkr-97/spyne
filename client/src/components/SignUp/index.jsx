import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookie from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { onSuccessfulLogin } from "../../store/userSlice";
import Spinner from "../Spinner";
import "./index.css";

const status = {
  initial: "INITIAL",
  loading: "FETCHING DETAILS...",
  success: "SUCCESS",
  failed: "FAILED",
};

function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [signInStatus, setSignInStatus] = useState(status.initial);
  const [passwordState, setPasswordState] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setSignInStatus(status.loading);
    try {
      const response = await axios.post(
        "https://spyne-1kdl.onrender.com/register",
        {
          email,
          username,
          password,
        }
      );
      Cookie.set("token", response.data.token, { expires: 1 });
      Cookie.set("username", response.data.username, { expires: 1 });
      Cookie.set("userId", response.data.id, { expires: 1 });
      dispatch(
        onSuccessfulLogin({
          username: response.data.username,
          userId: response.data.id,
        })
      );
      navigate("/", { replace: true });
    } catch (err) {
      console.log("Error: ", err);
      setSignInStatus(status.failed);
      setMsg(err.response.data.message);
    }
  };

  return (
    <div className="auth-container">
      <form className="form-container card" onSubmit={handleSignUp}>
        <h2>SignUp</h2>
        <p>Create your account to get started.</p>

        <div className="input-group mb-3">
          <input
            type="email"
            placeholder="Enter Email..."
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input-group mb-3">
          <input
            type="text"
            placeholder="Enter Username..."
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="input-group mb-3">
          <input
            type={passwordState ? "text" : "password"}
            placeholder="Enter Password..."
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {msg && (
          <p
            className={`m-0 ${
              signInStatus === status.success ? "text-success" : "text-danger"
            }`}
          >
            *{msg}
          </p>
        )}

        <button className="btn btn-warning mt-2" type="submit">
          {signInStatus === status.loading ? (
            <Spinner color="#000" />
          ) : (
            "Continue"
          )}
        </button>

        <p className="small text-secondary mt-3">
          Already have an account?{" "}
          <span
            className="text-warning"
            role="button"
            onClick={() => navigate("/login")}
          >
            Log in
          </span>
        </p>
      </form>
    </div>
  );
}

export default SignUp;
