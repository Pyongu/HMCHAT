import React from "react";
import { useState } from "react";
import { googleLogout } from "@react-oauth/google"
import { jwtDecode} from "jwt-decode"
import { useNavigate } from "react-router-dom"
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
                  <button onClick={handleLogout}></button>
                </div>
            </div>
    )
}

export default Logout;