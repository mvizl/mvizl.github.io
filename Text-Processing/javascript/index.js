var ENCODEMODE = {ASCII:0,EBCDIC: 1}


var ref = null; //////////////////////////////////for testing only

//testing strings
var strs = ["\u0000TESTING\u007F","123456789","abcdefgh","babaganoush","wilfred","wilson","tom-hanks<strong>test</strong>","CETHMOC","Hello World!","racecar","tacocat"];

////////////////Data for char conversion///////////////////
//var asciiStrControls = ["NUL","SOH","STX","ETX","EOT","ENQ","ACK","BEL","BS","HT","LF","VT","FF","CR","SO","SI","DLE","DC1","DC2","DC3","DC4","NAK","SYN","ETB","CAN","EM","SUB","ESC","FS","GS","RS","US"," ","!","\"","#","$","%","&","\'","(",")","*","+",",","-",".","/","0","1","2","3","4","5","6","7","8","9",":",";","<","=",">","?","@","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","[","\\","]","^","_","\`","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","{","|","}","~","DEL"];
var utfCTRLToStr = {"\u0000":"NUL","\u0001":"SOH","\u0002":"STX","\u0003":"ETX","\u0004":"EOT","\u0005":"ENQ","\u0006":"ACK","\u0007":"SEL","\u0008":"BS","\u0009":"HT","\u000A":"LF","\u000B":"VT","\u000C":"FF","\u000D":"CR","\u000E":"SO","\u000F":"SI","\u0010":"DLE","\u0011":"DC1","\u0012":"DC2","\u0013":"DC3","\u0014":"DC4","\u0015":"NAK","\u0016":"SYN","\u0017":"ETB","\u0018":"CAN","\u0019":"EM","\u001A":"SUB","\u001B":"ESC","\u001C":"FS","\u001D":"GS","\u001E":"RS","\u001F":"US","\u0020":"SPACE","\u007F":"DEL"};
var utfCTRLToPic = {"\u0000":"␀","\u0001":"␁","\u0002":"␂","\u0003":"␃","\u0004":"␄","\u0005":"␅","\u0006":"␆","\u0007":"␇","\u0008":"␈","\u0009":"␉","\u000A":"␊","\u000B":"␋","\u000C":"␌","\u000D":"␍","\u000E":"␎","\u000F":"␏","\u0010":"␐","\u0011":"␑","\u0012":"␒","\u0013":"␓","\u0014":"␔","\u0015":"␕","\u0016":"␖","\u0017":"␗","\u0018":"␘","\u0019":"␙","\u001A":"␚","\u001B":"␛","\u001C":"␜","\u001D":"␝","\u001E":"␞","\u001F":"␟","\u0020":"␠","\u007F":"␡"};
var ascii = ["\u0000","\u0001","\u0002","\u0003","\u0004","\u0005","\u0006","\u0007","\u0008","\u0009","\u000A","\u000B","\u000C","\u000D","\u000E","\u000F","\u0010","\u0011","\u0012","\u0013","\u0014","\u0015","\u0016","\u0017","\u0018","\u0019","\u001A","\u001B","\u001C","\u001D","\u001E","\u001F","\u0020","!","\"","#","$","%","&","\'","(",")","*","+",",","-",".","/","0","1","2","3","4","5","6","7","8","9",":",";","<","=",">","?","@","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","[","\\","]","^","_","\`","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","{","|","}","~","\u007F","€","","‚","ƒ","„","…","†","‡","ˆ","‰","Š","‹","Œ","","Ž","","","‘","’","“","”","•","–","—","˜","™","š","›","œ","","ž","Ÿ"," ","¡","¢","£","¤","¥","¦","§","¨","©","ª","«","¬","­","®","¯","°","±","²","³","´","µ","¶","·","¸","¹","º","»","¼","½","¾","¿","À","Á","Â","Ã","Ä","Å","Æ","Ç","È","É","Ê","Ë","Ì","Í","Î","Ï","Ð","Ñ","Ò","Ó","Ô","Õ","Ö","×","Ø","Ù","Ú","Û","Ü","Ý","Þ","ß","à","á","â","ã","ä","å","æ","ç","è","é","ê","ë","ì","í","î","ï","ð","ñ","ò","ó","ô","õ","ö","÷","ø","ù","ú","û","ü","ý","þ","ÿ"];

