var FormData = require('form-data'),
    fs = require('fs'),
    http = require('http');

var host = '10.11.99.1';

exports.setHost = function(cHost) {
  if (cHost != undefined) host = cHost;
}

exports.upload = function(path, handler) {
  handler = handler || function(err) {};
  if (fs.existsSync(path)) {
    isUp(function(err, res) {
      if (err) {
        if (handler != undefined) handler(err);
      } else {
        var form = new FormData();
        form.append('file', fs.createReadStream(path));
        form.submit('http://' + host + '/upload', function(err, res) {
          if (err) handler(err);
          else handler(false, {path: path});
          res.resume();
        });
      }
    });
  } else {
    handler(new Error('File not found'));
  }
}

exports.listFiles = function(handler) {
  var files = [];
  searchQue = [];

  dirTravel(files, {id: '', dir: ''}, function(err, res) {
    handler(err, res);
  });
}

exports.download = function(id, handler) {
  getData({host: host, path: '/download/' + id + '/placeholder'}, function(err, res) {
    if (err) handler(err, undefined);
    else handler(false, new Buffer.concat(res).toString('binary'));
  });
}

var searchQue = [];

function dirTravel(files, opt, handler) {
  getData({host: host, path: '/documents/' + opt.id}, function(err, res) {
    if (err)  {
      handler(err, undefined);
    } else {
      var data = {};
      try {
        data = JSON.parse(res.join(''));
      } catch (err) {
        handler(new Error('Could not parse data'), undefined);
      } finally {
        for (var i in data) {
          var ele = { type: data[i].Type,
                      title: data[i].VissibleName,
                      version: data[i].Version,
                      path: opt.dir.split('/'),
                      modified: new Date(data[i].ModifiedClient),
                      id: data[i].ID
          }

          ele.title = ele.title.replace(':','-');
          ele.title = ele.title.replace('?','-');
          if (ele.type == 'DocumentType') {
            ele.ext = (data[i].fileType == '') ? 'pdf' : data[i].fileType;
            files.push(ele);
          } else if (ele.type == 'CollectionType') {
            searchQue.push({id: ele.id, dir: opt.dir + '/' + ele.title});
          }
        }
        var next = searchQue.pop();
        if (next == undefined)
          handler(false, files);
        else dirTravel(files, next, handler);
      }
    }
  });
}


function getData(opt, handler) {
  var req = http.request({host: opt.host, path: opt.path, port: '80', method: 'GET'}, function(res) {
    var chunks = [];
    res.on('data', function (chunk) {chunks.push(chunk)});
    res.on('end', function() {handler(false, chunks)});
  });
  req.on('error', function(error) {
    handler(new Error('Error when getting data from reMarkable'), undefined);
  });
  req.end();
}

function isUp(handler) {
  getData({host: host, path: '/'}, function(err, res) {
    if (err || (!err && res.indexOf('reMarkable') == -1)) err = new Error('reMarkable not found');
    handler(err, res);
  });
}
