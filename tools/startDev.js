const concurrently = require('concurrently')

const args = process.argv.slice(2).join(' ')

concurrently(
  [
    { command: 'yarn serve', name: 'server' },
    { command: 'yarn watch ' + args, name: 'files' }
  ],
  {
    killOthers: ['failure', 'success']
  }
)
