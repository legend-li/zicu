var express = require('express')
var path = require('path')
var compression = require('compression')

var app = express()

app.use(compression())

// serve our static stuff like index.css
app.use(express.static(path.join(__dirname, 'build')))

// send all requests to index.html so browserHistory works
// app.get(/\/hzy\/eb\/hotel\/*/, function (req, res) {
//   res.sendFile(path.join(__dirname, 'build', 'index.html'))
// })

// send all requests to index.html so browserHistory works
app.get(/\/businiss\/bsm\/*/, function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

app.get(/\/shim\/shim.js/, function (req, res) {
  res.sendFile(path.join(__dirname, 'shim', 'shim.js'))
})

// app.get(/\/hzy\/eb\/authority\/*/, function (req, res) {
//   res.sendFile(path.join(__dirname, 'build', 'index.html'))
// })

var PORT = process.env.PORT || 8000
app.listen(PORT, function() {
  console.log('Production Express server running at localhost:' + PORT)
})

// app.get('/hzy/account/getuser', (req, res) => {
//     res.status(200)
// 	    .json({"errno":0,"msg":"success","data":{
// 	        name: 'zhaoshu02'
// 	    }});
// })

// app.post('/hzy/eb/updateHotelInfoStatus', (req, res) => {
//     res.status(200)
//             .json({});
// });
