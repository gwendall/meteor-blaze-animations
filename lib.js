var getTplName = function(tpl) {
  return tpl.viewName.slice(-(tpl.viewName.length - "Template.".length));
}

var getUiHooks = function(animations) {
  var hooks = {};
  _.each(animations, function(attrs, selector) {
    hooks[selector] = {
      container: attrs.container,
      insert: function(node, next) {
        var $node = $(node);
        $node.removeClass(attrs.in).insertBefore(next).css({ opacity: 0 });
        Tracker.afterFlush(function() {
          $node.css({ opacity: 1 }).addClass(attrs.in);
        });
      },
      remove: function(node) {
        var $node = $(node);
        $node.removeClass(attrs.in).addClass(attrs.out);
        if (!attrs.out) return $node.remove();
        $node.onAnimationEnd(function(animationName) {
          $node.remove();
        });
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
};
