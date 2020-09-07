const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('Not enough params!')
  process.exit(1)
}

const args = {
  dbPassword: process.argv[2],
  personName: process.argv[3],
  personNumber: process.argv[4],
}
const url = `mongodb+srv://fullstack:${args.dbPassword}@cluster0.eyevj.mongodb.net/phonebook-app?retryWrites=true`

mongoose.connect(url, { useNewUrlParser: true,  useUnifiedTopology: true })
  .catch(error => {
    console.log(`Error connecting to MongoDB: ${error}`)
  })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
  display: Boolean
})

const Person = mongoose.model('Person', personSchema)

if (!args.personName && !args.personNumber) {
  Person.find({})
    .then(result => {
      console.log('phonebook:')
      result.forEach(person => {
        console.log(`${person.name} ${person.number}`)
      })
      mongoose.connection.close()
    })
    .catch(error => {
      console.log(`Error fetching persons: ${error}`)
      mongoose.connection.close()
    })
} else {
  const person = new Person({
    name: args.personName,
    number: args.personNumber,
    display: true
  })

  person.save()
    .then(result => {
      console.log(`added ${result.name} number ${result.number} to phonebook`)
      mongoose.connection.close()
    })
    .catch(error => {
      console.log(`Error saving person to DB: ${error}`)
      mongoose.connection.close()
    })
}