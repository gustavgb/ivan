---
name: HomepageCode
---

# How?

A simple Ivan page can look like this:

```
style Main: div
  background-color: blue

style Text: p
  color: white

page
  head
    title: Gustav's website
  body
    Main id="main"
      Text: I'm some text
      Text: I'm some other text
```

And is compiled to:

```
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
