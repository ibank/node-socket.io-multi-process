var redis 	= require("socket.io/node_modules/redis"),
    config  = require('./config');

process.send({cmd: 'benchAddProcess', pid: process.pid});

/* Connect to redis store */
var RedisStore = require('socket.io/lib/stores/redis'), 
	pub    	   = redis.createClient(config.io.redis.port, config.io.redis.host), 
    sub    	   = redis.createClient(config.io.redis.port, config.io.redis.host), 
    client 	   = redis.createClient(config.io.redis.port, config.io.redis.host);

/* Start socket.io */
var io = require('socket.io').listen(config.io.listen.port, {'store': new RedisStore({redisPub: pub, redisSub: sub, redisClient: client})});

io.configure(function() {
	
	io.enable('browser client minification');
	io.enable('browser client etag');
	io.enable('browser client gzip');
	
	io.set('log level', 1);
	io.set('heartbeats', true);
	io.set('close timeout', 120);
	io.set('heartbeat timeout', 120);
	io.set('heartbeat interval', 40);
	io.set('polling duration', 40);
	io.set('transports', ['websocket']);
});

process.send({cmd: 'benchAddUser', pid: process.pid});

/* Listen to incoming connections */
io.sockets.on('connection', function (socket) {
	
	var data = {user_id : 0};
	
	/* Store user data, we need it before user gets disconnected */
	socket.on('data', function(transportData) {
	
		data = transportData;
		
		//logger.info('Connection from user_id: '+ data.user_id);
				
		data.session_start = Math.round(new Date().getTime() / 1000);
	});

	/* Listen to disconnect */
	socket.on('disconnect', function () {

		//logger.info('Disconnected user_id: '+ data.user_id);
		
		/* User session (connection) duration */
		var duration = Math.round(new Date().getTime() / 1000) - data.session_start;
	});
});