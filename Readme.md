# reqMarkable
Node.js wrapper for making HTTP requests to the reMarkable paper tablet.

reqMarkable use the USB web interface of the reMarkable. This interface allow users to list, download and upload files. No public documentation of this interface exist. Methods provided by the reqMarkable wrapper are not sufficiently tested, and are provided as is. **This project is not affiliated with reMarkable** in any way, meaning Remarkable AS might change the USB web interface at any time, potentially rendering this wrapper useless.

## Install
```
npm install reqmarkable
```

## Usage

Upload file
``` javascript
var reqMarkable = require('reqmarkable');

var path = 'path-to-file.pdf';
reqMarkable.upload(path);

//OR
reqMarkable.upload(path, function(err, res) {
  if (!err) console.log(res.path + ' successfully uploaded!');
});
```

List files
``` javascript
var reqMarkable = require('reqmarkable');

reqMarkable.listFiles(function(err, res) {
  if (!err)
    for (var i in res) //array of files
      console.log(res[i]); // -> {type, title, version, path (array), modified (date obj), id, ext}
});
```

Download file
``` javascript
var reqMarkable = require('reqmarkable');

var id = 'c42144fd-6a45-4930-ba2d-6cd631b26ec1';
reqMarkable.download(id, function(err, res) {
  if (!err)
    fs.writeFileSync('some/directory', res, 'binary');
});
```

Set host
``` javascript
var reqMarkable = require('reqmarkable');

reqMarkable.setHost('10.11.99.1'); //this call is atm not necessary
```
