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

const getId = () => Math.floor(Math.random() * Math.floor(1000000000))


app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then(person => response.json(person))
    .catch(error => next(error))
})


app.get('/api/info', (request, response, next) => {
  Person.find({})
    .then(person => {
      response.send(`<p>This phonebook has ${person.length} persons.</p><p>${new Date()}</p>`)
    })
    .catch(error => next(error))
})


app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      person ? response.json(person) : response.status(404).end()
    })
    .catch(error => next(error))
})


app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => response.status(204).end())
    .catch(error => next(error))
})


app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.name) return response.status(400).json({ error: "Name missing" }) 
  if (!body.number) return response.status(400).json({ error: "Number missing" }) 

  const person = new Person({
    number: body.number,
    name: body.name,
    display: body.display ? body.display : true
  })

  person.save()
    .then(p => { response.json(p) })
    .catch(error => next(error))
})


app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    number: body.number,
    name: body.name,
    display: body.display
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(person => {
      response.json(person)
    })
    .catch(error => next(error))
}) 


const errorHandler = (error, request, response, next) => {
  console.log(error.message)
  if (error.name === 'CastError') response.status(400).send({ error: 'malformed id' })
  if (error.name === 'ValidationError') response.status(400).send({ error: error.message })
  
  next(error)
}
app.use(errorHandler)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})