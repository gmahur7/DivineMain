import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function VerifyOtp() {
    const navigate = useNavigate()
    const [OTP, setOTP] = useState('')
    const [msg, setMsg] = useState('')
    const [msg2, setMsg2] = useState('')
    const params = useParams()
    const { id } = params
    
    const verify = async () => {
        if (OTP) {
            let result = await fetch(`http://localhost/verifyotp/${id}`, {
                method: 'put',
                body: JSON.stringify({ _id: id, OTP }),
                headers: { 'Content-Type': 'application/json' }
            })
            result = await result.json()
            console.log(result)
            if (result.msg === 'Verified') {
                setMsg(true)
                setTimeout(() => {
                    navigate('/login')
                }, 3000)
            }
            else {
                setMsg2(true)
                setTimeout(() => {
                    setMsg2(false)
                }, 2000)
            }
        }
    }

    const fetchData=async()=>
    {
        let data = await fetch(`http://localhost/verified/${id}`)
        data = await data.json()
        if (data.msg === 'Verified'||data.msg === 'Error occurred'||data.msg === 'No User Found'){
             navigate('/')
        }
        else{
            null
        }
    }
    useEffect(()=>
    {
       fetchData()
    },[])

    return (
        <div>
            <h2>Please Verify Email : </h2>
            <div>
                <span>Enter OTP : </span>
                <input type='number' value={OTP} onChange={(e) => setOTP(e.target.value)} />
            </div>
            <button onClick={verify}>Submit</button>
            <div>{msg && <h3>OTP Verification Successfully</h3>}</div>
            <div>{msg2 && <h3>OTP Verification Failed</h3>}</div>
        </div>
    )
}

export default VerifyOtp;
