'use strict'

const fs = require('fs')

const Readable = require('readable-stream').Readable
const Writable = require('readable-stream').Writable
const Transform = require('readable-stream').Transform

// Sample content
const CONTENT = 'Hello there, I am data coming out of the readable'.split(' ')


/**
 * Readable implementation which produces canned data for
 * demonstrations.
 */
class MyContent extends Readable {
    constructor(opts) {
        opts = opts || {}
        opts.objectMode = true
        super(opts)

        this._index = 0
    }

    _read() {
        let word = CONTENT[this._index++]
        console.log('Pushing word: ' + word)
        this.push(word)

        if (this._index == CONTENT.length) {
            // Pushing null indicates that data will
            // no longer be offered by Readable.
            this.push(null)
        }
    }
}


/**
 * Writable implementation that demonstrates when cleanup
 * happens for a Writable.
 */
class MyOutput extends Writable {
    constructor(opts) {
        opts = opts || {}
        opts.objectMode = true
        super(opts)
    }

    _write(chunk, encoding, callback) {
        callback(null)
    }

    _final(err, callback) {
        console.log('final called. writable is DONE')
    }
}


/**
 * Transform implementation that X's out every word that is
 * passed through this filter.
 */
class Xer extends Transform {
    constructor(opts) {
        opts = opts || {}
        opts.objectMode = true
        super(opts)
    }

    _transform(chunk, encoding, callback) {
        let len = chunk.length
        this.push('X'.repeat(len) + '\n')
        callback(null)
    }

    _flush(callback) {
        console.log('flush called. transform is DONE')
        callback(null)
    }
}


/**
 * Transform implementation that X's out every word that is
 * passed through this filter.
 */
class ToUpper extends Transform {
    constructor(opts) {
        opts = opts || {}
        opts.objectMode = true
        super(opts)
    }

    _transform(chunk, encoding, callback) {
        let len = chunk.length
        this.push(chunk.toUpperCase() + '\n')
        callback(null)
    }

    _flush(callback) {
        console.log('flush called. transform is DONE')
        callback(null)
    }
}


/**
 * Case 1: Output results to stdout.
 */
function case1() {
    console.log('Use Case 1: Piping output to stdout')
    let faucet = new MyContent()
    let filter = new Xer()

    console.log('----------------------')
    console.log('Produced content is:')
    console.log(CONTENT)
    console.log('----------------------')
    faucet.pipe(filter).pipe(process.stdout)
}


/**
 * Case 2: Output results to file.
 */
function case2() {
    console.log('Use Case 2: Piping output to a file called output.txt')
    let faucet = new MyContent()
    let filter = new Xer()
    let ws = new fs.createWriteStream('output.txt')

    console.log('----------------------')
    console.log('Produced content is:')
    console.log(CONTENT)
    console.log('----------------------')
    faucet.pipe(filter).pipe(ws)
}


/**
 * Case 3: Output results to a custom Writable.
 */
function case3() {
    console.log('Use Case 3: Piping output to custom Writable')
    let faucet = new MyContent()
    let filter = new Xer()
    let sink = new MyOutput()

    console.log('----------------------')
    console.log('Produced content is:')
    console.log(CONTENT)
    console.log('----------------------')
    faucet.pipe(filter).pipe(sink)
}


/**
 * Case 4: Output results but in uppercase.
 */
function case4() {
    console.log('Use Case 4: Piping uppercase output to stdout')
    let faucet = new MyContent()
    let filter = new ToUpper()

    console.log('----------------------')
    console.log('Produced content is:')
    console.log(CONTENT)
    console.log('----------------------')
    faucet.pipe(filter).pipe(process.stdout)
}


// Exported example functions
exports.case1 = case1
exports.case2 = case2
exports.case3 = case3
exports.case4 = case4

