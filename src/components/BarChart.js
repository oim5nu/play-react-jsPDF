import * as d3 from 'd3';
import React, { useRef, useEffect, useCallback } from 'react';
import { jsPDF } from 'jspdf';
import * as canvg from 'canvg';

function BarChart({ width, height, data }) {
  const svgRef = useRef(null);
  const canvasRef = useRef(null);
  // const [dataSvg, setDataSvg] = useState(null);

  useEffect(() => {
    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .style('border', '1px solid black');
  }, []);

  useEffect(() => {
    draw();
  }, [data]);

  const draw = () => {
    const svg = d3.select(svgRef.current);
    const selection = svg.selectAll('rect').data(data);
    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data)])
      .range([0, height - 100]);

    selection
      .transition()
      .duration(300)
      .attr('height', (d) => yScale(d))
      .attr('y', (d) => height - yScale(d));

    selection
      .enter()
      .append('rect')
      .attr('x', (d, i) => i * 45)
      .attr('y', (d) => height)
      .attr('width', 40)
      .attr('height', 0)
      .attr('fill', 'orange')
      .transition()
      .duration(300)
      .attr('height', (d) => yScale(d))
      .attr('y', (d) => height - yScale(d));

    selection
      .exit()
      .transition()
      .duration(300)
      .attr('y', (d) => height)
      .attr('height', 0)
      .remove();
  };

  const getPdf = useCallback(() => {
    if (svgRef.current && canvasRef.current) {
      const svgData = new XMLSerializer().serializeToString(svgRef.current);
      console.log('svgData', svgData);

      // Get canvas
      const canvas = canvasRef.current;
      console.log(canvas);

      // get context
      const ctx = canvas.getContext('2d');
      //ctx.fillText('Hello world', 50, 50);

      const options = {
        log: false,
        ignoreMouse: true,
      };

      // render
      //canvg(canvas, this.state.datasvg, options);
      const v = canvg.Canvg.fromString(ctx, svgData, options);
      // const imageData = canvas
      //   .toDataURL('image/png')
      //   .replace('image/png', 'image/octet-stream');
      v.start();
      console.log('v', v);
      const pdf = new jsPDF('p', 'pt', 'a4');
      // pdf.addImage(imageData, 'PNG', 40, 40, 100, 100);
      // const svgData = new XMLSerializer().serializeToString(svg.current)
      pdf.addSvgAsImage(svgData, 0, 0, 270, 130);
      pdf.save('barchart.pdf');
    }
  }, [svgRef.current, canvasRef.current]);

  return (
    <div>
      <div id="ChartContainer" className="chart">
        <svg ref={svgRef}></svg>
      </div>
      <div id="CanvasContainer">
        <canvas ref={canvasRef}></canvas>
      </div>
      <div></div>
      <div>
        <button onClick={getPdf}>Download Pdf</button>
      </div>
    </div>
  );
}

export default BarChart;
