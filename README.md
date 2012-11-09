Run your socket.io application in multiple processes
====================================================

Run your socket.io application in multiple processes with Cluster and Redis.


Application
-----------

* `app.js` - Your application
* `cluster.js` - Run this code to start your application
* `config.json` - Configuration parameters

Benchmark
---------

* `benchmark/config.json` - Configuration parameters (how many users, rampup etc)
* `benchmark/spawn_clients.js` - Spawn clients to your node application
* `benchmark/track.js` - App to store benchmark data

How to use
----------

Start your node application
`$ node cluster`

Your application should be up and running.

Spawn clients to your application
`$ node spawn_clients`

---

*Work in progress*