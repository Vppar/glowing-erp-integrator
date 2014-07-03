(function () {
  'use strict';

  var VPSABilletStatus = {};

  exports = module.exports = VPSABilletStatus;

  VPSABilletStatus.INICIAL = 'INICIAL';
  VPSABilletStatus.PAGO = 'PAGO';
  VPSABilletStatus.NAO_PAGO = 'NAO_PAGO';
  VPSABilletStatus.GERADO = 'GERADO';
  VPSABilletStatus.ENVIADO = 'ENVIADO'; 
  VPSABilletStatus.EMITIDO = 'EMITIDO'; 
  VPSABilletStatus.INVALIDO = 'INVALIDO';

})();