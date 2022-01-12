import React from "react";
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import HomeContent from './HomeContent'
import Navbar from "../components/Navbar";
import { useState, useEffect } from 'react';
import DisplayTable from '../components/DisplayTable';

function Home() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getNyTimes()
}, [])

const getNyTimes = () => {
    fetch('http://localhost:1337/api/gettimes')
        .then(res => res.json())
        .then(data => setData(data.message))
}

  return (
    <div className="home">
        <Navbar />
        <div className="wrapper">
            <Container maxWidth="lg" sx={{mb: 30,display: "block" }}>
                <h1 style={{color:'#F9B346', fontWeight: 'bold'}}>Let's Trade Pal!</h1>

                <h2>TradePal is your one stop shop for Financial News and Advice as well as Stock Market Price Data and Predictions!</h2>
                <h3>Visit our Dashboard to search for the latest stocks, analyse their price over time and get a Price Prediction based on Machine Learning Algorithms, receive Potfolio Advice and check the recent relevant Social Media Posts.  </h3>


                <div className="col-md-12 mt-5">
                                    <div className="card shadow mb-4">
                                        <div className="card-header d-flex justify-content-between align-items-center">
                                            <h6 className="text-primary fw-bold m-0">Latest News</h6>
                                        </div>
                                        <div className="card-body">
                                            <DisplayTable datas={data}/> 
                                        </div>
                                    </div>
                                </div>
            </Container>
        </div>
        
    </div>
  );
}

export default Home;
