const express = require("express");
const cors = require("cors");
const path = require('path');
const app = express();
const serveIndex = require('serve-index');
var bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '500mb' }));
app.use(bodyParser.urlencoded({ limit: '500mb', extended: true, parameterLimit: 500000 }));

// var corsOptions = {
//   origin:
//   ["http://localhost:8080","http://localhost:3000"]
// };
//
// app.use(cors(corsOptions));
app.use(cors());
// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

// simple route
// app.get("/", (req, res) => {
//     res.json({ message: "Welcome to bezkoder application." });
// });

require("./app/routes/turorial.routes")(app);
require("./app/routes/map.routes")(app);
require("./app/routes/instance.routes")(app);
require("./app/routes/submission.routes")(app);
require("./app/routes/solution_submission.routes")(app);
require("./app/routes/scenario.routes")(app);
require("./app/routes/algorithm.routes")(app)
require("./app/routes/auth.routes")(app)
require("./app/routes/user.routes")(app)
require("./app/routes/solution_path.routes")(app)
app.use(express.static(path.join(__dirname,'../client/build')));
app.use('/results',express.static(path.join(__dirname,'../client/public/results')));
app.use('/results', serveIndex(path.join(__dirname,'../client/public/results'), { icons: true }));
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});
// set port, listen for requests
// var PORT = "" || 80;
// const PORT = process.env.PORT || 80;
if (process.env.NODE_ENV === 'development') {
    const PORT = process.env.PORT || 80;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}.`);
    });
} else {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}.`);
    });
}

if (process.env.NODE_ENV === 'development') {
    console.log('Development mode');
} else {
    console.log('Production mode');
}


