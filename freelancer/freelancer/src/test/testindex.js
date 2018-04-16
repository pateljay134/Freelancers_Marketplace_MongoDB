var assert = require('assert');
var http = require('http');
var request = require('request');

it('User Projects', function (done) {
    request.post('http://localhost:3001/userprojects',
        { form: {email : "jay1@gmail.com"} },
        function (error, response, body) {
            assert.equal(200, response.statusCode);
            done();
        });
});

it('Search Projects', function (done) {
    request.post('http://localhost:3001/searchprojects',
        { form: {search_data : "React"} },
        function (error, response, body) {
            assert.equal(200, response.statusCode);
            done();
        });
});

it('Searching in User Bidded Projects', function (done) {
    request.post('http://localhost:3001/searchbiddedproject',
        { form: {search_data : "Website", email:"jay1@gmail.com"} },
        function (error, response, body) {
            assert.equal(200, response.statusCode);
            done();
        });
});
it('User Bids', function (done) {
    request.post('http://localhost:3001/userbids',
        { form: {username : "jay1@gmail.com"} },
        function (error, response, body) {
            assert.equal(200, response.statusCode);
            done();
        });
});
it('Add Money', function (done) {
    request.post('http://localhost:3001/balanceupdate',
        { form: {email : "jay1@gmail.com", name_on_card : "Jay Patel", card_number : 543456543454345, amount : 200, expiry_date : 12/20, cvv : 345} },
        function (error, response, body) {
            assert.equal(200, response.statusCode);
            done();
        });
});