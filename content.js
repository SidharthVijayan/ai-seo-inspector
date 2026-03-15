chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

if (request.action === "analyze") {

let title = document.title.length;

let meta = document.querySelector("meta[name='description']");
let metaLength = meta ? meta.content.length : 0;

let text = document.body.innerText;

let words = text.split(/\s+/).length;

let h1 = document.querySelectorAll("h1").length;
let h2 = document.querySelectorAll("h2").length;

let images = document.querySelectorAll("img").length;

let missingAlt = 0;
document.querySelectorAll("img").forEach(img=>{
if(!img.alt) missingAlt++;
});


// ----- KEYWORD EXTRACTION -----

let cleanText = text.toLowerCase()
.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");

let wordArray = cleanText.split(/\s+/);

let freq = {};

wordArray.forEach(word => {

if(word.length > 4){

freq[word] = (freq[word] || 0) + 1;

}

});

let sorted = Object.entries(freq)
.sort((a,b)=>b[1]-a[1])
.slice(0,5);


// ----- SEO SCORE -----

let score = 100;

if(title < 30 || title > 65) score -= 10;
if(metaLength < 70 || metaLength > 160) score -= 10;
if(h1 == 0) score -= 10;
if(words < 300) score -= 10;
if(missingAlt > 0) score -= 10;

sendResponse({

titleLength: title,
metaLength: metaLength,
wordCount: words,
h1: h1,
h2: h2,
images: images,
missingAlt: missingAlt,
seoScore: score,
entities: sorted

});

}

});
