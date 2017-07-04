'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _eventsBinder = require('../utils/eventsBinder.js');

var _eventsBinder2 = _interopRequireDefault(_eventsBinder);

var _propsBinder = require('../utils/propsBinder.js');

var _propsBinder2 = _interopRequireDefault(_propsBinder);

var _getPropsValuesMixin = require('../utils/getPropsValuesMixin.js');

var _getPropsValuesMixin2 = _interopRequireDefault(_getPropsValuesMixin);

var _mapElementMixin = require('./mapElementMixin');

var _mapElementMixin2 = _interopRequireDefault(_mapElementMixin);

var _richMarker = require('../utils/richMarker');

var _richMarker2 = _interopRequireDefault(_richMarker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var props = {
    draggable: {
        type: Boolean,
        twoWay: true,
        default: false
    },
    flat: {
        type: Boolean,
        twoWay: true,
        default: true
    },
    content: {
        type: String,
        twoWay: true
    },

    position: {
        type: Object,
        twoWay: true
    }

};

var events = ['click', 'rightclick', 'dblclick', 'drag', 'dragstart', 'dragend', 'mouseup', 'mousedown', 'mouseover', 'mouseout'];

/**
 * @class Marker
 *
 * Marker class with extra support for
 *
 * - Embedded info windows
 * - Clustered markers
 *
 * Support for clustered markers is for backward-compatability
 * reasons. Otherwise we should use a cluster-marker mixin or
 * subclass.
 */
exports.default = {
    mixins: [_mapElementMixin2.default, _getPropsValuesMixin2.default],
    props: props,

    render: function render(h) {
        if (!this.$slots.default || this.$slots.default.length == 0) {
            return '';
        } else if (this.$slots.default.length == 1) {
            // So that infowindows can have a marker parent
            return this.$slots.default[0];
        } else {
            return h('div', this.$slots.default);
        }
    },
    destroyed: function destroyed() {
        if (!this.$markerObject) return;

        if (this.$clusterObject) {
            this.$clusterObject.removeMarker(this.$markerObject);
        } else {
            this.$markerObject.setMap(null);
        }
    },
    deferredReady: function deferredReady() {
        var _this = this;

        var options = _lodash2.default.mapValues(props, function (value, prop) {
            return _this[prop];
        });
        options.map = this.$map;
        console.log('options', options);
        options.position = new google.maps.LatLng(options.position.lat, options.position.lng);
        // search ancestors for cluster object
        var search = this.$findAncestor(function (ans) {
            return ans.$clusterObject;
        });

        this.$clusterObject = search ? search.$clusterObject : null;
        this.createMarker(options);
    },


    methods: {
        createMarker: function createMarker(options) {
            this.$markerObject = new _richMarker2.default(options);
            (0, _propsBinder2.default)(this, this.$markerObject, props);
            (0, _eventsBinder2.default)(this, this.$markerObject, events);

            if (this.$clusterObject) {
                this.$clusterObject.addMarker(this.$markerObject);
            }
        }
    }
};