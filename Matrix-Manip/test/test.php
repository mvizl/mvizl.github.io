<!DOCTYPE html>
 <html lang="en">
  <head>
    <title>4B</title>
    <meta charset="UTF-8"/>
    <script src="js/test.js"></script>
    <link href="css/theme.css" rel="stylesheet">
</head>
<body>

    <header>
		<div class="page-header" style="padding:1em;" hidden>

		</div>
	</header>
    <main class="main">
        <div id="matCon">

        </div>
        <!--<button id="mybtn">+</button>
        <button id="mybtn2">-</button>-->
        <div style="padding:1em; border:solid white 2px; border-radius:5px; width:500px; box-sizing:border-box;">
            <label>x</label>
            <input type="number" style="width: 3em;">
            <label>y</label>
            <input type="number" style="width: 3em;">
            <label>z</label>
            <input type="number" style="width: 3em;">
            <label>value</label>
            <input type="number">
        </div>
        <svg id="eye" class="eye" height="20px" width="20px" fill="#000000" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/" version="1.1" x="0px" y="0px" viewBox="-1 -18.982 100 100" overflow="visible" enable-background="new -1 -18.982 100 100" xml:space="preserve"><path fill="#000000" d="M49,62.035c-26.167,0-46.674-27.814-47.535-28.999L0,31.018l1.465-2.019C2.326,27.814,22.833,0,49,0  c26.166,0,46.674,27.814,47.534,28.999L98,31.018l-1.466,2.019C95.674,34.221,75.166,62.035,49,62.035z M8.616,31.014  C13.669,37.151,30.117,55.166,49,55.166c18.928,0,35.339-18.006,40.386-24.145C84.331,24.883,67.885,6.869,49,6.869  C30.072,6.869,13.661,24.874,8.616,31.014z"/><circle fill="#000000" cx="49" cy="31.018" r="18.997"/></svg>
        <div style="width:100px;height:100px;" id="eyebtn" class="eye"><svg height="100%" width="100%" fill="#000000" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/" version="1.1" x="0px" y="0px" viewBox="-1 -18.982 100 100" overflow="visible" enable-background="new -1 -18.982 100 100" xml:space="preserve"><path fill="#000000" d="M49,62.035c-26.167,0-46.674-27.814-47.535-28.999L0,31.018l1.465-2.019C2.326,27.814,22.833,0,49,0  c26.166,0,46.674,27.814,47.534,28.999L98,31.018l-1.466,2.019C95.674,34.221,75.166,62.035,49,62.035z M8.616,31.014  C13.669,37.151,30.117,55.166,49,55.166c18.928,0,35.339-18.006,40.386-24.145C84.331,24.883,67.885,6.869,49,6.869  C30.072,6.869,13.661,24.874,8.616,31.014z"/><circle fill="#000000" cx="49" cy="31.018" r="18.997"/></svg></div>
        <table>
            <tr><th></th><th>x</th><th>y</th><th>z</th></tr>
            <tr><th>Active</th><td><input type="checkbox"></td><td><input type="checkbox"></td><td><input type="checkbox"></td></tr>
            <tr><th>Value</th><td><input style="width: 3em;" type="number" max="6" min="1" disabled="true"></td><td><input style="width: 3em;" type="number" max="6" min="1" disabled="true"></td><td><input style="width: 3em;" type="number" max="6" min="1" disabled="true"></td></tr>
            
        </table>
    </main>
</body>
</html>	  