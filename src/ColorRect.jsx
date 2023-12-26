import React, { useState } from 'react';
import { Rect } from 'react-konva';
import Konva from 'konva';

const ColoreRect = () => {
  const [color, setColor] = useState('green');

  const handleClick = () => {
    setColor(Konva.Util.getRandomColor());
  };

  return (
    <Rect
      x={20}
      y={20}
      width={50}
      height={50}
      fill={color}
      shadowBlur={5}
      onClick={handleClick}
      draggable
    />
  );
};


export default ColoreRect;