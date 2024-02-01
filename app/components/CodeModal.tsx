"use client"
import React, {useState} from 'react'
import { useRouter } from 'next/navigation';

function CodeModal(props:any) {
    const { showModal, credentials} = props;
    const [showProcessing, setShowProcessing] = useState(false);

    const router = useRouter();

    const [digits, setDigits] = useState({digit1: "", digit2: "", digit3: "", digit4: "", digit5: "", digit6: ""})

    const digitsChange = (e: any)=>{
        setDigits({...digits, [e.target.name]: e.target.value})
    }

    const signup = async (e: any)=>{
        e.preventDefault()
        setShowProcessing(true)
        const codeEntered = parseInt(digits.digit1 + digits.digit2 + digits.digit3 + digits.digit4 + digits.digit5 + digits.digit6);
        const response = await fetch("/api/signup", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({...credentials, code: codeEntered})
        })
        const json = await response.json();
        setShowProcessing(false);
        if (json.success){
            showModal(false)
            localStorage.setItem("user", json.token)
            router.push("/editor")
        }else{
            window.alert(json.message)
        }
    }
    const closeModal = ()=>{
        showModal(false)
    }
  return (
    <div className="modal-wrapper">
      <p className="modal-closer" onClick={closeModal}>X</p>
      {showProcessing && <p style={{color: 'white'}}>Processing...</p>}
      <form className="codeform" onSubmit={signup}>
                <label className="form-label" style={{marginBottom: "20px"}}>Enter Code</label>
                <div className="codeInputs">
                    <input className="numberInput" type="number" value={digits.digit1} min="0" max="9" name="digit1" onChange={digitsChange} />
                    <input className="numberInput" type="number" value={digits.digit2} min="0" max="9" name="digit2" onChange={digitsChange} />
                    <input className="numberInput" type="number" value={digits.digit3} min="0" max="9" name="digit3" onChange={digitsChange} />
                    <input className="numberInput" type="number" value={digits.digit4} min="0" max="9" name="digit4" onChange={digitsChange} />
                    <input className="numberInput" type="number" value={digits.digit5} min="0" max="9" name="digit5" onChange={digitsChange} />
                    <input className="numberInput" type="number" value={digits.digit6} min="0" max="9" name="digit6" onChange={digitsChange} />
                </div>
                <button className="auth-button" >Submit</button>
            </form>
    </div>
  )
}

export default CodeModal