var charToAsciiCode = {};
for (let i = 0; i < ascii.length; i++){
    charToAsciiCode[ascii[i]] = i;
}
//for control chars, has utf code if the control char exists in utf
var ebcdic = {  "00":"\u0000","01":"\u0001","02":"\u0002", "03":"\u0003", "04":"\u0007","05":"\u0009","06":"RNL","07":"\u007F","08":"GE","09":"SPS","0A":"RPT","0B":"\u000B","0C":"\u000C","0D":"\u000D","0E":"\u000E","0F":"\u000F",
                "10":"\u0010","11":"\u0011","12":"\u0012","13":"\u0013","14":"RES/ENP","15":"NL","16":"\u0008","17":"POC","18":"\u0018","19":"\u0019","1A":"UBS","1B":"CU1","1C":"IFS","1D":"IGS","1E":"IRS","1F":"IUS/ITB",
                "20":"DS","21":"SOS","22":"\u001C","23":"WUS","24":"BYP/INP","25":"\u000A","26":"\u0017","27":"\u001B","28":"SA","29":"SFE","2A":"SM/SW","2B":"CSP","2C":"MFA","2D":"\u0005","2E":"\u0006","2F":"BEL",
                "32":"\u0016","33":"IR","34":"PP","35":"TRN","36":"NBS","37":"\u0004","38":"SBS","39":"IT","3A":"RFF","3B":"CU3","3C":"\u0014","3D":"\u0015","3F":"\u001A",
                "40":"SP","4A":"¢","4B":".","4C":"<","4D":"(","4E":"+","4F":"|",
                "50":"&","5A":"!","5B":"$","5C":"*","5D":")","5E":";","5F":"¬",
                "60":"-","61":"/","6A":"¦","6B":",","6C":"%","6D":"_","6E":">","6F":"?",
                "79":"`","7A":":","7B":"#","7C":"@","7D":"'","7E":"=","7F":'"',
                "81":"a","82":"b","83":"c","84":"d","85":"e","86":"f","87":"g","88":"h","89":"i","8F":"±",
                "91":"j","92":"k","93":"l","94":"m","95":"n","96":"o","97":"p","98":"q","99":"r",
                "A1":"~","A2":"s","A3":"t","A4":"u","A5":"v","A6":"w","A7":"x","A8":"y","A9":"z",
                "B1":"^","BA":"[","BB":"]",
                "C0":"{","C1":"A","C2":"B","C3":"C","C4":"D","C5":"E","C6":"F","C7":"G","C8":"H","C9":"I",
                "D0":"}","D1":"J","D2":"K","D3":"L","D4":"M","D5":"N","D6":"O","D7":"P","D8":"Q","D9":"R",
                "E0":"\u005c","E2":"S","E3":"T","E4":"U","E5":"V","E6":"W","E7":"X","E8":"Y","E9":"Z",
                "F0":"0","F1":"1","F2":"2","F3":"3","F4":"4","F5":"5","F6":"6","F7":"7","F8":"8","F9":"9","FF":"EO"};

var charToEbcdicCode = {};
{
    let keys = Object.keys(ebcdic);
    for (let i = 0; i < keys.length; i++){
        charToEbcdicCode[ebcdic[keys[i]]] = keys[i];
    }
}
///////////////////////////////////////////////////////////

/**test fcn - adds strings of 68000 length */
function addLongStrings(amt){
    let len = strs.length;
    for (let j = 0; j < amt; j++){
        strs.push("");
        for (let i = 0; i < 68000; i++){
        strs[len+j] += String.fromCharCode((Math.random()* 58)+65);//(Math.random()* 127)+0);
    }}
}

