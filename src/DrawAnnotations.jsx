import React, { useEffect, useRef, useState } from "react";
import {
  Group,
  Image,
  Layer,
  Rect,
  Stage,
  Text,
  Transformer,
} from "react-konva";
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
  IconButton,
  Popover,
  Tooltip,
  Typography,
} from "@mui/material";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

const DrawAnnotations = () => {
  const [annotations, setAnnotations] = useState([]);
  const [newAnnotation, setNewAnnotation] = useState([]);
  const [image] = useState(new window.Image());
  // const [initialDataColor] = useState(Konva.Util.getRandomColor());
  const [initialDataColor] = useState("rgba(255,165,0,1)");
  // const [newAnnotationColor] = useState(Konva.Util.getRandomColor());
  const [newAnnotationColor] = useState("blue");
  const [validateColor] = useState("rgba(34,139,34, 1)");
  const [hoverRectFillcolor, sethoverRectFillcolor] = useState("");
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedBox, setSelectedBox] = useState(null);
  const [transformBox, setTransformBox] = useState(null);
  const [hoverId, sethoverId] = useState("");
  const [tootipId, setTootipId] = useState("");
  const [isDragging, setisDragging] = useState(false);
  const shapeRef = useRef([]);
  const transformRef = useRef([]);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const stageRef = useRef(null);

  // useEffect(() => {
  //   if (selectedBox) {
  //     console.log("this called");
  //     console.log(
  //       "transformer",
  //       transformRef.current.nodes([shapeRef.current])
  //     );
  //     console.log("selectedbox", selectedBox);
  //     transformRef.current.nodes([shapeRef.current]);
  //     transformRef.current.getLayer().batchDraw();
  //   }
  // }, [selectedBox]);

  useEffect(() => {
    if (transformBox && hoverId !== "") {
      transformRef.current.forEach((transformer, i) => {
        // console.log("this called");
        if (transformer && transformer.nodes) {
          const node = shapeRef.current[i];
          transformer.nodes([node]);
          transformer.getLayer().batchDraw();
        }
      });
    }
  }, [transformBox, hoverId]);

  const parentRef = useRef();
  const [originalImageSize, setOriginalImageSize] = useState({
    width: "",
    height: "",
  });

  useEffect(() => {
    const parentElement = parentRef.current;
    setOriginalImageSize({
      width: parentElement.clientWidth,
      // height: window.innerHeight * 2,
      height: parentElement.clientHeight * 2,
    });
  }, []);

  // const originalImageSize = { width: 2481, height: 3508 };
  // const originalImageSize = { width: 1000, height: 1000 };

  const randomStr = randomstring.generate(6);
  // console.log("image", image.width);

  image.src = Icon;
  // image.src = "http://192.168.2.213:9014/images/1703675661012-invoice_7.jpg";
  //   image.src = "https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-1080x675.jpg";

  useEffect(() => {
    // Replace this with your actual initial data
    setAnnotations(initialAnnotations);
    sethoverId("");
  }, []);

  const handleMouseEnter = (event) => {
    event.target.getStage().container().style.cursor = "crosshair";
  };

  const handleMouseDown = (event) => {
    // console.log("mouse down called");
    if (tootipId === "" && newAnnotation.length === 0) {
      const { x, y } = event.target.getStage().getPointerPosition();
      setNewAnnotation([{ x, y, width: 0, height: 0, id: randomStr }]);
    }
  };

  console.log("annotations", annotations);
  // console.log("newAnnotation", newAnnotation);

  const handleMouseUp = (event) => {
    if (newAnnotation.length === 1) {
      // console.log("mouseup called");
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
      // const annotationToAdd = {
      //   x: sx / (originalImageSize.width / image.width),
      //   y: sy / (originalImageSize.height / image.height),
      //   width: (x - sx) / (originalImageSize.width / image.width),
      //   height: (y - sy) / (originalImageSize.height / image.height),
      //   id: randomStr,
      //   color: newAnnotationColor,
      // };
      // console.log("annotationToadd", annotationToAdd);
      setNewAnnotation([]);
      if (annotationToAdd.width !== 0 && annotationToAdd.height !== 0) {
        annotations.push(annotationToAdd);
        setAnnotations(annotations);
        setDialogOpen(true);
        setSelectedBox(annotationToAdd);
        setTransformBox(annotationToAdd);
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
    setTransformBox(value);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    if (!selectedBox.label) {
      const updatedAnnotations = annotations.filter(
        (box) => box.id !== selectedBox.id
      );
      setTransformBox(null);
      setTootipId("");
      setAnnotations(updatedAnnotations);
    }
    setDialogOpen(false);
    setSelectedBox(null);
    // if(tootipId !== '' && selectedBox && transformBox && selectedBox.id === transformBox.id && selectedBox.x === transformBox.x){
    //   setTransformBox(null);
    // } else {
    //   setSelectedBox(null);
    // }
    // setTransformBox(null);
  };

  // console.log('selectedbpx', selectedBox);
  // console.log('transformBox', transformBox);
  // console.log('tootipId', tootipId);

  const handleConfirm = () => {
    setDialogOpen(false);
    setSelectedBox(null);
    setTransformBox(null);
    setTootipId("");
    // console.log("selectedbox", selectedBox);

    // const annotationToAdd = {
    //   x: sx / (originalImageSize.width / image.width),
    //   y: sy / (originalImageSize.height / image.height),
    //   width: (x - sx) / (originalImageSize.width / image.width),
    //   height: (y - sy) / (originalImageSize.height / image.height),
    //   id: randomStr,
    //   color: newAnnotationColor,
    // };

    if (selectedBox !== null) {
      const updatedAnnotations = annotations.map((box) => {
        if (box.label === undefined && box.id === selectedBox.id) {
          return {
            id: box.id,
            x: box.x / (originalImageSize.width / image.width),
            y: box.y / (originalImageSize.height / image.height),
            width: box.width / (originalImageSize.width / image.width),
            height: box.height / (originalImageSize.height / image.height),
            validated: true,
            key: "new",
            label: "newbox",
            // color: newAnnotationColor,
          };
        }
        return box.id === selectedBox.id ? { ...box, validated: true } : box;
      });
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
      setTransformBox(null);
    } else {
      annotations.pop();
      setNewAnnotation([]);
      setAnnotations([...annotations]);
      setDialogOpen(false);
      setSelectedBox(null);
      setTransformBox(null);
    }
    setTootipId("");
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

  // console.log("selectedbox", selectedBox);
  // console.log("dialogbox", isDialogOpen);

  const annotationsToDraw = [...annotations, ...newAnnotation];

  useEffect(() => {
    // Ensure refs are initialized with the correct values
    shapeRef.current = shapeRef.current.slice(0, annotationsToDraw.length);
    transformRef.current = transformRef.current.slice(
      0,
      annotationsToDraw.length
    );
    if (transformBox) {
      setTootipId(transformBox.id);
    }
  }, [annotationsToDraw]);

  const rectMouseEnter = (event) => {
    event.target.getStage().container().style.cursor = "move";
    // setisDragging(true);
  };

  const rectMouseLeave = (event) => {
    event.target.getStage().container().style.cursor = "crosshair";
    sethoverId("");
    setTootipId("");
    setNewAnnotation([]);
    // setDialogOpen(false);
    // setSelectedBox(null);
    // setisDragging(false);
  };

  const handleMouseOver = (value) => {
    // console.log(`Mouse over event on box with id: ${value.id}`);
    // You can add more logic based on the mouse over event
    setSelectedBox(value);
    sethoverId(value.id);
    setTootipId(value.id);

    const stage = stageRef.current;
    console.log("stage", stage.current);
    const pointerPos = stage.getPointerPosition() || { x: 0, y: 0 };
    console.log("pointerPos", pointerPos);
    const tooltipX = pointerPos.x;
    const tooltipY = pointerPos.y + 5;

    setTooltipPosition({ x: tooltipX, y: tooltipY });

    if (value.validated) {
      sethoverRectFillcolor("rgba(34,139,34, 0.3)");
    } else {
      sethoverRectFillcolor("rgba(255,165,0,0.3)");
    }
  };

  console.log("tooltipPosition", tooltipPosition);
  // console.log("label", hoverId);

  const handleDragStart = (event) => {
    // setClickMode(false);
    setisDragging(true);
    setDialogOpen(true);
  };

  const handleDragMove = (event) => {
    if (isDragging) {
      setDialogOpen(false);
      // setSelectedBox(null);
      const { x, y } = event.target.attrs;
      const updatedAnnotations = annotations.map((box) =>
        box.id === hoverId
          ? {
              ...box,
              x: x / (originalImageSize.width / image.width),
              y: y / (originalImageSize.height / image.height),
            }
          : box
      );
      setAnnotations(updatedAnnotations);
    }
  };

  const handleDragEnd = (event) => {
    setisDragging(false);
    setSelectedBox(null);
    setTransformBox(null);
    setDialogOpen(false);
  };

  // console.log("transformerref", transformRef);

  return (
    <>
      <Grid container columns={{ xs: 4, sm: 6, md: 12 }}>
        <Grid item xs={8.5}>
          <Box
            ref={parentRef}
            sx={{ width: "auto", height: "100vh", overflow: "auto" }}
          >
            <Stage
              ref={stageRef}
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
                {annotationsToDraw.map((value, i) => {
                  // console.log("value", value);
                  // console.log('i', i);
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
                    <>
                      <Rect
                        key={value.id}
                        // ref={shapeRef}
                        // ref={shapeRef.current[i]}
                        ref={(node) => (shapeRef.current[i] = node)}
                        {...value}
                        // onTransformEnd={event => {
                        //   const node = shapeRef.current;
                        //   const scaleX = node.scaleX();
                        //   const scaleY = node.scaleY();
                        //   node.scaleX(1);
                        //   node.scaleY(1);
                        //   onChange({
                        //     ...shapeProps,
                        //     x: node.x(),
                        //     y: node.y(),
                        //     // set minimal value
                        //     width: Math.max(5, node.width() * scaleX),
                        //     height: Math.max(node.height() * scaleY)
                        //   });
                        // }}
                        onTransformEnd={(event) => {
                          // const node = shapeRef.current;
                          const node = shapeRef.current[i];
                          // console.log("node", node);
                          if (node) {
                            const scaleX = node.scaleX();
                            const scaleY = node.scaleY();
                            // const scaleX = node.scaleX ? node.scaleX() : 1;
                            // const scaleY = node.scaleY ? node.scaleY() : 1;
                            node.scaleX(1);
                            node.scaleY(1);

                            const newAttrs = {
                              ...value,
                              x:
                                node.x() /
                                (originalImageSize.width / image.width),
                              y:
                                node.y() /
                                (originalImageSize.height / image.height),
                              // set minimal value
                              // width: Math.max(5, node.width() * scaleX),
                              width:
                                (node.width() * scaleX) /
                                (originalImageSize.width / image.width),
                              // height: Math.max(node.height() * scaleY),
                              height:
                                (node.height() * scaleY) /
                                (originalImageSize.height / image.height),
                            };
                            console.log("newAttrs", newAttrs);

                            // Call your onChange function directly
                            const rects = annotations.slice();
                            rects[i] = newAttrs;
                            setAnnotations(rects);
                            // setTransformBox(null);
                            if (value.id === transformBox.id) {
                              setSelectedBox(value);
                              setDialogOpen(true);
                            }
                          }
                        }}
                        x={
                          value.label !== undefined
                            ? value.x * (originalImageSize.width / image.width)
                            : value.x
                        }
                        y={
                          value.label !== undefined
                            ? value.y *
                              (originalImageSize.height / image.height)
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
                        fill={hoverId === value.id ? hoverRectFillcolor : null}
                        stroke={
                          value.validated
                            ? validateColor
                            : value.color || initialDataColor
                        }
                        onClick={() => handleBoxClick(value)}
                        strokeWidth={1} // Adjust the width of the border
                        dash={value.label === undefined ? [5, 5] : null} // Set a dashed border pattern
                        // cornerRadius={5} // Set the radius of the corners
                        cornerRadius={
                          value.label !== undefined &&
                          value.width > 0 &&
                          value.height > 0
                            ? 5 // Set the radius of the corners for rectangles with positive width and height
                            : 0 // No corner radius for rectangles with negative width or height
                        }
                        onMouseOver={() => handleMouseOver(value)}
                        onMouseEnter={rectMouseEnter}
                        onMouseLeave={rectMouseLeave}
                        draggable
                        onDragStart={handleDragStart}
                        onDragMove={handleDragMove}
                        onDragEnd={handleDragEnd}
                      />
                      {/* {selectedBox && <Transformer ref={transformRef} />} */}
                      {transformBox && transformBox.id === value.id && (
                        <Transformer
                          key={`transformer-${value.id}`} // Ensure a unique key for each Transformer
                          // ref={transformRef.current[i]}
                          ref={(node) => (transformRef.current[i] = node)}
                          // ref={transformRef}
                          // flipEnabled={false}
                          rotateEnabled={false}
                          boundBoxFunc={(oldBox, newBox) => {
                            // limit resize
                            if (
                              Math.abs(newBox.width) < 5 ||
                              Math.abs(newBox.height) < 5
                            ) {
                              return oldBox;
                            }
                            return newBox;
                          }}
                        />
                      )}
                    </>
                  );
                })}
              </Layer>
              <Layer>
                {annotationsToDraw.map((value) => {
                  return (
                    <React.Fragment key={value.id}>
                      {hoverId === value.id && (
                        <Rect
                          x={tooltipPosition?.x} // Adjust the position as needed
                          y={tooltipPosition?.y}
                          width={100} // Set the width of the tooltip-like rect
                          height={30} // Set the height of the tooltip-like rect
                          fill="rgba(255,165,0,0.8)" // Set the background color of the tooltip-like rect
                          cornerRadius={5} // Set the radius of the corners
                        />
                      )}
                      {hoverId === value.id && (
                        <Text
                          x={tooltipPosition?.x + 10} // Adjust the position as needed
                          y={tooltipPosition?.y + 10} // Adjust the position as needed
                          text={`${value?.label}`}
                          fill="black" // Set the text color
                        />
                        // <p x={tooltipPosition?.x + 10} // Adjust the position as needed
                        //   y={tooltipPosition?.y + 10} // Adjust the position as needed
                        //   text={`${value?.label}`}
                        //   fill="black" // Set the text color
                        //   />
                        // <Tooltip
                        //   x={tooltipPosition?.x + 10} // Adjust the position as needed
                        //   y={tooltipPosition?.y + 10} // Adjust the position as needed
                        //   text={`${value?.label}`}
                        //   fill="black" // Set the text color
                        // />
                        // <Typography
                        //   variant="body1"
                        //   x={tooltipPosition?.x + 10}
                        //   y={tooltipPosition?.y + 10}
                        //   fill="black"
                        // />
                      )}
                      {/* {hoverId === value.id && (
                        <Typography
                          variant="body1"
                          x={tooltipPosition?.x + 10}
                          y={tooltipPosition?.y + 10}
                          fill="black"
                        >
                          {`${value?.label}`}
                        </Typography>
                      )} */}
                      {/* {hoverId === value.id && (
                        <Group>
                          <Rect
                            x={tooltipPosition?.x + 10}
                            y={tooltipPosition?.y + 10}
                            width={200} // Adjust width as needed
                            height={40} // Adjust height as needed
                            fill="rgba(0, 0, 0, 0)" // Transparent fill
                          />
                          <foreignObject
                            x={tooltipPosition?.x + 10}
                            y={tooltipPosition?.y + 10}
                            width={200}
                            height={30}
                          >
                            <div>
                              <Typography
                                variant="body1"
                                style={{ color: "black" }}
                              >
                                {value?.label}
                              </Typography>
                            </div>
                          </foreignObject>
                        </Group>
                      )} */}
                    </React.Fragment>
                  );
                })}
              </Layer>
            </Stage>
          </Box>
        </Grid>
        <Grid item xs={3.5}>
          {/* <Typography>hello there</Typography> */}
          <Box sx={{ width: "auto", height: "100vh", overflow: "auto" }}>
            {annotationsToDraw.map((annotation) => (
              <div
                key={annotation.id}
                onMouseOver={() => handleMouseOver(annotation)}
              >
                <Typography variant="subtitle1">{annotation.label}</Typography>
                <Typography variant="body1">{annotation.value}</Typography>
                <hr />
              </div>
            ))}
          </Box>
        </Grid>

        {/* <Dialog
          open={isDialogOpen}
          // onClose={(event, reason) => {
          //   if (reason !== "backdropClick") {
          //     handleCloseDialog();
          //   }
          // }}
          sx={{
            position: "absolute",
            boxShadow: "0px 0px 20px 6px rgba(0, 0, 0, 0.1)",
          }}
          onClose={handleCloseDialog}
        > */}
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
          {/* <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{
              position: "absolute",
              right: 2,
              top: 2,
            }}
          >
            {" "}
            <HighlightOffIcon
              sx={{
                width: "24px",
                height: "24px",
              }}
            />
          </IconButton> */}
          <DialogTitle>New Box Drawn</DialogTitle>
          <DialogContent>
            <Typography>A new box has been drawn!</Typography>
            {selectedBox !== null ? (
              <Typography>{`Details for Box ${selectedBox.value}`}</Typography>
            ) : null}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleConfirm}>confirm</Button>
            <Button onClick={handleRemove}>remove</Button>
          </DialogActions>
        {/* </Dialog> */}
        </Popover>
      </Grid>
    </>
  );
};

export default DrawAnnotations;
