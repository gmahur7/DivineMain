import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

function Home()
{
    const navigate=useNavigate()
    const [name,setName]=useState('')
    const [courses,setCourses]=useState('')
    const user=JSON.parse(localStorage.getItem('user'))
    const fetchCourses=async ()=>
    {
        let data=await fetch('http://localhost/courses',{
            method:'post',
            body:JSON.stringify({Email:user.Email,Name:user.Name}),
            headers:{'Content-Type':'application/json'}
        })
        data=await data.json()
        setCourses(data.courses)
    }
    const logout=()=>
    {
        localStorage.removeItem('user')
        navigate('/login')
    }
    useEffect(()=>
    {
        user?setName(user.Name):null
        fetchCourses()
    },[])
    return(
        <div>
            <h1>Welcome {name&&name}</h1>
            <div>{
                    courses&&courses.map((value,index)=>
                    (<NavLink key={index} to={`${value.split(' ').join('').toLowerCase()}`}>{value} </NavLink>)
                    )
                }
            </div>
            <button onClick={()=>navigate(`/addcourse/${user.Email}`)}>Want Another Course</button>
            <div>
                <button onClick={logout}>Logout</button>
            </div>
        </div>
    )
}

export default Home;