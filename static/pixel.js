function showPixel(){

  var margin = { top: 50, right: 0, bottom: 100, left: 30 },
      width = 1260 - margin.left - margin.right,
      height = 630 - margin.top - margin.bottom,
      gridSize = Math.floor(width / 50),
      legendElementWidth = gridSize*2,
      buckets = 9,
      colors = ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"], // alternatively colorbrewer.YlGnBu[9]
      days = ["0", "1", "2", "3", "4"],
      times = ["1a", "2a", "3a", "4a", "5a", "6a", "7a", "8a", "9a", "10a", "11a", "12a", "1p", "2p", "3p", "4p", "5p", "6p", "7p", "8p", "9p", "10p", "11p", "12p"];
      datasets = ["static/road_number.tsv"];

  var svg = d3.select("#pixel").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var dayLabels = svg.selectAll(".dayLabel")
      .data(days)
      .enter().append("text")
        .text(function (d) { return d; })
        .attr("x", 0)
        .attr("y", function (d, i) { return i * gridSize; })
        .style("text-anchor", "end")
        .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
        // .attr("class", function (d, i) { return ((i >= 0 && i <= 4) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis"); });

  var timeLabels = svg.selectAll(".timeLabel")
        .data(times)
        .enter().append("text")
        .text(function(d) { return d; })
        .attr("x", function(d, i) { return i * gridSize; })
        .attr("y", 0)
        .style("text-anchor", "middle")
        .attr("transform", "translate(" + gridSize / 2 + ", -6)")
        // .attr("class", function(d, i) { return ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis"); });

  var heatmapChart = function(tsvFile) {
    d3.tsv(tsvFile,
    function(d) {
      return {
        cluster: +d.cluster,
        road: +d.road,
        value: +d.value
      };
    },
    function(error, data) {
      var colorScale = d3.scale.quantile()
          .domain([0, buckets - 1, d3.max(data, function (d) { return d.value; })])
          .range(colors);

      var cards = svg.selectAll(".road")
          .data(data, function(d) {return d.cluster+':'+d.road;});

      cards.append("title");

      cards.enter().append("rect")
          .attr("x", function(d) { return (d.road - 1) * gridSize; })
          .attr("y", function(d) { return (d.cluster) * gridSize; })
          .attr("rx", 4)
          .attr("ry", 4)
          .attr("class", "road bordered")
          .attr("width", gridSize)
          .attr("height", gridSize)
          .style("fill", colors[0])
          .on("click", function() {
            console.log(d3.event);
            var offX = d3.event.offsetX;
            var offY = d3.event.offsetY;
            var cluster_idx = parseInt(offX/50)-1;
            var road_idx = parseInt(offY/50);
            console.log(cluster_idx, road_idx);
          });

      cards.transition().duration(1000)
          .style("fill", function(d) { return colorScale(d.value); });

      cards.select("title").text(function(d) { return d.value; });
      
      cards.exit().remove();

      var legend = svg.selectAll(".legend")
          .data([0].concat(colorScale.quantiles()), function(d) { return d; });

      legend.enter().append("g")
          .attr("class", "legend");

      legend.append("rect")
        .attr("x", function(d, i) { return legendElementWidth * i; })
        .attr("y", gridSize*6)
        .attr("width", legendElementWidth)
        .attr("height", gridSize / 2)
        .style("fill", function(d, i) { return colors[i]; });

      legend.append("text")
        .attr("class", "mono")
        .text(function(d) { return "≥ " + Math.round(d); })
        .attr("x", function(d, i) { return legendElementWidth * i; })
        .attr("y", gridSize*6 + gridSize);

      legend.exit().remove();

    });  
  };

  heatmapChart(datasets[0]);
  
  // var datasetpicker = d3.select("#dataset-picker").selectAll(".dataset-button")
  //   .data(datasets);

  // datasetpicker.enter()
  //   .append("input")
  //   .attr("value", function(d){ return "Dataset " + d })
  //   .attr("type", "button")
  //   .attr("class", "dataset-button")
  //   .on("click", function(d) {
  //     heatmapChart(d);
  //   });
}