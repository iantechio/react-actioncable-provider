"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var React = require("react");

var PropTypes = require("prop-types");

var actioncable = require("actioncable");

var _React$createContext = React.createContext(),
    Provider = _React$createContext.Provider,
    Consumer = _React$createContext.Consumer;

var ActionCableProvider =
/*#__PURE__*/
function (_React$Component) {
  _inherits(ActionCableProvider, _React$Component);

  function ActionCableProvider() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, ActionCableProvider);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(ActionCableProvider)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_this), "UNSAFE_componentWillMount", function () {
      if (this.props.cable) {
        this.cable = this.props.cable;
      } else {
        this.cable = actioncable.createConsumer(this.props.url);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "componentWillUnmount", function () {
      if (!this.props.cable && this.cable) {
        this.cable.disconnect();
      }
    });

    _defineProperty(_assertThisInitialized(_this), "UNSAFE_componentWillReceiveProps", function (nextProps) {
      // Props not changed
      if (this.props.cable === nextProps.cable && this.props.url === nextProps.url) {
        return;
      } // cable is created by self, disconnect it


      this.componentWillUnmount(); // create or assign cable

      this.UNSAFE_componentWillMount();
    });

    _defineProperty(_assertThisInitialized(_this), "render", function () {
      return React.createElement(Provider, {
        value: {
          cable: this.cable
        }
      }, this.props.children || null);
    });

    return _this;
  }

  return ActionCableProvider;
}(React.Component);

ActionCableProvider.displayName = "ActionCableProvider";
ActionCableProvider.propTypes = {
  cable: PropTypes.object,
  url: PropTypes.string,
  children: PropTypes.any
};

var ActionCableController =
/*#__PURE__*/
function (_React$Component2) {
  _inherits(ActionCableController, _React$Component2);

  function ActionCableController() {
    var _getPrototypeOf3;

    var _this2;

    _classCallCheck(this, ActionCableController);

    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    _this2 = _possibleConstructorReturn(this, (_getPrototypeOf3 = _getPrototypeOf(ActionCableController)).call.apply(_getPrototypeOf3, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_this2), "componentDidMount", function () {
      var self = this;
      var _props = this.props;
      var onReceived = _props.onReceived;
      var onInitialized = _props.onInitialized;
      var onConnected = _props.onConnected;
      var onDisconnected = _props.onDisconnected;
      var onRejected = _props.onRejected;
      this.cable = this.props.cable.subscriptions.create(this.props.channel, {
        received: function received(data) {
          onReceived && onReceived(data);
        },
        initialized: function initialized() {
          onInitialized && onInitialized();
        },
        connected: function connected() {
          onConnected && onConnected();
        },
        disconnected: function disconnected() {
          onDisconnected && onDisconnected();
        },
        rejected: function rejected() {
          onRejected && onRejected();
        }
      });
    });

    _defineProperty(_assertThisInitialized(_this2), "componentWillUnmount", function () {
      if (this.cable) {
        this.props.cable.subscriptions.remove(this.cable);
        this.cable = null;
      }
    });

    _defineProperty(_assertThisInitialized(_this2), "send", function (data) {
      if (!this.cable) {
        throw new Error("ActionCable component unloaded");
      }

      this.cable.send(data);
    });

    _defineProperty(_assertThisInitialized(_this2), "perform", function (action, data) {
      if (!this.cable) {
        throw new Error("ActionCable component unloaded");
      }

      this.cable.perform(action, data);
    });

    _defineProperty(_assertThisInitialized(_this2), "render", function () {
      return this.props.children || null;
    });

    return _this2;
  }

  return ActionCableController;
}(React.Component);

ActionCableController.displayName = "ActionCableController";
ActionCableController.propTypes = {
  cable: PropTypes.object,
  onReceived: PropTypes.func,
  onInitialized: PropTypes.func,
  onConnected: PropTypes.func,
  onDisconnected: PropTypes.func,
  onRejected: PropTypes.func,
  children: PropTypes.any
};

var Component =
/*#__PURE__*/
function (_React$Component3) {
  _inherits(Component, _React$Component3);

  function Component() {
    var _getPrototypeOf4;

    var _this3;

    _classCallCheck(this, Component);

    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    _this3 = _possibleConstructorReturn(this, (_getPrototypeOf4 = _getPrototypeOf(Component)).call.apply(_getPrototypeOf4, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_this3), "render", function () {
      var _this4 = this;

      return React.createElement(Consumer, null, function (_ref) {
        var cable = _ref.cable;
        return React.createElement(ActionCableController, _objectSpread({
          cable: cable
        }, _this4.props, {
          ref: _this4.props.forwardedRef
        }), _this4.props.children || null);
      });
    });

    return _this3;
  }

  return Component;
}(React.Component);

Component.displayName = "ActionCableConsumer";
Component.propTypes = {
  onReceived: PropTypes.func,
  onInitialized: PropTypes.func,
  onConnected: PropTypes.func,
  onDisconnected: PropTypes.func,
  onRejected: PropTypes.func,
  children: PropTypes.any
};
var ActionCableConsumer = React.forwardRef(function (props, ref) {
  return React.createElement(Component, _objectSpread({}, props, {
    forwardedRef: ref
  }), props.children || null);
});

var ActionCable =
/*#__PURE__*/
function (_React$Component4) {
  _inherits(ActionCable, _React$Component4);

  function ActionCable() {
    var _getPrototypeOf5;

    var _this5;

    _classCallCheck(this, ActionCable);

    for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }

    _this5 = _possibleConstructorReturn(this, (_getPrototypeOf5 = _getPrototypeOf(ActionCable)).call.apply(_getPrototypeOf5, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_this5), "componentDidMount", function () {
      console.warn("DEPRECATION WARNING: The <ActionCable /> component has been deprecated and will be removed in a future release. Use <ActionCableConsumer /> instead.");
    });

    _defineProperty(_assertThisInitialized(_this5), "render", function () {
      return React.createElement(ActionCableConsumer, _objectSpread({}, this.props), this.props.children || null);
    });

    return _this5;
  }

  return ActionCable;
}(React.Component);

ActionCable.displayName = "ActionCable";
ActionCable.propTypes = {
  onReceived: PropTypes.func,
  onInitialized: PropTypes.func,
  onConnected: PropTypes.func,
  onDisconnected: PropTypes.func,
  onRejected: PropTypes.func,
  children: PropTypes.any
};
exports.ActionCable = ActionCable;
exports.ActionCableConsumer = ActionCableConsumer;
exports.ActionCableController = ActionCableController;
exports.ActionCableProvider = ActionCableProvider; // Compatible old usage

exports["default"] = ActionCableProvider;