const { text } = require('body-parser');
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var fs = require('fs');
var async = require('async');

var path = require('path');
const { Console } = require('console');
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: '127.0.0.1',    // 호스트 주소
    user: 'root',           // mysql user
    password: '111111',       // mysql password
    port: '3307',
    database: 'board'         // mysql 데이터베이스
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
console.log(path.join(__dirname, 'javascript'));
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});
app.post('/chat', async (req, res) => {
    console.log(req.body);
    //var id = data.contents.length;
    let today = new Date();
    let hours = today.getHours(); // 시
    let minutes = today.getMinutes();  // 분
    let seconds = today.getSeconds();  // 초
    let milliseconds = today.getMilliseconds(); // 밀리초
    //var temp = today.toLocaleDateString() + hours + minutes + seconds + milliseconds;
    var temp = milliseconds;

    req.body.index = temp;

    //data.contents.push(req.body);
    var query = `INSERT INTO info  (title, content, password, writer, id) VALUES ( ?, ?, ?, ?, ?)`;
    var params = [req.body.title, req.body.content, req.body.password, req.body.writer, req.body.index];
    console.log("QUERY : " + query);
    //connection.connect();

    connection.query(query, params,

        function (error, results, fields) {
            if (error) throw error;
            console.log('The solution is: ', results);

            //res.sendFile(__dirname + '/index.html');
        }
    );
    //    connection.end();

    //console.log(data);

    res.sendFile(__dirname + '/index.html');
});

app.delete('/chat/:id', function (req, res) {
    console.log(req.params.id);

    var temp_index = req.params.id;
    var query=`DELETE FROM info    WHERE password = \'${req.body.password}\' and b_index = \'${req.params.id}\'`;
    //var query = `DELETE FROM info    WHERE password = \'${req.body.password}\'`;
    //connection.connect();
    console.log("delete query : " + query);

    connection.query(query,
        function (error, results, fields) {
            if (error) throw error;
            console.log('The solution is: ', results);
            res.send(results);
            
            //res.sendFile(__dirname + '/index.html');
            
            //res.sendFile(__dirname + '/index.html');
            //connection.end();
        }
    );        

    /*
    for (var temp = 0; temp < data.contents.length; temp++) {
        if (temp_index == data.contents[temp].index && req.body.password == data.contents[temp].password) {
            console.log(req.params.id);
            data.contents.splice(temp, 1);
            res.send(200);
        }
    }
    */
});
app.put('/chat/:id', function (req, res) {
    
    //update info set id='kch' where id='admin';
    
    console.log(req.params.id);
    
    var query = `update info set 
    title='${req.body.title}'
    , content=\'${req.body.content}\'
    , writer=\'${req.body.writer}\'
    where b_index =\'${req.params.id}\' and password ='${req.body.password}'`;
    console.log(query);
    //connection.connect();

    connection.query(query,
        function (error, results, fields) {
            if (error) throw error;
            console.log('search list: ', results);
            res.send(results);
            //connection.end();
        }
    );
    
    // console.log(req.params.id);
    // console.log(req.body.title);
    // console.log(req.body.content);
    // var temp_index = req.params.id;
    // for (var temp = 0; temp < data.contents.length; temp++) {
    //     if (temp_index == data.contents[temp].index && req.body.password == data.contents[temp].password) {
    //         console.log(req.params.id);
    //         data.contents[temp].title = req.body.title;
    //         //data.contents[temp].password=req.password;
    //         data.contents[temp].content = req.body.content;
    //         res.send(200);
    //     }
    // }
    // res.send(404);

});


app.get('/search/:key/selected/:selected', function (req, res, next) {
    //console.log(data);req.params.key
    console.log(req.params.key);
    console.log(req.params.selected);
    if ( req.params.selected === 'title')
    {
        var query = `select * from info where title like \'%${req.params.key}%\'`;
    }
    else if  ( req.params.selected === 'content')
    {
        var query = `select * from info where content like \'%${req.params.key}%\'`;
    }
    
    else if  ( req.params.selected === 'writer')
    {
        var query = `select * from info where writer like \'%${req.params.key}%\'`;
    }
    
    else if  ( req.params.selected === 'recent')
    {
        var query = `
        select * from info where title like \'%${req.params.key}%\'
        union
        select * from info where writer like \'%${req.params.key}%\'
        union
        select * from info where content like \'%${req.params.key}%\'
        order by b_index
        `;
    }
    console.log(query);
    //connection.connect();

    connection.query(query,
        function (error, results, fields) {
            if (error) throw error;
            console.log('search list: ', results);
            res.send(results);
            //connection.end();
        }
    );
    //console.log(data);

});

app.get('/chat_list', function (req, res, next) {
    //console.log(data);
    var query = `select * from info`;
    //connection.connect();

    connection.query(query,
        function (error, results, fields) {
            if (error) throw error;
            console.log('chat list: ');
            res.send(results);
            //connection.end();
        }
    );
    //console.log(data);

});

app.get('/chat_info/:id', function (req, res, next) {
    console.log(req.params.id);
    var temp_index = req.params.id;
    
    var query = `select title, content from info where b_index='${temp_index}'`;
    console.log(query);
    //connection.connect();

    connection.query(query,
        function (error, results, fields) {
            if (error) throw error;
            console.log('chat list: '+ results);
            res.send(results);
            //connection.end();
        }
    );
    // for (var temp = 0; temp < data.contents.length; temp++) {
    //     if (temp_index == data.contents[temp].index) {
    //         res.send(data.contents[temp]);
    //     }
    // }
    // res.send(404);
});

server.listen(3000, function () {
    console.log('Notice Board listening on port 3000');
});

function getRandomInt(min, max) { //min ~ max 사이의 임의의 정수 반환
    return Math.floor(Math.random() * (max - min)) + min;
}

