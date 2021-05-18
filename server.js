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
    const { email, password: plainTextPassword } = req.body

    if (!email || typeof email !== 'string') {
        return res.json({ status: 'error', error: 'Invalid email' })
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
            email, password
        })
        console.log('User created successfully: ', response)
    } catch (error) {
        if (error.code === 11000) {
            // duplicate key
            return res.json({ status: 'error', error: 'Email already use' })
        }
        throw error
    }
    res.json({ status: 'ok' })
})

app.listen(9999, () => {
    console.log('Server up at 9999')
})