//help js out on the date obj
require('./datehelp')

var fs = require('fs')
var zmq = require('../zeromq.node.module')
var addr = 'tcp://127.0.0.1:55555'

var pull = zmq.socket('pull')
pull.identity = 'pull'+process.pid
pull.connect(addr)

log('logs/conns.log','connected: '+pull.identity,'a')

var notPending = 0, recvd = 0, recvdms_since_standard_epoch, async_duration = 3000

pull.on('error', function(err){
  log('err.log','pull with PID '+process.pid+' errored out')
  //might want to reconnect this pull socket
})

pull.on('message', function (msg){
  recvdms_since_standard_epoch = Date.now()
  recvd++; msg = String(msg)
  log('logs/msgs'+pull.identity+'.log',msg,'a')

  //passing off an async handler opens the eventloop
  //socket's onmessage event can receive calls to emit() now
  setTimeout(async,async_duration)
})

function async() {
  notPending++;
  var logmsg = //'async_duration: ' +async_duration
    ' msgs_recvd: '+recvd+' |'
    +' np: '+ notPending + ' |'
    +' i/o overlap: '+ (recvd-notPending)
    //+' msg_async_latency: ' + (Date.now() - recvdms_since_standard_epoch) +'ms'
  log('logs/count'+pull.identity+'.log', logmsg, 'a')
}

function log(file,msg,flag) {
  var data = new Date().t()+' '+msg+'\n'
  if(flag == 'a')
    fs.appendFileSync(file, data)
  else
    fs.writeFileSync(file, data)
}