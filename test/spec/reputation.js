/* global describe, it, expect, prepareNewReputation, BAD_COLOR */

(function () {
  'use strict';

  describe('In the background page', function () {
    describe('prepareNewReputation', function () {
      it('should handle positive values', function () {
        var result = prepareNewReputation(5);

        expect(result.text).to.be.eql('+ 5');
        expect(result.color).to.be.eql(OK_COLOR);
      });
      it('should handle negative values', function () {
        var result = prepareNewReputation(-5);

        expect(result.text).to.be.eql('- 5');
        expect(result.color).to.be.eql(BAD_COLOR);
      });
    });
  });
})();
