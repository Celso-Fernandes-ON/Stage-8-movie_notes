require('express-async-errors')
const migrationsRun = require('./database/sqlite/migrations')
const AppError = require('./utils/AppError')
const express = require('express')

const routes = require('./routes')

const app = express()
app.use(express.json())

app.use(routes)
migrationsRun()

app.use((error, req, res, next) => {
    if( error instanceof AppError){
        return res.status(error.statusCode).json({
            status: 'error',
            message: error.message
        })
    }

    console.log(error)
    
    return res.status(500).json({
        status: 'error',
        message: 'Internal server error'
    })
})
const PORT = 3000;
app.listen(PORT,() => console.log(`Server HTTP Running in ${PORT}`))