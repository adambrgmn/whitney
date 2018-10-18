import React, { PureComponent } from 'react';
import { Layer, Image, Rect } from 'react-konva';
import { Stage } from './styles';
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

  handleDrag = ({ key }) => event => {
    const { width: artboardWidth, height: artboardHeight } = this.props;
    const {
      x: oldX,
      y: oldY,
      width: oldWidth,
      height: oldHeight,
      aspect,
    } = this.state;

    let width = 0;
    let height = 0;

    switch (key) {
      case 'top':
      case 'bottom':
        const newY = event.target.y();
        const deltaY = newY - oldY;

        height = oldHeight - deltaY * 2;
        width = height / aspect;
        break;

      case 'left':
      case 'right':
      default:
        const newX = event.target.x();
        const deltaX = newX - oldX;

        width = oldWidth - deltaX * 2;
        height = width * aspect;
    }

    const { x, y } = this.processCenterPos({
      artboardWidth,
      width,
      artboardHeight,
      height,
    });

    return this.setState(() => ({ width, height, x, y }));
  };

  bindHandles = ({ key, x, y }) => newPos => {
    const { width: artboardWidth, height: artboardHeight } = this.props;

    switch (key) {
      case 'top':
      case 'bottom':
        return { x, y: cap(0, artboardHeight, newPos.y) };
      case 'left':
      case 'right':
        return { x: cap(0, artboardWidth, newPos.x), y };
      default:
        return newPos;
    }
  };

  renderDragHandles = () => {
    const { width: w, height: h, x, y } = this.state;

    const handles = [
      { key: 'top', x: x + w / 2, y },
      { key: 'right', x: x + w, y: y + h / 2 },
      { key: 'bottom', x: x + w / 2, y: y + h },
      { key: 'left', x, y: y + h / 2 },
    ].map(h => ({ ...h, width: 10, height: 10, fill: 'blue' }));

    return (
      <>
        {handles.map(handle => (
          <DragHandle
            key={handle.key}
            {...handle}
            draggable
            onDragMove={this.handleDrag(handle)}
            dragBoundFunc={this.bindHandles(handle)}
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
          <Rect
            width={artboardWidth}
            height={artboardHeight}
            x={0}
            y={0}
            fill="white"
          />
          <Image image={image} width={width} height={height} x={x} y={y} />
          {this.renderDragHandles()}
        </Layer>
      </Stage>
    );
  }
}

export { Artboard };
