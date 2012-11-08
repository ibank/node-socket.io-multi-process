var io      = require('socket.io-client'),
    config  = require('./config.json');

if (typeof config != 'object') {

    console.log('failed parsing conf'); return;
}

var max_users = parseInt(config.max_users);
var rampup_users = parseInt(config.rampup_users);
var rampUpTime = parseInt(rampup_users / parseInt(config.rampup_rate));
var rampupTimeout = rampUpTime / rampup_users;
var count_spawns = 0;

function user(host, port) {

    if (count_spawns >= parseInt(config.max_users)) {
    
    	console.log('reached limit of '.config.max_users);
        return;
    }

    count_spawns ++;

    var socket = io.connect('http://' + host + ':' + port, {'force new connection': true});

    socket.on('connect', function() {

        var user_id = Math.floor(Math.random()*(config.user_id.to-config.user_id.from+1)+config.user_id.from);

        // emit data to nodejs application
        socket.emit('data', {'user_id' : user_id});

        var disconnectAfter = Math.floor(Math.random()*(parseInt(config.user_ttl.max)-parseInt(config.user_ttl.min)+1)+parseInt(config.user_ttl.min));

        setTimeout(function() {

            count_spawns--;
            socket.disconnect();
        }, disconnectAfter * 1000);

        console.log('spawned user_id: '+user_id+' - kill in '+(parseInt(disconnectAfter))+' seconds');
    });
}

for(var i=0; i<rampup_users; i++) {
	
    setTimeout(function() {
    
    	user(config.host, config.port); 
    }, i * rampupTimeout * 100);
}

var step_two = function() {

    console.log('ramped up to '+rampup_users+' users, now adding up to max. '+max_users+' on disconnects');
    
    setInterval(function(){
        
        user(config.host, config.port);
    }, parseInt((1/config.connection_rate) * 1000));
}

//setTimeout(step_two, rampUpTime * 1000);
