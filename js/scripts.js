var data = [];
var c = 0,b=0;
var meh = "FIFO";
function P(t)
{
    switch (t)
    {
        case 'n':
            var TE = $("#TE").val() , TI = $("#TI").val();
            if(TE==""||TE=="")
                return;


            if(c==data.length) {
                var TD = document.getElementById("tabdata");
                var htm = TD.innerHTML;
                htm += "<tr id='r" + c + "'><td>" + (c + 1) + "</td><td>" + TE + "</td><td>" + TI + "</td></tr>";
                TD.innerHTML = htm;
            }
            else
            {
                var TD = document.getElementById("r"+c);
                var htm = "<td>" + (c + 1) + "</td><td>" + TE + "</td><td>" + TI + "</td>";
                TD.innerHTML = htm;
            }
            data[c] = [TE, TI, (c+1)];

            b = parseInt(data[b][0]) < parseInt(data[c][0])?c:b;
            $("#TE").val(c+1!=data.length?data[c+1][0]:"");
            $("#TI").val(c+1!=data.length?data[c+1][1]:"");
            c++;
            if (data.length == 1) {
                $("#proc").prop('disabled', false);
                $("#reset").prop('disabled', false);
            }
            if(c==data.length)
                $("#btnN").prop('disabled', true);
            $("#TE").focus();
            break;
        case 'b':
            if(c<=0)
                return;
            $("#TE").val(data[c-1][0]);
            $("#TI").val(data[c-1][1]);
            if(c==data.length)
                $("#btnN").prop('disabled', false);
            c--;
            break;
        case 's':
            var inp = document.getElementById("seldata").value;
            if(inp == "RR") {
                $("#numb").prop('disabled', false);
                $("#numb").val(1);
            }
            else
                $("#numb").prop('disabled', true);
            meh = inp;
            break;
        case 'N':
            var TE = $("#TE").val() , TI = $("#TI").val();
            if(TE==""||TE=="")
                return;
            var TD = document.getElementById("r"+c);
            var htm = "<td>" + (c + 1) + "</td><td>" + TE + "</td><td>" + TI + "</td>";
            TD.innerHTML = htm;
            data[c] = [TE, TI, (c+1)];
            $("#TE").val("");
            $("#TI").val("");
            c = data.length;
            $("#btnN").prop('disabled', true);
            break;
    }

}
function keyp(e,p) {
    if(p=='TE'&& e.keyCode == 13)
    {
        $("#TI").focus();
    }
    else if (p=='TI'&&e.keyCode==13)
    {
        P('n');
        $("#TE").focus();
    }

}
function process() {
    var tg = document.getElementById("tabhead");
    var pn="",pt="";
    var ss=0;
    switch (meh)
    {
        case "FIFO":

            var g=[parseInt(data[0][1])];
            tg.innerHTML = "<h2>FIFO Gantt Chart ▼ </h2>";

            for(var i = 0 ;i<c;i++)
            {
                g[i + 1] = parseInt(data[i][0]) + parseInt(g[i]);
                ss += parseInt(g[i]) - parseInt(data[i][1]);
                pt +="<th>"+ g[i]+"</th>";
                pn +=  "<td>p"+ (i + 1) +"</td>";
            }
            pt += "<th>"+ g[c]+"</th>";
            document.getElementById("tabavg").innerHTML=  "Average time: "+ss+"/"+c;

            break;
        case  "SJF":
            var dt = data.slice();
            var g=parseInt(data[0][1]),ss=g;
            tg.innerHTML = "SJF Gantt Chart ▼ ";
            for(var i = 0 ;i<c;i++)
            {
                for(var p = c-1; p>i;p--)
                {
                    if(data[p][0]<data[p-1][0]&& data[p][1]<=g)
                    {
                        var t = data[p];
                        data[p] = data[p-1];
                        data[p-1]=t;
                    }
                }
                pt +="<th>"+ g+"</th>";
                g+=parseInt(data[i][0]);
                if(i!=c-1)
                    ss += parseInt(g) - parseInt(data[i][1]);
                pn +=  "<td>p"+ parseInt(data[i][2]) +"</td>";

            }
            pt +="<th>"+ g+"</th>";
            document.getElementById("tabavg").innerHTML=  "Average time: "+(ss-data[c-1][1])+"/"+c;
            data = dt.slice();
            break;
        case "RR":
            var q = parseInt($("#numb").val());
            q = q>0?q:4;
            var g=parseInt(data[0][1]),ss=0,p=[];
            for(var i = 0;i<c;i++)
                p[i] = parseInt(data[i][0]);
            tg.innerHTML = "RR Gantt Chart ▼ "
            pt +="<th>"+ g+"</th>";
            while (p[b]!=0)
                for(var  i = 0;i<c;i++)
                {
                    if(i!=0)
                    {
                        if(p[i-1]==0&&parseInt(g)<parseInt(data[i][1]) )
                            g= parseInt(data[i][1]);
                        if(parseInt(data[i][1])>parseInt(g))
                            continue;
                    }
                    if(p[i]==0)
                        continue;
                    if(parseInt(p[i])-q <= 0) {
                        g +=  parseInt(p[i]);
                        p[i] = 0;
                        ss+=(parseInt(g)-parseInt(data[i][1])-parseInt(data[i][0]));
                        pn +="<td>p"+data[i][2]+"</td>";
                        pt +="<th>"+g+"</th>";
                        if(i==b)
                            for(var j=0;j<data.length;j++)
                                if (parseInt(data[i][0])>0)
                                    b =j;
                        continue;
                    }
                    g+= parseInt(q);
                    p[i]-=parseInt(q);
                    pn +="<td>p"+data[i][2]+"</td>";
                    pt +="<th>"+g+"</th>";



                }
            document.getElementById("tabavg").innerHTML=  "Average time: "+ss+"/"+c;
            break;
        case "SRT":
            var dt = copy(data);
            var T = true,g = parseInt(dt[0][1]);
            tg.innerHTML = "SRT Gantt Chart ▼ "
            pt +="<th>"+ g+"</th>";
            while (T)
            {
                for(var i = 0 ;i<data.length;i++)
                {
                    var m= parseInt(ismine(dt[i],dt,g))
                    if (m ==0)
                        continue;
                    if (m== -1) {
                        T = false;
                        break;
                    }
                    dt[i][0] = parseInt(dt[i][0]) -parseInt(m);
                    g += parseInt(m);
                    if(parseInt(dt[i][0]) == 0)
                        ss = parseInt(g)-(parseInt(data[i][0])+parseInt(dt[i][1]))+ss;
                    pt +="<th>"+g+"</th>";
                    pn +=  "<td>p"+ parseInt(data[i][2]) +"</td>";


                }
            }
            document.getElementById("tabavg").innerHTML=  "Average time: "+ss+"/"+c;
            break;

    }
    document.getElementById("pt").innerHTML=pt;
    document.getElementById("pn").innerHTML=pn;


}

