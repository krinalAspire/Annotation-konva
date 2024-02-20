import React, { useEffect, useState } from 'react';
import { Document, Page } from 'react-pdf';
import { Stage, Layer, Rect } from 'react-konva';

const ReactPdf = () => {
  const [numPages, setNumPages] = useState(null);
  const [pageDimensions, setPageDimensions] = useState({});
  const pdfUrl = "http://192.168.2.213:9014/images/1707385896805-invoice_1.pdf";

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const onPageLoadSuccess = ({ pageIndex, width, height }) => {
    setPageDimensions(prevState => ({
      ...prevState,
      [pageIndex]: { width, height }
    }));
  };

  console.log('pageDimensions', pageDimensions);

  useEffect(() => {
    Object.entries(pageDimensions).forEach(([pageIndex, dimensions]) => {
        const { width, height } = dimensions;
        console.log(`Page ${parseInt(pageIndex, 10) + 1}: width=${width}, height=${height}`);
      });
  },[pageDimensions])

  return (
//     <Stage width={800} height={600}>
//       <Layer>
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
        >
          {Array.from(new Array(numPages), (el, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              onLoadSuccess={onPageLoadSuccess}
              render={({ canvasContext, viewport }) => {
                // Custom rendering if needed
              }}
            />
          ))}
        </Document>
    //   </Layer>
    //   <Layer>
    //     {/* Overlay graphical elements using Konva */}
    //     {Object.entries(pageDimensions).map(([pageIndex, dimensions]) => (
    //       <Rect
    //         key={`rect_${pageIndex}`}
    //         x={100} // Example x coordinate
    //         y={100} // Example y coordinate
    //         width={50} // Example width
    //         height={50} // Example height
    //         fill="red" // Example fill color
    //       />
    //     ))}
    //   </Layer>
    // </Stage>
  );
};

export default ReactPdf;
