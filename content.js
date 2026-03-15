chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

if (request.action === "analyze") {

let title = document.title.length;

let meta = document.querySelector("meta[name='description']");
let metaLength = meta ? meta.content.length : 0;

let words = document.body.innerText.split(/\s+/).length;

let h1 = document.querySelectorAll("h1").length;
let h2 = document.querySelectorAll("h2").length;

let images = document.querySelectorAll("img").length;

let missingAlt = 0;
document.querySelectorAll("img").forEach(img=>{
if(!img.alt) missingAlt++;
});

sendResponse({
titleLength: title,
metaLength: metaLength,
wordCount: words,
h1: h1,
h2: h2,
images: images,
missingAlt: missingAlt
});

}

});