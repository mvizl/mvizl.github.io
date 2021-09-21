window.onload = ()=>{
    let a = document.getElementById("testo");
    a.style.background = 'linear-gradient(120deg, rgb(70, 70, 75),rgb(45, 45, 45))';
    go(a);
}
let deg = 0;
let posX=250;
let posY=0;
function go(a) {
    let id = null;
    clearInterval(id);
    id = setInterval(frame, 5);
    function frame() {
        deg+=0.1;
        let rotMat = [[Math.cos(deg),Math.sin(deg)],[-Math.sin(deg),Math.cos(deg)]];
        let coord = [[posX],[posY]];
        let newCoord = dotProduct(rotMat,coord);
        //a.style.background = 'linear-gradient('+deg+'deg, rgb(70, 70, 75),rgb(45, 45, 45))';
        a.style.background = 'radial-gradient(circle at '+(newCoord[0][0]+250)+'px '+(newCoord[1][0]+250)+'px, #333, #f9f9f9)';

    }
}

function dotProduct(m1,m2){
    if (m1[0].length == m2.length){
        let result = [];
        for (let i = 0; i < m1.length; i++){
            result[i] = [];
            for (let j = 0; j < m2[0].length; j++){
                let num = 0;
                for (let k = 0; k < m1[0].length; k++){
                    num += m1[i][k] * m2[k][j];
                }
                result[i][j] = num;
            }
        }
        return result;
    }
}