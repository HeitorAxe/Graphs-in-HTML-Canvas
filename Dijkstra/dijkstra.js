const pq = []
const edge = {v1: null, v1x: null, v1y: null, v2: null,  v2x: null, v2y: null};
function remove_from_pq()
{
    let min = pq[0];
    let index = 0;

    for(let i = 0; i < pq.length; i++)
    {
        if(pq[i][1] < min[1])
        {
            min = pq[i];
            index = i;
        }
    }

    pq.splice(index, 1);

    console.log("removing from pq: ")
    console.log(min)

    return min;
}

//find the index
function find_key_on_pq(pq, key)
{
    console.log('looking for '+key);
    for(let i = 0; i < pq.length; i++)
    {
        if(pq[i][0] == key)
        {
            console.log("key: "+key);
            return i;
        }
    }
    console.log("didnt find key");
    return -1;
}


function dijkstra(graph, s)
{
    const pai = new Array(graph.size);
    const dp = new Array(graph.size);
    for(let i = 0; i < graph.size; i++){
        pai[i] = -1;
        dp[i] = Infinity;
    }
    dp[s] = 0;
    for(let i = 0; i < graph.size; i++)
    {
        //console.log(i+" "+dp[i]);
        pq.push([i, dp[i]]);
    }

    while(pq.length!=0){
        //console.log("pq");
        //console.log(pq);
        let w = remove_from_pq();
        console.log("w[1] " + w[1]);
        console.log("w[0] " + w[0]);
        if(dp[w[0]]!= Infinity)
        {
            for(let i = 0; i < graph.size; i++){
                if(graph.edges[w[0]][i] != null)
                {
                    console.log("is here")
                    //console.log("dp[w[0] = "+dp[w[0]])
                    //console.log("dp[i] = "+dp[i])

                    if(dp[i] > dp[w[0]] + graph.edges[w[0]][i])
                    {
                        let oldValue = dp[i];
                        console.log("old dp[i] = "+dp[i]);
                        dp[i] = dp[w[0]] + graph.edges[w[0]][i];
                        
                        console.log("dp[i]==" + dp[i]);
                        console.log("dp");
                        console.log(dp);

                        pq[find_key_on_pq(pq, i)][1] = dp[i];
                        pai[i] = w[0];
                        
                    }
                }
            }
        }

    }
    //console.log(graph.size);
    console.log("pai ");
    console.log(pai);

    return pai;
}


function paintDijkstra(pai)
{
    for(let i = 0;i < pai.length;i++)
    {
        if(pai[i] != -1){
            v1 = graph.vertices[pai[i]];
            v2 = graph.vertices[i];
            drawEdge(vertexToEdge(v1, v2, edge), 'yellow', 3);
        }
        
    }
}







