import React, {
  Component,
  PropTypes
} from 'react';

import  {
  AsyncStorage,
  View
} from 'react-native';

import Variant from './Variant';

class Experiment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      variant: <View/>
    };
  }

  componentWillMount() {
    this.variants = this.props.children;

    this.key = 'react-native-ab:Experiment:' + this.props.name;

    AsyncStorage.getItem(this.key, ((err, variantName) => {
      let choice;
      if (err || !variantName) {
        choice = this.props.choose(this.variants);
        AsyncStorage.setItem(this.key, choice.props.name); // Optimistic update
      }
      else {
        choice = this.getVariant(variantName);
      }
      this.props.onChoice(this.props.name, choice.props.name);
      this.props.onRawChoice(this, choice);
      this._onChange({
        variant: choice
      });
    }).bind(this));
  }

  getActiveVariant() {
    return this.state.variant;
  }

  getName() {
    return this.props.name;
  }

  getVariant(name) {
    return this.variants.find((v) => v.props.name == name);
  }

  reset(cb) {
    AsyncStorage.removeItem(this.key, cb);
  }

  _onChange(changed) {
    var newState = Object.assign({}, this.state, changed);
    this.setState(newState);
  }

  render() {
    return this.state.variant;
  }

};

Experiment.propTypes = {
  name: PropTypes.string.isRequired,
  children: ((props, propName) => {
    let children = props[propName];
    if (!Array.isArray(children) || children.length < 2) {
      return new Error('You must have at least 2 Variants.');
    }
    for (child of children) {
      if (!child instanceof Variant) {
        return new Error('One or more children is not a Variant.');
      }
    }
  }),
  choose: PropTypes.func,
  onChoice: PropTypes.func,
  onRawChoice: PropTypes.func
};

Experiment.defaultProps = {
  choose(variants) {
    let choice = Math.floor(Math.random() * variants.length);
    return variants[choice];
  },
  onChoice(testName, variantName) { /* noop */ },
  onRawChoice(test, variant) { /* noop */ }
};

export default Experiment;
