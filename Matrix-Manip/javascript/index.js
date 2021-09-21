////////////////////////////////////////////////////////////////////////////////////////////////////////
window.onload = function(){
    let app = controller();
    app.bindInput();
}



var MATOP = {ADD:0, SUB:1, MUL:2, DIV:3}; //'Enum' that defines the operations to be applied to the 3D Arrays

/**Managing the central app logic, and app views */
function controller(){
    let that = {};
    that.amtDesired = null;
    that.selected = [];
    that.matrices = [];
    
    that.setupPage = PageManager("numMat","dimen");
    that.mainPage = PageManager("appSetup","appMain");
    that.mainSubPage = PageManager("mainEdit","mainEB");

    /**Binds dom nodes to functions */
    that.bindInput = function(){
        let contr = this;

        /**Tab headers */
        let routine = function(event, page){
            let children = event.target.parentElement.children;
            for (let i = 0; i < children.length; i++){
                children[i].classList.remove("active");
            }
            event.target.classList.add("active");
            contr.mainSubPage.goToPage(page);
        }
        document.getElementById("tabEdit").onclick = (event)=>{
            routine(event, "mainEdit");
        }
        document.getElementById("tabEquation").onclick = (event)=>{
            //updating displays in case of edit inside of edit mode
            that.eqWidget.clearCalc();
            that.eqWidget.updateDisplay();
            routine(event, "mainEB");
        }
        /////////////////

        document.getElementById("numMatSubmit").onclick = function(){
            contr.submitNumMat();
        }
        document.getElementById("dimenSubmit").onclick = function(){
            contr.submitDimension();
        }
        let dimenOut = document.getElementById("dimenOut");
        document.getElementById("rowIn").oninput = event =>{
            let input = parseInt(event.target.value);
            if(!isNaN(input)){
                dimenOut.innerHTML = "x"+input+"x"+input;
            }
        }
    }

    /** */
    that.updateCurrentMatrices = function(){
        let container = document.getElementById("setupListMatr");
        container.innerHTML = "";

        for (let i = 0;i < this.matrices.length; i++){
            let newLine = document.createElement("div");
            newLine.innerHTML = "3D Array #"+(i+1)+": "+this.matrices[i].data[0][0].length+"x"+this.matrices[i].data[0].length+"x"+this.matrices[i].data.length;
            container.appendChild(newLine);
        }
    }

    /** */
    that.submitNumMat = function(){
        let inputWidget = document.getElementById("numMatIn");
        let input = parseInt(inputWidget.value);
        inputWidget.classList.remove("flash");
        if (isNaN(input)){
            window.requestAnimationFrame(function(time) {
                window.requestAnimationFrame(function(time) {
                    inputWidget.classList.add("flash");
                });
            });
        }
        else{
            if (input <= parseInt(inputWidget.max) && input >= parseInt(inputWidget.min)){
                this.amtDesired = input;
                let input2 = parseInt(document.getElementById("rowIn").value);
                document.getElementById("dimenOut").innerHTML = "x"+input2+"x"+input2;
                this.requestDimension();
                this.setupPage.goToPage("dimen");
            }
            else{
                alert("Input must be between "+inputWidget.min+" and "+inputWidget.max+" (inclusive)!");
            }
        }
    }

    /** */
    that.requestDimension = function(){
        document.getElementById("matrNum").innerHTML = (this.matrices.length+1)+": ";

    }

    /** */
    that.submitDimension = function(){
        let rowInputWidget = document.getElementById("rowIn");
        let colInputWidget = document.getElementById("colIn");
        let row = parseInt(rowInputWidget.value);
        let col = parseInt(colInputWidget.value);
        rowInputWidget.classList.remove("flash");
        colInputWidget.classList.remove("flash");
        
        if (isNaN(col)){
            window.requestAnimationFrame(function(time) {
                window.requestAnimationFrame(function(time) {
                    colInputWidget.classList.add("flash");
                });
            });
        }
        else if (isNaN(row)){
            window.requestAnimationFrame(function(time) {
                window.requestAnimationFrame(function(time) {
                    rowInputWidget.classList.add("flash");
                });
            });
        }
        else{
            if (col <= parseInt(colInputWidget.max) && col >= parseInt(colInputWidget.min)){
                if (row <= parseInt(rowInputWidget.max) && row >= parseInt(rowInputWidget.min)){
                    let newMat = new Matrix(row,col,col);
                    newMat.randomize();
                    this.matrices.push(newMat);
                    if (this.matrices.length == this.amtDesired){
                        this.loadMain();
                    }
                    else{
                        this.updateCurrentMatrices();
                        this.requestDimension();
                    }
                }
                else{
                    alert("Row input must be between "+rowInputWidget.min+" and "+rowInputWidget.max+" (inclusive)!");
                }
            }
            else{
                alert("Column input must be between "+colInputWidget.min+" and "+colInputWidget.max+" (inclusive)!");
            }
            
        }
    }

    /** */
    that.loadMain = function(){
        this.loadMainEdit();
        this.mainPage.goToPage("appMain");

        //init equation builder
        this.eqWidget = new equationBuilderWidget("slotTbl", "matConEq", "addSlot","remSlot","calcEq",this.matrices);

        this.eqWidget.init();
        
    }

    /**Sets up and loads the "Edit" section */
    that.loadMainEdit = function(){
        this.mainSubPage.goToPage("mainEdit");
        let slct = document.getElementById("matrSelect");
        slct.innerHTML = "";

        for (let i = 0; i < this.matrices.length; i++){
            let option = document.createElement("option");
            option.value = i;
            option.innerHTML = "3D Array #"+(i+1)+": "+this.matrices[i].data[0][0].length+"x"+this.matrices[i].data[0].length+"x"+this.matrices[i].data.length;
            slct.appendChild(option);
        }

        let contr = this;
        slct.value = 0;
        let output = document.getElementById("matConEdit");
        slct.onchange = event =>{
            //contr.matrices[slct.value].setOutputContainer("matCon");
            window.requestAnimationFrame(function(time) {
                window.requestAnimationFrame(function(time) {
                    contr.matrices[slct.value].print(output,true);
                });
            });
            
        };
        slct.onchange();
    }

    /** */
    that.init = function(){

    }
    return that;
}




