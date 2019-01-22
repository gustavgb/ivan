---
name: GettingStartedContent
---

# Getting started

Install the package using either npm or yarn:

```
npm install @gustavgb/ivan | yarn add @gustavgb/ivan
```

Usage:

```
ivan build

OR

ivan watch
```

The CLI assumes that you have placed the source code within a folder simply named *src* at the project root. Otherwise, use the **--src** flag. More options found at [npmjs.org](https://npmjs.org/package/@gustavgb/ivan).



## The folder structure

I recommend using the following file structure when starting out:

```
src/
├── pages/
│   └── index.ivan
├── static/
└── components/
```

Place pages (routes) within *pages*, components (hang tight) within *components* and static files (such as favicon.png or assets) within *static*.

## index.ivan

A simple index.ivan can look like this:

```
page
  head
    title: My first Ivan site
  body
    h1: Welcome to my website!
    p: Glad to have you here.
```

Notice the use of indentation to describe parent/child relationships. The root (zero indentation) is important, as it determines the *component type*.

Here we use a *page* component. It tells the compiler to look here first, when building the page. Therefore, you are only allowed to have one page component.

The page component has children.

If you have written any HTML, this example above should be rather simply, as Ivan relies on the same tag names as seen in HTML.

## Let's compile

Try to write the above example and save it to *src/pages/index.ivan*. Then, standing at the root, run

```
ivan build
```

Try to take a look in the *dist* folder. You should find *index.html*, which looks like (or very similar to) this:

```
<!DOCTYPE html>
<html>
  <head>
    <title>My first Ivan site</title>
    <style></style>
  </head>
  <body>
    <h1>Welcome to my website!</h1>
    <p>Glad to have you here.</p>
  </body>
</html>
```

## A recommendation

In order to run the source code locally and view the result in your browser of choice, I recommend using [ivan-dev-server](https://www.npmjs.com/package/@gustavgb/ivan-dev-server), a small development tool I created to help speed things up during development.

## Adding styles to our application

Adding styles is very simple in Ivan. It is done through what we call *style components*. Take a look:

```
style MyStyleComponent: a href="http://foo.bar"
  background-color: blue

  &,
  & > *
    color: white
```

We use the *style* keyword to tell the compiler that we wish to define a style component. Every style component must have a name. Note that all component names are always uppercase first letter. Following the colon, is the *element type* that is associated with this style component.

Notice that style components define a local stylesheet, which is compiled according to the [sass indented syntax](http://sass-lang.com/documentation/file.INDENTED_SYNTAX.html).

Save this file in the source folder, perhaps inside components/ and call it whatever you like. In Ivan, file names are mostly for the sake of the developer.

## Extending style components

Let's assume that you had implemented a component called *TextBase* and wanted to write two descendants of this component called *TextLight* and *TextDark* respectively. You could use style extensions:

```
style TextBase
  font-family: Arimo
  font-size: 1.6rem
  line-height: 2.3rem
  margin: 1.6rem 0

export style TextLight: p
  color: white
  TextBase

export style TextDark: p
  color: black
  TextBase
```

Notice that *TextBase* does not associate itself with any element. Therefore *TextBase* cannot be rendered, but must be extended. If *TextBase* did associate itself with an element, the descendants' element (or lack of) would overwrite the original element.

## Importing and exporting components

In order to use the component, let's export it. Add an export statement to the style declaration:

```
export style MyStyleComponent: a href="http://foo.bar
```

Then import it. Return to *index.ivan* and add

```
import MyStyleComponent
```

Then use this component to wrap the page content:

```
import MyStyleComponent

page
  head
    title: My first Ivan site
  body
    MyStyleComponent
      h1: Welcome to my website!
      p: Glad to have you here.
```

Then start the local development server using `ivan-dev-server` and navigate your browser to *localhost:3000*. Are you seeing something blue?

## Reuse code using modules

Let's define a reuseable code block:

```
layout MyLayoutComponent: div
  div
    h1: Reusability rocks!
    p: !children
```

Notice `!children`. This keyword is replaced by the body defined by the consuming file and lets you create components such as page wrappers and the like.

To use the component, return to your *index.ivan*

```
import MyStyleComponent
import MyLayoutComponent

page
  head
    title: My first Ivan site
  body
    MyStyleComponent
      h1: Welcome to my website!
      p: Glad to have you here.
      MyLayoutComponent
        :This is a reuseable component, and I like it!
```

Try to compile this and take a look at the result.

## Injecting JS or global styles

This is done though *inject components*:

```
inject MyInjectComponent: script type="text/javascript"
  window.addEventListener('load', function onload () {
    console.log('Loaded')
  })
```

Inject components can be rendered and/or exported the same way as any other component.

Adding global styles are similarly easy. Just declare a inject component with the `style` element:

```
inject MyGlobalStyle: style
  body
    background-color: white

    & > *
      box-sizing: border-box

page
  head
    MyGlobalStyle
```

Note that the global style component must be rendered in order to work, even though there is no visible element.

## Extending inject components

Inject components can be extended:

```
inject MyInjectExtension: style
  html
    overflow: hidden

inject MyGlobalStyle: style
  body
    background-color: white

  MyInjectExtension
```

The result will be this:

```
inject MyGlobalStyle: style
  body
    background-color: white

  html
    overflow: hidden
```

## How about some markdown?

It's possible to simplify text using selectors from markdown, such as `*italic*` or `**bold**` or `[Link](url)`. For example you could highlight part of the layout component's body:

```
MyLayoutComponent
  :This is a reuseable component, and I **like** it!
```

Possible selectors are code snippets, bold, italic, links and images.

## Markdown file support

Taking markdown integration further, you can import markdown files in your project. Place these anywhere but inside your *pages* folder.

For example create a markdown file called `faq.md` and place it in *src/content*

```
---
name: FaqMarkdown
---

# Frequently asked questions

Why does Ivan rock?

Simple. Because it makes your life easier.
```

Notice the use of meta tags. Each markdown file *must* have a name property to let the compiler know how to import it.

Then import it using regular import statements.

```
import FaqMarkdown

page
  body
    FaqMarkdown
```

You might want to wrap the markdown element in a style component that adds styling to the output.

## What's next?

Right now I think Ivan have reached a threshold for actually being usable and testable, but of course there are many more things to add. Do you have any ideas? Please let me know! Write an email to me at [hello@gustavgb.com](mailto:hello@gustavgb.com).

Good luck with Ivan!
