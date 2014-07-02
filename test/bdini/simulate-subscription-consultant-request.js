// Simulate Glowing-Catalog adding new subscriptions
// Do not execute in production environment

'use strict';

var Config = require('../../lib/Config');
var FirebaseBackend = require('../../lib/backends/FirebaseBackend');
var consultantSubscriptionRequestQueueRef = FirebaseBackend.refs.base.child(Config.CONSULTANT_SUBSCRIPTION_REQUEST_QUEUE_REF);

exports = module.exports = add;

function add(subscriptionConsultantRequest) {
  FirebaseBackend.push(consultantSubscriptionRequestQueueRef, subscriptionConsultantRequest, null, function(err, result) {
  		if(err) {
  			console.log(err);  		
  		} else {
  			console.log(result);
  		}
  });
};

/*var endereco = {};
endereco.tipo = 'RUA';
endereco.logradouro = '15 de Novembro';
endereco.numero = '1020';
endereco.bairro = 'JD. MARIA';
endereco.complemento = 'APTO 2';
endereco.cep = '12600123';
endereco.codigoIBGECidade = '3554102';
endereco.tipoEndereco = 'ENDERECO_SEDE';

var telefone = {};
telefone.ddi = '55';
telefone.ddd = '12';
telefone.numero = '99999999';

var consultant = {};
consultant.nome = 'terceiro criado pelo node - teste 02';
consultant.documento = '592.521.245-27';
consultant.emails = ['terceiro.teste@gmail.com'];
consultant.rg = '42.943.412-1';
consultant.dataNascimento = '12-08-1970';
consultant.enderecos = [endereco];
consultant.telefones = [telefone];*/

var address = {};
address.street = 'rua 1';
address.number = 555;

var consultant = {};
consultant.address = address;
consultant.subscriptionExpirationDate = 1383066000000;
consultant.uuid = '9999';
consultant.name = 'Joao da Silva';
consultant.cep = '12122999';
consultant.cpf = '434.325.864-50';
consultant.email = 'teste@teste.com';
consultant.cityOrigin = 'Sao Paulo';
consultant.countryOrigin = 'Brasil';
consultant.complement = 'Apto 333';
consultant.phone = '11 3333 4444';
consultant.cellphone = '11 98444 2322';
consultant.emailPrimer = 'dsfsdf@ddd.com';

var subscriptionConsultantRequest = {};
subscriptionConsultantRequest.uuid = 1111;
subscriptionConsultantRequest.planType = 'GLOSS';
subscriptionConsultantRequest.date = 1383066000000;
subscriptionConsultantRequest.consultant = consultant;
add(JSON.stringify(subscriptionConsultantRequest));

/*subscriptionConsultantRequest.uuid = '2222';
subscriptionConsultantRequest.consultant.uuid = '8888';
add(JSON.stringify(subscriptionConsultantRequest));

subscriptionConsultantRequest.uuid = '3333';
subscriptionConsultantRequest.consultant.uuid = '7777';
add(JSON.stringify(subscriptionConsultantRequest));*/