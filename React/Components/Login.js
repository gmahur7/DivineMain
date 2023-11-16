import React, { useEffect, useState } from 'react'
import { useNavigate,useHistory } from 'react-router-dom'
import { GoogleLogin, googleLogout, GoogleOAuthProvider } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

function Login() {
    const navigate = useNavigate()
    const [Email, setEmail] = useState('')
    const [Password, setPassword] = useState('')
    const [msg, setMsg] = useState(false)
    const [msg2, setMsg2] = useState(false)
    const [msg3, setMsg3] = useState(false)
    const [error, setError] = useState(false)
    const [emailError, setEmailError] = useState(false)
    const [googleData, setGoogleData] = useState('')

    
    const login = async () => {
        if (googleData) {
            let result = await fetch('http://localhost/login', {
                method: 'post',
                body: JSON.stringify({ Email: googleData.email, GoogleID: googleData.sub }),
                headers: { 'Content-Type': 'application/json' }
            })
            result = await result.json()
            console.log(result)
            if (result._id && result.verified) {
                navigate('/')
                localStorage.setItem('user', JSON.stringify({ Name: result.Name, Email: result.Email }))
            }
            else if (result.invalid) setMsg(true)
            else {
                setMsg3(true)
            }
        }
        else {
            if (!Email || !Password) {
                setError(true)
            }
            else {
                if (!Email.includes('@') || Email.slice(Email.length - 4, Email.length) !== '.com') {
                    setEmailError(true)
                }
                else {
                    let result = await fetch('http://localhost/login', {
                        method: 'post',
                        body: JSON.stringify({ Email, Password }),
                        headers: { 'Content-Type': 'application/json' }
                    })
                    result = await result.json()
                    if (result._id && result.verified) {
                        navigate('/')
                        localStorage.setItem('user', JSON.stringify({ Name: result.Name, Email: result.Email }))

                    }
                    else if (result.invalid) setMsg(true)
                    else {
                        setMsg2(true)
                    }
                }
            }
        }
    }
    const verify = async () => {
        let data = await fetch('http://localhost/find/', {
            method: 'post',
            body: JSON.stringify({ Email, GoogleID: googleData.sub }),
            headers: { 'Content-Type': 'application/json' }
        })
        data = await data.json()
        if (data.Email && data._id) {
            navigate(`/verifyotp/${data._id}`)
            let result = await fetch(`http://localhost/requestotp/`, {
                method: 'post',
                body: JSON.stringify({ Email: data.Email }),
                headers: { 'Content-Type': 'application/json' }
            })
            result = await result.json()
        }
        else if (data.GoogleID) {
            navigate(`/filldetail/${data.GoogleID}`)
        }
        else {

        }
    }
    useEffect(() => {
        setMsg(false)
        setGoogleData('')
    }, [Email, Password])
    useEffect(() => {
        setEmail('')
        setPassword('')
        setError(false)
    }, [googleData])
    return (
        <div>
            <div>
                <span>Enter Email : </span>
                <input type='text' value={Email} onChange={(e) => setEmail(e.target.value)} />
                <div>{error && !Email && <p>Please Provide Email</p>}</div>
                <div>{emailError && <p>Please Enter Valid Email</p>}</div>
            </div>
            <div>
                <span>Enter Password : </span>
                <input type='text' onChange={(e) => setPassword(e.target.value)} />
                <div>{error && !Password && <p>Please Provide Password</p>}</div>
            </div>
            <div>
                <GoogleOAuthProvider clientId="162073122496-8o0muu0hnk994ts5g0g38tfg2jkiu7la.apps.googleusercontent.com">
                    <GoogleLogin
                        onSuccess={credentialResponse => {
                            const decoded = jwtDecode(credentialResponse.credential);
                            setGoogleData(decoded)
                        }}
                        onError={() => {
                            console.log('Login Failed');
                        }}
                    />
                </GoogleOAuthProvider>
            </div>
            <button onClick={login}>Login</button>
            <button onClick={() => navigate('/forget')}>Forget Password</button>
            {msg && <div>Invalid Email Or Password</div>}
            {msg2 && <div>You Are Not Access To HomePage, Because Your Email is not verified.Click Verify To Verify Email<button onClick={verify}>Verify</button></div>}
            {msg3 && <div>Your Details Are Incompleted, First Fill your Details<button onClick={verify}>Click Here</button></div>}
            <div>
                <button onClick={()=>navigate('/')}>{'<-'}</button>
            </div>
        </div>
    )
}

export default Login;