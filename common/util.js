'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.universalXMLHttpRequest = exports.isNode = undefined;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _xmlhttprequest = require('xmlhttprequest');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isNode = new Function("try {return this===global;}catch(e){return false;}");

var universalXMLHttpRequest = function universalXMLHttpRequest(query) {
  var method = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'get';
  var postData = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

  return new _promise2.default(function (resolve, reject) {
    var xhr = isNode() ? new _xmlhttprequest.XMLHttpRequest() : new XMLHttpRequest();

    xhr.open(method, query, true);
    xhr.responseType = 'json';

    if (isNode()) {
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            throw new Error(xhr.status + ' : ' + xhr.responseText);
          }
        }
      };
    } else {
      xhr.onload = function () {
        if (xhr.status === 200) {
          resolve(xhr.response);
        } else {
          throw new Error('response : ' + xhr.status + ' - ' + xhr.response);
        }
      };

      xhr.onerror = function () {
        throw new Error('response : ' + xhr.status + ' - ' + xhr.response);
      };
    }

    xhr.send(postData);
  });
};

exports.isNode = isNode;
exports.universalXMLHttpRequest = universalXMLHttpRequest;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbImlzTm9kZSIsIkZ1bmN0aW9uIiwidW5pdmVyc2FsWE1MSHR0cFJlcXVlc3QiLCJxdWVyeSIsIm1ldGhvZCIsInBvc3REYXRhIiwicmVzb2x2ZSIsInJlamVjdCIsInhociIsIlhIUiIsIlhNTEh0dHBSZXF1ZXN0Iiwib3BlbiIsInJlc3BvbnNlVHlwZSIsIm9ucmVhZHlzdGF0ZWNoYW5nZSIsInJlYWR5U3RhdGUiLCJzdGF0dXMiLCJKU09OIiwicGFyc2UiLCJyZXNwb25zZVRleHQiLCJFcnJvciIsIm9ubG9hZCIsInJlc3BvbnNlIiwib25lcnJvciIsInNlbmQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFFQSxJQUFNQSxTQUFTLElBQUlDLFFBQUosQ0FBYSxvREFBYixDQUFmOztBQUVBLElBQU1DLDBCQUEwQixTQUExQkEsdUJBQTBCLENBQUNDLEtBQUQsRUFBNEM7QUFBQSxNQUFwQ0MsTUFBb0MsdUVBQTNCLEtBQTJCO0FBQUEsTUFBcEJDLFFBQW9CLHVFQUFULElBQVM7O0FBQzFFLFNBQU8sc0JBQVksVUFBQ0MsT0FBRCxFQUFVQyxNQUFWLEVBQXFCO0FBQ3RDLFFBQU1DLE1BQU1SLFdBQVcsSUFBSVMsOEJBQUosRUFBWCxHQUF1QixJQUFJQyxjQUFKLEVBQW5DOztBQUVBRixRQUFJRyxJQUFKLENBQVNQLE1BQVQsRUFBaUJELEtBQWpCLEVBQXdCLElBQXhCO0FBQ0FLLFFBQUlJLFlBQUosR0FBbUIsTUFBbkI7O0FBRUEsUUFBSVosUUFBSixFQUFjO0FBQ1pRLFVBQUlLLGtCQUFKLEdBQXlCLFlBQU07QUFDN0IsWUFBSUwsSUFBSU0sVUFBSixLQUFtQixDQUF2QixFQUEwQjtBQUN4QixjQUFJTixJQUFJTyxNQUFKLEtBQWUsR0FBbkIsRUFBd0I7QUFDdEJULG9CQUFRVSxLQUFLQyxLQUFMLENBQVdULElBQUlVLFlBQWYsQ0FBUjtBQUNELFdBRkQsTUFFTztBQUNMLGtCQUFNLElBQUlDLEtBQUosQ0FBYVgsSUFBSU8sTUFBakIsV0FBNkJQLElBQUlVLFlBQWpDLENBQU47QUFDRDtBQUNGO0FBQ0YsT0FSRDtBQVNELEtBVkQsTUFVTztBQUNMVixVQUFJWSxNQUFKLEdBQWEsWUFBTTtBQUNqQixZQUFJWixJQUFJTyxNQUFKLEtBQWUsR0FBbkIsRUFBd0I7QUFDdEJULGtCQUFRRSxJQUFJYSxRQUFaO0FBQ0QsU0FGRCxNQUVPO0FBQ0wsZ0JBQU0sSUFBSUYsS0FBSixpQkFBd0JYLElBQUlPLE1BQTVCLFdBQXdDUCxJQUFJYSxRQUE1QyxDQUFOO0FBQ0Q7QUFDRixPQU5EOztBQVFBYixVQUFJYyxPQUFKLEdBQWMsWUFBTTtBQUNsQixjQUFNLElBQUlILEtBQUosaUJBQXdCWCxJQUFJTyxNQUE1QixXQUF3Q1AsSUFBSWEsUUFBNUMsQ0FBTjtBQUNELE9BRkQ7QUFHRDs7QUFFRGIsUUFBSWUsSUFBSixDQUFTbEIsUUFBVDtBQUNELEdBL0JNLENBQVA7QUFnQ0QsQ0FqQ0Q7O1FBbUNTTCxNLEdBQUFBLE07UUFBUUUsdUIsR0FBQUEsdUIiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBYTUxIdHRwUmVxdWVzdCBhcyBYSFIgfSBmcm9tICd4bWxodHRwcmVxdWVzdCc7XG5cbmNvbnN0IGlzTm9kZSA9IG5ldyBGdW5jdGlvbihcInRyeSB7cmV0dXJuIHRoaXM9PT1nbG9iYWw7fWNhdGNoKGUpe3JldHVybiBmYWxzZTt9XCIpO1xuXG5jb25zdCB1bml2ZXJzYWxYTUxIdHRwUmVxdWVzdCA9IChxdWVyeSwgbWV0aG9kID0gJ2dldCcsIHBvc3REYXRhID0gbnVsbCkgPT4ge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGNvbnN0IHhociA9IGlzTm9kZSgpID8gbmV3IFhIUigpIDogbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cbiAgICB4aHIub3BlbihtZXRob2QsIHF1ZXJ5LCB0cnVlKTtcbiAgICB4aHIucmVzcG9uc2VUeXBlID0gJ2pzb24nO1xuXG4gICAgaWYgKGlzTm9kZSgpKSB7XG4gICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT4ge1xuICAgICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgPT09IDQpIHtcbiAgICAgICAgICBpZiAoeGhyLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgICAgICByZXNvbHZlKEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCkpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7eGhyLnN0YXR1c30gOiAke3hoci5yZXNwb25zZVRleHR9YCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHhoci5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICAgIGlmICh4aHIuc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgICByZXNvbHZlKHhoci5yZXNwb25zZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGByZXNwb25zZSA6ICR7eGhyLnN0YXR1c30gLSAke3hoci5yZXNwb25zZX1gKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB4aHIub25lcnJvciA9ICgpID0+IHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGByZXNwb25zZSA6ICR7eGhyLnN0YXR1c30gLSAke3hoci5yZXNwb25zZX1gKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB4aHIuc2VuZChwb3N0RGF0YSk7XG4gIH0pO1xufTtcblxuZXhwb3J0IHsgaXNOb2RlLCB1bml2ZXJzYWxYTUxIdHRwUmVxdWVzdCB9OyJdfQ==