const { MongoClient } = require('mongodb');
const http = require("https");

function getAutoComplete(query) {
    //Function returns list of Stocks based on search query or key word
    //Could possibly be used in UI instead to implement a search function to find stocks?

    const options = {
	    "method": "GET",
	    "hostname": "yh-finance.p.rapidapi.com",
	    "port": null,
	    "path": "/auto-complete?q=" + query + "&region=GB",
	    "headers": {
		    "x-rapidapi-host": "yh-finance.p.rapidapi.com",
		    "x-rapidapi-key": "9eede233c7mshc7915a81147112ap1c363djsn1f7192cb8d8e",
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

            //parsing output from http request to an object
            resultObj = JSON.parse(resultString);

            //Stripping away unnecessary data from the result of the API query
            outputObj = {
                'count': resultObj.quotes.length,
                'results': resultObj.quotes
            };

            //cleaning results
            for(let i = 0; i < outputObj.results.length; i++) {
                delete outputObj.results[i].exchange;
                delete outputObj.results[i].quoteType;
                delete outputObj.results[i].index;
                delete outputObj.results[i].score;
                delete outputObj.results[i].typeDisp;
                delete outputObj.results[i].longname;
                delete outputObj.results[i].isYahooFinance;
            }

            // result JSON looks like:
            // {
            //     'count' : 8,
            //     'results' : [
            //         {'shortname': 'Tesla', 'symbol': 'TSLA', 'exchDisp': 'NASDAQ'},
            //         ... etc
            //     ]
            // }

            //console.log(JSON.stringify(outputObj, undefined, 2));
            return outputObj;
	    });
    });

    req.end();
}

function writeDailyPricesOverYearDB(ticker) {
    // This function collects closing market prices every day over a range of a year for one stock ticker
    // Returns 252 data points and writes to DB

    resultString = '';

    const options = {
        "method": "GET",
        "hostname": "yh-finance.p.rapidapi.com",
        "port": null,
        "path": "/stock/v3/get-chart?interval=60m&symbol=" + ticker + "&range=1y&region=GB&includePrePost=false&useYfid=true&includeAdjustedClose=true&events=capitalGain%2Cdiv%2Csplit",
        "headers": {
            "x-rapidapi-host": "yh-finance.p.rapidapi.com",
            "x-rapidapi-key": "9eede233c7mshc7915a81147112ap1c363djsn1f7192cb8d8e",
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
            resultObj = JSON.parse(resultString);

            //Stripping away unnecessary data from the result of the API query
            outputObj = {
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

    resultString = '';

    const options = {
        "method": "GET",
        "hostname": "yh-finance.p.rapidapi.com",
        "port": null,
        "path": "/stock/v3/get-chart?interval=60m&symbol=" + ticker + "&range=1y&region=US&includePrePost=false&useYfid=true&includeAdjustedClose=true&events=capitalGain%2Cdiv%2Csplit",
        "headers": {
            "x-rapidapi-host": "yh-finance.p.rapidapi.com",
            "x-rapidapi-key": "9eede233c7mshc7915a81147112ap1c363djsn1f7192cb8d8e",
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
            outputObj = {
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


function getDailyPricesOverYear(ticker) {
    // This function collects closing market prices every day over a range of a year for one stock ticker
    // Returns 252 data points

    resultString = '';

    const options = {
        "method": "GET",
        "hostname": "yh-finance.p.rapidapi.com",
        "port": null,
        "path": "/stock/v3/get-chart?interval=60m&symbol=" + ticker + "&range=1y&region=GB&includePrePost=false&useYfid=true&includeAdjustedClose=true&events=capitalGain%2Cdiv%2Csplit",
        "headers": {
            "x-rapidapi-host": "yh-finance.p.rapidapi.com",
            "x-rapidapi-key": "9eede233c7mshc7915a81147112ap1c363djsn1f7192cb8d8e",
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
            resultObj = JSON.parse(resultString);

            //Stripping away unnecessary data from the result of the API query
            outputObj = {
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
            "x-rapidapi-key": "9eede233c7mshc7915a81147112ap1c363djsn1f7192cb8d8e",
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
            outputObj = {
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
    getHourlyPricesOverYear
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