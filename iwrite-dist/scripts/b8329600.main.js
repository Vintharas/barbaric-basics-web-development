console.log("'Allo 'Allo!"),function(a){"use strict";function b(a){this.prefix=a}b.prototype.setItem=function(a,b){a=this.prefix+a,"object"==typeof b&&(b=JSON.stringify(b)),window.localStorage.setItem(a,b)},b.prototype.getItem=function(a){a=this.prefix+a;var b=window.localStorage.getItem(a);try{var c=JSON.parse(b);return c}catch(d){return b}},a.localStorage=new b("iwrite.")}(window.iwrite=window.iwrite||{}),function(a,b){"use strict";function c(){return new d}function d(){function c(){return j||(j=a.localStorage.getItem(l)||[]),j}function d(){var a=e();j.push(a);var c={name:a,content:""};return b.setItem(l,j),b.setItem(a,c),k[a]=c,c}function e(){function a(a){return j.some(function(b){return a===b})}for(var b="New File ",c="New File 1",d=1;a(c);)d++,c=b+d.toString();return c}function f(b){return k[b]||(k[b]=a.localStorage.getItem(b)),k[b]}function g(a,b){k[a]={name:a,content:b}}function h(){window.setInterval(i,2e3)}function i(){for(var b in k)a.localStorage.setItem(b.name,b.content)}{var j,k={},l="fileNames";h()}return{getFileNames:c,createNewFile:d,getFile:f,updateFile:g}}a.data={getFileRepository:c}}(window.iwrite=window.iwrite||{},iwrite.localStorage),function(a){"use strict";function b(){function a(a){var b=document.createElement("a");b.innerHTML=a,b.className="list-group-item",b.href="#",b.onclick=d,e.appendChild(b)}function b(){var a=e.childNodes;a.length>0&&d.call(a[0])}var c,d,e=document.querySelector(".sidebar div.list-group");if(2===arguments.length){if("object"==typeof arguments[0])c=arguments[0];else{if("string"!=typeof arguments[0])throw new Error("Wrong typed arguments. First argument should be a fileName or an array of fileNames");c=[arguments[0]]}d=arguments[1]}c.forEach(a),b()}function c(a){var b=document.querySelector(".sidebar div.list-group"),c=b.childNodes;c=Array.prototype.slice.call(c),c.forEach(function(b){a===b&&(b.className="list-group-item active"),b.className="list-group-item"})}function d(a){var b,c,d;return(c=document.querySelector("div.editor textarea"))?c:(b=document.createElement("div"),b.className="col-md-6 col-sm-6 editor",c=document.createElement("textarea"),c.className="form-control noresize",c.noResize=!0,c.rows=10,c.addEventListener("keypress",e(a)),c.placeholder="Start writing something here in markdown...",b.appendChild(c),d=document.querySelector("div.content"),d.appendChild(b),c)}function e(a){return function(){var b=document.querySelector("div.editor textarea");a(b.value)}}function f(){var a,b;return(a=document.querySelector("div.preview"))?a:(a=document.createElement("div"),a.className="col-md-6 col-sm-6 preview basic-borders",b=document.querySelector("div.content"),b.appendChild(a),a)}function g(a){var b=document.querySelector("div.preview");b.innerHTML=a}var h={loadFilesInSidebar:b,setFileListItemAsActive:c,getOrCreateEditor:d,getOrCreatePreview:f,setPreviewContent:g};a.DOM=h}(window.iwrite=window.iwrite||{}),function(a,b,c){"use strict";function d(){var a=document.getElementById("add-image");a.addEventListener("click",e);var b=document.getElementById("add-file");b.addEventListener("click",g),f()}function e(){}function f(){var a=o.getFileNames();c.loadFilesInSidebar(a,h)}function g(){var a=o.createNewFile();c.loadFilesInSidebar(a.name,h)}function h(){var a=this.text;n=a,c.setFileListItemAsActive(this),this.className="list-group-item active",console.log("opening file: "+a);var b=o.getFile(a);i(b.content),j(b.content)}function i(a){console.log("Open editor with content: "+a);var b=c.getOrCreateEditor(k);b.value=a}function j(a){c.getOrCreatePreview(),l(a)}function k(a){o.updateFile(n,a),l(a)}function l(a){console.log("sending data to worker: ",a),p.postMessage(a)}function m(a){var b=a.data;console.log("received data from worker: ",b),c.setPreviewContent(b)}var n,o=b.getFileRepository(),p=new Worker("scripts/markdownParser.js");p.onmessage=m,window.addEventListener("load",d)}(window.iwrite=window.iwrite||{},window.iwrite.data,window.iwrite.DOM);