//+-×÷
/**Returns an object that Handles the logic of maintaining the equation builder widget and updating its visuals */
function equationBuilderWidget(containerID, outputID,addBtn,remBtn, calcBtn, matrices){
    let that = {};
    that.MAX_EQ_SLOTS = 10;

    that.matOperator = matrixOp();
    that.matrices = matrices;

    //Resource for open eye icon
    let eyeImg = document.createElement("svg");
    eyeImg.innerHTML = '<svg height="100%" width="100%" fill="#000000" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/" version="1.1" x="0px" y="0px" viewBox="-1 -18.982 100 100" overflow="visible" enable-background="new -1 -18.982 100 100" xml:space="preserve"><path fill="#000000" d="M49,62.035c-26.167,0-46.674-27.814-47.535-28.999L0,31.018l1.465-2.019C2.326,27.814,22.833,0,49,0  c26.166,0,46.674,27.814,47.534,28.999L98,31.018l-1.466,2.019C95.674,34.221,75.166,62.035,49,62.035z M8.616,31.014  C13.669,37.151,30.117,55.166,49,55.166c18.928,0,35.339-18.006,40.386-24.145C84.331,24.883,67.885,6.869,49,6.869  C30.072,6.869,13.661,24.874,8.616,31.014z"/><circle fill="#000000" cx="49" cy="31.018" r="18.997"/><!--<title>View</title>--></svg>';
    eyeImg = eyeImg.children[0];

    //Resource for closed eye icon
    let eyeImgClose = document.createElement("svg");
    eyeImgClose.innerHTML = '<svg height="100%" width="100%" fill="#000000" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 100 55.02" enable-background="new 0 0 100 55.02" xml:space="preserve"><path d="M93.116,27.51c-10.099,13.729-26.01,21.841-43.11,21.841c-17.111,0-33.034-8.115-43.127-21.841H0l0.569,0.86  C11.583,45.058,30.066,55.02,50.006,55.02c19.936,0,38.415-9.962,49.426-26.654L100,27.51H93.116z"/></svg>';
    eyeImgClose = eyeImgClose.children[0];
    

    let signChoiceOG = document.createElement("select");
    {
        let op1 = document.createElement("option");
        let op2 = document.createElement("option");
        let op3 = document.createElement("option");
        let op4 = document.createElement("option");

        op1.innerHTML = "+";
        op2.innerHTML = "-";
        op3.innerHTML = "×";
        op4.innerHTML = "÷";
        op1.setAttribute("value",MATOP.ADD);
        op2.setAttribute("value",MATOP.SUB);
        op3.setAttribute("value",MATOP.MUL);
        op4.setAttribute("value",MATOP.DIV);
        signChoiceOG.appendChild(op1);
        signChoiceOG.appendChild(op2);
        signChoiceOG.appendChild(op3);
        signChoiceOG.appendChild(op4);
    }

    that.result = null;
    that.container = document.getElementById(containerID);
    that.out = document.getElementById(outputID);
    that.out.innerHTML = "";

    that.previews = document.createElement("div");// output container for the 3d previews for the matrices in the slots
    that.previews.appendChild(document.createElement("div"));
    that.previews.children[0].classList.add("matrix-container");
    that.matrices[0].print(that.previews);
    let previewsContainer = document.createElement("div");
    that.previewsTitle = document.createElement("div");
    that.previewsTitle.classList.add("matrix-viewport-title");
    previewsContainer.appendChild(that.previewsTitle);
    previewsContainer.appendChild(that.previews);

    that.calcOutput = document.createElement("div"); //output container for the calculated matrices
    let calcOutputContainer = document.createElement("div");
    let txt = document.createElement("div");
    txt.innerHTML = "Equation Result:";
    txt.classList.add("matrix-viewport-title");
    calcOutputContainer.appendChild(txt);
    calcOutputContainer.appendChild(that.calcOutput);
    let clearedContainer = that.previews.children[0].cloneNode();
    that.calcOutput.appendChild(clearedContainer);
    that.out.appendChild(previewsContainer);
    that.out.appendChild(calcOutputContainer);
    

    //binding//
    document.getElementById(addBtn).onclick = event=>{that.addSlot();}
    document.getElementById(remBtn).onclick = event =>{that.removeSlot();}
    document.getElementById(calcBtn).onclick = event=>{that.performCalc();}
    ///////////

    
    that.slots = [];// contains objects {slot: dom select node, operator:dom select node, eyeIcon: dom div node, viewActive: bool}

    //use on selects to append possible matrices
    let optionAppend = function(container){
        for (let i = 0 ;i < matrices.length; i++){
            let option = document.createElement("option");
            option.value = i;
            option.innerHTML = "3D Array #"+(i+1)+": "+matrices[i].data[0][0].length+"x"+matrices[i].data[0].length+"x"+matrices[i].data.length;
            container.appendChild(option);
        }
    }

    let errMsgWidget = document.getElementById("errorWidget");

    let selectedSlot = null; //

    /** */
    that.init = function(){
        //first slot has no operator
        this.slots = [];
        this.container.innerHTML = "";
        
        
        this.addSlot();
        this.slots[0].slot.parentElement.parentElement.children[0].innerHTML = "";
        this.slots[0].eyeIcon.innerHTML = "";
        this.slots[0].eyeIcon.appendChild(eyeImg.cloneNode(true));
        selectedSlot = this.slots[0];
        this.addSlot();
    }

    /**Takes an index of a matrix that was updated */
    /*that.matUpdated = function(index){
        for (let i = 0; i < this.slots.length; i++){
            if (this.slots[i].slot.value == index){
                this.clearCalc();
                break;
            }
        }
        if (selectedSlot.slot.value == index){
            this.displaySlot(selectedSlot.slot);
        }
    }*/
    
    that.displaySlot = function(slotObj){
        this.matrices[slotObj.slot.value].print(this.previews);
        that.previewsTitle.innerHTML = "Viewing: 3D Array #"+(parseInt(slotObj.slot.value)+1);
    }
    that.updateDisplay = function(){
        this.displaySlot(selectedSlot);
    }

    that.clearCalc = function(){
        this.calcOutput.innerHTML = ""; //clear calc'd output
        this.calcOutput.appendChild(clearedContainer);
    }
    /** */
    that.addSlot = function(){
        if (this.slots.length <= this.MAX_EQ_SLOTS){
            this.clearCalc();
            let slotObj = {};
            slotObj.viewActive = false;
            let row = document.createElement("tr");
            let sign = document.createElement("td");
            let signChoice = signChoiceOG.cloneNode(true);
            sign.appendChild(signChoice);
            row.appendChild(sign);
            let slotTd = document.createElement("td");
            let slot = document.createElement("select");//slot is a slot for a matrix to use in an equation
            slot.classList.add("equation-slot");
            row.appendChild(slotTd);
            slotTd.appendChild(slot);
            optionAppend(slot);

            signChoice.onchange = event=>{
                that.clearCalc();
            }

            slot.onchange = function(event){
                that.clearCalc();
                slot.classList.remove("error-border");
                errMsgWidget.parentElement.style.maxHeight = null;
                if (slotObj.viewActive){
                    that.displaySlot(slotObj);
                }
            };

            let viewTd = document.createElement("td");
            let viewBtn = document.createElement("div");
            let img = eyeImgClose.cloneNode(true);
            viewBtn.appendChild(img);
            viewBtn.setAttribute("title","View");
            viewBtn.classList.add("eye");
            viewTd.appendChild(viewBtn);

            slotObj.eyeIcon = viewBtn;

            viewBtn.onclick = event=>{
                if (selectedSlot != slotObj){
                    that.displaySlot(slotObj);
                    viewBtn.innerHTML = "";
                    viewBtn.appendChild(eyeImg.cloneNode(true));
                    if (selectedSlot){
                        selectedSlot.viewActive = false;
                        selectedSlot.eyeIcon.innerHTML = "";
                        selectedSlot.eyeIcon.appendChild(eyeImgClose.cloneNode(true));
                    }
                    selectedSlot = slotObj;
                    slotObj.viewActive = true;
                }
            }

            row.appendChild(viewTd);
            this.container.appendChild(row);

            slotObj.slot = slot;
            slotObj.operator = signChoice;
            this.slots.push(slotObj);
        }
        else{
            alert("Equation builder can have maximum of 10 slots");
        }
    }

    /** */
    that.removeSlot = function(){
        if (this.slots.length > 2){
            this.clearCalc();
            this.slots[this.slots.length-1].slot.parentElement.parentElement.remove();
            this.slots.pop();
        }
    }
    
    /** */
    that.performCalc = function(){
        this.result = this.matrices[this.slots[0].slot.value];//get first slot to start off the calculation
        errMsgWidget.parentElement.style.maxHeight = null;
        for (let i = 1; i < this.slots.length; i++){
            let opResult = this.matOperator.operation(this.slots[i].operator.value, this.result, this.matrices[this.slots[i].slot.value]);
            if (opResult){
                this.result = this.matOperator.getResult();
                this.slots[i].slot.classList.remove("error-border");
            }
            else{
                let err = this.matOperator.getError();
                //console.log(err);
                errMsgWidget.innerHTML = err + " Now displaying result of operations preceeding the error.";
                errMsgWidget.parentElement.style.maxHeight = errMsgWidget.parentElement.scrollHeight + "px";
                this.slots[i].slot.classList.add("error-border");
                break;
            }
        }
        this.result.print(this.calcOutput);
    }
    return that;
}

