const { MongoClient } = require('mongodb');
const http = require("https");
const axios = require("axios");

const alpha = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]

function test() {
    getAutoComplete("a").then(function (response) {console.log(response);});
    // getQuote("TSLA").then(function (response) {console.log(response);});
    //getAllStocks("a");
}

//test();
function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}


async function getAllStocks(character) {
    let counter = 0;
    let resultsArray = [[]];

    //resultsArray[counter]
    getAutoComplete(character).then((value) => {
            // for (var record in value.results) {
            //     resultsArray[counter].push(
            //         {
            //             symbol: record.symbol,
            //             name: record.shortName
            //         }
            //     )
            // }
            // writeAllToDB(resultsArray[counter]);
            // counter += 1;
        console.log(value);
    });

        // getAutoComplete(character).then(function (response) {
        //     //resultsArray[counter] = response.data.results
        //     for (var record in response.data.results) {
        //         resultsArray[counter].push(
        //             {
        //                 symbol: record.symbol,
        //                 name: record.shortName
        //             }
        //         )
        //     }
        //     writeAllToDB(resultsArray[counter]);
        //     counter += 1;
        // })
    

}

async function getQuote(symbol) {
    //Returns json containing symbol, shortName, market, and price.
    var options = {
        method: 'GET',
        url: 'https://yh-finance.p.rapidapi.com/stock/v2/get-summary',
        params: {symbol: symbol, region: 'GB'},
        headers: {
            'x-rapidapi-host': 'yh-finance.p.rapidapi.com',
            'x-rapidapi-key': '5f4b842c78msh1c7ceedb71bf72ep167855jsn2b8b7122ca99'
        }
    };
    await sleep(1000);
    axios.request(options).then(function (response) {
        var outputObj = {
            'symbol': response.data.symbol,
            'shortName': response.data.price.shortName,
            'price': response.data.price.regularMarketPrice.raw
        };
        console.log(outputObj);
        return outputObj;
    }).catch(function (err) {
        console.error(err);
        //console.log(err);
    });
}

async function getAutoComplete(query) {
    //Function returns list of Stocks based on search query or key word
    //Could possibly be used in UI instead to implement a search function to find stocks?

    var options = {
        method: 'GET',
        url: 'https://yh-finance.p.rapidapi.com/auto-complete',
        params: {q: query, region: 'GB'},
        headers: {
            'x-rapidapi-host': 'yh-finance.p.rapidapi.com',
            'x-rapidapi-key': '5f4b842c78msh1c7ceedb71bf72ep167855jsn2b8b7122ca99'
        }
    };

    axios.request(options).then(function (response) {
        //console.log(response.data);
        var outputObj = {
            'count': response.data.quotes.length,
            'results': response.data.quotes
        };
        console.log(outputObj);
        return outputObj;
    }).catch(function (err) {
        console.error(err);
    });
}

function writeDailyPricesOverYearDB(ticker) {
    // This function collects closing market prices every day over a range of a year for one stock ticker
    // Returns 252 data points and writes to DB


    const options = {
        "method": "GET",
        "hostname": "yh-finance.p.rapidapi.com",
        "port": null,
        "path": "/stock/v3/get-chart?interval=60m&symbol=" + ticker + "&range=1y&region=GB&includePrePost=false&useYfid=true&includeAdjustedClose=true&events=capitalGain%2Cdiv%2Csplit",
        "headers": {
            "x-rapidapi-host": "yh-finance.p.rapidapi.com",
            "x-rapidapi-key": "5f4b842c78msh1c7ceedb71bf72ep167855jsn2b8b7122ca99",
            "useQueryString": true
        }
    };

    const req = http.request(options, function (res) {
        const chunks = [];
    
        res.on("data", function (chunk) {
            chunks.push(chunk);
        });
    
        res.on("end", function () {
            const body = Buffer.concat(chunks);
            var resultString = body.toString();
            //console.log(resultString);

            //parsing output from http request to an object#
            var resultObj = JSON.parse(resultString);

            //Stripping away unnecessary data from the result of the API query
            var outputObj = {
                '_id': resultObj.chart.result[0].meta.symbol,
                'symbol': resultObj.chart.result[0].meta.symbol,
                'epoch-timestamps': resultObj.chart.result[0].timestamp,
                'price-values': resultObj.chart.result[0].indicators.quote[0].close
            };
            console.log(JSON.stringify(outputObj));

            writeToDB(outputObj);
        });
    });

    req.end();
}

