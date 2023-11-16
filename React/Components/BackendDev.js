import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Backend()
{
    const [blur,setBlur]=useState('100px')
    const navigate=useNavigate()
    const user=JSON.parse(localStorage.getItem('user'))
    const getData=async()=>
    {
        let data=await fetch('http://localhost/courses',{
            method:'post',
            body:JSON.stringify({Name:user.Name,Email:user.Email}),
            headers:{'Content-Type':'application/json'}
        })
        data=await data.json()
        if(data.courses.includes('Backend Web Developement'))
        {
            setBlur('0px')
        }
        else{
            setBlur('100px')
            navigate('/')
            // alert("You are not eligible for this course")
        }
    }
    useEffect(()=>
    {
        getData()
    },[])
    return(
        <div>
            Backend
        </div>
    )
}

export default Backend;