# ivan

A simple templating language that compiles to static HTML, CSS and JS

## Why?

I needed a simple templating language to create my website, and looked around, but was unsatisfied with the complexity of available options. I needed a language that satisfied all my needs, while being so simple that compiling only required one command and no setup. I wanted to be able to deploy my site on Github Pages, since it's easy and built into Github.

## How?

**Ivan** is a simple templating language similar to HAML, but supports some cool features along the lines of CSS-in-JS (here: CSS-in-Ivan 😉). Currently not a lot of features are implemented, but I am working on it.

A simple Ivan page looks like this:

```
component Main: div
  background-color: blue;

component Text: p
  color: white;

head
  title: Gustav's website

body
  Main id="main"
    Text: I'm some text
    Text: I'm some other text
```

And is compiled to this:

```html
<!DOCTYPE html>
<html>

<head>
  <title>Gustav's website</title>
  <style>
    .Main_xs3zk_G30B {
      background-color: lightblue;
    }

    .Text_9I5KnvXME_ {
      color: white;
    }
  </style>
</head>

<body>
  <div id="main" class="Main_xs3zk_G30B">
    <p class="Text_9I5KnvXME_">I'm some text</p>
    <p class="Text_9I5KnvXME_">I'm some other text</p>
  </div>
</body>

</html>
```

The next thing I'm working on, is importing code in files (to support code reuseability) and also embedding scripts (to be executed in client).

## Local development

Clone this repo. Then, standing at the dir root, run `yarn` to install modules and then build the site using `yarn build`

Feel free to take a look at the code.
