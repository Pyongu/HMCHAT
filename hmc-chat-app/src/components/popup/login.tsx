import React from "react";
import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google"
import { jwtDecode} from "jwt-decode"
import { useNavigate } from "react-router-dom"

export function Login() {

    const navigate = useNavigate()

    return (
        <>
        
            <GoogleLogin 
            onSuccess={(credentialResponse) => {
                console.log(credentialResponse)
                console.log(jwtDecode(credentialResponse.credential))
                navigate("/home.jsx")
            }}
            
            
            onError={() => console.log("login failed")}
            auto_select={true}/>
        </>
    )
}