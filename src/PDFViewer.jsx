import React, { useEffect, useState } from "react";
import { Stage, Layer, Image } from "react-konva";
import * as pdfjs from "pdfjs-dist/build/pdf"; // Corrected import statement
import "pdfjs-dist/build/pdf.worker.min"; // Import PDF worker script
import { Box } from "@mui/material";

function PDFViewer() {
  const [pdfPages, setPdfPages] = useState([]);
  const [image, setImage] = useState();
  // const pdfUrl = "http://192.168.2.213:9014/images/1707385896805-invoice_1.pdf";
  const pdfUrl =
    "http://192.168.2.213:9014/images/1708334472986-test-pdf-konva.pdf";

  const originalImageSize = { width: 1000, height: 700 };

  function isPDF(url) {
    // Extracting file extension
    const extension = url.split(".").pop().toLowerCase();

    // Checking if the extension is 'pdf'
    return extension === "pdf";
  }

  // Example usage:
  const url1 = "https://example.com/document.pdf";
  const url2 = "https://example.com/document.txt";

  // console.log("url1", isPDF(url1)); // Output: true
  // console.log("url2", isPDF(url2)); // Output: false

  useEffect(() => {
    const loadPDF = async () => {
      const pdf = await pdfjs.getDocument(pdfUrl).promise;
      const pages = [];
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement("canvas");
        const canvasContext = canvas.getContext("2d");
        console.log('canvasContext', viewport?.width);
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const renderContext = {
          canvasContext,
          viewport,
        };
        await page.render(renderContext).promise;
        const imageData = canvas.toDataURL();

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
        console.error('Error while loading PDF: ', error);
      }
    };

    countPages(pdfUrl);
  }, []);

  //   useEffect(() => {
  //   const loadPDF = async () => {
  //   const pdf = await pdfjs.getDocument('http://192.168.2.213:9014/images/1707385896805-invoice_1.pdf').promise;
  //   const pages = [];

  //   for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
  //     const page = await pdf.getPage(pageNum);
  //     const viewport = page.getViewport({ scale: 1.5 }); // Adjust scale as needed

  //     // Retrieve width and height from the viewport
  //     const width = viewport.width;
  //     const height = viewport.height;

  //     // Create canvas based on page size
  //     const canvas = document.createElement('canvas');
  //     const canvasContext = canvas.getContext('2d');
  //     canvas.width = width;
  //     canvas.height = height;

  //     const renderContext = {
  //       canvasContext,
  //       viewport
  //     };

  //     // Render PDF page to canvas
  //     await page.render(renderContext).promise;

  //     const imageData = canvas.toDataURL();

  //     const image = new window.Image();
  //     image.src = imageData;

  //     await new Promise((resolve, reject) => {
  //       image.onload = resolve;
  //       image.onerror = reject;
  //     });

  //     pages.push({ image, width, height });
  //   }

  //   setPdfPages(pages);
  // };
  // }, []);

  // console.log("pdfPages", pdfPages);

  return (
    // <Box sx={{height: '100vh', overflow: 'auto'}}>
    <Stage width={originalImageSize.width} height={originalImageSize.height * pdfPages.length * 2}>
    {/* // <Stage width={10000} height={10000}> */}
      <Layer>
        {pdfPages.map((pageDataUrl, index) => {
          // console.log("pageDataUrl", pageDataUrl);
          // console.log('index', index);
          return (
            <Image
              key={index}
              image={pageDataUrl}
              x={0}  // Adjust x position based on page index
              y={index * pageDataUrl.height}  // Set y position to 0
              // scaleX={originalImageSize.width / image.width}
              // scaleY={originalImageSize.height / image.height}
              // width={originalImageSize.width}
              // height={originalImageSize.height}
            />
          );
        })}
      </Layer>
    </Stage>
    // </Box>
  );
}

export default PDFViewer;
