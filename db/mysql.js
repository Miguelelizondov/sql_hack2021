const { failResponse, successReponse } = require('../scripts/response.js')
var mysql  = require('mysql');
var dotenv = require('dotenv');
dotenv.config();

var pool = mysql.createPool({
  connectionLimit : 100,
  host     : process.env.MYSQL_HOST,
  user     : process.env.MYSQL_USER,
  password : process.env.MYSQL_PASSWORD,
  database : process.env.MYSQL_DATABASE
});

/**
 * Function that creates a connection to DB and execute query.
 * @param {string} query 
 * @return {{"status": number,"msg": string,"data": any}}
 */
function executeQuery(query){
  return new Promise((resolve, reject) => {
      pool.getConnection(function(err, connection){
          if(err){
              console.log(err);
              resolve(failResponse("SQL-ERROR", err))
              connection.release();
          }
          connection.query( query, (err, result) => {
              err ? resolve(failResponse("SQL-ERROR", err)) : 
              resolve(successReponse("Success", result));
              connection.release()
          })
      });
  })
}

module.exports = { executeQuery };

