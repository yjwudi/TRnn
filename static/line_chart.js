function showLineChart(class_time_arr) {
    var parseDate = d3.time.format("%m/%d/%Y").parse;
    var margin = {left: 50, right: 20, top: 20, bottom: 100 };

    var width = 400 - margin.left - margin.right;
    var height = 300 - margin.top - margin.bottom;
    var max = 0;
    var xNudge = 50;
    var yNudge = 20;
    var minDate = new Date();
    var maxDate = new Date();

    d3.csv("static/prices.csv")
        .row(function(d) { return { month: parseDate(d.month), price: Number(d.price.trim().slice(1))}; })
        .get(function(error, rows) {
            max = d3.max(rows, function(d) { return d.price; });
            minDate = d3.min(rows, function(d) {return d.month; });
            maxDate = d3.max(rows, function(d) { return d.month; });

            var maxv = Math.max.apply(null,class_time_arr.map(Function.apply.bind(Math.max, null)));
            console.log('maxv',maxv);

            var y = d3.scale.linear()
                      .domain([0,maxv+maxv/10])
                      .range([height,0]);
            var x = d3.time.scale()
                      .domain([0,6])
                      .range([0,width]);

            var yAxis = d3.svg.axis()
                          .orient("left")
                          .scale(y);
            var xAxis = d3.svg.axis()
                            .orient("bottom")
                            .scale(x);
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
                                    for(var i = 0; i < d.length; i++)
                                    {
                                        data[i] = {'x':i, 'y':d[i]};
                                    }
                                    d3.select(this)
                                      .append('path')
                                      .attr("d", function(dd){ return line(data); })
                                      .attr("fill", "none")
                                      .attr("stroke", "steelblue")
                                      .attr("stroke-opacity", 0.7);
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

