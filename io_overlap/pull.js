//help js out on the date obj
require('./datehelp')

var fs = require('fs')
var zmq = require('../zeromq.node.module')
var addr = 'tcp://127.0.0.1:55555'

var pull = zmq.socket('pull')
pull.identity = 'pull'+process.pid
pull.connect(addr)

log('logs/conns.log','connected: '+pull.identity,'a')

var notPending = 0, recvd = 0, recvdms_since_standard_epoch, msg_io_latency=0

pull.on('error', function(err){
  log('err.log','pull with PID '+process.pid+' errored out')
  //might want to reconnect this pull socket
})

pull.on('message', function (msg){
  recvdms_since_standard_epoch = Date.now()
  recvd++;
  msg = String(msg)
  log('logs/msgs'+pull.identity+'.log',msg,'a')
  var withPrepWorkAmount = parseInt(msg.split(':')[1])
  work(withPrepWorkAmount)
})

function work(n){
  var this_jobs_recvdms = recvdms_since_standard_epoch
  var i = 0
  var r = Math.floor(Math.random()*1000)
  var reduce = reduction(Math.floor(n/r))
  while(i <= reduce){
    //performing some time or resource intensive task
    //logging a random int under a hundred thousand shouldn't take too long
    var logmsg = 'loop_position: '+i+' msgs_recvd: '+recvd+'  |  '
      +' i/o overlap: '+(recvd-notPending)+'  |  '
      +' i/o latency: '+msg_io_latency+'ms'
    log('logs/count'+pull.identity+'.log', logmsg, 'a')
    if(i==reduce){
      ++notPending
      msg_io_latency = Date.now()-this_jobs_recvdms
    }
    i++
  }
}

function log(file,msg,flag) {
  var data = new Date().t()+' '+msg+'\n'
  if(flag == 'a')
    fs.appendFileSync(file, data)
  else
    fs.writeFileSync(file, data)
}

function reduction(r){
  if(r>4500000)r = 2000000
  return Math.floor(r/100)
}