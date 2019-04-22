function showScatter(plot_width, plot_height, map_data) {

  var margin = {top: 20, right: 20, bottom: 100, left: 40},
      width = plot_width - margin.left - margin.right,
      height = plot_height - margin.top - margin.bottom;
  var pca_file = map_data.pca_file;
  var ori_colors = ["#ff0000","#006400","#0000ff","#836fff","#8b008b","#ff6a6a","#ffd700"];
  var cluster_num = map_data.cluster_num;
  var colors = new Array();
  for(var i = 0; i < cluster_num; i++){
    colors[i] = ori_colors[i];
  }

  /* 
   * value accessor - returns the value to encode for a given data object.
   * scale - maps value to a visual display encoding, such as a pixel position.
   * map function - maps from data value to display value
   * axis - sets up axis
   */ 

  // setup x 
  var xValue = function(d) { return d.x;}, // data -> value
      xScale = d3.scale.linear().range([0, width]), // value -> display
      xMap = function(d) { return xScale(xValue(d));}, // data -> display
      xAxis = d3.svg.axis().scale(xScale).orient("bottom");

  // setup y
  var yValue = function(d) { return d["y"];}, // data -> value
      yScale = d3.scale.linear().range([height, 0]), // value -> display
      yMap = function(d) { return yScale(yValue(d));}, // data -> display
      yAxis = d3.svg.axis().scale(yScale).orient("left");

  // setup fill color
  var cValue = function(d) { return d.c;},
      color = d3.scale.category10();
  console.log(color.domain());

  // add the graph canvas to the body of the webpage
  d3.select("#scatter_svg").remove();
  var svg = d3.select("#scatter").append("svg")
      .attr("id","scatter_svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // add the tooltip area to the webpage
  var tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

  // load data
  d3.csv(pca_file, function(error, data) {

    // change string (from CSV) into number format
    data.forEach(function(d) {
      d.x = +d.x;
      d["y"] = +d["y"];
      d.c = +d.c;
      d.id = +d.id;
    });

    var diff = 0.5;
    // don't want dots overlapping axis, so add in buffer to data domain
    xScale.domain([d3.min(data, xValue)-diff, d3.max(data, xValue)+diff]);
    yScale.domain([d3.min(data, yValue)-diff, d3.max(data, yValue)+diff]);

    // draw dots
    svg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", 3.5)
        .attr("cx", xMap)
        .attr("cy", yMap)
        .style("fill", function(d) { return colors[cValue(d)];})
        .on("mouseover", function(d) {
            tooltip.transition()
                 .duration(200)
                 .style("opacity", .9);
            tooltip.html(d["c"] + "<br/> (" + xValue(d) 
            + ", " + yValue(d) + ")")
                 .style("left", (d3.event.pageX + 5) + "px")
                 .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            tooltip.transition()
                 .duration(500)
                 .style("opacity", 0);
        })
        .on("click", function(d) {
            console.log('clicked: '+d.id);
            showAnAgent(d.id);
            }
          );
    // x-axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text("x");

    // y-axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("y");
    // draw legend
    var legend = svg.selectAll(".legend")
                    .data(colors)//.data(color.domain())
                    .enter().append("g")
                    .attr("class", "legend")
                    .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    // draw legend colored rectangles
    legend.append("rect")
          .attr("x", width - 18)
          .attr("width", 18)
          .attr("height", 18)
          .style("fill", function(d, i) { return colors[i];});

    // draw legend text
    legend.append("text")
          .attr("x", width - 24)
          .attr("y", 9)
          .attr("dy", ".35em")
          .style("text-anchor", "end")
          .text(function(d, i) { return i+1;})
  });
}