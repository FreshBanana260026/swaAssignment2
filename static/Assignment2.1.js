
function WeatherData(val, event, dataType) {

    function value() {
        return val;
    }
    return Object.assign({}, event, dataType, { value});
}

function CloudCoverage(weatherData) {
    function coverage() {
        return weatherData.value();
    }
    return Object.assign({}, weatherData, { coverage })
}

function DateInterval(fromDate, toDate) {
    function from() {
        console.log("The starting date is: " + fromDate);
    }
    function to() {
        console.log("The ending date is: " + toDate);
    }
    function contains(date) {
        if (date > fromDate && date < toDate) {
            return true
        }
        return false;
    }
    return { from, to, contains }
}

function WeatherPrediction(fromValue, toValue, event, dataType) {
    function matches(weatherData) {
        if (weatherData.value() > fromValue && weatherData.value() < toValue) {
            console.log(weatherData.value() + " matches the interval prediction between " + fromValue + " and " + toValue)
        }
        else return false;
    }
    function from() {
        return fromValue;
    }
    function to() {
        return toValue;
    }
    return Object.assign({}, event, dataType, { matches, from, to })
}

function TemperaturePrediction(weatherPrediction) {
    function convertToF() {
        if (weatherPrediction.unit() !== "us") {
            const tempFrom = weatherPrediction.from() * 9/5 + 32
            const tempTo = weatherPrediction.to() * 9/5 + 32
            const newType = DataType(weatherPrediction.type, "us");
            const newPrediction =  WeatherPrediction(tempFrom, tempTo, weatherPrediction.event, newType);
            return Object.assign({}, newPrediction, { convertToF, convertToC });
        }
        else console.log("Invalid unit type")
    }
    function convertToC() {
        if (weatherPrediction.unit() !== "international") {
            const tempFrom = (weatherPrediction.from() - 32) * 5/9
            const tempTo = (weatherPrediction.to() - 32) * 5/9
            const newType = DataType(weatherPrediction.type, "international");
            const newPrediction =  WeatherPrediction(tempFrom, tempTo, weatherPrediction.event, newType);
            return Object.assign({}, newPrediction, { convertToF, convertToC });
        }
        else console.log("Invalid unit type")
    }
    return Object.assign({}, weatherPrediction, { convertToF, convertToC })
}

function PrecipitationPrediction(weatherPrediction, pTypes) {

    function types() {
        return pTypes
    }

    function matches(data) {
        return weatherPrediction.matches(data.value())
    }
    function convertToInches() {
        if (weatherPrediction.unit() !== "us") {
            const inchesFrom = weatherPrediction.from() / 25.4
            const inchesTo = weatherPrediction.to() / 25.4
            const newType = DataType(weatherPrediction.type, "us");
            const newPrediction =  WeatherPrediction(inchesFrom, inchesTo, weatherPrediction.event, newType);
            return Object.assign({}, newPrediction, { types, matches, convertToInches, convertToMM })
        }
        else { console.log("Invalid unit type") }
    }
    function convertToMM() {
        if (weatherPrediction.unit() !== "international") {
            const mmFrom = weatherPrediction.from() * 25.4
            const mmTo = weatherPrediction.to() * 25.4
            const newType = DataType(weatherPrediction.type, "international");
            const newPrediction =  WeatherPrediction(mmFrom, mmTo, weatherPrediction.event, newType);
            return Object.assign({}, newPrediction, { types, matches, convertToInches, convertToMM })
        }
        else { console.log("Invalid unit type") }
    }
    return Object.assign({}, weatherPrediction, { types, matches, convertToInches, convertToMM })
}

function WindPrediction(wDirections, weatherPrediction) {

    function directions() {
        return wDirections
    }

    function matches() {
        return weatherPrediction.matches(data.value())
    }
    function convertToMPH() {
        if (weatherPrediction.unit() !== "us") {
            const mphFrom = weatherPrediction.from() * 2.2369
            const mphTo = weatherPrediction.to() * 2.2369
            const newType = DataType(weatherPrediction.type, "us");
            const newPrediction =  WeatherPrediction(mphFrom, mphTo, weatherPrediction.event, newType);
            return Object.assign({}, weatherPrediction, { directions, matches, convertToMPH, convertToMS })
        }
        else { console.log("Invalid unit type") }
    }

    function convertToMS() {
        if (weatherPrediction.unit() !== "international") {
            const msFrom = weatherPrediction.from() / 2.2369
            const msTo = weatherPrediction.to() / 2.2369
            const newType = DataType(weatherPrediction.type, "international");
            const newPrediction =  WeatherPrediction(msFrom, msTo, weatherPrediction.event, newType);
            return Object.assign({}, weatherPrediction, { directions, matches, convertToMPH, convertToMS })
        }
        else { console.log("Invalid unit type") }
    }
    return Object.assign({}, weatherPrediction, { directions, matches, convertToMPH, convertToMS })
}

