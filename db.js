const { Client } = require('pg')
const client = new Client('postgres://postgres:sanbellino@localhost:5432/sagrasanbellino')
client.connect()


module.exports = {client}