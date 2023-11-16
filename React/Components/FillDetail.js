import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';

function FillDetail() {
    const navigate=useNavigate()
    const params = useParams()
    const { _id } = params
    const [PhoneNo, setPhoneNo] = useState('')
    const [Course, setCourse] = useState('')
    const [error, setError] = useState(false)
    const [phoneError, setPhoneError] = useState(false)
    const [msg, setMsg] = useState(false)
    const [msg2, setMsg2] = useState(false)

    function phoneHandler(e) {
        setPhoneNo(e.target.value)
        if (phoneError === true) setPhoneError(false)
    }

    const update = async () => {
        if (!Course || !PhoneNo) {
            setError(true)
        }
        else {
            if (PhoneNo.length != 10) {
                setPhoneError(true)
            }
            else {
                let result = await fetch(`http://localhost/filldetail/${_id}`, {
                    method: 'put',
                    body: JSON.stringify({ Course, PhoneNo, verified: true }),
                    headers: { 'Content-Type': 'application/json' }
                })
                result = await result.json()
                if (result.msg = 'success') {
                    setMsg(true)
                    setTimeout(() => {
                        navigate('/login')
                        reset()
                    }, 3000)
                }
                else{
                    setMsg2(true)
                    setTimeout(()=>
                    {
                        reset()
                        navigate(`/filldetail/${_id}`)
                    },3000)
                }
            }
        }
    }

    useEffect(() => 
    {
        reset()
    }, [_id])

    function reset()
    {
        setPhoneNo('')
        setCourse('')
        setError(false)
        setPhoneError(false)
        setMsg(false)
        setMsg2(false)
    }

    const fetchData=async()=>
    {
        let data = await fetch(`http://localhost/verified/${_id}`)
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
            <h2>Enter Your Details To Proceed : </h2>
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
                <span>Enter Contact No : </span>
                <input type='number' value={PhoneNo} onChange={phoneHandler} />
                <div>{error && !PhoneNo && <p>Please Provide PhoneNo</p>}</div>
                <div>{phoneError && <p>Enter 10 Digit Contact No.</p>}</div>
            </div>
            <div>
                <button onClick={update}>Update</button>
                <button onClick={reset}>Reset</button>
            </div>
            <div>
                {msg && <h3>You Are Successfully SignUP</h3>}
                {msg2 && <h3>Updated Failed, Try Again, Redirect in 3s </h3>}
            </div>
        </div>
    )
}

export default FillDetail;