import React from 'react';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom'
import { withRouter } from "react-router-dom";

import jwt from 'jsonwebtoken'
//const stockhelpers = require('../stockHelpers.js');

export const Watchlist = () => {
    const [watchlist, setWatchlist] = useState([]);
    const history = useHistory();

    async function getList(){
        const req = await fetch('http://localhost:1337/api/userinfo', { 
			headers: {
				'x-access-token': localStorage.getItem('token'),
			},
        })

        const data = await req.json()
        if (data.status === 'ok') {
            console.log(data.list)
            setWatchlist(data.list)
            console.log(watchlist)
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
                //setStockDetails()
			}
		}
	}, [])

    return (
        <>
            <ul className="list-group list-group-flush">
                {watchlist !== undefined && watchlist.map((stock, index) => {
                    return (
                        <li key={index} className="list-group-item">
                            <div className="row align-items-center no-gutters">
                                <div className="col me-2">
                                    <h6 className="mb-0"><strong>{stock.name}</strong></h6><span className="text-xs">{stock.symbol}</span>
                                </div>
                                <div className="col-auto">
                                    <div className="form-check"><input className="form-check-input" type="checkbox" id="formCheck-2" checked=""/><label className="form-check-label" for="formCheck-2"></label></div>
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