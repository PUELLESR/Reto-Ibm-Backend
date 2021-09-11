const _express = require('express');
const _server = _express();

const _port = 4000;

// Configurar cabeceras y cors
const cors = require('cors');
const app = _express ();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});


//app.use(cors({
//    origin: 'http://alb-ibm-web-472115302.us-west-2.elb.amazonaws.com/'
//}));

//header('access-Control-Allow-Origin:*');
_server.get('/retoibm/sumar/:sumando01/:sumando02', function(request, response) {
  try{
    var _sumando01 = new Number(request.params.sumando01);
    var _sumando02 = new Number(request.params.sumando02);
    var _resultado = _sumando01 + _sumando02;
    
    if (typeof _resultado !== "undefined" && _resultado!==null && !isNaN(_resultado)){    
      return response.status(200).json({resultado : _resultado});
    }else{
      return response.status(400).json({resultado : "Bad Request"});
    }
  }
  catch(e){
    return response.status(500).json({resultado : e});
  }
});


_server.listen(_port, () => {
   console.log(`Server listening at ${_port}`);
});
