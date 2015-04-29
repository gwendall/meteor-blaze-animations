Package.describe({
  name: "gwendall:template-animations",
  summary: "Simple DOM animations with Blaze",
  git: "https://github.com/gwendall/meteor-template-animations.git",
  version: "0.1.0"
});

Package.onUse(function (api, where) {

  api.use([
    "underscore@1.0.3",
    "templating@1.1.1",
    "jquery@1.11.3_2",
    "gwendall:ui-hooks@0.1.1",
    "gwendall:jquery-animation-callback@0.1.0"
  ], "client");

  api.addFiles([
    "lib.js",
  ], "client");

});
