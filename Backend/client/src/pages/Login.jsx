import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { InputForm } from "../components/shared/InputForm";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { hideLoading, showLoading } from "../Redux/Features/alertSlice";
import { Spinner } from "../components/shared/Spinner";
import { toast } from "react-toastify";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.alerts);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(showLoading());
      const { data } = await axios.post("http://localhost:5000/api/v1/auth/login", {
        email,
        password,
      });

      dispatch(hideLoading());

      if (data.success) {
        localStorage.setItem("token", data.token);
        toast.success("Login Successfully!");
        navigate("/dashboard");
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      dispatch(hideLoading());
      if (error.response) {
        toast.error(error.response.data.message || "Invalid credentials!");
        console.error("Server Error:", error.response.data);
      } else if (error.request) {
        toast.error("No response from server.");
        console.error("No Response:", error.request);
      } else {
        toast.error("Login failed. Please try again.");
        console.error("Error:", error.message);
      }
    }
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <div className="form-container">
          <form className="card p-2" onSubmit={handleSubmit}>
            <img src="/logo192.png" alt="logo" height={150} width={400} />
            <InputForm
              htmlFor="email"
              labelText={"Email"}
              type={"email"}
              value={email}
              handleChange={(e) => setEmail(e.target.value)}
              name="email"
            />
            <InputForm
              htmlFor="password"
              labelText={"Password"}
              type={"password"}
              value={password}
              handleChange={(e) => setPassword(e.target.value)}
              name="password"
            />

            <div className="d-flex justify-content-between">
              <p>
                Not a user <Link to="/register">Register Here!</Link>
              </p>
              <button type="submit" className="btn btn-primary">
                Login
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};
