'use strict';

var util =require('util');

/**
Forms the 'contains' xpath syntax necessary for finding a class in case it's not the ONLY class on the element
@method hasClass
*/
function hasClass(class1, params) {
	return "contains(concat(' ', @class, ' '), ' "+class1+" ')";
}

describe("E2E: Testing AngularForminputBasicCtrl", function() {

	var ptor =protractor.getInstance();
	
	beforeEach(function() {
	});

	it('should have "my text" as the input label', function() {
		ptor.get('/angular-forminput-basic');
		
		var label =ptor.findElement(protractor.By.css('form .jrg-forminput label'));
		expect(label.getText()).toContain('my text');
	});

});
