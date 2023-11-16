import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Forget() {
    const navigate = useNavigate()
    const [Email, setEmail] = useState('')
    const [OTP, setOTP] = useState('')
    const [error, setError] = useState(false)
    const [emailError, setEmailError] = useState(false)
    const [div, setDiv] = useState(false)
    const [msg, setMsg] = useState(false)
    const [msg2, setMsg2] = useState(false)
    const [msg3, setMsg3] = useState(false)
    const [msg4, setMsg4] = useState(false)
    const [msg5, setMsg5] = useState(false)
    const [msg6, setMsg6] = useState(false)
    const [Password, setPassword] = useState('')
    const [Password2, setPassword2] = useState('')
    const requestOTP = async () => {
        if (!Email) {
            setError(true)
        }
        else {
            if (!Email.includes('@') || Email.slice(Email.length - 4, Email.length) !== '.com') {
                setEmailError(true)
            }
            else {
                let result = await fetch('http://localhost/requestotp', {
                    method: 'post',
                    body: JSON.stringify({ Email }),
                    headers: { 'Content-Type': 'application/json' }
                })
                result = await result.json()
                if (result.result === 'Email Sent') {
                    setDiv(true)
                }
                else if(result.result==='Email Not Found'){
                    setMsg6(true)
                }
                else{
                    
                }
            }
        }
    }
    const verify = async () => {
        if (OTP) {
            let result = await fetch('http://localhost/verifyotp/', {
                method: 'put',
                body: JSON.stringify({ Email, OTP }),
                headers: { 'Content-Type': 'application/json' }
            })
            result = await result.json()
            if (result.msg === 'Verified') {
                setMsg(true)
            }
            else {
                setMsg2(true)
                setTimeout(() => {
                    setMsg2(false)
                }, 3000)
            }
        }
    }

    const update = async () => {
        if (Password === Password2) {
            let data = await fetch('http://localhost/update', {
                method: 'put',
                body: JSON.stringify({ Email, Password }),
                headers: { 'Content-Type': 'application/json' }
            })
            data = await data.json()
            if (data.msg === 'Password Changed Successfully') {
                setMsg3(true)
                setMsg4(false)
                sendMail(Email)
                setTimeout(() => {
                    reset()
                    navigate('/login')
                }, 3000)
            }
            else {
                setMsg4(true)
                setMsg3(false)
            }
        }
        else {
            setMsg5(true)
        }
    }
    function reset() {
        setMsg(false)
        setMsg2(false)
        setMsg3(false)
        setMsg4(false)
        setMsg5(false)
        setDiv(false)
        setEmail('')
        setEmailError(false)
        setOTP('')
        setPassword('')
        setPassword2('')
    }
    async function sendMail(Email)
    {
        await fetch(`http://localhost/sendmail/passwordchanged/${Email}`,{
            method:'post',
            body:null,
            headers:{'Content-Type':'application/json'}
        })
    }
    return (
        <div>
            <div>First Verify Email</div>
            <div>
                <input type='text' value={Email} onChange={(e) => setEmail(e.target.value)} />
                <span> : Enter Email to Request Otp : </span>
                <div>{error && !Email && <p>Please Provide Email</p>}</div>
                <div>{emailError && <p>Please Enter Valid Email</p>}</div>
                <div>{msg6 && <p>Email Entered Is Not Registered.</p>}</div>
            </div>
            <button onClick={requestOTP}>Request OTP</button>
            {div && <div>
                <div>
                    <input type='number' value={OTP} onChange={(e) => setOTP(e.target.value)} />
                    <span> : Enter OTP </span>
                </div>
                <div>
                    <button onClick={verify}>Verify</button>
                </div>
                <div>
                    <div>{msg && <h3>OTP Verification Successfully</h3>}</div>
                    <div>{msg2 && <h3>OTP Verification Failed</h3>}</div>
                </div>
            </div>}
            {msg &&
                <div>
                    <h1>Create New Password</h1>
                    <div>
                        <span>Enter Password : </span>
                        <input type='password' onChange={(e) => setPassword(e.target.value)} value={Password} />
                    </div>
                    <div>
                        <span>Confirm Password : </span>
                        <input type='text' onChange={(e) => setPassword2(e.target.value)} value={Password2} />
                        {msg5 && <div>Password Not Matched</div>}
                    </div>
                    <button onClick={update}>Update</button>
                    {msg3 && <div>Password Changed Successfully</div>}
                    {msg4 && <div>Something went Wrong</div>}
                </div>
            }
        </div>
    )
}

export default Forget;