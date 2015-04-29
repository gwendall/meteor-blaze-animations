Meteor Template Animations
==========================

A simple API to animate DOM elements with Meteor.  
[Demo](http://template-animations.meteor.com)

Installation  
------------

``` sh
meteor add gwendall:template-animations
```

Details
-------

This package dynamically sets classes to DOM elements whenever they get inserted or removed.  
Based on another [simple wrapper for uihooks](http://github.com/gwendall/meteor-ui-hooks).


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

``` css
@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }  
}

@keyframes fadeOut {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }  
}

.fade-in {
  animation-name: fadeIn;
  animation-duration: .3s;
}

.fade-out {
  animation-name: fadeOut;
  animation-duration: .3s;
}
```
