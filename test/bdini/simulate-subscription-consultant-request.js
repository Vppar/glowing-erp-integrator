// Simulate Glowing-Catalog adding new subscriptions on reference queue Config.CONSULTANT_SUBSCRIPTION_REQUEST_QUEUE_REF
'use strict';

var Config = require('../../lib/Config');
var FirebaseBackend = require('../../lib/backends/FirebaseBackend');
var consultantSubscriptionRequestQueueRef = FirebaseBackend.refs.base.child(Config.CONSULTANT_SUBSCRIPTION_REQUEST_QUEUE_REF);

exports = module.exports = add;

function add(subscriptionConsultantRequest) {
  FirebaseBackend.push(consultantSubscriptionRequestQueueRef, subscriptionConsultantRequest, function(err, result) {
  		if(err) {
  			console.log(err);  		
  		} else {
  			console.log('OK');
  		}
  });
  return true;
};

var address = {};
address.street = 'Rua dos Crisântemos';
address.number = '123';
address.city = 'Jacareí';
address.neighborhood = 'Parque Santo Antônio';
address.state = 'SP';

var birthDate = {};
birthDate.day = '04';
birthDate.month = '04';
birthDate.year = '1985';

var consultant = {};
consultant.address = address;
consultant.birthDate = birthDate;
consultant.account = '121212';
consultant.accountHolder = 'Rafael';
consultant.accountType = 'C';     
consultant.agency = '1155';
consultant.bank = 'Caixa';     
consultant.cep = '12309280';
consultant.cityOrigin = 'Jacareí';
consultant.complement = 'complemento 2';
consultant.countryOrigin = 'Brasil';
consultant.cpf = '27763305100';
consultant.email = 'lucas.andrade@tuntscorp.com.br';
consultant.emailPrimer = 'teste@teste.com';
consultant.emissary = 'SSP';
consultant.gender = 'Masculio';
consultant.holderDocument = '27763305100';
consultant.marital = 'Casado(a)';
consultant.name = 'RafaelAndrade';
consultant.phone = '31252151515';
consultant.uuid = '5c90cbb0-02ef-11e4-aa2b-01000e000002222';

var subscriptionConsultantRequest = {};
subscriptionConsultantRequest.planType = 'GLOSS';
subscriptionConsultantRequest.subscriptionDate = 1383066000000;
subscriptionConsultantRequest.consultant = consultant;

subscriptionConsultantRequest.uuid = 'abc111112';
add(subscriptionConsultantRequest);

/*subscriptionConsultantRequest.uuid = 'abc222222';
add(subscriptionConsultantRequest);

subscriptionConsultantRequest.uuid = 'abc333332';
add(subscriptionConsultantRequest);*/