require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()
morgan.token('data', (req, res) => JSON.stringify(req.body))

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data')) 

app.use(cors())

app.use(express.static('build'))

let data = [
  {
    id: 1,
    name: "Ville Tuomaala",
    number: "9",
    display: true
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
    display: true
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
    display: true
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "12-43-768875",
    display: true
  }
]

const getId = () => Math.floor(Math.random() * Math.floor(1000000000))


app.get('/api/persons', (request, response) => {
  Person.find({}).then(person => response.json(person))
})

app.get('/api/info', (request, response) => {
  Person.find({}).then(person => {
    response.send(`<p>This phonebook has ${person.length} persons.</p><p>${new Date()}</p>`)
  })
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    person ? response.json(person) : response.status(404).end()
  })  
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  data = data.filter(d => d.id != id)
  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name) return response.status(400).json({ error: "Name missing" }) 
  if (!body.number) return response.status(400).json({ error: "Number missing" }) 

  const person = new Person({
    number: body.number,
    name: body.name,
    display: body.display ? body.display : true
  })

  person.save().then(p => { response.json(p)} ) 
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})