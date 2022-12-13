//something goes wrong if v1 goes to v4 and then another vertex

let canvas;
let ctx;

const graph = {
    size: 0,
    vertices: [],
    edges: [],
}

const mouse = {
    x:0,
    y:0
}

// 0 == awaiting the first vertex
// 1 == stored first vertex for the edge, waiting for the second
//if the two vertices are equal, they are deleted instead
let operationState = 0;

const onHoldEdge = {v1: null, v1x: null, v1y: null, v2: null,  v2x: null, v2y: null};

let edgeCost = "1";

//Canvas related functions
window.onload = function()
{
    //initating the canvas
    canvas = document.getElementById("canvas1");
    ctx = canvas.getContext('2d');//initate the canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.fillStyle = "white";
    ctx.font = "13px Arial"
    ctx.fillText("Edge Cost = " + edgeCost, 10, 25);

}

//window.addEventListener('resize', function(){
//    canvas.width = window.innerWidth;
//    canvas.height = window.innerHeight;
//
//});

//gets mouse position
window.addEventListener("mousemove", function(e){
    mouse.x = e.x;
    mouse.y = e.y;
});

//
window.addEventListener("keydown", function(event) {
    if (event.key == "d"){
        paintDijkstra(dijkstra(graph, 0), 'blue')
        return
    }
    const isNumber = /^[0-9]$/i.test(event.key);
    if(isNumber)
    {
        if(edgeCost=="0")
        {
            edgeCost = event.key;
        }else{
            edgeCost += event.key;
        }
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, 30);
        ctx.lineTo(window.innerWidth, 30);
        ctx.lineTo(window.innerWidth, 0);
        ctx.lineTo(0, 0);
        ctx.fillStyle='black';
        ctx.fill();
        ctx.font = "13px Arial"
        ctx.fillStyle='white';
        ctx.fillText("Edge Cost = " + edgeCost, 10, 25);
        return
    }
    if(event.keyCode == 8)
    {
        if(edgeCost.length == 1)
        {
            edgeCost = "0";
        }
        else
        {
            let newText = edgeCost.slice(0, -1);
            edgeCost = newText;
        }
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, 30);
        ctx.lineTo(window.innerWidth, 30);
        ctx.lineTo(window.innerWidth, 0);
        ctx.lineTo(0, 0);
        ctx.fillStyle='black';
        ctx.fill();
        ctx.font = "13px Arial"
        ctx.fillStyle='white';
        ctx.fillText("Edge Cost = " + edgeCost, 10, 25);
        return
    }
});

//Graph related functions
function addVertex(x, y, VertexId)
{
    let vertex = {
        id: VertexId,
        X: x,
        Y: y,
    }

    graph.vertices.push(vertex);
    graph.size += 1;

    for(let i = 0; i < graph.size-1; i++)
    {
        graph.edges[i].push(null);
    }
    let newVerArr = new Array(graph.size).fill(null);
    graph.edges.push(newVerArr);

}

function logGraph(graph)
{
    console.log(graph.vertices);
    console.log(graph.edges);
}

function drawVertex(x, y, id)
{
    ctx.beginPath();
    ctx.arc(x, y, 20.5, 0, Math.PI * 2, false);
    ctx.fillStyle = "black";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x, y, 20.5, 0, Math.PI * 2, false);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "white";
    ctx.stroke();

    ctx.font = "16px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("V"+id, x-9, y+8);
}

function vertexToEdge(v1, v2, edge)
{
    edge.v1x = v1.X;
    edge.v1 = v1.id;
    edge.v1y = v1.Y;

    edge.v2 = v2.id;
    edge.v2x = v2.X;
    edge.v2y = v2.Y;

    return edge;
}

function drawEdge(onHoldEdge, color, lineWidth, edgeCost){
        //draws edge
        ctx.beginPath();
        ctx.strokeStyle = "white";

        //Arrow code from https://codepen.io/chanthy/pen/WxQoVG?editors=1010
        var angle = Math.atan2(onHoldEdge.v2y-onHoldEdge.v1y,onHoldEdge.v2x-onHoldEdge.v1x);
        var headlen = 13+lineWidth;
        var tox = (onHoldEdge.v2x+onHoldEdge.v1x)/2;
        var toy = (onHoldEdge.v2y+onHoldEdge.v1y)/2;

        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.moveTo(onHoldEdge.v1x, onHoldEdge.v1y);
        ctx.lineTo(onHoldEdge.v2x, onHoldEdge.v2y);
        ctx.stroke();

        
        ctx.moveTo(tox, toy);
        ctx.lineTo(tox-headlen*Math.cos(angle-Math.PI/7),
                    toy-headlen*Math.sin(angle-Math.PI/7));
        
        //path from the side point of the arrow, to the other side point
        ctx.lineTo(tox-headlen*Math.cos(angle+Math.PI/7),
                    toy-headlen*Math.sin(angle+Math.PI/7));
        
        //path from the side point back to the tip of the arrow, and then
        //again to the opposite side point
        ctx.lineTo(tox, toy);
        ctx.lineTo(tox-headlen*Math.cos(angle-Math.PI/7),
                    toy-headlen*Math.sin(angle-Math.PI/7));

        ctx.fill();

        if(edgeCost != undefined){
            ctx.save();
            ctx.translate(tox, toy);
            ctx.rotate((angle-Math.PI*2));
            ctx.textAlign = "center"
            ctx.fillText(edgeCost, 0, -25);
            ctx.restore();
        }


        //this puts the vertex drawing above the edge line
        //so there is no overlay
        drawVertex(onHoldEdge.v1x, onHoldEdge.v1y, onHoldEdge.v1);
        drawVertex(onHoldEdge.v2x, onHoldEdge.v2y, onHoldEdge.v2);
}

document.addEventListener("click", onMouseClick);

function onMouseClick(e){

        let clickedOnVertex = false;
        graph.vertices.forEach( vertex =>{
            //console.log("x: "+vertex.X);
            //console.log("y: "+vertex.Y);
            //console.log("mouse x: "+mouse.x);
            //console.log("mouse y: "+mouse.y);
            if(mouse.x > vertex.X - 40.5 && mouse.x < vertex.X + 40.5 && mouse.y > vertex.Y - 40.5 && mouse.y < vertex.Y + 40.5)   
            {
                console.log("hey")
                if(operationState == 0){
                    onHoldEdge.v1x = vertex.X;
                    onHoldEdge.v1 = vertex.id;
                    onHoldEdge.v1y = vertex.Y;
                    operationState +=1;
                }
                else if(onHoldEdge.v1x == vertex.X && onHoldEdge.v1y == vertex.Y)
                {
                    //delete vertex
                    operationState = 0;
                }
                else if(operationState == 1){
                    //Creates edge
                    onHoldEdge.v2 = vertex.id;
                    onHoldEdge.v2x = vertex.X;
                    onHoldEdge.v2y = vertex.Y;
                    graph.edges[onHoldEdge.v1][onHoldEdge.v2] = parseInt(edgeCost);
                    //resets operationState
                    operationState = 0;

                   drawEdge(onHoldEdge, 'white', 2, edgeCost);

                }

                clickedOnVertex = true;
            }
        
        })

        console.log("graph");
        logGraph(graph);

        if(clickedOnVertex) return;

        //if the click wasnt on a vertex
        //draws a circle where it was clicked
        drawVertex(mouse.x, mouse.y, graph.size);
        addVertex(mouse.x, mouse.y, graph.size);
}