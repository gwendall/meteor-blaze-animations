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
    out: "fade-out", // class applied to removed elements
    delayIn: 500, // Delay before inserted items animate
    delayOut: 500, // Delay before removed items animate
    animateInitial: true, // animate the elements already rendered
    animateInitialStep: 200, // Step between each animation for each initial item
    animateInitialDelay: 500 // Delay before the initial items animate
  }
});
```

That's it. All ``.item`` elements that are direct children of the ``.container`` element will be applied a ``fade-in`` class on insert, and a ``fade-out`` class before being removed from the DOM.  

See the [demo](http://github.com/gwendall/meteor-template-animations-demo) code for a complete example.
