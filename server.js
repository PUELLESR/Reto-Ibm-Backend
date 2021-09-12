const _express = require('express');
const _server = _express();
const { Router } = require('express');
const router = Router();

//const { createUser, getSuma} = require('index.controller.js');

const app = _express();

const { Pool } = require('pg');
const poll = new Pool ({
    host: 'database-ibm.cblyx9r9oy2i.us-west-2.rds.amazonaws.com',
    user: 'postgres',
    password: 'postgres',
    database: 'operacion',
    port: '5432'
});

app.use(_express.json());

//router
//app.use(require('index.controller.js'));

//middlewares
//router.get('/users', getSuma);
//router.post('/users', createUser);

module.exports = router;

const _port = 4000;

_server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

const sq = 'INSERT INTO sumando (sumando01, sumando02, resultado) VALUES ($1, $2, $3)';
const val = []; 

const insertSuma = async (sq,val) => {
  try {
    const res = await poll.query(sq,val);
    console.log(res);
  } catch (error) {
    console.log(error);
  }
};

_server.get('/retoibm/sumar/:sumando01/:sumando02', function(request, response) {
  try{
    var _sumando01 = new Number(request.params.sumando01);
    var _sumando02 = new Number(request.params.sumando02);
    var _resultado = _sumando01 + _sumando02;
    //poll.query('INSERT INTO sumando (sumando01, sumando02, resultado) VALUES (3, 5, 8)');
    val = [_sumando01, _sumando02, _resultado];
    insertSuma(sq,val);
    poll.end();

    if (typeof _resultado !== "undefined" && _resultado!==null && !isNaN(_resultado)){    
      //poll.query('INSERT INTO sumando (sumando01, sumando02, resultado) VALUES (3, 4, 7)');
      return response.status(200).json({resultado : _resultado});
    }else{
      return response.status(400).json({resultado : "Bad Request"});
    }
  }
  catch(e){
    return response.status(500).json({resultado : e});
  }
});

/*_server.post('/retoibm/sumar/:sumando01/:sumando02', function(request, response) {
  try{
    var _sumando01 = new Number(request.params.sumando01);
    var _sumando02 = new Number(request.params.sumando02);
    var _resultado = _sumando01 + _sumando02;
        
    if (typeof _resultado !== "undefined" && _resultado!==null && !isNaN(_resultado)){    
      //pool.query('INSERT INTO sumando (sumando01, sumando02, resultado) VALUES ($_sumando01, $_sumando02, $_resultado)', [_sumando01, _sumando02, _resultado]);
      poll.query('INSERT INTO sumando (sumando01, sumando02, resultado) VALUES (3, 4, 7)');
    }else{
      return response.status(400).json({resultado : "Bad Request"});
    }
  }
  catch(e){
    return response.status(500).json({resultado : e});
  }
});*/


_server.listen(_port, () => {
   console.log(`Server listening at ${_port}`);
});