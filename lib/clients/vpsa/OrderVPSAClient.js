'use strinct';
var Https = require('https');
var Config = require('../../config');
var PaymentBillet = require('../../enum/PaymentBillet');
var OrderVPSAClient = {};
exports = module.exports = OrderVPSAClient;

var pathApi = Config.PATH_VPSA + '/pedidos';
var token = "?token=" + Config.TOKEN_VPSA;

OrderVPSAClient.create = function(newOrder, callback) {	
   if(!newOrder) {
    	callback("[OrderVPSAClient.create][Error: newOrder parameter is empty]");
    }else{    
    	var options = { 
			host: Config.HOSTNAME_VPSA, 
			path: pathApi + token, 
			method: 'POST', 
			headers: {'Content-Type': 'application/json', 'Content-Length': newOrder.length}
		};
	        
	    var req = Https.request(options, function(res) {
	        res.setEncoding(Config.ENCODE);
	        res.on('data', function (body) {	
	        	callback(null, body);	            
	        });
	    }); 
	  
	    req.on('error', function(e) {
		    callback("[OrderVPSAClient.create][Error:" + e.message + "]");
	    });
	  	   
	    req.write(newOrder);
	    req.end();
	}
};

/*var content = "{";
content += "\"data\":\"29-06-2014\",";
content += "\"horario\":\"15:28:05\",";
content += "\"idEntidade\":1,";
content += "\"idTerceiro\":2,";
content += "\"idRepresentante\":1,";
content += "\"idPlanoPagamento\":" + PaymentBillet.CASH + ",";
content += "\"valorFrete\":23.80,";
content += "\"valorOutros\":10,";
content += "\"valorSeguro\":1.50,";
content += "\"servicos\":[{";
content += "\"idServico\":1,";
content += "\"quantidade\":10,";
content += "\"valorUnitario\":11.50,";
content += "\"valorDesconto\":0.10";
content += "}]";
content += "}";

OrderVPSAClient.create(content, function(err, result){
	if(err){ console.log(err); }
	else { console.log(result); }
});*/

OrderVPSAClient.get = function(orderId, callback) {		
	if(!orderId) {
		callback("[OrderVPSAClient.get][Error: orderId parameter is empty]");		
	}else{	
		var options = { 
			host: Config.HOSTNAME_VPSA, 
			path: pathApi + "/" + orderId + token, 
			method: 'GET'
		};
		
		var req = Https.get(options, function(res) {	
			res.setEncoding(Config.ENCODE);
			res.on('data', function (body) {
			  callback(null, body);		  
			});
		});
			
		req.on('error', function(e) {
			callback("[OrderVPSAClient.get][Error: " + e.message + "]");
		});
		req.end();
	}
};

/*OrderVPSAClient.get(7, function(err, result){
	if(err){ console.log(err); }
	else { console.log(result); }
});*/