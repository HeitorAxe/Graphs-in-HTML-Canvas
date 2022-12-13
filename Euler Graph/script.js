let canvas;
let ctx;

const graph = {
    size: 0,
    vertices: [],
    edges: [],
}

const onHoldEdge = {v1: null, v1x: null, v1y: null, v2: null,  v2x: null, v2y: null};

//Canvas related functions
window.onload = function()
{
    //initating the canvas
    canvas = document.getElementById("canvas1");
    ctx = canvas.getContext('2d');//initate the canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    generateEulerTourGraph(graph, 9);

}

//window.addEventListener('resize', function(){
//    canvas.width = window.innerWidth;
//    canvas.height = window.innerHeight;
//
//});


//Graph related functions
function drawVertex(x, y, id)
{
    ctx.beginPath();
    ctx.arc(x, y, 12.5, 0, Math.PI * 2, false);
    ctx.fillStyle = "black";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x, y, 12.5, 0, Math.PI * 2, false);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "white";
    ctx.stroke();

    ctx.font = "10px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("V"+id, x-6, y+5);
}

function addVertex(x, y, VertexId)
{
    let vertex = {
        id: VertexId,
        X: x,
        Y: y,
        degree: 0
    }

    graph.vertices.push(vertex);
    graph.size += 1;

    for(let i = 0; i < graph.size-1; i++)
    {
        graph.edges[i].push(null);
    }
    let newVerArr = new Array(graph.size).fill(null);
    graph.edges.push(newVerArr);

    drawVertex(x, y, VertexId);

}

//converts a vertex to an edge
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

function drawEdge(onHoldEdge, color, lineWidth){
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

        //this puts the vertex drawing above the edge line
        //so there is no overlay
        drawVertex(onHoldEdge.v1x, onHoldEdge.v1y, onHoldEdge.v1);
        drawVertex(onHoldEdge.v2x, onHoldEdge.v2y, onHoldEdge.v2);
}
