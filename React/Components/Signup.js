import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

function Signup() {
    const navigate = useNavigate()
    const [Name, setName] = useState('')
    const [Email, setEmail] = useState('')
    const [Password, setPassword] = useState('')
    const [PhoneNo, setPhoneNo] = useState('')
    const [Course, setCourse] = useState('')
    const [Password2, setPassword2] = useState('')
    const [googleData, setGoogleData] = useState('')
    const [passwordMsg, setPasswordMsg] = useState(false)
    const [error, setError] = useState('')
    const [emailError, setEmailError] = useState(false)
    const [phoneError, setPhoneError] = useState(false)
    const [msg, setMsg] = useState(false)
    const [msg2, setMsg2] = useState(false)
    const [match, setMatch] = useState(false)
    const [match2, setMatch2] = useState(false)
    const user = localStorage.getItem('user')
    if (user) navigate('/')
    const submit = async () => {
        if (googleData) {
            let result = await fetch('http://localhost/signup', {
                method: 'post',
                body: JSON.stringify({ Name: googleData.name, Email: googleData.email, GoogleID: googleData.sub }),
                headers: { 'Content-Type': 'application/json' }
            })
            result = await result.json()
            if (result._id) {
                setMsg(true)
                setTimeout(() => {
                    navigate(`/filldetail/${result._id}`)
                    setMsg(false)
                    reset()
                    setGoogleData('')
                }, 3000)
            }
            else if (result.match) {
                setMatch2(true)
            }
            else {
                setMsg2(true)
                setTimeout(() => {
                    setMsg(false)
                }, 10000)
            }
        }
        else {
            if (Password === Password2) {
                if (!Name || !Email || !Password || !Password2 || !Course || !PhoneNo) {
                    setError(true)
                }
                else {
                    if (!Email.includes('@') || Email.slice(Email.length - 4, Email.length) !== '.com') {
                        setEmailError(true)
                    } else {
                        if (PhoneNo.length != 10) {
                            setPhoneError(true)
                        }
                        else {
                            let result = await fetch('http://localhost/signup', {
                                method: 'post',
                                body: JSON.stringify({ Name, Email, PhoneNo, Course, Password }),
                                headers: { 'Content-Type': 'application/json' }
                            })
                            result = await result.json()
                            if (result._id) {
                                navigate(`/verifyotp/${result._id}`)
                                setMsg(true)
                                setTimeout(() => {
                                    reset()
                                }, 3000)
                            }
                            else if (result.match) {
                                setMatch(true)
                            }
                            else {
                                setMsg2(true)
                                setTimeout(() => {
                                    setMsg(false)
                                }, 10000)
                            }
                        }
                    }
                }
            }
            else {
                setPasswordMsg(true)
                setPassword('')
                setPassword2('')
                setTimeout(() => {
                    setPasswordMsg(false)
                }, 3000)
            }
        }
    }

    function phoneHandler(e) {
        setPhoneNo(e.target.value)
        if (phoneError === true) setPhoneError(false)
    }

    function reset() {
        setName('')
        setEmail('')
        setPhoneNo('')
        setCourse('')
        setPassword('')
        setPassword2('')
        setMsg(false)
        setMatch(false)
        setMatch2(false)
        setEmailError(false)
        setMsg2(false)
        setPhoneError(false)
        setError(false)
        setPasswordMsg(false)
        // document.getElementById('course').value = 'Courses'
    }
    useEffect(() => {
        setEmailError(false)
        setMatch(false)
    }, [Email])

    useEffect(() => {
        reset()
    }, [googleData])

    useEffect(() => {
        const user = localStorage.getItem('user')
        if (user) navigate('/')
    })
    return (
        <div id='divine'>
            <h1>Enter Details To signUp : </h1>
            <div>
                <span>Enter Name : </span>
                <input type='text' value={Name} onChange={(e) => setName(e.target.value)} />
                <div>{error && !Name && <p>Please Provide Name</p>}</div>
            </div>
            <div>
                <span>Enter Email : </span>
                <input type='text' value={Email} onChange={(e) => setEmail(e.target.value)} />
                <div>{error && !Email && <p>Please Provide Email</p>}</div>
                <div>{emailError && <p>Please Enter Valid Email</p>}</div>
                <div>{match && <p>Email Already Exist Please Enter Another Email</p>}</div>
            </div>
            <div>
                <span>Enter PhoneNo : </span>
                <input type='number' value={PhoneNo} onChange={phoneHandler} />
                <div>{error && !PhoneNo && <p>Please Provide PhoneNo</p>}</div>
                <div>{phoneError && <p>Enter 10 Digit Contact No.</p>}</div>
            </div>
            <div>
                <span>Enter Course : </span>
                <select id='course' onChange={(e) => setCourse(e.target.value)}>
                    <option value={'Course'} defaultChecked>Courses</option>
                    <option value={'FullStack Web Developement'}>FullStack Web Developement</option>
                    <option value={'Backend Web Developement'}>Backend Web Developement</option>
                    <option value={'Frontend Web Developement'}>Frontend Web Developement</option>
                </select>
                <div>{error && !Course && <p>Please Provide Course</p>}</div>
            </div>
            <div>
                <span>Enter Password : </span>
                <input type='password' value={Password} onChange={(e) => setPassword(e.target.value)} />
                <div>{error && !Password && <p>Please Provide Password</p>}</div>
            </div>
            <div>
                <span>Confirm Password : </span>
                <input type='password' value={Password2} onChange={(e) => setPassword2(e.target.value)} />
                <div>{error && !Password2 && <p>Please Provide Confiramtion Password</p>}</div>
                {passwordMsg && <p>Incorrect Confirmation Password</p>}
            </div>
            <div onClick={reset}>
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
                <div>{match2 && <p>Email Already Exist Please Enter Another Email</p>}</div>
            </div>
            <div>
                <button onClick={submit}>Submit</button>
                <button onClick={reset}>Reset</button>
            </div>
            <div>{msg && <h3>You Are Successfully SignUP</h3>}</div>
            <div>{msg2 && <h3>Something went Wrong, Try After Some Time</h3>}</div>
            <div>
                <button onClick={() => navigate('/')}>{'<-'}</button>
            </div>
        </div>
    )
}

export default Signup;