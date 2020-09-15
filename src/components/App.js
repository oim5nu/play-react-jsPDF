import React, { useEffect, useState } from 'react';

//React-pdf settings
import { Document, Page, pdfjs } from 'react-pdf/dist/esm/entry.webpack';
import './PdfPage.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import { jsPDF } from 'jspdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

import BarChart from './BarChart';
//import * as canvg from 'canvg';

const options = {
  cMapUrl: 'cmaps/',
  cMapPacked: true,
};

const barDataArray = [
  [10, 30, 40, 20],
  [10, 40, 30, 20, 50, 10],
  [60, 30, 40, 20, 30],
];
let i = 0;

const App = () => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [data, setData] = useState(null);
  const [barData, setBarData] = useState([]);

  const generatePDFBinary = () => {
    // Generate pdf
    let doc = new jsPDF('p', 'pt', 'a4');

    doc.text(
      20,
      20,
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam in suscipit purus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Vivamus nec hendrerit felis. Morbi aliquam facilisis risus eu lacinia. Sed eu leo in turpis fringilla hendrerit. Ut nec accumsan nisl. Suspendisse rhoncus nisl posuere tortor tempus et dapibus elit porta. Cras leo neque, elementum a rhoncus ut, vestibulum non nibh. Phasellus pretium justo turpis. Etiam vulputate, odio vitae tincidunt ultricies, eros odio dapibus nisi, ut tincidunt lacus arcu eu elit. Aenean velit erat, vehicula eget lacinia ut, dignissim non tellus. Aliquam nec lacus mi, sed vestibulum nunc. Suspendisse potenti. Curabitur vitae sem turpis. Vestibulum sed neque eget dolor dapibus porttitor at sit amet sem. Fusce a turpis lorem. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae;\nMauris at ante tellus. Vestibulum a metus lectus. Praesent tempor purus a lacus blandit eget gravida ante hendrerit. Cras et eros metus. Sed commodo malesuada eros, vitae interdum augue semper quis. Fusce id magna nunc. Curabitur sollicitudin placerat semper. Cras et mi neque, a dignissim risus. Nulla venenatis porta lacus, vel rhoncus lectus tempor vitae. Duis sagittis venenatis rutrum. Curabitur tempor massa tortor.'
    );

    // Reopen windown for pdf
    //https://stackoverflow.com/questions/17739816/how-to-open-generated-pdf-using-jspdf-in-new-window
    // const outputstring = doc.output('dataurlstring');
    // const embed =
    //   "<embed width='100%' height='100%' src='" + outputstring + "'/>";
    // const x = window.open();
    // x.document.open();
    // x.document.write(embed);
    // x.document.close();

    //use PDFObject to embed
    //https://pdfobject.com/
    //https://github.com/MrRio/jsPDF/issues/1969

    const output = doc.output('arraybuffer');
    // https://stackoverflow.com/questions/55553341/place-a-jspdf-generated-pdf-into-an-iframe
    // write pdf into #display IFrame
    // const blobUrl = URL.createObjectURL(outputBlob);
    // let iframeElementContainer = document.getElementById('pdf-viewer');
    // iframeElementContainer.src = blobUrl;
    //doc.save('demo.pdf');
    return output;
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handleClick = (event) => {
    const data = generatePDFBinary();
    console.log('data', data);
    const uint8Array = new Uint8Array(data);
    console.log('uint8Array', uint8Array);
    setData(uint8Array);
  };

  //----------------------BAR CHART--------------------------------------//
  useEffect(() => {
    populateBarData();
  }, []);

  const getBarChartPdf = () => {
    let svgElement = document.getElementById('ChartContainer');
    let svg = svgElement.innerHTML;
    if (svg) svg = svg.replace(/\r?\n|\r/g, '').trim();

    console.log('svg', svg);
    let canvas = document.createElement('canvas');
    canvas.width = svgElement.clientWidth;
    canvas.height = svgElement.clientHeight;
    let context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    //canvg(canvas, svg);
    const imgData = canvas.toDataURL('image/png');
    // Generate PDF
    const doc = new jsPDF('p', 'pt', 'a4');
    doc.addImage(imgData, 'PNG', 40, 40, 100, 100);
    // doc.text(20, 20, 'Hello world');
    doc.save('barchart.pdf');
  };

  const populateBarData = () => {
    setBarData(barDataArray[i++]);
    if (i === barDataArray.length) i = 0;
  };

  //https://github.com/wojtekmaj/react-pdf/issues/339
  return (
    <div>
      <div>Test jsPdf</div>
      <button onClick={handleClick}>Display PDF</button>
      {/* <div>
        <iframe
          id="pdf-viewer"
          style={{ width: '100%', height: '100%', overflow: 'scroll' }}
        >
          PDF goes here
        </iframe>
      </div> */}

      {data && (
        <div id="PdfContainer">
          <Document
            className={'PDFDocument'}
            file={{ data }}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={console.error}
            options={options}
          >
            {Array.from(new Array(numPages), (el, index) => (
              <Page
                className={'PDFPage'}
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                renderTextLayer={false}
                renderInteractiveForms={false}
              />
            ))}
          </Document>
          <p>
            Page {pageNumber} of {numPages}
          </p>
        </div>
      )}
      <div id="SvgContainer" className="svg-container"></div>
      <button onClick={populateBarData}>Draw Bar Chart</button>
      <button onClick={getBarChartPdf}>Download Bar Chart</button>
      <BarChart width={600} height={400} data={barData} />
    </div>
  );
};

export default App;
