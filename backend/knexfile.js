// Update with your config settings.
require('dotenv').config()
module.exports = {
  development: {
    client: 'mysql',
    connection:{
      host: process.env.DB_HOST || '127.0.0.1',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'atlan'
    }
  },
  staging: {
    client: 'mysql',
    connection:{
      host: process.env.DB_HOST || '127.0.0.1',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'atlan'
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },
  production: {
    client: 'mysql',
    connection:{
      host: process.env.DB_HOST || '127.0.0.1',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'atlan'
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
