"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var React = require("react");

var PropTypes = require("prop-types");

var actioncable = require("actioncable");

var {
  Provider,
  Consumer
} = React.createContext();

class ActionCableProvider extends React.Component {
  constructor() {
    super(...arguments);

    _defineProperty(this, "UNSAFE_componentWillMount", function () {
      if (this.props.cable) {
        this.cable = this.props.cable;
      } else {
        this.cable = actioncable.createConsumer(this.props.url);
      }
    });

    _defineProperty(this, "componentWillUnmount", function () {
      if (!this.props.cable && this.cable) {
        this.cable.disconnect();
      }
    });

    _defineProperty(this, "UNSAFE_componentWillReceiveProps", function (nextProps) {
      // Props not changed
      if (this.props.cable === nextProps.cable && this.props.url === nextProps.url) {
        return;
      } // cable is created by self, disconnect it


      this.componentWillUnmount(); // create or assign cable

      this.UNSAFE_componentWillMount();
    });

    _defineProperty(this, "render", function () {
      return React.createElement(Provider, {
        value: {
          cable: this.cable
        }
      }, this.props.children || null);
    });
  }

}

ActionCableProvider.displayName = "ActionCableProvider";
ActionCableProvider.propTypes = {
  cable: PropTypes.object,
  url: PropTypes.string,
  children: PropTypes.any
};

class ActionCableController extends React.Component {
  constructor() {
    super(...arguments);

    _defineProperty(this, "componentDidMount", function () {
      this.connectToChannel();
    });

    _defineProperty(this, "connectToChannel", function () {
      var self = this;
      var _props = this.props;
      var onReceived = _props.onReceived;
      var onInitialized = _props.onInitialized;
      var onConnected = _props.onConnected;
      var onDisconnected = _props.onDisconnected;
      var onRejected = _props.onRejected;
      this.cable = this.props.cable.subscriptions.create(this.props.channel, {
        received: function (data) {
          onReceived && onReceived(data);
        },
        initialized: function () {
          onInitialized && onInitialized();
        },
        connected: function () {
          onConnected && onConnected();
        },
        disconnected: function () {
          onDisconnected && onDisconnected();
        },
        rejected: function () {
          onRejected && onRejected();
        }
      });
    });

    _defineProperty(this, "disconnectFromChannel", function () {
      if (this.cable) {
        this.props.cable.subscriptions.remove(this.cable);
        this.cable = null;
      }
    });

    _defineProperty(this, "componentDidUpdate", function (prevProps) {
      if (JSON.stringify(prevProps.channel) !== JSON.stringify(this.props.channel)) {
        this.disconnectFromChannel();
        this.connectToChannel();
      }
    });

    _defineProperty(this, "componentWillUnmount", function () {
      this.disconnectFromChannel();
    });

    _defineProperty(this, "send", function (data) {
      if (!this.cable) {
        throw new Error("ActionCable component unloaded");
      }

      this.cable.send(data);
    });

    _defineProperty(this, "perform", function (action, data) {
      if (!this.cable) {
        throw new Error("ActionCable component unloaded");
      }

      this.cable.perform(action, data);
    });

    _defineProperty(this, "render", function () {
      return this.props.children || null;
    });
  }

}

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

class Component extends React.Component {
  constructor() {
    super(...arguments);

    _defineProperty(this, "render", function () {
      return React.createElement(Consumer, null, _ref => {
        let {
          cable
        } = _ref;
        return React.createElement(ActionCableController, {
          cable,
          ...this.props,
          ref: this.props.forwardedRef
        }, this.props.children || null);
      });
    });
  }

}

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
  return React.createElement(Component, { ...props,
    forwardedRef: ref
  }, props.children || null);
});

class ActionCable extends React.Component {
  constructor() {
    super(...arguments);

    _defineProperty(this, "componentDidMount", function () {
      console.warn("DEPRECATION WARNING: The <ActionCable /> component has been deprecated and will be removed in a future release. Use <ActionCableConsumer /> instead.");
    });

    _defineProperty(this, "render", function () {
      return React.createElement(ActionCableConsumer, { ...this.props
      }, this.props.children || null);
    });
  }

}

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

exports.default = ActionCableProvider;