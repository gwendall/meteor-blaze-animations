var getTplName = function(tpl) {
  return tpl.viewName.slice(-(tpl.viewName.length - "Template.".length));
}

var animateIn = function(attrs, element) {
  if (!attrs || !element) return;
  // Hide the element before inserting to avoid a flickering when applying the "in" class
  element._opacity = element._opacity || element.css("opacity") || 0;
  element.css({ opacity: 0 });
  element.removeClass(attrs.in);
  var delayIn = attrs.delayIn || 0;
  Tracker.afterFlush(function() {
    setTimeout(function() {
      element.css({ opacity: element._opacity }).addClass(attrs.in);
    }, delayIn);
  });
}

var animateOut = function(attrs, element) {
  if (!attrs || !element) return;
  var delayOut = attrs.delayOut || 0;
  setTimeout(function() {
    element.removeClass(attrs.in).addClass(attrs.out);
  }, delayOut);
  element.onAnimationEnd(function(animationName) {
    element.remove();
  });
}

var animateInitialElements = function(tplName, animations) {
  if (!tplName || !animations) return;
  _.each(animations, function(attrs, selector) {
    if (!attrs.animateInitial) return;
    Template[tplName].onRendered(function() {
      var animateInitialDelay = attrs.animateInitialDelay || 0;
      $(selector, attrs.container).each(function(i) {
        var element = $(this);
        var animateInitialStep = attrs.animateInitialStep * i || 0;
        var delay = animateInitialDelay + animateInitialStep;
        element._opacity = element.css("opacity");
        element.css({ opacity: 0 });
        setTimeout(function() {
          animateIn(attrs, element);
        }, delay);
      });
    });
  });
}

var getUiHooks = function(animations) {
  var hooks = {};
  _.each(animations, function(attrs, selector) {
    hooks[selector] = {
      container: attrs.container,
      insert: function(node, next) {
        var element = $(node);
        element.insertBefore(next);
        animateIn(attrs, element);
      },
      remove: function(node) {
        var element = $(node);
        if (!attrs.out) return element.remove();
        element.removeClass(attrs.in);
        animateOut(attrs, element);
      }
    }
  });
  return hooks;
}

Template.prototype.animations = function(animations) {
  var tplName = getTplName(this);
  var hooks = getUiHooks(animations);
  Template[tplName].uihooks(hooks);
  animateInitialElements(tplName, animations);
};
