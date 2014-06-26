/**
 * Configuration object.
 * @enum
 */
var config = {};

/** Expose config */
exports = module.exports = config;

//config.FIREBASE_URI = 'https://voppwishlist.firebaseio.com/';
//config.FIREBASE_SECRET = 'zDDGKRwrgxuJ2gpzMVK5I9h2gNDB4dFup7AW5nrh';


config.FIREBASE_URI = 'https://testerennan.firebaseio.com/';
config.FIREBASE_SECRET = 'vrh5U12MVxPyTEfgJ5UOVvNNdeYti1nVubLA5MzV';

config.TOKEN_EXPIRATION_TIME = 7 * 24 * 60 * 60; // 7 days to seconds
config.TOKEN_HEADER = 'API-Token';
config.TOKEN_QUERY_PARAM = 'token';
config.TOKEN_SALT = 'temp-development-token-salt';
config.TOKEN_REFRESH_SALT = 'temp-development-token-refresh-salt';
config.SESSION_PROPERTY = 'session';

// TODO: this string should not be the same in development and production
// environments
config.PASSWORD_SALT_BASE = 'randomstring';
config.PASSWORD_SALT_SEPARATOR = ':';

config.SSL_CERTIFICATE = null;
config.SSL_KEY = null;

config.TOKEN_VPSA = 'f41c778c11a3fdc14a4ce560e309a283301b3b70137d59cd608177de82e3eeed';
config.HOSTNAME_VPSA = 'www.vpsa.com.br';
config.PATH_VPSA = 'https://www.vpsa.com.br/apps/api';
config.CARTEIRACOBRANCA = 1; //CARTEIRA TESTE ECOMM
config.ENTIDADE = 1; //VPINK
config.REPRESENTANTE = 2; //VPINK INTERATIVIDADE LTDA
config.SERVICO = 1; //VENDA VOPP
config.TERCEIRO = 2; //VPINK INTERATIVIDADE LTDA

var order = {};
order.ENTIDADE = 1; //VPINK
order.REPRESENTANTE = 2; //VPINK INTERATIVIDADE LTDA
order.SERVICO = 1; //VENDA VOPP
order.TERCEIRO = 2; //VPINK INTERATIVIDADE LTDA

config.order = order;

config.EMAIL_MANDRILL_KEY = '3oy_cLmUBNb718nf3ObM0g';
config.EMAIL_SUBJECT = 'Assinatura VPink';
config.EMAIL_FROM = 'contato@vpink.vc';
config.EMAIL_NAME = 'VPink';