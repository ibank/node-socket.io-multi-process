var cluster = require('cluster'),
    redis 	= require("socket.io/node_modules/redis"),
    numCPUs = require('os').cpus().length || 4,
    exec    = require('child_process').exec;

/* begin benchmark logic */	
var users = [],
	total_users = [],
	countReceived = [],
	countSended = [];
/* end benchmark logic */	

/* Master, start fork processes */
if (cluster.isMaster) {

	for (var i = 0; i < numCPUs; i++) {
	
		cluster.fork();      
	}

/* Fork processes */
} else {

	/* Connect to redis store */
    var RedisStore = require('socket.io/lib/stores/redis')
        , pub    = redis.createClient()
        , sub    = redis.createClient()
        , client = redis.createClient();

    /* Start socket.io */
	var io = require('socket.io').listen(5000, {
		'store' :new RedisStore({
		redisPub : pub
		, redisSub : sub
		, redisClient : client
		})
	});

	io.enable('browser client minification');
	io.enable('browser client etag');
	io.enable('browser client gzip');
	
	io.set('log level', 1);
	io.set('heartbeats', true);
	io.set('close timeout', 120);
	io.set('heartbeat timeout', 120);
	io.set('heartbeat interval', 25);
	io.set('polling duration', 40);
	io.set('transports', ['websocket']);
		
	/* begin benchmark logic */	
	function roundNumber(num, precision) {
	
	  return parseFloat(Math.round(num * Math.pow(10, precision)) / Math.pow(10, precision));
	}
	
	users[process.pid] = 0;
	total_users[process.pid] = 0;
	countReceived[process.pid] = 0;
	countSended[process.pid] = 0;
	
	setInterval(function() {
	
		/* Unix (ubuntu tested) 
		 *
		 * "ps -p " + process.pid + " | grep " + process.pid
		 *
		 * Mac OS X tested
		 * ps -v " + process.pid + " | grep " + process.pid
		*/
		var child = exec("ps -v " + process.pid + " | grep " + process.pid, function(error, stdout, stderr) {
			
			var s = stdout.split(/\s+/);
			var cpu = s[10],
				memory = s[11];
						
			var l = [
				'NodeID: ' + process.pid,
				'U: ' + users[process.pid],
				'M/R: ' + countReceived[process.pid],
				'M/S: ' + countSended[process.pid],
				'CPU: ' + cpu,
				'Mem: ' + memory,
				'Tuss: ' + total_users[process.pid]
				];
			
			console.log(l.join(',\t'));
		});
	
	}, 3000);
	/* end benchmark logic */
	
	/* Listen to incoming connections */
	io.sockets.on('connection', function (socket) {
		
		/* Benchmark */
		users[process.pid]++;
		total_users[process.pid]++;
	
		var data = {user_id : 0};

		/* Store user data, we need it before user gets disconnected */
		socket.on('data', function(transportData) {
		
			data = transportData;
			
			//logger.info('Connection from user_id: '+ data.user_id);
			
			/* Benchmark */
			countReceived[process.pid]++;
			
			data.session_start = Math.round(new Date().getTime() / 1000);
		});
	
		/* Listen to disconnect */
		socket.on('disconnect', function () {
	
			//logger.info('Disconnected user_id: '+ data.user_id);
			
			/* User session (connection) duration */
			var duration = Math.round(new Date().getTime() / 1000) - data.session_start;
			
			/* Benchmark */
			countSended[process.pid]++;
			users[process.pid]--;
		});
	});
}