const { Pool } = require('pg')

POSTGRES_USER = 'postgres'
POSTGRES_HOST = 'localhost'
POSTGRES_DB = 'forumWeb'
POSTGRES_PWD = '123456'
POSTGRES_PORT = '5432'
// POSTGRES_USER = 'fdvaicbrvpzspe'
// POSTGRES_HOST = 'ec2-44-195-162-77.compute-1.amazonaws.com'
// POSTGRES_DB = 'd31trvvvrappjf'
// POSTGRES_PWD = '375974f51b1101e6202dd2184fba98ca0c80f82b8021e8a32e4d4bfc2910b68c'
// POSTGRES_PORT = '5432'

// postgres://fdvaicbrvpzspe:375974f51b1101e6202dd2184fba98ca0c80f82b8021e8a32e4d4bfc2910b68c@ec2-44-195-162-77.compute-1.amazonaws.com:5432/d31trvvvrappjf

const pgConfig = {
  user: POSTGRES_USER,
  host: POSTGRES_HOST,
  database: POSTGRES_DB,
  password: POSTGRES_PWD,
  port: POSTGRES_PORT,
  // ssl: true
}

const pool = new Pool(pgConfig)
/**
 *
 * @param {String} queryStr
 * @returns Object
 */

const query = async (queryStr) => {
  const client = await pool.connect()
  try {
    return await client.query(queryStr)
  } catch (error) {
    console.log('error >>> ', error)
    throw error
  } finally {
    client.release()
  }
}

module.exports.postgresql = {
  query,
}
