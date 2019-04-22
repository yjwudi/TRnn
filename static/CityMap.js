if ( ! Detector.webgl )
	Detector.addGetWebGLMessage();

var fov, near, far;
var lookx, looky, last_lookx, last_looky;
var lastx, lasty, newx, newy, mousex, mousey, last_mousex, last_mousey;
var map_data, cluster_sum, heatmapInstance;
var group, camera, scene, renderer, controls;
var agent_pos_array = new Array();
var agent_line_array = new Array();
var pca_agent_array = new Array();
var agent_start_array = new Array();
var agent_end_array = new Array();
var pca_agent_end_array = new Array();
var test, test1;
var select_flag = 0;
var regionx1, regiony1, regionx2, regiony2;

function threeStart(new_map_data)
{
	map_data = new_map_data;
	cluster_sum = 4;
	init();
	animate();
	loadAgent();
	// showHeatMap();
	// loadRoad();
	// loadHighEntropyRoad();
	// loadAgentRoad();
}

function clearAgent(){
	for(var i = 0; i < agent_line_array.length; i++){
		scene.remove(agent_line_array[i]);
	}
	for(var i = 0; i < pca_agent_array.length; i++){
		scene.remove(pca_agent_array[i]);
	}
	for(var i = 0; i < pca_agent_end_array.length; i++){
		scene.remove(pca_agent_end_array[i]);
	}
	for(var i = 0; i < agent_start_array.length; i++){
		scene.remove(agent_start_array[i]);
	}
	for(var i = 0; i < agent_end_array.length; i++){
		scene.remove(agent_end_array[i]);
	}
	heatmapInstance.setData({max:1,data:[]});
}