function CloudCoveragePrediction(weatherPrediction) {
    function coverage() {
        console.log("Cloud coverage is: " + data.value() + "%" + ", and the prediction was from: " + weatherPrediction.from() + "%" + ", to: " + weatherPrediction.to() + "%");
    }
    return Object.assign({}, weatherPrediction, { coverage })
}

function WeatherHistory(weatherData) {

    let currentData = weatherData;
    const namesOfMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    return {
        WeatherReport: function () {
            currentData.map(d => {
                const date = d.time();

                console.log("On the date " + date.getDate() + " of the " + namesOfMonths[date.getMonth()] + " following data was measured: " + d.type() + " with value of " + d.value() + " in the " + d.unit() + " units.");
            });
        },

        forPlace: function(place) {
            const result = currentData.filter(d => d.place() === place);
            return WeatherHistory(result);
        },
        forType: function(type) {
            const result = currentData.filter(d => d.type() === type);
            return WeatherHistory(result);
        },
        forPeriod: function(interval) {
            const result = currentData.map(d => {
                if (interval.contains(d.time())) {
                    return d;
                }
            })
            return WeatherHistory(result);
        },
        including: function(weatherData) {
            let result;
            if (currentData === null) {
                result = weatherData;
            }
            else {
                result = Array.concat(currentData, weatherData);
            }
            return WeatherHistory(result);
        },
        convertToUSUnits: function () {
            const result = currentData.map(d => {
                if (d.unit() !== "us")
                switch (d.type()) {
                    case "temperature":
                        d.convertToF();
                        break;
                    case "precipitation":
                        d.convertToInches();
                        break;
                    case "wind":
                        d.convertToMPH();
                }
            });
            return WeatherHistory(result);
        },
        convertToInternationalUnits: function () {
            const result = currentData.map(d => {
                if (d.unit() !== "international")
                switch (d.type()) {
                    case "temperature":
                        d.convertToC();
                        break;
                    case "precipitation":
                        d.convertToMm();
                        break;
                    case "wind":
                        d.convertToMS();
                }
            })
            return WeatherHistory(result);
        },
        lowest: function() {
            function check() {
                let firstElement;
                if(currentData != null) {
                    firstElement = currentData[0];
                }
                return currentData.every(x => firstElement.value === x.value);
            }
            if(currentData === null || check()){
                return currentData.reduce((a,b) => Math.min(a,b));
            }
            return undefined;
        },
        data: function () {
            currentData.forEach(d => {
                console.log(d.time() + " " + d.type() + " ");
            })
        }
    }
}

