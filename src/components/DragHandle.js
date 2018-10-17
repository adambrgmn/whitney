import React, { PureComponent } from 'react';
import { Circle } from 'react-konva';

const STATES = {
  normal: 'NORMAL',
  hover: 'HOVER',
};

class DragHandle extends PureComponent {
  state = {
    state: STATES.normal,
  };

  handleMouseEnter = event => {
    this.setState(() => ({ state: STATES.hover }));
    if (this.props.onMouseEnter) this.onMouseEnter(event);
  };
  handleMouseLeave = event => {
    this.setState(() => ({ state: STATES.normal }));
    if (this.props.onMouseLeave) this.onMouseLeave(event);
  };

  render() {
    const { state } = this.state;
    const fill = state === STATES.hover ? 'blue' : 'transparent';
    const stroke = state === STATES.hover ? 'black' : 'grey';

    return (
      <Circle
        {...this.props}
        fill={fill}
        stroke={stroke}
        strokeWidth={1}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      />
    );
  }
}

export { DragHandle };
