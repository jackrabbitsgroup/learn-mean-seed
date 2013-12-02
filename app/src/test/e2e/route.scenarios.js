'use strict';

var util =require('util');

/**
Forms the 'contains' xpath syntax necessary for finding a class in case it's not the ONLY class on the element
@method hasClass
*/
function hasClass(class1, params) {
	return "contains(concat(' ', @class, ' '), ' "+class1+" ')";
}

describe("E2E: Testing Routes", function() {

	var ptor =protractor.getInstance();
	
	// ptor.sleep(2000);		//trying to get PhantomJS browser to work.. Angular is not defined/ready yet?..
	
	//create random id so this user is unique
	var randString =Math.random().toString(36).substring(7)
	var randId =new Date().getTime()+'_'+randString;		//use timestamp also to ensure much lower probability of duplicates
	var numDigits =10;
	var randNum10 =Math.floor(Math.pow(10, numDigits-1) + Math.random() * 9 * Math.pow(10, numDigits-1));

	//user info
	var user1 ={
		name: 'e2e '+randString,
		email: 'e2e_'+randId+'@e2e.com',
		phone: {
			number: randNum10
		},
		password: 'e2eTesting'
	};
	var defaultPage ='test';		//the page we should go to by default (i.e. the 'otherwise' route)
	
	beforeEach(function() {
		// ptor =protractor.getInstance();
		// ptor.get('/');
		// ptor.driver.get('#/');
		// ptor.waitForAngular();		//trying to get PhantomJS browser to work.. Angular is not defined/ready yet?..
	});

	it('should jump to the default page path when / is accessed', function() {
		ptor.get('/');
		expect(ptor.getCurrentUrl()).toContain('/'+defaultPage);
	});
	
	//no login required routes
	it('should have a working /password-reset route', function() {
		ptor.get('/password-reset');
		expect(ptor.getCurrentUrl()).toContain("/password-reset");
	});
	
	//sign up
	it('should have a working /login route', function() {
		// ptor.get('/logout');		//ensure user is logged out first (otherwise will redirect to main/logged in page)
		// ptor.get('/user-deactivate?email='+user1.email);		//ensure user is not already a member (otherwise won't be able to sign up (again))		//UPDATE - now cleaning up at end with user-delete so no longer need this (and it slows things down anyway)
		
		ptor.get('/login');
		expect(ptor.getCurrentUrl()).toContain("/login");
		
		// var btnLogin =ptor.findElement(protractor.By.css('.login-form .btn-primary:submit'));
		var btnLogin =ptor.findElement(protractor.By.css('.login-form .btn-primary'));
		expect(btnLogin.getText()).toContain('Login');
	});
	
	it('should have a working /signup route and allow creating a new user', function() {
		ptor.get('/signup');
		expect(ptor.getCurrentUrl()).toContain("/signup");
		
		/*
		//outdated now that have both login and signup pages separately
		
		//click button to go to sign up
		// var ele =ptor.findElement(protractor.By.css('.login-signup .btn-link:nth-child(1)'));		//doesn't work - eq() is different than css selectors and handles this?
		// var ele =ptor.findElement(protractor.By.css('.login-signup .btn-link'));
		// var ele =ptor.findElement(protractor.By.css('.login-signup div:nth-child(1) div:nth-child(2) .btn-link'));		//doesn't work - wtf??
		// var ele =ptor.findElement(protractor.By.css('.login-signup > div:nth-child(1) > div:nth-last-child(1) .btn-link'));		//works... apparently only (1) works for nested nth-child or nth-last-child?? wtf?
		// var ele =ptor.findElement(protractor.By.xpath("/div[@class='login-signup']/div[1]/div[2]/*[@class='btn-link']"));
		// var ele =ptor.findElement(protractor.By.xpath("//div[@class='login-signup']/div[1]/div[2]"));
		// var ele =ptor.findElement(protractor.By.xpath("/html/body/div/div/div/div/div[1]/div[2]/span[@class='btn-link']"));
		// var ele =ptor.findElement(protractor.By.xpath("/html/body/div/div/div/div[contains(concat(' ', @class, ' '), ' login-signup ')]/div[1]/div[2]/*[@class='btn-link']"));
		// var ele =ptor.findElement(protractor.By.xpath("//div[contains(concat(' ', @class, ' '), ' login-signup ')]/div[1]/div[2]/*[@class='btn-link']"));
		var ele =ptor.findElement(protractor.By.xpath("//div["+hasClass('login-signup')+"]/div[1]/div[2]/*[@class='btn-link']"));
		expect(ele.getText()).toContain('Sign Up');
		ele.click();
		*/
		
		//fill in signup form
		var formSelector ='.signup-form form';
		ptor.findElement(protractor.By.css(formSelector+' .jrg-forminput-cont:nth-child(1) input')).sendKeys(user1.name);
		ptor.findElement(protractor.By.css(formSelector+' .jrg-forminput-cont:nth-child(2) input')).sendKeys(user1.email);
		// ptor.findElement(protractor.By.css(formSelector+' .jrg-forminput-cont:nth-child(3) input')).sendKeys(user1.phone.number);
		ptor.findElement(protractor.By.css(formSelector+' .jrg-forminput-cont:nth-child(3) input')).sendKeys(user1.password);
		ptor.findElement(protractor.By.css(formSelector+' .jrg-forminput-cont:nth-child(4) input')).sendKeys(user1.password);
		
		//submit form
		ptor.findElement(protractor.By.css('.signup-form form button.btn-primary')).click();
		
		//expect page redirect after successful login
		expect(ptor.getCurrentUrl()).toContain("/"+defaultPage);
	});
	
	//clean up - remove user (this is VITAL in case running tests in parallel - need to clear out afterward; deactivating at top isn't good enough; they should be gone all together)
	//must be LAST since other routes depend on being logged in!
	it('clean up - should delete user via a working /user-delete route', function() {
		ptor.get('/user-delete');
		expect(ptor.getCurrentUrl()).toContain("/"+defaultPage);		//should go to default page after logout is complete
	});
	
	/*
	//now deleting user, which will call logout automatically
	it('should have a working /logout route', function() {
		ptor.get('/logout');
		// expect(ptor.getCurrentUrl()).toContain("/logout");
		expect(ptor.getCurrentUrl()).toContain("/login");		//should go to login after logout is complete
	});
	*/

});
