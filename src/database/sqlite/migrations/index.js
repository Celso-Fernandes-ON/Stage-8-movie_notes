const sqliteConnection = require('../../sqlite')
const createUsers = require('./createUsers')

async function migrationsRun(){
    const shemas = [
        createUsers
    ].join('')

    sqliteConnection()
    .then(db => db.exec(shemas))
    .catch(error => console.log(error))

}
module.exports = migrationsRun