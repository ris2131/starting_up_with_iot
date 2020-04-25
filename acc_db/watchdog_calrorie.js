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
	var html = fs.readFile('./graph.html', function (err, html) {
	html = " "+ html
	console.log('read graph.html');
	if (req.query.dog_id == '') var qstr = 'select * from acc where time >= date_sub(NOW(), interval 24 hour)';
	else var qstr = 'select * from acc where time >= date_sub(NOW(), interval 24 hour) and id = ' + req.query.dog_id;
	connection.query(qstr, function(err, rows, cols) {
		if (err) throw err;
		dog_mass = 10;
		//need to be selected from database
		//idlex = XXXXX; idley = YYYYY; idlez = ZZZZZ;
		//idle accelarometer value
		var data = "";
		var comma = ""
		for (var i=0; i< rows.length; i++) {
			r = rows[i];
			var single = {};
			single.accX =r.accX;
			single.accY =r.accY;
			single.accZ =r.accZ;
			single.xyzV = Math.sqrt(single.accX*single.accX + single.accY*single.accY + single.accZ*single.accZ) / 10;
			//xyzV is velocity after 0.1sec with this accelaration
			//idle
			single.kinetic = dog_mass * single.xyzV * single.xyzV / 2.0;
			single.calorie = single.kinetic / 4.187;
			data += comma + "[new Date(2017,04-1,"+ i +",00,38),"+ single.calorie +"]";
			comma = ",";
		}
    		var header = "data.addColumn('date', 'Date/Time');";
    		header += "data.addColumn('number', 'Temp');";
    		html = html.replace("<%HEADER%>", header);
    		html = html.replace("<%DATA%>", data);

    		res.writeHeader(200, {"Content-Type": "text/html"});
    		res.write(html);
    		res.end();
	});
	});
})

var server = app.listen(8082, function () {
  var host = server.address().address
  var port = server.address().port
  console.log('listening at http://%s:%s', host, port)
});

