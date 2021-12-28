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
        <Container maxWidth="lg" sx={{mb: 30,display: "block" }}>
            <h3>Home</h3>
            <Grid container sx={{mt:10,ml:10}}>
              <Grid item xs={12}>
                <Paper sx={{ p: 3, flexDirection: 'column' }}> 
                  <HomeContent />
                </Paper>
              </Grid>
            </Grid>
        </Container>
    </div>
  );
}

export default Home;
