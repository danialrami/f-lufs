'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _map = require('babel-runtime/core-js/map');

var _map2 = _interopRequireDefault(_map);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _from = require('babel-runtime/core-js/array/from');

var _from2 = _interopRequireDefault(_from);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _https = require('https');

var _https2 = _interopRequireDefault(_https);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _FreesoundQuery2 = require('../common/FreesoundQuery');

var _FreesoundQuery3 = _interopRequireDefault(_FreesoundQuery2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cwd = process.cwd();

var defaults = {
  destination: '.',
  publicPath: 'public',
  storeSoundsInfo: false
};

/**
 * @memberof module:server
 *
 * @class <b><h5>server.SimpleFreesound</h5></b>
 *
 * Server side class for use in <code>Node.js</code>, allowing to query detailed
 * info on sounds and download them from
 * <a href="http://freesound.org" target="_blank">freesound</a>.
 *
 * - members
 *     - [soundsInfo]{@link module:server.SimpleFreesound#soundsInfo}
 *     - [currentSoundsInfo]{@link module:server.SimpleFreesound#currentSoundsInfo}
 * - methods
 *     - [query]{@link module:server.SimpleFreesound#query}
 *     - [queryFromIds]{@link module:server.SimpleFreesound#queryFromIds}
 *     - [download]{@link module:server.SimpleFreesound#download}
 *     - [queryAndDownload]{@link module:server.SimpleFreesound#queryAndDownload}
 *     - [clear]{@link module:server.SimpleFreesound#clear}
 *     - [readFromFile]{@link module:server.SimpleFreesound#readFromFile}
 *     - [writeToFile]{@link module:server.SimpleFreesound#writeToFile}
 *
 * Powered by
 * <a href="http://freesound.org/docs/api/" target="_blank">freesound api</a>.
 *
 * @param {String} apiKey - Your api key, as generated from your freesound
 * developer account when creating a new application.
 * @param {Object} options - Configuration options.
 * @param {String} [options.publicPath='public'] - The public path (relative to node's cwd) of the folder where clients can access files.
 * @param {String} [options.destination='.'] - The path (relative to the public path) of the folder where to download files.
 * @param {Boolean} [options.storeSoundsInfo=false] - Store all sounds detailed informations,
 * including preview urls, to optimize the number of queries to the API (can be memory consuming).
 *
 * @example
 * import SimpleFreesound from 'simple-freesound';
 *
 * const fs = new SimpleFreesound('your_freesound_api_key_goes_here', {
 *   destination: './downloads'
 * });
 * fs.query({
 *   search: [ 'space', 'insect' ],
 *   duration: [ 1, 20 ],
 * })
 * .then(() => fs.download())
 * .then(() => {
 *   console.log(fs.currentSoundsInfo);
 * });
 */

var SimpleFreesound = function (_FreesoundQuery) {
  (0, _inherits3.default)(SimpleFreesound, _FreesoundQuery);

  /** @constructor */
  function SimpleFreesound(apiKey) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    (0, _classCallCheck3.default)(this, SimpleFreesound);

    var opts = (0, _assign2.default)({}, defaults, options);

    var _this = (0, _possibleConstructorReturn3.default)(this, (SimpleFreesound.__proto__ || (0, _getPrototypeOf2.default)(SimpleFreesound)).call(this, apiKey, opts.storeSoundsInfo));

    _this.destination = opts.destination;
    _this.publicPath = opts.publicPath;
    return _this;
  }

  /**
   * An object containing every detailed information obtained since
   * instantiation or last call to
   * [<code>clear()</code>]{@link module:server.SimpleFreesound#clear}.
   *
   * @property {Object} soundsInfo
   */


  (0, _createClass3.default)(SimpleFreesound, [{
    key: 'query',


    /**
     * Get a list of sound ids with detailed information, that correspond to a set of query parameters.
     *
     * @param {Object} queryParams - The parameters used to build the query.
     * @param {Array.String} [queryParams.search] - The search terms that will be used to build the query.
     * @param {Array.String} [queryParams.username] - A list of usernames to search files from.
     * @param {Array} [queryParams.duration] - An array of size 2 : [ minDuration, maxDuration ] (in seconds).
     * If maxDuration is not a number, it will be interpreted as "*" (no maximum duration).
     *
     * @returns {Promise} A Promise object that resolves with the list of new sound ids if the query goes well.
     *
     * @throws {Error} An error if a problem occurs during the query.
     */
    value: function query(queryParams) {
      return (0, _get3.default)(SimpleFreesound.prototype.__proto__ || (0, _getPrototypeOf2.default)(SimpleFreesound.prototype), 'query', this).call(this, queryParams);
    }

    /**
     * Get detailed information of sounds from their ids.
     *
     * @param {Array.Number} ids - The ids of the sounds we want to get the detailed info of.
     *
     * @returns {Promise} A promise that will resolve with an array of the sound ids
     * the detailed info of which needed to be queried.
     *
     * @throws {Error} An error if a problem occurs during the query.
     */

  }, {
    key: 'queryFromIds',
    value: function queryFromIds(ids) {
      return (0, _get3.default)(SimpleFreesound.prototype.__proto__ || (0, _getPrototypeOf2.default)(SimpleFreesound.prototype), 'queryFromIds', this).call(this, ids);
    }

    /**
     * Download hq mp3 previews from their sound ids.
     *
     * @param {Array.Number} [ids=null] - The ids of the sounds to download.
     * If <code>null</code>, the ids from
     * [<code>currentSoundsInfo</code>]{@link module:server.SimpleFreesound#currentSoundsInfo}
     * will be used.
     *
     * @returns {Promise} A promise that will resolve if the downloads go well.
     *
     * @throws {Error} An error if a problem occurs during the downloads.
     */

  }, {
    key: 'download',
    value: function download() {
      var ids = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      if (ids === null) {
        ids = (0, _from2.default)(this._currentSoundsInfo.keys());
      }

      return this._downloadFilesFromUrls(ids);
    }

    /**
     * Download hq mp3 previews from queried sound information.
     *
     * @param {Object} queryParams - The parameters used to build the query.
     * @param {Array.String} [queryParams.search] - The search terms that will be used to build the query.
     * @param {Array.String} [queryParams.username] - A list of usernames to search files from.
     * @param {Array} [queryParams.duration] - An array of size 2 : [ minDuration, maxDuration ] (in seconds).
     * If maxDuration is not a number, it will be interpreted as "*" (no maximum duration).
     *
     * @param {String} [destination='.'] - The folder in which to save the downloaded files.
     *
     * @returns {Promise} A Promise object that resolves if the downloads go well.
     *
     * @throws {Error} An error if a problem occurs during the downloads.
     */

  }, {
    key: 'queryAndDownload',
    value: function queryAndDownload(queryParams) {
      var _this2 = this;

      return new _promise2.default(function (resolve, reject) {
        (0, _get3.default)(SimpleFreesound.prototype.__proto__ || (0, _getPrototypeOf2.default)(SimpleFreesound.prototype), 'query', _this2).call(_this2, queryParams).then(function (updatedIds) {
          return _this2._downloadFilesFromUrls(updatedIds);
        }).then(function (updatedIds) {
          return resolve(updatedIds);
        });
      });
    }

    /***
     * Cancel all unresolved yet promises (queries and downloads).
     */

  }, {
    key: 'abort',
    value: function abort() {}
    // TODO (no native way to cancel unresolved yet promises)
    // maybe using Promise.race() with a cancellable promise and
    // the result of Promise.all in a same Array / iterable ... ?


    /** @private */

  }, {
    key: '_downloadFilesFromUrls',
    value: function _downloadFilesFromUrls(ids) {
      var promises = [];

      for (var i = 0; i < ids.length; i++) {
        promises.push(this._downloadFileFromUrl(ids[i]));
      }

      return _promise2.default.all(promises);
    }

    /** @private */

  }, {
    key: '_downloadFileFromUrl',
    value: function _downloadFileFromUrl(id) {
      var _this3 = this;

      return new _promise2.default(function (resolve, reject) {
        var dst = _path2.default.join(cwd, _this3.publicPath, _this3.destination, id + '.mp3');
        var file = _fs2.default.createWriteStream(dst);
        var url = _this3._soundsInfo.get(id).previews['preview-hq-mp3'];
        url = url.split(':');
        url[0] = 'https';
        url = url.join(':');

        var request = _https2.default.get(url, function (response) {
          response.pipe(file);

          file.on('finish', function () {
            var url = _path2.default.join(_this3.destination, id + '.mp3');
            _this3._soundsInfo.get(id).localUrl = url;
            _this3._currentSoundsInfo.get(id).localUrl = url;
            file.close();
            resolve();
          });

          file.on('error', function (err) {
            console.error(err);
            _fs2.default.unlink(dst);
            throw new Error('Error downloading file ' + id + ' : ' + err);
          });
        });
      });
    }

    /**
     * Clear the internal sound information lists.
     */

  }, {
    key: 'clear',
    value: function clear() {
      this._soundsInfo = new _map2.default();
      this._currentSoundsInfo = new _map2.default();
    }

    /**
     * Retrieve sound information list from a JSON file.
     *
     * @param {String} filename - Url of the file to read.
     */

  }, {
    key: 'readFromFile',
    value: function readFromFile(filename) {
      var si = JSON.parse(_fs2.default.readFileSync(filename, 'utf-8'));

      if (si) {
        this._soundsInfo = new _map2.default();

        for (var i in si) {
          this._soundsInfo.set(si[i]['id'], si[i]);
        }
      }
    }

    /**
     * Dump sound information list to a JSON file.
     *
     * @param {String} filename - Url of the file to dump the list of file information to.
     */

  }, {
    key: 'writeToFile',
    value: function writeToFile(filename) {
      _fs2.default.writeFileSync(filename, (0, _stringify2.default)(this._mapToObject(this._soundsInfo), null, 2), 'utf-8');
    }
  }, {
    key: 'soundsInfo',
    get: function get() {
      return this._mapToObject(this._soundsInfo);
    },
    set: function set(si) {
      this._soundsInfo = this._objectToMap(si);
    }

    /**
     * An object containing the detailed information obtained from the last call to
     * [<code>query()</code>]{@link module:server.SimpleFreesound#query},
     * [<code>queryFromIds()</code>]{@link module:server.SimpleFreesound#queryFromIds},
     * [<code>download()</code>]{@link module:server.SimpleFreesound#download} or
     * [<code>queryAndDownload()</code>]{@link module:server.SimpleFreesound#queryAndDownload}.
     *
     * @property {Object} currentSoundsInfo
     */

  }, {
    key: 'currentSoundsInfo',
    get: function get() {
      return this._mapToObject(this._currentSoundsInfo);
    },
    set: function set(csi) {
      this._currentSoundsInfo = this._objectToMap(csi);
    }
  }]);
  return SimpleFreesound;
}(_FreesoundQuery3.default);

