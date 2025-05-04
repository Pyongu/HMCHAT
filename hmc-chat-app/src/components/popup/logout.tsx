import React from "react";
import { useState } from "react";
import { googleLogout } from "@react-oauth/google"
import { jwtDecode} from "jwt-decode"
import { useNavigate } from "react-router-dom"
const CLIENT_ID = "484184324484-dnn5iloaabckg35bhb9igc32p8o0b7bg.apps.googleusercontent.com"
export function Logout() {
    const navigate = useNavigate();
    const handleLogout = () => {
        googleLogout(); // Invalidate token
        console.log("Logged out");
        navigate("/"); // Redirect to a new page
      };
    
          return (
            <div>
                <div>
                  <p>Welcome! You're logged in.</p>
                  <button onClick={handleLogout}>Log Out</button>
                </div>
            </div>
    )
}

export default Logout;