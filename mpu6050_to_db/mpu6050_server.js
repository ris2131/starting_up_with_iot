const express = require('express')
const app = express()
const port = 8000
fs = require('fs');
mysql = require('mysql');
var connection = mysql.createConnection({
	host: 'localhost',
	user: 'me',
	password: 'mypassword',
	database: 'mpu6050'
})
connection.connect();

app.use(express.json())
require('date-utils')

function getDate(){
        var moment = require('moment');
        require('moment-timezone');
        moment.tz.setDefault("Asia/Seoul");
        var date = moment().format('YYYY-MM-DD HH:mm:ss');
        return date;
}


app.get('/data',function(req, res) {
	var query = connection.query("insert into acc (id, accX, accY, accZ) values ("+req.query.id+","+req.query.accX0+","+req.query.accY0+","+req.query.accZ0+")", function(err,rows,cols){
      if(err) throw err;
   });
var query = connection.query("insert into acc (id, accX, accY, accZ) values ("+req.query.id+","+req.query.accX1+","+req.query.accY1+","+req.query.accZ1+")", function(err,rows,cols){
      if(err) throw err;
   });
var query = connection.query("insert into acc (id, accX, accY, accZ) values ("+req.query.id+","+req.query.accX2+","+req.query.accY2+","+req.query.accZ2+")", function(err,rows,cols){
      if(err) throw err;
   });
var query = connection.query("insert into acc (id, accX, accY, accZ) values ("+req.query.id+","+req.query.accX3+","+req.query.accY3+","+req.query.accZ3+")", function(err,rows,cols){
      if(err) throw err;
   });
var query = connection.query("insert into acc (id, accX, accY, accZ) values ("+req.query.id+","+req.query.accX4+","+req.query.accY4+","+req.query.accZ4+")", function(err,rows,cols){
      if(err) throw err;
   });
var query = connection.query("insert into acc (id, accX, accY, accZ) values ("+req.query.id+","+req.query.accX5+","+req.query.accY5+","+req.query.accZ5+")", function(err,rows,cols){
      if(err) throw err;
   });
var query = connection.query("insert into acc (id, accX, accY, accZ) values ("+req.query.id+","+req.query.accX6+","+req.query.accY6+","+req.query.accZ6+")", function(err,rows,cols){
      if(err) throw err;
   });
var query = connection.query("insert into acc (id, accX, accY, accZ) values ("+req.query.id+","+req.query.accX7+","+req.query.accY7+","+req.query.accZ7+")", function(err,rows,cols){
      if(err) throw err;
   });
var query = connection.query("insert into acc (id, accX, accY, accZ) values ("+req.query.id+","+req.query.accX8+","+req.query.accY8+","+req.query.accZ8+")", function(err,rows,cols){
      if(err) throw err;
   });
var query = connection.query("insert into acc (id, accX, accY, accZ) values ("+req.query.id+","+req.query.accX9+","+req.query.accY9+","+req.query.accZ9+")", function(err,rows,cols){
      if(err) throw err;
   });

	res.json({id:req.query.id, accX:req.query.accX9, accY:req.query.accY9, 
		accZ: req.query.accZ9, status:"ok", time:getDate()});

})
app.get('/watchdog', function (req, res) {
	var html = fs.readFile('./graph.html', function (err, html) {
	html = " "+ html
	console.log('read graph.html');
	if (req.query.id == '') var qstr = 'select * from acc where time >= date_sub(NOW(), interval 24 hour)';
	else var qstr = 'select * from acc where time >= date_sub(NOW(), interval 24 hour) and id = ' + req.query.id;
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
app.get('/db',function(req,res){
	var t={};
	var tmp={};
	var set;
	var i;
	if(req.query.device_id== '')
		set = 'select * from acc where time >= date_sub(NOW(),interval 24 hour)';
	else set = 'select * from acc where time >= date_sub(NOW(),interval 24 hour) and id = ' + req.query.id;
	connection.query(set,function(err,rows,cols){
		if(err) throw err;
		for(i=0;i<rows.length;i++){
			tmp.id = rows[i].id;
			tmp.accX = rows[i].accX;
			tmp.accY = rows[i].accY;
			tmp.accZ = rows[i].accZ;
			tmp.time = rows[i].time;
			t[i] = tmp;
			tmp={};
		}
		res.json(t);
	
	});
})
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

