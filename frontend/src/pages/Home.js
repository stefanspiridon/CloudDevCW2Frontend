import React from "react";
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import HomeContent from './HomeContent'
import Navbar from "../components/Navbar";


function Home() {
  return (
    <div className="home">
        <Navbar />
        <div className="wrapper">
            <Container maxWidth="lg" sx={{mb: 30,display: "block" }}>
                <h1 style={{color:'#F9B346', fontWeight: 'bold'}}>Let's Trade Pal!</h1>

                <h2>TradePal is your one stop shop for Financial News and Advice as well as Stock Market Price Data and Predictions!</h2>
                <h3>Visit our Dashboard to search for the latest stocks, analyse their price over time and get a Price Prediction based on Machine Learning Algorithms, receive Potfolio Advice and check the recent relevant Social Media Posts.  </h3>

                <Grid container sx={{mt:10,ml:10}}>
                  <Grid item xs={12}>
                    <Paper sx={{ p: 3, flexDirection: 'column' }}> 
                      <HomeContent />
                    </Paper>
                  </Grid>
                </Grid>
            </Container>
        </div>
        
    </div>
  );
}

export default Home;
