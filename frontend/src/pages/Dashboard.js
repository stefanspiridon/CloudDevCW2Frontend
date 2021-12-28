import React from 'react'
import Navbar from "../components/Navbar";
import jwt from 'jsonwebtoken'
import { useHistory } from 'react-router-dom'

function Dashboard() {
    return (
        <div className='dashboard'>
            <Navbar />
            <h1>Dashboard</h1> 
        </div>
    )
}



export default Dashboard;

