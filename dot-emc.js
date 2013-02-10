// Generated by CoffeeScript 1.4.0

/*
doT Express Master of Ceremonies
@author Dannel Albert <cuebix@gmail.com>
@license http://opensource.org/licenses/MIT
*/


(function() {
  var Defines, cache, clone, curOptions, curPath, defaults, doT, fs, html, mergeObjects, path, renderFile, workingPaths;

  fs = require("fs");

  path = require("path");

  doT = require("dot");

  try {
    html = require("html");
  } catch (e) {
    if (e.code !== "MODULE_NOT_FOUND") {
      throw e;
    }
  }

  cache = {};

  workingPaths = [];

  curOptions = null;

  curPath = null;

  defaults = {
    fileExtension: "def",
    options: {
      templateSettings: {
        cache: true
      }
    }
  };

  if (html) {
    defaults.options.prettyPrint = {
      indent_char: "	",
      indent_size: 1
    };
  }

  Defines = (function() {

    function Defines() {}

    Defines.prototype.include = function(filename, vars) {
      var returnValue, template;
      returnValue = void 0;
      if (!path.extname(filename)) {
        filename = "" + filename + "." + defaults.fileExtension;
      }
      if (curPath) {
        filename = path.resolve(curPath, filename);
      }
      curPath = path.dirname(filename);
      workingPaths.push(curPath);
      vars = typeof vars !== "object" ? curOptions : mergeObjects(true, clone(curOptions), vars);
      try {
        if (curOptions.templateSettings.cache && filename in cache) {
          template = cache[filename];
        } else {
          template = cache[filename] = fs.readFileSync(filename, 'utf8');
        }
        returnValue = doT.template(template, curOptions.templateSettings, this)(vars);
        workingPaths.pop();
      } catch (err) {
        workingPaths.pop();
        curPath = workingPaths.length ? workingPaths[workingPaths.length - 1] : null;
        throw err;
      }
      curPath = workingPaths.length ? workingPaths[workingPaths.length - 1] : null;
      return returnValue;
    };

    return Defines;

  })();

  mergeObjects = function() {
    var arg, argLength, deep, i, key, start, t, target, val, valIsArray, valIsObject, _i, _j;
    target = arguments[0];
    if (typeof target === "boolean") {
      deep = target;
      target = arguments[1] || {};
      start = 2;
    } else {
      deep = false;
      target = arguments[0] || {};
      start = 1;
    }
    argLength = arguments.length;
    if (deep) {
      for (i = _i = start; start <= argLength ? _i <= argLength : _i >= argLength; i = start <= argLength ? ++_i : --_i) {
        arg = arguments[i];
        if (!arg) {
          continue;
        }
        for (key in arg) {
          val = arg[key];
          if (target === val) {
            continue;
          }
          t = target[key];
          valIsArray = val instanceof Array;
          valIsObject = !valIsArray && typeof val === "object";
          if (val && (valIsObject || valIsArray)) {
            if (valIsArray) {
              val = val.slice(0);
            }
            if (key in target) {
              if (valIsArray) {
                t = t instanceof Array ? t : [];
              } else {
                t = typeof t === "object" ? t : {};
              }
              target[key] = mergeObjects(true, (valIsArray ? [] : {}), t, val);
            } else {
              target[key] = val;
            }
          } else if (val !== void 0) {
            target[key] = val;
          }
        }
      }
    } else {
      for (i = _j = start; start <= argLength ? _j <= argLength : _j >= argLength; i = start <= argLength ? ++_j : --_j) {
        arg = arguments[i];
        for (key in arg) {
          val = arg[key];
          if (val !== void 0) {
            target[key] = val;
          }
        }
      }
    }
    return target;
  };

  clone = function(obj) {
    return mergeObjects(true, {}, obj);
  };

  renderFile = function(filename, options, fn) {
    var def;
    if (typeof options === "function") {
      fn = options;
      options = {};
    }
    if (typeof fn !== "function") {
      fn = (function() {});
    }
    curOptions = mergeObjects(true, options, defaults.options, {
      templateSettings: doT.templateSettings
    });
    def = new Defines();
    try {
      if (html && curOptions.pretty) {
        return fn(null, html.prettyPrint(def.include(filename), curOptions.prettyPrint || {}));
      } else {
        return fn(null, def.include(filename));
      }
    } catch (err) {
      return fn(err);
    }
  };

  exports.__express = renderFile;

  exports.renderFile = renderFile;

  exports.Defines = Defines;

  exports.init = function(settings) {
    defaults = mergeObjects(true, defaults, settings);
    return exports;
  };

}).call(this);
