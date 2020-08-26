const mongoose = require('mongoose');

mongoose.set('useFindAndModify', false)

const url = process.env.MONGODB_URI

console.log(`connecting to url ${url}`)
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(c => console.log('Successfully connected to MongoDB database'))
  .catch(e => console.log('Error connecting to MongoDB database', e.message))

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
  display: Boolean
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString(),
    delete returnedObject._id
    delete returnedObject.__v
  }
})


module.exports = mongoose.model('Person', personSchema)