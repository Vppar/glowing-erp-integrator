'use strict';
var CustomerVPSAClient = require('../clients/vpsa/CustomerVPSAClient');
var CustomerService = {};
exports = module.exports = CustomerService;

CustomerService.getCustomerByDocument = function (customerDocument, callback) {
	if(!customerDocument){
		callback("[CustomerService.getCustomerByDocument][Error: customerDocument parameter is empty]");
	}else{
		CustomerVPSAClient.getByDocument(customerDocument, function(err, result){
			if(err){
				callback(err);
			}else{				
				var resultJson = JSON.stringify(result);
				callback(null, resultJson);
			}		
		});
	}
};

/*CustomerService.getCustomerByDocument("797.783.353-03", function(err, result){
	if(err) { console.log(err); }
	else { console.log(result);	}
});*/

CustomerService.updateCustomerToSendBillet = function (updateCustomer, idUpdateCustomer, callback) {
	if(!updateCustomer){
		callback("[CustomerService.updateCustomerToSendBillet][Error: updateCustomer parameter is empty]");
	}else if(!idUpdateCustomer){
		callback("[CustomerService.updateCustomerToSendBillet][Error: customer invalid]");
	}else{
		CustomerVPSAClient.getById(idUpdateCustomer, function(err, result){
			if(err){
				callback(err);
			} else if(result === 'Nenhum registro encontrado') {
					callback(result);
				}else{					
					CustomerVPSAClient.update(updateCustomer, idUpdateCustomer, function(err, result){
						if(err){
							callback(err);
						}else{
							callback(null, "[CustomerService.updateCustomerToSendBillet][Success: customer updated with success]");
						}
					});
				}
		});
	}
};

/*var updateCustomer = "{";
updateCustomer += "\"classes\": [],";
updateCustomer += "\"id\": 4,";
updateCustomer += "\"ativo\": false,";
updateCustomer += "\"nome\": \"TESTE xxxxxxxxxxxx \",";
updateCustomer += "\"ie\": \"ISENTO\",";
updateCustomer += "\"documento\": \"797.783.353-03\",";
updateCustomer += "\"dataAlteracao\": \"12-06-2014 10:08:10\",";
updateCustomer += "\"nomeFantasia\": \"FDFDFDFDFDFD oooooooooo\",";
updateCustomer += "\"emails\": [";
updateCustomer += "\"teste@teste.com.br\"";
updateCustomer += "],";
updateCustomer += "\"enderecos\": [";
updateCustomer += "{";
updateCustomer += "\"numero\": \"50\",";
updateCustomer += "\"tipo\": \"RUA\",";
updateCustomer += "\"bairro\": \"CENTRO oooooooooooo\",";
updateCustomer += "\"cidade\": \"São Bernardo do Campo\",";
updateCustomer += "\"logradouro\": \"DDDRRR ooooooooooooo\",";
updateCustomer += "\"cep\": \"55555555\",";
updateCustomer += "\"pais\": \"BRASIL\",";
updateCustomer += "\"tipoEndereco\": \"ENDERECO_CORRESPONDENCIA\",";
updateCustomer += "\"siglaEstado\": \"SP\"";
updateCustomer += "}";
updateCustomer += "],";
updateCustomer += "\"telefones\": [";
updateCustomer += "{";
updateCustomer += "\"numero\": \"555555555\",";
updateCustomer += "\"ddd\": \"12\",";
updateCustomer += "\"ramal\": \"5\",";
updateCustomer += " \"ddi\": \"555\"";
updateCustomer += "}";
updateCustomer += "]";
updateCustomer += "}";*/

/*var customer = "{\"nome\":\"TESTE xxxxxxxxx\",\"documento\":\"797.783.353-03\"}";

CustomerService.updateCustomerToSendBillet(customer, 4, function(err, result){
	if(err){ console.log(err); }
	else { console.log(result); }
});*/

CustomerService.createNewCustomer = function (newCustomer, callback) {
	if(!newCustomer){
		callback("[CustomerService.createNewCustomer][Error: newCustomer parameter is empty]");
	} else if(!newCustomer.nome || !newCustomer.documento || !newCustomer.enderecos) {
		callback("[CustomerService.createNewCustomer][Error: the attributes nome, documento and enderecos are required]");
	 }else{
		CustomerVPSAClient.create(JSON.stringify(newCustomer), function(err, result){
			if(err){
				callback(err);
			}else{				
				callback(null, result);
			}
		});
	}
};	

/*var endereco = {
	tipo: "AVENIDA",
	logradouro: "9 de Julho",
	numero: "900",
	bairro: "CENTRO",
	cep: "12000111",
	codigoIBGECidade: "3554102",
	tipoEndereco: "ENDERECO_COBRANCA"
};

var newCustomer = {
	nome: "teste created by node 4",
	documento: "797.783.353-03",
	enderecos: [endereco]		
};

CustomerService.createNewCustomer(newCustomer, function(err, result){
	if(err){ console.log(err); } 
	else { console.log(result); }
});*/
