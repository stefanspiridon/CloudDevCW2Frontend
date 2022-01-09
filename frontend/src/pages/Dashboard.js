import React from 'react'
import Navbar from "../components/Navbar";
import Watchlist from "../components/Watchlist";
import jwt from 'jsonwebtoken';
import { useHistory } from 'react-router-dom';
import { useState, useEffect } from 'react';
import TradingViewWidget from 'react-tradingview-widget';
import './Dashboard.css';

const stockhelpers = require('../stockHelpers.js');
const axios = require('axios').default

function Dashboard() {
    const [suggestions, setSuggestions] = useState([]);
    const [currentSymbol, setCurrentSymbol] = useState('TSLA');
    const [shortMedLong, setShortMedLong] = useState('short');
    const [predictedPrice, setPredictedPrice] = useState(0);
    //const [text, setText] = useState('');
    //const watchList = [];

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
            return 86400
        } else if (shortMedLong == "med") {
            return 2678400
        } else if (shortMedLong == "long") {
            return 31536000
        } else {
            alert('error');
        }
        //return calculated timestamp from shortMedLong
    }
    
    async function getPrediction() {
        setPredictedPrice(StockPrediction({'timestamp': getTimeFromSML(), 'ticker': currentSymbol}));
    }

    useEffect(() => {
        getPrediction();
    }, [])

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
                                    <div className="dropdown"><button className="btn btn-primary dropdown-toggle" aria-expanded="false" data-bs-toggle="dropdown" type="button">Bitcoin</button>
                                        <div className="dropdown-menu"><a className="dropdown-item" href="#" onClick={(e) => console.log(e.target.value)}>First Item</a><a className="dropdown-item" href="#">Second Item</a><a className="dropdown-item" href="#">Third Item</a></div>
                                    </div>
                                
                                </div>
                                <div className="card-body">
                                    {/* <a className="btn btn-primary btn-sm d-none d-sm-inline-block" role="button" href="#" onClick={() =>setShortMedLong('short')}><i className="fas fa-download fa-sm text-white-50"></i>&nbsp;Short</a>
                                    <a className="btn btn-primary btn-sm d-none d-sm-inline-block" role="button" href="#" onClick={() => setShortMedLong('med')}><i className="fas fa-download fa-sm text-white-50"></i>&nbsp;Medium</a>
                                    <a className="btn btn-primary btn-sm d-none d-sm-inline-block" role="button" href="#" onClick={() => setShortMedLong('long')}><i className="fas fa-download fa-sm text-white-50"></i>&nbsp;Long</a> */}
                                    {/* <div className="result"> */}
                                        {/* <p>Result: {predictedPrice}</p> */}
                                    {/* </div> */}
                                    <div data-bs-toggle="tooltip" data-bss-tooltip="" className="chart-area"><canvas data-bss-chart="{&quot;type&quot;:&quot;pie&quot;,&quot;data&quot;:{&quot;labels&quot;:[&quot;SELL&quot;,&quot;BUY&quot;],&quot;datasets&quot;:[{&quot;label&quot;:&quot;Revenue&quot;,&quot;backgroundColor&quot;:[&quot;rgba(228,10,10,0.54)&quot;,&quot;rgba(34,184,21,0.48)&quot;],&quot;borderColor&quot;:[&quot;#4e73df&quot;,&quot;#4e73df&quot;],&quot;data&quot;:[&quot;25&quot;,&quot;75&quot;]}]},&quot;options&quot;:{&quot;maintainAspectRatio&quot;:true,&quot;legend&quot;:{&quot;display&quot;:false,&quot;labels&quot;:{&quot;fontStyle&quot;:&quot;normal&quot;},&quot;reverse&quot;:false},&quot;title&quot;:{&quot;fontStyle&quot;:&quot;bold&quot;,&quot;display&quot;:false}}}"></canvas></div>
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
                                                <div className="dropdown-menu"><a className="dropdown-item" href="#">First Item</a><a className="dropdown-item" href="#">Second Item</a><a className="dropdown-item" href="#">Third Item</a></div>
                                            </div>
                                        </div>
                                        <div className="card-body">
                                            <div className="table-responsive">
                                                <table className="table">
                                                    <thead>
                                                        <tr>
                                                            <th>User</th>
                                                            <th>Tweet</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>Elon Musk</td>
                                                            <td>Doge coin to moon</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Tesla Inc</td>
                                                            <td>We are experiencing server issues</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Trump</td>
                                                            <td>Tesla Banned</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-6 mb-4">
                                    <div className="card shadow mb-4">
                                        <div className="card-header d-flex justify-content-between align-items-center">
                                            <h6 className="text-primary fw-bold m-0">News</h6>
                                            <div className="dropdown"><button className="btn btn-primary dropdown-toggle" aria-expanded="false" data-bs-toggle="dropdown" type="button">Facebook</button>
                                                <div className="dropdown-menu"><a className="dropdown-item" href="#">First Item</a><a className="dropdown-item" href="#">Second Item</a><a className="dropdown-item" href="#">Third Item</a></div>
                                            </div>
                                        </div>
                                        <div className="card-body">
                                            <div className="table-responsive">
                                                <table className="table">
                                                    <thead>
                                                        <tr>
                                                            <th>Title&nbsp;</th>
                                                            <th>Description</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>Metaverse</td>
                                                            <td>Facebook was hacked last night by a group known as ....<br/></td>
                                                        </tr>
                                                        <tr>
                                                            <td>Facebook Hacked</td>
                                                            <td>Facebook was hacked last night by a group known as ....</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Facebook Coin ICO was a fail</td>
                                                            <td>Facebook was hacked last night by a group known as ....<br/></td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="text-center small mt-4"></div>
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

