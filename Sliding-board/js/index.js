var board;
const RUNS = -1;//set as int > 0 to set the amt of randomization runs
window.onload = function(){
    board = new gameManager();
}

function createGame(){
    let size = parseInt(document.getElementById("boardSize").value);
    if (size >= 4 && size <= 8){
        if (Number.isInteger(size)){
            board.newGame(size);
        }
    }
    else{
        alert("Board size must be between 4 & 8 (inclusive)");
    }
}

var gameStatus = {
    CLEAR:0,
    ONGOING:1,
    FINISHED:2
}

/**Manages interactions with the game board */
class gameManager{
    constructor(){
        this.status = gameStatus.CLEAR;
    }
    newGame(size){
        this.moves = 0;
        this.ui = new gameUI();
        this.board = new gameBoard(size, this.ui);
        this.board.randomize();
        this.ui.loadBoard(this.board.getPositions(), size);
        this.status = gameStatus.ONGOING;
        return true;
    }
    movePiece(num){
        if (this.status == gameStatus.ONGOING){
            let result = this.board.move(num);
            if (result){
                this.moves++;
                if (this.board.checkVictory()){
                    this.status = gameStatus.FINISHED;
                    this.ui.victory(this.moves);
                }
                return true;
            }
        }
        return false;
    }
    demo(){
        let size = 4;
        this.moves = 0;
        this.ui = new gameUI();
        this.board = new gameBoard(size, this.ui);
        this.board.demo();
        this.ui.loadBoard(this.board.getPositions(), size);
        this.status = gameStatus.ONGOING;
        return true;
    }
}

/**Game ui */
class gameUI{
    constructor(){
        //this.sizeRoot = size;
        this.board = document.getElementById("gameBoard");
        this.data = [];
        this.margin = 2;//px on all sides, < itemWidth/2
        this.borderPercent = 0.07; // < 0.5
    }

    update(num, newPos){
        num--;
        let row = Math.floor(num/this.sizeRoot);
        let col = num % this.sizeRoot;
        let newRow = Math.floor(newPos/this.sizeRoot);
        let newCol = newPos % this.sizeRoot;
        this.data[row][col].style.left = (this.itemWidth*newCol+this.margin)+"px";
        this.data[row][col].style.top = (this.itemHeight*newRow+this.margin)+"px";
        this.data[row][col].position_ = newPos;
    }
    victory(totalMoves){
        for (let x = 0; x < this.sizeRoot; x++){
            for (let y = 0; y < this.sizeRoot; y++){
                this.data[x][y].classList.add("victory");
                this.data[x][y].removeEventListener("click", this.data[x][y].clickListn_);
                this.data[x][y].classList.remove("even","odd");
                this.data[x][y].classList.add(this.data[x][y].position_%2 == 0? "even":"odd");
            }
        }
        document.getElementById("msg").innerHTML = "Victory! <u>"+totalMoves+"</u> moves made";
    }
    /**Positions: each index represents a number block, each element at a given index is the number block's position. Size is the width/height of the board*/
    loadBoard(positions, size){
        this.sizeRoot = size;
        this.blank = (size*size)-1;
        this.itemWidth = (this.board.offsetWidth/size);
        this.itemHeight = (this.board.offsetHeight/size);

        document.getElementById("msg").innerHTML = "";
        this.board.innerHTML = "";
        this.data = [];
        for (let x = 0; x < this.sizeRoot; x++){
            this.data.push([]);
            for (let y = 0; y < this.sizeRoot; y++){
                let num = (x*this.sizeRoot)+y+1;

                this.data[x].push(document.createElement("div"));
                this.data[x][y].style.width = this.itemWidth-(this.margin*2)+"px";
                this.data[x][y].style.left = (this.itemWidth*(positions[num-1]%this.sizeRoot)+this.margin)+"px";
                this.data[x][y].style.height = this.itemHeight-(this.margin*2)+"px";
                this.data[x][y].style.top = (this.itemHeight*(Math.floor(positions[num-1]/this.sizeRoot))+this.margin)+"px";

                this.data[x][y].style.borderWidth = ((this.itemWidth-(this.margin*2))*this.borderPercent)+"px";
                
                this.data[x][y].classList.add("board-piece", ((x*this.sizeRoot+y)%2 == 0 ? "even":"odd"));
                this.board.appendChild(this.data[x][y]);

                let inner = document.createElement("div");
                inner.style.fontSize = Math.floor(this.itemWidth * 0.4)+"px";
                inner.title = num;
                inner.classList.add("board-piece-inner");

                //store pos
                this.data[x][y].position_ = positions[num-1];
                
                inner.innerHTML = num;
                this.data[x][y].appendChild(inner);

                //TODO speed up anims using .style.transition:none and maybe using ontransition end to remove transition:none (.style.transition = "")
                this.data[x][y].clickListn_ = event =>{ 
                    //check if we can make a move
                    if (!board.movePiece(num)){
                        let bob = event.target;
                        event.target.classList.remove("shake");
                        window.requestAnimationFrame(function(time) {
                            window.requestAnimationFrame(function(time) {
                              bob.classList.add("shake");
                            });
                          });
                    }
                };
                //click handler
                this.data[x][y].addEventListener("click", this.data[x][y].clickListn_);
            }
        }
        this.data[this.sizeRoot-1][this.sizeRoot-1].setAttribute("hidden",true);
    }
}

