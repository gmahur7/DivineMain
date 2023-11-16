import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function AddCourse() {
    const navigate = useNavigate()
    const params = useParams()
    const { Email } = params
    const [Course, setCourse] = useState('')
    const [error, setError] = useState(false)
    const [msg, setMsg] = useState(false)
    const [msg2, setMsg2] = useState(false)
    const [msg3, setMsg3] = useState(false)
    const [msg4, setMsg4] = useState(false)

    const update = async () => {
        if (!Course) {
            setError(true)
        }
        else {

            let result = await fetch(`http://localhost/getcourse/${Email}`, {
                method: 'put',
                body: JSON.stringify({ Course }),
                headers: { 'Content-Type': 'application/json' }
            })
            result = await result.json()
            if (result.msg === 'Course Added') 
            {
                setMsg(true)
                setMsg2(false)
                setMsg3(false)
                setMsg4(false)
                setTimeout(() => {
                    navigate('/')
                    reset()
                }, 3000)
            } else if (result.msg === 'User already enrolled in maximum courses') {
                setMsg(false)
                setMsg2(false)
                setMsg3(true)
                setMsg4(false)
                setTimeout(() => {
                    reset()
                    navigate('/')
                }, 3000)
            }
            else if(result.msg==='Already Enrolled')
            {
                setMsg(false)
                setMsg2(false)
                setMsg3(false)
                setMsg4(true)
                setCourse('')
            }
            else {
                setMsg(false)
                setMsg2(true)
                setMsg3(false)
                setMsg4(true)
                setTimeout(() => {
                    reset()
                    navigate(`/addcourse/${Email}`)
                }, 3000)
            }
        }

    }
    function reset() {
        setCourse('')
        setError(false)
        setMsg(false)
        setMsg2(false)
        setMsg3('')
        setMsg4(false)
    }

    return (
        <div>
            <h1>Add Other Course : </h1>
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
                <button onClick={update}>Update</button>
                <button onClick={reset}>Reset</button>
            </div>
            <div>
                {msg && <h3>Course Added Successfully, Wait For Admin Approval</h3>}
                {msg2 && <h3>Updated Failed, Try Again, Redirect in 3s </h3>}
                {msg3 && <h3>User already enrolled in maximum courses</h3>}
                {msg4 && <h3>You Already Purcahsed This Course, Please Choose Another Course</h3>}
            </div>
        </div>
    )
}

export default AddCourse;