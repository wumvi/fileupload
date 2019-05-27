var express = require('express')
var multer = require('multer')
var app = express()
var upload = multer({dest: 'tmp/'})

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

app.post('/', upload.fields([{name: 'file'}]), function (req, res) {
  console.log(req.files)
  res.send({'status': 'ok'})
})

app.listen(8140, function () {
  console.log('Example app listening on port 8140!')
})