function init()
{

	scene = new THREE.Scene();

	width = document.getElementById('canvas3d').clientWidth;
	height = document.getElementById('canvas3d').clientHeight;
	console.log(width);
	console.log(height);

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( width, height );
	renderer.setClearColor('rgb(255,255,255)',1.0);
	document.getElementById('canvas3d').appendChild( renderer.domElement );

	// camera
	fov = 80, near = 1, far = 100000;
	lastx = lasty = newx = newy = 0;
	lookx = looky = last_lookx = last_looky = 10;
	camera = new THREE.PerspectiveCamera( fov, width / height, near, far );
	// camera.position.set( 15, 20, 30 );
	// camera.lookAt(0,0,0);
	camera.position.set(newx, newy, -300);//z轴指向屏幕外
	camera.lookAt(lookx, looky, 0);
	scene.add( camera );
	document.getElementById('canvas3d').addEventListener( 'mousewheel', mousewheel, false );
	document.getElementById('canvas3d').addEventListener( 'mousedown', onDocumentMouseDown, false );

	// controls

	// controls = new THREE.OrbitControls( camera, renderer.domElement );
	// controls.minDistance = 20;//控制滚轮放大画面最多能放大到多大
	// controls.maxDistance = 5000;//控制滚轮缩小画面最多能缩小到多小
	// controls.maxPolarAngle = Math.PI;//左键通过拖拽，上下旋转画面的角度，越大说明旋转的角度越大

	//trackball 左键旋转，右键平移，滚轮缩放
	// controls = new THREE.TrackballControls( camera );
	// controls.rotateSpeed = 1.0;//旋转速度
	// controls.zoomSpeed = 1.2;//缩放速度
	// controls.panSpeed = 1.0;//平移速度
	// controls.noZoom = false;
	// controls.noPan = false;
	// controls.staticMoving = true;
	// controls.dynamicDampingFactor = 0.3;
	// controls.keys = [ 65, 83, 68 ];
	// controls.addEventListener( 'change', render );

	scene.add( new THREE.AmbientLight( 0x222222 ) );
	// light

	var light = new THREE.PointLight( 0xffffff, 1 );
	camera.add( light );

	var river_vertices = map_data.river_vertices;
	var river_faces = map_data.river_faces;
	var river_geomotry = new THREE.Geometry();
	for(var i = 0; i < river_vertices.length; i++)
    {
       var point = river_vertices[i];
       var p = new THREE.Vector3(parseFloat(point[0]), parseFloat(point[1]), parseFloat(point[2]));
       river_geomotry.vertices.push(p);
    }
    for(var i = 0; i < river_faces.length; i++)
    {
       var face = river_faces[i];
       var f = new THREE.Face3(parseInt(face[0]), parseInt(face[1]), parseInt(face[2]));
       river_geomotry.faces.push(f);
    }
    var river_material = new THREE.MeshBasicMaterial({color: 0x84bfe8});
	var river_mesh = new THREE.Mesh(river_geomotry, river_material);
	scene.add(river_mesh);
	test = river_mesh;
	console.log('river added he');


	var city_mat_x = map_data.city_mat_x;
	var city_mat_y = map_data.city_mat_y;
	console.log(city_mat_x.length);
	var city_geomotry = new THREE.Geometry();
	for(var i = 0; i < city_mat_x.length; i++)
	{
		var star = new THREE.Vector3(parseFloat(city_mat_x[i]), parseFloat(city_mat_y[i]), 1.0);
		city_geomotry.vertices.push(star);
	}
	console.log(city_geomotry.vertices.length);
	var city_material = new THREE.PointsMaterial({color: 0x4a708b});
	var city_mesh = new THREE.Points(city_geomotry, city_material);
	scene.add(city_mesh);
	test1 = city_mesh;
	console.log('city added');

	var shelter_vertices = map_data.shelter_vertices;
	var shelter_faces = map_data.shelter_faces;
	var shelter_geomotry = new THREE.Geometry();
	for(var i = 0; i < shelter_vertices.length; i++)
    {
       var point = shelter_vertices[i];
       var p = new THREE.Vector3(parseFloat(point[0]), parseFloat(point[1]), parseFloat(point[2]));
       shelter_geomotry.vertices.push(p);
    }
    for(var i = 0; i < shelter_faces.length; i++)
    {
       var face = shelter_faces[i];
       var f = new THREE.Face3(parseInt(face[0]), parseInt(face[1]), parseInt(face[2]));
       shelter_geomotry.faces.push(f);
    }
    console.log(shelter_geomotry.vertices.length, shelter_geomotry.faces.length);
    var shelter_material = new THREE.MeshBasicMaterial({color: 0x1f834a});
	var shelter_mesh = new THREE.Mesh(shelter_geomotry, shelter_material);
	scene.add(shelter_mesh);
	console.log('shelter added');


	camera.position.set(0, 1700, 3000);
	camera.lookAt(0, 1700, 0);

	window.addEventListener( 'resize', onWindowResize, false );

	heatmapInstance = h337.create({
	  // only container is required, the rest will be defaults
	  container: document.getElementById('canvas3d')
	});

}

function showHeatMap(){
	var ce_road_arr = map_data.ce_road_arr;
	var ce_road_value = map_data.ce_road_value;
	var maxv = 0;
	var points = [];
	for(var i = 0; i < Math.min(100,ce_road_value.length); i++){
		var idx = parseInt(ce_road_arr[i]), val = parseFloat(ce_road_value[i]);
		maxv = Math.max(maxv, val);
		var coordinate = getRoadCoor(idx);
		var winWidth = document.getElementById('canvas3d').clientWidth;
		var winHeight = document.getElementById('canvas3d').clientHeight;
		var tmp = new THREE.Vector3(coordinate.x, coordinate.y, 0);
		var vector = tmp.project(camera);
		var xv = Math.round((vector.x + 1) * winWidth / 2);
		var yv = Math.round((-vector.y + 1) * winHeight / 2);
		// console.log('co.x, co.y', coordinate.x, coordinate.y);
		// console.log('xv, yv', xv, yv);
		var point = {
			x: xv,
			y: yv,
			value: val
  		};
		points.push(point);
		// addRoad(idx);
		// break;
	}
	var data = {
	  max: maxv,
	  data: points
	};
	var nuConfig = {
	  radius: 10,
	  maxOpacity: .5,
	  minOpacity: 0,
	  blur: .75
	};
	heatmapInstance.configure(nuConfig);
	heatmapInstance.setData(data);
}

