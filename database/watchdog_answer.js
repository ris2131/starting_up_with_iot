var express = require('express')
var app = express()
fs = require('fs');
mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'me',
    password: 'mypassword',
    database: 'watchdog'
})
connection.connect();


app.get('/watchdog', function (req, res) {
	console.log(req.query);
	if (req.query.dog_id == '') var qstr = 'select * from location where time >= date_sub(NOW(), interval 24 hour)';
	else var qstr = 'select * from location where time >= date_sub(NOW(), interval 24 hour) and dog_id = ' + req.query.dog_id;
	connection.query(qstr, function(err, rows, cols) {
		if (err) throw err;

		var data = {};
		for (var i=0; i< rows.length; i++) {
			r = rows[i];
			var single = {};
			
			
			single.sequence_number = r.seq;
			single.time = r.time;
			single.latitude = r.latitude;
			single.longitude = r.longitude;
			single.dog_id = r.dog_id;
			data[i] = single;
		}
    		//res.send(data);
		//res.end();
		
	        
	        res.writeHead(200, {'Content-Type': 'application/json'});
	        res.write(JSON.stringify(data));        
		res.end;
	});
})

var server = app.listen(8013, function () {
  var host = server.address().address
  var port = server.address().port
  console.log('listening at http://%s:%s', host, port)
});

