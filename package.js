Package.describe({
  name: "gwendall:template-animations",
  summary: "Simple DOM animations for Meteor",
  git: "https://github.com/gwendall/meteor-template-animations.git",
  version: "0.1.7"
});

Package.onUse(function (api, where) {

  api.use([
    "underscore@1.0.3",
    "templating@1.1.1",
    "jquery@1.11.3_2",
    "tracker@1.0.7",
    "gwendall:ui-hooks@0.1.3",
    "gwendall:jquery-animation-callback@0.1.0"
  ], "client");

  api.addFiles([
    "lib.js",
  ], "client");

});
