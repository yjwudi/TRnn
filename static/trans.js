function showPCP(plot_width, plot_height, connections, circles) {
	var m = [30, 10, 10, 10],
	    w = plot_width - m[1] - m[3],
	    h = plot_height - m[0] - m[2];

	var x = d3.scale.ordinal().rangePoints([0, w], .5),
	    y = {};


	var svg = d3.select("#pcp").append("svg")
	    .attr("width", w + m[1] + m[3])
	    .attr("height", h + m[0] + m[2])
	  	.append("g")
	    .attr("transform", "translate(" + m[3] + "," + m[0] + ")");
	var jsonCircles = [[
		{"x_axis":30,"y_axis":30,"radius":2,"color":"green"},
		{"x_axis":70,"y_axis":70,"radius":2,"color":"purple"},
		{"x_axis":110,"y_axis":100,"radius":2,"color":"red"}   
		]];
	// var circles = [[10,20,30],
	// 			   [10,20,30],
	// 			   [10,20,30]];
	// var connections = [[
	// 	[10,50,30],
	// 	[25,18,8],
	// 	[18,3,26]
	// 	],
	// 	[
	// 	[30,20,30],
	// 	[25,18,8],
	// 	[18,3,26]
	// 	]];
	console.log(connections);
	var tmpArray =connections.join(",").split(",");
	var maxv = Math.max.apply(null,tmpArray);
	console.log(maxv);
	var widthRange = d3.scale.linear().domain([0, maxv]).range([0, 300]);

	var radius_ = 30;
	var x_dis = 150, y_dis = 80;
	var move_dis = 0.1;
	svg.append("g")
	   .attr("class", "cons1")
	   .selectAll("g")
	   .data(connections)
	   .enter()
	   .append("g")
	   .each(function(d1, i1){
	   		var x1 = 50+i1*x_dis;
	   		d3.select(this)
	   		  .selectAll("g")
	   		  .data(d1)
	   		  .enter()
	   		  .append("g")
	   		  .each(function(d2, i2){
	   		  	var y1 = 50+i2*y_dis;
	   		  	d3.select(this)
	   		  	  .append("path")
	   		  	  .attr("d", function(d){
	   		  	  	var line = d3.path();
	   		  	  	for(var j = 0; j < d.length; j++){
	   		  	  		var x2 = x1+x_dis;
	   		  	  		var y2 = 50+j*y_dis;
	   		  	  		var n = widthRange(d[j]);
	   		  	  		line.moveTo(x1, y1);
	   		  	  		for(var k = 0; k < n; k++)
	   		  	  		{
	   		  	  			line.moveTo(x1, y1+k*move_dis);
	   		  	  			// line.moveTo(x1, y1);
	   		  	  			var bXmove = 100, bYmove = 5;
	   		  	  			if(j<i2){
	   		  	  				// line.bezierCurveTo(x1+bXmove, y1-bYmove-k*move_dis, x2-bXmove, y2+bYmove-k*move_dis, x2, y2);
	   		  	  				line.bezierCurveTo(x1+bXmove, y1-bYmove, x2-bXmove, y2+bYmove, x2, y2+k*move_dis);
	   		  	  			}
	   		  	  			else{
	   		  	  				// line.bezierCurveTo(x1+bXmove, y1+bYmove+k*move_dis, x2-bXmove, y2-bYmove+k*move_dis, x2, y2);
	   		  	  				line.bezierCurveTo(x1+bXmove, y1+bYmove, x2-bXmove, y2-bYmove, x2, y2+k*move_dis);
	   		  	  			}
	   		  	  			
	   		  	  		}
	   		  	  	}
	   		  	  	return line;
	   		  	  })
	   		  	  .attr("fill", "none")
	   			  .attr("stroke", "steelblue")
	   	          .attr("stroke-opacity", 0.7)
	   		  })
	   });
	svg.append("g")
	   .attr("class", "circles")
	   .selectAll("g")
	   .data(circles)
	   .enter()
	   .append("g")
	   .each(function(d1, i1){
	   		var x1 = 50+i1*x_dis;
	   		d3.select(this)
	   		  .selectAll("g")
	   		  .data(d1)
	   		  .enter()
	   		  .append("g")
	   		  .each(function(d2, i2){
	   		  	var y1 = 50+i2*y_dis;
	   		  	d3.select(this)
	   		  	  .append('circle')
	   		  	  .attr("cx", x1)
	   		  	  .attr("cy", y1)
	   		  	  .attr("r", radius_)
	   		  	  .style("fill", "red")
	   		  })
	   });
	    
	// svg.append("path")
 //   	   .attr("d", function(d){
 //   	   	var line = d3.path();
 //        line.moveTo(1, 1);
 //        line.bezierCurveTo(40, 60, 60, 80, 80, 90); 
 //        for(var i = 0; i < 1000; i++)
 //        {
 //        	line.moveTo(1, 1+0.1*i);
 //        	line.bezierCurveTo(40, 60+0.1*i, 60, 80+0.1*i, 80, 90+0.1*i);
 //        }
 //        return line;
 //   	  })
 //   	  .attr("fill", "none")
 //   	  .attr("stroke", "steelblue")
 //   	  .attr("stroke-opacity", 0.7);
   	

	// svg.append('circle')
	// .attr('cx', 6)
	// .attr('cy', 6)
	// .attr('r', 5);

	// svg.append('circle')
	// .attr('cx', 16)
	// .attr('cy', 6)
	// .attr('r', 5);

	// svg.append("g")
	//    .attr("class", "circles")
	//    .selectAll("circle")
	//    .data(jsonCircles)
	//    .enter()
	//    .append('circle')
	//    .attr("cx", function(d){return d.x_axis;})
	//    .attr("cy", function(d){return d.y_axis;})
	//    .attr("r", function(d){return d.radius;})
	//    .style("fill", function(d){return d.color;});

	// svg.append("g")
	//    .attr("class", "circles")
	//    .selectAll("g")
	//    .data(jsonCircles)
	//    .enter()
	//    .append("g")
	//    .each(function(d, i){
	//    	console.log(i);
	//    	d3.select(this)
	//    	  .append('circle')
	//    	  .attr("cx", d.x_axis)
	//    	  .attr("cy", d.y_axis)
	//       .attr("r", d.radius)
	//       .style("fill", d.color)
	//    });

	// svg.append("g")
	//    .attr("class", "circles")
	//    .selectAll("g")
	//    .data(jsonCircles)
	//    .enter()
	//    .append("g")
	//    .each(function(d, i){
	//    	console.log(i);
	//    	d3.select(this)
	//    	  .selectAll("circle")
	//    	  .data(d)
	//    	  .enter()
	//    	  .append("g")
	//    	  .each(function(dd, ii){
	//    	  	d3.select(this)
	//    	  	  .append("circle")
	//    	  	  .attr("cx", dd.x_axis)
	// 	   	  .attr("cy", dd.y_axis)
	// 	      .attr("r", dd.radius)
	// 	      .style("fill", dd.color)
	//    	  })
	//    });



}