(function() {
  'use strict';
  var http = require("http");
  var url = require('url');
  var yaml = require('js-yaml');

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
      var doc = yaml.safeLoad(data);
      callback(e, doc);
    });
  }

  function jsonToYaml(_url, callback){
    getSource(_url, function(e, data){
      var doc = yaml.safeDump(JSON.parse(data));
      callback(e, doc);
    });
  }

  function getSource(_url, callback){
    var httpors;
    if(url.parse(_url).protocol === 'https:'){
      httpors = require("https");
    } else {
      httpors = require("http");
    }

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
        callback(null, data);
      });
    });
  }
  /**
   * The main object.
   */
  var server = http.createServer(function(request, response){
    var path = url.parse(request.url).pathname;

    switch(path){
      case '/':
        response.writeHead(200);
        response.write('nothing here');
        response.end();
        break;
      case '/tojson':
        yamlToJson("https://raw.githubusercontent.com/publiccodenet/publiccode.yml/master/example/publiccode.yml", function(e, data){
          response.writeHead(200, setHeaders("json"));
          response.write(data, "utf8");
          response.end();
        });
        break;
      case '/toyaml':
        jsonToYaml("https://raw.githubusercontent.com/BetaNYC/civic.json/master/civic.json", function(e, data){
          response.writeHead(200, setHeaders("yaml"));
          response.write(data, "utf8");
          response.end();
        });

        break;
      default:
        response.writeHead(404);
        response.write("oops this doesn't exist, did you mean /tojson or /toyaml? - 404");
        response.end();
        break;
      }
  });

  module.exports = server;
}());
