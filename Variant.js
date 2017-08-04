import React, {
  Component,
  PropTypes
} from 'react';

class Variant extends Component {
  constructor(props) {
    super(props);
  }

  getName() {
    return this.props.name;
  }

  render() {
    return this.props.children;
  }
};

Variant.propTypes = {
  name: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired
};

export default Variant;

Variant.isVariant = true;
