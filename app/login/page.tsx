"use client"
import React from 'react'
import Navbar from '../components/Navbar'

function page() {
    
  return (
    <>
    <Navbar />
    <form className="auth-form">
        <label htmlFor="email" className="auth-label">Email</label>
        <input type="email" className="auth-input" id="email" name="email"/>
        <label htmlFor="password" className="auth-label">Password</label>
        <input type="password" className="auth-input" id="password" name="password"/>
        <button className="auth-button">Login</button>
    </form>
    </>
  )
}

export default page