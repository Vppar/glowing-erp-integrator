/**
 * configuration object.
 * @enum
 */
var config = {};

config.teste='qqq'
/** Expose config */
exports = module.exports = config;

//config.FIREBASE_URI = 'https://voppwishlist.firebaseio.com/';
//config.FIREBASE_SECRET = 'zDDGKRwrgxuJ2gpzMVK5I9h2gNDB4dFup7AW5nrh';
config.firebase = {};
config.firebase.URI = 'https://testerennan.firebaseio.com/';
config.firebase.SECRET = 'vrh5U12MVxPyTEfgJ5UOVvNNdeYti1nVubLA5MzV';
config.firebase.eventType = {};
config.firebase.eventType.CHILD_ADDED = 'child_added'; 
config.firebase.eventType.VALUE = 'value';

//config.TOKEN_EXPIRATION_TIME = 7 * 24 * 60 * 60; // 7 days to seconds
//config.TOKEN_HEADER = 'API-Token';
//config.TOKEN_QUERY_PARAM = 'token';
//config.TOKEN_SALT = 'temp-development-token-salt';
//config.TOKEN_REFRESH_SALT = 'temp-development-token-refresh-salt';
//config.SESSION_PROPERTY = 'session';

// TODO: this string should not be the same in development and production
// environments
//config.PASSWORD_SALT_BASE = 'randomstring';
//config.PASSWORD_SALT_SEPARATOR = ':';

//config.SSL_CERTIFICATE = null;
//config.SSL_KEY = null;

config.TOKEN_VPSA = 'f41c778c11a3fdc14a4ce560e309a283301b3b70137d59cd608177de82e3eeed';
config.HOSTNAME_VPSA = 'www.vpsa.com.br';
config.PATH_VPSA = 'https://www.vpsa.com.br/apps/api';
config.ENCODE = 'utf8';

config.billet = {};
config.billet.CARTEIRADECOBRANCA = 1; //CARTEIRA TESTE ECOMM //TODO: cadastrar carteira de cobrança definitiva
config.billet.child = {};
config.billet.child.STATUS = 'status';

config.subscription = {};
config.subscription.child = {};
config.subscription.child.STATUS = 'status';

config.order = {};
config.order.ENTIDADE = 1; //VPINK
config.order.REPRESENTANTE = 1; //DIVERSOS
config.order.SERVICO = 1; //VENDA VOPP
config.order.TERCEIRO = 2; //VPINK INTERATIVIDADE LTDA

config.CONSULTANT_SUBSCRIPTION_REQUEST_QUEUE_REF = 'pending/subscription-consultant-request-queue';
config.CONSULTANT_SUBSCRIPTION_UPDATE_QUEUE_REF = 'pending/subscription-consultant-update-queue';
config.SUBSCRIPTION_REF = 'subscriptions';

config.paymentType = {};
config.paymentType.BILLET = 'billet';

config.EMAIL_MANDRILL_KEY = '3oy_cLmUBNb718nf3ObM0g';
config.EMAIL_FROM = 'contato@vpink.vc';
config.EMAIL_NAME = 'VPink';

config.NEW_WORK_PERIOD = 700;