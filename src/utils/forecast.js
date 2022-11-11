const request = require('request')

const forecast = (address, callback) => {
    const url = 'http://api.weatherstack.com/current?access_key=5e2f5770b63bd93802acbfe9336fe9b2&query=' + address + '&units=m'

    request({url, json:true}, (error, { body } = {}) => {
        if(error) {
            callback('Unable to connect to weather services!', undefined)
        } else if (body.error) {
            callback(body.error.info, undefined)
        } else {
            const currentWeather = body.current
            callback(undefined, {
                weather_description: currentWeather.weather_descriptions[0],
                temperature: currentWeather.temperature,
                feelslike: currentWeather.feelslike
            })
        }
    })
}

module.exports = forecast