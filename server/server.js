var express = require('express')
var bodyParser = require('body-parser')
const { ObjectID } = require('mongodb')
var chalk = require('chalk')

var {
  mongoose
} = require('./db/mongoose')

var {
  Todo
} = require('./models/todo')

var {
  User
} = require('./models/user')

// ================

var app = express()
const port = process.env.PORT || 4000

app.use(bodyParser.json())

app.post('/todos', (req, res) => {
  var todo = new Todo({text: req.body.text})
  todo.save().then((doc) => {
    res.send(doc)
  }, (e) => {
    res.status(400).send(e)
  })
})

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos});
  }, (e) => {
    res.status(400).send(e);
  })
})

//GET /todos/12345
app.get('/todos/:id', (req, res) => {
  const id = req.params.id
  console.log('id', id) // 5ad134a43b18c9382be747e9
  if (!ObjectID.isValid(id)) {
    return res.status(404).send('<p style="color: red">Id is not valid</p>')
  } else {
    console.log(chalk.green('Id is valid'));
  }
  Todo.findById(id).then((todo) => {
    if (!todo) {
      return res.status(404).send('cound not find todo')
    }
    res.send({todo})
  }, (e) => {
    res.status(400).send() // don't send the error, it may have sensitive information
  })
})

app.listen(port, () => {
  console.log(`Started on port ${port}`)
})

module.exports = {
  app
}
