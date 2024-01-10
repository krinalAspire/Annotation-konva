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
  AppBar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Popover,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import CropSquareIcon from "@mui/icons-material/CropSquare";
import trash from "./x-circle.svg";
import check from "./check-circle.svg";

const TootipPosition = () => {
  const [annotations, setAnnotations] = useState([]);
  const [newAnnotation, setNewAnnotation] = useState([]);
  const [image] = useState(new window.Image());
  const [trashimage] = useState(new window.Image());
  const [checkimage] = useState(new window.Image());
  // const [initialDataColor] = useState(Konva.Util.getRandomColor());
  const [initialDataColor] = useState("rgba(255,165,0,1)");
  // const [newAnnotationColor] = useState(Konva.Util.getRandomColor());
  const [newAnnotationColor] = useState("blue");
  const [validateColor] = useState("rgba(34,139,34, 1)");
  const [hoverRectFillcolor, sethoverRectFillcolor] = useState("");
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedBox, setSelectedBox] = useState(null);
  const [hoverBox, sethoverBox] = useState(null);
  const [transformBox, setTransformBox] = useState(null);
  const [hoverId, sethoverId] = useState("");
  const [tootipId, setTootipId] = useState("");
  const [isResizing, setisResizing] = useState(false);
  const [isDragging, setisDragging] = useState(false);
  const shapeRef = useRef([]);
  const transformRef = useRef([]);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [iconPosition, setIconPosition] = useState({ x: 0, y: 0 });
  const stageRef = useRef(null);
  const textRef = useRef(null);
  
  const versionOptions = [
    "version1",
    "version2",
    "version3",
    "version4",
    "version5",
    "version6",
    "version7",
    "version8",
  ];

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedItem, setSelectedItem] = useState(versionOptions[0]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (item) => {
    setAnchorEl(null);
    if (item) {
      setSelectedItem(item);
    }
  };


  useEffect(() => {
    if (transformBox && hoverId !== "") {
      transformRef.current.forEach((transformer, i) => {
        // console.log("this called");
        if (transformer && transformer.nodes) {
          const node = shapeRef.current[i];
          //   console.log("shapeRef", shapeRef.current[i].attrs.id);
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

  const randomStr = randomstring.generate(6);

  image.src = Icon;
  trashimage.src = trash;
  checkimage.src = check;

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
    // setSelectedBox(null);
    if (selectedBox && !selectedBox.label) {
      const updatedAnnotations = annotations.filter(
        (box) => box.id !== selectedBox.id
      );
      setTransformBox(null);
      setTootipId("");
      setAnnotations(updatedAnnotations);
      setDialogOpen(false);
      setSelectedBox(null);
      sethoverBox(null);
    } else if (hoverId === "" && selectedBox) {
      setDialogOpen(false);
      setSelectedBox(null);
      sethoverBox(null);
    }
  };

  //   console.log("annotations", annotations);
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
      const imageSizeannotationToAdd = {
        x: sx / (originalImageSize.width / image.width),
        y: sy / (originalImageSize.height / image.height),
        width: (x - sx) / (originalImageSize.width / image.width),
        height: (y - sy) / (originalImageSize.height / image.height),
        id: randomStr,
        color: newAnnotationColor,
      };
      // console.log("annotationToadd", annotationToAdd);
      setNewAnnotation([]);
      if (annotationToAdd.width !== 0 && annotationToAdd.height !== 0) {
        annotations.push(annotationToAdd);
        setAnnotations(annotations);
        setDialogOpen(true);
        setSelectedBox(imageSizeannotationToAdd);
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

  const handleBoxClick = (value) => {
    // Handle box click here, e.g., fetch data based on id
    // and open a popup with the data
    if (transformBox !== null && transformBox.id === hoverId) {
      setSelectedBox(null);
      setTransformBox(null);
      setDialogOpen(false);
    } else {
      setSelectedBox(value);
      setTransformBox(value);
      setDialogOpen(true);
    }
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
    sethoverBox(null);
  };

  // console.log("selectedbpx", selectedBox);
  // console.log("transformBox", transformBox);
  // console.log("tootipId", tootipId);

  const handleConfirm = () => {
    setDialogOpen(false);
    setSelectedBox(null);
    sethoverBox(null);
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
          // console.log("this called");
          return {
            id: box.id,
            x: box.x / (originalImageSize.width / image.width),
            y: box.y / (originalImageSize.height / image.height),
            width: box.width / (originalImageSize.width / image.width),
            height: box.height / (originalImageSize.height / image.height),
            validated: true,
            key: "new",
            label: "newbox",
            version: selectedItem,
            // color: newAnnotationColor,
          };
        }
        return box.id === selectedBox.id
          ? { ...box, validated: true, version: selectedItem }
          : box;
      });
      // console.log("updateeeeeeeeeeeeeeeeeeeeeeeee", updatedAnnotations);
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
      sethoverBox(null);
      setTransformBox(null);
    } else {
      annotations.pop();
      setNewAnnotation([]);
      setAnnotations([...annotations]);
      setDialogOpen(false);
      setSelectedBox(null);
      sethoverBox(null);
      setTransformBox(null);
    }
    setTootipId("");
  };

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
    sethoverBox(null);
  };

  const handleMouseOver = (value) => {
    // console.log(`Mouse over event on box with id: ${value.id}`);
    // You can add more logic based on the mouse over event
    // setSelectedBox(value);
    textRef.current = value.label;
    sethoverBox(value);
    if (value.label) {
      sethoverId(value.id);
    }
    setTootipId(value.id);

    const stage = stageRef.current;
    // console.log("stage", stage.current);
    const pointerPos = stage.getPointerPosition() || { x: 0, y: 0 };
    // console.log("pointerPos", pointerPos);
    const tooltipX = pointerPos.x;
    const tooltipY = pointerPos.y + 5;

    setTooltipPosition({ x: tooltipX, y: tooltipY });

    if (value.version === selectedItem && value.validated) {
      sethoverRectFillcolor("rgba(34,139,34, 0.3)");
    } else if (value.version !== selectedItem && value.validated) {
      // sethoverRectFillcolor("rgba(255,165,0,0.3)");
      // getBackgroundForVersion(value.version, 0.3)
      const colorWithOpacity = getBackgroundForVersion(value.version, 0.3);
      sethoverRectFillcolor(colorWithOpacity);
    } else {
      sethoverRectFillcolor("rgba(255,165,0,0.3)");
    }
  };

  // console.log("tooltipPosition", tooltipPosition);
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
    sethoverBox(null);
    setTransformBox(null);
    setDialogOpen(false);
  };

  const handletransformcancle = () => {
    setTransformBox(null);
    setTootipId("");
  };

  const getBackgroundForVersion = (version, opacity) => {
    const index = versionOptions.indexOf(version);
    const hue = (index * 137.508) % 360; // 137.508 is an arbitrary constant to provide variation
    const color = `hsla(${hue}, 100%, 50%, ${opacity})`;

    return index !== -1 ? color : "black";
  };

  const versionSet = new Set();

  annotationsToDraw.forEach((value) => {
    if (value.version) {
      versionSet.add(value.version);
    }
  });

  //   console.log("versionSet", Array.from(versionSet));

  const transformMouseEnter = (event) => {
    event.target.getStage().container().style.cursor = "pointer";
    // setisDragging(true);
  };

  const transformMouseLeave = (event) => {
    event.target.getStage().container().style.cursor = "crosshair";
  };

  const scrollBoxRef = useRef();

  const handleScroll = () => {
    const boxScrollPosition = {
      x: parentRef.current?.scrollLeft,
      y: parentRef.current?.scrollTop,
    };

    sethoverId("");
    setSelectedBox(null);
    setTransformBox(null);
    // console.log("Box Scroll Position:", boxScrollPosition);
  };

  console.log(" parentRef.current.scrollLeft", parentRef.current?.scrollTop);
  // console.log('selectedbox', selectedBox);

  return (
    <Box>
      <Grid container columns={{ xs: 4, sm: 6, md: 12 }}>
        <Grid item xs={8.5}>
          <Box sx={{ flexGrow: 1 }}>
            <AppBar
              position="static"
              // className={classes.ExternalheaderAppbar}
              sx={{
                background: "rgba(222,214,241,1)",
                // width: "auto",
              }}
            >
              <Toolbar
                variant="dense"
                sx={{ display: "flex", justifyContent: "flex-end" }}
              >
                {Array.from(versionSet).map((value) => {
                  if (value !== selectedItem) {
                    return (
                      <>
                        <Box
                          sx={{
                            width: { xs: "10px", lg: "12px" },
                            height: { xs: "10px", lg: "12px" },
                            // background:'red'
                            background: getBackgroundForVersion(value, 1),
                            marginRight: 1,
                          }}
                        />
                        <Typography color="black">{value}</Typography>
                      </>
                    );
                  }
                  return null;
                })}

                <Button
                  onClick={handleClick}
                  // className={classes.MonthselectDropdownbutton}
                  endIcon={
                    <IconButton size="small" edge="start">
                      {/* <KeyboardArrowDownIcon /> */}
                      <Box
                        sx={{
                          width: { xs: "10px", lg: "12px" },
                          height: { xs: "10px", lg: "12px" },
                          // background:'red'
                          background: getBackgroundForVersion(selectedItem, 1),
                        }}
                      />
                    </IconButton>
                  }
                  sx={{
                    ml: 2,
                    background: "lightgrey",
                    color: "white",
                    "&:hover": { background: "grey", color: "white" },
                  }}
                >
                  {selectedItem}
                </Button>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={() => handleClose()}
                  // className={classes.MonthselectDropdownbuttonMenu}
                  sx={{
                    top: "0.5%",
                    // "& .MuiPaper-root": {
                    //   width: {
                    //     xs: "100px",
                    //     sm: "82px",
                    //     md: "87px",
                    //     lg: "95px",
                    //     xl: "106px",
                    //     xxl: "109px",
                    //   },
                    // },
                  }}
                >
                  {versionOptions.map((option) => (
                    <MenuItem key={option} onClick={() => handleClose(option)}>
                      <>
                        <Typography mr={1.5}>{option}</Typography>
                        <Box
                          sx={{
                            width: { xs: "10px", lg: "12px" },
                            height: { xs: "10px", lg: "12px" },
                            // background:'red'
                            background: getBackgroundForVersion(option, 1),
                          }}
                        />
                      </>
                    </MenuItem>
                  ))}
                </Menu>
              </Toolbar>
            </AppBar>
          </Box>
          <Box
            ref={parentRef}
            onScroll={handleScroll}
            sx={{ width: "auto", height: "92vh", overflow: "auto" }}
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
                  return (
                    <>
                      <Rect
                        key={value.id}
                        ref={(node) => (shapeRef.current[i] = node)}
                        {...value}
                        onTransformEnd={(event) => {
                          // const node = shapeRef.current;
                          const node = shapeRef.current[i];
                          //   console.log("node", node);
                          if (node) {
                            const scaleX = node.scaleX();
                            const scaleY = node.scaleY();
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
                              width:
                                (node.width() * scaleX) /
                                (originalImageSize.width / image.width),
                              height:
                                (node.height() * scaleY) /
                                (originalImageSize.height / image.height),
                            };

                            // Call your onChange function directly
                            const rects = annotations.slice();
                            rects[i] = newAttrs;
                            setAnnotations(rects);
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
                        fill={
                          value.label
                            ? hoverId === value.id
                              ? hoverRectFillcolor
                              : value.version === selectedItem &&
                                value.validated
                              ? "rgba(34,139,34, 0.1)"
                              : value.version !== selectedItem &&
                                value.validated
                              ? getBackgroundForVersion(value.version, 0.1)
                              : "rgba(255,165,0,0.1)"
                            : null
                        }
                        stroke={
                          value.version === selectedItem && value.validated
                            ? validateColor
                            : value.version !== selectedItem && value.validated
                            ? getBackgroundForVersion(value.version, 1)
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
                      {transformBox &&
                        transformBox.label &&
                        transformBox.id === value.id && (
                          <Transformer
                            key={`transformer-${value.id}`} // Ensure a unique key for each Transformer
                            ref={(node) => (transformRef.current[i] = node)}
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
                            onClick={() => setSelectedBox(value)}
                            onMouseDown={onmousedown}
                            // anchorFill='green'
                            anchorFill={
                              value.version === selectedItem && value.validated
                                ? validateColor
                                : value.version !== selectedItem &&
                                  value.validated
                                ? getBackgroundForVersion(value.version, 1)
                                : value.color || initialDataColor
                            }
                            anchorSize={8}
                            // anchorCornerRadius={2}
                          />
                        )}

                      {transformBox &&
                        transformBox.label &&
                        transformBox.x === value.x &&
                        transformBox.id === value.id && (
                          <Image
                            image={trashimage}
                            x={
                              shapeRef.current[i] &&
                              shapeRef.current[i].getAbsolutePosition().x +
                                value.width *
                                  (originalImageSize.width / image.width) +
                                5 // Adjust the offset as needed
                            }
                            y={
                              shapeRef.current[i] &&
                              shapeRef.current[i].getAbsolutePosition().y +
                                value.height *
                                  (originalImageSize.height / image.height) -
                                20 // Adjust the offset as needed
                            }
                            width={20} // Adjust width as needed
                            height={20} // Adjust height as needed
                            onClick={handletransformcancle}
                            onMouseEnter={transformMouseEnter}
                            onMouseLeave={transformMouseLeave}
                          />
                        )}

                      {transformBox &&
                        transformBox.x !== value.x &&
                        transformBox.id === value.id && (
                          <Image
                            image={checkimage}
                            x={
                              shapeRef.current[i] &&
                              shapeRef.current[i].getAbsolutePosition().x +
                                value.width *
                                  (originalImageSize.width / image.width) +
                                5 // Adjust the offset as needed
                            }
                            y={
                              shapeRef.current[i] &&
                              shapeRef.current[i].getAbsolutePosition().y +
                                value.height *
                                  (originalImageSize.height / image.height) -
                                20 // Adjust the offset as needed
                            }
                            width={20} // Adjust width as needed
                            height={20} // Adjust height as needed
                            onClick={handletransformcancle}
                            onMouseEnter={transformMouseEnter}
                            onMouseLeave={transformMouseLeave}
                          />
                        )}
                    </>
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

        {isDialogOpen &&
          selectedBox &&
          annotationsToDraw.map((value, i) => {
            const originalY = shapeRef.current[i].getAbsolutePosition().y;
            const originalX = shapeRef.current[i].getAbsolutePosition().x;

            const topPosition =
              parentRef.current?.scrollTop !== null &&
              parentRef.current?.scrollTop > 0
                ? originalY - parentRef.current?.scrollTop + 70 :
                // : Math.min(
                    originalY + parentRef.current?.scrollTop + 70
                  //   window.innerHeight - 50
                  // );

            const leftPosition = originalX + parentRef.current?.scrollLeft;

            const adjustedTopPosition = topPosition;
            if (selectedBox.id === value.id) {
              // console.log('adjustedposition', adjustedTopPosition);
              // console.log('leftPosition', leftPosition);
              return (
                <Box
                  key={`typography-${value?.id}`} // Make sure to add a unique key
                  sx={{
                    position: "absolute",
                    // left:
                    //   shapeRef.current[i].getAbsolutePosition().x -
                    //   shapeRef.current[i].width() +
                    //   50 +
                    //   "px",
                    // top:
                    //   shapeRef.current[i].getAbsolutePosition().y +
                    //   shapeRef.current[i].height() +
                    //   20 +
                    //   "px",
                    left: leftPosition + "px",
                    //   top:
                    //     adjustedTopPosition > 100
                    //       ? adjustedTopPosition -
                    //         (adjustedTopPosition - 300) +
                    //         "px"
                    //       : adjustedTopPosition + "px",
                    top: adjustedTopPosition + "px",
                    zIndex: 9999,
                    // background: "orange",
                    background: "yellow", // Set background color
                    boxShadow: "0px 0px 20px 6px rgba(0, 0, 0, 0.1)", // Add box shadow
                    // width:'20vw'
                    width:'300px',
                    height:'190px',
                    overflow:'auto'
                  }}
                  ref={parentRef}
                  // onClick={handleCloseDialog}
                >
                  <DialogTitle>New Box Drawn</DialogTitle>
                  <DialogContent>
                    <Typography>A new box has been drawn!</Typography>
                    <Typography>{adjustedTopPosition}{leftPosition}</Typography>
                    {selectedBox !== null ? (
                      <Typography>{`Details for Box ${selectedBox.value}`}</Typography>
                    ) : null}
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleConfirm}>confirm</Button>
                    <Button onClick={handleRemove}>remove</Button>
                  </DialogActions>
                </Box>
              );
            }
            return null;
          })}

        {hoverId !== "" &&
          annotationsToDraw.map((value, i) => {
            if (hoverBox.id === value.id) {
              const originalY = shapeRef.current[i].getAbsolutePosition().y;
              const originalX = shapeRef.current[i].getAbsolutePosition().x;

              const topPosition =
                parentRef.current?.scrollTop !== undefined &&
                parentRef.current?.scrollTop > 0
                  ? originalY - parentRef.current.scrollTop + 13
                  : parentRef.current?.scrollTop === undefined ? Math.min(
                    originalY + 13,
                    window.innerHeight - 50
                  ) : Math.min(
                      originalY + parentRef.current?.scrollTop + 13,
                      window.innerHeight - 50
                    );

              const leftPosition = parentRef.current?.scrollLeft !== undefined ? originalX + parentRef.current?.scrollLeft : originalX;

              const adjustedTopPosition = topPosition;

              //   console.log('topposition', topPosition);
              console.log('parentRef.current?.scrollTop',parentRef.current?.scrollTop);
              console.log(' originalY + parentRef.current?.scrollTop + 70', originalY + parentRef.current?.scrollTop + 70);

              return (
                hoverBox.id === value.id && (
                  <Box
                    key={`typography-${value?.id}`}
                    sx={{
                      position: "absolute",
                      left: leftPosition + "px",
                      //   top:
                      //     adjustedTopPosition > 100
                      //       ? adjustedTopPosition -
                      //         (adjustedTopPosition - 300) +
                      //         "px"
                      //       : adjustedTopPosition + "px",
                      top: adjustedTopPosition + "px",
                      zIndex: 9999,
                      //   background: "white",
                      boxShadow: "0px 0px 20px 6px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    {hoverBox !== null ? (
                      <Typography
                        sx={{
                          background: "orange",
                          borderRadius: 2,
                          padding: 0.5,
                        }}
                      >
                        {hoverBox.label}
                      </Typography>
                    ) : null}
                  </Box>
                )
              );
            }
            return null;
          })}
      </Grid>
    </Box>
  );
};

export default TootipPosition;
