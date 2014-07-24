var config = {};

exports = module.exports = config;

config.firebase = {};
config.firebase.URI = 'https://voppwishlist.firebaseio.com/';
config.firebase.SECRET = 'zDDGKRwrgxuJ2gpzMVK5I9h2gNDB4dFup7AW5nrh';
//config.firebase.URI = 'https://testerennan.firebaseio.com/';
//config.firebase.SECRET = 'vrh5U12MVxPyTEfgJ5UOVvNNdeYti1nVubLA5MzV';
/*config.firebase.URI = 'https://intense-fire-533.firebaseio.com/';
config.firebase.SECRET = 'uDPax54oJyQIcuHWVq9zpdnamgqLyGmE8yrGay9A';*/

config.firebase.eventType = {};
config.firebase.eventType.CHILD_ADDED = 'child_added'; 
config.firebase.eventType.VALUE = 'value';

config.TOKEN_VPSA = 'f41c778c11a3fdc14a4ce560e309a283301b3b70137d59cd608177de82e3eeed';
config.HOSTNAME_VPSA = 'www.vpsa.com.br';
config.PATH_VPSA = 'https://www.vpsa.com.br/apps/api';
config.PATH_VPSA_BOLETOS = config.PATH_VPSA + '/boletos/'
config.PATH_VPSA_BOLETOS_IMPRESSAO = '/impressao?token=' + config.TOKEN_VPSA;
config.ENCODE = 'utf8';

config.APP_ORIGIN = 'ERP_INTEGRATOR';

config.result = {};
config.result.OK = 'OK';

config.billet = {};
config.billet.CARTEIRADECOBRANCA = 1; //CARTEIRA TESTE ECOMMERCE
config.billet.child = {};
config.billet.child.STATUS = 'status';
config.billet.EMPTY_RESULT = '[]';

config.subscription = {};
config.subscription.child = {};
config.subscription.child.STATUS = 'status';
config.subscription.child.MESSAGE = 'message';
config.billet.child.BILLET = 'billet';

config.order = {};
config.order.ENTIDADE = 1; //VPINK
config.order.REPRESENTANTE = 1; //DIVERSOS
config.order.SERVICO = 1; //VENDA VOPP
config.order.TERCEIRO = 2; //VPINK INTERATIVIDADE LTDA
config.order.PLANO_PAGAMENTO = 100;
config.order.amount = {};
config.order.amount.ZERO = '0.00';

config.CONSULTANT_SUBSCRIPTION_UPDATE_QUEUE_REF = 'queues/subscription-consultant-update/pending';
config.CONSULTANT_SUBSCRIPTION_REQUEST_QUEUE_REF = 'queues/subscription-consultant-request/pending';
config.SUBSCRIPTION_REF = 'subscriptions';

config.paymentType = {};
config.paymentType.BILLET = 'billet';

config.EMAIL_MANDRILL_KEY = 'JMhhV9uVtL67uC72RiiacQ';
config.EMAIL_FROM = 'contato@vpink.vc';
config.EMAIL_NAME = 'VPink';

config.EMAIL_TO_INFORM_BILLET_SENT_SUBJECT = 'Seu boleto de Assinatura VPink';
config.EMAIL_TO_INFORM_APPROVED_PAYMENT_SUBJECT = 'Parabéns! Assinatura VPink Confirmada!';

config.NEW_WORK_PERIOD = 700;

config.customer = {};
config.customer.STREET_DEFAULT_TYPE = 'RUA';
config.customer.STREET = 'RUA';
config.customer.S = 'R';
config.customer.S_ = 'R.';
config.customer.HIGHWAY = 'RODOVIA';
config.customer.ROAD = 'ESTRADA';
config.customer.NOT_FOUND = 'Nenhum registro encontrado';
config.customer.EMPTY_RESULT = '[]';
config.customer.AVENUE = 'AVENIDA';
config.customer.AV = 'AV';
config.customer.AV_ = 'AV.';
config.customer.NEIGHBORHOOD_DEFAULT = ' ';