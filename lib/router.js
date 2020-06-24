'use strict';
const util = require('./handler-util');

function route(req, res) {
  switch(req.url){
    case './favicon.ico':
      util.handleFavicon(req, res);
      break;
    default:
      util.handleNotFound(req, res);
      break;  
  }

}


module.exports = {
  route
};