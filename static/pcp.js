function showPCP(plot_width, plot_height) {
	var m = [30, 10, 10, 10],
	    w = plot_width - m[1] - m[3],
	    h = plot_height - m[0] - m[2];

	var x = d3.scale.ordinal().rangePoints([0, w], .5),
	    y = {};

	var line = d3.svg.line(),
	    axis = d3.svg.axis().orient("left"),
	    background,
	    foreground;

	var svg = d3.select("#pcp").append("svg")
	    .attr("width", w + m[1] + m[3])
	    .attr("height", h + m[0] + m[2])
	  	.append("g")
	    .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

	d3.csv("static/pcp_test.csv", function(error, cities) {
	  if (error) throw error;

	  // Extract the list of dimensions and create a scale for each.
	  x.domain(dimensions = d3.keys(cities[0]).filter(function(d) {
	    return d != "City" && (y[d] = d3.scale.linear()
	        .domain(d3.extent(cities, function(p) { return +p[d]; }))
	        .range([h, 0]));
	  }));
	  console.log(dimensions);

	  // Add grey background lines for context.
	  // background = svg.append("g")
	  // 	.attr("class", "background")
	  //   .selectAll("path")
	  //   .data(cities)
	  //   .enter().append("path")
	  //   .attr("d", path);

	  // Add blue foreground lines for focus.
	  foreground = svg.append("g")
	  	.attr("class", "foreground")
	  	.selectAll("path")
	  	.data(cities)
	    .enter().append("path")
	    .attr("d", path);

	  // Add a group element for each dimension.
	  var g = svg.selectAll(".dimension")
	      .data(dimensions)
	      .enter().append("g")
	      .attr("class", "dimension")
	      .attr("transform", function(d) { return "translate(" + x(d) + ")"; });

	  // Add an axis and title.
	  g.append("g")
	      .attr("class", "axis")
	      .each(function(d) { d3.select(this).call(axis.scale(y[d])); })
	      .append("text")
	      .attr("text-anchor", "middle")
	      .attr("y", -9)
	      .text(String);

	  // Add and store a brush for each axis.
	  // g.append("g")
	  //     .attr("class", "brush")
	  //     .each(function(d) { d3.select(this).call(y[d].brush = d3.svg.brush().y(y[d]).on("brush", brush)); })
	  //     .selectAll("rect")
	  //     .attr("x", -8)
	  //     .attr("width", 16);
	});

	// Returns the path for a given data point.
	function path(d) {
		console.log(dimensions.map(function(p) { return [x(p), y[p](d[p])]; }));
	  return line(dimensions.map(function(p) { return [x(p), y[p](d[p])]; }));
	}

	// Handles a brush event, toggling the display of foreground lines.
	// function brush() {
	//   var actives = dimensions.filter(function(p) { return !y[p].brush.empty(); }),
	//       extents = actives.map(function(p) { return y[p].brush.extent(); });
	//   foreground.style("display", function(d) {
	//     return actives.every(function(p, i) {
	//       return extents[i][0] <= d[p] && d[p] <= extents[i][1];
	//     }) ? null : "none";
	//   });
	// }
}