parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"krre":[function(require,module,exports) {

},{}],"Focm":[function(require,module,exports) {
"use strict";require("./css/styles.css");const e=300,n={form:document.querySelector(".search-form"),gallery:document.querySelector(".gallery")};function t(e){e.preventDefault();const n=e.currentTarget.elements.searchQuery.value.trim();n&&s(n).then(e=>{if(0===e.hits.length||"undefined"===e.hits)return console.log("Sorry, there are no images matching your search query. Please try again.");console.log(`Hooray! We found ${e.totalHits} images.`),console.log(e),o(e.hits)}).catch(e=>console.log(e))}function s(e){const n=new URLSearchParams({key:"25243201-da43b78e8715fb1cc3094e420",image_type:"photo",orientation:"horizontal",safesearch:!0});return fetch(`https://pixabay.com/api/?q=${e}&${n}`).then(e=>{if(200!==e.status)throw new Error(response.status);return e.json()})}function o(e){const t=e.map(e=>`<div class="photo-card">\n  <img src="${e.webformatURL}" alt="${e.tags}" loading="lazy" />\n  <div class="info">\n    <p class="info-item">\n      <b>Likes</b>${e.likes}\n    </p>\n    <p class="info-item">\n      <b>Views</b>${e.views}\n    </p>\n    <p class="info-item">\n      <b>Comments</b>${e.comments}\n    </p>\n    <p class="info-item">\n      <b>Downloads</b>${e.downloads}\n    </p>\n  </div>\n</div>`).join("");n.gallery.insertAdjacentHTML("beforeend",t)}n.form.addEventListener("submit",t);
},{"./css/styles.css":"krre"}]},{},["Focm"], null)
//# sourceMappingURL=/goit-js-hw-11/src.50a3444f.js.map