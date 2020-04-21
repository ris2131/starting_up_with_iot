const express = require('express')
const app = express()
const port = 8012
app.use(express.json())
require('date-utils')
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
mysql = require('mysql');

var connection = mysql.createConnection({
	host: 'localhost',
	user: 'me',
	password: 'mypassword',
	database: 'watchdog'
})
connection.connect();

app.get('/watchdog', (req, res) => {
	var query = connection.query("insert into location (seq, dog_id, latitude, longitude, ip) values ("+req.query.sequence_number+", "+req.query.dog_id+", "+req.query.latitude+", "+req.query.longitude+", '"+req.ip.split(':')[3]+"')", function(err, rows, cols) {
                if (err) throw err;
        });
        res.send(req.query);
	//var http = require('http');
	//app = http.createServer(function(req,res){
	//	res.setHeader('Content-Type', 'application/json');
	//	res.end(JSON.stringify(answer,null,3));
	//});
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`))

