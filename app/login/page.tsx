"use client"
import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { useRouter } from 'next/navigation'

function Login() {

  const router = useRouter(); 

  useEffect(()=>{
    if (localStorage.getItem("user")){
      router.push("/editor")
    }
  }, [])

  const [credentials, setCredentials] = useState({email: "", password: ""})
  const [showProcessing, setShowProcessing] = useState(false);

  const handleChange = (e: any)=>{
    setCredentials({...credentials, [e.target.name]: e.target.value})
  }

  const login = async (e: any)=>{
    e.preventDefault();
    setShowProcessing(true)
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(credentials)
    })
    const json = await response.json();
    setShowProcessing(false);
    if (json.success){
      localStorage.setItem("user", json.token)
      router.push("/editor")
    }else{
      window.alert(json.message)
    }
  }
    
  return (
    <>
    <Navbar />
    {showProcessing && <p style={{color: "white"}}>Processing...</p>}
    <form className="auth-form" onSubmit={login}>
        <label htmlFor="email" className="auth-label">Email</label>
        <input type="email" className="auth-input" id="email" name="email" value={credentials.email} onChange={handleChange} required/>
        <label htmlFor="password" className="auth-label">Password</label>
        <input type="password" className="auth-input" id="password" name="password" value={credentials.password} onChange={handleChange} required/>
        <button className="auth-button">Login</button>
    </form>
    </>
  )
}

export default Login