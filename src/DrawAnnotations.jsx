import React, { useEffect, useState } from "react";
import { Image, Layer, Rect, Stage } from "react-konva";
import Icon from "./invoice_7.jpg";
import img7 from "./geometric-architecture-project-invoice_23-2149660465.avif";
import Konva from "konva";
import randomstring from "randomstring";
import { initialAnnotations } from "./annotationdata";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Popover,
  Typography,
} from "@mui/material";

const DrawAnnotations = () => {
  const [annotations, setAnnotations] = useState([]);
  const [intialData, setintialData] = useState([]);
  const [newAnnotation, setNewAnnotation] = useState([]);
  const [image] = useState(new window.Image());
  const [initialDataColor] = useState(Konva.Util.getRandomColor());
  const [newAnnotationColor] = useState(Konva.Util.getRandomColor());
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedBox, setSelectedBox] = useState(null);

  // const originalImageSize = { width: 2481, height: 3508 };
  const originalImageSize = { width: 1000, height: 1000 };

  const randomStr = randomstring.generate(6);
  // console.log("image", image.width);

  image.src = Icon;
  //   image.src = "https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-1080x675.jpg";

  useEffect(() => {
    // Replace this with your actual initial data
    setAnnotations(initialAnnotations);
    setintialData(initialAnnotations);
  }, []);

  const handleMouseEnter = (event) => {
    event.target.getStage().container().style.cursor = "crosshair";
  };

  const handleMouseDown = (event) => {
    console.log("mouse down called");
    if (newAnnotation.length === 0) {
      const { x, y } = event.target.getStage().getPointerPosition();
      setNewAnnotation([{ x, y, width: 0, height: 0, id: randomStr }]);
    }
  };

  console.log("annotations", annotations);
  console.log("newAnnotation", newAnnotation);

  const handleMouseUp = (event) => {
    if (newAnnotation.length === 1) {
      console.log("mouseup called");
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
        color: newAnnotationColor,
      };
      // console.log('annotationToadd', annotationToAdd.width);
      setNewAnnotation([]);
      if (annotationToAdd.width !== 0 && annotationToAdd.height !== 0) {
        annotations.push(annotationToAdd);
        setAnnotations(annotations);
        setDialogOpen(true);
      }
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
          color: newAnnotationColor,
        },
      ]);
    }
  };

  // const handleCloseDialog = () => {
  //   setDialogOpen(false);
  // };

  // const handleRemove = () => {
  //   annotations.pop();
  //   setNewAnnotation([]);
  //   setAnnotations([...annotations]);
  //   setDialogOpen(false);
  // }

  const handleBoxClick = (value) => {
    // Handle box click here, e.g., fetch data based on id
    // and open a popup with the data
    setSelectedBox(value);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedBox(null);
    // console.log('selectedbox', selectedBox);

    if (selectedBox !== null) {
      const updatedAnnotations = annotations.map((box) => {
        console.log("box", box);
        return box.id === selectedBox.id ? { ...box, validated: true } : box;
      });
      console.log("updatedannotationbox", updatedAnnotations);
      setAnnotations(updatedAnnotations);
    }
  };

  const handleRemove = () => {
    if (selectedBox !== null) {
      const updatedAnnotations = annotations.filter(
        (box) => box.id !== selectedBox.id
      );
      setAnnotations(updatedAnnotations);
      setNewAnnotation([]);
      setDialogOpen(false);
      setSelectedBox(null);
    } else {
      annotations.pop();
      setNewAnnotation([]);
      setAnnotations([...annotations]);
      setDialogOpen(false);
      setSelectedBox(null);
    }
  };

  // const handleRemove = () => {
  //   if (selectedBox !== null) {
  //     const updatedAnnotations = annotations.filter(
  //       (box) => box.id !== selectedBox.id
  //     );
  //     setAnnotations(updatedAnnotations);
  //   }
  //   setNewAnnotation([]);
  //   setDialogOpen(false);
  //   setSelectedBox(null);
  // };

  console.log("selectedbox", selectedBox);
  console.log("dialogbox", isDialogOpen);

  const annotationsToDraw = [...annotations, ...newAnnotation];

  const onMouseEnter = (event) => {
    event.target.getStage().container().style.cursor = "move";
  };

  const onMouseLeave = (event) => {
    event.target.getStage().container().style.cursor = "crosshair";
  };

  return (
    <>
      <Grid container>
        <Grid item xs={8.5}>
          <Box sx={{ width: "70vw", height: "100vh", overflow: "auto" }}>
            <Stage
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              // width={900}
              // height={700}
              // width={image.width}
              // height={image.height}
              // width={window.innerWidth}
              // height={window.innerHeight}
              width={originalImageSize.width}
              height={originalImageSize.height}
            >
              <Layer>
                <Image
                  image={image}
                  scaleX={originalImageSize.width / image.width}
                  scaleY={originalImageSize.height / image.height}
                />
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
                    // <Rect
                    //   key={value.id}
                    //   x={value.x}
                    //   y={value.y}
                    //   width={value.width}
                    //   height={value.height}
                    //   onMouseEnter={onMouseEnter}
                    //   onMouseLeave={onMouseLeave}
                    //   // stroke={color}
                    //   // stroke={value === newAnnotation[0] ? newAnnotationColor : color}
                    //   fill="transparent"
                    //   stroke={value.color || initialDataColor}
                    //   onClick={() => handleBoxClick(value)}
                    //   // draggable
                    // />
                    <Rect
                      key={value.id}
                      x={
                        value.label !== undefined
                          ? value.x * (originalImageSize.width / image.width)
                          : value.x
                      }
                      y={
                        value.label !== undefined
                          ? value.y * (originalImageSize.height / image.height)
                          : value.y
                      }
                      width={
                        value.label !== undefined
                          ? value.width *
                            (originalImageSize.width / image.width)
                          : value.width
                      }
                      height={
                        value.label !== undefined
                          ? value.height *
                            (originalImageSize.height / image.height)
                          : value.height
                      }
                      fill="transparent"
                      stroke={value.color || initialDataColor}
                      onClick={() => handleBoxClick(value)}
                      strokeWidth={2} // Adjust the width of the border
                      dash={value.label === undefined ? [5, 5] : null} // Set a dashed border pattern
                      // cornerRadius={5} // Set the radius of the corners
                      cornerRadius={
                        value.label !== undefined &&
                        value.width > 0 &&
                        value.height > 0
                          ? 5 // Set the radius of the corners for rectangles with positive width and height
                          : 0 // No corner radius for rectangles with negative width or height
                      }
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

        {/* <Dialog open={isDialogOpen} onClose={handleCloseDialog}> */}
        <Popover
          open={isDialogOpen}
          onClose={handleCloseDialog}
          anchorEl={
            selectedBox ? document.getElementById(selectedBox.id) : null
          }
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <DialogTitle>New Box Drawn</DialogTitle>
          <DialogContent>
            <Typography>A new box has been drawn!</Typography>
            {selectedBox !== null ? (
              <Typography>{`Details for Box ${selectedBox.value}`}</Typography>
            ) : null}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>confirm</Button>
            <Button onClick={handleRemove}>remove</Button>
          </DialogActions>
          {/* </Dialog> */}
        </Popover>
      </Grid>
    </>
  );
};

export default DrawAnnotations;