function getRoadCoor(idx){
	var road_vertices = map_data.road_vertices;
	var road_lines = map_data.road_lines;

	var line = road_lines[idx];
	var idx1 = parseInt(line[0]), idx2 = parseInt(line[1]);
	var p1 = road_vertices[idx1], p2 = road_vertices[idx2];
	var x = (parseFloat(p1[0])+parseFloat(p2[0]))/2.0;
	var y = (parseFloat(p1[1])+parseFloat(p2[1]))/2.0;
	var point = {x:x, y:y};
	return point;
}

//点击坐标-》屏幕相对坐标
//地图坐标-》设备坐标-》屏幕相对坐标
function onDocumentMouseDown( event ) {//按下鼠标
	var select_cbox = document.getElementById("select_cbox");
	event.preventDefault();
	//鼠标监听
	document.getElementById('canvas3d').addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.getElementById('canvas3d').addEventListener( 'mouseup', onDocumentMouseUp, false );
	document.getElementById('canvas3d').addEventListener( 'mouseout', onDocumentMouseOut, false );

	mousex = last_mousex = event.clientX;
	mousey = last_mousey = event.clientY;
	// console.log('mousex, mousey', mousex, mousey);

	var Sx = event.clientX-175;//鼠标单击位置横坐标
	var Sy = event.clientY-39;//鼠标单击位置纵坐标
	// console.log('相对坐标:', Sx, Sy);
	if(select_cbox.checked){
		var x_move = 5391, y_move = 61852.5;
		var x = biSearch(580-x_move, 10200-x_move, Sx, 0)+x_move;
		var y = biSearch(59205-y_move, 64500-y_move, Sy, 1)+y_move;
		console.log('checked x, y: ', x, y);
		if(select_flag==0){
			select_flag = 1;
			regionx1 = x;
			regiony1 = y;
		}
		else if(select_flag==1){
			select_flag = 2;
			regionx2 = x;
			regiony2 = y;
			$.ajax({
                    type: 'POST',
                    url:"/select_region",
                    data:JSON.stringify({'regionx1':regionx1,'regiony1':regiony1,
											   'regionx2':regionx2,'regiony2':regiony2}),
					// dataType: 'json',
                    contentType: 'application/json; charset=UTF-8',
                    success:function(data){ //成功的话，得到消息
                        map_data.cluster_num = 1;
                        map_data.semantics_dict = {};
                        successFunc(data);
                    }
                });
			select_flag = 0;
			select_cbox.checked = false;
		}
	}
	else{
		select_flag = 0;
	}


	// // 屏幕坐标转标准设备坐标
	// var targetx = ( Sx / winWidth ) * 2 - 1;//标准设备横坐标
	// var targety = -( Sy / winHeight ) * 2 + 1;//标准设备纵坐标
	// var standardVector  = new THREE.Vector3(targetx, targety, 0.5);//标准设备坐标
	// console.log('设备坐标:',standardVector);
	// //标准设备坐标转世界坐标
	// var worldVector = standardVector.unproject(camera);
	// console.log('世界坐标:',worldVector);
	// // var tmp = new THREE.Vector3(1605,-490,0);
	// for(var i = 0; i < 10; i++) {
    //     var tmp = new THREE.Vector3(-3342+10*i, -434, 0);
    //     var vector = tmp.project(camera);
    //     console.log(vector);
    //     vector.x = Math.round((vector.x + 1) * winWidth / 2);
    //     vector.y = Math.round((-vector.y + 1) * winHeight / 2);
    //     vector.z = 0;
    //     console.log(vector);
    // }
}
function biSearch(l, r, target, type){
	var winWidth = document.getElementById('canvas3d').clientWidth;
	var winHeight = document.getElementById('canvas3d').clientHeight;
	var device_coor;
	while(r-l>0.1){
		var m = (l+r)/2.0;
		var tmp = new THREE.Vector3(m, 0, 0);
		if(type==1){
			tmp = new THREE.Vector3(0, m, 0);
		}
		var vector = tmp.project(camera);
		if(type==0) {
            device_coor = Math.round((vector.x + 1) * winWidth / 2);
            if (device_coor < target)
                l = m;
            else
                r = m;
        } else {
			device_coor = Math.round((-vector.y + 1) * winHeight / 2);
			if(device_coor < target)
				r = m;
			else
				l = m;
		}
	}
	return l;
}

