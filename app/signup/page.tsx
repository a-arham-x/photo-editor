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
        <label htmlFor="name" className="auth-label">Name</label>
        <input type="text" className="auth-input" id="name" name="name"/>
        <label htmlFor="password" className="auth-label">Password</label>
        <input type="password" className="auth-input" id="password" name="password"/>
        <label htmlFor="cpassword" className="auth-label">Confirm Password</label>
        <input type="password" className="auth-input" id="cpassword" name="cpassword"/>
        <button className="auth-button">Signup</button>
    </form>
    </>
  )
}

export default page