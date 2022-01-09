import React from 'react';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom'
import { withRouter } from "react-router-dom";
import SearchDropdown from "../components/searchDropdown.js";
import jwt from 'jsonwebtoken'

const stockhelpers = require('../stockHelpers.js');
//const [currentSymbol, setCurrentSymbol] = useState('');
const currentSymbol = '';

export function setCurrentSymbol(symbol) {
    currentSymbol = symbol;
}

function Search(props) {
    //add search functions here

    // const onSearchSubmit = async(e) => {
    //     if (e.key === 'Enter') {
    //         let tempArray = [];
    //         let matches = [];

    //         tempArray = await stockhelpers.getAutoComplete(e.target.value);
    
    //         //trim the results to top 10
    //         if (tempArray.length > 10) {
    //             tempArray = tempArray.slice(0, 9);
    //         }
    
    //         //convert the objects into strings to display
    //         for (var record of tempArray) {
    //             matches.push(record.symbol + ' - ' + record.shortname);
    //         }
    //         console.log(matches);
    //         setSuggestions(matches);
    //     }
    // }


    return (
        <>
        <li className="list-group-item">
            <div className="row align-items-center no-gutters">
                <div className="col me-2"><input type="text"/></div>
                
                <div className="col"><img src="/search.png" height={10} width={10} ></img></div>
            </div>
        </li>
        </>
    )
}

export const Watchlist = (props) => {
    const [watchlist, setWatchlist] = useState([]);
    //const [selected, setSelected] = useState([]);
    const [currentSymbol, setCurrentSymbol] = useState('');
    const history = useHistory();

    async function addStockToList() {

    }

    function isCurrent(symbol) {
        if (symbol === currentSymbol) {
            return true;
        } else {
            return false;
        }
    }

    function onClickStock(symbol) {
        setCurrentSymbol(symbol)
    }

    async function getList(){
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

    useEffect(() => {
		const token = localStorage.getItem('token')
		if (token) {
			const user = jwt.decode(token)
			if (!user) {
				localStorage.removeItem('token')
				history.replace('/')
			} else {
				getList()
                console.log('List Retrieved')
			}
		}
	}, [])

    useEffect(() => {
        setCurrentSymbol(props.currentSymbol)
    }, [props.currentSymbol])

    return (
        <>
            <ul className="list-group list-group-flush">
                <Search />
                {watchlist !== undefined && watchlist.map((stock, index) => {
                    return (
                        <li key={index} className="list-group-item">
                            <div className="row align-items-center no-gutters">
                                <div className="col me-2">
                                    <h6 className="mb-0"><strong>{stock.name}</strong></h6><span className="text-xs">{stock.symbol}</span>
                                </div>
                                <div className="col-auto">
                                    <div className="form-check"><input className="form-check-input" type="checkbox" id="formCheck-2" checked={isCurrent(stock.symbol)}/><label className="form-check-label" for="formCheck-2"></label></div>
                                </div>
                            </div>
                        </li>
                    )
                })}
            </ul>
        </>
    )
}


export default withRouter(Watchlist);