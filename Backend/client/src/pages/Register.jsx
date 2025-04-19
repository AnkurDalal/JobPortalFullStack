import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { InputForm } from "../components/shared/InputForm";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../Redux/Features/alertSlice";
import axios from "axios";
import { Spinner } from "../components/shared/Spinner";
import { toast } from "react-toastify";

export const Register = () => {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { loading } = useSelector((state) => state.alerts);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!name || !lastName || !email || !password) {
        alert("Please fill all fields");
        return;
      }
      dispatch(showLoading());

      // ✅ Modified URL to use correct backend port (5000)
      const { data } = await axios.post(
        "http://localhost:5000/api/v1/auth/register",
        {
          name,
          lastName,
          email,
          password,
        }
      );

      dispatch(hideLoading());
      if (data.success) {
        toast.success(data.message);
        navigate("/login");
      } else {
        toast.error(data.message || "Registration failed");
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("Registration failed. Please try again.");
      console.error("Registration error:", error);

      if (error.response) {
        console.log("Response data:", error.response.data);
      } else if (error.request) {
        console.log("No response received:", error.request);
      } else {
        console.log("Error message:", error.message);
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
            <img
              src="/logo192.png"
              alt="logo"
              height={150}
              width={400}
            />
            <InputForm
              htmlFor="name"
              labelText={"Name"}
              type={"text"}
              value={name}
              handleChange={(e) => setName(e.target.value)}
              name="name"
            />
            <InputForm
              htmlFor="lastName"
              labelText={"Last Name"}
              type={"text"}
              value={lastName}
              handleChange={(e) => setLastName(e.target.value)}
              name="lastName"
            />
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
                Already Registered? <Link to="/login">Login</Link>
              </p>
              <button type="submit" className="btn btn-primary">
                Register
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};