function reset() {
    data = [];
    c=0;
    b=0;
    document.getElementById("tabdata").innerHTML = "";
    document.getElementById("pt").innerHTML="";
    document.getElementById("pn").innerHTML="";
    document.getElementById("tabavg").innerHTML=  "";
    document.getElementById("tabhead").innerHTML = "";
    $("#proc").prop('disabled', true);
    $("#reset").prop('disabled', true);

}

function ismine(x,dt,g,o) {
    var m = x[0];
    var cz =0;
    for (var i= 0 ;i<dt.length;i++)
    {   var z0 =parseInt(x[0])-parseInt(dt[i][1]);
        if(parseInt(x[0])>parseInt(dt[i][0])&&parseInt(dt[i][1])<= parseInt(g)&&parseInt(dt[i][0])!=0)
            return 0;
        if(parseInt(dt[i][0]) < parseInt(x[0]) && parseInt(z0)>0&&parseInt(dt[i][0])!=0&& (parseInt(x[0])-parseInt(dt[i][1])+parseInt(g)>parseInt(dt[i][0])) )
            return parseInt(dt[i][1])-parseInt(g);
        if(parseInt(dt[i][0])==0)
            cz++;

    }
    if(cz == dt.length)
        return -1;
    return m;
}
function copy(data) {
    var dt = [];
    for (var i =0;i<data.length;i++)
    {
        dt[i] = [data[i][0],data[i][1],data[i][2]]
    }
    return dt;

}