function onDocumentMouseMove( event ) {//移动鼠标
	mousex = event.clientX;
	mousey = event.clientY;
	// console.log('mousex', mousex, 'last_mousex', last_mousex);
	var deltax = mousex-last_mousex, deltay = mousey-last_mousey;
	lastx = camera.position.x, lasty = camera.position.y;
	newx = -deltax+lastx, newy = deltay+lasty;
	lookx = -deltax+last_lookx, looky = deltay+last_looky;
	camera.position.x = newx;
	camera.position.y = newy;
	camera.lookAt.x = lookx;
	camera.lookAt.y = looky;
	// console.log('moving ', newx, newy);
	// camera.updateProjectionMatrix();
	renderer.render(scene, camera);
	last_mousex = mousex, last_mousey = mousey;
	last_lookx = lookx, last_looky = looky;
}

function onDocumentMouseUp( event ) {//释放鼠标键
	document.getElementById('canvas3d').removeEventListener( 'mousemove', onDocumentMouseMove, false );
	document.getElementById('canvas3d').removeEventListener( 'mouseup', onDocumentMouseUp, false );
	document.getElementById('canvas3d').removeEventListener( 'mouseout', onDocumentMouseOut, false );
}

function onDocumentMouseOut( event ) {//移走鼠标
	document.getElementById('canvas3d').removeEventListener( 'mousemove', onDocumentMouseMove, false );
	document.getElementById('canvas3d').removeEventListener( 'mouseup', onDocumentMouseUp, false );
	document.getElementById('canvas3d').removeEventListener( 'mouseout', onDocumentMouseOut, false );
}

function mousewheel(e) {
	e.preventDefault();
	if (e.wheelDelta) {  //判断浏览器IE，谷歌滑轮事件
		if (e.wheelDelta > 0) { //当滑轮向上滚动时
			fov -= (near < fov ? 1 : 0);
		}
		if (e.wheelDelta < 0) { //当滑轮向下滚动时
			fov += (fov < far ? 1 : 0);
		}
	} else if (e.detail) {  //Firefox滑轮事件
		if (e.detail > 0) { //当滑轮向上滚动时
			fov -= 1;
		}
		if (e.detail < 0) { //当滑轮向下滚动时
			fov += 1;
		}
	}
	camera.fov = fov;
	camera.updateProjectionMatrix();
	renderer.render(scene, camera);
}

function loadHighEntropyRoad()
{
	//每个类可视化的道路数量
	var ce_road_array = map_data.ce_road_arr;
	console.log("load high entropy road");

	var road_vertices = map_data.road_vertices;
	var road_lines = map_data.road_lines;

	for(var i = 0; i < ce_road_array.length; i++)
	{
		addRoad(parseInt(ce_road_array[i]));
		// var line = road_lines[parseInt(ce_road_array[i])];
		// var idx1 = parseInt(line[0]), idx2 = parseInt(line[1]);
		// var p1 = road_vertices[idx1], p2 = road_vertices[idx2];
		// var material = new THREE.LineBasicMaterial({color:0xff0000});
	 //    var geometry = new THREE.Geometry();  
	 //    geometry.vertices.push(new THREE.Vector3(parseFloat(p1[0]),parseFloat(p1[1]),parseFloat(p1[2])));  
	 //    geometry.vertices.push(new THREE.Vector3(parseFloat(p2[0]),parseFloat(p2[1]),parseFloat(p2[2])));
	 //    scene.add(new THREE.Line(geometry, material));
	}
}
function addRoad(idx)
{
	var road_vertices = map_data.road_vertices;
	var road_lines = map_data.road_lines;

	var line = road_lines[idx];
	var idx1 = parseInt(line[0]), idx2 = parseInt(line[1]);
	var p1 = road_vertices[idx1], p2 = road_vertices[idx2];
	var material = new THREE.LineBasicMaterial({color:0xff0000});
    var geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(parseFloat(p1[0]),parseFloat(p1[1]),parseFloat(p1[2])));  
    geometry.vertices.push(new THREE.Vector3(parseFloat(p2[0]),parseFloat(p2[1]),parseFloat(p2[2])));
    scene.add(new THREE.Line(geometry, material));

    var road_time_num = map_data.road_time_num;
	// console.log(road_time_num[idx]);
	var time_num_arr = road_time_num[idx];
	var class_time_arr = new Array();
	var time_n = time_num_arr.length, cluster_n = time_num_arr[0].length;
	for(var i = 0; i < cluster_n; i++)
		class_time_arr[i] = new Array();
	for(var i = 0; i < time_n; i++){
		for(var j = 0; j < cluster_n; j++){
			class_time_arr[j][i] = time_num_arr[i][j];
		}
	}
	showLineChart(class_time_arr, map_data);
}

