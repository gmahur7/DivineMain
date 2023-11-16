import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './Components/Home'
import Signup from './Components/Signup'
import Login from './Components/Login'
import VerifyOtp from './Components/OtpVerify'
import Forget from './Components/Forget'
import FillDetail from './Components/FillDetail'
import Protected from './Components/Protected'
import ApplyCertificate from './Components/Certificate'
import AddCourse from './Components/AddCourse'
import AboutPage from './Components/Frontend'
import Frontend from './Components/Frontend'
import Backend from './Components/BackendDev'
import Fullstack from './Components/Fullstack'

function Divine()
{
    return(
        <div id='divine'>
            <Router>
                <Routes>
                    <Route path='/signup' element={<Signup/>}/>
                    <Route path='/login' element={<Login/>}/>
                    <Route path={`/verifyotp/:id`} element={<VerifyOtp/>}/>
                    <Route path={'/forget'} element={<Forget/>}/>
                    <Route path={'/filldetail/:_id'} element={<FillDetail/>}/>
                    <Route path={'/frontendwebdevelopement'} element={<Frontend/>}/>
                    <Route path={'/backendwebdevelopement'} element={<Backend/>}/>
                    <Route path={'/fullstackwebdevelopement'} element={<Fullstack/>}/>
                    <Route element={<Protected/>}>
                    <Route path='/' element={<Home/>}/>
                    <Route path='/getcertificate' element={<ApplyCertificate/>}/>
                    <Route path='/addcourse/:Email' element={<AddCourse/>}/>
                    <Route path='/frontendwebdevelopement' element={<AboutPage/>}/>
                    </Route>
                </Routes>
            </Router>
        </div>
    )
}

ReactDOM.createRoot(document.getElementById('main')).render(<Divine/>)