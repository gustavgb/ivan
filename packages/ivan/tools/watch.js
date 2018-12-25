const fs = require('fs-extra')
const { spawn } = require('child_process')

fs.emptyDirSync('lib')

const ls = spawn('babel', ['src', '--out-dir', 'lib', '--watch'])

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`)
})

ls.stderr.on('data', (data) => {
  console.log(`stderr: ${data}`)
})

ls.on('close', (code) => {
  console.log(`child process exited with code ${code}`)
})
