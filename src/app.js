const path = require('path')
const express = require('express')
const hbs = require('hbs')
const { query } = require('express')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const port = process.env.PORT || 3000

// This is the configuration to connect with public folder
const publicDirectoryPath = path.join(__dirname, '../public')
// This is the configuration to point to the hbs templates folder
const viewsPath = path.join(__dirname, '../templates/views')
// This is the configuration to point to the hbs partials folder
const partialsPath = path.join(__dirname, '../templates/partials')

// Set up handlebars for template usage
app.set('view engine', 'hbs')
app.set('views', viewsPath)

// Set up handlebars partials for usage
hbs.registerPartials(partialsPath)

// Set up public folder for usage
app.use(express.static(publicDirectoryPath))

// Do somethingh when you visit the root of the web app
app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Matei Anghel'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About',
        name: 'Matei Anghel'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        message: 'If you have any question or problems with the website, please visit the FAQ bellow.',
        title: 'Help',
        name: 'Anghel Matei'
    })
})

app.get('/weather', (req, res) => {
    console.log(req.query.address)
    if (req.query.address === undefined) {
        return res.send({
            error: 'You must provide an address'
        })
    }

    // Call the external API - GEOCODE and FORECAST
    geocode(req.query.address, (error, data) => {
        if (error) {
            return res.send({error})
        }
        forecast(data, (error, { weather_description, temperature, feelslike } = {}) => {
            if (error) {
                return res.send({error})
            }
            res.send({
                address: req.query.address,
                forecast: weather_description + '. It is currently ' + temperature + ' degress out. Feelslike ' + feelslike + ' degress.',
            })
        })
    })
})

app.get('/products', (req, res) => {
    if (req.query.search === undefined) {
        return res.send({
            error: 'You must provide a search term'
        })
    }

    res.send({
        products: []
    })
})

// 404 redirect router
app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404 Redirect',
        message: 'Help article not found',
        name: 'Matei Anghel'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404 Redirect',
        message: 'Page not found',
        name: 'Matei Anghel'
    })
})

// Start the server
app.listen(port, () => {
    console.log('Server is up on port 3000')
})

