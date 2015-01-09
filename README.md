# zeromq.node.issue.380
issue number 380 about puller io https://github.com/JustinTulloss/zeromq.node/issues/380

```bash
$ git clone https://github.com/reqshark/zeromq.node.issue.380 issue.380
$ cd issue.380/zeromq.node.module && make && cd ../io_overlap
$ node overlap.js
```

### how to run this scenerio

disclaimer: nothing under the hood being looked at. I haven't even started profiling the runtime yet.

if you're doing this locally, shut down stuff you don't need so we can observe some decent system load. hopefully you have a multicore processor to test this on.

make `npm i` with good `gyp` action on the release, and then you'll want to hop into the `io_overlap` dir to bring together our mocked up producer/consumer script scenerio 

after `cd`ing into `io_overlap` go ahead and run

```js
$ node overlap
```
the first part of the script will look at your machine's cpu lineup and decide how many cores to facilitate for workers distributed across connected `pulls`. 

then if needed, cleanup old logs.

### how the logs are setup

connection logs and i/o tasks are the main ones you'll want use. since it may be the first time, it will just make these without caring about cleaning up and unlinking what's not there.

consumers get called up first then connections are made. `overlap.js` push socket attempts to loop a couple billion messages at all `pull` sockets immediately after a synchronous `bind()`

open a few more shell tabs and move into the new `logs` dir created from your current dir `io_overlap`

verify the existence of the new logs. then while `overlap.js` is running i would start with something like:

```bash
$ tail -f countpull*****.log
```
you can definitely run `tail -f` on the msgpull logs but that's uninteresting.

the count logs are going to give us key details about what's going on inside the pull socket's callback.

worker task i/o completion status is counting upward on `loop_position`
before even starting the work we log `msgs_recvd`, which is used to compare `i/o overlap`

if `emit` is firing `onmessage` events faster than work could be performed inside the callback then i would consider that firing of emit an overlap value of 1 for each call to emit in advance of task completion. 

There's a very complex mathematical subtraction operation going on at the end of the worker's loop to compare the value of jobs against the number of calls to `onmessage`. haha ya `a minus b`

Finally, some i/o latency gets measured for the amount time spent working on the task before returning flow control for more event listening. this figure wont start to appear until at least one job completes.

```bash
FTL.
```
<sub>*[license info](http://ftlard.org)*</sub>