/** Matrix operation Fcns of this object return true if successful, false if an error was encountered */
function matrixOp(){
    let that = {};
    that.error = "";
    that.result = null;//a matrix object
    
    that.operation = function(matOp,m1,m2){

        if (matOp == MATOP.ADD){
            if (m2.data.length == m1.data.length && m2.data[0].length == m1.data[0].length && m2.data[0][0].length == m1.data[0][0].length){
                let result = new Matrix(m1.data[0].length, m1.data[0][0].length, m1.data.length);
                for(let i = 0; i < m1.data.length; i++){
                    for (let j = 0; j < m1.data[0].length; j++){
                        for(let k = 0; k < m1.data[0][0].length; k++){
                            result.data[i][j][k] = m1.data[i][j][k] + m2.data[i][j][k];
                        }
                    }
                }
                this.result = result;
                return true;
            }
            this.error = "Matrices have incompatible dimensions: ("+m1.data[0][0].length+"x"+m1.data[0].length+"x"+m1.data.length+") vs ("+m2.data[0][0].length+"x"+m2.data[0].length+"x"+m2.data.length+")";
            return false;
        }
        else if (matOp == MATOP.SUB){
            if (m2.data.length == m1.data.length && m2.data[0].length == m1.data[0].length && m2.data[0][0].length == m1.data[0][0].length){
                let result = new Matrix(m1.data[0].length, m1.data[0][0].length, m1.data.length);
                for(let i = 0; i < m1.data.length; i++){
                    for (let j = 0; j < m1.data[0].length; j++){
                        for(let k = 0; k < m1.data[0][0].length; k++){
                            result.data[i][j][k] = m1.data[i][j][k] - m2.data[i][j][k];
                        }
                    }
                }
                this.result = result;
                return true;
            }
            this.error = "Matrices have incompatible dimensions: ("+m1.data[0][0].length+"x"+m1.data[0].length+"x"+m1.data.length+") vs ("+m2.data[0][0].length+"x"+m2.data[0].length+"x"+m2.data.length+")";
            return false;
        }
        else if (matOp == MATOP.MUL){
            if (m2.data.length == m1.data.length && m2.data[0].length == m1.data[0].length && m2.data[0][0].length == m1.data[0][0].length){
                let result = new Matrix(1, 1, m1.data.length);
                for (let i = 0; i < m1.data.length; i++){
                    result.data[i] = dotProduct(m1.data[i], m2.data[i]);
                }
                this.result = result;
                return true;
            }
            else{
                this.error = "Matrices have incompatible dimensions: ("+m1.data[0][0].length+"x"+m1.data[0].length+"x"+m1.data.length+") vs ("+m2.data[0][0].length+"x"+m2.data[0].length+"x"+m2.data.length+")";
                return false;
            }
        }
        else if (matOp == MATOP.DIV){
            let noZeros = true;
            for (let i = 0; i < m2.data.length && noZeros; i++){
                for (let j = 0; j < m2.data[0].length && noZeros; j++){
                    for (let k = 0; k < m2.data[0][0].length && noZeros; k++){
                        noZeros = noZeros && m2.data[i][j][k] != 0;
                    }
                }
            }
            if (noZeros){
                if (m2.data.length == m1.data.length && m2.data[0].length == m1.data[0].length && m2.data[0][0].length == m1.data[0][0].length){
                    let result = new Matrix(m2.data[0].length, m2.data[0][0].length, m2.data.length);
                    for (let i = 0; i < m1.data.length; i++){
                        for (let j = 0; j < m1.data[0].length; j++){
                            for (let k = 0; k < m1.data[0][0].length; k++){
                                result.data[i][j][k] = m1.data[i][j][k]/m2.data[i][j][k];
                            }
                        }
                    }
                    this.result = result;
                    return true;
                }
                this.error = "Matrices have incompatible dimensions: ("+m1.data[0][0].length+"x"+m1.data[0].length+"x"+m1.data.length+") vs ("+m2.data[0][0].length+"x"+m2.data[0].length+"x"+m2.data.length+")";
                return false;
            }
            else{
                //this.error = "Matrices have incompatible dimensions: ("+m1.data[0][0].length+"x"+m1.data[0].length+"x"+m1.data.length+") vs ("+m2.data[0][0].length+"x"+m2.data[0].length+"x"+m2.data.length+")";
                this.error = "Cannot divide by a matrix that has zeros!";
                return false;
            }
        }
    }
    that.getResult = function(){
        return this.result;
    }
    that.getError = function(){
        return this.error;
    }
    return that;
}

