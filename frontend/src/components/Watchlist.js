import React from 'react';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom'
import { withRouter } from "react-router-dom";
import jwt from 'jsonwebtoken'
import styled from 'styled-components';

const alpha = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]

const DropDownContainer = styled("div")`
  width: 100%;
  margin: 0 auto;
`;

const DropDownHeader = styled("div")`
  margin-bottom: 0.8em;
  padding: 0.4em 1em 0.4em 1em;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.15);
  font-weight: 500;
  font-size: 1.3rem;
  color: #3faffa;
  background: #ffffff;
`;

const DropDownListContainer = styled("div")``;

const DropDownList = styled("ul")`
  width: 95%;
  position: absolute;
  z-index: 100;
  padding: 0;
  margin: 0;
  padding-left: 1em;
  background: #ffffff;
  border: 2px solid #e5e5e5;
  box-sizing: border-box;
  color: #3faffa;
  font-size: 1rem;
  font-weight: 500;
  &:first-child {
    padding-top: 0.8em;
  }
`;

const ListItem = styled("li")`
  list-style: none;
  margin-bottom: 0.8em;
`;

//const stockhelpers = require('../stockHelpers.js');

export const Watchlist = (props) => {
    const [watchlist, setWatchlist] = useState([]);
    const [currentSymbol, setCurrentSymbol] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [options, setOptions] = useState(["Apple - AAPL", "Tesla - TSLA", "Nvidia - NVDA", "Novavax - NVAX", "Coin - COIN", "Microsoft - MSFT", "Facebook - FB", "AMC - AMC", "Palantir - PLTR", "Moderna - MRNA"]);
    const toggling = () => setIsOpen(!isOpen);
    const history = useHistory();

    const [infinite, setInfinite] = useState(false);

    function isCurrent(symbol) {
        if (symbol === currentSymbol) {
            return true;
        } else {
            return false;
        }
    }

    const onOptionClicked = value => () => {
        console.log(value);
        //get symbol from string
        var symbol = value.substring(value.indexOf('-') + 1, value.length);
        //get name from string
        var name = value.substring(0, value.indexOf('-') - 2);
        setSelectedOption(symbol);
        addToList();
        getList();
        setWatchlist(watchlist.concat([{'name':name,'symbol':symbol}]));
        setIsOpen(false);
        console.log(selectedOption);
    };

    

    // async function getSearchResults() {
    //     let counter = 0;
    //     let resultsArray = [[]];
    //     let matches = [];

    //     for (var character in alpha) {
    //         resultsArray[counter] = await stockhelpers.getAutoComplete(character);
    //     }

    //     for (var i in resultsArray) {
    //         for (var j in i) {
    //             matches.push(j.symbol + ' - ' + j.shortName);
    //         }
    //     }
    //     setOptions(matches);
    // }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            toggling();
            //onSearchSubmit(e);
        }
    }

    const addToList = async(symbol, name) => {
        var newWatchlist = watchlist;
        newWatchlist.push({'symbol': symbol, 'name': name});

        const req = await fetch('http://localhost:1337/api/userwatchlist', { 
            method: 'POST',
			headers: {
				'x-access-token': localStorage.getItem('token'),
			},
            body: JSON.stringify({
				watchlist: newWatchlist
			}),
        })

        const data = await req.json()
        if (data.status === 'ok') {
            setWatchlist(data.watchlist)
            setInfinite(!infinite);
            //console.log(watchlist)
        } else {
            alert(data.error)
        }
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

    useEffect(() => {
		const token = localStorage.getItem('token')
		if (token) {
			const user = jwt.decode(token)
			if (!user) {
				localStorage.removeItem('token')
				history.replace('/')
			} else {
				getList()
                //infinite = !infinite;
                console.log('List Retrieved')
			}
		}
	}, [])

    useEffect(() => {
        setCurrentSymbol(props.currentSymbol)
    }, [props.currentSymbol])

    useEffect(() => {
        getList()
        //This function listens for watchlist changing and then calls getList
        //To update from db
    }, [infinite])

    return (
        <>
            <ul className="list-group list-group-flush">
                
                <li className="list-group-item">
                    <div className="row align-items-center no-gutters">
                        
                        {/* <div className="col"><img src="/search.png" height={10} width={10} ></img></div> */}

                        <DropDownContainer>
                            <DropDownHeader onKeyDown={e => handleKeyDown(e)}><input type="text" style={{width: "100%", margin: "0 auto"}}/></DropDownHeader>
                            {isOpen && (
                            <DropDownListContainer>
                                <DropDownList>
                                {options.slice(0,10).map(option => (
                                    <ListItem onClick={onOptionClicked(option)} key={Math.random()}>
                                    {option}
                                    </ListItem>
                                ))}
                                </DropDownList>
                            </DropDownListContainer>
                            )}
                        </DropDownContainer>
                    </div>
                </li>
                {watchlist !== undefined && watchlist.map((stock, index) => {
                    return (
                        <li key={index} className="list-group-item">
                            <div className="row align-items-center no-gutters">
                                <div className="col me-2">
                                    <h6 className="mb-0"><strong>{stock.name}</strong></h6><span className="text-xs">{stock.symbol}</span>
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