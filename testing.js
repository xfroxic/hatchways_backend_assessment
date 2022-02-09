const axios = require('axios');
const expect  = require('chai').expect;
const request = require('request');

describe('Hatchways Back-End Assessment', function() {
  describe('Route 1', function() {
    it('Should return correct body for Route 1', function(done) {
        request('http://localhost:2222/api/ping', function(error, response, body) {
            expect(body).to.equal('{"success":"true"}');
            done();
        });
    });
    it('Should return correct status code for Route 1 if route is correct', function(done) {
      request('http://localhost:2222/api/ping', function(error, response, body) {
          expect(response.statusCode).to.equal(200);
          done();
      });
    });
    it('Should return the correct status code for route 1 if route is incorrect', function(done) {
      request('http://localhost:2222/api/pings', function(error, response, body) {
          expect(response.statusCode).to.equal(404);
          done();
      });
    });
  })
  describe('Route 2', function() {
    it('Should return correct status code for Route 2 if route is correct', function(done) {
      request('http://localhost:2222/api/posts/design', function(error, response, body) {
        expect(response.statusCode).to.equal(200);
        done();
      });
    });
    it('Should return correct status code for Route 2 if route is incorrect', function(done) {
      request('http://localhost:2222/api/post/design', function(error, response, body) {
          expect(response.statusCode).to.equal(404);
          done();
      });
    });
    it('Should return correct status code for Route 2 if route does not have a tag', function(done) {
      request('http://localhost:2222/api/posts', function(error, response, body) {
          expect(response.statusCode).to.equal(404);
          done();
      });
    });
    it('Should return correct status code for Route 2 when the user enters three parameters', function(done) {
      request('http://localhost:2222/api/posts/health,design/likes/desc', function(error, response, body) {
          expect(response.statusCode).to.equal(200);
          done();
      });
    });
    it('Should pass test if all posts are unique by checking unique ids', function(done) {
      axios.get('http://localhost:2222/api/posts/design,politics')
      .then(res => {
        let post = res.data;
        let postID = [];
        let postObj = {};
        let test = true;
        // Collect post IDs
        for (let i = 0; i < post.length; i++) {
          postID.push(post[i].id)
        }
        // Compare each ID with the number of times the post appears
        postID.forEach(blog => {
          postObj[blog] = postObj[blog] ? postObj[blog] + 1 : 1
        })
        // If post appears more than once, test should fail
        for (let key in postObj) {
          if (postObj[key] > 1) {
            test = false
          }
        }
        expect(test).to.equal(true);
        })
        .catch(error => {
          console.log(error)
        })
        done();
    });
    it('Should pass test if all posts are unique by checking for unique post ids while using all route parameters', function(done) {
      axios.get('http://localhost:2222/api/posts/design,politics/likes/asc')
      .then(res => {
        let post = res.data;
        let postID = [];
        let postObj = {};
        let test = true;
        // Collect post IDs
        for (let i = 0; i < post.length; i++) {
          postID.push(post[i].id)
        }
        // Compare each ID with the number of times the post appears
        postID.forEach(blog => {
          postObj[blog] = postObj[blog] ? postObj[blog] + 1 : 1
        })
        // If post appears more than once, test should fail
        for (let key in postObj) {
          if (postObj[key] > 1) {
            test = false
          }
        }
        expect(test).to.equal(true);
        })
        .catch(error => {
          console.log(error)
        })
        done();
    });
    it('Should pass test for correctly sorted likes', function(done) {
      axios.get('http://localhost:2222/api/posts/design,startup/likes/desc')
      .then(res => {
        let post = res.data;
        let postLikes = [];
        let test = true;
        // Collect post likes
        for (let i = 0; i < post.length; i++) {
          postLikes.push(post[i].likes)
        }
        // Compare likes of current post to next post. If current likes > next post likes, test fails.
        for (let i = 0; i < postLikes.length; i++) {
          if (postLikes[i] < postLikes[i + 1]) {
            test = false;
          }
        }
        expect(test).to.equal(true);
        })
        .catch(error => {
          console.log(error)
        })
        done();
    });
  });
});