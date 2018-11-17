        var timewindows = this.svg.append("g")
                .attr("id", "time_group")
                .selectAll("g")
                .data(this.data.clusters);
            timewindows.enter()
                .append("g")
                .attr("class", "clusters")
                .attr("transform", function (d, i) {
                    return "translate(" + clu_len * (i + 1) + "," + (max_clu_num - d.length) / 2 * clu_margin + ")";
                })
                .each(function (d, i) {
                    var clusters = d3.select(this).selectAll("rect").data(d);
                    clusters.enter()
                        .append("g")
                        .attr("class", "single_cluster")
                        .each(function (dd, ii) {
                            var cluster = d3.select(this);
                            cluster.append("rect")
                                .attr("x", trans_margin)
                                .attr("y", function () {
                                    var tmp_height = 0;
                                    for(var k = 0; k < ii; k++)
                                    {
                                        tmp_height += d[k];
                                    }
                                    return ii * clu_margin + height_scale(tmp_height);
                                })
                                .attr("width", clu_len - 2 * trans_margin)
                                .attr("height", function () {
                                    return height_scale(dd);
                                })
                                .attr("stroke", "grey")
                                .attr("stroke-opacity", 0)
                                .attr("fill", "grey")
                                .attr("fill-opacity", function () {
                                    return 0.8;
                                    return 0.7 + Math.random() * 0.3;
                                })
                                .on("click", function () {
                                    _this.click_num++;
                                    d3.select(this).attr("fill", _this.colorSheet[_this.click_num]);
                                    if(_this.click_num >= 10)
                                    {
                                        d3.select(this).attr("fill", "grey");
                                        _this.click_num = -1;
                                    }
                                });
                            cluster.append("rect")
                                .attr("x", trans_margin)
                                .attr("y", function () {
                                    var tmp_height = 0;
                                    for(var k = 0; k < ii; k++)
                                    {
                                        tmp_height += d[k];
                                    }
                                    return ii * clu_margin + height_scale(tmp_height);
                                })
                                .attr("width", clu_len - 2 * trans_margin)
                                .attr("height", function () {
                                    return height_scale(_this.data.map_clusters[i][ii]);
                                })
                                .attr("stroke", "grey")
                                .attr("stroke-opacity", 0)
                                .attr("fill", _this.colorSheet[0])
                                .attr("fill-opacity", function () {
                                    return 0.8;
                                });
                        });
                });

            var clu_trans = this.svg.append("g")
                .attr("id", "clu_trans")
                .selectAll("g")
                .data(this.data.clusters_trans);
            clu_trans.enter()
                .append("g")
                .attr("class", "clusters_trans")
                .attr("transform", function (d, i) {
                    return "translate(" + clu_len * (i + 2) + ", 0)";
                })
                .each(function (d, i) {
                    var clusters = d3.select(this).selectAll("g").data(d);
                    clusters.enter()
                        .append("g")
                        .each(function (dd, ii) {
                            var trans = d3.select(this).selectAll("path").data(dd);
                            trans.enter()
                                .append("path")
                                .attr("d", function (ddd, iii) {
                                    var transline = d3.path();
                                    if(ddd == 0) return transline;
                                    var tmp_height = 0;
                                    for(var k = 0; k < ii; k++)
                                    {
                                        tmp_height += _this.data.clusters[i][k];
                                    }
                                    var det_y = ii * clu_margin + height_scale(tmp_height) + (max_clu_num - _this.data.clusters[i].length) / 2 * clu_margin;
                                    tmp_height = 0;
                                    for(var k = 0; k < iii; k++)
                                    {
                                        tmp_height += d[ii][k];
                                    }
                                    var y1 = det_y + height_scale(tmp_height);
                                    var y2 = y1 + height_scale(ddd);

                                    tmp_height = 0;
                                    for(var k = 0; k < iii; k++)
                                    {
                                        tmp_height += _this.data.clusters[i + 1][k];
                                    }
                                    det_y = iii * clu_margin + height_scale(tmp_height) + (max_clu_num - _this.data.clusters[i + 1].length) / 2 * clu_margin;
                                    tmp_height = 0;
                                    for(var k = 0; k < ii; k++)
                                    {
                                        tmp_height += d[k][iii];
                                    }
                                    var y3 = det_y + height_scale(tmp_height);
                                    var y4 = y3 + height_scale(ddd);

                                    transline.moveTo(-trans_margin, y1);
                                    transline.bezierCurveTo(-trans_margin / 2, y1, trans_margin / 2, y3, trans_margin, y3);
                                    transline.lineTo(trans_margin, y4);
                                    transline.bezierCurveTo(trans_margin / 2, y4, -trans_margin / 2, y2, -trans_margin, y2);
                                    transline.lineTo(-trans_margin, y1);

                                    return transline;
                                })
                                .attr("stroke", "grey")
                                .attr("stroke-opacity", 0)
                                .attr("fill", function () {
                                    var greyVal = 190;
                                    return 'rgb(' + greyVal + ',' + greyVal + ',' + greyVal + ')';
                                })
                                .attr("fill-opacity", 1)
                                .on("click", function (d, i) {
                                    d3.select(this).attr("fill", _this.colorSheet[_this.click_num]);
                                    if(_this.click_num == -1)
                                    {
                                        d3.select(this).attr("fill", function () {
                                            var greyVal = 190;
                                            return 'rgb(' + greyVal + ',' + greyVal + ',' + greyVal + ')';
                                        });
                                    }
                                });
                        });
                });