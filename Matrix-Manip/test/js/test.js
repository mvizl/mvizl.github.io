let aaa = true;
let zzz = Math.PI/4;
window.onload = function(){
    
    let mat = [];
let size = 7;
    for (let i = 0; i < size; i++){
        mat[i] = [];
        for (let j = 0; j <size;j++){
            mat[i][j] = [];
            for (let k = 0; k < size;k++){
                mat[i][j][k] = (((i*mat[0].length)+j)*mat[0][0].length)+k+1;
            }
        }
    }
    let matVis = visualBox(mat);
    /*let mat = visualBox([
        [[1,2,3],[4,5,6],[7,8,9]],
        [[5,6,0],[7,8,0],[13,14,15]],
        [[5,6,0],[7,8,0],[13,14,15]]
    ]);*/
    let eyebtn= document.getElementById("eyebtn")
    let a = true;

    eyebtn.onclick = event=>{
        if (a){
            a=false;
            eyebtn.innerHTML =  '<svg height="100%" width="100%" fill="#000000" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/" version="1.1" x="0px" y="0px" viewBox="-1 -18.982 100 100" overflow="visible" enable-background="new -1 -18.982 100 100" xml:space="preserve"><path fill="#000000" d="M49,62.035c-26.167,0-46.674-27.814-47.535-28.999L0,31.018l1.465-2.019C2.326,27.814,22.833,0,49,0  c26.166,0,46.674,27.814,47.534,28.999L98,31.018l-1.466,2.019C95.674,34.221,75.166,62.035,49,62.035z M8.616,31.014  C13.669,37.151,30.117,55.166,49,55.166c18.928,0,35.339-18.006,40.386-24.145C84.331,24.883,67.885,6.869,49,6.869  C30.072,6.869,13.661,24.874,8.616,31.014z"/><circle fill="#000000" cx="49" cy="31.018" r="18.997"/></svg>';
        }
        else{
            a=true;
            eyebtn.innerHTML = '<svg height="100%" width="100%" fill="#000000" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 100 55.02" enable-background="new 0 0 100 55.02" xml:space="preserve"><path d="M93.116,27.51c-10.099,13.729-26.01,21.841-43.11,21.841c-17.111,0-33.034-8.115-43.127-21.841H0l0.569,0.86  C11.583,45.058,30.066,55.02,50.006,55.02c19.936,0,38.415-9.962,49.426-26.654L100,27.51H93.116z"/></svg>';
        }
        
    }
}
window.onmouseup = function(){
    console.log("mouseup");
}


