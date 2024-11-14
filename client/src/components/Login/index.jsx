import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookie from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { onSuccessfulLogin } from "../../store/userSlice.js";
import Spinner from "../Spinner";
import "./index.css";

const status = {
  initial: "INITIAL",
  loading: "FETCHING DETAILS...",
  success: "SUCCESS",
  failed: "FAILED",
};

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [signInStatus, setSignInStatus] = useState(status.initial);
  const [passwordState, setPasswordState] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const token = Cookie.get("token");

  useEffect(() => {
    if (token) {
      navigate("/", { replace: true });
    }
  }, [navigate, token]);

  const onSuccessfulSignIn = ({ username, token, userId, message }) => {
    Cookie.set("token", token, { expires: 1 });
    Cookie.set("username", username, { expires: 1 });
    Cookie.set("userId", userId, { expires: 1 });
    dispatch(onSuccessfulLogin({ username, userId }));
    setMsg(message);
    setSignInStatus(status.success);
    navigate("/");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setSignInStatus(status.loading);
    try {
      const response = await axios.post(
        "https://spyne-1kdl.onrender.com/login",
        {
          email,
          password,
        }
      );
      onSuccessfulSignIn({
        token: response.data.token,
        username: response.data.username,
        userId: response.data.id,
        message: response.data.message,
      });
    } catch (err) {
      console.log("Error: ", err);
      setSignInStatus(status.failed);
      setMsg(err.response.data.message);
    }
  };

  return (
    <div className="auth-container">
      <form className="form-container card" onSubmit={handleLogin}>
        <h2>Login</h2>
        <p>Please log in to continue.</p>

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
            type={passwordState ? "text" : "password"}
            placeholder="Enter Password..."
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <label className="text-secondary small">
          <input
            onChange={() => setPasswordState(!passwordState)}
            type="checkbox"
            checked={passwordState}
          />{" "}
          Show Password
        </label>

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
          {signInStatus === status.loading ? <Spinner color="#000" /> : "Login"}
        </button>

        <p className="small text-secondary mt-3">
          Don’t have an account?{" "}
          <span
            className="text-warning"
            role="button"
            onClick={() => navigate("/signup")}
          >
            Register now
          </span>
        </p>
      </form>
    </div>
  );
}

export default Login;
