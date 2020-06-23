if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY
const axios = require('axios')
const express = require('express')
const app = express()

app.use(express.json())
app.use(express.static('public'))

app.post('/weather', (req, res) =>{
    const url=`https://api.openweathermap.org/data/2.5/weather?lat=${req.body.latitude}&lon=${req.body.longitude}&appid=${OPENWEATHER_API_KEY}`

    axios({
        url: url,
        responseType: 'json'
    }).then(data => {
        return res.json(data.data)
    }).catch((error) => {
        console.error(error);
    });
})

app.listen(3000, ()=>{
    console.log('Server Started')
})