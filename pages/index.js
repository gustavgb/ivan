module.exports = {
  html: {
    head: {
      title: 'Gustav\'s website'
    },
    body: {
      div: [
        'id=main',
        'class=main',
        {
          p: ['class=text', 'Hello world!']
        }
      ]
    }
  }
}
