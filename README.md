Meteor Template Animations
==========================

A simple API to animate DOM elements with Meteor

Installation  
------------

``` sh
meteor add gwendall:template-animations
```

Details
-------

This package dynamically sets classes to a DOM element whenever it gets inserted or removed from the DOM.


Example
-------  

``` javascript

Template.layout.animations({
  ".item": {
    container: ".container", // container of the ".item" elements
    in: "fade-in", // class applied to inserted elements
    out: "fade-out" // class applied to removed elements
  }
});

Items = new Mongo.Collection("items");
Items.insert({ title: "foo" });

Template.layout.helpers({
  items: function() {
    return Items.find();
  }
});

```

``` html
<template name="layout">
  <div class="container">
    {{#each items}}
      <div class="item">{{title}}</div>
    {{/each}}
  </div>
</template>
```
