function _1(md){return(
md`# Reference Model for LTER-LIFE v4

This variant of a [sunburst diagram](/@d3/sunburst/2?intent=fork) shows only two layers of the hierarchy at a time. Click a node to zoom in, or the center to zoom out.`
)}

function _2(md){return(
md`&nbsp;



&nbsp;

`
)}

function _chart(d3,data2)
{
  // Specify the chart’s dimensions.
  const width = 1228;
  const height = width;
  const radius = width / 6;

  // Create the color scale.
  const color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, data2.children.length + 1));

  // Compute the layout.
  const hierarchy = d3.hierarchy(data2)
      .sum(d => d.value)
      .sort((a, b) => b.value - a.value);
  const root = d3.partition()
      .size([2 * Math.PI, hierarchy.height + 1])
    (hierarchy);
  root.each(d => d.current = d);

  // Create the arc generator.
  const arc = d3.arc()
      .startAngle(d => d.x0)
      .endAngle(d => d.x1)
      .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
      .padRadius(radius * 1.5)
      .innerRadius(d => d.y0 * radius)
      .outerRadius(d => Math.max(d.y0 * radius, d.y1 * radius - 1))

  // Create the SVG container.
  const svg = d3.create("svg")
      .attr("viewBox", [-width / 2, -height / 2, width, width])
      .style("font", "10px sans-serif");

  // Append the arcs.
  const path = svg.append("g")
    .selectAll("path")
    .data(root.descendants().slice(1))
    .join("path")
      .attr("fill", d => { while (d.depth > 1) d = d.parent; return color(d.data.name); })
      .attr("fill-opacity", d => arcVisible(d.current) ? (d.children ? 0.6 : 0.4) : 0)
      .attr("pointer-events", d => arcVisible(d.current) ? "auto" : "none")

      .attr("d", d => arc(d.current));

  // Make them clickable if they have children.
  path.filter(d => d.children)
      .style("cursor", "pointer")
      .on("click", clicked);

  const format = d3.format(",d");
  path.append("title")
      .text(d => `${d.ancestors().map(d => d.data.name).reverse().join("/")}\n${format(d.value)}`);

  const label = svg.append("g")
      .attr("pointer-events", "none")
      .attr("text-anchor", "middle")
      .style("user-select", "none")
    .selectAll("text")
    .data(root.descendants().slice(1))
    .join("text")
      .attr("dy", "0.35em")
      .attr("fill-opacity", d => +labelVisible(d.current))
      .attr("transform", d => labelTransform(d.current))
      .text(d => d.data.name);

  const parent = svg.append("circle")
      .datum(root)
      .attr("r", radius)
      .attr("fill", "none")
      .attr("pointer-events", "all")
      .on("click", clicked);

// Handle zoom on click.
function clicked(event, p) {
  parent.datum(p.parent || root);

  root.each(d => d.target = {
    x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
    x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
    y0: Math.max(0, d.y0 - p.depth),
    y1: Math.max(0, d.y1 - p.depth)
  });

  const t = svg.transition().duration(750);

  // Transition the data2 on all arcs, even the ones that aren’t visible,
  // so that if this transition is interrupted, entering arcs will start
  // the next transition from the desired position.
  path.transition(t)
      .tween("data2", d => {
        const i = d3.interpolate(d.current, d.target);
        return t => d.current = i(t);
      })
    .filter(function(d) {
      return +this.getAttribute("fill-opacity") || arcVisible(d.target);
    })
      .attr("fill-opacity", d => arcVisible(d.target) ? (d.children ? 0.6 : 0.4) : 0)
      .attr("pointer-events", d => arcVisible(d.target) ? "auto" : "none") 

      .attrTween("d", d => () => arc(d.current));

  label.filter(function(d) {
      return +this.getAttribute("fill-opacity") || labelVisible(d.target);
    }).transition(t)
      .attr("fill-opacity", d => +labelVisible(d.target))
      .attrTween("transform", d => () => labelTransform(d.current));
}
  
  function arcVisible(d) {
    return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
  }

  function labelVisible(d) {
    return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
  }

  function labelTransform(d) {
    const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
    const y = (d.y0 + d.y1) / 2 * radius;
    return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
  }
  
  return svg.node();
  
}


