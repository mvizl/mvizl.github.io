<!DOCTYPE html>
 <html lang="en">
  <head>
    <title>4B</title>
    <meta charset="UTF-8"/>
    <script src="javascript/index.js"></script>
    <link href="css/theme.css" rel="stylesheet">
</head>
<body>

    <header>
		<div class="page-header" style="padding:1em;" hidden>
			<h2 style="margin:0;">
			     4B
			</h2>
            <button class="btn prim" id="pageSwap">Restart</button>
		</div>
	</header>
    <main class="main">
        <div>
            <div class="page active" id="appSetup">
                <div class="page-content" style="padding:10px">
                    <div class="page active" id="numMat">
                        <div class="page-content">
                            <div class="center-hori center-vert">
                                <div class="gradient-border">
                                    <div class="container">
                                            Number of 3d arrays <input type="number" id="numMatIn" value=2 min=2 max=20></input>
                                            <button class="btn prim" id="numMatSubmit"> Submit</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="page" id="dimen">
                        <div class="page-content">
                            <div class="center-hori center-vert">
                                <div style="display:grid;grid-template-columns: 1fr 1fr;">
                                    <div class="gradient-border">
                                        <div class="container" style="height:100%;">
                                                Dimensions for 3D array #<span id="matrNum">1</span> <br>
                                                <table>
                                                    <tr><td>Columns: </td><td><input value=1 id="colIn" type="number" style="width:4em;" max=10 min=1></td></tr>
                                                    <tr><td>Rows: </td><td><input value=1 id="rowIn" type="number" style="width:4em;" max=10 min=1></td></tr>
                                                    </input><span hidden id="dimenOut">x1x1</span>
                                                </table>
                                                <button class="btn prim" id="dimenSubmit"> Submit</button>
                                        </div>
                                    </div>
                                    <div class="gradient-border">
                                        <div class="container" style="height:100%;" >
                                            <h4>Current 3D Arrays</h4>
                                            <hr>
                                            <div id="setupListMatr">None</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="page" id="appMain">
                <div class="page-content">
                    <div style="height:65px;" id="tabs">
                        <button id="tabEdit" class="tablink active">Edit</button>
                        <button id="tabEquation" class="tablink">Equation Builder</button>
                    </div>

                    <div class="page active" id="mainEdit">
                        <div class="page-content">
                            <select id="matrSelect">
                                <option>Nothing selected</option>
                            </select>
                            <div id="matConEdit">
                                <div class="matrix-container"></div>
                                <div id="matMsg"></div>
                                
                            </div>
                            <div style="padding:10px; width:500px; box-sizing:border-box;"><u>INFO:</u><br>
                            Click and drag the viewport above to rotate the 3d array.<br>
                                 The cells on the front face have a white dashed border. <br>
                            Hover over a cell to view its number. </div>
                        </div>
                    </div>

                    <div class="page" id="mainEB"><!--Equation Builder-->
                        <div class="page-content">
                            <div style="display:flex">
                                <div style="width:max-content; text-align:center; height:max-content;">
                                    <div style="padding: 10px;border: solid 3px rgba(0, 0, 0,0.3);width: max-content;margin: 10px;border-radius:10px;">
                                    
                                        <div style="padding:0.5em;">Equation</div>
                                        <button id="addSlot">Add Slot</button><button id="remSlot">Remove Slot</button>
                                        <hr>
                                        <table class="op-table" id="slotTbl">
                                            <tr><th></th><th><select><option>Mat1</option></select></th></tr>
                                            <tr><td>+</td><td><select><option>Mat2</option></select></td></tr>
                                            <tr><td>+</td><td><select><option>Mat3</option></select></td></tr>
                                        </table>
                                    
                                    </div>
                                    <button style="margin:auto;" id="calcEq">Calculate</button>
                                    <div class="collapsible" style="max-width:263px">
                                        <div id="errorWidget" class="error-text">Error:</div>
                                    </div>
                                </div>
                                <div id="matConEq" style="display:flex;">
                                    <div class="matrix-container"></div>
                                    <div id="matMsg"></div>
                                </div>
                                <!--<button style="max-height:500px" id="pModeAdd">3D</button>-->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</body>
</html>	  