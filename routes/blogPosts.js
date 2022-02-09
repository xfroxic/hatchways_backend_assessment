const axios = require('axios');

// Route for Step 1
const route1 = (req, res) => {
  res.status(200).send({
    success: 'true',
  })
}

// Route for Step 2
const route2 = (req, res) => {
  const { tags, sortBy, direction } = req.params;
  const sortOptions = ['id', 'author', 'authorId', 'likes', 'popularity', 'reads', 'tags', undefined];
  const sortDirections = ['asc', 'desc', undefined];

  // Error handling for invalid entries
  if (sortOptions.indexOf(sortBy) === - 1) {
    res.status(400).send({
      err: 'sortBy parameter is invalid',
    });
  }
  if (sortDirections.indexOf(direction) === -1) {
    res.status(400).send({
      err: 'sortBy parameter is invalid',
    });
  }

  // Handling multiple tags
  if (tags.indexOf(',') !== - 1) {
    let tagArray = tags.split(',');
    let getPaths = tagArray.map((tag, i) => {
      return axios.get(`http://hatchways.io/api/assessment/blog/posts?tag=${tag}&sortBy=${sortBy}&direction=${direction}`)
    });
    axios.all([
      ...getPaths
    ])
    // Handling all of the possible tags, 9 total
      .then(axios.spread((tag1, tag2, tag3, tag4, tag5, tag6, tag7, tag8, tag9) => {
        let data = [
          tag1 ? tag1.data.posts : '',
          tag2 ? tag2.data.posts : '',
          tag3 ? tag3.data.posts : '',
          tag4 ? tag4.data.posts : '',
          tag5 ? tag5.data.posts : '',
          tag6 ? tag6.data.posts : '',
          tag7 ? tag7.data.posts : '',
          tag8 ? tag8.data.posts : '',
          tag9 ? tag9.data.posts : ''
        ]
        // Creating a table with blog post IDs to prevent duplicates from being displayed
        let post = {};
        let posts = [];
        for (let i = 0; i < data.length; i++) {
          let blog = data[i];
          for (let i = 0; i < blog.length; i++) {
            post[blog[i].id] = blog[i];
          }
        }

        for (let key in post) {
          posts.push(post[key]);
        }

        if (sortBy) {
          if (direction === 'desc') {
            posts = posts.sort((x, y) => (y[sortBy] > x[sortBy]) ? 1 : -1);
          } else {
            posts = posts.sort((x, y) => (y[sortBy] < x[sortBy]) ? 1 : -1);
          }
        }
        
        res.status(200).send(posts);
      }))
      // Error handling if no tag is provided by the user
      .catch(err => {
        res.status(400).send({
          err: 'Tags parameter is required',
        })
        console.log(err)
      });
      // Using a final else statement for sorting by one tag
  } else {
    axios.get(`http://hatchways.io/api/assessment/blog/posts?tag=${tags}&sortBy=${sortBy}&direction=${direction}`)
      .then(request => {
        let data = request.data.posts;
        if (sortBy) {
          if (direction === 'desc') {
            data = data.sort((x, y) => (y[sortBy] > x[sortBy]) ? 1 : -1);
          } else {
            data = data.sort((x, y) => (y[sortBy] < x[sortBy]) ? 1 : -1);
          }
        }
        res.status(200).send(data);
      })
      // Error handling again in the event of no tag being provided
      .catch(err => {
        res.status(400).send({
          err: 'Tags parameter is required',
        })
        console.log(err)
      });
  }
}

module.exports = {
  route1,
  route2
}