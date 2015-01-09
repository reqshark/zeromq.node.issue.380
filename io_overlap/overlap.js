
//some setup
var fs = require('fs')
var spawn = require('child_process').spawn
var zmq = require('../zeromq.node.module')
var push = zmq.socket('push')
var addr = 'tcp://127.0.0.1:55555'

var pull_qty = require('os').cpus().length, i=0
if(fs.existsSync('logs')){
  if(fs.existsSync('logs/conns.log')){
    var conns = fs.readFileSync('logs/conns.log','utf8').split('\n'),ci=0
    fs.unlinkSync('logs/conns.log')
    while(ci<=conns.length){
      var line=conns[ci]
      if(line){
        var ident = line.split(': ')[1]
        fs.unlinkSync('logs/msgs'+ident+'.log')
        fs.unlinkSync('logs/count'+ident+'.log')
      }
      ci++;
    }
  }
} else {
  fs.mkdirSync('logs')
}

//where cores are abundant i'd rather have fewer workers
if(pull_qty>3)pull_qty-=3

while(i<pull_qty){
  
  spawn('node', ['pull'], {
    //share a readable/writable stream 
    //that refers to shell ttys of the child process
    stdio: 'inherit'
  })
  
  i++
}

//workers get a chance to connect first
//set some amount of messages to send
var number = 2147483647

push.bindSync(addr)

while(i < number){
  push.send('give some i/o trigger:'+number)
  i++;
}