/*
读入所有agent的pos数据
*/
function load_agent_pos_data(url, id_array)
{
  console.log(url);
  var request=null;
  var ans=new Array();
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
                   console.log(lines.length);
                   for(var i = 0; i < lines.length; )
                   {
                    var head_line = lines[i].split(' ');
                    var agent_id = parseInt(head_line[0]), sz = parseInt(head_line[1]);
                    var idx = id_array.indexOf(agent_id);
                    if(idx>=0)
                    {
                      var geometry = new THREE.Geometry();
                      for(var j = i+1; j < i+1+sz; j++)
                      {
                        var pos_line = lines[j].split(' ');
                        var p = new THREE.Vector3(parseFloat(pos_line[0])-5391, parseFloat(pos_line[1])-61852.5, parseFloat(pos_line[2]));
                        geometry.vertices.push(p);
                      }
                      ans[ans.length] = geometry;
                    }
                    i = i+sz+1;
                   }
                   console.log('read over');
                }
            }
        }
        request.send(null);
        return ans;
    }
    
    // return geometry;
}
