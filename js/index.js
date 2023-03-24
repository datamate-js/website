/*
*
*	index.js
*	2022 scripted by mashimo,T.
*
*/

window.addEventListener("load", loadHandler);

function loadHandler(_e)
{
	const sampleManager = new SampleManager();
	sampleManager.reload();

	const referenceElement = window.document.querySelector("#reference");
	if (referenceElement)
		setupReference();

	// ver1.2.6a, replace info //
	replace(".version", "1.2.8a");
	replace(".lastupdate", "2023.03.24");
}

function replace(_query, _value)
{
	const elements = window.document.querySelectorAll(_query);
	for (let index in elements) 
		elements[index].innerHTML = _value;
}

function setupReference()
{
	const referenceManager = new ReferenceManager();
}

// function loadHandler(_e)
// {

// 	const closeElement = window.document.querySelector("#overlay");
// 	closeElement.addEventListener("mousedown", function(_e) {
// 		closeSampleView();
// 	});

// 	const sampleElement = window.document.querySelector("#sample");
// 	sampleElement.addEventListener("transitionend", function (_e) {
// 		sampleElement.style.visibility = (sampleElement.style.opacity==0.0) ? "hidden" : "visible";
// 	});

// 	const runElements = window.document.querySelectorAll("[data-datamate-run]");
// 	for (let i=0; i<runElements.length; i++) {
// 		const runElement = runElements[i];
// 		const runButtonElement = runElement.querySelector("a.run");
// 		const samplePath = runElement.getAttribute("data-datamate-run");
// 		runButtonElement.src = samplePath;
// 		runButtonElement.addEventListener("mousedown", runClickHandler);

// 		const codeElement = runElement.querySelector("[data-datamate-code]");
// 		const codeLoader = new SampleLoader();
// 		codeLoader.load(codeElement, samplePath);
// 	}
// }

// function runClickHandler(_e)
// {
// 	const runElement = _e.currentTarget;
// 	const src = runElement.src;
// 	const previewElement = window.document.querySelector("#preview");
// 	previewElement.src = src;
	
// 	openSampleView();
// 	//openCodeView(src);
// }

// function openSampleView()
// {
// 	const sampleElement = window.document.querySelector("#sample");
// 	sampleElement.style.visibility = "visible";
// 	sampleElement.style.opacity = 1.0;
// }

// function closeSampleView()
// {
// 	const sampleElement = window.document.querySelector("#sample");
// 	sampleElement.style.opacity = 0.0;
// }

// async function openCodeView(_path)
// {
// 	const response = await fetch(_path);				// Fetch given file response.
// 	const responseText = await response.text();			// Extract text data from response.
// 	const parser = new DOMParser();
// 	const dom = parser.parseFromString(responseText, "text/html");
// 	const script = dom.querySelector("#code");
// 	console.log("index.js: Loaded:", _path, script);
// }
