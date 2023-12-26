import React, { useEffect, useState } from "react";
import { Image, Layer, Rect, Stage } from "react-konva";
import Icon from "./invoice_7.jpg";
import Konva from "konva";
import randomstring from "randomstring";
import { initialAnnotations } from "./annotationdata";
import { Box, Grid, Typography } from "@mui/material";

const DrawAnnotations = () => {
  const [annotations, setAnnotations] = useState([]);
  const [newAnnotation, setNewAnnotation] = useState([]);
  const [image] = useState(new window.Image());
  const [color] = useState(Konva.Util.getRandomColor());

  const randomStr = randomstring.generate(6);
  console.log("image", image.width);

  image.src = Icon;
  //   image.src = "https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-1080x675.jpg";

  useEffect(() => {
    // Replace this with your actual initial data
    setAnnotations(initialAnnotations);
  }, []);

  const handleMouseDown = (event) => {
    // console.log('mouse down called');
    if (newAnnotation.length === 0) {
      const { x, y } = event.target.getStage().getPointerPosition();
      setNewAnnotation([{ x, y, width: 0, height: 0, id: randomStr }]);
    }
  };

  // console.log("annotations", annotations);
  // console.log("newAnnotation", newAnnotation);

  const handleMouseUp = (event) => {
    // console.log('mouseup called');
    if (newAnnotation.length === 1) {
      const sx = newAnnotation[0].x;
      const sy = newAnnotation[0].y;
      const { x, y } = event.target.getStage().getPointerPosition();
      const annotationToAdd = {
        x: sx,
        y: sy,
        width: x - sx,
        height: y - sy,
        // id: annotations.length + 1,
        id: randomStr,
      };
      annotations.push(annotationToAdd);
      setNewAnnotation([]);
      setAnnotations(annotations);
    }
  };

  const handleMouseMove = (event) => {
    if (newAnnotation.length === 1) {
      // console.log('mouse move called');
      const sx = newAnnotation[0].x;
      const sy = newAnnotation[0].y;
      const { x, y } = event.target.getStage().getPointerPosition();
      setNewAnnotation([
        {
          x: sx,
          y: sy,
          width: x - sx,
          height: y - sy,
          //   id: "0",
          id: newAnnotation[0].id,
        },
      ]);
    }
  };

  const annotationsToDraw = [...annotations, ...newAnnotation];
  return (
    <>
      <Grid container>
        <Grid item xs={8.5}>
          <Box sx={{ width: '100vw', height: '100vh', overflow:'auto'}}>
          <Stage
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            // width={900}
            // height={700}
            width={image.width}
            height={image.height}
          >
            <Layer>
              <Image image={image}  />
            </Layer>
            <Layer>
              {annotationsToDraw.map((value) => {
                // console.log("value", value);
                return (
                  // <Rect
                  //   key={value.id}
                  //   x={value.x}
                  //   y={value.y}
                  //   width={value.width}
                  //   height={value.height}
                  //   //   fill="transparent"
                  //   stroke={color}
                  //   draggable
                  // />
                  // <Rect
                  //   key={value.id}
                  //   x={value.x * (900 / value.imageWidth)}
                  //   y={value.y * (700 / value.imageHeight)}
                  //   width={value.width * (900 / value.imageWidth)}
                  //   height={value.height * (700 / value.imageHeight)}
                  //   stroke={color}
                  //   draggable
                  // />
                  <Rect
                    key={value.id}
                    x={value.x}
                    y={value.y}
                    width={value.width}
                    height={value.height}
                    stroke={color}
                    draggable
                  />
                );
              })}
            </Layer>
          </Stage>
          </Box>
        </Grid>
        <Grid item xs={3.5}>
          <Typography>hello there</Typography>
        </Grid>
      </Grid>
    </>
  );
};

export default DrawAnnotations;
