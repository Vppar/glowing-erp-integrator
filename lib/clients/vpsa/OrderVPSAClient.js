'use strinct';

var pathApi = Config.PATH_VPSA + '/pedidos';
var token = "?token=" + Config.TOKEN_VPSA;
var encode = 'utf8';
var result = {};
var options = { host: Config.HOSTNAME_VPSA, path: pathApi, method: null, headers: null};

var Https = require('https');
var Config = require('../Config');
var OrderVPSAClient = {};

exports = module.exports = OrderRequestVPSAClient;

OrderVPSAClient.create = function(newOrder, callback) {	
    if(!newOrder) {
	    console.log("erro newOrder null");
        return callback(null);
    }
    
    options.path += token;
    options.method = 'POST';
    options.headers = {'Content-Type': 'application/json', 'Content-Length': newOrder.length};
	
    console.log("newOrder: " + newOrder);
        
    var req = Https.request(options, function(res) {
        res.setEncoding(encode);
        res.on('data', function (body) {		  
            console.log('Response: ' + body);
        });
    }); 
  
    req.on('error', function(e) {
	    console.log('Erro POST: ' + e.message);
    });
  	   
    req.write(newOrder);
    req.end();
};

/*var json = "{";
json += "\"data\":\"25-06-2014\",";
json += "\"horario\":\"15:28:05\",";
json += "\"idEntidade\":1,";
json += "\"idTerceiro\":2,";
json += "\"idRepresentante\":1,";
json += "\"idPlanoPagamento\":100,";
json += "\"valorFrete\":23.80,";
json += "\"valorOutros\":10,";
json += "\"valorSeguro\":1.50,";
json += "\"servicos\":[{";
json += "\"idServico\":1,";
json += "\"quantidade\":10,";
json += "\"valorUnitario\":11.50,";
json += "\"valorDesconto\":0.10";
json += "}]";
json += "}";

OrderRequestVPSAClient.create(json, function(){});*/

OrderVPSAClient.get = function(orderId, callback) {		
	if(!orderId) {
		console.log("erro orderId null");
		return callback(null);		
	}
	
	options.path += "/" + orderId + token;
	options.method = 'GET';
			
	var req = Https.get(options, function(res) {	
		res.setEncoding(encode);
		res.on('data', function (body) {
		  console.log('Response: ' + body);		  
		});
	});
		
	req.on('error', function(e) {
		  console.log('Erro GET: ' + e.message);
	});
	
	req.end();
	
	return callback(result);
};

//OrderRequestVPSAClient.get(7, function(){});