function WeatherForecast(weatherPrediction) {
    let currentData = weatherPrediction
    const namesOfMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    return {
        weatherForecast: function () {
            currentData.forEach(d => {
                const date = d.time();
                console.log("For " + date.getDate() + " of " + namesOfMonths[date.getMonth()] + " is predicted that " + d.type() + " will be with the value of " + d.from() + " to " + d.to() + " in the " + d.unit() + " units")
            });
        },
        forPlace: function(place) {
            const result = currentData.filter(d => d.place() === place);
            return WeatherHistory(result);
        },
        forType: function(type) {
            const result = currentData.filter(d => d.type() === type);
            return WeatherHistory(result);
        },
        forPeriod: function(interval) {
            const result = currentData.map(d => {
                if (interval.contains(d.time())) {
                    return d;
                }
            })
            return WeatherHistory(result);
        },
        including: function(weatherPredictionData) {
            let result;
            if (currentData === null) {
                result = weatherPredictionData;
            }
            else {
                result = Array.concat(currentData, weatherPredictionData);
            }
            return WeatherHistory(result);
        },
        convertToUSUnits: function () {
            const result = currentData.map(d => {
                if (d.unit() !== "us")
                switch (d.type()) {
                    case "temperature":
                        d.convertToF();
                        break;
                    case "precipitation":
                        d.convertToInches();
                        break;
                    case "wind":
                        d.convertToMPH();
                }
            });
            return WeatherForecast(result);
        },
        convertToInternationalUnits: function () {
            const result =  currentData.map(d => {
                if (d.unit() !== "international")
                switch (d.type()) {
                    case "temperature":
                        d.convertToC();
                        break;
                    case "precipitation":
                        d.convertToMm();
                        break;
                    case "wind":
                        d.convertToMS();
                }
            })
            return WeatherForecast(result);
        },
        averageFromValue: function() {
            function check() {
                let firstElement;
                if(currentData != null) {
                    firstElement = currentData[0];
                }
                return currentData.every(x => firstElement.value === x.value);
            }
            if(currentData === null || check()){
                const sum = currentData.reduce((a,b) => a+b.from());
                return sum/currentData.length;
            }
            return undefined;
        },
        averageToValue: function() {
            function check() {
                let firstElement;
                if(currentData != null) {
                    firstElement = currentData[0];
                }
                return currentData.every(x => firstElement.value === x.value);
            }
            if(currentData === null || check()){
                const sum = currentData.reduce((a,b) => a+b.to());
                return sum/currentData.length;
            }
            return undefined;
        },
        data: function () {
            currentData.forEach(d => {
                console.log(d.time() + " " + d.type() + " ");
            });
        }
    }
}

function Event(date, placeValue) {
    function time() {
        return date;
    }
    function place() {
        return placeValue;
    }
    return { time, place }
}

function DataType(dType, unitValue) {
    function type() {
        return dType
    }
    function unit() {
        return unitValue
    }
    return { type, unit };
}

function Temperature(weatherData) {

    function convertToF() {
        const f = weatherData.value() * 9 / 5 + 32;
        const dataType  = DataType(weatherData.type(), "us");
        const newWeather = WeatherData(f, weatherData.event, dataType);
        return Object.assign({}, newWeather, { convertToF, convertToC })
    }
    function convertToC() {
        const c = (weatherData.value() - 32) * 5 / 9;
        const dataType  = DataType(weatherData.type(), "international");
        const newWeather = WeatherData(f, weatherData.event, dataType);
        return Object.assign({}, newWeather, { convertToF, convertToC })
    }
    return Object.assign({}, weatherData, { convertToF, convertToC })
}

function Precipitation(weatherData, perType) {

    function precipitationType() {
        console.log("The precipitation type is: " + perType);
    }
    function convertToInches() {
        const inches = weatherData.value() * 25.4;
        const dataType  = DataType(weatherData.type(), "us");
        const newWeather = WeatherData(inches, weatherData.event, dataType);
        return Object.assign({}, newWeather, { precipitationType, convertToInches, convertToMm })
    }
    function convertToMm() {
        const mm = weatherData.value() / 25.4;
        const dataType  = DataType(weatherData.type(), "international");
        const newWeather = WeatherData(mm, weatherData.event, dataType);
        return Object.assign({}, newWeather, { precipitationType, convertToInches, convertToMm })
    }
    return Object.assign({}, weatherData, { precipitationType, convertToInches, convertToMm });
}

function Wind(weatherData, windDirection) {
    function direction() {
        console.log("The direction of the wind is " + windDirection)
    }
    function convertToMPH() {
        const mph = weatherData.value() * 2.2369;
        const dataType  = DataType(weatherData.type(), "us");
        const newWeather = WeatherData(mph, weatherData.event, dataType);
        return Object.assign({}, newWeather, { direction, convertToMPH, convertToMS })
    }
    function convertToMS() {
        const ms = weatherData.value() / 2.2369;
        const dataType  = DataType(weatherData.type(), "international");
        const newWeather = WeatherData(ms, weatherData.event, dataType);
        return Object.assign({}, newWeather, { direction, convertToMPH, convertToMS })
    }
    return Object.assign({}, weatherData, { direction, convertToMPH, convertToMS });
}

const somedate = new Date("1/1/2019");
const event = Event(somedate, "horsens");
const dataType = DataType("temperature", "international");
const weatherData = WeatherData(1,  event, dataType);
const prediction  = WeatherPrediction(20,30, event,  dataType);
const f = TemperaturePrediction(prediction);

console.log(prediction.from());
console.log(f.from());
console.log(f.convertToF().from());

