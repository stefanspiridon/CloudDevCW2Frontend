import React from 'react'
import Navbar from "../components/Navbar";
import jwt from 'jsonwebtoken'
import { useHistory } from 'react-router-dom'
import TradingViewWidget from 'react-tradingview-widget';

function Dashboard() {
    return (
        <div className='dashboard'>
            <Navbar />
            <h1>Dashboard</h1>
            <TradingViewWidget symbol="NASDAQ:AAPL" />
            
        </div>
    )
}



export default Dashboard;