/*
可以优化一下：map_data里面可以只传过来selected_id中的人的path
*/
function loadAgentRoad()
{
	var agent_id = map_data.agent_id;
	var agent_road = map_data.agent_road;
	var selected_id_array = map_data.selected_id;
	var cluster_id_array = map_data.selected_cluster_id;
	var target = 2;
	var road_vertices = map_data.road_vertices;
	var road_lines = map_data.road_lines;
	var agent_road_dict = new Array();
	for(var i = 0; i < agent_road.length; i++)
	{
		var idx = parseInt(agent_id[i]);
		var road = agent_road[i];
		agent_road_dict[idx] = road;
	}
	console.log(agent_road[0]);
	for(var i = 0; i < cluster_id_array.length; i++)
	{
		var material = new THREE.LineBasicMaterial({color:0xff0000});
		var cluster_idx = parseInt(cluster_id_array[i]);
		if(cluster_idx != target)
			continue;
		var idx = parseInt(selected_id_array[i]);
		var road_arr = agent_road_dict[idx];
		for(var j = 0; j < road_arr.length; j++)
		{
			var line_idx = parseInt(road_arr[j]);
			addRoad(line_idx);
		}
	}
}

function loadRoad()
{
	//每个类可视化的道路数量
	var road_sum = 600;
	var cluster_road_array = map_data.cluster_road_dict;
	console.log("load high probability road");

	var road_vertices = map_data.road_vertices;
	var road_lines = map_data.road_lines;
	for(var i = 0; i < cluster_sum; i++)
	{
		var sum = 0;
		for(var j = 0; j < cluster_road_array[i].length; j++)
		{
			var line = road_lines[parseInt(cluster_road_array[i][j][0])];
			var prob = parseFloat(cluster_road_array[i][j][1]);
			if(prob<0.0001)
				break;
			var idx1 = parseInt(line[0]), idx2 = parseInt(line[1]);
			var p1 = road_vertices[idx1], p2 = road_vertices[idx2];
			var material = new THREE.LineBasicMaterial({color:0xffffff});
			switch(i)
			{
			case 0:
				material = new THREE.LineBasicMaterial({color:0xff0000});
				break;
			case 1:
				material = new THREE.LineBasicMaterial({color:0x00ff00});
				break;
			case 2:
				material = new THREE.LineBasicMaterial({color:0x0000ff});
				break;
			case 3:
				material = new THREE.LineBasicMaterial({color:0x836fff});
				break;
			case 4:
				material = new THREE.LineBasicMaterial({color:0x8b008b});
				break;
			case 5:
				material = new THREE.LineBasicMaterial({color:0xff6a6a});
				break;
			}
		    var geometry = new THREE.Geometry();  
		    geometry.vertices.push(new THREE.Vector3(parseFloat(p1[0]),parseFloat(p1[1]),parseFloat(p1[2])));  
		    geometry.vertices.push(new THREE.Vector3(parseFloat(p2[0]),parseFloat(p2[1]),parseFloat(p2[2])));
		    scene.add(new THREE.Line(geometry, material));
		    sum += 1;
			if(sum > road_sum)
				break;
		}
	}
}

