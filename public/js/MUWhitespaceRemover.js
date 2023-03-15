/**
*
*	MUWhitespaceRemover.js
*	2017 Scripted by T.Mashimo
*	ver1.0.0
*
*/

(window.addEventListener) ? window.addEventListener("load", MUWhitespaceRemoverLoadHandler, false) : window.attachEvent("load", MUWhitespaceRemoverLoadHandler);

// Auto Loading Setting //
function MUWhitespaceRemoverLoadHandler()
{
	// Removing white space (\n\r\t) in body element. //
	console.log("MUImageFrame: version 1.0.0.");
	var html = window.document.body.innerHTML;
	html = html.replace(/[\n\r\t]/g, "");
	window.document.body.innerHTML = html;
}