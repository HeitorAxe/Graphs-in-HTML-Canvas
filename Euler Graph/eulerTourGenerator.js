let inSubgraph = []

function addEdge(v1, v2, graph)
{
    let edge = {v1: null, v1x: null, v1y: null, v2: null,  v2x: null, v2y: null};
    edge = vertexToEdge(v1, v2, onHoldEdge);
    if(graph.edges[edge.v1][edge.v2] == 1){return;}
    graph.edges[edge.v1][edge.v2] = 1;
    graph.edges[edge.v2][edge.v1] = 1;
    drawEdge(edge, "white", 2);
    v1.degree += 1;
    v2.degree += 1;
}

function generateRandomVertices(vertexQt)
{
    while(vertexQt!=0){
        randX = Math.floor(Math.random() * (window.innerWidth/1.2)+(window.innerWidth/30));
        randY = Math.floor(Math.random() * (window.innerHeight/1.2)+(window.innerHeight/30));
        let vertexPosExist = false;
            graph.vertices.forEach( vertex =>{
                if(randX > vertex.X - 40.5 && randX < vertex.X + 40.5 && randY > vertex.Y - 40.5 && randY < vertex.Y + 40.5)
                {
                    vertexPosExist = true;
                }
            
            })
        if(!vertexPosExist)
        {
            console.log("X = "+randX+" Y = "+randY);
            addVertex(randX, randY, graph.size);
            vertexQt -= 1;
        }
    }

}

function generateRandomEdges(graph)
{
    //Starts adding a random vertex between two vertex, forming a subgraph
    let randIdV1 = Math.floor(Math.random() * graph.size);
    let randIdV2 = Math.floor(Math.random() * graph.size);
    while(randIdV1 == randIdV2)
    {
        randIdV2 = Math.floor(Math.random() * graph.size);
    }

    addEdge(graph.vertices[randIdV1], graph.vertices[randIdV2], graph);
    inSubgraph.push(graph.vertices[randIdV1]);
    inSubgraph.push(graph.vertices[randIdV2]);

    //Now we add an edge between a random vertex 
    //in the subgraph and a random one that is not
    while(inSubgraph.length != graph.size)
    {
        randIdV1 = Math.floor(Math.random() * inSubgraph.length);
        randIdV2 = Math.floor(Math.random() * graph.size);

        v1 = inSubgraph[randIdV1];
        v2 = graph.vertices[randIdV2];

        if(graph.edges[v1.id][v2.id] == 1)
        {
            continue;
        }else{

            let isInSubgraph = false;

            for(let i = 0; i < inSubgraph.length; i++)
            {
                if(inSubgraph[i].id == v2.id)
                {
                    isInSubgraph = true;
                    break;
                }
            }
            if(!isInSubgraph){
                addEdge(v1, v2, graph);
                inSubgraph.push(graph.vertices[randIdV2]);
            }
        }
    }


    //Now we have tp add edges between all the vertices with odd degree
    //in case there are two vertices already connected, we should connect
    //the both through a inBetween vertex with even degree

    let stillOdds = true;
        for(let i = 0; i < inSubgraph.length; i++)
        {

            if(inSubgraph[i].degree%2 != 0)
            {
                console.log("Got here 1");
                for(let j = 0; j < inSubgraph.length; j++)
                {
                    if(inSubgraph[j].degree%2 != 0 && graph.edges[inSubgraph[i].id][inSubgraph[j].id] != 1 && j!=i)
                    {
                        console.log("Got here 2");
                        addEdge(inSubgraph[i], inSubgraph[j], graph);
                        stillOdds = true;
                        break;
                    }
                    else
                    {
                        console.log("Got here 3");
                        stillOdds = false;

                    }
                }
            }
        }

        if(!stillOdds)
        {
            console.log("Got here 4");
            for(let i = 0; i < inSubgraph.length; i++)
            {
    
                if(inSubgraph[i].degree%2 != 0)
                {
                    for(let j = 0; j < inSubgraph.length; j++)
                    {
                        if(inSubgraph[j].degree%2 == 0 && graph.edges[inSubgraph[i].id][inSubgraph[j].id] != 1)
                        {
                            for(let k = 0; k < inSubgraph.length; k++)
                            {
                                if(inSubgraph[k].degree%2 != 0 && graph.edges[inSubgraph[k].id][inSubgraph[j].id] != 1 && graph.edges[inSubgraph[k].id][inSubgraph[j].id] != 1 && k!=i && graph.edges[inSubgraph[k].id][inSubgraph[i].id] == 1)
                                {
                                    console.log("Got here 5")
                                    console.log(inSubgraph[k], inSubgraph[j]);
                                    console.log(inSubgraph[i], inSubgraph[j]);
                                    addEdge(inSubgraph[k], inSubgraph[j], graph)
                                    addEdge(inSubgraph[i], inSubgraph[j], graph)
                                    break;
                                }
                            }
                            
                        }

                    }
                }
            }
            
        }

        console.log(inSubgraph);

}

function generateEulerTourGraph(graph, vertexQt)
{
    generateRandomVertices(vertexQt);
    generateRandomEdges(graph);
}