---
name: GettingStartedContent
---

# Getting started (work in progress)

The first thing you want to do, is to install the package using either npm or yarn:

```
npm install @gustavgb/ivan | yarn add @gustavgb/ivan
```

To use IVAN from the commandline, run:

```
ivan build --src path/to/src
```

Good job! We're now able to compile IVAN code. Next, we'll explore a simple example.

## A simple example

A simple index.ivan can look like this:

```
page
  head
    title: My first IVAN site
  body
    h1: Welcome to my website!
    p: Glad to have you here.
```

A few things are going on. First of all we introduce the first component, *page*, which needs to be included in every page file (more on this later). The page component is effectively the root of the webpage. Everything on the website is rendered because it's a child of the page component. Each page can only have one page component.

Next we notice that the page component has two direct children. These are *head* and *body*. Notice that a page component can have any number of children. But these children are not chosen randomly. These are actually the `<head>` and `<body>` tags from the HTML language. As we dive into IVAN, you will notice that it is very similar to HTML. Hence, every IVAN page is compiled to an HTML file.

*head* and *body* also have children. Try to guess what these do. If you have written any HTML, you probably know the answer.

Let's take a look at the compiled file.

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

As you can see, there is a direct correlation between the keywords used in the source file and the tags that appear in the compiled file. Notice that the compiled file is automatically wrapped with `<html>` tags preceded with a !doctype declaration.

In order to compile the file locally, I recommend using the following file structure:

```
src/
├── pages/
│   └── index.ivan
├── static/
└── components/
```

The source folder can be named anything you want. This can be specified, when compiling the source code, but the compiler defaults to "src", and that is what this guide will use. The source folder contains *all* the files we want to compile. We refer to this scope as the *assembly*.

The source folder must contain at least one folder in order for the compiler to work: pages. Inside pages, you can place the entry files, one for each url/route. The file structure inside this directory is mapped to the output directory, so that you can create routing patterns using the file structure inside this directory. Every entry file must contain a page component, which we introduced above. Save the example above as index.ivan inside the pages directory.

Optionally the source folder can include a folder called "static". This folder is not compiled, and every file inside it is copied to the output directory. This folder is useful for hosting images and/or adding a favicon.

The last folder is completely optional. In this case we choose to call it "components", because we will use it to contain reusable components, but any other name could have been chosen. In addition to the components folder, you can add any folder you like. Some examples could be a "mixins" folder, to contain style/inject mixins. More on this later.

## Compile your first IVAN project

When you have saved the example code to index.ivan, you are ready to compile the code. Standing at the root of your project, run (either though a global installation of IVAN or through package scripts):

```
ivan build --src src
```

If, like in this case, the source folder is named "src", you can exclude the flag. The output directory is called "dist" and will be placed at the root of your project. Inside this folder, you should see one file called "index.html". This will be the compiled page.

Optionally use `ivan watch` to watch for file changes.

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

We use the *style* keyword to tell the compiler that we wish to define a style component. Every style component must have a name. Note that all component names are always uppercase first letter.

The component statement is divided by a colon, which separates the statement into the *command* and the *body*. The command includes the necessary information in order to define the component, such as the type of component and the name associated with the component. The body often includes information about which element the component renders. These elements are always regular HTML elements. As you can see from this example, it is possible to add default attributes to the component. Attributes can also be added, when consuming the component. More on this later.

Notice that style components define a local stylesheet, which is compiled according to the [sass indented syntax](http://sass-lang.com/documentation/file.INDENTED_SYNTAX.html).

Save this file in the source folder, perhaps inside components/ and call it what you like. In IVAN, file names are only for the sake of the developer.

## Importing and exporting components

*Coming soon...*