function writeHourlyPricesOverYearDB(ticker) {
    // This function collects closing market prices every hour over a range of a year for one stock ticker


    const options = {
        "method": "GET",
        "hostname": "yh-finance.p.rapidapi.com",
        "port": null,
        "path": "/stock/v3/get-chart?interval=60m&symbol=" + ticker + "&range=1y&region=US&includePrePost=false&useYfid=true&includeAdjustedClose=true&events=capitalGain%2Cdiv%2Csplit",
        "headers": {
            "x-rapidapi-host": "yh-finance.p.rapidapi.com",
            "x-rapidapi-key": "5f4b842c78msh1c7ceedb71bf72ep167855jsn2b8b7122ca99",
            "useQueryString": true
        }
    };

    const req = http.request(options, function (res) {
        const chunks = [];
    
        res.on("data", function (chunk) {
            chunks.push(chunk);
        });
    
        res.on("end", function () {
            const body = Buffer.concat(chunks);
            var resultString = body.toString();
            console.log(resultString);

            //parsing output from http request to an object#
            const resultObj = JSON.parse(resultString);

            //Stripping away unnecessary data from the result of the API query
            var outputObj = {
                 _id: resultObj.chart.result[0].meta.symbol,
                 'symbol': resultObj.chart.result[0].meta.symbol,
                 'epoch-timestamps': resultObj.chart.result[0].timestamp,
                 'price-values': resultObj.chart.result[0].indicators.quote[0].close
             };
            //console.log(JSON.stringify(outputObj));
            for (var member in resultObj) delete resultObj[member];
            writeToDB(outputObj);
        });
    });

    req.end();
    
}

async function writeToDB(myObj) {
    const uri = "mongodb+srv://admin2:admin@clouddevcw.hc58e.mongodb.net/CloudDevCW?retryWrites=true&w=majority";
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    
    try {
        // Connect to the MongoDB cluster
        await client.connect();
        // Make the appropriate DB calls
        await client.db("CloudDevCW").collection("Stocks").insertOne(myObj);
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

async function writeAllToDB(myObjArray) {
    const uri = "mongodb+srv://admin2:admin@clouddevcw.hc58e.mongodb.net/CloudDevCW?retryWrites=true&w=majority";
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    
    try {
        // Connect to the MongoDB cluster
        await client.connect();
        // Make the appropriate DB calls
        await client.db("CloudDevCW").collection("StocksList").insertMany(myObjArray);
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}


async function getDailyPricesOverYear(ticker) {
    // This function collects closing market prices every day over a range of a year for one stock ticker
    // Returns 252 data points


    const options = {
        "method": "GET",
        "hostname": "yh-finance.p.rapidapi.com",
        "port": null,
        "path": "/stock/v3/get-chart?interval=60m&symbol=" + ticker + "&range=1y&region=GB&includePrePost=false&useYfid=true&includeAdjustedClose=true&events=capitalGain%2Cdiv%2Csplit",
        "headers": {
            "x-rapidapi-host": "yh-finance.p.rapidapi.com",
            "x-rapidapi-key": "5f4b842c78msh1c7ceedb71bf72ep167855jsn2b8b7122ca99",
            "useQueryString": true
        }
    };

    const req = http.request(options, function (res) {
        const chunks = [];
    
        res.on("data", function (chunk) {
            chunks.push(chunk);
        });
    
        res.on("end", function () {
            const body = Buffer.concat(chunks);
            var resultString = body.toString();

            //parsing output from http request to an object#
            var resultObj = JSON.parse(resultString);

            //Stripping away unnecessary data from the result of the API query
            var outputObj = {
                'symbol': resultObj.chart.result[0].meta.symbol,
                'epoch-timestamps': resultObj.chart.result[0].timestamp,
                'price-values': resultObj.chart.result[0].indicators.quote[0].close
            };

            return outputObj;
        });
    });

    req.end();
}

function getHourlyPricesOverYear(ticker) {
    // This function collects closing market prices every hour over a range of a year for one stock ticker

    const options = {
        "method": "GET",
        "hostname": "yh-finance.p.rapidapi.com",
        "port": null,
        "path": "/stock/v3/get-chart?interval=60m&symbol=" + ticker + "&range=1y&region=US&includePrePost=false&useYfid=true&includeAdjustedClose=true&events=capitalGain%2Cdiv%2Csplit",
        "headers": {
            "x-rapidapi-host": "yh-finance.p.rapidapi.com",
            "x-rapidapi-key": "5f4b842c78msh1c7ceedb71bf72ep167855jsn2b8b7122ca99",
            "useQueryString": true
        }
    };

    const req = http.request(options, function (res) {
        const chunks = [];
    
        res.on("data", function (chunk) {
            chunks.push(chunk);
        });
    
        res.on("end", function () {
            const body = Buffer.concat(chunks);
            var resultString = body.toString();
            console.log(resultString);

            //parsing output from http request to an object#
            const resultObj = JSON.parse(resultString);

            //Stripping away unnecessary data from the result of the API query
            var outputObj = {
                 'symbol': resultObj.chart.result[0].meta.symbol,
                 'epoch-timestamps': resultObj.chart.result[0].timestamp,
                 'price-values': resultObj.chart.result[0].indicators.quote[0].close
            };

            return outputObj;            
        });
    });

    req.end();
    
}


module.exports = {
    writeDailyPricesOverYearDB,
    writeHourlyPricesOverYearDB,
    getDailyPricesOverYear,
    getHourlyPricesOverYear,
    getAutoComplete,
    getQuote
}


// format for json written to db, where there are 252 entries that represent each market day during the year period
// {
//     "symbol": "AAPL",
//     "epoch-timestamps": [
//         1483246800,
//         1485925200,
//         1488344400,
//         1491019200,
//         1493611200
//         ...etc
//     ]
//     "price-values": [
//         3.41234,
//         3.43156,
//         3.65501,
//         4.00001,
//         ...
//         2.68764
//     ]
// }