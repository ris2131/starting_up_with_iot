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

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());



function getDate(){
        var moment = require('moment');
        require('moment-timezone');
        moment.tz.setDefault("Asia/Seoul");
        var date = moment().format('YYYY-MM-DD HH:mm:ss');
        return date;
}

app.get('/', function(req, res) {
        req.query.email = 'qhfl1096@naver.com';
        req.query.stuno = '20151516';
        req.query.time = getDate();
        req.query.ip = req.ip.split(':')[3];
        res.json(req.query);
})

app.get('/data',function(req, res) {
	var query = connection.query("insert into acc (id, accX, accY, accZ) values ("+req.query.id+","+req.query.accX+","+req.query.accY+","+req.query.accZ+")", function(err,rows,cols){
		if(err) throw err;
	});
	res.json({id:req.query.id, accX:req.query.accX, accY:req.query.accY, 
		accZ: req.query.accZ, status:"ok", time:getDate()});

})
app.get('/mypath',function(req,res){
	var t={};
	var tmp={};
	var set;
	var i;
	if(req.query.device_id== '')
		set = 'select * from sensors where time >= date_sub(NOW(),interval 24 hour)';
	else set = 'select * from sensors where time >= date_sub(NOW(),interval 24 hour) and device_id = ' + req.query.device_id;
	connection.query(set,function(err,rows,cols){
		if(err) throw err;
		for(i=0;i<rows.length;i++){
			tmp.sequence_number = rows[i].sequence_number;
			tmp.time = rows[i].time;
			tmp.temperature_value = rows[i].temperature_value;
			tmp.device_id = rows[i].device_id;
			t[i] = tmp;
			tmp={};
		}
		res.json(t);
	
	});
})

app.post('/', function(req, res) {
    r = req.body
    r.ip = req.ip.replace(/^.*:/, '')
    r.time = (new Date()).toFormat("YYYY-MM-DD HH:MI:SS")
    r.email = "qhfl1096@naver.com"
    r.stuno = "20151516"
    console.log(req.body)
    res.send(JSON.stringify(r))
    
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

