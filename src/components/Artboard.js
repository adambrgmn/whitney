import React, { PureComponent } from 'react';
import { Stage, Layer, Image } from 'react-konva';
import { DragHandle } from './DragHandle';

const cap = (min, max, val) => (val < min ? min : val > max ? max : val);

class Artboard extends PureComponent {
  state = {
    image: null,
    width: 0,
    height: 0,
    aspect: 0,
    x: 0,
    y: 0,
  };

  componentDidMount() {
    this.constructImage();
  }

  constructImage = () => {
    const { src, width: artboardWidth, height: artboardHeight } = this.props;

    const image = new window.Image();
    image.src = src;

    image.onload = () => {
      const { naturalWidth, naturalHeight } = image;
      const aspect = naturalHeight / naturalWidth;
      const { width, height } = this.processDimensions({
        naturalWidth,
        naturalHeight,
        aspect,
      });

      const { x, y } = this.processCenterPos({
        artboardWidth,
        width,
        artboardHeight,
        height,
      });

      this.setState(() => ({ image, width, height, aspect, x, y }));
    };
  };

  processCenterPos = ({ artboardWidth, width, artboardHeight, height }) => ({
    x: (artboardWidth - width) / 2,
    y: (artboardHeight - height) / 2,
  });

  processDimensions = ({ naturalWidth, naturalHeight, aspect }) => {
    const { width: maxWidth, height: maxHeight } = this.props;

    const artboardIsLandscape = maxWidth > maxHeight;
    const imageIsLandscape = naturalWidth > naturalHeight;
    const shouldCapWidth =
      (artboardIsLandscape && !imageIsLandscape) ||
      (!artboardIsLandscape && imageIsLandscape);

    let width = 0;
    let height = 0;

    if (shouldCapWidth) {
      width = cap(0, maxWidth * 0.9, naturalWidth);
      height = width * aspect;
    } else {
      height = cap(0, maxHeight * 0.9, naturalHeight);
      width = height / aspect;
    }

    return { width, height };
  };

  handleDrag = event => {
    const { width: artboardWidth, height: artboardHeight } = this.props;
    const { x: oldX, y: oldY, width: oldWidth, height: oldHeight } = this.state;
    const newX = event.currentTarget.x();
    const newY = event.currentTarget.y();

    const deltaX = newX - oldX;
    const deltaY = newY - oldY;

    const width = oldWidth - deltaX * 2;
    const height = oldHeight - deltaY * 2;

    const { x, y } = this.processCenterPos({
      artboardWidth,
      width,
      artboardHeight,
      height,
    });

    return this.setState(() => ({
      x,
      y,
      width: oldWidth - deltaX * 2,
      height: oldHeight - deltaY * 2,
    }));
  };

  boundHandles = ({ x, y }) => {
    const { width: artboardWidth, height: artboardHeight } = this.props;

    return {
      x: cap(0, artboardWidth, x),
      y: cap(0, artboardHeight, y),
    };
  };

  renderDragHandles = () => {
    const { width, height, x, y } = this.state;

    const handles = [
      { key: 'top-left', x, y },
      { key: 'top-right', x: x + width, y },
      { key: 'bottom-right', x: x + width, y: y + height },
      { key: 'bottom-left', x, y: y + height },
    ].map(h => ({ ...h, width: 10, height: 10, fill: 'blue' }));

    return (
      <>
        {handles.map(handle => (
          <DragHandle
            key={handle.key}
            {...handle}
            draggable
            onDragMove={this.handleDrag}
            dragBoundFunc={this.boundHandles}
          />
        ))}
      </>
    );
  };

  render() {
    const { width: artboardWidth, height: artboardHeight } = this.props;
    const { image, width, height, x, y } = this.state;

    return (
      <Stage width={artboardWidth} height={artboardHeight}>
        <Layer>
          <Image image={image} width={width} height={height} x={x} y={y} />
          {this.renderDragHandles()}
        </Layer>
      </Stage>
    );
  }
}

export { Artboard };
