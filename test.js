var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : '127.0.0.1',    // 호스트 주소
  user     : 'root',           // mysql user
  password : '111111',       // mysql password
  port     : '3307',
  database : 'boar'         // mysql 데이터베이스
});

connection.connect();

connection.query('show databases', 

function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results);
});

connection.end();