function visualBox(matrix){
    that = {};
    that.container = document.getElementById("matCon");
    that.container.classList.add("matrix-container")
    that.cells = [];
    let container = that.container;

    let x = matrix[0].length;
    let y = matrix[0][0].length;
    let z = matrix.length;
    let cubeWrapper = document.createElement("div");

    let cube = document.createElement("div");
    //cubeWrapper.appendChild(cube);
    cube.classList.add("cube2");
    container.appendChild(cube);
    cubeWrapper.classList.add("cube-wrapper");
    let dist = Math.max(x*y, x*z, y*z);
    dist = 1109-(dist*12.09);
    cubeWrapper.style.transform = "translateZ("+dist+"px)";

    let distBtwn = 50;//50 pixels between each node
    let adjI = ((matrix.length-1)*distBtwn)/2;//number to adjust I by (for centering)
    let adjJ = ((matrix[0].length-1)*distBtwn)/2;
    let adjK = ((matrix[0][0].length-1)*distBtwn)/2;

    for (let i = 0; i < matrix.length; i++){
        that.cells[i] = [];
        for (let j = 0; j < matrix[0].length; j++){
            that.cells[i][j] = [];
            for(let k = 0; k < matrix[0][0].length; k++){
                that.cells[i][j][k] = {outer:document.createElement("div"),inner:document.createElement("div"),pos:{x:0,y:0,z:0,radxz:0,radyz:0}};
                that.cells[i][j][k].outer.appendChild(that.cells[i][j][k].inner);
                that.cells[i][j][k].inner.innerHTML = matrix[i][j][k];
                that.cells[i][j][k].inner.classList.add("nodeText");
                that.cells[i][j][k].outer.classList.add("node");

                that.cells[i][j][k].outer.style.left = "235px";
                that.cells[i][j][k].outer.style.top = "235px";

                
                if (matrix[i][j][k].toString().length > 3){
                    let fSize = Math.floor(54 / matrix[i][j][k].toString().length);
                    that.cells[i][j][k].inner.style.fontSize = fSize+"px"; //32px of room
                }

                //that.cells[i][j][k].style.pointerEvents = "none";
                that.cells[i][j][k].outer.style.userSelect = "none";
                that.cells[i][j][k].outer.setAttribute("draggable",false);
                that.cells[i][j][k].outer.onclick = event=>{console.log("clicked");}

                let x = ((k*distBtwn-adjK));
                let y = ((j*distBtwn-adjJ));
                let z = (-(i*distBtwn-adjI));

                that.cells[i][j][k].pos.radxz = Math.sqrt(x*x+z*z);
                that.cells[i][j][k].pos.radyz = Math.sqrt(y*y+z*z);

                that.cells[i][j][k].pos.x = x;
                that.cells[i][j][k].pos.y = y;
                that.cells[i][j][k].pos.z = z;
                that.cells[i][j][k].outer.style.transform = "translate3d("+x+"px,"+y+"px,"+z+"px)";
                if (k == 2 && j==1 && i==1){
                //that.cells[i][j][k].inner.style.background = "red";
                that.cells[i][j][k].inner.classList.add("selected");
                }
                //nodes[i][j][k].style.border = "solid black 1px";
                cube.appendChild(that.cells[i][j][k].outer);
                cube.style.transform = "translateZ("+-280+"px)";
            }
        }
    }
    let zoom = -280;
    let zoomOutBtn = document.createElement("button");
    zoomOutBtn.innerHTML = "-";
    let zoomInBtn = document.createElement("button");
    zoomInBtn.innerHTML = "+";
    zoomInBtn.classList.add("zoom-in-btn");
    zoomOutBtn.classList.add("zoom-out-btn");
    zoomInBtn.onclick = event=>{
        zoom+=40;
        cube.style.transform = "translateZ("+zoom+"px)";
    };
    zoomOutBtn.onclick = event=>{
        zoom-=40;
        cube.style.transform = "translateZ("+zoom+"px)";
    };
    container.appendChild(zoomInBtn);
    container.appendChild(zoomOutBtn);
    
    let rot = {x:0,y:0};//stores radians of x and y axis
    let lastPos = {x:0,y:0};
    /*document.getElementById("mybtn").onclick = event=>{
        zoom+=40;
        cube.style.transform = "translateZ("+zoom+"px)";
    };
    document.getElementById("mybtn2").onclick = event=>{
        zoom-=40;
        cube.style.transform = "translateZ("+zoom+"px)";
    };*/
    let updateFcn = event=>{
        let xAmt = (event.pageX - lastPos.x);
        let yAmt = (event.pageY - lastPos.y);
        lastPos.x = event.pageX;
        lastPos.y = event.pageY;

        let radX = rot.x + 0.01 * xAmt;
        let radY;
        let newY = rot.y + 0.01 * -yAmt;
        if (newY > Math.PI/2){
            radY = Math.PI/2
        }
        else if( newY < -Math.PI/2){
            radY = -Math.PI/2
        }
        else{
            radY = newY;
        }
        rot.x = radX;
        rot.y = radY;

        for (let i = 0; i < that.cells.length;i++){
            for (let j =0; j < that.cells[0].length;j++){
                for (let k = 0; k < that.cells[0][0].length; k++){

                    let rotMatX =[[1,0,0],[0,Math.cos(radY),-Math.sin(radY)],[0,Math.sin(radY),Math.cos(radY)]]; //rotationX matrix

                    let rotMatY = [[Math.cos(radX),0,Math.sin(radX)],[0,1,0],[-Math.sin(radX),0,Math.cos(radX)]]; //rotationY

                    let coords = [[that.cells[i][j][k].pos.x],[that.cells[i][j][k].pos.y],[that.cells[i][j][k].pos.z]]

                    let result = dotProduct(rotMatX,dotProduct(rotMatY,coords));
                    

                    that.cells[i][j][k].outer.style.transform = "translate3d("+result[0][0]+"px,"+result[1][0]+"px,"+result[2][0]+"px)";
                }
            }
        }
    };
    that.clickPos = {x:0,y:0}
    that.container.onmousedown = event=>{
        lastPos.x = event.pageX; 
        lastPos.y = event.pageY;
        that.clickPos.x = event.pageX; 
        that.clickPos.y = event.pageY;
        window.onmousemove = updateFcn;
        window.onmouseup = event=>{window.onmousemove = undefined;}
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


function matAdd(m1, m2){
    if (m1.length == m2.length && m1[0].length == m2[0].length){
        let result = [];
        for(let i = 0; i < m1.length; i++){
            result[i] = [];
            for (let j = 0; j < m1[0].length; j++){
                    result[i][j] = m1[i][j] + m2[i][j];
            }
        }
        return result;
    }
}