window.onload = function(){
    {
        //creating ASCII table
        let mContent = document.getElementById("asciiTable"); //ascii table container
        mContent.innerHTML = "";
        let div = document.createElement("div");
        div.innerHTML = "Extended ASCII Table"
        mContent.appendChild(div);
        div.classList.add("ascii-header");
            let portions = 16;
            let amt = Math.floor(ascii.length/portions);
            for (let div = 0; div < portions; div++){
                let tb = document.createElement("table");
                mContent.appendChild(tb);
                tb.style.display = "inline-table";
                tb.classList.add("table2");
                let tr = document.createElement("tr");
                th1 = document.createElement("th");
                th2 = document.createElement("th");
                th1.innerHTML = "Num";
                th2.innerHTML = "Char";
                tr.appendChild(th1);
                tr.appendChild(th2);
                tb.appendChild(tr);
                for (let i = div*amt; i < (div+1)*amt; i++){
                    let tr = document.createElement("tr");
                    let td1 = document.createElement("td");
                    let td2 = document.createElement("td");
                    td1.innerHTML = ("0000"+i).slice(-4);
                    if (ascii[i] in utfCTRLToStr)
                        td2.innerHTML = utfCTRLToStr[ascii[i]]
                    else
                        td2.innerHTML = ascii[i];
                    tr.appendChild(td1);
                    tr.appendChild(td2);
                    tb.appendChild(tr);
                }
                
            }
            if (portions*amt != ascii.length){
                let tb = document.createElement("table");
                mContent.appendChild(tb);
                tb.style.display = "inline-table";
                tb.classList.add("table2");
                let tr = document.createElement("tr");
                th1 = document.createElement("th");
                th2 = document.createElement("th");
                th1.innerHTML = "Num";
                th2.innerHTML = "Char";
                tr.appendChild(th1);
                tr.appendChild(th2);
                tb.appendChild(tr);
                for (let i = (portions)*amt; i < ascii.length; i++){
                    let tr = document.createElement("tr");
                        let td1 = document.createElement("td");
                        let td2 = document.createElement("td");
                        td1.innerHTML = i;
                        td2.innerHTML = ascii[i];
                        tr.appendChild(td1);
                        tr.appendChild(td2);
                        tb.appendChild(tr);
                }
            }
    }

    {
        //creating ebcdic table
        
        let ebcTbl = document.getElementById("ebcdicTable"); //ascii table container
        ebcTbl.innerHTML = "";
        let div = document.createElement("div");
        ebcTbl.appendChild(div);
        div.innerHTML = "<u>EBCDIC Table</u> (Hover over to view hex value)";
        div.classList.add("ebc-header");
        let tb = document.createElement("table");
        tb.style.margin = "auto";
        let thead = document.createElement("thead");
        tb.classList.add("ebc-tbl");
        ebcTbl.appendChild(tb);
        let headerRow = document.createElement("tr");
        thead.appendChild(headerRow);
        tb.appendChild(thead);
        headerRow.appendChild(document.createElement("th"));
        for (let i = 0; i < 16; i++){
            let th = document.createElement("th");
            th.innerHTML = "_"+(i).toString(16).toUpperCase();
            headerRow.appendChild(th);
            if (i % 2 ==0){
                th.classList.add("even1");
            }
        }
        let tbody = document.createElement("tbody");
        tb.appendChild(tbody);
        for (let i = 0; i < 16; i++){
            let row = document.createElement("tr");
            tbody.appendChild(row);
            let th = document.createElement("th");
            th.innerHTML = (i).toString(16).toUpperCase()+"_";
            row.appendChild(th);
            if (i % 2 ==0){
                th.classList.add("even1");
            }
            for (let j = 0; j < 16; j++){
                let key = (i).toString(16).toUpperCase()+(j).toString(16).toUpperCase();
                let td = document.createElement("td");
                
                row.appendChild(td);
                if (key in ebcdic){
                    let tooltip = document.createElement("span");
                    let tooltext = document.createElement("span");
                    tooltext.classList.add("tooltextup","tooltiptext");
                    tooltip.classList.add("tooltip");
                    tooltext.innerHTML = key;
                    if (ebcdic[key] in utfCTRLToStr)
                        tooltip.innerHTML = utfCTRLToStr[ebcdic[key]];
                    else
                        tooltip.innerHTML = ebcdic[key];
                    tooltip.style.display = "block";
                    tooltip.appendChild(tooltext);
                    td.appendChild(tooltip);
                }
                if (i % 2 ==0){
                    td.classList.add("even1");
                }
                if (j % 2 ==0){
                    td.classList.add("even2");
                }
            }
        }

    }

    {
        // Get the modal
        var modal = document.getElementById("modalWindow");

        // Get the <span> element that closes the modal
        var span = document.getElementsByClassName("close")[0];

        let asciiBtn = document.getElementById("asciiModal");

        asciiBtn.onclick = function(){
            document.getElementById("asciiTable").style.display = "block";
            document.getElementById("ebcdicTable").style.display = "none";
            modal.style.display = "block";
        }

        let ebcdicBtn = document.getElementById("ebcdicModal");

        ebcdicBtn.onclick = function(){
            document.getElementById("asciiTable").style.display = "none";
            document.getElementById("ebcdicTable").style.display = "block";
            modal.style.display = "block";
        }

        // When the user clicks on <span> (x), close the modal
        span.onclick = function() {
            modal.style.display = "none";
        }

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
    }

    {
        let mainPage =PageManager("mainPage1","mainPage2");
        let p1Subpage = PageManager("mP1Sub1","mP1Sub2","mP1Sub3");
        document.getElementById("pageSwap").onclick = ()=>{mainPage.goToPage("mainPage1"); p1Subpage.goToPage("mP1Sub1");};
    }

    var app = StrInputWidget();
    app.init();

 ref= app;
    
}

