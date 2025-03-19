import express from 'express'
import connect from './db'
import routes from './routes'
import bodyParser from 'body-parser'

const app = express()

app.use(express.json())
app.use('/api', routes)
app.use(bodyParser.json())


app.get('/', async (req, res) => {
    const userList = await fetch('')
    res.send('hello world')
    console.log('hello world')
})

app.listen(3000, () => {
    connect()
    console.log('server running at localhost 3000')
})