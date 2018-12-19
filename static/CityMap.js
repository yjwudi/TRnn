if ( ! Detector.webgl )
	Detector.addGetWebGLMessage();

var fov, near, far;
var lookx, looky, last_lookx, last_looky;
var lastx, lasty, newx, newy, mousex, mousey, last_mousex, last_mousey;
var map_data, cluster_sum;
var group, camera, scene, renderer, controls;
var agent_pos_array = new Array();
var agent_line_array = new Array();
var test, test1;

function threeStart(new_map_data)
{
	map_data = new_map_data;
	cluster_sum = 4;
	init();
	animate();
	loadAgent();
	// loadRoad();
	// loadHighEntropyRoad();
	// loadAgentRoad();
}

function clearAgent(){
	for(var i = 0; i < agent_line_array.length; i++){
		scene.remove(agent_line_array[i]);
	}
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
    var shelter_material = new THREE.MeshBasicMaterial({color: 0x00fff0});
	var shelter_mesh = new THREE.Mesh(shelter_geomotry, shelter_material);
	scene.add(shelter_mesh);
	console.log('shelter added');

	// var road_vertices = map_data.road_vertices;
	// var road_lines = map_data.road_lines;
	// for(var i = 0; i < road_lines.length; i++)
	// {
	// 	var line = road_lines[i];
	// 	var idx1 = parseInt(line[0]), idx2 = parseInt(line[1]);
	// 	var p1 = road_vertices[idx1], p2 = road_vertices[idx2];
	// 	var material = new THREE.LineBasicMaterial({color:0xffffff});  
	//     var geometry = new THREE.Geometry();  
	//     geometry.vertices.push(new THREE.Vector3(parseFloat(p1[0]),parseFloat(p1[1]),parseFloat(p1[2])));  
	//     geometry.vertices.push(new THREE.Vector3(parseFloat(p2[0]),parseFloat(p2[1]),parseFloat(p2[2])));
	//     scene.add(new THREE.Line(geometry, material));
	// }
	// console.log('road added');


	camera.position.set(0, 1700, 3000);
	camera.lookAt(0, 1700, 0);

	window.addEventListener( 'resize', onWindowResize, false );

}

function onDocumentMouseDown( event ) {//按下鼠标
	event.preventDefault();
	//鼠标监听
	document.getElementById('canvas3d').addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.getElementById('canvas3d').addEventListener( 'mouseup', onDocumentMouseUp, false );
	document.getElementById('canvas3d').addEventListener( 'mouseout', onDocumentMouseOut, false );

	mousex = last_mousex = event.clientX;
	mousey = last_mousey = event.clientY;
	console.log('mousex', mousex);
	console.log('mousey', mousey);

	var winWidth = 1327, winHeight = 600;

	var Sx = event.clientX-175;//鼠标单击位置横坐标
	var Sy = event.clientY-39;//鼠标单击位置纵坐标
	//屏幕坐标转标准设备坐标
	console.log('window.innerWidth, window.innerHeight',window.innerWidth, window.innerHeight);
	var x = ( Sx / winWidth ) * 2 - 1;//标准设备横坐标
	var y = -( Sy / winHeight ) * 2 + 1;//标准设备纵坐标
	var standardVector  = new THREE.Vector3(x, y, 0.5);//标准设备坐标
	//标准设备坐标转世界坐标
	var worldVector = standardVector.unproject(camera);
	console.log('x:',x,', y:',y);
	console.log('x:',worldVector.x,', y:',worldVector.y,', z:',worldVector.z);

	// var tmp = new THREE.Vector3(1605,-490,0);
	var tmp = new THREE.Vector3(-3342,-434,0);
	var vector = tmp.project(camera);
	console.log(vector);
	vector.x = Math.round( (   vector.x + 1 ) * winWidth  / 2 ),
	vector.y = Math.round( ( - vector.y + 1 ) * winHeight / 2 );
	vector.z = 0;
	console.log(Sx, Sy);
	console.log(vector);
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

function showSingleAgent(target_idx)
{
	if(target_idx == -1)
		target_idx = parseInt(document.getElementById('show_num_input').value);
	console.log('target_idx', target_idx);
	var agent_pos_array = map_data.selected_traj;
	var cluster_id_array = map_data.selected_cluster_id;
	for(var i = 0; i < agent_pos_array.length; i++)
	{
		var material = new THREE.LineBasicMaterial({color:0xff0000});
		var cluster_idx = parseInt(cluster_id_array[i]);
		if(cluster_idx!=target_idx) {
		    continue;
        }
		switch(cluster_idx)
		{
		case -1:
			material = new THREE.LineBasicMaterial({color:0xffffff});
			break;
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
		case 6:
			material = new THREE.LineBasicMaterial({color:0xffd700});
			break;
		}
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
	}
}
function loadAgent() 
{
	var cluster_num = map_data.cluster_num;
	for(var i = 0; i < cluster_num; i++){
		showSingleAgent(i);
	}
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
