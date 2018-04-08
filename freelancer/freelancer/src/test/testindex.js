var assert = require('assert');
var http = require('http');
var request = require('request');

it('CheckEmail', function (done) {
    request.post('http://localhost:3001/checkemail',
        { form: {username : "jay@gmail.com"} },
        function (error, response, body) {
            assert.equal(200, response.statusCode);
            done();
        });
});

it('SignIn', function (done) {
    request.post('http://localhost:3001/signinprocess',
        { form: {username : "jay@gmail.com", password : "Jay@1234"} },
        function (error, response, body) {
            assert.equal(200, response.statusCode);
            done();
        });
});

it('Projects Fetch', function (done) {
    request.post('http://localhost:3001/projectsfetch',
        function (error, response, body) {
            assert.equal(200, response.statusCode);
            done();
        });
});
it('User Bids', function (done) {
    request.post('http://localhost:3001/userbids',
        { form: {username : "jay@gmail.com"} },
        function (error, response, body) {
            assert.equal(200, response.statusCode);
            done();
        });
});
it('Users Project', function (done) {
    request.post('http://localhost:3001/userprojects',
        { form: {username : "jay@gmail.com"} },
        function (error, response, body) {
            assert.equal(200, response.statusCode);
            done();
        });
});