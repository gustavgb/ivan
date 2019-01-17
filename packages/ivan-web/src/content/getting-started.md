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

The CLI assumes that you have placed the source code within a folder simply named *src* at the project root. Otherwise, use the **--src** flag.



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
    title: My first IVAN site
  body
    h1: Welcome to my website!
    p: Glad to have you here.
```

Notice the use of indentation to describe parent/children. The root (zero indentation) is important, as it determines the *component type*.

Here we use a *page* component. It tells the compiler to look here first, when building the page. Therefore, you are only allowed to have one page component.

The page component has children.

If you have written any HTML, this example above should be rather simply, as IVAN relies on the same tag names as seen in HTML.

## Let's compile

Try to write the above example and save it to *src/pages/index.ivan*. Then, standing at the root, run

```
ivan build
```

Try to take a look in the *dist* folder. You should find *index.html*, which looks like (or very similar to) this

```
<!DOCTYPE html>
<html>
  <head>
    <title>My first IVAN site</title>
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

Adding styles is very simple in IVAN. It is done through what we call *style components*. Take a look:

```
style MyStyleComponent: a href="http://foo.bar"
  background-color: blue

  &,
  & > *
    color: white
```

We use the *style* keyword to tell the compiler that we wish to define a style component. Every style component must have a name. Note that all component names are always uppercase first letter. Following the colon, is the *element type* that is associated with this style component.

Notice that style components define a local stylesheet, which is compiled according to the [sass indented syntax](http://sass-lang.com/documentation/file.INDENTED_SYNTAX.html).

Save this file in the source folder, perhaps inside components/ and call it whatever you like. In IVAN, file names are only for the sake of the developer.

## Importing and exporting components

In order to use the component, let's export it. Add an export statement to the style declaration:

```
export style MyStyleComponent: a href="http://foo.bar
```

Then import it. Return to *index.ivan* and add

```
import MyStyleComponent
```

Then replace wrapped the content in this component:

```
import MyStyleComponent

page
  head
    title: My first IVAN site
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
    title: My first IVAN site
  body
    MyStyleComponent
      h1: Welcome to my website!
      p: Glad to have you here.
      MyLayoutComponent
        :This is a reuseable component, and I like it!
```

Try to compile this and take a look at the result.

## How about some markdown?

It's possible to simplify text using selectors from markdown, such as `*italic*` or `**bold**` or `[Link](url)`. For example you could highlight part of the layout component's body:

```
MyLayoutComponent
  :This is a reuseable component, and I **like** it!
```

## Markdown file support

Taking markdown integration further, you can import markdown files in your project. Place these anywhere but inside your *pages* folder.

For example create a markdown file called `faq.md` and place it in *src/content*

```
---
name: FaqMarkdown
---

# Frequently asked questions

Why does IVAN rock?

Simple. Because it makes your life easier.
```

Notice the use of meta tags. Each markdown file *must* have a name property to let the compile know how to import it.

Then import it using regular import statements.

```
import FaqMarkdown

page
  body
    FaqMarkdown
```

You might want to wrap the markdown element in a style component that adds styling to the output.

## What's next?

Right now I think I have reached a threshold for actually using and testing IVAN, but of course there are many more things to add. Do you have any ideas? Please let me know! Write an email to me at [hello@gustavgb.com](mailto:hello@gustavgb.com).

Good luck with IVAN!
