function load_triangle_data(url)
{
	console.log(url);
	var request=null;
	var geometry = new THREE.Geometry();
    if(window.XMLHttpRequest)
    {
        request=new XMLHttpRequest();
    }
    else if(window.ActiveXObject)
    {
        request=new ActiveXObject("Microsoft.XMLHTTP");
    }
    if(request)
    {
        request.open("GET",url,false);//false 同步 串行
        request.onreadystatechange=function()
        {
            if(request.readyState===4)
            {
                if (request.status == 200 || request.status == 0)
                {
                   var text = request.responseText;
                   var lines = text.split('\n');
                   var size_line = lines[0].split(' ');
                   var point_size = size_line[0], idx_size = size_line[1];
                   console.log(point_size);
                   console.log(idx_size);
                   var i;

                   // for(i = 1; i <= point_size; i++)
                   // {
                   //    // if(i>50)break;
                   // 		var point = lines[i].split(' ');
                   //    // if(i==point_size)
                   //    // {
                   //    //     console.log(point[0]);
                   //    //     console.log(point[1]);
                   //    //     console.log(point[2]);
                   //    // }
                   // 		var p = new THREE.Vector3(point[0], point[1], point[2]);
                   // 		geometry.vertices.push(p);
                   // }
                   // for( ; i < lines.length; i++)
                   // {
                   //    // if(lines[i].length<1)continue;
                   // 		var face = lines[i].split(' ');
                   // 		var f = new THREE.Face3(face[0], face[1], face[2]);
                   //    // console.log(face[0],face[1],face[2]);
                   // 		geometry.faces.push(f);
                   //    // break;
                   // }
                   for(i = 1; i <= point_size; i++)
                   {
                    // if(i>10)continue;
                      var point = lines[i].split(' ');
                      var p = new THREE.Vector3(point[0], point[1], point[2]);
                      geometry.vertices.push(p);
                   }
                   for( ; i < lines.length; i++)
                   {
                      if(lines[i].length<1)
                        continue;
                      var face = lines[i].split(' ');
                      var f = new THREE.Face3(parseInt(face[0]), parseInt(face[1]), parseInt(face[2]));
                      geometry.faces.push(f);
                   }
                   console.log('read over');
                }
            }
        }
        request.send(null);
        return geometry;
    }
    
    // return geometry;
}














