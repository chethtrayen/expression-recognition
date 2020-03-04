const express = require('express');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));


const viewsDir = path.join(__dirname, 'views');

app.use(express.static(viewsDir));
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '/weights')));
app.use(express.static(path.join(__dirname, '/node_modules/face-api.js/dist')));
app.use(express.static(path.join(__dirname, '/node_modules/jquery/dist')));


app.get('/', (req, res)=>res.send(path.join(viewsDir, 'index.html')));

app.listen(3000, ()=>{
    console.log('listening on port 3000');
});