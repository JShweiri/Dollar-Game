let gameCanvas = document.getElementById("gc");
let ctx = gameCanvas.getContext("2d")
gameCanvas.width = 800;
gameCanvas.height = 800;

let Nodes = [];
let connectionList = [];

function Node(ID, Dolla, Cons) {
    return {
        id: ID,
        dollars: Dolla,
        connections: Cons,
    }
};

function makeStage(NodeAmount){

    for(let i =0; i < NodeAmount; i++){
        // connectionList.push([0,i]);
        let unique = true;
        temp = [i, Math.floor(Math.random()*NodeAmount)];

        for(let j = 0; j < connectionList.length; j++){
            if (temp == connectionList[j]){
                unique = false;
            }

            if (temp[0] == connectionList[j][1] && temp[1] == connectionList[j][0]){
                unique = false;
            }
        }

        if (temp[0] == temp[1]){
            unique = false;
        }

        if(unique){
        connectionList.push(temp);
        } else {
            i--;
        }
    }

    let min = connectionList.length - NodeAmount + 1;
    console.log(min);
    let total = 0;

    for(let i =0; i < NodeAmount; i++){
        connections = [];
        let dolla = 0;

        if(i == NodeAmount-1){
            dolla = min - total;
        }
        else if(total <= min){
            dolla = Math.ceil(Math.random()*20);
        }
        else {
            dolla = -Math.ceil(Math.random()*20);
        }
        total+=dolla;

        for(let j =0; j < connectionList.length; j++){

            let c;

            if(connectionList[j][0] == i){
                c = connectionList[j][1];
            }
            if(connectionList[j][1] == i){
                c = connectionList[j][0];
            }

            if(i != c && c+1){
            connections.push(c);
            }

        }

        Nodes[i]=Node(i, dolla, connections);
    }
}
ctx.font = "30px Arial";

// function RGB2HTML(red, green, blue)
// {
//     var decColor =0x1000000+ blue + 0x100 * green + 0x10000 *red ;
//     return '#'+decColor.toString(16).substr(1);
// }

ctx.fillStyle="#222";

function drawStage(NodeAmount){
    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    //Draw larger circle
    ctx.beginPath();
    ctx.arc(400, 400, 90, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();

    ctx.fillStyle="#FFF";
    ctx.textAlign="center"; 
    ctx.fillText(Nodes[0].dollars,400,410);
    ctx.fillStyle="#222";

    //Draw smaller circles
    let deg = 360.0/(NodeAmount-1);
    for(let i = 1; i < NodeAmount; i++){
        rad = (i-1)*deg/360*2*Math.PI;
        let x = 200*Math.cos(rad);
        let y = 200*Math.sin(rad);
        ctx.beginPath();
        ctx.arc(400+x, 400+y, 50, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();
        ctx.fillStyle="#FFF";
        ctx.textAlign="center";
        ctx.fillText(Nodes[i].dollars,400+x, 410+y);
        ctx.fillStyle="#222";
    }

    //Draw lines
    for(let i = 0; i < connectionList.length; i++){

        let first = connectionList[i][0]
        rad = (first-1)*deg/360*2*Math.PI;
        let x1 = 200*Math.cos(rad);
        let y1 = 200*Math.sin(rad);
        if (first == 0){
            x1 = y1 = 0;
        }

        let second = connectionList[i][1]
        rad = (second-1)*deg/360*2*Math.PI;
        let x2 = 200*Math.cos(rad);
        let y2 = 200*Math.sin(rad);
        if (second == 0){
            x2 = y2 = 0;
        }


        ctx.strokeStyle = '#999'
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.lineCap = "butt";
        ctx.moveTo(400+x1, 400+y1);
        ctx.lineTo(400+x2, 400+y2);
        ctx.stroke();
    }


}

gameCanvas.addEventListener('click', function(event) {
    var rect = gameCanvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;

    let numClicked;

    if(x-400)
    for(let i =1; i < Nodes.length; i++){

        let deg = 360.0/(Nodes.length-1);
            rad = (i-1)*deg/360*2*Math.PI;
            let cx = 400+ 200*Math.cos(rad);
            let cy = 400+ 200*Math.sin(rad);

        if(Math.abs(Math.sqrt((400-x)*(400-x)+(400-y)*(400-y))) < 90 ){
            numClicked = 0;
        }

        if(Math.abs(Math.sqrt((cx-x)*(cx-x)+(cy-y)*(cy-y))) < 50 ){
            numClicked = i;
            //i was clicked
        }
        //console.log("x: " + x + " y: " + y + " cx: " + cx + " cy: " + cy);
        //console.log(Math.abs(Math.sqrt((cx-x)*(cx-x)+(cy-y)*(cy-y))));
    }

    Nodes[numClicked].dollars -= Nodes[numClicked].connections.length;

    for(let i = 0; i < Nodes[numClicked].connections.length; i++){
        Nodes[Nodes[numClicked].connections[i]].dollars+=1;
    }

    console.log(numClicked + " was clicked");

});

function main(num){
makeStage(num);
setInterval(drawStage, 300, num);
}

main(12);