/**Contains numbers 1 to size that have positions 0 to size-1 */
class gameBoard{
    constructor(size, obs=null){
        this.sizeRoot = size;//sqrRoot of the board size
        this.positions = [];// the index represents the tile number-1, the data in the array represents the position
        //final index represents a blank spot
        this.blank = size * size - 1;
        this.obs = obs;
        //for (let x = this.blank; x >= 0; x--){
       //     this.positions.push(x);
        //}

        for (let x = 0; x <= this.blank; x++){
           this.positions.push(x);
        }
    }
    /** */
    move(num){

        if (num < 1 || num > this.blank){
            return false;
        }
        let i = num-1;
        let left = this.positions[i] - 1 == this.positions[this.blank] && this.positions[i] % this.sizeRoot != 0;
        let right = this.positions[i] + 1 == this.positions[this.blank] && this.positions[this.blank] % this.sizeRoot != 0;
        let up = this.positions[i] + this.sizeRoot == this.positions[this.blank];
        let down = this.positions[i] - this.sizeRoot == this.positions[this.blank];
        //check above valid
        if (left || right || up || down){
                let temp = this.positions[i];
                this.positions[i] = this.positions[this.blank];
                this.positions[this.blank] = temp;
                this.obs.update(num, this.positions[i]);
                return true;
        }
        return false;
    }
    randomize(){
        let total = this.sizeRoot * this.sizeRoot;
        let data = []//index represents position, data in the array represents the tile number-1
        for (let i = 0; i < total; i++){
            data[this.positions[i]] = i;
        }

        let blankI = this.positions[this.blank];
        let amt = RUNS > 0 ? RUNS : total *4 + Math.floor(total * (Math.random()*100)/100);//amt of randomization////////////////////////////////////////
        //console.log(amt);//report amount of runs
        let previous = 1;//0:up 1:right 2:down 3:left
        for (let i = 0; i < amt; i++){
            let pool = [];
            if (previous != 2 && blankI - this.sizeRoot >= 0){
                pool.push(0);
            }
            if (previous != 3 && blankI % this.sizeRoot != this.sizeRoot-1){
                pool.push(1);
            }
            if (previous != 0 && blankI + this.sizeRoot < total){
                pool.push(2);
            }
            if (previous != 1 && blankI % this.sizeRoot != 0){
                pool.push(3);
            }
            let dir = pool[Math.floor(Math.random() * pool.length)];

            previous = dir;

            if (dir == 0){
                let temp = data[blankI-this.sizeRoot];
                data[blankI-this.sizeRoot] = data[blankI];
                data[blankI] = temp;
                blankI -= this.sizeRoot;
            }
            if (dir == 1){
                let temp = data[blankI+1];
                data[blankI+1] = data[blankI];
                data[blankI] = temp;
                ++blankI;
            }
            if (dir == 2){
                let temp = data[blankI+this.sizeRoot];
                data[blankI+this.sizeRoot] = data[blankI];
                data[blankI] = temp;
                blankI += this.sizeRoot;
            }
            if (dir == 3){
                let temp = data[blankI-1];
                data[blankI-1] = data[blankI];
                data[blankI] = temp;
                --blankI;
            }
        }
        for (let i = 0; i < data.length; i++){
            this.positions[data[i]] = i;
        }
    }
    demo(){
        this.positions = [15,14,13,12,11,6,9,8,7,5,4,3,2,1,0,10];
    }
    getPositions(){
        return this.positions;
    }
    checkVictory(){
        let result = true;
        //check that every position (except the blank) is more than next element
        for (let i = 0; i < this.positions.length-2 && result; i++){
            result = result && this.positions[i] > this.positions[i+1];
        }
        return result;
    }
}


