function showLineChart(class_time_arr) {
    var parseDate = d3.time.format("%m/%d/%Y").parse;
    var margin = {left: 40, right: 20, top: 20, bottom: 30 };

    var width = 520 - margin.left - margin.right;
    var height = 400 - margin.top - margin.bottom;
    var max = 0;
    var xNudge = 50;
    var yNudge = 20;
    var minDate = new Date();
    var maxDate = new Date();
    var colors = ["#ff0000","#006400","#0000ff","#836fff","#8b008b","#ff6a6a","#ffd700"];

    d3.csv("static/prices.csv")
        .row(function(d) { return { month: parseDate(d.month), price: Number(d.price.trim().slice(1))}; })
        .get(function(error, rows) {
            max = d3.max(rows, function(d) { return d.price; });
            minDate = d3.min(rows, function(d) {return d.month; });
            maxDate = d3.max(rows, function(d) { return d.month; });

            var maxv = Math.max.apply(null,class_time_arr.map(Function.apply.bind(Math.max, null)));

            var y = d3.scale.linear()
                      .domain([0,maxv+maxv/10])
                      .range([height,0]);
            var x = d3.scale.linear()
                      .domain([0,5])
                      .range([0,width]);

            var yAxis = d3.svg.axis()
                          .orient("left")
                          .scale(y);
            var xAxis = d3.svg.axis()
                          .orient("bottom")
                          .scale(x)
                          .ticks(5);
            var line = d3.svg.line()
                .x(function(d){ return x(d.x); })
                .y(function(d){ return y(d.y); })
                .interpolate("monotone");

            var svg = d3.select("#line_chart")
                        .append("svg")
                        .attr("id","svg")
                        .attr("height",height+margin.top+margin.bottom)
                        .attr("width",width+margin.left+margin.right);
            var chartGroup = svg.append("g")
                                .attr("class","chartGroup")
                                .selectAll("g")
                                .data(class_time_arr)
                                .enter()
                                .append("g")
                                .each(function(d, i){
                                    var data = new Array();
                                    for(var j = 0; j < d.length; j++)
                                    {
                                        data[j] = {'x':j, 'y':d[j]};
                                    }
                                    d3.select(this)
                                      .append('path')
                                      .attr("d", function(dd){ return line(data); })
                                      .attr("fill", "none")
                                      .attr("stroke", function(){ return colors[i]; })
                                      .attr("stroke-opacity", 0.7)
                                      .attr("stroke-width", 2);
                                })
                                .attr("transform","translate("+xNudge+","+yNudge+")");

            // chartGroup.append("path")
            //     .attr("class","line")
            //     .attr("d",function(d){ return line(rows); })


            chartGroup.append("g")
                .attr("class","axis x")
                .attr("transform","translate(0,"+height+")")
                .call(xAxis);

            chartGroup.append("g")
                .attr("class","axis y")
                .call(yAxis);



        });
}

