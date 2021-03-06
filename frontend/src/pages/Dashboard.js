import React from 'react'
import Navbar from "../components/Navbar";
import Watchlist from "../components/Watchlist";
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import jwt from 'jsonwebtoken';
import { useHistory } from 'react-router-dom';
import { useState, useEffect } from 'react';
import TradingViewWidget from 'react-tradingview-widget';
import './Dashboard.css';
import { PieChart } from 'react-minimal-pie-chart';
import DisplayTable from '../components/DisplayTable';

const stockhelpers = require('../stockHelpers.js');
const axios = require('axios').default

function Dashboard() {
    const [watchlist, setWatchlist] = useState([]);
    const [toggleBool, setToggleBool] = useState(false);
    const [currentSymbol, setCurrentSymbol] = useState('TSLA');
    const [shortMedLong, setShortMedLong] = useState('med');
    const [predictedPrice, setPredictedPrice] = useState(0);
    const [percentageChange, setPercentageChange] = useState(50);
    const [predictionPercentages, setPredictionPercentages] = useState([50, 50]);
    const [decisionCanvasString, setDecisionCanvasString] = useState("{&quot;type&quot;:&quot;pie&quot;,&quot;data&quot;:{&quot;labels&quot;:[&quot;SELL&quot;,&quot;BUY&quot;],&quot;datasets&quot;:[{&quot;label&quot;:&quot;Revenue&quot;,&quot;backgroundColor&quot;:[&quot;rgba(228,10,10,0.54)&quot;,&quot;rgba(34,184,21,0.48)&quot;],&quot;borderColor&quot;:[&quot;#4e73df&quot;,&quot;#4e73df&quot;],&quot;data&quot;:[&quot;25&quot;,&quot;75&quot;]}]},&quot;options&quot;:{&quot;maintainAspectRatio&quot;:true,&quot;legend&quot;:{&quot;display&quot;:false,&quot;labels&quot;:{&quot;fontStyle&quot;:&quot;normal&quot;},&quot;reverse&quot;:false},&quot;title&quot;:{&quot;fontStyle&quot;:&quot;bold&quot;,&quot;display&quot;:false}}}");
    //const [text, setText] = useState('');
    //const watchList = [];
    const [data, setData] = useState([]);
    const [facebook, setFacebook] = useState([]);

    function StockPrediction(inputMsg) { 
        const APP_KEY = "01TvmPT8hzkv18vY8USE1W4ifTiIDCCSP/CMWSH/gqZqBpQXn9z22Q==";
        var URI = "https://clouddevstockprediction.azurewebsites.net/api/StockPrediction?";
    
        var options = {
            url: URI,
            // hostname: "cosmosdbquiplash.azurewebsites.net",
            // path: "/api/register?",
            method: 'post',
            headers: { 
                'Content-Type': 'application/json',
                'x-functions-key': APP_KEY
            }
        }
        //console.log("outputting!")
        return axios.post(URI,inputMsg);
    }

    function getTimeFromSML() {
        if (shortMedLong == "short") {
            return (new Date().getTime())/1000 + 86400
        } else if (shortMedLong == "med") {
            return (new Date().getTime())/1000 + 2678400
        } else if (shortMedLong == "long") {
            return (new Date().getTime())/1000 + 31536000
        } else {
            alert('error');
        }
        //return calculated timestamp from shortMedLong
    }
    
    function getPrediction() {
        let myPromise = new Promise((resolve, reject) => {
            resolve(StockPrediction({'timestamp': getTimeFromSML(), 'ticker': currentSymbol}));
        })
        myPromise.then((res) => {
            setPredictedPrice(res.data.price);
            producePieChart();
        })
        //setDecisionCanvasString("{&quot;type&quot;:&quot;pie&quot;,&quot;data&quot;:{&quot;labels&quot;:[&quot;SELL&quot;,&quot;BUY&quot;],&quot;datasets&quot;:[{&quot;label&quot;:&quot;Revenue&quot;,&quot;backgroundColor&quot;:[&quot;rgba(228,10,10,0.54)&quot;,&quot;rgba(34,184,21,0.48)&quot;],&quot;borderColor&quot;:[&quot;#4e73df&quot;,&quot;#4e73df&quot;],&quot;data&quot;:[&quot;" + predictionPercentages[0] + "&quot;,&quot;" + predictionPercentages[1] + "&quot;]}]},&quot;options&quot;:{&quot;maintainAspectRatio&quot;:true,&quot;legend&quot;:{&quot;display&quot;:false,&quot;labels&quot;:{&quot;fontStyle&quot;:&quot;normal&quot;},&quot;reverse&quot;:false},&quot;title&quot;:{&quot;fontStyle&quot;:&quot;bold&quot;,&quot;display&quot;:false}}}");
    }

    async function getCurrentPrice(symbol) {
        return stockhelpers.getQuote(currentSymbol);
    }

    function percIncrease(a, b) {
        let percent;
        if(b !== 0) {
            if(a !== 0) {
                percent = (b - a) / a * 100;
            } else {
                percent = b * 100;
            }
        } else {
            percent = - a * 100;            
        }       
        return Math.floor(percent);
    }

    function producePieChart() {
        let myPromise = new Promise((resolve, reject) => {
            resolve(getCurrentPrice('MSFT'))
        })
        myPromise.then((result) => {
            //console.log(result.data.price);
            let inc = percIncrease(predictedPrice, result.data.price)
            let buyperc = 50;
            let sellperc = 50;
            if(inc > 100) {
                //over 100% increase
                buyperc = 100;
            } else if(inc < -100) {
                //over 100% decrease
                buyperc = 0;
            } else {
                //between 0 and 100
                buyperc += inc / 2;
            }
            sellperc = 100 - buyperc;
            setPredictionPercentages([sellperc, buyperc]);
        })
    }

    const getList = async() => {
        const req = await fetch('http://localhost:1337/api/userwatchlist', { 
			headers: {
				'x-access-token': localStorage.getItem('token'),
			},
        })

        const data = await req.json()
        if (data.status === 'ok') {
            setWatchlist(data.watchlist)
            //console.log(watchlist)
        } else {
            alert(data.error)
        }
    }

    // useEffect(() => {
    //     let isActive = true;
    //     getPrediction();
    //     //getList();
    //     return () => { isActive = false };
    // })

    // useEffect(() => {
    //     getPrediction();
    // }, [shortMedLong])

    // useEffect(() => {
    //     getList();
    // })
    async function getPrediction() {
        setPredictedPrice(StockPrediction({'timestamp': getTimeFromSML(), 'ticker': currentSymbol}));
    }

    useEffect(() => {
        getPrediction()
        getTweetsApi()
        getFacebookApi()
    }, [])

    const getTweetsApi = () => {
        fetch('http://localhost:1337/api/gettweets')
            .then(res => res.json())
            .then(data => setData(data.message))
    }

    const getFacebookApi = () => {
        fetch('http://localhost:1337/api/getfacebook')
            .then(res => res.json())
            .then(facebook => setFacebook(facebook.message))
    }

    return (
        
        <div className='dashboard'>
            <Navbar />
         
            <body id="page-top">
    <div id="wrapper" className='dash-content'>
        <div className="d-flex flex-column" id="content-wrapper">
            <div id="content">
                <div className="container-fluid">
                    <div className="d-sm-flex justify-content-between align-items-center mt-4 mb-4">
                        <h3 className="text-dark mb-0">Dashboard</h3><a className="btn btn-primary btn-sm d-none d-sm-inline-block" role="button" href="#"><i className="fas fa-download fa-sm text-white-50"></i>&nbsp;Generate Report</a>
                    </div>
                    <div className="row">
                        <div className="col-lg-5 col-xl-4">
                            <div className="card shadow mb-4">
                                <div className="card-header py-3">
                                    <h6 className="text-primary fw-bold m-0">Stocks</h6>
                                </div>
                                <Watchlist currentSymbol={currentSymbol} />
                            </div>
                        </div>
                        <div className="col-lg-7 col-xl-8">
                            <div className="card shadow mb-4">
                            <div className="card-header d-flex justify-content-between align-items-center">
                            <h6 className="text-primary fw-bold m-0">Chart</h6>
                            <div className="dropdown no-arrow"><button class="btn btn-link btn-sm dropdown-toggle" aria-expanded="false" data-bs-toggle="dropdown" type="button"></button>
                                <div className="dropdown-menu shadow dropdown-menu-end animated--fade-in">
                                    <p class="text-center dropdown-header">dropdown header:</p><a class="dropdown-item" href="#">Action</a><a class="dropdown-item" href="#">Another action</a>
                                    <div className="dropdown-divider"></div><a class="dropdown-item" href="#">Something else here</a>
                                </div>
                            </div>
                            <div class="dropdown"><button class="btn btn-primary dropdown-toggle" aria-expanded="false" data-bs-toggle="dropdown" type="button">Bitcoin</button>
                                <div class="dropdown-menu"><a class="dropdown-item" href="#">First Item</a><a class="dropdown-item" href="#">Second Item</a><a class="dropdown-item" href="#">Third Item</a></div>
                            </div>
                        </div>
                                
                                <div className="card-body">
                                    <div className="chart-area m-0">   <TradingViewWidget symbol={currentSymbol} autosize /></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                    <div className="row">
                        <div className="col-lg-6 mb-4">
                            <div className="card shadow mb-4">
                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <h6 className="text-primary fw-bold m-0">Suggested Portfolio</h6>
                                    <div className="dropdown no-arrow"><button className="btn btn-link btn-sm dropdown-toggle" aria-expanded="false" data-bs-toggle="dropdown" type="button"><i className="fas fa-ellipsis-v text-gray-400"></i></button>
                                        <div className="dropdown-menu shadow dropdown-menu-end animated--fade-in">
                                            <p className="text-center dropdown-header">dropdown header:</p><a className="dropdown-item" href="#">&nbsp;Action</a><a className="dropdown-item" href="#">&nbsp;Another action</a>
                                            <div className="dropdown-divider"></div><a className="dropdown-item" href="#">&nbsp;Something else here</a>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body">
                                    {/* <div className="chart-area"><canvas data-bss-chart="{&quot;type&quot;:&quot;doughnut&quot;,&quot;data&quot;:{&quot;labels&quot;:[&quot;Direct&quot;,&quot;Social&quot;,&quot;Referral&quot;],&quot;datasets&quot;:[{&quot;label&quot;:&quot;&quot;,&quot;backgroundColor&quot;:[&quot;#4e73df&quot;,&quot;#1cc88a&quot;,&quot;#36b9cc&quot;],&quot;borderColor&quot;:[&quot;#ffffff&quot;,&quot;#ffffff&quot;,&quot;#ffffff&quot;],&quot;data&quot;:[&quot;50&quot;,&quot;30&quot;,&quot;15&quot;]}]},&quot;options&quot;:{&quot;maintainAspectRatio&quot;:false,&quot;legend&quot;:{&quot;display&quot;:false,&quot;labels&quot;:{&quot;fontStyle&quot;:&quot;normal&quot;}},&quot;title&quot;:{&quot;fontStyle&quot;:&quot;normal&quot;}}}"></canvas></div> */}
                                    <div className="text-center small mt-4"><span className="me-2"><i className="fas fa-circle text-primary"></i>&nbsp;Apple</span><span className="me-2"><i className="fas fa-circle text-success"></i>&nbsp;Amazon</span><span className="me-2"><i className="fas fa-circle text-info"></i>&nbsp;Facebook</span></div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 mb-4">
                            <div className="card shadow mb-4">
                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <h6 className="text-primary fw-bold m-0">Our Decision</h6>
                                    <div className="dropdown no-arrow"><button className="btn btn-link btn-sm dropdown-toggle" aria-expanded="false" data-bs-toggle="dropdown" type="button"></button>
                                        <div className="dropdown-menu shadow dropdown-menu-end animated--fade-in">
                                            <p className="text-center dropdown-header">dropdown header:</p><a className="dropdown-item" href="#">&nbsp;Action</a><a className="dropdown-item" href="#">&nbsp;Another action</a>
                                            <div className="dropdown-divider"></div><a className="dropdown-item" href="#">&nbsp;Something else here</a>
                                        </div>
                                    </div>
                                    <div className="dropdown"><button className="btn btn-primary dropdown-toggle" aria-expanded="false" data-bs-toggle="dropdown" type="button">Bitcoin</button>
                                        <div className="dropdown-menu"><a className="dropdown-item" href="#" onClick={(e) => console.log(e.target.value)}>First Item</a><a className="dropdown-item" href="#">Second Item</a><a className="dropdown-item" href="#">Third Item</a></div>
                                    </div>
                                
                                </div>
                                <div className="card-body">
                                    <Grid container spacing={2}>
                                        <Grid item xs={8}>
                                            <PieChart totalValue={100} radius={35} animate={true} startAngle={90}
                                                data={[
                                                    { title: 'One', value: predictionPercentages[0], color: '#d4a013' },
                                                    { title: 'Two', value: predictionPercentages[1], color: '#1b1b6e' },
                                                ]}
                                            />
                                            {/* <div data-bs-toggle="tooltip" data-bss-tooltip="" className="chart-area"><canvas data-bss-chart={decisionCanvasString}></canvas></div> */}
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Button variant="contained" sx={{mt: 3, mb: 2, bgcolor:'#060b26' }} onClick={getPrediction()} >Calculate Prediction</Button>
                                            <p>1 Month Prediction: <strong>${predictedPrice}</strong></p>
                                            <p>Percentage Change: <strong>{percentageChange}%</strong></p>
                                        </Grid>
                                    </Grid>
                                    
                                    {/* <a className="btn btn-primary btn-sm d-none d-sm-inline-block" role="button" href="#" onClick={() =>setShortMedLong('short')}><i className="fas fa-download fa-sm text-white-50"></i>&nbsp;Short</a>
                                    <a className="btn btn-primary btn-sm d-none d-sm-inline-block" role="button" href="#" onClick={() => setShortMedLong('med')}><i className="fas fa-download fa-sm text-white-50"></i>&nbsp;Medium</a>
                                    <a className="btn btn-primary btn-sm d-none d-sm-inline-block" role="button" href="#" onClick={() => setShortMedLong('long')}><i className="fas fa-download fa-sm text-white-50"></i>&nbsp;Long</a> */}
                                    {/* <div className="result"> */}
                                        {/* <p>Result: {predictedPrice}</p> */}
                                    {/* </div> */}
                                    {/* <div data-bs-toggle="tooltip" data-bss-tooltip="" className="chart-area"><canvas data-bss-chart="{&quot;type&quot;:&quot;pie&quot;,&quot;data&quot;:{&quot;labels&quot;:[&quot;SELL&quot;,&quot;BUY&quot;],&quot;datasets&quot;:[{&quot;label&quot;:&quot;Revenue&quot;,&quot;backgroundColor&quot;:[&quot;rgba(228,10,10,0.54)&quot;,&quot;rgba(34,184,21,0.48)&quot;],&quot;borderColor&quot;:[&quot;#4e73df&quot;,&quot;#4e73df&quot;],&quot;data&quot;:[&quot;25&quot;,&quot;75&quot;]}]},&quot;options&quot;:{&quot;maintainAspectRatio&quot;:true,&quot;legend&quot;:{&quot;display&quot;:false,&quot;labels&quot;:{&quot;fontStyle&quot;:&quot;normal&quot;},&quot;reverse&quot;:false},&quot;title&quot;:{&quot;fontStyle&quot;:&quot;bold&quot;,&quot;display&quot;:false}}}"></canvas></div> */}
                                </div>
                                
                            </div>
                        </div>
                    </div>
                        <div className="col">
                            <div className="row">
                                <div className="col-lg-6 mb-4">
                                    <div className="card shadow mb-4">
                                        <div className="card-header d-flex justify-content-between align-items-center">
                                            <h6 className="text-primary fw-bold m-0">Related Tweets</h6>
                                            <div className="dropdown no-arrow"><button className="btn btn-link btn-sm dropdown-toggle" aria-expanded="false" data-bs-toggle="dropdown" type="button"></button>
                                                <div className="dropdown-menu shadow dropdown-menu-end animated--fade-in">
                                                    <p className="text-center dropdown-header">dropdown header:</p><a className="dropdown-item" href="#">&nbsp;Action</a><a className="dropdown-item" href="#">&nbsp;Another action</a>
                                                    <div className="dropdown-divider"></div><a className="dropdown-item" href="#">&nbsp;Something else here</a>
                                                </div>
                                            </div>
                                            <div className="dropdown"><button className="btn btn-primary dropdown-toggle" aria-expanded="false" data-bs-toggle="dropdown" type="button">Tesla</button>
                                                <div className="dropdown-menu"><a className="dropdown-item" onSelect={getTweetsApi}>Nvidia</a><a className="dropdown-item" href="#">Apple</a><a className="dropdown-item" href="#">Microsoft</a></div>
                                            </div>
                                        </div>
                                        <div className="card-body">
                                            <DisplayTable datas={data}/>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-6 mb-4">
                                    <div className="card shadow mb-4">
                                        <div className="card-header d-flex justify-content-between align-items-center">
                                            <h6 className="text-primary fw-bold m-0">News</h6>
                                            <div className="dropdown"><button className="btn btn-primary dropdown-toggle" aria-expanded="false" data-bs-toggle="dropdown" type="button">Facebook</button>
                                                <div className="dropdown-menu"><a className="dropdown-item" href="#">New York Times</a><a className="dropdown-item" href="#">Investing.com</a><a className="dropdown-item" href="#">Economic Times</a></div>
                                            </div>
                                        </div>
                                        <div className="card-body">
                                            <DisplayTable datas={facebook}/> 
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <footer className="bg-white sticky-footer">
                <div className="container my-auto">
                    <div className="text-center my-auto copyright"><span>Copyright ?? Brand 2022</span></div>
                </div>
            </footer>
        </div>
    </div>
</body>            
        </div>
    )
}



export default Dashboard;

