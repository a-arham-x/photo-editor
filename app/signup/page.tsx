"use client"
import React, {useEffect, useState} from 'react'
import Navbar from '../components/Navbar'
import { useRouter } from 'next/navigation'
import CodeModal from "../components/CodeModal"

function Signup() {

  const router = useRouter();

  const [credentials, setCredentials] = useState({email: "", name: "",  password: "", cpassword: ""})
  const [showCodeModal, setShowCodeModal] = useState(false)
  const [showProcessing, setShowProcessing] = useState(false);

  const handleChange = (e: any)=>{
    setCredentials({...credentials, [e.target.name]: e.target.value})
  }
  useEffect(()=>{
    if (localStorage.getItem("user")){
      router.push("/editor")
    }
  }, [])

  const getMail = async (e: any)=>{
    e.preventDefault();
    setShowProcessing(true)
    const response = await fetch("/api/signup", {
      method: "PUT", 
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(credentials)
    })
    const json = await response.json();
    setShowProcessing(false)
    if (json.success){
      console.log(json)
      setShowCodeModal(true)
    } else{
      window.alert(json.message)
    }
  }
  return (
    <>
    <Navbar />
    {showProcessing && <p style={{color: "white"}}>Processing...</p>}
    <form className="auth-form" onSubmit={getMail}>
        <label htmlFor="email" className="auth-label">Email</label>
        <input type="email" className="auth-input" id="email" name="email" value={credentials.email} onChange={handleChange} required/>
        <label htmlFor="name" className="auth-label">Name</label>
        <input type="text" className="auth-input" id="name" name="name" value={credentials.name} onChange={handleChange} required/>
        <label htmlFor="password" className="auth-label">Password</label>
        <input type="password" className="auth-input" id="password" name="password" value={credentials.password} onChange={handleChange} required/>
        <label htmlFor="cpassword" className="auth-label">Confirm Password</label>
        <input type="password" className="auth-input" id="cpassword" name="cpassword" value={credentials.cpassword} onChange={handleChange} required/>
        <button className="auth-button">Signup</button>
    </form>
    {showCodeModal && <CodeModal showModal={setShowCodeModal} credentials={credentials} />}
    </>
  )
}

export default Signup