/**Returns the app controller */
function StrInputWidget(){
    let that = {};
    that.strs = [];
    that.strLengths = [];
    that.strAmt = 0;
    that.curr = 0; //index+1 of current string to apply changes to
    that.mainPage = PageManager("mainPage1","mainPage2");
    that.p1Subpage = PageManager("mP1Sub1","mP1Sub2","mP1Sub3");
    that.chartA = null;
    that.chartB = null;
    that.chartC = null;
    that.chartD = null;
    that.encodeMode = ENCODEMODE.ASCII;
    that.setStringTotal = function(amt){
        this.strLengths = [];
        this.strs = [];
        this.strAmt = amt;
        this.curr = 1;
        document.getElementById("strLenCurr").innerHTML = this.curr;
        document.getElementById("strLenRemain").innerHTML = this.strAmt - this.curr+1;
        this.p1Subpage.goToPage("mP1Sub2");
        //prevent animation from occurring on first view of length input
        document.getElementById("strLenIn").classList.remove("flash");
    }
    that.addStrLen = function(len, applyToRemaining=false){
        if (applyToRemaining){
            for (let i = this.curr; i <= this.strAmt;i++){
                this.strLengths.push(len);
            }
        }
        else{
            this.strLengths.push(len);
            this.curr++;
            document.getElementById("strLenCurr").innerHTML = this.curr;
            document.getElementById("strLenRemain").innerHTML = this.strAmt - this.curr+1;
        }
        if (this.curr > this.strAmt || applyToRemaining){
            this.curr = 1;
            document.getElementById("strDataCurr").innerHTML = this.curr +"/"+this.strAmt;
            this.textAreaChanged();
            this.p1Subpage.goToPage("mP1Sub3");
        }
    }
    /**returns true or an error message */
    that.addString = function(){
        let inputWidget = document.getElementById("strDataIn");
        let errMsgWidget = document.getElementById("submitStrDataErr");
        let str = strDataIn.value;
        inputWidget.classList.remove("flash");
        errMsgWidget.parentElement.style.maxHeight = null;

        
        let displayErr = function(errMsg){
            window.requestAnimationFrame(function(time) {
                window.requestAnimationFrame(function(time) {
                    inputWidget.classList.add("flash");
                });
            });
            errMsgWidget.innerHTML = errMsg;
            errMsgWidget.parentElement.style.maxHeight = errMsgWidget.parentElement.scrollHeight + "px";
        }
        
        if (str.length > this.strLengths[this.curr-1]){
            displayErr("String exceeded length!");
        }
        else if (str.search(/[0-9]/) == -1){
            displayErr("String missing numeric character!");
        }
        else if (str.search(/[a-zœšžà-öø-ÿ]/) == -1){
            displayErr("String missing lowercase character!");
        }
        else if (str.search(/[A-ZŠŽŸÀ-ÖØ-ß]/) == -1){
            displayErr("String missing uppercase character!");
        }
        else if (str.search(/(\!|\"|\#|\$|\&|\'|\(|\)|\,|\.|\:|\;|\?|\@|\[|\]|\^|\_|\`|\{|\||\}|\~|[\u00A0-¿‰‘-″™€ƒ‚])/) == -1){
            displayErr("String missing punctuation character!");
        }
        else if (str.search(/(\-|\+|\*|\/|\%|\÷|\√|\±|\∓|\·|\×|\=|\>|\<)/) == -1){
            displayErr("String missing arithmetic character!");
        }
        else{
            that.strs.push(str);
            this.curr++;
            document.getElementById("strDataCurr").innerHTML = this.curr +"/"+this.strAmt;
            this.textAreaChanged();
            if (this.curr > this.strAmt){
                this.displayData();
                this.mainPage.goToPage("mainPage2");
            }
        }
    }
    that.textAreaChanged = function(){
        let strlen = document.getElementById("strDataIn").value.length;
        let output = document.getElementById("charsUsed");
        output.value = strlen +"/"+
        this.strLengths[this.curr-1];
        if (strlen > this.strLengths[this.curr-1]){
            output.classList.add("err-border");
        }
        else{
            output.classList.remove("err-border");
        }
    }
    that.init = function(){
        this.bindInput();
    }
    
    that.bindInput = function(){
        let controller = this;
        ////////////////////Subpage1////////////////////////
        document.getElementById("submitStrAmt").onclick = ()=>{
            let inputWidget = document.getElementById("strAmtIn");
            let strAmt = parseInt(inputWidget.value); 
            inputWidget.classList.remove("flash");
            if (isNaN(strAmt)){
                window.requestAnimationFrame(function(time) {
                    window.requestAnimationFrame(function(time) {
                        inputWidget.classList.add("flash");
                    });
                });
            }
            else{
                if (strAmt <= parseInt(inputWidget.max) && strAmt >= parseInt(inputWidget.min)){
                    controller.setStringTotal(strAmt);
                }
                else{
                    alert("Input must be between "+inputWidget.min+" and "+inputWidget.max+" (inclusive)!");
                }
            }
        }
        document.getElementById("submitStrLen").onclick = ()=>{
            let inputWidget = document.getElementById("strLenIn");
            let checkWidget = document.getElementById("applyToRemaining");
            let input = parseInt(inputWidget.value);
            if (isNaN(input)){
                inputWidget.classList.remove("flash");
                window.requestAnimationFrame(function(time) {
                    window.requestAnimationFrame(function(time) {
                        inputWidget.classList.add("flash");
                    });
                });
            }
            else{
                if (input <= parseInt(inputWidget.max) && input >= parseInt(inputWidget.min)){
                    controller.addStrLen(input, checkWidget.checked);
                }
                else{
                    alert("Input must be between "+inputWidget.min+" and "+inputWidget.max+" (inclusive)!");
                }
                
            }
        }
        document.getElementById("submitStrData").onclick = ()=>{
            controller.addString();
        }
        document.getElementById("strDataIn").oninput = ()=>{
            controller.textAreaChanged();
        }
        document.getElementById("slctEncode").onchange = (event)=>{
            let val = parseInt(event.target.value);
            if (val == 1){
                this.encodeMode = ENCODEMODE.EBCDIC;
            }
            else{
                this.encodeMode = ENCODEMODE.ASCII;
            }
            this.updateEncode();
        };
        //////////////////End of Subpage1///////////////////
    }
    that.updateEncode = function(){
        if (this.chartA && this.chartB && this.chartC && this.chartD){

            let appendWithTooltip = getAppendFcn(this.encodeMode);

            ////////////////////////CHART A///////////////////////
            this.chartA.setDraw(function(data,amt,start){
                let container = document.getElementById("strChartA");
                container.innerHTML = "";
                for (let i = start; i < start+amt;i++){
                    let row = document.createElement("tr");
                    let normText = data[i];
                    let revrText = reverseStr(data[i]);
                    let cRevrText = reverseCenterStr(data[i]);
                    let norm = document.createElement("span");
                    norm.classList.add("word");
                    let revr = document.createElement("span");
                    revr.classList.add("word");
                    let cRevr = document.createElement("span");
                    cRevr.classList.add("word");
                    appendWithTooltip(norm, normText);
                    appendWithTooltip(revr, revrText);
                    appendWithTooltip(cRevr, cRevrText);

                    let d1 = document.createElement("td");
                    let d2 = document.createElement("td");
                    let d3 = document.createElement("td");
                    d1.appendChild(norm);
                    d2.appendChild(revr);
                    d3.appendChild(cRevr);
                    row.appendChild(d1);
                    row.appendChild(d2);
                    row.appendChild(d3);
                    container.appendChild(row);
                }
                document.getElementById("chartANav").innerHTML = (start+1)+" - "+(start+amt)+" of "+data.length;
            });
            ////////////////////////////////////////////////////

            ////////////////////////CHART B///////////////////////
            this.chartB.setDraw(function(data,amt,start){
                let container = document.getElementById("strChartB");
                container.innerHTML ="";
                
                for (let i = start; i < amt + start; i++){
                    let row = document.createElement("tr");

                    let d1 = document.createElement("td");
                    let d2 = document.createElement("td");
                    //d1.style.textDecoration = "underline";
                    //d1.style.textDecorationStyle = "dotted";
                    appendWithTooltip(d1,data[i].char);
                    d2.innerHTML = data[i].amt;
                    row.appendChild(d1);
                    row.appendChild(d2);
                    container.appendChild(row);
                    //console.log(keys[i] + " "+amts[keys[i]]);
                }
                document.getElementById("chartBNav").innerHTML = (start+1)+" - "+(start+amt)+" of "+data.length;
            });
            ////////////////////////////////////////////////////

            ////////////////////////CHART C///////////////////////
            this.chartC.setDraw(function(data,amt,start){
                let container = document.getElementById("strChartC");
                container.innerHTML = "";
                for (let i = start; i < start+amt;i++){
                    let row = document.createElement("tr");
                    let newText = asciiNextAll(data[i]);
                    let normText = newText;
                    let revrText = reverseStr(newText);
                    let cRevrText = reverseCenterStr(newText);
                    let norm = document.createElement("span");
                    norm.classList.add("word");
                    let revr = document.createElement("span");
                    revr.classList.add("word");
                    let cRevr = document.createElement("span");
                    cRevr.classList.add("word");
                    appendWithTooltip(norm, normText);
                    appendWithTooltip(revr, revrText);
                    appendWithTooltip(cRevr, cRevrText);

                    let d1 = document.createElement("td");
                    let d2 = document.createElement("td");
                    let d3 = document.createElement("td");
                    d1.appendChild(norm);
                    d2.appendChild(revr);
                    d3.appendChild(cRevr);
                    row.appendChild(d1);
                    row.appendChild(d2);
                    row.appendChild(d3);
                    container.appendChild(row);
                }
                document.getElementById("chartCNav").innerHTML = (start+1)+" - "+(start+amt)+" of "+data.length;
            });
            ////////////////////////////////////////////////////
            ////////////////////////CHART D///////////////////////
            this.chartD.setDraw(function(data,amt,start){
                let container = document.getElementById("strChartD");
                container.innerHTML = "";
                for (let i = start; i < start+amt;i++){
                    let row = document.createElement("tr");
                    let newText = asciiPrevAll(data[i]);
                    let normText = newText;
                    let revrText = reverseStr(newText);
                    let cRevrText = reverseCenterStr(newText);
                    let norm = document.createElement("span");
                    norm.classList.add("word");
                    let revr = document.createElement("span");
                    revr.classList.add("word");
                    let cRevr = document.createElement("span");
                    cRevr.classList.add("word");
                    appendWithTooltip(norm, normText);
                    appendWithTooltip(revr, revrText);
                    appendWithTooltip(cRevr, cRevrText);

                    let d1 = document.createElement("td");
                    let d2 = document.createElement("td");
                    let d3 = document.createElement("td");
                    d1.appendChild(norm);
                    d2.appendChild(revr);
                    d3.appendChild(cRevr);
                    row.appendChild(d1);
                    row.appendChild(d2);
                    row.appendChild(d3);
                    container.appendChild(row);
                }
                document.getElementById("chartDNav").innerHTML = (start+1)+" - "+(start+amt)+" of "+data.length;
            });
            ////////////////////////////////////////////////////
        }
    }
    that.displayData = function(){
        this.createChartA();
        this.createChartB();
        this.createChartC();
        this.createChartD();
        this.updateEncode();
    }
    that.createChartA = function(){
        {
            let iTbl = InteractiveTable(this.strs);
            this.chartA = iTbl;
            //iTbl.update();
            document.getElementById("chartAPrev").onclick = ()=>{iTbl.prev();}
            document.getElementById("chartANext").onclick = ()=>{iTbl.next();}
            document.getElementById("chartAAmt").onchange = (event)=>{
                let inputWidget = event.target;
                let input = parseInt(event.target.value); 
                inputWidget.classList.remove("flash");
                if (isNaN(input) || input > 10 || input < 5){
                    window.requestAnimationFrame(function(time) {
                        window.requestAnimationFrame(function(time) {
                            inputWidget.classList.add("flash");
                        });
                    });
                }
                else{
                    iTbl.setDisplayAmt(input);
                }
            }
        }
        
    }
    that.createChartB = function(){
        {
            let amts = amtOfCharacters(this.strs);
            let iTbl = InteractiveTable(amts);
            this.chartB = iTbl;
            document.getElementById("chartBPrev").onclick = ()=>{iTbl.prev();}
            document.getElementById("chartBNext").onclick = ()=>{iTbl.next();}
            document.getElementById("chartBAmt").onchange = (event)=>{
                let inputWidget = event.target;
                let input = parseInt(event.target.value); 
                inputWidget.classList.remove("flash");
                if (isNaN(input) || input > 10 || input < 5){
                    window.requestAnimationFrame(function(time) {
                        window.requestAnimationFrame(function(time) {
                            inputWidget.classList.add("flash");
                        });
                    });
                }
                else{
                    iTbl.setDisplayAmt(input);
                }
            }
        }
    }
    that.createChartC = function(){
        {
            let iTbl = InteractiveTable(this.strs);
            this.chartC = iTbl;

            document.getElementById("chartCPrev").onclick = ()=>{iTbl.prev();}
            document.getElementById("chartCNext").onclick = ()=>{iTbl.next();}
            document.getElementById("chartCAmt").onchange = (event)=>{
                let inputWidget = event.target;
                let input = parseInt(event.target.value); 
                inputWidget.classList.remove("flash");
                if (isNaN(input) || input > 10 || input < 5){
                    window.requestAnimationFrame(function(time) {
                        window.requestAnimationFrame(function(time) {
                            inputWidget.classList.add("flash");
                        });
                    });
                }
                else{
                    iTbl.setDisplayAmt(input);
                }
            }
        }
    }
    that.createChartD = function(){
        {
            let iTbl = InteractiveTable(this.strs);
            this.chartD = iTbl;

            document.getElementById("chartDPrev").onclick = ()=>{iTbl.prev();}
            document.getElementById("chartDNext").onclick = ()=>{iTbl.next();}
            document.getElementById("chartDAmt").onchange = (event)=>{
                let inputWidget = event.target;
                let input = parseInt(event.target.value); 
                inputWidget.classList.remove("flash");
                if (isNaN(input) || input > 10 || input < 5){
                    window.requestAnimationFrame(function(time) {
                        window.requestAnimationFrame(function(time) {
                            inputWidget.classList.add("flash");
                        });
                    });
                }
                else{
                    iTbl.setDisplayAmt(input);
                }
            }
        }
    }

    return that;
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




/**returns function */
function getAppendFcn(encodeMode){
    let next = encodeMode == ENCODEMODE.ASCII ? asciiNext : ebcdicNext;
    let prev = encodeMode == ENCODEMODE.ASCII ? asciiPrev : ebcdicPrev;
    let fcn = function(container,str){
        let max = str.length ;//> 100 ? 100 : str.length;
        for (let j = 0; j < max; j++){
            let tooltip = document.createElement("span");
            let tooltext = document.createElement("span");
            tooltip.appendChild(tooltext);
            if (str[j] == " "){
                tooltext.innerHTML = "&nbsp";
            }
            else{
                if (str[j] in utfCTRLToPic){
                    tooltext.innerHTML = utfCTRLToPic[str[j]];
                }
                else
                    tooltext.innerHTML = str[j];
            }
            let toolTextUp = document.createElement("span");
            let tUp = prev(str[j]);
            if (!tUp){
                toolTextUp.setAttribute("hidden",true);
            }
            toolTextUp.innerHTML = tUp;
            let toolTextDown = document.createElement("span");
            let tDown = next(str[j]);
            if (!tDown){
                toolTextDown.setAttribute("hidden",true);
            }
            toolTextDown.innerHTML = tDown;
            tooltip.appendChild(toolTextUp);
            tooltip.appendChild(toolTextDown);
            tooltip.classList.add("tooltip");
            toolTextUp.classList.add("tooltiptext");
            toolTextUp.classList.add("tooltextup");
            toolTextDown.classList.add("tooltiptext");
            toolTextDown.classList.add("tooltextdown");
            container.appendChild(tooltip);
        }
    }
    return fcn;
}

function amtOfCharacters(strArray){
    let result = {};

    for (let i = 0; i < strArray.length; i++){
        for (let j = 0; j < strArray[i].length; j++){
            if (strArray[i][j] in result){
                ++result[strArray[i][j]];
            }
            else{
                result[strArray[i][j]] = 1;
            }
        }
    }
    let sortedResult = [];
    for (let key in result){
        insertionSort({char: key, amt:result[key]}, sortedResult, (obj1, obj2)=>{
            
            return obj1.amt == obj2.amt ? obj1.char > obj2.char : obj1.amt < obj2.amt;
        });
    }
    return sortedResult;
}

/**comp is comparison function that takes two obj */
function insertionSort(obj, arr, comp){
    let i = binarySearch(obj,arr,comp);
    arr.splice(i,0,obj);
}


function binarySearch(obj, arr, comp){
    if (arr.length == 0)
        return 0;
    let lower = 0;
    let upper = arr.length-1;
    let mid;
    //get mid elem, compare obj against it.
    //if lower & upper have difference of 1, the spot is on either side
    while(lower < upper){
        mid = Math.floor((upper+lower)/2);
        if (comp(obj,arr[mid])){
            //obj >, raise lower
            lower = mid+1;
        }
        else{
            //obj <, shrink upper
            upper = mid-1;
        }
    }
    if (comp(obj,arr[lower])){
        return lower+1;
    }
    else{
        return lower;
    } 
}

function reverseStr(str){
    let newStr = "";
    let len = str.length-1;

    for (let i = len; i >= 0; i--){
        newStr+= str[i];
    }
    return newStr;
}

function reverseCenterStr(str){
    let newStr = "";
    let half = Math.floor(str.length/2);

    newStr = reverseStr(str.substring(0,half));
    if (str.length % 2 != 0){
        newStr += str[half];
        half++;
    }
    newStr += reverseStr(str.substring(half,str.length));
    return newStr;
}


function asciiNextAll(str){
    let newStr = "";
    for (let i = 0; i < str.length;i++){
        let result = asciiNext(str[i]);
        newStr += result != false ? result : str[i];
    }
    return newStr;
}
function asciiPrevAll(str){
    let newStr = "";
    for (let i = 0; i < str.length;i++){
        let result = asciiPrev(str[i]);
        newStr += result != false ? result : str[i];
    }
    return newStr;
}

function asciiNext(str){
    let key = str;
    if (key in charToAsciiCode){
        if (charToAsciiCode[key]+1 in ascii){
            if (ascii[charToAsciiCode[key]+1] in utfCTRLToPic){
                return utfCTRLToPic[ascii[charToAsciiCode[key]+1]];
            }
            return ascii[charToAsciiCode[key]+1];
        }else{
            return false;
        }
    }
    else{
        return false;
    }

}

function asciiPrev(str){
    let key = str;
    if (key in charToAsciiCode){
        if (charToAsciiCode[key]-1 in ascii){
            if (ascii[charToAsciiCode[key]-1] in utfCTRLToPic){
                return utfCTRLToPic[ascii[charToAsciiCode[key]-1]];
            }
            return ascii[charToAsciiCode[key]-1];
        }else{
            return false;
        }
    }
    else{
        return false;
    }
}

function ebcdicNext(str){
    let key = str;
    if (key in charToEbcdicCode){
        //convert from hex, add one, convert back to hex pad with 0
        let hex = ("00"+(parseInt(charToEbcdicCode[key],16)+1).toString(16).toUpperCase()).slice(-2);
        if (hex in ebcdic){
            if (ebcdic[hex] in utfCTRLToPic){
                return utfCTRLToPic[ebcdic[hex]];
            }
            else{
                return ebcdic[hex];
            }
        }
        else{
            return false;
        }
    }
    else{
        return false;
    }
}
function ebcdicPrev(str){
    let key = str;
    if (key in charToEbcdicCode){
        //convert from hex, subtract one, convert to hex
        let hex = ("00"+(parseInt(charToEbcdicCode[key],16)-1).toString(16).toUpperCase()).slice(-2);
        if (hex in ebcdic){
            if (ebcdic[hex] in utfCTRLToPic){
                return utfCTRLToPic[ebcdic[hex]];
            }
            else{
                return ebcdic[hex];
            }
        }
        else{
            return false;
        }
    }
    else{
        return false;
    }
}

/*function charNext(str){
    let key = str;
    if (mode == encodeMode.ASCII){
        if (key in charToAsciiCode){
            if (charToAsciiCode[key]+1 in ascii){
                if (ascii[charToAsciiCode[key]+1] in utfCTRLToPic){
                    return utfCTRLToPic[ascii[charToAsciiCode[key]+1]];
                }
                return ascii[charToAsciiCode[key]+1];
            }else{
                return false;
            }
        }
        else{
            return false;
        }
    } 
    else{
        if (key in charToEbcdicCode){
            //convert from hex, add one, convert back to hex pad with 0
            let hex = ("00"+(parseInt(charToEbcdicCode[key],16)+1).toString(16).toUpperCase()).slice(-2);
            if (hex in ebcdic){
                if (ebcdic[hex] in utfCTRLToPic){
                    return utfCTRLToPic[ebcdic[hex]];
                }
                else{
                    return ebcdic[hex];
                }
            }
            else{
                return false;
            }
        }
        else{
            return false;
        }
    }
}

function charPrev(str){
    let key = str;
    if (mode == encodeMode.ASCII){
        if (key in charToAsciiCode){
            if (charToAsciiCode[key]-1 in ascii){
                if (ascii[charToAsciiCode[key]-1] in utfCTRLToPic){
                    return utfCTRLToPic[ascii[charToAsciiCode[key]-1]];
                }
                return ascii[charToAsciiCode[key]-1];
            }else{
                return false;
            }
        }
        else{
            return false;
        }
    }
    else{
        if (key in charToEbcdicCode){
            //convert from hex, subtract one, convert to hex
            let hex = ("00"+(parseInt(charToEbcdicCode[key],16)-1).toString(16).toUpperCase()).slice(-2);
            if (hex in ebcdic){
                if (ebcdic[hex] in utfCTRLToPic){
                    return utfCTRLToPic[ebcdic[hex]];
                }
                else{
                    return ebcdic[hex];
                }
            }
            else{
                return false;
            }
        }
        else{
            return false;
        }
    }
}*/



/**A class for an interactive table. Override the draw function to display data: draw(data, amt being displayed, starting index of display) */
function InteractiveTable(data){
    that = {};
    that.data = data;
    that.displayAmt = data.length < 5 ? data.length : 5;
    that.displayStart = 0;
    that.setDraw = function(drawFcn){
        this.draw = drawFcn;
        this.update();
    }
    that.search = function(searchTerm){
        //this.getIndex
    }
    that.update = function(){
        if (this.draw){
            this.draw(this.data, this.displayAmt + this.displayStart > this.data.length ? this.data.length - this.displayStart : this.displayAmt,this.displayStart);
        }
    }
    that.setDisplayAmt = function(newAmt){
        this.displayAmt = newAmt;
        this.update();
    }
    that.next = function(){
        /*let newStart = this.displayStart + this.displayAmt;
        if (newStart + this.displayAmt < this.data.length){
            this.displayStart = newStart;
            this.update();
        }
        else{
            this.displayStart = this.data.length - this.displayAmt;
            this.update();
        }*/
        let newStart = this.displayStart + this.displayAmt;
        if (newStart < this.data.length){
            this.displayStart = newStart;
            this.update();
        }
    }
    that.prev = function(){
        /*let newStart = this.displayStart - this.displayAmt;
        if (newStart > 0){
            this.displayStart = newStart;
            this.update();
        }
        else{
            this.displayStart = 0;
            this.update();
        }*/
        let newStart = this.displayStart - this.displayAmt;
        if (newStart > 0){
            this.displayStart = newStart;
            this.update();
        }
        else{
            this.displayStart = 0;
            this.update();
        }
    }
    that.jumpTo = function(index){
        if (index >= 0 && index < this.data.length){
            if (index + this.displayAmt >= this.data.length){
                index = this.data.length - this.displayAmt;
            }
            this.displayStart = index;
            this.update();
            return true;
        }
        else{
            return false;
        }
    }
    return that;
}
