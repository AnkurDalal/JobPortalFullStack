import "../styles/HomePage.css";
import { Link } from "react-router-dom";

export const HomePage = () => {
  return (
    <>
      <video autoPlay muted loop id="background-video">
        <source src="/bg.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="home-content">
        <div className="home-card">
          <img src="/logo192.png" alt="App Logo" className="logo" />

          <div className="card-body">
            <h5 className="card-title">India's Number #1 Job Portal App</h5>
            <p className="card-text">
              Search and manage your jobs with ease. A free and open-source job
              portal application.
            </p>

            <div className="card-footer">
              <p>
                Not a user? Register <Link to="/register">here</Link>!
              </p>
              <Link to="/login" className="login-button">
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
