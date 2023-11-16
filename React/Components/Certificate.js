import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function ApplyCertificate() {
    const navigate = useNavigate()
    const date=new Date()
    const [Name, setName] = useState('')
    const [Email, setEmail] = useState('')
    const [PhoneNo, setPhoneNo] = useState('')
    const [Course, setCourse] = useState('')
    const [error, setError] = useState('')
    const [emailError, setEmailError] = useState(false)
    const [phoneError, setPhoneError] = useState(false)
    const [msg, setMsg] = useState(false)
    const [msg2, setMsg2] = useState(false)
    const [match, setMatch] = useState(false)
    const [match2, setMatch2] = useState(false)

    const submit=async()=>
    {
        console.log('helloo')
        if (!Name || !Email || !Course || !PhoneNo) {
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
                   
                    }
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
        setMsg(false)
        setMatch(false)
        setMatch2(false)
        setEmailError(false)
        setMsg2(false)
        setPhoneError(false)
        setError(false)
        // document.getElementById('course').value = 'Courses'
    }
    return (
        <div>
            <h1>Enter Details To Get Certificate</h1>
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
                <button onClick={submit}>Submit</button>
                <button onClick={reset}>Reset</button>
            </div>
        </div>
    )
}

export default ApplyCertificate;