function startCluster(){
	map_data.cluster_num = parseInt(document.getElementById('cluster_num_input').value);
	$.ajax({
			type: 'POST',
			url:"/start_cluster",
			data:JSON.stringify({'cluster_num':map_data.cluster_num}),
			contentType: 'application/json; charset=UTF-8',
			success:function(data){ //成功的话，得到消息
				clearAgent();
				map_data.selected_cluster_id = data.selected_cluster_id;
				map_data.ce_road_arr = data.ce_road_arr;
				map_data.ce_road_value = data.ce_road_value;
				map_data.connections = data.connections;
				map_data.circles = data.circles;
				map_data.road_time_num = data.road_time_num;
				map_data.semantics_dict = data.semantics_dict;
				loadAgent();
				showScatter(520, 400, map_data);
				showPCP(850, 450, map_data);
				showPixel(map_data);
			}
		});
}

function showSingleAgent(target_idx) {
	if(target_idx == -1)
		target_idx = parseInt(document.getElementById('show_num_input').value);
	var agent_pos_array = map_data.selected_traj;
	var cluster_id_array = map_data.selected_cluster_id;
	var sum_ = 0;
	for(var i = 0; i < agent_pos_array.length; i++){
		var cluster_idx = parseInt(cluster_id_array[i]);
		if(cluster_idx!=target_idx) {
		    continue;
        }
		sum_++;
		var material = getMaterial(cluster_idx);
	    var geometry = new THREE.Geometry();
	    for(var j = 0; j < agent_pos_array[i].length; j++)
	    {
	    	var p = new THREE.Vector3(parseFloat(agent_pos_array[i][j][0]), parseFloat(agent_pos_array[i][j][1]), parseFloat(agent_pos_array[i][j][2]));
	    	geometry.vertices.push(p);
	    }
	    var line = new THREE.Line(geometry, material);
	    scene.remove(agent_line_array[i]);
	    agent_line_array[i] = line;
	    scene.add(line);

		var end_point = getPoint(agent_pos_array[i][agent_pos_array[i].length-1],0xff8c00);
		scene.remove(agent_end_array[i]);
		agent_end_array[i] = end_point;
		scene.add(end_point);
	}

}
function showAnAgent(target_idx)
{
	console.log('showAnAgent: '+target_idx);
	var agent_pos_array = map_data.selected_traj;
	var cluster_id_array = map_data.selected_cluster_id;
	var selected_id = map_data.selected_id;
	for(var i = 0; i < agent_pos_array.length; i++){
		var cluster_idx = parseInt(cluster_id_array[i]);
		var selected_idx = parseInt(selected_id[i]);
		if(selected_idx!=target_idx) {
		    continue;
        }
		var material = getMaterial(cluster_idx);
	    var geometry = new THREE.Geometry();
	    for(var j = 0; j < agent_pos_array[i].length; j++)
	    {
	    	var p = new THREE.Vector3(parseFloat(agent_pos_array[i][j][0]), parseFloat(agent_pos_array[i][j][1]), parseFloat(agent_pos_array[i][j][2]));
	    	geometry.vertices.push(p);
	    }
	    var line = new THREE.Line(geometry, material);
	    scene.remove(pca_agent_array[i]);
	    pca_agent_array[i] = line;
	    scene.add(line);

		var end_point = getPoint(agent_pos_array[i][agent_pos_array[i].length-1],0xff8c00);
		scene.remove(pca_agent_end_array[i]);
		pca_agent_end_array[i] = end_point;
		scene.add(end_point);
	}

}

function getPoint(point, color_){
	var start_geo = new THREE.Geometry();
	var start_vec = new THREE.Vector3(parseFloat(point[0]), parseFloat(point[1]), parseFloat(point[2]));
	start_geo.vertices.push(start_vec);
	var start_material = new THREE.PointsMaterial( { color: color_, size:60 } );
	var star_point = new THREE.Points( start_geo, start_material );
	return star_point;
}

function getMaterial(cluster_idx){
	var material = new THREE.LineBasicMaterial({color:0xff0000});
	var color_v = get_color(cluster_idx);
	material = new THREE.LineBasicMaterial({color:color_v});
	return material;
}