/**Bit of a misnomer. This class is basically a 3D Array */
class Matrix{
    constructor(row,col,depth){
        this.cellSize = 45;//px
        this.data = []; //[z][y][x]
        for(let i = 0; i < depth; i++){
            this.data[i] = [];
            for (let j = 0; j < row; j++){
                this.data[i][j] = [];
                for(let k = 0; k < col; k++){
                    this.data[i][j][k] = 0;
                }
            }
        }
    }
    changeNum(row,col,depth,newNum){
        this.data[depth][row][col] = newNum;
    }
    getNum(row,col,depth){
        return this.data[depth][row][col];
    }
    randomize(){
        for(let i = 0; i < this.data.length; i++){
            for (let j = 0; j < this.data[0].length; j++){
                for(let k = 0; k < this.data[0][0].length; k++){
                    this.data[i][j][k] = Math.floor((Math.random() * 8)+1);
                }
            }
        }
    }
    /**Prints this matrix to the given dom element, output
     * If editMode==true, provides editing functionality
     * output is HTML DOM element*/
    print(output, editMode=false){
        ///
        let that = {};
        
        that.container = document.createElement("div");
        that.container.classList.add("matrix-container")
        that.cells = [];
        let matrix = this.data;
        let container = that.container;
        output.innerHTML = "";
        output.appendChild(container);

        //CONTROLS FOR THE VISUAL//
        if (editMode){
            let editContainer = document.createElement("div");
            editContainer.classList.add("matrix-viewport-controls");
            //editContainer.style = "padding:1em; border:solid white 2px; border-radius:5px; width:500px; box-sizing:border-box;";
            output.appendChild(editContainer);

            let xIn = document.createElement("input");
            let yIn = document.createElement("input");
            let zIn = document.createElement("input");
            let valIn = document.createElement("input");

            let xLabel = document.createElement("label");
            let yLabel = document.createElement("label");
            let zLabel = document.createElement("label");
            let valLabel = document.createElement("label");

            xIn.style.width = "3em";
            yIn.style.width = "3em";
            zIn.style.width = "3em";

            xIn.setAttribute("type","number");
            yIn.setAttribute("type","number");
            zIn.setAttribute("type","number");
            valIn.setAttribute("type","number");

            xIn.setAttribute("max", matrix[0][0].length);
            yIn.setAttribute("max", matrix[0].length);
            zIn.setAttribute("max", matrix.length);

            xIn.setAttribute("min", 1);
            yIn.setAttribute("min", 1);
            zIn.setAttribute("min", 1);

            xLabel.innerHTML = " x ";
            yLabel.innerHTML = " y ";
            zLabel.innerHTML = " z ";
            valLabel.innerHTML = " value ";

            editContainer.appendChild(xLabel);
            editContainer.appendChild(xIn);
            editContainer.appendChild(yLabel);
            editContainer.appendChild(yIn);
            editContainer.appendChild(zLabel);
            editContainer.appendChild(zIn)
            editContainer.appendChild(valLabel);
            editContainer.appendChild(valIn);
            
            editContainer.appendChild(document.createElement("br"));

            //fade controls//
            let check = document.createElement("input");
            check.setAttribute("type","checkbox");
            editContainer.appendChild(check);
            check.onchange = event=>{
                cube.classList.toggle("fadeall");
            };
            check.setAttribute("id","fadecheck");
            let checkLabel = document.createElement("label");
            checkLabel.innerHTML = "Fade unselected elements";
            checkLabel.setAttribute("for","fadecheck")
            editContainer.appendChild(checkLabel);
            ////////////////

            let selected = null;//currently selected cell
            let lastValid = {x:"",y:"",z:""};//the last valid input

            /**manages input & updates the cells with styling based on what is selected*/
            let coordChange = function(){
                let x = parseInt(xIn.value);
                let y = parseInt(yIn.value);
                let z = parseInt(zIn.value);
                if (!isNaN(x) && !isNaN(y) && !isNaN(z)){
                    if (x > 0 && y > 0 && z > 0 && x <= matrix[0][0].length && y <= matrix[0].length && z <= matrix.length){
                        lastValid.x = x;
                        lastValid.y = y;
                        lastValid.z = z;
                        x--;
                        y--;
                        z--;
                        if (selected){
                            selected.classList.remove("selected");
                        }
                        selected = that.cells[z][y][x].inner;
                        selected.classList.add("selected");
                        valIn.value = matrix[z][y][x];
                    }
                    else{
                        xIn.value = lastValid.x;
                        yIn.value = lastValid.y;
                        zIn.value = lastValid.z;
                    }
                }
            }

            xIn.onchange = coordChange;
            yIn.onchange = coordChange;
            zIn.onchange = coordChange;

            valIn.onchange = event=>{
                let x = parseInt(xIn.value);
                let y = parseInt(yIn.value);
                let z = parseInt(zIn.value);
                if (!isNaN(x) && !isNaN(y) && !isNaN(z)){
                    x--;
                    y--;
                    z--;
                    let val = parseFloat(valIn.value);
                    if (!isNaN(val)){
                        matrix[z][y][x] = val;
                        that.cells[z][y][x].inner.innerHTML = val;
                        that.cells[z][y][x].inner.setAttribute("title", val.toLocaleString(undefined,{ maximumFractionDigits: 5 })); //string conversion to match locale format
                    }
                    else{
                        valIn.value = matrix[z][y][x];
                    }
                }
            };
        }
        else{
            //Regular mode - no editing
            let editContainer = document.createElement("div");
            editContainer.classList.add("matrix-viewport-controls");
            //editContainer.style = "padding:1em; border:solid white 2px; border-radius:5px; width:500px; box-sizing:border-box;";
            output.appendChild(editContainer);

            let xIn = document.createElement("input");
            let yIn = document.createElement("input");
            let zIn = document.createElement("input");

            let xLabel = document.createElement("label");
            let yLabel = document.createElement("label");
            let zLabel = document.createElement("label");

            xIn.style.width = "3em";
            yIn.style.width = "3em";
            zIn.style.width = "3em";

            xIn.setAttribute("type","number");
            yIn.setAttribute("type","number");
            zIn.setAttribute("type","number");

            xLabel.innerHTML = " x ";
            yLabel.innerHTML = " y ";
            zLabel.innerHTML = " z ";

            xIn.setAttribute("max", matrix[0][0].length);
            yIn.setAttribute("max", matrix[0].length);
            zIn.setAttribute("max", matrix.length);

            xIn.setAttribute("min", 1);
            yIn.setAttribute("min", 1);
            zIn.setAttribute("min", 1);

            xIn.setAttribute("disabled",true);
            yIn.setAttribute("disabled",true);
            zIn.setAttribute("disabled",true);

            xIn.value = 1;
            yIn.value = 1;
            zIn.value = 1;

            let selTable = document.createElement("table");
            selTable.classList.add("sel-table");
            let head = document.createElement("tr");
            let r1 = document.createElement("tr");
            let r2 = document.createElement("tr");
            selTable.appendChild(head);
            selTable.appendChild(r1);
            selTable.appendChild(r2);
            editContainer.appendChild(selTable);
            {
                let td0 = document.createElement("th");
                let td1 = document.createElement("th");
                td1.innerHTML = "x";
                let td2 = document.createElement("th");
                td2.innerHTML = "y";
                let td3 = document.createElement("th");
                td3.innerHTML = "z";
                head.appendChild(td0);
                head.appendChild(td1);
                head.appendChild(td2);
                head.appendChild(td3);
            }
            
            
            let xCheck = document.createElement("input");
            xCheck.setAttribute("type","checkbox");
            let yCheck = xCheck.cloneNode();
            let zCheck = xCheck.cloneNode();
            {
                let td0 = document.createElement("th");
                td0.innerHTML = "Active";
                let td1 = document.createElement("td");
                td1.appendChild(xCheck);
                let td2 = document.createElement("td");
                td2.appendChild(yCheck);
                let td3 = document.createElement("td");
                td3.appendChild(zCheck);
                r1.appendChild(td0);
                r1.appendChild(td1);
                r1.appendChild(td2);
                r1.appendChild(td3);
            }
            {
                let td0 = document.createElement("th");
                td0.innerHTML = "Value";
                let td1 = document.createElement("td");
                td1.appendChild(xIn);
                let td2 = document.createElement("td");
                td2.appendChild(yIn);
                let td3 = document.createElement("td");
                td3.appendChild(zIn);
                r2.appendChild(td0);
                r2.appendChild(td1);
                r2.appendChild(td2);
                r2.appendChild(td3);
            }

            
            editContainer.appendChild(document.createElement("br"));
            
            let check = document.createElement("input");
            check.setAttribute("type","checkbox");
            editContainer.appendChild(check);
            
            let uniqNum = new Date().getTime();
            check.setAttribute("id","fadecheck"+uniqNum);
            let checkLabel = document.createElement("label");
            checkLabel.innerHTML = "Fade unselected";
            checkLabel.setAttribute("for","fadecheck"+uniqNum);
            editContainer.appendChild(checkLabel);

            editContainer.appendChild(document.createElement("br"));

            let hideTextCheck = document.createElement("input");
            hideTextCheck.setAttribute("type","checkbox");
            hideTextCheck.setAttribute("id","hidetextcheck"+uniqNum);
            editContainer.appendChild(hideTextCheck);
            let hideTextCheckLabel = document.createElement("label");
            hideTextCheckLabel.innerHTML = "Hide Text";
            hideTextCheckLabel.setAttribute("for","hidetextcheck"+uniqNum);
            editContainer.appendChild(hideTextCheckLabel);
            hideTextCheck.setAttribute("disabled", true);

            check.onchange = event=>{
                cube.classList.toggle("fadeall");
                //prevent hideTextCheck from being accessed when check is unchecked
                if (event.target.checked)
                    hideTextCheck.removeAttribute("disabled");
                else
                    hideTextCheck.setAttribute("disabled", true);
            };
            hideTextCheck.onchange = event=>{
                cube.classList.toggle("hide-text");
            };


            let selected = [];
            let lastValid = {x:1,y:1,z:1};
            /**manages input & updates the cells with styling based on what is 'selected'*/
            let coordChange = function(){
                let x = parseInt(xIn.value);
                let y = parseInt(yIn.value);
                let z = parseInt(zIn.value);
                
                if (!isNaN(x) && !isNaN(y) && !isNaN(z)){
                    if (x > 0 && y > 0 && z > 0 && x <= matrix[0][0].length && y <= matrix[0].length && z <= matrix.length){
                        lastValid.x = x;
                        lastValid.y = y;
                        lastValid.z = z;
                        x--;
                        y--;
                        z--;
                        for (let i =0; i < selected.length; i++){
                            selected[i].classList.remove("selected");
                        }
                        if (xCheck.checked || yCheck.checked || zCheck.checked){
                            selected = [];
                            let xBegin = xCheck.checked ? x : 0;
                            let xEnd = xCheck.checked ? x+1 : matrix[0][0].length;
                            let yBegin = yCheck.checked ? y : 0;
                            let yEnd = yCheck.checked ? y+1 : matrix[0].length;
                            let zBegin = zCheck.checked ? z : 0;
                            let zEnd = zCheck.checked ? z+1 : matrix.length;

                            for (let i = xBegin; i < xEnd; i++){
                                for(let j = yBegin; j < yEnd; j++){
                                    for(let k = zBegin; k < zEnd; k++){
                                        selected.push(that.cells[k][j][i].inner);
                                        that.cells[k][j][i].inner.classList.add("selected");
                                    }
                                }
                            }
                        }
                        
                    }
                    else{
                        xIn.value = lastValid.x;
                        yIn.value = lastValid.y;
                        zIn.value = lastValid.z;
                    }
                }
                else{
                    xIn.value = lastValid.x;
                    yIn.value = lastValid.y;
                    zIn.value = lastValid.z;
                }
            }

            xCheck.onchange = event=>{
                if (event.target.checked){
                    xIn.removeAttribute("disabled");
                }
                else{
                    xIn.setAttribute("disabled",true);
                }
                coordChange();
            };
            yCheck.onchange = event=>{
                if (event.target.checked){
                    yIn.removeAttribute("disabled");
                }
                else{
                    yIn.setAttribute("disabled",true);
                }
                coordChange();
            };
            zCheck.onchange = event=>{
                if (event.target.checked){
                    zIn.removeAttribute("disabled");
                }
                else{
                    zIn.setAttribute("disabled",true);
                }
                coordChange();
            };

            xIn.onchange = coordChange;
            yIn.onchange = coordChange;
            zIn.onchange = coordChange;
        }
        

        let x = matrix[0].length;
        let y = matrix[0][0].length;
        let z = matrix.length;

        let cube = document.createElement("div");//parent of the cells

        cube.classList.add("cube");
        container.appendChild(cube);

        //getting largest dimension for appropriate 'cube zoom level' (amt of pixels for transform:translateZ())
        let max = Math.max(x,y,z); 

        let distBtwn = this.cellSize*1.8;// pixels between each node/cell

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
                    that.cells[i][j][k].inner.style.width = this.cellSize+"px";
                    that.cells[i][j][k].inner.style.height = this.cellSize+"px";

                    that.cells[i][j][k].outer.classList.add("node");

                    that.cells[i][j][k].outer.style.left = (250-(this.cellSize/2))+"px";
                    that.cells[i][j][k].outer.style.top = (250-(this.cellSize/2))+"px";

                    //setting style of elements of the front-face
                    if (i == 0){
                        that.cells[i][j][k].inner.classList.add("front");
                    }
                    

                    that.cells[i][j][k].outer.style.userSelect = "none";
                    that.cells[i][j][k].outer.setAttribute("draggable",false);
                    //that.cells[i][j][k].outer.onclick = event=>{console.log(matrix[i][j][k]);}
                    that.cells[i][j][k].inner.setAttribute("title",matrix[i][j][k].toLocaleString(undefined, { maximumFractionDigits: 5 }));

                    let x = ((k*distBtwn-adjK));
                    let y = ((j*distBtwn-adjJ));
                    let z = (-(i*distBtwn-adjI));

                    that.cells[i][j][k].pos.radxz = Math.sqrt(x*x+z*z);
                    that.cells[i][j][k].pos.radyz = Math.sqrt(y*y+z*z);

                    that.cells[i][j][k].pos.x = x;
                    that.cells[i][j][k].pos.y = y;
                    that.cells[i][j][k].pos.z = z;
                    that.cells[i][j][k].outer.style.transform = "translate3d("+x+"px,"+y+"px,"+z+"px)";

                    cube.appendChild(that.cells[i][j][k].outer);
                    
                }
            }
        }
        //object to handle zoom level
        let zoom = {};
        zoom.value = max*-160+480;
        zoom.default = zoom.value;
        zoom.add = function(amt){
            let newAmt = this.value + amt;
            if (newAmt > 700){
                newAmt = 700;
            }
            if (newAmt < -2000){
                newAmt = -2000;
            }
            this.value = newAmt;
            cube.style.transform = "translateZ("+this.value+"px)";
        };
        zoom.reset = function(){
            this.value = this.default;
            cube.style.transform = "translateZ("+this.value+"px)";
        }
        cube.style.transform = "translateZ("+zoom.value+"px)";
        let resetViewBtn = document.createElement("button");
        resetViewBtn.innerHTML = "Reset View";
        resetViewBtn.classList.add("reset-view-btn");

        let rotateVisual = function(radX,radY){
            let rotMatX =[[1,0,0],[0,Math.cos(radX),-Math.sin(radX)],[0,Math.sin(radX),Math.cos(radX)]]; //rotationX matrix

            let rotMatY = [[Math.cos(radY),0,Math.sin(radY)],[0,1,0],[-Math.sin(radY),0,Math.cos(radY)]]; //rotationY matrix
            
            for (let i = 0; i < that.cells.length;i++){
                for (let j =0; j < that.cells[0].length;j++){
                    for (let k = 0; k < that.cells[0][0].length; k++){

                        

                        let coords = [[that.cells[i][j][k].pos.x],[that.cells[i][j][k].pos.y],[that.cells[i][j][k].pos.z]]

                        let result = dotProduct(rotMatX,dotProduct(rotMatY,coords));
                        

                        that.cells[i][j][k].outer.style.transform = "translate3d("+result[0][0]+"px,"+result[1][0]+"px,"+result[2][0]+"px)";
                    }
                }
            }
        }
        //resets the viewport zoom & rotation
        resetViewBtn.onclick = event=>{
            zoom.reset();
            rot.x = 0;
            rot.y = 0;
            rotateVisual(0,0);
        };

        //zoom in/out buttons
        let zoomOutBtn = document.createElement("button");
        zoomOutBtn.innerHTML = "-";
        let zoomInBtn = document.createElement("button");
        zoomInBtn.innerHTML = "+";
        zoomInBtn.classList.add("zoom-in-btn");
        zoomOutBtn.classList.add("zoom-out-btn");
        that.container.onwheel = event=>{
            zoom.add(-event.deltaY);
            event.preventDefault();
        };
        zoomInBtn.onclick = event=>{
            zoom.add(80);
        };
        zoomOutBtn.onclick = event=>{
            zoom.add(-80);
        };
        container.appendChild(resetViewBtn);
        container.appendChild(zoomInBtn);
        container.appendChild(zoomOutBtn);
        ///////////////////
        
        let rot = {x:0,y:0};//stores radians of x and y axis
        let lastPos = {x:0,y:0};

        /**Gets the distance the mouse moved compared to the last time this fcn was called.
         * Then, it calls a rotation on the visual, based on that distance
         * Mouse movement in the x axis corresponds to viewport rotations in the y axis and vice versa
         */
        let updateFcn = event=>{
            //amount moved since previous call
            let xAmt = (event.pageX - lastPos.x);
            let yAmt = (event.pageY - lastPos.y);
            lastPos.x = event.pageX;
            lastPos.y = event.pageY;

            //mouse movement x axis maps to viewport rotation y axis
            let radY = rot.y + 0.01 * xAmt;
            let radX;
            let newX = rot.x + 0.01 * -yAmt;
            if (newX > Math.PI/2){
                radX = Math.PI/2
            }
            else if( newX < -Math.PI/2){
                radX = -Math.PI/2
            }
            else{
                radX = newX;
            }
            //store current rotation values
            rot.x = radX;
            rot.y = radY;

            rotateVisual(radX,radY);
        };
        
        /**Binds the mousedown event of the visual container */
        that.container.onmousedown = event=>{
            lastPos.x = event.pageX; 
            lastPos.y = event.pageY;
            
            window.onmousemove = updateFcn;
            //unset mousemove after user releases the mouse
            window.onmouseup = event=>{window.onmousemove = undefined;}
        }
    
    }
    /**Non-destructive */
    add(matrix){
        if (matrix.data.length == this.data.length && matrix.data[0].length == this.data[0].length && matrix.data[0][0].length == this.data[0][0].length){
            let result = new Matrix(this.data[0].length, this.data[0][0].length, this.data.length);
            for(let i = 0; i < this.data.length; i++){
                for (let j = 0; j < this.data[0].length; j++){
                    for(let k = 0; k < this.data[0][0].length; k++){
                        result.data[i][j][k] = this.data[i][j][k] + matrix.data[i][j][k];
                    }
                }
            }
            return result;
        }
    }
    /**Non-destructive */
    subtract(matrix){
        if (matrix.data.length == this.data.length && matrix.data[0].length == this.data[0].length && matrix.data[0][0].length == this.data[0][0].length){
            let result = new Matrix(this.data[0].length, this.data[0][0].length, this.data.length);
            for(let i = 0; i < this.data.length; i++){
                for (let j = 0; j < this.data[0].length; j++){
                    for(let k = 0; k < this.data[0][0].length; k++){
                        result.data[i][j][k] = this.data[i][j][k] - matrix.data[i][j][k];
                    }
                }
            }
            return result;
        }
    }
    /**Non-destructive returns a matrix on success, false otherwise*/
    multiply(matrix){
        if (matrix.data.length == this.data.length){
            let result = new Matrix(1, 1, this.data.length);
            for (let i = 0; i < this.data.length; i++){
                result.data[i] = dotProduct(this.data[i], matrix.data[i]);
            }
            return result;
        }
        else{
            return false;
        }
    }
    /**Non-destructive */
    divide(matrix){
        let noZeros = true;
        for (let i = 0; i < matrix.data.length && noZeros; i++){
            for (let j = 0; j < matrix.data[0].length && noZeros; j++){
                for (let k = 0; k < matrix.data[0][0].length && noZeros; k++){
                    noZeros = noZeros && matrix.data[i][j][k] != 0;
                }
            }
        }
        if (noZeros){
            if (matrix.data.length == this.data.length){
                let result = new Matrix(matrix.data[0].length, matrix.data[0][0].length, matrix.data.length);
                for (let i = 0; i < this.data.length; i++){
                    for (let j = 0; j < this.data[0].length; j++){
                        for (let k = 0; k < this.data[0][0].length; k++){
                            result.data[i][j][k] = this.data[i][j][k]/matrix.data[i][j][k];
                        }
                    }
                }
                return result;
            }
        }
        else{
            return false;
        }
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


/**Returns a pageManager object
 * manages dynamic pages within the html page
 * takes html element IDs as arguments
 * expects arguments.length > 0*/
 function PageManager(){
    let that = {};
    that.pages = [];
    {
        //check if one of the given pages are active
        let activeExists = false;

        for (let i = 0; i < arguments.length; i++){
            let arg = document.getElementById(arguments[i]);
            if (arg){
                if (arg.classList.contains("active")){
                    activeExists = true;
                }
                that.pages.push(arg);
            }
            else{
                console.log("ID: \""+arguments[i] +"\" not found!");
            }
        }

        if (!activeExists){
            that.pages[0].classList.add("active");
        }
    }
    /**takes an html ID and swaps the page to it
    returns true if the pageID exists in this pageManager, false otherwise
    */
    that.goToPage = function(pageID){
        let result = false;
        for (let i = 0; i < this.pages.length; i++){
            if (this.pages[i].id != pageID){
                this.pages[i].classList.remove("active");
            }
            else{
                this.pages[i].classList.add("active");
                result = true;
            }
        }
        return result;
    }
    return that;
}