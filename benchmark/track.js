var processes = [],
	exec    = require('child_process').exec;

exports.create = function(process_id){
	
	processes.push({'pid': process_id, 'users': 0});
};

exports.addUser = function (process_id) {

	for (var i=0; i<processes.length; i++) {
		
		if (processes[i].pid == process_id) {
			
			processes[i].users++;
		}
	}
}

exports.removeUser = function (process_id) {

	for (var i=0; i<processes.length; i++) {
		
		if (processes[i].pid == process_id) {
			
			processes[i].users--;
		}
	}
}

exports.log = function () {
	
	for (var i=0; i<processes.length; i++) {
		
		var child = exec("ps -v " + processes[i].pid + " | grep " + processes[i].pid, function(error, stdout, stderr) {
			
			var s = stdout.split(/\s+/);
			
			var cpu = s[10],
				memory = s[11],
				pid = s[0];
			
			for (var i=0; i<processes.length; i++) {
				
				if (processes[i].pid == s[0]) {
				
					processes[i].cpu = cpu;
					processes[i].memory = memory;
				}
			}
		});
	}
	
	return processes;
}