/*
读入每行一个的int数据
*/
function load_single_data(url)
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
                   for(var i = 0; i < lines.length; i++)
                   {
                    var agent_id = parseInt(lines[i]);
                    ans[i] = agent_id;
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
