var getTplName = function(tpl) {
  return tpl.viewName.slice(-(tpl.viewName.length - "Template.".length));
}

var animateIn = function(classIn, element) {
  // Hide the element before inserting to avoid a flickering when applying the "in" class
  element.hide().removeClass(classIn);
  Tracker.afterFlush(function() {
    element.show().addClass(classIn);
  });
}

var animateOut = function(classOut, element) {
  element.addClass(classOut);
  element.onAnimationEnd(function(animationName) {
    element.remove();
  });
}

var animateInitialElements = function(tplName, animations) {
  _.each(animations, function(attrs, selector) {
    if (!attrs.animateInitial) return;
    Template[tplName].onRendered(function() {
      $(selector, attrs.container).each(function(i) {
        var element = $(this);
        var timeout = attrs.animateInitialStep * i || 0;
        element.hide();
        Meteor.setTimeout(function() {
          animateIn(attrs.in, element);
        }, timeout);
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
        var $node = $(node);
        $node.insertBefore(next);
        animateIn(attrs.in, $node);
      },
      remove: function(node) {
        var $node = $(node);
        if (!attrs.out) return $node.remove();
        $node.removeClass(attrs.in);
        animateOut(attrs.out, $node);
      }
    }
  });
  return hooks;
}

Template.prototype.animations = function(animations) {
  var tpl = this;
  var tplName = getTplName(tpl);
  var hooks = getUiHooks(animations);
  Template[tplName].uihooks(hooks);
  animateInitialElements(tplName, animations);
};
