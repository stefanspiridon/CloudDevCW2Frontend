import React from "react";
import Navbar from "../components/Navbar";
import jwt from 'jsonwebtoken'
import { useHistory } from 'react-router-dom'
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import HomeContent from './HomeContent'


function About() {
  return (
    <div className="about">
        <Navbar />
        <div className="wrapper" style={{marginTop: "3%"}}>
            <Container maxWidth="lg" sx={{mb: 30,display: "block" }}>
                <h1 style={{color:'#F9B346', fontWeight: 'bold'}}>About Us</h1>

                <h4>TradePal aims to gather all key information about popular stocks by looking at multiple news sources
                   such as the Economic Times, Yahoo Finance, New York Times, and BBC articles as well as Reddit posts and tweets
                    from key players relating to stock. This information is paired with backdated stock prices and ran through
                     a machine-learning algorithm to help provide an accurate mathematical prediction of where the price will move
                      in the short, medium, and long term. Aiming to provide detailed investment analysis of stocks such as Tesla,
                       Apple, and Amazon. Our project will display all the calculated information in a dashboard format, for the
                        user to take full advantage of. </h4>
            </Container>
        </div>

    </div>
  );
}

export default About;
