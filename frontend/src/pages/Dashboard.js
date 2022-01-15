import React from 'react'
import Navbar from "../components/Navbar";
import Watchlist from "../components/Watchlist";
import jwt from 'jsonwebtoken';
import { useHistory } from 'react-router-dom';
import { useState, useEffect } from 'react';
import TradingViewWidget from 'react-tradingview-widget';
import './Dashboard.css';
import DisplayTable from '../components/DisplayTable';
import { PieChart } from 'react-minimal-pie-chart';
import { CSVLink } from "react-csv";

//const stockhelpers = require('../stockHelpers.js');
const axios = require('axios').default
var templateSymbol = 'Choose Symbol';
// var termState = "med";
function Dashboard() {
    var shortPred;
    var medPred;
    var longPred;
    const [suggestions, setSuggestions] = useState([]);
    const [currentSymbol, setCurrentSymbol] = useState('TSLA');
    
    
    // console.log("test ", templateSymbol)
    var [shortMedLong, setShortMedLong] = useState('long');
    const [predictedPrice, setPredictedPrice] = useState(0);

    const [percentageChange, setPercentageChange] = useState(12);
    const [chartValues, setChartValues] = useState([52,48]);
    //const [text, setText] = useState('');
    //const watchList = [];
    const [data, setData] = useState([]);
    const [facebook, setFacebook] = useState([50,50]);

    // var currentSymbolForPrediction = 'TSLA'

    // function changePeriod(_period){
        // [shortMedLong, setShortMedLong] = termState;
//    }

    // function getTimeFromSML() {
    //     if (shortMedLong == "short") {
    //         return 86400
    //     } else if (shortMedLong == "med") {
    //         return 2678400
    //     } else if (shortMedLong == "long") {
    //         return 31536000
    //     } else {
    //         alert('error');
    //     }
    //     //return calculated timestamp from shortMedLong
    // }

    // function StockPrediction(inputMsg) { 
    //     const APP_KEY = "01TvmPT8hzkv18vY8USE1W4ifTiIDCCSP/CMWSH/gqZqBpQXn9z22Q==";
    //     var URI = "https://clouddevstockprediction.azurewebsites.net/api/StockPrediction?";
    
    //     //console.log("outputting!")
    //     return axios.post(URI,inputMsg);
    // }

    // function getTimeFromSML2(param) {
    //     if (param == "short") {
    //         return 86400
    //     } else if (param == "med") {
    //         return 2678400
    //     } else if (param == "long") {
    //         return 31536000
    //     } else {
    //         alert('error');
    //     }
    //     //return calculated timestamp from shortMedLong
    // }



    // async function getAll() { 
    //     shortPred = await StockPrediction({'timestamp': new Date().getTime() /1000 + getTimeFromSML2("short"), 'ticker': currentSymbol})
    //     medPred = await StockPrediction({'timestamp': new Date().getTime() /1000 + getTimeFromSML2("med"), 'ticker': currentSymbol})
    //     longPred = await StockPrediction({'timestamp': new Date().getTime() /1000 + getTimeFromSML2("long"), 'ticker': currentSymbol})
    //     console.log(shortPred, "1tes")
    // }

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
        return percent.toFixed(2);
    }
    
    // async function getPrediction() {
    //     return [await StockPrediction({'timestamp': new Date().getTime() /1000, 'ticker': currentSymbol}),await  StockPrediction({'timestamp': new Date().getTime() /1000 + getTimeFromSML(), 'ticker': currentSymbol})]
    // }

    function getDataForChart(p) {
        let buy = 0;
        let sell = 0;

        // p = p*2;

        if (p > 100) {
            buy = 100;
        } else {
            buy = p;
        }
        buy = buy / 2;
        buy += 50;
        sell = 100 - buy;
        var dif = buy - sell; 
        sell = 50 - dif;
        buy = 50 + dif;
        // sell += dif; 
        // buy -= dif;
        setChartValues([buy, sell]); 
    }

    function changeChart(symbol) {
        //currentSymbolForPrediction = symbol;
        templateSymbol = symbol;
        setCurrentSymbol(symbol);
        let myPromise = new Promise((resolve, reject) => {
            //resolve(getPrediction())
            reject(console.log('error with stock prediction promise'))
        })
        myPromise.then((value) => {
            console.log(value);
            let value1 = value[0].data
            let value2 = value[1].data
            console.log(value1) 
            console.log(value2)
            let p = percIncrease(value1, value2)
            console.log(p);
            setPercentageChange(p);
            getDataForChart(p);
            
        });
        //getAll();
        console.log("test ", templateSymbol);
        
        
    }

    useEffect(() => {
        let myPromise = new Promise((resolve, reject) => {
            //resolve(getPrediction())
            reject(console.log('error with stock prediction promise'))
        })
        myPromise.then((value) => {
            console.log(value);
            let value1 = value[0].data
            let value2 = value[1].data
            console.log(value1) 
            console.log(value2)
            let p = percIncrease(value1, value2)
            console.log(p);
            setPercentageChange(p);
            getDataForChart(p);
        })
        //console.log(percIncrease(1.5,2))
        //console.log(predictedPrice)
        getTweetsApi()
        getFacebookApi()
    }, [])

    const getTweetsApi = () => {
        fetch('https://tradepal-backend.nw.r.appspot.com/api/gettweets')
            .then(res => res.json())
            .then(data => setData(data.message))
    }

    const getFacebookApi = () => {
        fetch('https://tradepal-backend.nw.r.appspot.com/api/getfacebook')
            .then(res => res.json())
            .then(facebook => setFacebook(facebook.message))
    }

    const getNyTimes = () => {
        fetch('https://tradepal-backend.nw.r.appspot.com/api/gettimes')
            .then(res => res.json())
            .then(data => setFacebook(data.message))
    }

    const getInvesting = () => {
        fetch('https://tradepal-backend.nw.r.appspot.com/api/getinvesting')
            .then(res => res.json())
            .then(data => setFacebook(data.message))
    }

    const headers = [
        { label: "Stock", key: "stock" },
        { label: "Buy %", key: "buy" },
        { label: "Sell %", key: "sell" },
        { label: "Change", key: "change" },
        { label: "Time", key: "time"}
      ];

    const report = [
        {stock : currentSymbol, buy : chartValues[0], sell : chartValues[1], change : percentageChange, time: shortMedLong}
    ];

    const csvReport = {
        data: report,
        headers: headers,
        filename: 'report.csv'
      };

    const prettyLink  = {
        fontSize: 16,
        color: '#fff',
        textDecoration: 'none'
      };

    return (
        
        <div className='dashboard'>
            <Navbar />
         
            <body id="page-top">
    <div id="wrapper" className='dash-content'>
        <div className="d-flex flex-column" id="content-wrapper">
            <div id="content">
                <div className="container-fluid">
                    <div className="d-sm-flex justify-content-between align-items-center mt-4 mb-4">
                        <h3 className="text-dark mb-0">Dashboard</h3><a className="btn btn-primary btn-sm d-none d-sm-inline-block" role="button" href="#">
                        <CSVLink {...csvReport} style={prettyLink}>Generate Report</CSVLink></a>
                    </div>
                    <div className="row">
                        <div className="col-lg-5 col-xl-4">
                            <div className="card shadow mb-4">
                                <div className="card-header py-3">
                                    <h6 className="text-primary fw-bold m-0">Stocks</h6>
                                </div>
                                <Watchlist currentSymbol={currentSymbol}/>
                            </div>
                        </div>
                        <div className="col-lg-7 col-xl-8">
                            <div className="card shadow mb-4">
                            <div class="card-header d-flex justify-content-between align-items-center">
    <h6 class="text-primary fw-bold m-0">Chart</h6>
    <div class="dropdown no-arrow"><button class="btn btn-link btn-sm dropdown-toggle" aria-expanded="false" data-bs-toggle="dropdown" type="button"></button>
        <div class="dropdown-menu shadow dropdown-menu-end animated--fade-in">
            <p class="text-center dropdown-header">dropdown header:</p><a class="dropdown-item" href="#">Action</a><a class="dropdown-item" href="#">Another action</a>
            <div class="dropdown-divider"></div><a class="dropdown-item" href="#">Something else here</a>
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
                                    <div className="chart-area"><canvas data-bss-chart="{&quot;type&quot;:&quot;doughnut&quot;,&quot;data&quot;:{&quot;labels&quot;:[&quot;Direct&quot;,&quot;Social&quot;,&quot;Referral&quot;],&quot;datasets&quot;:[{&quot;label&quot;:&quot;&quot;,&quot;backgroundColor&quot;:[&quot;#4e73df&quot;,&quot;#1cc88a&quot;,&quot;#36b9cc&quot;],&quot;borderColor&quot;:[&quot;#ffffff&quot;,&quot;#ffffff&quot;,&quot;#ffffff&quot;],&quot;data&quot;:[&quot;50&quot;,&quot;30&quot;,&quot;15&quot;]}]},&quot;options&quot;:{&quot;maintainAspectRatio&quot;:false,&quot;legend&quot;:{&quot;display&quot;:false,&quot;labels&quot;:{&quot;fontStyle&quot;:&quot;normal&quot;}},&quot;title&quot;:{&quot;fontStyle&quot;:&quot;normal&quot;}}}"></canvas></div>
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
                                    <div className="dropdown"><button className="btn btn-primary dropdown-toggle" aria-expanded="false" data-bs-toggle="dropdown" type="button">{templateSymbol}</button>
                                        <div className="dropdown-menu">
                                        <p className="dropdown-item" onClick={() => {changeChart('TSLA')}}>Tesla</p>
                                        <p className="dropdown-item" onClick={() => {changeChart('MSFT')}}>Microsoft</p>
                                        <p className="dropdown-item" onClick={() => {changeChart('AAPL')}}>Apple</p>
                                        </div>
                                    </div>
                                    
                                
                                </div>
                                <div className="card-body">
                                <div class="row align-items-center">
                                    <div class="col-md-6 col-xl-3 mb-4">
                                        <div class="card shadow border-start-primary py-2">
                                            <div class="card-body">
                                                <div class="row align-items-center no-gutters">
                                                    <div class="col me-2">
                                                        <div class="text-uppercase text-primary fw-bold text-xs mb-1"><span>SHORT TERM</span></div>
                                                        <div class="text-dark fw-bold h5 mb-0"><span>{shortPred}</span></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-xl-3 mb-4">
                                        <div class="card shadow border-start-primary py-2">
                                            <div class="card-body">
                                                <div class="row align-items-center no-gutters">
                                                    <div class="col me-2">
                                                        <div class="text-uppercase text-primary fw-bold text-xs mb-1"><span>Medium TERM</span></div>
                                                        <div class="text-dark fw-bold h5 mb-0"><span>{medPred}</span></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-xl-3 mb-4">
                                        <div class="card shadow border-start-primary py-2">
                                            <div class="card-body">
                                                <div class="row align-items-center no-gutters">
                                                    <div class="col me-2">
                                                        <div class="text-uppercase text-primary fw-bold text-xs mb-1"><span>Long TERM</span></div>
                                                        <div class="text-dark fw-bold h5 mb-0"><span>{longPred}</span></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <PieChart totalValue={100} startAngle={90} radius={40}
                                    data={[
                                        { title: 'One', value: chartValues[0], color: '#2ba658' },
                                        { title: 'Two', value: chartValues[1], color: '#C13C37' },
                                    ]}
                                />
                                <p>Stock: {currentSymbol}</p>
                                <p>1Y Change: {percentageChange}</p>
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
                                                <div className="dropdown-menu"><a className="dropdown-item" >Nvidia</a><a className="dropdown-item" href="#">Apple</a><a className="dropdown-item" href="#">Microsoft</a></div>
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
                                            <div className="dropdown"><button className="btn btn-primary dropdown-toggle" aria-expanded="false" data-bs-toggle="dropdown" type="button" onClick={e => {getFacebookApi()}}>Facebook</button>
                                                <div className="dropdown-menu"><a className="dropdown-item" onClick={e => {getInvesting()}}>Investing.com</a><a className="dropdown-item" onClick={e => {getNyTimes()}}>Economic Times</a></div>
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
                    <div className="text-center my-auto copyright"><span>Copyright © Brand 2022</span></div>
                </div>
            </footer>
        </div>
    </div>
</body>            
        </div>
    )
}



export default Dashboard;

