const express = require('express')
const app = express()
const port = 8000
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
	var query = connection.query("insert into acc (id, accX, accY, accZ) values ("+req.query.id+","+req.query.accX+","+req.query.accY+","+req.query.accZ+")", function(err,rows,cols){
		if(err) throw err;
	});
	res.json({id:req.query.id, accX:req.query.accX, accY:req.query.accY, 
		accZ: req.query.accZ, status:"ok", time:getDate()});

})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

