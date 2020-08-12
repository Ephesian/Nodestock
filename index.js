const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const path = require('path');
const request =require('request');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 5000;

//use body parser middleware
app.use(bodyParser.urlencoded({extended: false}));

// API Key pk_871a847140bf45c6bfb41b71a87d053d
// create call_api function
function call_api(finishedAPI, ticker) {
    request('https://cloud.iexapis.com/stable/stock/' + ticker + '/quote?token=pk_871a847140bf45c6bfb41b71a87d053d', { json:true }, (err,res,body) => {
        if (err) { return console.log(' API error ${err}');}
        if (res.statusCode === 200){
            finishedAPI(body);
        }
    });   
}


// Set Handlebars Middleware
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Set Handlebar index GET route
app.get('/', function (req, res) {
    call_api(function(doneAPI){          
            res.render('home', {
            stock: doneAPI
            });           
        }, "fb");
    //console.log(api);
});

// Set Handlebar index POST route
app.post('/', function (req, res) {
    call_api(function (doneAPI) {
        //  posted_stock = req.body.stock_ticker;
            res.render('home', {
            stock: doneAPI,
        });
    }, req.body.stock_ticker);
    //console.log(api);
});

app.get('/about.html', function (req, res) {
    res.render('about');
});

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));
app.listen(PORT,() => console.log('Server listening on port ' + PORT ));