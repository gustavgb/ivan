# ivan

A simple markup language that compiles to static HTML, CSS and JS

## Why?

I needed a simple markup language to create my website, and looked around, but was unsatisfied with the complexity of available options. I needed a language that satisfied all my needs, while being so simple that compiling only required one command and no setup. I wanted to be able to deploy my site on Github Pages, since it's easy and built into Github, which meant that I had to use a static site.

## How?

A simple Ivan page can look like this:

```
style Main: div
  background-color: blue;

style Text: p
  color: white;

page
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
    .Mainxs3zk_G30B {
      background-color: lightblue;
    }

    .Text9I5KnvXME_ {
      color: white;
    }
  </style>
</head>

<body>
  <div id="main" class="Mainxs3zk_G30B">
    <p class="Text9I5KnvXME_">I'm some text</p>
    <p class="Text9I5KnvXME_">I'm some other text</p>
  </div>
</body>

</html>
```

Importing and exporting files are also supported. Example:

**/assembly/path/to/dir/footer.ivan**

```
export layout Footer: div
  p: Copyright 2018 Gustav B
  !children
  p
    a href="/": https://gustavgb.github.io
```

**/assembly/path/to/dir/main.ivan**

```
export style Main: div
  background-color: lightblue;
```

**/assembly/path/to/dir/text.ivan**

```
export style Text: p
  color: white;
  font-style: italic;
```

**/assembly/pages/index.ivan**

```
import Text
import Footer
import Main

page
  head
    title: Gustav's website
  body
    Main id="main"
      Text: Index
      a href="/about": Go to about me
    Footer
```

Is compiled to:

```html
<!DOCTYPE html>
<html>

<head>
  <title>Gustav's website</title>
  <style>
    .Text7yY1XrdJ5t {
      color: white;
      font-style: italic;
    }

    .MainAnRZvHtOn2 {
      background-color: lightblue;
    }
  </style>
</head>

<body>
  <div id="main" class="MainAnRZvHtOn2">
    <p class="TextEsTeUpUX_l">Index</p><a href="/about">Go to about me</a>
  </div>
  <div>
    <p>Copyright 2018 Gustav B</p>
    <p><a href="/">https://gustavgb.github.io</a></p>
  </div>
</body>

</html>
```

### A few things to note about the language

* Files are scoped to themselves, so files don't share components and don't have to worry about naming comflicts. Except when using imports and exports.

* Exports and imports feed to and are fed from a global pool of components. This means:

    * Files names don't matter

    * Paths don't matter

    * Export component names **are** important. These are the only identification for an exported file.

* Children are supported in layouts, using the *!children* keyword.

* Styling is added via. *style* componenets, which are rendered as children of *layouts*. If the style is not rendered, the styling is not compiled. Note that styling follows the sass [indented syntax](http://sass-lang.com/documentation/file.INDENTED_SYNTAX.html).

* The language is compiled to HTML and CSS, so all html tags and attributes are supported along with css features are supported, as they are not compiled until runtime. This also means that the language (when compiled) is fully compatible with all browsers that support HTML and CSS. Note: If you use HTML or CSS features that require polyfills or transpilation to work, this language does not solve that.

## Local development

Clone this repo. Then, standing at the dir root, run `yarn` to install modules and then build the site using `yarn workspace example-website build`.