function _4(md){return(
md`&nbsp;



&nbsp;



&nbsp;





&nbsp;




&nbsp;






&nbsp;







&nbsp;





&nbsp;




&nbsp;






&nbsp;`
)}

function _5(md){return(
md`## Appendix`
)}

function _root(d3,data2)
{
  const hierarchy = d3.hierarchy(data2)
    .sum(d => d.value)  // Make sure each node has a 'value' property
    .sort((a, b) => b.value - a.value);

  const partition = d3.partition()
    .size([2 * Math.PI, hierarchy.height + 1])
    (hierarchy);

  partition.each(d => d.current = d);

  return partition;
}


function _data1(FileAttachment){return(
FileAttachment("LTER-LIFE-DTE-RM-Telara.csv").csv()
)}

function _data2(data1)
{
  function buildHierarchy(data) {
     let hierarchy = { name: "Root", children: [] };
  
      data.forEach(item => {
          // Check if the viewpoint should be included before adding
          // if (!shouldBeExcluded(item.Viewpoint)) {
              let viewpointNode = findOrCreateChild(hierarchy, item.Viewpoint);
              let categoryNode = findOrCreateChild(viewpointNode, item.Category);
              let subcategoryNode = findOrCreateChild(categoryNode, item.Subcategory);
              let conceptNode = findOrCreateChild(subcategoryNode, item.Concept);
              addDescriptionNode(conceptNode, item);
          // }
      });
  
      function addDescriptionNode(conceptNode, item) {
          if (item.Description) {
              let words = item.Description.split(/\s+/);
              let descriptionPreview = words.slice(0, 5).join(' ');
              if (words.length > 5) {
                  descriptionPreview += '...';
              }
              conceptNode.children.push({
                  name: descriptionPreview,
                  value: 1
              });
          }
      }
  
      function shouldBeExcluded(viewpoint) {
          // Define logic to determine if a viewpoint should be excluded
          return viewpoint === '';
      }
  
      return hierarchy;
    }
    
    function findOrCreateChild(parent, name) {
      if (!name) return parent;  // Skip undefined or empty name categories
  
      // Only create a new child if a name exists and the child with that name does not already exist
      let child = parent.children.find(c => c.name === name);
      if (!child && name) {
          child = { name: name, children: [] };
          parent.children.push(child);
      }
      return child || parent; // Return the found/created child or parent if no child was created
  }

  return buildHierarchy(data1);
        
}


function _9(htl){return(
htl.html`<style>
  .modal-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: none;
    z-index: 10;
  }
  .modal {
    position: absolute;
    left: 150px; /* Custom position */
    top: 200px; /* Custom position */
    background: white;
    border: 1px solid #ccc;
    padding: 20px;
    display: none;
    z-index: 11;
  }
  .tooltip {
    position: absolute;
    visibility: hidden;
    padding: 10px;
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid #ccc;
    border-radius: 5px;
    pointer-events: none;
    font-size: 12px;
  }
</style>
<div id="modal-overlay" class="modal-overlay"></div>
<div id="modal" class="modal">
  <span class="close" onclick="closeModal()">&times;</span>
  <div id="modal-content"></div>
</div>
<div class="tooltip"></div>
`
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["LTER-LIFE-DTE-RM-Telara.csv", {url: new URL("./files/be.csv", import.meta.url), mimeType: "text/csv", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer("chart")).define("chart", ["d3","data2"], _chart);
  main.variable(observer()).define(["md"], _4);
  main.variable(observer()).define(["md"], _5);
  main.variable(observer("root")).define("root", ["d3","data2"], _root);
  main.variable(observer("data1")).define("data1", ["FileAttachment"], _data1);
  main.variable(observer("data2")).define("data2", ["data1"], _data2);
  main.variable(observer()).define(["htl"], _9);
  return main;
}
