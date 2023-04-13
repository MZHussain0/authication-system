import React from "react";
import { Link } from "react-router-dom";
import avatar from "../assets/profile.png";
import styles from "../styles/Username.module.css";

const Username = () => {
  return (
    <div className="container mx-auto">
      <div className="flex justify-center items-center h-screen">
        <div className={styles.glass}>
          <div className="title flex flex-col items-center">
            <h4 className="text-5xl font-bold">Hello Again!</h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-400">
              Lorem ipsum dolor sit amet.
            </span>
          </div>

          <form action="" className="py-1">
            <div className="profile flex justify-center py-4">
              <img src={avatar} alt="avatar" className={styles.profile_img} />
            </div>

            <div className="textbox flex flex-col items-center gap-4">
              <input
                className={styles.textbox}
                type="text"
                name=""
                id=""
                placeholder="username"
              />
              <button type="submit" className={styles.btn}>
                Let's go
              </button>
            </div>

            <div className="text-center py-4">
              <span className="text-gray-500">
                Not a member?{" "}
                <Link to="/register" className="text-red-500">
                  Register Now!
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Username;
