var processes = {},
	exec    = require('child_process').exec;

exports.create = function(process_id){
	

			
	return(this);
};

exports.addUser = function (process_id) {
	
	//console.log(processes.process_id);
}

exports.log = function () {

	console.log(processes);
	
/*
	for (var i=0; i<processes.length; i++) {
		
		var child = exec("ps -v " + processes[i] + " | grep " + processes[i], function(error, stdout, stderr) {
			
			var s = stdout.split(/\s+/);
			
			var cpu = s[10],
				memory = s[11],
				pid = s[0];
						
			var l = [
				'Node PID: ' + pid,
				'CPU: ' + cpu,
				'Mem: ' + memory,
				];
				
			console.log(l.join(',\t'));
		});	
	}
*/
	
/*
				'U: ' + users[process.pid],
				'Tuss: ' + total_users[process.pid]
				'M/R: ' + countReceived[process.pid],
				'M/S: ' + countSended[process.pid],
*/
		
	
}


/*

*/

/*

var users = [],
	total_users = [],
	countReceived = [],
	countSended = [];
*/