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
import { initialAnnotations, pdfData } from "./annotationdata";
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
import * as pdfjs from "pdfjs-dist/build/pdf"; // Corrected import statement
import "pdfjs-dist/build/pdf.worker.min"; // Import PDF worker script

const PDFAnnotation = () => {
  const [annotations, setAnnotations] = useState([]);
  const [newAnnotation, setNewAnnotation] = useState([]);
  // const [image] = useState(new window.Image());
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
  const [isDragging, setisDragging] = useState(false);
  const shapeRef = useRef([]);
  const transformRef = useRef([]);
  const stageRef = useRef(null);
  const textRef = useRef(null);
  const [pdfPages, setPdfPages] = useState([]);
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const pdfUrl = "http://192.168.2.213:9014/images/1707385896805-invoice_1.pdf";
  // const pdfUrl ="http://192.168.2.213:9014/images/1708334472986-test-pdf-konva.pdf";
  // const pdfUrl = 'http://192.168.2.213:9014/images/1708508227748-invoice_2.pdf';
  // const pdfUrl = 'http://192.168.2.213:9014/images/1708508517303-invoice_0.pdf';
  // const pdfUrl = 'http://192.168.2.213:9014/images/1708508648858-invoice_590.pdf';
  // const pdfUrl = 'http://192.168.2.213:9014/images/1708508886990-png2pdf.pdf';

  useEffect(() => {
    const loadPDF = async () => {
      const pdf = await pdfjs.getDocument(pdfUrl).promise;
      const pages = [];
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        // console.log("page", page);
        const viewport = page.getViewport({ scale: 1.5 });
        console.log('page',page?.view);
        const canvas = document.createElement("canvas");
        const canvasContext = canvas.getContext("2d");
        // console.log('viewport',viewport);
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const renderContext = {
          canvasContext,
          viewport,
        };
        await page.render(renderContext).promise;
        // let imageDataArray = [];
        const imageData = canvas.toDataURL();
        // imageDataArray.push(imageData);
        setImageUrl(imageData);

        const actualImageWidth = page.view[2] * 1.5; // Width of the image
        const actualImageHeight = page.view[3] * 1.5; // Height of the image

        console.log('actualImageWidth', actualImageWidth);
        console.log('actualImageHeight', actualImageHeight);

        // const scale = 1.5;

        // console.log('Actual width:', viewport.width * scale);
        // console.log('Actual height:',viewport.height * scale);

        // Create a new window.Image instance
        const image = new window.Image();
        setImage(image);

        // Set the src attribute to the data URL
        image.src = imageData;

        // Wait for the image to load
        await new Promise((resolve, reject) => {
          image.onload = resolve;
          image.onerror = reject;
        });

        // Push the loaded image to the pages array
        pages.push(image);
      }
      setPdfPages(pages);
    };

    loadPDF();

    const countPages = async (file) => {
      const loadingTask = pdfjs.getDocument(file);
      try {
        const pdf = await loadingTask.promise;
        // console.log('Number of pages:', pdf.numPages);
        // console.log('Number of pages:', pdf);
      } catch (error) {
        console.error("Error while loading PDF: ", error);
      }
    };

    countPages(pdfUrl);
  }, []);

  // console.log('imageURl', imageUrl);

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedItem, setSelectedItem] = useState("version1");

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (item) => {
    setAnchorEl(null);
    if (item) {
      setSelectedItem(item);
    }
  };

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

  useEffect(() => {
    if (transformBox && hoverId !== "") {
      transformRef.current.forEach((transformer, i) => {
        // console.log("this called");
        if (transformer && transformer.nodes) {
          const node = shapeRef.current[i];
          // console.log("shapeRef", shapeRef.current[i].attrs.id);
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

  // image.src = Icon;
  // image.src = imageUrl;
  trashimage.src = trash;
  checkimage.src = check;

  useEffect(() => {
    setAnnotations(pdfData);
    sethoverId("");
  }, []);

  useEffect(() => {
    if (imageUrl !== null) {
      image.src = imageUrl;
    }
  }, [imageUrl]);

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

  // console.log("annotations", annotations);
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
          id: newAnnotation[0].id,
          color: newAnnotationColor,
        },
      ]);
    }
  };

  const handleBoxClick = (value) => {
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
            x: box.x / (originalImageSize.width / (image.width * 2.8)),
            y: box.y / (originalImageSize.height / (image.height * 2.8)),
            width: box.width / (originalImageSize.width / (image.width * 2.8)),
            height: box.height / (originalImageSize.height / (image.height * 2.8)),
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
    textRef.current = value.label;
    sethoverBox(value);
    if (value.label) {
      sethoverId(value.id);
    }
    setTootipId(value.id);

    if (value.version === selectedItem && value.validated) {
      sethoverRectFillcolor("rgba(34,139,34, 0.3)");
    } else if (value.version !== selectedItem && value.validated) {
      sethoverRectFillcolor("rgba(255,165,0,0.3)");
    } else {
      sethoverRectFillcolor("rgba(255,165,0,0.3)");
    }
  };

  const handleDragStart = (event) => {
    setisDragging(true);
    setDialogOpen(true);
  };

  const handleDragMove = (event) => {
    if (isDragging) {
      setDialogOpen(false);
      const { x, y } = event.target.attrs;
      const updatedAnnotations = annotations.map((box) =>
        box.id === hoverId
          ? {
              ...box,
              x: x / (originalImageSize.width / (image.width * 2.8)),
              y: y / (originalImageSize.height / (image.height * 2.8)),
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

  const getTextWidth = (text, font) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    context.font = font;
    const width = context.measureText(text).width;
    return width;
  };

  const transformMouseEnter = (event) => {
    event.target.getStage().container().style.cursor = "pointer";
  };

  const transformMouseLeave = (event) => {
    event.target.getStage().container().style.cursor = "crosshair";
  };

  // console.log('image', image?.width);
  // console.log('heifhgt', image?.height);
  // console.log('wwidd', originalImageSize?.width);
  // console.log('sdkfjjjj', originalImageSize?.height);

  return (
    <Box>
      <Grid container columns={{ xs: 4, sm: 6, md: 12 }}>
        <Grid item xs={8.5}>
          <Box sx={{ flexGrow: 1 }}>
            <AppBar
              position="static"
              sx={{
                background: "rgba(222,214,241,1)",
              }}
            >
              <Toolbar
                variant="dense"
                sx={{ display: "flex", justifyContent: "flex-end" }}
              >
                <Button
                  onClick={handleClick}
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
                  sx={{
                    top: "0.5%",
                  }}
                >
                  {versionOptions.map((option) => (
                    <MenuItem key={option} onClick={() => handleClose(option)}>
                      <>
                        <Typography mr={1.5}>{option}</Typography>
                      </>
                    </MenuItem>
                  ))}
                </Menu>
              </Toolbar>
            </AppBar>
          </Box>
          <Box
            ref={parentRef}
            sx={{ width: "auto", height: "92vh", overflow: "auto" }}
          >
            {originalImageSize.width !== "" &&
              originalImageSize.height !== "" &&
              image !== null && (
                <Stage
                  ref={stageRef}
                  onMouseDown={handleMouseDown}
                  onMouseUp={handleMouseUp}
                  onMouseMove={handleMouseMove}
                  onMouseEnter={handleMouseEnter}
                  width={originalImageSize.width}
                  height={originalImageSize.height * pdfPages?.length}
                >
                  {/* <Layer>
                    <Image
                      image={image}
                      scaleX={originalImageSize.width / image.width}
                      scaleY={originalImageSize.height / image.height}
                    />
                  </Layer> */}
                  <Layer>
                    {pdfPages.map((pageDataUrl, index) => {
                      // console.log("pageDataUrl", pageDataUrl);
                      // console.log('index', index);
                      return (
                        <Image
                          key={index}
                          image={pageDataUrl}
                          x={0} // Adjust x position based on page index
                          y={index * pageDataUrl.height} // Set y position to 0
                          scaleX={originalImageSize.width / (image.width + 8)}
                          scaleY={originalImageSize.height / (image.height + 8)}
                          // scaleX={originalImageSize.width}
                          // scaleY={originalImageSize.height}
                          // width={originalImageSize.width}
                          // height={originalImageSize.height}
                          // y={index * image.height} // Adjust y position based on page index
                          // width={image.width + 70}
                          // height={image.height}
                        />
                      );
                    })}
                  </Layer>
                  <Layer>
                    {annotationsToDraw.map((value, i) => {
                      return (
                        <Group key={value.id}>
                          <Rect
                            key={value.id}
                            // x={value.x}
                            // y={value.y}
                            // width={value.width}
                            // height={value.height}
                            // x={
                            //   (value.x * image.width) / originalImageSize.width
                            // }
                            // y={
                            //   (value.y * image.height) /
                            //   originalImageSize.height
                            // }
                            // width={
                            //   (value.width * image.width) /
                            //   originalImageSize.width
                            // }
                            // height={
                            //   (value.height * image.height) /
                            //   originalImageSize.height
                            // }
                            ref={(node) => (shapeRef.current[i] = node)}
                            {...value}
                            onTransformEnd={(event) => {
                              const node = shapeRef.current[i];
                              if (node) {
                                const scaleX = node.scaleX();
                                const scaleY = node.scaleY();
                                node.scaleX(1);
                                node.scaleY(1);

                                const newAttrs = {
                                  ...value,
                                  x:
                                    node.x() /
                                    (originalImageSize.width / (image.width * 2.8)),
                                  y:
                                    node.y() /
                                    (originalImageSize.height / (image.height * 2.8)),
                                  // set minimal value
                                  width:
                                    (node.width() * scaleX) /
                                    (originalImageSize.width / (image.width * 2.8)),
                                  height:
                                    (node.height() * scaleY) /
                                    (originalImageSize.height / (image.height * 2.8)),
                                };

                                // Call your onChange function directly
                                const rects = annotations.slice();
                                rects[i] = newAttrs;
                                setAnnotations(rects);
                              }
                            }}
                            x={
                              value.label !== undefined
                                ? value.x *
                                  (originalImageSize.width /
                                    (image.width * 2.8))
                                : value.x
                            }
                            y={
                              value.label !== undefined
                                ? value.y *
                                  (originalImageSize.height /
                                    (image.height * 2.8))
                                : value.y
                            }
                            width={
                              value.label !== undefined
                                ? value.width *
                                  (originalImageSize.width /
                                    (image.width * 2.8))
                                : value.width
                            }
                            height={
                              value.label !== undefined
                                ? value.height *
                                  (originalImageSize.height /
                                    (image.height * 2.8))
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
                                  ? "rgba(255,165,0,0.1)"
                                  : "rgba(255,165,0,0.1)"
                                : null
                            }
                            stroke={
                              value.version === selectedItem && value.validated
                                ? validateColor
                                : value.version !== selectedItem &&
                                  value.validated
                                ? // ? getBackgroundForVersion(value.version, 1)
                                  initialDataColor
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
                                anchorFill={
                                  value.version === selectedItem &&
                                  value.validated
                                    ? validateColor
                                    : value.version !== selectedItem &&
                                      value.validated
                                    ? // ? getBackgroundForVersion(value.version, 1)
                                      initialDataColor
                                    : value.color || initialDataColor
                                }
                                anchorSize={8}
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
                                      (originalImageSize.width / (image.width * 2.8)) +
                                    5 // Adjust the offset as needed
                                }
                                y={
                                  shapeRef.current[i] &&
                                  shapeRef.current[i].getAbsolutePosition().y +
                                    value.height *
                                      (originalImageSize.height /
                                        (image.height * 2.8)) -
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
                                      (originalImageSize.width / (image.width * 2.8)) +
                                    5 // Adjust the offset as needed
                                }
                                y={
                                  shapeRef.current[i] &&
                                  shapeRef.current[i].getAbsolutePosition().y +
                                    value.height *
                                      (originalImageSize.height /
                                        (image.height * 2.8)) -
                                    20 // Adjust the offset as needed
                                }
                                width={20} // Adjust width as needed
                                height={20} // Adjust height as needed
                                onClick={handletransformcancle}
                                onMouseEnter={transformMouseEnter}
                                onMouseLeave={transformMouseLeave}
                              />
                            )}

                          {hoverId === value.id && (
                            <>
                              <Rect
                                x={
                                  value.x *
                                    (originalImageSize.width / (image.width * 2.8)) +
                                  10
                                }
                                y={
                                  shapeRef.current[i] &&
                                  shapeRef.current[i].getAbsolutePosition().y +
                                    value.height *
                                      (originalImageSize.height /
                                        (image.height * 2.8)) -
                                    5 // Adjust the offset as needed
                                }
                                width={
                                  // textRef.current ?
                                  getTextWidth(
                                    value.label,
                                    textRef.current.font
                                  ) + 30
                                } // Adjust width as needed
                                height={22} // Adjust height as needed
                                fill={
                                  value.version === selectedItem &&
                                  value.validated
                                    ? "rgba(38, 194, 129, 1)"
                                    : value.version !== selectedItem &&
                                      value.validated
                                    ? // ? getBackgroundForVersion(value.version, 1)
                                      "rgba(255,165,0,1)"
                                    : "rgba(255,165,0,1)"
                                } // Set the background color of the tooltip-like rect
                                cornerRadius={5} // Set the radius of the corners
                              />
                              <Text
                                x={
                                  value.x *
                                    (originalImageSize.width / (image.width * 2.8)) +
                                  20
                                }
                                y={
                                  shapeRef.current[i] &&
                                  shapeRef.current[i].getAbsolutePosition().y +
                                    value.height *
                                      (originalImageSize.height /
                                        (image.height * 2.8)) -
                                    0.5 // Adjust the offset as needed
                                }
                                text={`${value?.label}`}
                                fill="black" // Set the text color
                                ref={textRef}
                              />
                            </>
                          )}
                        </Group>
                      );
                    })}
                  </Layer>
                </Stage>
              )}
          </Box>
        </Grid>
        <Grid item xs={3.5}>
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

        <Dialog
          open={isDialogOpen}
          sx={{
            position: "absolute",
            boxShadow: "0px 0px 20px 6px rgba(0, 0, 0, 0.1)",
          }}
          onClose={handleCloseDialog}
        >
          <IconButton
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
          </IconButton>
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
        </Dialog>
      </Grid>
    </Box>
  );
};

export default PDFAnnotation;
