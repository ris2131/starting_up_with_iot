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
	var query = connection.query("insert into acc (id, accX, accY, accZ, cal) values ("+req.query.id+","+req.query.accX0+","+req.query.accY0+","+req.query.accZ0+","+req.query.cal0+")", function(err,rows,cols){
      if(err) throw err;
   });
var query = connection.query("insert into acc (id, accX, accY, accZ, cal) values ("+req.query.id+","+req.query.accX1+","+req.query.accY1+","+req.query.accZ1+","+req.query.cal1+")", function(err,rows,cols){
      if(err) throw err;
   });
var query = connection.query("insert into acc (id, accX, accY, accZ, cal) values ("+req.query.id+","+req.query.accX2+","+req.query.accY2+","+req.query.accZ2+","+req.query.cal2+")", function(err,rows,cols){
      if(err) throw err;
   });
var query = connection.query("insert into acc (id, accX, accY, accZ, cal) values ("+req.query.id+","+req.query.accX3+","+req.query.accY3+","+req.query.accZ3+","+req.query.cal3+")", function(err,rows,cols){
      if(err) throw err;
   });
var query = connection.query("insert into acc (id, accX, accY, accZ, cal) values ("+req.query.id+","+req.query.accX4+","+req.query.accY4+","+req.query.accZ4+","+req.query.cal4+")", function(err,rows,cols){
      if(err) throw err;
   });
var query = connection.query("insert into acc (id, accX, accY, accZ, cal) values ("+req.query.id+","+req.query.accX5+","+req.query.accY5+","+req.query.accZ5+","+req.query.cal5+")", function(err,rows,cols){
      if(err) throw err;
   });
var query = connection.query("insert into acc (id, accX, accY, accZ, cal) values ("+req.query.id+","+req.query.accX6+","+req.query.accY6+","+req.query.accZ6+","+req.query.cal6+")", function(err,rows,cols){
      if(err) throw err;
   });
var query = connection.query("insert into acc (id, accX, accY, accZ, cal) values ("+req.query.id+","+req.query.accX7+","+req.query.accY7+","+req.query.accZ7+","+req.query.cal7+")", function(err,rows,cols){
      if(err) throw err;
   });
var query = connection.query("insert into acc (id, accX, accY, accZ, cal) values ("+req.query.id+","+req.query.accX8+","+req.query.accY8+","+req.query.accZ8+","+req.query.cal8+")", function(err,rows,cols){
      if(err) throw err;
   });
var query = connection.query("insert into acc (id, accX, accY, accZ, cal) values ("+req.query.id+","+req.query.accX9+","+req.query.accY9+","+req.query.accZ9+","+req.query.cal9+")", function(err,rows,cols){
      if(err) throw err;
   });
//
var sum = 0.0;
sum = req.query.cal0*1.0 +req.query.cal1*1.0+req.query.cal2*1.0+req.query.cal3*1.0+req.query.cal4*1.0+req.query.cal5*1.0+req.query.cal6*1.0+req.query.cal7*1.0+req.query.cal8*1.0+req.query.cal9*1.0;
var query = connection.query("insert into acc_10 (id, cal_10) values ("+req.query.id+","+sum+")", function(err,rows,cols){
      if(err) throw err;
   }); 
//
	res.json({id:req.query.id, accX:req.query.accX9, accY:req.query.accY9, 
		accZ: req.query.accZ9, status:"ok", time:getDate()});

})
app.get('/data100', function (req, res) {
	var query = connection.query("insert into acc_100 (id, cal_100) values ("+req.query.id+","+req.query.cal_100+")",
	function(err,rows,cols){
		if(err) throw err;
	});
	res.json({id:req.query.id, cal_100:req.query.cal_100, status:"ok", time:getDate()});
})
app.get('/watchdog', function (req, res) {
	var html = fs.readFile('./graph.html', function (err, html) {
	html = " "+ html
	console.log('read graph.html');
	if (req.query.id == '') var qstr = 'select * from acc_10 where time >= date_sub(NOW(), interval 24 hour)';
	else var qstr = 'select * from acc_10 where time >= date_sub(NOW(), interval 24 hour) and id = ' + req.query.id;
	//else var qstr = 'select * from acc_100 where id = ' + req.query.id;
		connection.query(qstr, function(err, rows, cols) {
		if (err) throw err;
		//need to be selected from database
		//idlex = XXXXX; idley = YYYYY; idlez = ZZZZZ;
		//idle accelarometer value
		var data = "";
		var comma = "";
		for (var i=0; i< rows.length; i++) {
			r = rows[i];
			data += comma + "[new Date("+r.time.getFullYear()+","+r.time.getMonth()+","+r.time.getDate()+","+r.time.getHours()+","+r.time.getMinutes()+","+r.time.getSeconds()+"),"+r.cal_10+"]";
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
		set = 'select * from acc_100 where time >= date_sub(NOW(),interval 24 hour)';
	else set = 'select * from acc_100 where time >= date_sub(NOW(),interval 24 hour) and id = ' + req.query.id;
	connection.query(set,function(err,rows,cols){
		if(err) throw err;
		for(i=0;i<rows.length;i++){
			tmp.id = rows[i].id;
			//tmp.accX = rows[i].accX;
			//tmp.accY = rows[i].accY;
			//tmp.accZ = rows[i].accZ;
			tmp.cal = rows[i].cal_100;
			tmp.time = rows[i].time;
			t[i] = tmp;
			tmp={};
		}
		res.json(t);
	
	});
})
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

