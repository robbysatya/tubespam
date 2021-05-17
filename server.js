const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const User = require('./model/user')
const bcrypt = require('bcrypt')

mongoose.connect('mongodb+srv://admin:admin123@cluster0.ne97e.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})

const app = express()
app.use('/', express.static(path.join(__dirname, 'static')))
app.use(bodyParser.json())

app.post('/api/register', async (req, res) => {
    const { username, password: plainTextPassword } = req.body

    if (!username || typeof username !== 'string') {
        return res.json({ status: 'error', error: 'Invalid username' })
    }

    if (!plainTextPassword || typeof plainTextPassword !== 'string') {
        return res.json({ status: 'error', error: 'Invalid password' })
    }

    if (plainTextPassword.length < 5) {
        return res.json({
            status: 'error',
            error: 'Password too small. Should be at least 6 character'
        })
    }

    const password = await bcrypt.hash(plainTextPassword, 10)

    try {
        const response = await User.create({
            username, password
        })
        console.log('User created successfully: ', response)
    } catch (error) {
        id(error.code === 11000){
            // duplicate key
            return res.json({ status: 'error', error: 'Username already use' })
        }
        throw error
        return res.json({ status: 'error' })
    }
    res.json({ status: 'ok' })
})

app.listen(9999, () => {
    console.log('Server up at 9999')
})