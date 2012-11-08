var cluster = require("cluster"),
	numCPUs = require('os').cpus().length || 4;

cluster.setupMaster({
  exec : "app.js",
  silent : false
});

if (cluster.isMaster) {

	var bench = require('./benchmark/server');
	
	function messageHandler(msg) {
	
		if (msg.cmd == 'benchAddProcess') {
			
			bench.create(msg.pid);
		}
		
		if (msg.cmd == 'benchAddUser') {
			
			bench.addUser(msg.pid);
		}
	}
	
	setInterval(function() {
		
		bench.log();
	}, 1500);

	// Fork workers.
	for (var i = 0; i < numCPUs; i++) {
		
		cluster.fork();
	}
	
	Object.keys(cluster.workers).forEach(function(id) {
	
		cluster.workers[id].on('message', messageHandler);
	});

	cluster.on('exit', function(worker, code, signal) {
		console.log('worker ' + worker.process.pid + ' died');
	});
} else {
	
	
}