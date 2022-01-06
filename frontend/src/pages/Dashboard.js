import React from 'react'
import Navbar from "../components/Navbar";
import jwt from 'jsonwebtoken';
import { useHistory } from 'react-router-dom';
import { useState, useEffect } from 'react';
import TradingViewWidget from 'react-tradingview-widget';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

const stockhelpers = require('../stockHelpers.js');

function Dashboard() {
    const [suggestions, setSuggestions] = useState([]);
    const [text, setText] = useState('');
    const watchList = [];

    // const loadSearchResults = async(input) => {
    //     const results = await stockhelpers.getAutoComplete(input);
    //     //console.log(results.results);
    //     //setResults(results.results);
    //     return results.results;
    // }

    const onSearchSubmit = async(e) => {
        if (e.key === 'Enter') {
            let tempArray = [];
            let matches = [];

            tempArray = await stockhelpers.getAutoComplete(e.target.value);
    
            //trim the results to top 10
            if (tempArray.length > 10) {
                tempArray = tempArray.slice(0, 9);
            }
    
            //convert the objects into strings to display
            for (var record of tempArray) {
                matches.push(record.symbol + ' - ' + record.shortname);
            }
            console.log(matches);
            setSuggestions(matches);
        }
    }

    function addTicker() {
        //TODO:
        //add function to add selected ticker to the watchlist
        //and save list to db
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            onSearchSubmit(e);
        }
    }

    return (
        <div className='dashboard'>
            <Navbar />
            <h1>Dashboard</h1>
            <Grid container spacing={2} alignItems='flowstart'>
                <Grid item xs={3}>
                    <input type="text" className="input" style={{marginLeft: 10, padding: 5}}
                    onKeyDown={handleKeyDown}/>
                    {suggestions && suggestions.map((suggestion, i) =>
                    <div key = {i}>{suggestion}</div>)}
                </Grid>
                <Grid item xs={9}>
                    <TradingViewWidget symbol="NASDAQ:AAPL" />
                </Grid>
                <Grid item xs={4}>
                </Grid>
                <Grid item xs={8}>
                </Grid>
            </Grid>
        </div>
    )
}



export default Dashboard;

