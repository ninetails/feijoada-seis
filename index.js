const hapi = require('hapi')
const mongoose = require('mongoose')

const Painting = require('./models/Painting')

mongoose.connect('mongodb://localhost:27017/powerful-api')

mongoose.connection.once('open', () => console.log('connected to database'))

const server = hapi.server({
  port: 4000,
  host: 'localhost'
})

const init = async () => {
  server.route([
    {
      method: 'GET',
      path: '/',
      handler: () => '<h1>My modern api</h1>'
    },
    {
      method: 'GET',
      path: '/api/v1/paintings',
      handler: () => Painting.find()
    },
    {
      method: 'POST',
      path: '/api/v1/paintings',
      handler: req => {
        const { name, url, techniques } = req.payload
        const painting = new Painting({
          name, url, techniques
        })

        return painting.save()
      }
    }
  ])
  await server.start()
  console.log(`Server running at: ${server.info.uri}`)
}

init()
