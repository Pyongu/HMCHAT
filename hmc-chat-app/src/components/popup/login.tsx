import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import "./login.css";
interface GoogleJwtPayload {
    email: string;
    name: string;
    picture: string;
    hd?: string; // hosted domain (e.g., 'yourcompany.com')
    // You can add more fields if needed
}

export function Login() {
    const navigate = useNavigate();
    const allowedDomains = ["g.hmc.edu", "hmc.edu"];

    const handleLoginSuccess = (credentialResponse: any) => {
        if (credentialResponse.credential) {
            const user = jwtDecode<GoogleJwtPayload>(credentialResponse.credential);
            console.log("Decoded user:", user);

            if (user.hd && allowedDomains.includes(user.hd)) {
                localStorage.setItem("user", JSON.stringify(user));
                navigate("/home.jsx");
            } else {
                alert(
                    `Access denied. You must log in with a valid email (${allowedDomains.join(", ")})`
                );
            }
        }
    };

    return (


        <div className="login-wrapper">
            <div className="login-card">
                <img src="/Harvey_Mudd_College_logo.svg" alt="App Logo"  className="mx-auto mb-5 w-24" style={{ width: 100, marginBottom: 20 }} />
                <h2>Welcome</h2>
                <p>Please sign in with an HMC Email</p>
                    <GoogleLogin
                    onSuccess={handleLoginSuccess}
                    onError={() => console.log("Login Failed")}
                    auto_select = {true}
                />
            </div>
        </div>
    );
}