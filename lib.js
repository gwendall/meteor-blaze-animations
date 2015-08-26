Anim = {
  insertedClass: 'inserted',
  insertingClass: 'inserting',
  removingClass: 'removing'
};

var getTplName = function(tpl) {
  return tpl.viewName.slice(-(tpl.viewName.length - 'Template.'.length));
};

var getClassInserted = function(attrs, element, tpl) {
  var classInserted = attrs.insert.class || attrs.in;
  if (attrs.in) {
    console.warn('"in" is deprecated. Please use "insert.class" instead.');
  }
  return _.isFunction(classInserted) ? classInserted.apply(this, [element, tpl]) : classInserted;
};

var getClassRemoved = function(attrs, element, tpl) {
  var classRemoved = attrs.remove.class || attrs.out;
  if (attrs.out) {
    console.warn('"out" is deprecated. Please use "remove.class" instead.');
  }
  return _.isFunction(classRemoved) ? classRemoved.apply(this, [element, tpl]) : classRemoved;
};

var animateInserted = function(attrs, element, tpl) {
  if (!attrs || !element) return;
  var el = _.clone(element.get(0));
  var classInserted = getClassInserted(attrs, el, tpl);
  // Hide the element before inserting to avoid a flickering when applying the 'in' class
  element._opacity = element._opacity || element.css('opacity') || 0;
  element._transition = element._transition || element.css('transition') || 'none';
  element.css({ opacity: 0, transition: 'none' });
  element.removeClass(classInserted);
  var delayInserted = attrs.insert.delay || attrs.delayIn || 0;
  if (attrs.delayIn) {
    console.warn('"delayIn" is deprecated. Please use "insert.delay" instead.');
  }
  var beforeInserted = attrs.insert.before || attrs.beforeIn;
  if (attrs.beforeIn) {
    console.warn('"beforeIn" is deprecated. Please use "insert.before" instead.');
  }
  beforeInserted && beforeInserted.apply && beforeInserted.apply(this, [attrs, element, tpl]);
  Tracker.afterFlush(function() {
    setTimeout(function() {
      element.css({ opacity: element._opacity, transition: element._transition }).addClass(classInserted).addClass(Anim.insertingClass);
    }, delayInserted);
  });
};

var animateRemoved = function(attrs, element, tpl) {
  if (!attrs || !element) return;
  var el = _.clone(element.get(0));
  var classInserted = getClassInserted(attrs, el, tpl);
  var classRemoved = getClassRemoved(attrs, el, tpl);

  var delayRemoved = attrs.remove.delay || attrs.delayOut || 0;
  if (attrs.delayOut) {
    console.warn('"delayOut" is deprecated. Please use "remove.delay" instead.');
  }
  var beforeRemoved = attrs.remove.before || attrs.beforeOut;
  if (attrs.beforeOut) {
    console.warn('"beforeOut" is deprecated. Please use "remove.before" instead.');
  }
  beforeRemoved && beforeRemoved.apply && beforeRemoved.apply(this, [attrs, element, tpl]);

  element.removeClass(classInserted).addClass(Anim.removingClass);
  setTimeout(function() {
    element.addClass(classRemoved);
  }, delayRemoved);

};

var callbacks = {};
var attachAnimationCallbacks = function(attrs, selector, tpl) {

  var s = _.compact([attrs.container, selector]).join(' ');
  if (callbacks[s]) return;
  callbacks[s] = true;

  $(s).onAnimationEnd(function() {

    var element = $(this);

    // Insert
    if (element.hasClass(Anim.insertingClass)) {

      var afterInserted = attrs.insert.after || attrs.afterIn || attrs.inCallback;
      if (attrs.afterIn) {
        console.warn('"afterIn" is deprecated. Please use "insert.after" instead.');
      }
      if (attrs.inCallback) {
        console.warn('"inCallback" is deprecated. Please use "insert.after" instead.');
      }
      afterInserted && afterInserted.apply && afterInserted.apply(this, [attrs, element, tpl]);
      element.removeClass(Anim.insertingClass).addClass(Anim.insertedClass);

    }

    // Remove
    if (element.hasClass(Anim.removingClass)) {

      var afterRemoved = attrs.remove.after || attrs.afterOut || attrs.outCallback;
      if (attrs.afterOut) {
        console.warn('"afterOut" is deprecated. Please use "remove.after" instead.');
      }
      if (attrs.outCallback) {
        console.warn('"outCallback" is deprecated. Please use "remove.after" instead.');
      }
      afterRemoved && afterRemoved.apply && afterRemoved.apply(this, [attrs, element, tpl]);
      element.remove();

    }

  });

};

var animateInitialElements = function(tplName, animations) {
  if (!tplName || !animations) return;
  _.each(animations, function(attrs, selector) {
    if (!attrs.animateInitial) return;
    Template[tplName].onRendered(function() {
      attachAnimationCallbacks(attrs, selector, this);
      var animateInitialDelay = attrs.animateInitialDelay || 0;
      $(selector, attrs.container).each(function(i) {
        var element = $(this);
        var animateInitialStep = attrs.animateInitialStep * i || 0;
        var delay = animateInitialDelay + animateInitialStep;
        element._opacity = element.css('opacity');
        element._transition = element.css('transition');
        element.css({ opacity: 0, transition: 'none' });
        setTimeout(function() {
          animateInserted(attrs, element);
        }, delay);
      });
    });
  });
};

var getUiHooks = function(animations) {
  var hooks = {};
  _.each(animations, function(attrs, selector) {
    attrs = attrs || {};
    attrs.insert = attrs.insert || {};
    attrs.remove = attrs.remove || {};
    hooks[selector] = {
      container: attrs.container,
      insert: function(node, next, tpl) {
        UiHooks.defaults.insert(node, next, attrs.container);
        animateInserted(attrs, $(node), tpl);
        attachAnimationCallbacks(attrs, selector, tpl);
      },
      remove: function(node, tpl) {
        var classRemoved = getClassRemoved(attrs, $(node), tpl);
        if (!classRemoved) return UiHooks.defaults.remove(node);
        animateRemoved(attrs, $(node), tpl);
        attachAnimationCallbacks(attrs, selector, tpl);
      }
    };
  });
  return hooks;
};

Template.prototype.animations = function(animations) {
  var tplName = getTplName(this);
  var hooks = getUiHooks(animations);
  Template[tplName].uihooks(hooks);
  animateInitialElements(tplName, animations);
};
