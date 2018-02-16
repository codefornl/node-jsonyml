(function() {
  'use strict';
  var http = require("http");
  var url = require('url');
  var yaml = require('js-yaml');

  /**
   * Parse the params of the request.
   */
  function params(req){
    var q = req.url.split('?');
    var result = {};
    if(q.length >= 2) {
      q[1].split('&').forEach( function(item) {
        try {
          result[item.split('=')[0]]=item.split('=')[1];
        } catch (e) {
          result[item.split('=')[0]]='';
        }
      });
    }
    return result;
  }

  /**
   * Helper to set headers
   */
  function setHeaders(type){
    var _headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET",
      "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
    };

    switch (type) {
      case "json":
        _headers["Content-Type"] = "application/json";
        return _headers;
      case "yaml":
        _headers["Content-Type"] = "text/yaml";
        return _headers;
      default:
        // Do not expose headers
        return {};
    }
  }

  function yamlToJson(_url, callback){
    getSource(_url, function(e, data){
      var doc;
      if(!e){
        try {
          doc = JSON.stringify(yaml.safeLoad(data));
          callback(e, doc);
        } catch (ex) {
          callback (ex, null);
        }
      }
    });
  }

  function jsonToYaml(_url, callback){
    getSource(_url, function(e, data){
      var doc;
      if(!e){
        try {
          doc = yaml.safeDump(JSON.parse(data));
          callback(e, doc);
        } catch (ex) {
          callback (ex, null);
        }
      }
    });
  }

  function getSource(_url, callback){
    var httpors;
    if(url.parse(_url).protocol === 'https:'){
      httpors = require("https");
    } else {
      httpors = require("http");
    }
    try {
      var req = httpors.get(_url, function(res) {
        var data = '';

        res.on('data', function(chunk) {
          data += chunk;
        });

        res.on('error', function(e) {
          callback(e, null);
        });

        res.on('timeout', function(e) {
          callback(e, null);
        });

        res.on('end', function() {
          if(res.statusCode === 200){
            callback(null, data);
          } else {
            callback(res.statusCode, null);
          }

        });
      });
    } catch (e){
      callback(e, null);
    }
  }
  /**
   * The main object.
   */
  var server = http.createServer(function(request, response){
    var _params = params(request);
    if (_params.f){
      jsonToYaml(_params.f, function(e, data){
        if(!e){
          response.writeHead(200, setHeaders("yaml"));
          response.write(data, "utf8");
          response.end();
        } else {
          yamlToJson(_params.f, function(e, data){
            if(!e){
              response.writeHead(200, setHeaders("json"));
              response.write(data, "utf8");
              response.end();
            } else {
              response.writeHead(404);
              response.write("oops that went wrong. Did you feed me json or yaml? - 404");
              response.end();
            }
          });
        }
      });
    } else {
      response.writeHead(404);
      response.write("You had one job. Put a remote file in parameter ?f= and try again - 404");
      response.end();
    }
  });

  module.exports = server;
}());