;

exports.default = SimpleFreesound;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbImN3ZCIsInByb2Nlc3MiLCJkZWZhdWx0cyIsImRlc3RpbmF0aW9uIiwicHVibGljUGF0aCIsInN0b3JlU291bmRzSW5mbyIsIlNpbXBsZUZyZWVzb3VuZCIsImFwaUtleSIsIm9wdGlvbnMiLCJvcHRzIiwicXVlcnlQYXJhbXMiLCJpZHMiLCJfY3VycmVudFNvdW5kc0luZm8iLCJrZXlzIiwiX2Rvd25sb2FkRmlsZXNGcm9tVXJscyIsInJlc29sdmUiLCJyZWplY3QiLCJ0aGVuIiwidXBkYXRlZElkcyIsInByb21pc2VzIiwiaSIsImxlbmd0aCIsInB1c2giLCJfZG93bmxvYWRGaWxlRnJvbVVybCIsImFsbCIsImlkIiwiZHN0IiwicGF0aCIsImpvaW4iLCJmaWxlIiwiZnMiLCJjcmVhdGVXcml0ZVN0cmVhbSIsInVybCIsIl9zb3VuZHNJbmZvIiwiZ2V0IiwicHJldmlld3MiLCJzcGxpdCIsInJlcXVlc3QiLCJodHRwcyIsInJlc3BvbnNlIiwicGlwZSIsIm9uIiwibG9jYWxVcmwiLCJjbG9zZSIsImNvbnNvbGUiLCJlcnJvciIsImVyciIsInVubGluayIsIkVycm9yIiwiZmlsZW5hbWUiLCJzaSIsIkpTT04iLCJwYXJzZSIsInJlYWRGaWxlU3luYyIsInNldCIsIndyaXRlRmlsZVN5bmMiLCJfbWFwVG9PYmplY3QiLCJfb2JqZWN0VG9NYXAiLCJjc2kiLCJGcmVlc291bmRRdWVyeSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBOzs7Ozs7QUFFQSxJQUFNQSxNQUFNQyxRQUFRRCxHQUFSLEVBQVo7O0FBRUEsSUFBTUUsV0FBVztBQUNmQyxlQUFhLEdBREU7QUFFZkMsY0FBWSxRQUZHO0FBR2ZDLG1CQUFpQjtBQUhGLENBQWpCOztBQU1BOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUErQ01DLGU7OztBQUNKO0FBQ0EsMkJBQVlDLE1BQVosRUFBa0M7QUFBQSxRQUFkQyxPQUFjLHVFQUFKLEVBQUk7QUFBQTs7QUFDaEMsUUFBTUMsT0FBTyxzQkFBYyxFQUFkLEVBQWtCUCxRQUFsQixFQUE0Qk0sT0FBNUIsQ0FBYjs7QUFEZ0Msd0pBRTFCRCxNQUYwQixFQUVsQkUsS0FBS0osZUFGYTs7QUFHaEMsVUFBS0YsV0FBTCxHQUFtQk0sS0FBS04sV0FBeEI7QUFDQSxVQUFLQyxVQUFMLEdBQWtCSyxLQUFLTCxVQUF2QjtBQUpnQztBQUtqQzs7QUFFRDs7Ozs7Ozs7Ozs7OztBQWdDQTs7Ozs7Ozs7Ozs7OzswQkFhTU0sVyxFQUFhO0FBQ2pCLDJKQUFtQkEsV0FBbkI7QUFDRDs7QUFFRDs7Ozs7Ozs7Ozs7OztpQ0FVYUMsRyxFQUFLO0FBQ2hCLGtLQUEwQkEsR0FBMUI7QUFDRDs7QUFFRDs7Ozs7Ozs7Ozs7Ozs7OytCQVlxQjtBQUFBLFVBQVpBLEdBQVksdUVBQU4sSUFBTTs7QUFDbkIsVUFBSUEsUUFBUSxJQUFaLEVBQWtCO0FBQ2hCQSxjQUFNLG9CQUFXLEtBQUtDLGtCQUFMLENBQXdCQyxJQUF4QixFQUFYLENBQU47QUFDRDs7QUFFRCxhQUFPLEtBQUtDLHNCQUFMLENBQTRCSCxHQUE1QixDQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7OztxQ0FlaUJELFcsRUFBYTtBQUFBOztBQUM1QixhQUFPLHNCQUFZLFVBQUNLLE9BQUQsRUFBVUMsTUFBVixFQUFxQjtBQUN0QywwSkFBWU4sV0FBWixFQUNHTyxJQURILENBQ1E7QUFBQSxpQkFBYyxPQUFLSCxzQkFBTCxDQUE0QkksVUFBNUIsQ0FBZDtBQUFBLFNBRFIsRUFFR0QsSUFGSCxDQUVRO0FBQUEsaUJBQWNGLFFBQVFHLFVBQVIsQ0FBZDtBQUFBLFNBRlI7QUFHRCxPQUpNLENBQVA7QUFLRDs7QUFFRDs7Ozs7OzRCQUdRLENBSVA7QUFIQztBQUNBO0FBQ0E7OztBQUdGOzs7OzJDQUN1QlAsRyxFQUFLO0FBQzFCLFVBQU1RLFdBQVcsRUFBakI7O0FBRUEsV0FBSyxJQUFJQyxJQUFJLENBQWIsRUFBZ0JBLElBQUlULElBQUlVLE1BQXhCLEVBQWdDRCxHQUFoQyxFQUFxQztBQUNuQ0QsaUJBQVNHLElBQVQsQ0FBYyxLQUFLQyxvQkFBTCxDQUEwQlosSUFBSVMsQ0FBSixDQUExQixDQUFkO0FBQ0Q7O0FBRUQsYUFBTyxrQkFBUUksR0FBUixDQUFZTCxRQUFaLENBQVA7QUFDRDs7QUFFRDs7Ozt5Q0FDcUJNLEUsRUFBSTtBQUFBOztBQUN2QixhQUFPLHNCQUFZLFVBQUNWLE9BQUQsRUFBVUMsTUFBVixFQUFxQjtBQUN0QyxZQUFNVSxNQUFNQyxlQUFLQyxJQUFMLENBQVU1QixHQUFWLEVBQWUsT0FBS0ksVUFBcEIsRUFBZ0MsT0FBS0QsV0FBckMsRUFBcURzQixFQUFyRCxVQUFaO0FBQ0EsWUFBTUksT0FBT0MsYUFBR0MsaUJBQUgsQ0FBcUJMLEdBQXJCLENBQWI7QUFDQSxZQUFJTSxNQUFNLE9BQUtDLFdBQUwsQ0FBaUJDLEdBQWpCLENBQXFCVCxFQUFyQixFQUF5QlUsUUFBekIsQ0FBa0MsZ0JBQWxDLENBQVY7QUFDQUgsY0FBTUEsSUFBSUksS0FBSixDQUFVLEdBQVYsQ0FBTjtBQUNBSixZQUFJLENBQUosSUFBUyxPQUFUO0FBQ0FBLGNBQU1BLElBQUlKLElBQUosQ0FBUyxHQUFULENBQU47O0FBRUEsWUFBTVMsVUFBVUMsZ0JBQU1KLEdBQU4sQ0FDZEYsR0FEYyxFQUVkLG9CQUFZO0FBQ1ZPLG1CQUFTQyxJQUFULENBQWNYLElBQWQ7O0FBRUFBLGVBQUtZLEVBQUwsQ0FBUSxRQUFSLEVBQWtCLFlBQU07QUFDdEIsZ0JBQU1ULE1BQU1MLGVBQUtDLElBQUwsQ0FBVSxPQUFLekIsV0FBZixFQUErQnNCLEVBQS9CLFVBQVo7QUFDQSxtQkFBS1EsV0FBTCxDQUFpQkMsR0FBakIsQ0FBcUJULEVBQXJCLEVBQXlCaUIsUUFBekIsR0FBb0NWLEdBQXBDO0FBQ0EsbUJBQUtwQixrQkFBTCxDQUF3QnNCLEdBQXhCLENBQTRCVCxFQUE1QixFQUFnQ2lCLFFBQWhDLEdBQTJDVixHQUEzQztBQUNBSCxpQkFBS2MsS0FBTDtBQUNBNUI7QUFDRCxXQU5EOztBQVFBYyxlQUFLWSxFQUFMLENBQVEsT0FBUixFQUFpQixlQUFPO0FBQ3RCRyxvQkFBUUMsS0FBUixDQUFjQyxHQUFkO0FBQ0FoQix5QkFBR2lCLE1BQUgsQ0FBVXJCLEdBQVY7QUFDQSxrQkFBTSxJQUFJc0IsS0FBSiw2QkFBb0N2QixFQUFwQyxXQUE0Q3FCLEdBQTVDLENBQU47QUFDRCxXQUpEO0FBS0QsU0FsQmEsQ0FBaEI7QUFvQkQsT0E1Qk0sQ0FBUDtBQTZCRDs7QUFFRDs7Ozs7OzRCQUdRO0FBQ04sV0FBS2IsV0FBTCxHQUFtQixtQkFBbkI7QUFDQSxXQUFLckIsa0JBQUwsR0FBMEIsbUJBQTFCO0FBQ0Q7O0FBRUQ7Ozs7Ozs7O2lDQUthcUMsUSxFQUFVO0FBQ3JCLFVBQUlDLEtBQUtDLEtBQUtDLEtBQUwsQ0FBV3RCLGFBQUd1QixZQUFILENBQWdCSixRQUFoQixFQUEwQixPQUExQixDQUFYLENBQVQ7O0FBRUEsVUFBSUMsRUFBSixFQUFRO0FBQ04sYUFBS2pCLFdBQUwsR0FBbUIsbUJBQW5COztBQUVBLGFBQUssSUFBSWIsQ0FBVCxJQUFjOEIsRUFBZCxFQUFrQjtBQUNoQixlQUFLakIsV0FBTCxDQUFpQnFCLEdBQWpCLENBQXFCSixHQUFHOUIsQ0FBSCxFQUFNLElBQU4sQ0FBckIsRUFBa0M4QixHQUFHOUIsQ0FBSCxDQUFsQztBQUNEO0FBQ0Y7QUFDRjs7QUFFRDs7Ozs7Ozs7Z0NBS1k2QixRLEVBQVU7QUFDcEJuQixtQkFBR3lCLGFBQUgsQ0FDRU4sUUFERixFQUVFLHlCQUFlLEtBQUtPLFlBQUwsQ0FBa0IsS0FBS3ZCLFdBQXZCLENBQWYsRUFBb0QsSUFBcEQsRUFBMEQsQ0FBMUQsQ0FGRixFQUdFLE9BSEY7QUFLRDs7O3dCQTVMZ0I7QUFDZixhQUFPLEtBQUt1QixZQUFMLENBQWtCLEtBQUt2QixXQUF2QixDQUFQO0FBQ0QsSztzQkFFY2lCLEUsRUFBSTtBQUNqQixXQUFLakIsV0FBTCxHQUFtQixLQUFLd0IsWUFBTCxDQUFrQlAsRUFBbEIsQ0FBbkI7QUFDRDs7QUFFRDs7Ozs7Ozs7Ozs7O3dCQVN3QjtBQUN0QixhQUFPLEtBQUtNLFlBQUwsQ0FBa0IsS0FBSzVDLGtCQUF2QixDQUFQO0FBQ0QsSztzQkFFcUI4QyxHLEVBQUs7QUFDekIsV0FBSzlDLGtCQUFMLEdBQTBCLEtBQUs2QyxZQUFMLENBQWtCQyxHQUFsQixDQUExQjtBQUNEOzs7RUF2QzJCQyx3Qjs7QUE2TTdCOztrQkFFY3JELGUiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgaHR0cCBmcm9tICdodHRwJztcbmltcG9ydCBodHRwcyBmcm9tICdodHRwcyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBmcyBmcm9tICdmcyc7XG5cbmltcG9ydCBGcmVlc291bmRRdWVyeSBmcm9tICcuLi9jb21tb24vRnJlZXNvdW5kUXVlcnknO1xuXG5jb25zdCBjd2QgPSBwcm9jZXNzLmN3ZCgpO1xuXG5jb25zdCBkZWZhdWx0cyA9IHtcbiAgZGVzdGluYXRpb246ICcuJyxcbiAgcHVibGljUGF0aDogJ3B1YmxpYycsXG4gIHN0b3JlU291bmRzSW5mbzogZmFsc2UsXG59O1xuXG4vKipcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c2VydmVyXG4gKlxuICogQGNsYXNzIDxiPjxoNT5zZXJ2ZXIuU2ltcGxlRnJlZXNvdW5kPC9oNT48L2I+XG4gKlxuICogU2VydmVyIHNpZGUgY2xhc3MgZm9yIHVzZSBpbiA8Y29kZT5Ob2RlLmpzPC9jb2RlPiwgYWxsb3dpbmcgdG8gcXVlcnkgZGV0YWlsZWRcbiAqIGluZm8gb24gc291bmRzIGFuZCBkb3dubG9hZCB0aGVtIGZyb21cbiAqIDxhIGhyZWY9XCJodHRwOi8vZnJlZXNvdW5kLm9yZ1wiIHRhcmdldD1cIl9ibGFua1wiPmZyZWVzb3VuZDwvYT4uXG4gKlxuICogLSBtZW1iZXJzXG4gKiAgICAgLSBbc291bmRzSW5mb117QGxpbmsgbW9kdWxlOnNlcnZlci5TaW1wbGVGcmVlc291bmQjc291bmRzSW5mb31cbiAqICAgICAtIFtjdXJyZW50U291bmRzSW5mb117QGxpbmsgbW9kdWxlOnNlcnZlci5TaW1wbGVGcmVlc291bmQjY3VycmVudFNvdW5kc0luZm99XG4gKiAtIG1ldGhvZHNcbiAqICAgICAtIFtxdWVyeV17QGxpbmsgbW9kdWxlOnNlcnZlci5TaW1wbGVGcmVlc291bmQjcXVlcnl9XG4gKiAgICAgLSBbcXVlcnlGcm9tSWRzXXtAbGluayBtb2R1bGU6c2VydmVyLlNpbXBsZUZyZWVzb3VuZCNxdWVyeUZyb21JZHN9XG4gKiAgICAgLSBbZG93bmxvYWRde0BsaW5rIG1vZHVsZTpzZXJ2ZXIuU2ltcGxlRnJlZXNvdW5kI2Rvd25sb2FkfVxuICogICAgIC0gW3F1ZXJ5QW5kRG93bmxvYWRde0BsaW5rIG1vZHVsZTpzZXJ2ZXIuU2ltcGxlRnJlZXNvdW5kI3F1ZXJ5QW5kRG93bmxvYWR9XG4gKiAgICAgLSBbY2xlYXJde0BsaW5rIG1vZHVsZTpzZXJ2ZXIuU2ltcGxlRnJlZXNvdW5kI2NsZWFyfVxuICogICAgIC0gW3JlYWRGcm9tRmlsZV17QGxpbmsgbW9kdWxlOnNlcnZlci5TaW1wbGVGcmVlc291bmQjcmVhZEZyb21GaWxlfVxuICogICAgIC0gW3dyaXRlVG9GaWxlXXtAbGluayBtb2R1bGU6c2VydmVyLlNpbXBsZUZyZWVzb3VuZCN3cml0ZVRvRmlsZX1cbiAqXG4gKiBQb3dlcmVkIGJ5XG4gKiA8YSBocmVmPVwiaHR0cDovL2ZyZWVzb3VuZC5vcmcvZG9jcy9hcGkvXCIgdGFyZ2V0PVwiX2JsYW5rXCI+ZnJlZXNvdW5kIGFwaTwvYT4uXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGFwaUtleSAtIFlvdXIgYXBpIGtleSwgYXMgZ2VuZXJhdGVkIGZyb20geW91ciBmcmVlc291bmRcbiAqIGRldmVsb3BlciBhY2NvdW50IHdoZW4gY3JlYXRpbmcgYSBuZXcgYXBwbGljYXRpb24uXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIENvbmZpZ3VyYXRpb24gb3B0aW9ucy5cbiAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5wdWJsaWNQYXRoPSdwdWJsaWMnXSAtIFRoZSBwdWJsaWMgcGF0aCAocmVsYXRpdmUgdG8gbm9kZSdzIGN3ZCkgb2YgdGhlIGZvbGRlciB3aGVyZSBjbGllbnRzIGNhbiBhY2Nlc3MgZmlsZXMuXG4gKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMuZGVzdGluYXRpb249Jy4nXSAtIFRoZSBwYXRoIChyZWxhdGl2ZSB0byB0aGUgcHVibGljIHBhdGgpIG9mIHRoZSBmb2xkZXIgd2hlcmUgdG8gZG93bmxvYWQgZmlsZXMuXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLnN0b3JlU291bmRzSW5mbz1mYWxzZV0gLSBTdG9yZSBhbGwgc291bmRzIGRldGFpbGVkIGluZm9ybWF0aW9ucyxcbiAqIGluY2x1ZGluZyBwcmV2aWV3IHVybHMsIHRvIG9wdGltaXplIHRoZSBudW1iZXIgb2YgcXVlcmllcyB0byB0aGUgQVBJIChjYW4gYmUgbWVtb3J5IGNvbnN1bWluZykuXG4gKlxuICogQGV4YW1wbGVcbiAqIGltcG9ydCBTaW1wbGVGcmVlc291bmQgZnJvbSAnc2ltcGxlLWZyZWVzb3VuZCc7XG4gKlxuICogY29uc3QgZnMgPSBuZXcgU2ltcGxlRnJlZXNvdW5kKCd5b3VyX2ZyZWVzb3VuZF9hcGlfa2V5X2dvZXNfaGVyZScsIHtcbiAqICAgZGVzdGluYXRpb246ICcuL2Rvd25sb2FkcydcbiAqIH0pO1xuICogZnMucXVlcnkoe1xuICogICBzZWFyY2g6IFsgJ3NwYWNlJywgJ2luc2VjdCcgXSxcbiAqICAgZHVyYXRpb246IFsgMSwgMjAgXSxcbiAqIH0pXG4gKiAudGhlbigoKSA9PiBmcy5kb3dubG9hZCgpKVxuICogLnRoZW4oKCkgPT4ge1xuICogICBjb25zb2xlLmxvZyhmcy5jdXJyZW50U291bmRzSW5mbyk7XG4gKiB9KTtcbiAqL1xuY2xhc3MgU2ltcGxlRnJlZXNvdW5kIGV4dGVuZHMgRnJlZXNvdW5kUXVlcnkge1xuICAvKiogQGNvbnN0cnVjdG9yICovXG4gIGNvbnN0cnVjdG9yKGFwaUtleSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3Qgb3B0cyA9IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRzLCBvcHRpb25zKTtcbiAgICBzdXBlcihhcGlLZXksIG9wdHMuc3RvcmVTb3VuZHNJbmZvKTtcbiAgICB0aGlzLmRlc3RpbmF0aW9uID0gb3B0cy5kZXN0aW5hdGlvbjtcbiAgICB0aGlzLnB1YmxpY1BhdGggPSBvcHRzLnB1YmxpY1BhdGg7XG4gIH1cblxuICAvKipcbiAgICogQW4gb2JqZWN0IGNvbnRhaW5pbmcgZXZlcnkgZGV0YWlsZWQgaW5mb3JtYXRpb24gb2J0YWluZWQgc2luY2VcbiAgICogaW5zdGFudGlhdGlvbiBvciBsYXN0IGNhbGwgdG9cbiAgICogWzxjb2RlPmNsZWFyKCk8L2NvZGU+XXtAbGluayBtb2R1bGU6c2VydmVyLlNpbXBsZUZyZWVzb3VuZCNjbGVhcn0uXG4gICAqXG4gICAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBzb3VuZHNJbmZvXG4gICAqL1xuICBnZXQgc291bmRzSW5mbygpIHtcbiAgICByZXR1cm4gdGhpcy5fbWFwVG9PYmplY3QodGhpcy5fc291bmRzSW5mbyk7XG4gIH1cblxuICBzZXQgc291bmRzSW5mbyhzaSkge1xuICAgIHRoaXMuX3NvdW5kc0luZm8gPSB0aGlzLl9vYmplY3RUb01hcChzaSk7XG4gIH1cblxuICAvKipcbiAgICogQW4gb2JqZWN0IGNvbnRhaW5pbmcgdGhlIGRldGFpbGVkIGluZm9ybWF0aW9uIG9idGFpbmVkIGZyb20gdGhlIGxhc3QgY2FsbCB0b1xuICAgKiBbPGNvZGU+cXVlcnkoKTwvY29kZT5de0BsaW5rIG1vZHVsZTpzZXJ2ZXIuU2ltcGxlRnJlZXNvdW5kI3F1ZXJ5fSxcbiAgICogWzxjb2RlPnF1ZXJ5RnJvbUlkcygpPC9jb2RlPl17QGxpbmsgbW9kdWxlOnNlcnZlci5TaW1wbGVGcmVlc291bmQjcXVlcnlGcm9tSWRzfSxcbiAgICogWzxjb2RlPmRvd25sb2FkKCk8L2NvZGU+XXtAbGluayBtb2R1bGU6c2VydmVyLlNpbXBsZUZyZWVzb3VuZCNkb3dubG9hZH0gb3JcbiAgICogWzxjb2RlPnF1ZXJ5QW5kRG93bmxvYWQoKTwvY29kZT5de0BsaW5rIG1vZHVsZTpzZXJ2ZXIuU2ltcGxlRnJlZXNvdW5kI3F1ZXJ5QW5kRG93bmxvYWR9LlxuICAgKlxuICAgKiBAcHJvcGVydHkge09iamVjdH0gY3VycmVudFNvdW5kc0luZm9cbiAgICovXG4gIGdldCBjdXJyZW50U291bmRzSW5mbygpIHtcbiAgICByZXR1cm4gdGhpcy5fbWFwVG9PYmplY3QodGhpcy5fY3VycmVudFNvdW5kc0luZm8pO1xuICB9XG5cbiAgc2V0IGN1cnJlbnRTb3VuZHNJbmZvKGNzaSkge1xuICAgIHRoaXMuX2N1cnJlbnRTb3VuZHNJbmZvID0gdGhpcy5fb2JqZWN0VG9NYXAoY3NpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgYSBsaXN0IG9mIHNvdW5kIGlkcyB3aXRoIGRldGFpbGVkIGluZm9ybWF0aW9uLCB0aGF0IGNvcnJlc3BvbmQgdG8gYSBzZXQgb2YgcXVlcnkgcGFyYW1ldGVycy5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IHF1ZXJ5UGFyYW1zIC0gVGhlIHBhcmFtZXRlcnMgdXNlZCB0byBidWlsZCB0aGUgcXVlcnkuXG4gICAqIEBwYXJhbSB7QXJyYXkuU3RyaW5nfSBbcXVlcnlQYXJhbXMuc2VhcmNoXSAtIFRoZSBzZWFyY2ggdGVybXMgdGhhdCB3aWxsIGJlIHVzZWQgdG8gYnVpbGQgdGhlIHF1ZXJ5LlxuICAgKiBAcGFyYW0ge0FycmF5LlN0cmluZ30gW3F1ZXJ5UGFyYW1zLnVzZXJuYW1lXSAtIEEgbGlzdCBvZiB1c2VybmFtZXMgdG8gc2VhcmNoIGZpbGVzIGZyb20uXG4gICAqIEBwYXJhbSB7QXJyYXl9IFtxdWVyeVBhcmFtcy5kdXJhdGlvbl0gLSBBbiBhcnJheSBvZiBzaXplIDIgOiBbIG1pbkR1cmF0aW9uLCBtYXhEdXJhdGlvbiBdIChpbiBzZWNvbmRzKS5cbiAgICogSWYgbWF4RHVyYXRpb24gaXMgbm90IGEgbnVtYmVyLCBpdCB3aWxsIGJlIGludGVycHJldGVkIGFzIFwiKlwiIChubyBtYXhpbXVtIGR1cmF0aW9uKS5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IEEgUHJvbWlzZSBvYmplY3QgdGhhdCByZXNvbHZlcyB3aXRoIHRoZSBsaXN0IG9mIG5ldyBzb3VuZCBpZHMgaWYgdGhlIHF1ZXJ5IGdvZXMgd2VsbC5cbiAgICpcbiAgICogQHRocm93cyB7RXJyb3J9IEFuIGVycm9yIGlmIGEgcHJvYmxlbSBvY2N1cnMgZHVyaW5nIHRoZSBxdWVyeS5cbiAgICovXG4gIHF1ZXJ5KHF1ZXJ5UGFyYW1zKSB7XG4gICAgcmV0dXJuIHN1cGVyLnF1ZXJ5KHF1ZXJ5UGFyYW1zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgZGV0YWlsZWQgaW5mb3JtYXRpb24gb2Ygc291bmRzIGZyb20gdGhlaXIgaWRzLlxuICAgKlxuICAgKiBAcGFyYW0ge0FycmF5Lk51bWJlcn0gaWRzIC0gVGhlIGlkcyBvZiB0aGUgc291bmRzIHdlIHdhbnQgdG8gZ2V0IHRoZSBkZXRhaWxlZCBpbmZvIG9mLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gQSBwcm9taXNlIHRoYXQgd2lsbCByZXNvbHZlIHdpdGggYW4gYXJyYXkgb2YgdGhlIHNvdW5kIGlkc1xuICAgKiB0aGUgZGV0YWlsZWQgaW5mbyBvZiB3aGljaCBuZWVkZWQgdG8gYmUgcXVlcmllZC5cbiAgICpcbiAgICogQHRocm93cyB7RXJyb3J9IEFuIGVycm9yIGlmIGEgcHJvYmxlbSBvY2N1cnMgZHVyaW5nIHRoZSBxdWVyeS5cbiAgICovXG4gIHF1ZXJ5RnJvbUlkcyhpZHMpIHtcbiAgICByZXR1cm4gc3VwZXIucXVlcnlGcm9tSWRzKGlkcyk7XG4gIH1cblxuICAvKipcbiAgICogRG93bmxvYWQgaHEgbXAzIHByZXZpZXdzIGZyb20gdGhlaXIgc291bmQgaWRzLlxuICAgKlxuICAgKiBAcGFyYW0ge0FycmF5Lk51bWJlcn0gW2lkcz1udWxsXSAtIFRoZSBpZHMgb2YgdGhlIHNvdW5kcyB0byBkb3dubG9hZC5cbiAgICogSWYgPGNvZGU+bnVsbDwvY29kZT4sIHRoZSBpZHMgZnJvbVxuICAgKiBbPGNvZGU+Y3VycmVudFNvdW5kc0luZm88L2NvZGU+XXtAbGluayBtb2R1bGU6c2VydmVyLlNpbXBsZUZyZWVzb3VuZCNjdXJyZW50U291bmRzSW5mb31cbiAgICogd2lsbCBiZSB1c2VkLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gQSBwcm9taXNlIHRoYXQgd2lsbCByZXNvbHZlIGlmIHRoZSBkb3dubG9hZHMgZ28gd2VsbC5cbiAgICpcbiAgICogQHRocm93cyB7RXJyb3J9IEFuIGVycm9yIGlmIGEgcHJvYmxlbSBvY2N1cnMgZHVyaW5nIHRoZSBkb3dubG9hZHMuXG4gICAqL1xuICBkb3dubG9hZChpZHMgPSBudWxsKSB7XG4gICAgaWYgKGlkcyA9PT0gbnVsbCkge1xuICAgICAgaWRzID0gQXJyYXkuZnJvbSh0aGlzLl9jdXJyZW50U291bmRzSW5mby5rZXlzKCkpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9kb3dubG9hZEZpbGVzRnJvbVVybHMoaWRzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEb3dubG9hZCBocSBtcDMgcHJldmlld3MgZnJvbSBxdWVyaWVkIHNvdW5kIGluZm9ybWF0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gcXVlcnlQYXJhbXMgLSBUaGUgcGFyYW1ldGVycyB1c2VkIHRvIGJ1aWxkIHRoZSBxdWVyeS5cbiAgICogQHBhcmFtIHtBcnJheS5TdHJpbmd9IFtxdWVyeVBhcmFtcy5zZWFyY2hdIC0gVGhlIHNlYXJjaCB0ZXJtcyB0aGF0IHdpbGwgYmUgdXNlZCB0byBidWlsZCB0aGUgcXVlcnkuXG4gICAqIEBwYXJhbSB7QXJyYXkuU3RyaW5nfSBbcXVlcnlQYXJhbXMudXNlcm5hbWVdIC0gQSBsaXN0IG9mIHVzZXJuYW1lcyB0byBzZWFyY2ggZmlsZXMgZnJvbS5cbiAgICogQHBhcmFtIHtBcnJheX0gW3F1ZXJ5UGFyYW1zLmR1cmF0aW9uXSAtIEFuIGFycmF5IG9mIHNpemUgMiA6IFsgbWluRHVyYXRpb24sIG1heER1cmF0aW9uIF0gKGluIHNlY29uZHMpLlxuICAgKiBJZiBtYXhEdXJhdGlvbiBpcyBub3QgYSBudW1iZXIsIGl0IHdpbGwgYmUgaW50ZXJwcmV0ZWQgYXMgXCIqXCIgKG5vIG1heGltdW0gZHVyYXRpb24pLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW2Rlc3RpbmF0aW9uPScuJ10gLSBUaGUgZm9sZGVyIGluIHdoaWNoIHRvIHNhdmUgdGhlIGRvd25sb2FkZWQgZmlsZXMuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBBIFByb21pc2Ugb2JqZWN0IHRoYXQgcmVzb2x2ZXMgaWYgdGhlIGRvd25sb2FkcyBnbyB3ZWxsLlxuICAgKlxuICAgKiBAdGhyb3dzIHtFcnJvcn0gQW4gZXJyb3IgaWYgYSBwcm9ibGVtIG9jY3VycyBkdXJpbmcgdGhlIGRvd25sb2Fkcy5cbiAgICovXG4gIHF1ZXJ5QW5kRG93bmxvYWQocXVlcnlQYXJhbXMpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgc3VwZXIucXVlcnkocXVlcnlQYXJhbXMpXG4gICAgICAgIC50aGVuKHVwZGF0ZWRJZHMgPT4gdGhpcy5fZG93bmxvYWRGaWxlc0Zyb21VcmxzKHVwZGF0ZWRJZHMpKVxuICAgICAgICAudGhlbih1cGRhdGVkSWRzID0+IHJlc29sdmUodXBkYXRlZElkcykpXG4gICAgfSk7XG4gIH1cblxuICAvKioqXG4gICAqIENhbmNlbCBhbGwgdW5yZXNvbHZlZCB5ZXQgcHJvbWlzZXMgKHF1ZXJpZXMgYW5kIGRvd25sb2FkcykuXG4gICAqL1xuICBhYm9ydCgpIHtcbiAgICAvLyBUT0RPIChubyBuYXRpdmUgd2F5IHRvIGNhbmNlbCB1bnJlc29sdmVkIHlldCBwcm9taXNlcylcbiAgICAvLyBtYXliZSB1c2luZyBQcm9taXNlLnJhY2UoKSB3aXRoIGEgY2FuY2VsbGFibGUgcHJvbWlzZSBhbmRcbiAgICAvLyB0aGUgcmVzdWx0IG9mIFByb21pc2UuYWxsIGluIGEgc2FtZSBBcnJheSAvIGl0ZXJhYmxlIC4uLiA/XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX2Rvd25sb2FkRmlsZXNGcm9tVXJscyhpZHMpIHtcbiAgICBjb25zdCBwcm9taXNlcyA9IFtdO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHByb21pc2VzLnB1c2godGhpcy5fZG93bmxvYWRGaWxlRnJvbVVybChpZHNbaV0pKTtcbiAgICB9XG5cbiAgICByZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9kb3dubG9hZEZpbGVGcm9tVXJsKGlkKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IGRzdCA9IHBhdGguam9pbihjd2QsIHRoaXMucHVibGljUGF0aCwgdGhpcy5kZXN0aW5hdGlvbiwgYCR7aWR9Lm1wM2ApXG4gICAgICBjb25zdCBmaWxlID0gZnMuY3JlYXRlV3JpdGVTdHJlYW0oZHN0KTtcbiAgICAgIGxldCB1cmwgPSB0aGlzLl9zb3VuZHNJbmZvLmdldChpZCkucHJldmlld3NbJ3ByZXZpZXctaHEtbXAzJ107XG4gICAgICB1cmwgPSB1cmwuc3BsaXQoJzonKTtcbiAgICAgIHVybFswXSA9ICdodHRwcyc7XG4gICAgICB1cmwgPSB1cmwuam9pbignOicpO1xuXG4gICAgICBjb25zdCByZXF1ZXN0ID0gaHR0cHMuZ2V0KFxuICAgICAgICB1cmwsXG4gICAgICAgIHJlc3BvbnNlID0+IHtcbiAgICAgICAgICByZXNwb25zZS5waXBlKGZpbGUpO1xuXG4gICAgICAgICAgZmlsZS5vbignZmluaXNoJywgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgdXJsID0gcGF0aC5qb2luKHRoaXMuZGVzdGluYXRpb24sIGAke2lkfS5tcDNgKTtcbiAgICAgICAgICAgIHRoaXMuX3NvdW5kc0luZm8uZ2V0KGlkKS5sb2NhbFVybCA9IHVybDtcbiAgICAgICAgICAgIHRoaXMuX2N1cnJlbnRTb3VuZHNJbmZvLmdldChpZCkubG9jYWxVcmwgPSB1cmw7XG4gICAgICAgICAgICBmaWxlLmNsb3NlKCk7XG4gICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBmaWxlLm9uKCdlcnJvcicsIGVyciA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICAgICAgICBmcy51bmxpbmsoZHN0KTtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRXJyb3IgZG93bmxvYWRpbmcgZmlsZSAke2lkfSA6ICR7ZXJyfWApO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICApO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENsZWFyIHRoZSBpbnRlcm5hbCBzb3VuZCBpbmZvcm1hdGlvbiBsaXN0cy5cbiAgICovXG4gIGNsZWFyKCkge1xuICAgIHRoaXMuX3NvdW5kc0luZm8gPSBuZXcgTWFwKCk7XG4gICAgdGhpcy5fY3VycmVudFNvdW5kc0luZm8gPSBuZXcgTWFwKCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0cmlldmUgc291bmQgaW5mb3JtYXRpb24gbGlzdCBmcm9tIGEgSlNPTiBmaWxlLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gZmlsZW5hbWUgLSBVcmwgb2YgdGhlIGZpbGUgdG8gcmVhZC5cbiAgICovXG4gIHJlYWRGcm9tRmlsZShmaWxlbmFtZSkge1xuICAgIHZhciBzaSA9IEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKGZpbGVuYW1lLCAndXRmLTgnKSk7XG5cbiAgICBpZiAoc2kpIHtcbiAgICAgIHRoaXMuX3NvdW5kc0luZm8gPSBuZXcgTWFwKCk7XG5cbiAgICAgIGZvciAobGV0IGkgaW4gc2kpIHtcbiAgICAgICAgdGhpcy5fc291bmRzSW5mby5zZXQoc2lbaV1bJ2lkJ10sIHNpW2ldKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRHVtcCBzb3VuZCBpbmZvcm1hdGlvbiBsaXN0IHRvIGEgSlNPTiBmaWxlLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gZmlsZW5hbWUgLSBVcmwgb2YgdGhlIGZpbGUgdG8gZHVtcCB0aGUgbGlzdCBvZiBmaWxlIGluZm9ybWF0aW9uIHRvLlxuICAgKi9cbiAgd3JpdGVUb0ZpbGUoZmlsZW5hbWUpIHtcbiAgICBmcy53cml0ZUZpbGVTeW5jKFxuICAgICAgZmlsZW5hbWUsXG4gICAgICBKU09OLnN0cmluZ2lmeSh0aGlzLl9tYXBUb09iamVjdCh0aGlzLl9zb3VuZHNJbmZvKSwgbnVsbCwgMiksXG4gICAgICAndXRmLTgnXG4gICAgKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgU2ltcGxlRnJlZXNvdW5kO1xuIl19