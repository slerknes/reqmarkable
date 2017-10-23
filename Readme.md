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
