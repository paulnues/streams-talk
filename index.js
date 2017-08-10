'use strict'

const program = require('commander')
const lib = require('./lib')

// Mapped functions for use cases
const USE_CASES = {
    'case1': lib.case1,
    'case2': lib.case2,
    'case3': lib.case3,
    'case4': lib.case4,
}

// Program arguments
let argUseCase

// Set up command-line interface
program
    .version('0.1.0')
    .arguments('<use_case>')
    .action((useCase) => {
        argUseCase = useCase
    })
    .on('--help', () => {
        console.log('  Examples:')
        console.log('')
        console.log('    Run Case 1')
        console.log('')
        console.log('    $ npm run go case1')
        console.log('')
    })
    .parse(process.argv)


/**
 * Main program
 */
function main() {
    if (!USE_CASES[argUseCase]) {
        console.log('Undefined case: ' + argUseCase)
        process.exit(-1)
    }

    USE_CASES[argUseCase]()
}

main()
