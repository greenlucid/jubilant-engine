const mongoose = require('mongoose')
const mongooseUniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    minlength: 3
  },
  passwordHash: String,
  name: String,
  blogs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog'
  }]
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  }
})

userSchema.plugin(mongooseUniqueValidator)

module.exports = mongoose.model('User', userSchema)