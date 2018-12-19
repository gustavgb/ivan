const concurrently = require('concurrently')

const args = process.argv.slice(2).join(' ')

concurrently(
  [
    { command: 'serve ./dist', name: 'server' },
    { command: 'yarn watch ' + args, name: 'files' }
  ],
  {
    killOthers: ['failure', 'success']
  }
)
