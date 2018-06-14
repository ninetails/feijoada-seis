const hapi = require('hapi')
const mongoose = require('mongoose')
const { graphqlHapi, graphiqlHapi } = require('apollo-server-hapi')
const Inert = require('inert')
const Vision = require('vision')
const HapiSwagger = require('hapi-swagger')
const Pack = require('./package.json')

const schema = require('./graphql/schema')

const Painting = require('./models/Painting')

mongoose.connect('mongodb://localhost:27017/powerful-api')

mongoose.connection.once('open', () => console.log('connected to database'))

const server = hapi.server({
  port: 4000,
  host: 'localhost'
})

const init = async () => {
  await server.register({
    plugin: graphiqlHapi,
    options: {
      path: '/graphiql',
      graphiqlOptions: {
        endpointURL: '/graphql'
      },
      route: {
        cors: true
      }
    }
  })

  await server.register({
    plugin: graphqlHapi,
    options: {
      path: '/graphql',
      graphqlOptions: {
        schema
      },
      route: {
        cors: true
      }
    }
  })

  await server.register([
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: {
        info: {
          title: 'Paintings API Documentation',
          version: Pack.version
        }
      }
    }
  ])

  server.route([
    {
      method: 'GET',
      path: '/',
      handler: () => '<h1>My modern api</h1>'
    },
    {
      method: 'GET',
      path: '/api/v1/paintings',
      config: {
        description: 'Get all the paintings',
        tags: ['api', 'v1', 'painting']
      },
      handler: () => Painting.find()
    },
    {
      method: 'POST',
      path: '/api/v1/paintings',
      config: {
        description: 'Adds a painting',
        tags: ['api', 'v1', 'painting']
      },
      handler: req => {
        const { name, url, technique } = req.payload
        const painting = new Painting({
          name, url, technique
        })

        return painting.save()
      }
    }
  ])
  await server.start()
  console.log(`Server running at: ${server.info.uri}`)
}

init()
