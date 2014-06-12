(function () {
  'use strict';

  /**
   * E-mail regular expression. This is not an RFC-compliant pattern but
   * gets the work done for what we need in this project.
   * @see https://www.debuggex.com/r/WB0qjCeDHrBrdl88
   * @constant
   * @type {RegExp}
   */
  var EMAIL_PATTERN = new RegExp(
    '^' + 

    // Local part
    '[a-z0-9]+(?:[\\._\\-\\+][a-z0-9]+)*' +

    '@' +

    // Domain part
    '[a-z0-9\\-_]+(?:\\.[a-z0-9\\-_]+)*' +

    // TLD part
    '(?:\\.[a-z]{3,}(?:\\.[a-z]{2})?)' +

    '$',

    // Make it case insensitive
    'i'
  );


  /**
   * Checks if the given value is an e-mail address.
   * @param {*} value Value to be checked.
   * @return {boolean} Whether the value is an e-mail address or not.
   */
  exports = module.exports = function (value) {
    return !!(
      value &&
      typeof value === 'string' &&
      value.length <= 254 &&
      EMAIL_PATTERN.test(value)
    );
  };
})();
