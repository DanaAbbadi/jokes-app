'use strict';

require('dotenv').config();

const express = require('express');
const app = express();

const PORT = process.env.PORT;

const superagent = require('superagent');

const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL);

const methodOverride = require('method-override');
app.use(methodOverride('_method'));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('./public')); 
app.set('view engine', 'ejs');




app.get('/', (req,res)=>{
    let url = 'https://official-joke-api.appspot.com/jokes/programming/ten';
    let alljokes=[];
    superagent.get(url)
        .then(results=>{
            // console.log(results.body);
            alljokes= results.body.map(item =>{ return new Joke(item);});
            res.render('index',{alljokes: alljokes});
        })
})



app.post('/fav', (req,res)=>{
    let SQL= `INSERT INTO jokes (typej,setup,punchline) VALUES($1,$2,$3);`;
    let values=[req.body.type,req.body.setup,req.body.punchline];
    client.query(SQL,values)
        .then(()=>{
            res.redirect('/favjokes');
        })
})


app.get('/favjokes',(req,res)=>{
    let SQL = 'SELECT * FROM jokes;';
    client.query(SQL)
       .then( results=>{
        // console.log('here');
        res.render('favourite',{fav: results.rows});
    })
})

app.put('/update/:jokeId', (req,res)=>{
    let id = req.params.jokeId;
    let SQL = `UPDATE jokes SET typej=$1,setup=$2,punchline=$3 WHERE id=$4;`;
    let values = [req.body.typej, req.body.setup, req.body.punchline, id];
    client.query(SQL,values)
    .then( results=>{

        let SQL = `SELECT * FROM jokes WHERE id=$1;`;
        let values = [id];
        client.query(SQL,values)
        .then( results=>{
    
                res.render('details', {data: results.rows});
     }) })

})

app.post('/details/:jokeId', (req,res)=>{
    let id = req.params.jokeId;
    let SQL = `SELECT * FROM jokes WHERE id=$1;`;
    let values = [id];
    client.query(SQL,values)
    .then( results=>{

            res.render('details', {data: results.rows});
 })

})



app.delete('/delete/:jokeId', (req,res)=>{
    let id = req.params.jokeId;
    let SQL = `DELETE FROM jokes WHERE id=$1;`;
    let values = [id];
    client.query(SQL,values)
    .then( ()=>{
        res.redirect('/favjokes');
    })

})


app.get('/rand', (req,res)=>{
    let url = 'https://official-joke-api.appspot.com/jokes/programming/random';
    superagent.get(url)
        .then(results=>{
            // console.log(results.body);
            let randjokes = new Jokerandom(results.body);
            console.log(randjokes);
            res.render('random',{alljokes: randjokes});
        })
})



function Joke(data){
    this.type = data.type;
    this.setup = data.setup;
    this.punchline = data.punchline;
}




function Jokerandom(data){
    this.type = data[0].type;
    this.setup = data[0].setup;
    this.punchline = data[0].punchline;
}











app.get('*',(req,res)=>{
    res.status(404).send('not found');
})

app.use((error,req,res)=>{
    res.status(500).send(error);
})

client.connect()
    .then(()=>{
        app.listen(PORT,()=>{
            console.log(`Listenning on port ${PORT}`);
        })
    })