function get_color(idx){
	switch(idx){
		case 0:
			return "#ff0000";
		case 1:
			return "#006400";
		case 2:
			return "#0000ff";
		case 3:
			return "#836fff";
		case 4:
			return "#8b008b";
		case 5:
			return "#ff6a6a";
		case 6:
			return "#ffd700";
		default:
			return "#000000";
	}
}

function loadAgent() 
{
	document.getElementById('semantics').innerHTML = "";
	var cluster_num = map_data.cluster_num;
	var div = document.getElementById("semantics");
    var tableNode=document.createElement("table");
    tableNode.setAttribute("id","table");
    tableNode.setAttribute("style","margin:auto");
	for(var i = 0; i < cluster_num; i++){
		showSingleAgent(i);
		var trNode=tableNode.insertRow();
		var color_v = get_color(i);
		var tdNode=trNode.insertCell();
		tdNode.innerHTML=(i+1).toString();
		tdNode.setAttribute("style","width:80px;background-color:"+color_v+";text-align:center");
		var input_id = "cluster_type"+i.toString();
		tdNode=trNode.insertCell();
		tdNode.innerHTML="<input type=\"text\" id="+input_id+" />";
		tdNode.setAttribute("style","width:120px;text-align:left");

	}
	div.appendChild(tableNode);
	for(var i = 0; i < cluster_num; i++){
		var input_id = "cluster_type"+i.toString();
		if(map_data.semantics_dict==undefined)
			document.getElementById(input_id).value="Unknown";
		else
			document.getElementById(input_id).value=map_data.semantics_dict[i];
    }
}

function showTest(){
	map_data.semantics_dict = {};
	for(var i = 0; i < map_data.cluster_num; i++) {
		var input_id = "cluster_type"+i.toString();
		map_data.semantics_dict[i] = document.getElementById(input_id).value;
    }
	map_data.semantics_dict[map_data.cluster_num] = "Unknown";
	console.log(map_data.semantics_dict);
	map_data.cluster_num = map_data.cluster_num+1;
	$.ajax({
			type: 'POST',
			url:"/cluster_test",
			data:JSON.stringify({'cluster_num':map_data.cluster_num}),
			contentType: 'application/json; charset=UTF-8',
			success:function(data){ //成功的话，得到消息
				successFunc(data);
			}
		});
}

function showTrain(){
	$.ajax({
		type: 'POST',
		url:"/show_train",
		// data:JSON.stringify({'idx':idx}),
		// dataType: 'json',
		contentType: 'application/json; charset=UTF-8',
		success:function(data){ //成功的话，得到消息
			map_data.cluster_num = parseInt(document.getElementById('cluster_num_input').value);
			successFunc(data);
		}
	});
}

function showTestCase() {
	var selId = document.getElementById("selecte_case");
	var v = selId.options[selId.selectedIndex].value;
	if(v=="null")
		return ;
	var idx = parseInt(v);
	console.log('select test case idx:',idx);
	$.ajax({
		type: 'POST',
		url:"/select_case",
		data:JSON.stringify({'idx':idx}),
		// dataType: 'json',
		contentType: 'application/json; charset=UTF-8',
		success:function(data){ //成功的话，得到消息
			map_data.cluster_num = 1;
			map_data.semantics_dict = {};
			successFunc(data);
		}
	});
}

function successFunc(data){
	clearAgent();
	map_data.selected_id = data.selected_id;
	map_data.selected_traj = data.selected_traj;
	map_data.selected_cluster_id = data.selected_cluster_id;
	loadAgent();
}


function onWindowResize()
{
	console.log('resize??');
	width = document.getElementById('canvas3d').clientWidth;
	height = document.getElementById('canvas3d').clientHeight;

	camera.aspect = width / height;
	camera.updateProjectionMatrix();

	// controls.handleResize();
	renderer.setSize( width, height );

}

function animate() 
{

	requestAnimationFrame( animate );
	// controls.update();

	// group.rotation.y += 0.005;

	render();

}

function render() 
{
	renderer.render( scene, camera );
}
