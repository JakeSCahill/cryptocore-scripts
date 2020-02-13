#!/usr/bin/env node

const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')
const port = new SerialPort("/dev/ttyS0", { baudRate: 115200 })
const parser = new Readline()

port.pipe(parser)

//parser.on('data', line => console.log(`> ${line}`))

parser.on('data', function(data) {
    console.log(data);
    port.close(function() {});
  });
var myArgs = process.argv.slice(2);

//console.log(myArgs[0])

port.write(myArgs[0])
port.write("\r")

