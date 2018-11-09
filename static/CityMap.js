			if ( ! Detector.webgl )
				Detector.addGetWebGLMessage();

			var map_data, cluster_sum;
			var group, camera, scene, renderer, controls;
			var agent_pos_array = new Array();
			var agent_line_array = new Array();

			function threeStart(new_map_data)
			{


				map_data = new_map_data;
				cluster_sum = 4;
				init();
				animate();
				// loadAgent();
				// loadRoad();
				loadHighEntropyRoad();
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
				// renderer.setClearColor('rgb(135,206,250)',1.0);  
				// renderer.setClearColor(0xff0000,1.0);
				document.getElementById('canvas3d').appendChild( renderer.domElement );

				// camera

				camera = new THREE.PerspectiveCamera( 80, width / height, 1, 100000 );
				// camera.position.set( 15, 20, 30 );
				// camera.lookAt(0,0,0);
				camera.position.set(0, 0, -300);
				camera.lookAt(10, 10, 0);
				scene.add( camera );

				// controls

				// controls = new THREE.OrbitControls( camera, renderer.domElement );
				// controls.minDistance = 20;//控制滚轮放大画面最多能放大到多大
				// controls.maxDistance = 5000;//控制滚轮缩小画面最多能缩小到多小
				// controls.maxPolarAngle = Math.PI;//左键通过拖拽，上下旋转画面的角度，越大说明旋转的角度越大

				//trackball 左键旋转，右键平移，滚轮缩放
				controls = new THREE.TrackballControls( camera );
				controls.rotateSpeed = 1.0;//旋转速度
				controls.zoomSpeed = 1.2;//缩放速度
				controls.panSpeed = 1.0;//平移速度
				controls.noZoom = false;
				controls.noPan = false;
				controls.staticMoving = true;
				controls.dynamicDampingFactor = 0.3;
				controls.keys = [ 65, 83, 68 ];
				controls.addEventListener( 'change', render );

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
				console.log('river added he');

				// var city_vertices = map_data.city_vertices;
				// var city_faces = map_data.city_faces;
				// var city_geomotry = new THREE.Geometry();
				// for(var i = 0; i < city_vertices.length; i++)
                // {
                //    var point = city_vertices[i];
                //    var p = new THREE.Vector3(parseFloat(point[0]), parseFloat(point[1]), parseFloat(point[2]));
                //    city_geomotry.vertices.push(p);
                // }
                // for(var i = 0; i < city_faces.length; i++)
                // {
                //    var face = city_faces[i];
                //    var f = new THREE.Face3(parseInt(face[0]), parseInt(face[1]), parseInt(face[2]));
                //    city_geomotry.faces.push(f);
                // }
                // console.log(city_geomotry.vertices.length, city_geomotry.faces.length);
                // var city_material = new THREE.MeshBasicMaterial({color: 0x4a708b});
				// var city_mesh = new THREE.Mesh(city_geomotry, city_material);
				// scene.add(city_mesh);
				// console.log('city added');

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

			function loadHighEntropyRoad()
			{
				//每个类可视化的道路数量
				var ce_road_array = map_data.ce_road_arr;
				console.log("load high entropy road");

				var road_vertices = map_data.road_vertices;
				var road_lines = map_data.road_lines;

				for(var i = 0; i < ce_road_array.length; i++)
				{
					var line = road_lines[parseInt(ce_road_array[i])];

					var idx1 = parseInt(line[0]), idx2 = parseInt(line[1]);
					var p1 = road_vertices[idx1], p2 = road_vertices[idx2];
					var material = new THREE.LineBasicMaterial({color:0xff0000});
				    var geometry = new THREE.Geometry();  
				    geometry.vertices.push(new THREE.Vector3(parseFloat(p1[0]),parseFloat(p1[1]),parseFloat(p1[2])));  
				    geometry.vertices.push(new THREE.Vector3(parseFloat(p2[0]),parseFloat(p2[1]),parseFloat(p2[2])));
				    scene.add(new THREE.Line(geometry, material));
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

			function loadAgent() 
			{
				var agent_pos_array = map_data.selected_traj;
				var cluster_id_array = map_data.selected_cluster_id;
				// console.log(cluster_id_array);
				for(var i = 0; i < agent_pos_array.length; i++)
				{
					var material = new THREE.LineBasicMaterial({color:0xff0000});
					var cluster_idx = parseInt(cluster_id_array[i]);
					// console.log('he');
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
					}
				    var geometry = new THREE.Geometry();
				    for(var j = 0; j < agent_pos_array[i].length; j++)
				    {
				    	var p = new THREE.Vector3(parseFloat(agent_pos_array[i][j][0]), parseFloat(agent_pos_array[i][j][1]), parseFloat(agent_pos_array[i][j][2]));
				    	geometry.vertices.push(p);
				    }
				    var point = geometry.vertices[geometry.vertices.length-1];
				    // if(point.y>=1890)continue;
				    // console.log(point.y);
				    // console.log(geometry.vertices.length);
				    // for(var j = 0; j < geometry.vertices.length; j++)
				    // {
				    // 	console.log(geometry.vertices[j]);
				    // }
				    var line = new THREE.Line(geometry, material);
				    agent_line_array[i] = line;
				    scene.add(line);
				}
			}


			function onWindowResize() 
			{
				width = document.getElementById('canvas3d').clientWidth;
				height = document.getElementById('canvas3d').clientHeight;

				camera.aspect = width / height;
				camera.updateProjectionMatrix();

				controls.handleResize();
				renderer.setSize( width, height );

			}

			function animate() 
			{

				requestAnimationFrame( animate );
				controls.update();

				// group.rotation.y += 0.005;

				render();

			}

			function render() 
			{
				renderer.render( scene, camera );
			}