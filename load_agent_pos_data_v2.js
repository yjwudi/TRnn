/*
读入所有agent的pos数据
*/
function load_agent_pos_data_v2(url)
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
                   // var lines = text.split('\n');
                   var lines = text.split(/[\r\n]+/);
                   var head_line = lines[0].split(' ');
                   var sz = parseInt(head_line[1]);
                   for(var j = 1; j <= sz; j++)
                   {
                     var pos_line = lines[j].split(' ');
                     var p = new THREE.Vector3(parseFloat(pos_line[0])-5391, parseFloat(pos_line[1])-61852.5, parseFloat(pos_line[2]));
                     geometry.vertices.push(p);
                   }
                }
            }
        }
        request.send(null);
        return geometry;
    }
    
    // return geometry;
}
