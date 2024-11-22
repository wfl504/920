(() => {(()=>{"use strict";function e(e,t){return null===e||void 0===e&&t?"":void 0===e?void 0:`${e}`}const t=Symbol("adapter");class i{constructor(e){this.kind=e.kind,this.name=e.name,this[t]=e}get isFile(){return"file"===this.kind}get isDirectory(){return"directory"===this.kind}async queryPermission(e={mode:"read"}){const i=this[t];if(i.queryPermission)return i.queryPermission(e);if("read"===e.mode)return"granted";if("readwrite"===e.mode)return i.writable?"granted":"denied"
;throw new TypeError(`Mode ${e.mode} must be 'read' or 'readwrite'`)}async requestPermission(e={mode:"read"}){const i=this[t];if(i.requestPermission)return i.requestPermission(e);if("read"===e.mode)return"granted";if("readwrite"===e.mode)return i.writable?"granted":"denied";throw new TypeError(`Mode ${e.mode} must be 'read' or 'readwrite'`)}async isSameEntry(e){return this===e||this.kind===e.kind&&!!e[t]&&await this[t].isSameEntry(e[t])}}Object.defineProperty(i.prototype,Symbol.toStringTag,{
value:"FileSystemHandle",writable:!1,enumerable:!1,configurable:!0});const r=globalThis.WritableStream,n=globalThis.WritableStream||r;class s extends n{constructor(e,t){super(e,t),this._closed=!1,Object.setPrototypeOf(this,s.prototype)}close(){this._closed=!0;const e=this.getWriter(),t=e.close();return e.releaseLock(),t}seek(e){return this.write({type:"seek",position:e})}truncate(e){return this.write({type:"truncate",size:e})}write(e){
if(this._closed)return Promise.reject(new TypeError("Cannot write to a CLOSED writable stream"));const t=this.getWriter(),i=t.write(e);return t.releaseLock(),i}}Object.defineProperty(s.prototype,Symbol.toStringTag,{value:"FileSystemWritableFileStream",writable:!1,enumerable:!1,configurable:!0}),Object.defineProperties(s.prototype,{close:{enumerable:!0},seek:{enumerable:!0},truncate:{enumerable:!0},write:{enumerable:!0}});const o=Symbol("adapter");class a extends i{constructor(e){super(e),
this.kind="file",this[o]=e}async createWritable(e={}){return new s(await this[o].createWritable(e))}async getFile(){return this[o].getFile()}}Object.defineProperty(a.prototype,Symbol.toStringTag,{value:"FileSystemFileHandle",writable:!1,enumerable:!1,configurable:!0}),Object.defineProperties(a.prototype,{createWritable:{enumerable:!0},getFile:{enumerable:!0}});const l=a,c=Symbol("adapter");class d extends i{constructor(e){super(e),this.kind="directory",this[c]=e}async getDirectoryHandle(e,t={}){
if(""===e)throw new TypeError("Name can't be an empty string.");if("."===e||".."===e||e.includes("/"))throw new TypeError("Name contains invalid characters.");return new d(await this[c].getDirectoryHandle(e,t))}getDirectory(e,t={}){return this.getDirectoryHandle(e,t)}async*entries(){for await(const[,e]of this[c].entries())yield[e.name,"file"===e.kind?new a(e):new d(e)]}async*getEntries(){return this.entries()}async*keys(){for await(const[e]of this[c].entries())yield e}async*values(){
for await(const[,e]of this.entries())yield e}async getFileHandle(e,t={}){if(""===e)throw new TypeError("Name can't be an empty string.");if("."===e||".."===e||e.includes("/"))throw new TypeError("Name contains invalid characters.");return t.create=!!t.create,new a(await this[c].getFileHandle(e,t))}getFile(e,t={}){return this.getFileHandle(e,t)}async removeEntry(e,t={}){if(""===e)throw new TypeError("Name can't be an empty string.")
;if("."===e||".."===e||e.includes("/"))throw new TypeError("Name contains invalid characters.");return t.recursive=!!t.recursive,this[c].removeEntry(e,t)}async resolve(e){if(await e.isSameEntry(this))return[];const t=[{handle:this,path:[]}];for(;t.length;){const{handle:i,path:r}=t.pop();for await(const n of i.values()){if(await n.isSameEntry(e))return[...r,n.name];"directory"===n.kind&&t.push({handle:n,path:[...r,n.name]})}}return null}[Symbol.asyncIterator](){return this.entries()}}
Object.defineProperty(d.prototype,Symbol.toStringTag,{value:"FileSystemDirectoryHandle",writable:!1,enumerable:!1,configurable:!0}),Object.defineProperties(d.prototype,{getDirectoryHandle:{enumerable:!0},entries:{enumerable:!0},getFileHandle:{enumerable:!0},removeEntry:{enumerable:!0}});const h=d,f=globalThis.File,u=globalThis.Blob,{INVALID:p,GONE:y,MISMATCH:m,MOD_ERR:w,SYNTAX:g,DISALLOWED:v}={INVALID:["seeking position failed.","InvalidStateError"],
GONE:["A requested file or directory could not be found at the time an operation was processed.","NotFoundError"],MISMATCH:["The path supplied exists, but was not an entry of requested type.","TypeMismatchError"],MOD_ERR:["The object can not be modified in this way.","InvalidModificationError"],SYNTAX:e=>[`Failed to execute 'write' on 'UnderlyingSinkBase': Invalid params passed. ${e}`,"SyntaxError"],ABORT:["The operation was aborted","AbortError"],
SECURITY:["It was determined that certain files are unsafe for access within a Web application, or that too many calls are being made on file resources.","SecurityError"],DISALLOWED:["The request is not allowed by the user agent or the platform in the current context.","NotAllowedError"]};class E{constructor(e,t,i){e.file,this.fileHandle=e,this.file=i?t:new f([],t.name,t),this.size=i?t.size:0,this.position=0}async write(e){if(!this.fileHandle.file)throw new DOMException(...y);let t=this.file
;if((e=>"object"==typeof e&&void 0!==e.type)(e))if("write"===e.type){if("number"==typeof e.position&&e.position>=0&&(this.position=e.position,this.size<e.position&&(this.file=new f([this.file,new ArrayBuffer(e.position-this.size)],this.file.name,this.file),O&&O.emit("modified",this.fileHandle))),!("data"in e))throw new DOMException(...g("write requires a data argument"));e=e.data}else{if("seek"===e.type){if(Number.isInteger(e.position)&&e.position>=0){
if(this.size<e.position)throw new DOMException(...p);return void(this.position=e.position)}throw new DOMException(...g("seek requires a position argument"))}if("truncate"===e.type){if(Number.isInteger(e.size)&&e.size>=0)return t=e.size<this.size?new f([t.slice(0,e.size)],t.name,t):new f([t,new Uint8Array(e.size-this.size)],t.name,t),this.size=t.size,this.position>t.size&&(this.position=t.size),this.file=t,void(O&&O.emit("modified",this.fileHandle))
;throw new DOMException(...g("truncate requires a size argument"))}}e=new u([e]);let i=this.file;const r=i.slice(0,this.position),n=i.slice(this.position+e.size);let s=this.position-r.size;s<0&&(s=0),i=new f([r,new Uint8Array(s),e,n],i.name),this.size=i.size,this.position+=e.size,this.file=i,O&&O.emit("modified",this.fileHandle)}async close(){if(!this.fileHandle.file)throw new DOMException(...y);this.fileHandle.file.set(this.file),this.file=this.position=this.size=null,
this.fileHandle.onclose&&this.fileHandle.onclose(this.fileHandle)}}class b{constructor(e="",t=new f([],e)){this.file=t}async get(){return this.file}async set(e){this.file=e}}class T{constructor(e="",t=new b,i=!0){this.kind="file",this.deleted=!1,this.file=t instanceof b?t:new b(e,t),this.name=e,this.writable=i,O&&O.emit("created",this)}async getFile(){if(this.deleted||null===this.file)throw new DOMException(...y);return await this.file.get()}async createWritable(e){
if(!this.writable)throw new DOMException(...v);if(this.deleted)throw new DOMException(...y);const t=await this.file.get();return new E(this,t,!!e?.keepExistingData)}async isSameEntry(e){return this===e}destroy(){O&&O.emit("deleted",this),this.deleted=!0,this.file=null}}class x{constructor(e,t=!0){this.kind="directory",this.deleted=!1,this.name=e,this.writable=t,this._entries={},O&&O.emit("created",this)}async*entries(){if(this.deleted)throw new DOMException(...y)
;yield*Object.entries(this._entries)}async isSameEntry(e){return this===e}async getDirectoryHandle(e,t={}){if(this.deleted)throw new DOMException(...y);const i=this._entries[e];if(i){if(i instanceof T)throw new DOMException(...m);return i}if(t.create){const t=this._entries[e]=new x(e);return O&&O.emit("created",t),t}throw new DOMException(...y)}async getFileHandle(e,t={}){const i=this._entries[e];if(i){if(i instanceof T)return i;throw new DOMException(...m)}
if(t.create)return this._entries[e]=new T(e);throw new DOMException(...y)}async removeEntry(e,t={}){const i=this._entries[e];if(!i)throw new DOMException(...y);i.destroy(t.recursive),delete this._entries[e]}destroy(e){for(const t of Object.values(this._entries)){if(!e)throw new DOMException(...w);t.destroy(e)}O&&O.emit("deleted",this),this._entries={},this.deleted=!0}}let M,O;const S=e=>{const{name:t,writeable:i=!0,eventEmitter:r,entries:n}=e;return M=new x(t,i),n&&(M._entries=n),O=r,M
},{AbortController:D,FileReader:k,TextDecoder:H,addEventListener:P,atob:L,btoa:A,clearInterval:I,clearTimeout:F,crypto:_,decodeURIComponent:N,encodeURIComponent:z,escape:C,fetch:j,location:q,removeEventListener:W,setInterval:$,setTimeout:R,unescape:B}=self,{DOMParser:U,Notification:Y,Image:X,Worker:G,XMLHttpRequest:V,alert:J,confirm:K,document:Q,localStorage:Z,screen:ee}=(q.origin,q.host,self),te=e=>new Promise((t=>ne(t,e)));let ie=0;const re=async function(e,...t){await(()=>{const e=Date.now()
;if(ie+1e3<e)return new Promise((e=>R((()=>{ie=Date.now(),e()}),0)))})(),e.apply(this,t)},ne=function(e,t){return t?R.apply(this,[e,t]):(re.apply(this,[e]),0)},se=(e,t)=>{for(let i=0,r=e.length;i<r;i++)if(e[i]==t)return!0;return!1},oe=e=>e&&void 0!==e.nodeType,ae=e=>e&&void 0!==e.tagName,le=(...t)=>{const i=t.length>1?t:t[0];if(i?.queryHelper)return i;if("function"==typeof i)return"loading"!=window.document.readyState?i(null):window.addEventListener("DOMContentLoaded",i),le([])
;if("string"==typeof i){const e=document.querySelectorAll(i),t=[].slice.call(e);return le(t)}if(Array.isArray(i)){const t=[].concat(...i.map((e=>Array.isArray(e)?e:"string"==typeof e?le(e):[e])).filter((e=>e))),r={},n=Object.assign(t,{queryHelper:!0,append:(...e)=>(e.forEach((e=>{const i=t[0];oe(i)&&le(e).forEach((e=>i.appendChild(le(e)[0])))})),le(t)),appendTo:e=>{const i=le(e);return t.filter(oe).forEach((e=>i.append(e))),le(t)},insertBefore:e=>{const i=[...t];if(t.length){
const r=le(e)[0],n=r?.parentNode;n&&t.forEach((e=>{const t=le(e)[0];t&&(n.insertBefore(t,r),i.push(t))}))}return le(i)},remove:()=>(t.filter(oe).forEach((e=>e.parentNode?.removeChild(e))),le([])),replaceWith:e=>{const i=t[0];if(i){const t=(e=>e&&e.queryHelper)(i)?i[0]:i,r=le(e),n=r.shift();return void 0!==n&&ae(t)&&(t.replaceWith(n),r.forEach((e=>{n.parentNode?.insertBefore(e,n.nextSibling)}))),le(t)}return le(t)},prevAll:e=>{const i=t[0];if(!i)return le([]);const r=le(i).parent()?.children(e)
;if(!r||!r.length)return le([]);const n=[];for(let e=0;e<r.length;e++){const t=r[e];if(t==i)break;n.push(t)}return le(n.reverse())},nextAll:e=>{const i=t[0];if(!i)return le([]);const r=le(i).parent()?.children(e);if(!r||!r.length)return le([]);const n=[];let s=!1;for(let e=0;e<r.length;e++){const t=r[e];s&&n.push(t),t==i&&(s=!0)}return le(n)},addClass:e=>{const i=e.trim().split(" ");return t.filter(ae).forEach((e=>i.forEach((t=>e.classList.add(t))))),le(t)},removeClass:e=>{
const i=e.trim().split(" ");return t.filter(ae).forEach((e=>i.forEach((t=>e.classList.remove(t))))),le(t)},toggleClass:(e,i)=>(e.trim().split(" ").forEach((e=>{!0===i?n.addClass(e):!1===i?n.removeClass(e):t.filter(ae).forEach((t=>t.classList.toggle(e)))})),le(t)),hasClass:e=>!!t.filter((t=>ae(t)&&t.classList.contains(e))).length,is:e=>{const i=t[0];if(i&&ae(i))return":visible"==e?"none"!==window.getComputedStyle(i).display:":checked"==e?1==i.checked:void 0},attr:(e,i)=>{if(t.length){
const r=(e,i)=>{null===i?t.filter(ae).forEach((t=>t.removeAttribute(e))):t.filter(ae).forEach((t=>t.setAttribute(e,i.toString())))};if("string"==typeof e){if(void 0===i){const i=t[0];return ae(i)&&i.getAttribute(e)||void 0}r(e,i)}else for(const t of Object.keys(e))r(t,e[t])}return le(t)},prop:(e,i)=>{if(t.length){const r=(e,i)=>{null===i?t.filter(ae).forEach((t=>{delete t[e],t.removeAttribute(e)})):t.forEach((t=>t[e]=i))};if("string"==typeof e){if(void 0===i)return t[0][e];r(e,i)
}else for(const t of Object.keys(e))r(t,e[t])}return le(t)},text:i=>void 0===i?t.length?t.filter(ae).map((e=>e.innerText)).join(""):void 0:(t.length&&null!=i&&t.filter(ae).forEach((t=>t.innerText=e(i))),le(t)),html:i=>{if(t.length){if(void 0===i)return t.filter(ae).map((e=>e.innerHTML)).join("");t.filter(ae).forEach((t=>t.innerHTML=e(i)))}return le(t)},closest:e=>{if(t.length){const i=t[0],r=ae(i)&&((e,t)=>{const i=document.querySelectorAll(t);let r=e.parentNode;for(;r&&!se(i,r);)r=r.parentNode
;return r})(i,e);if(r)return le(r)}return le([])},parent:()=>{const e=t[0];return ae(e)?le(e.parentNode):le([])},children:e=>{const i=t[0];if(ae(i))if(e){if(i.querySelectorAll){const t=i.querySelectorAll(e);return le([].slice.call(t))}}else if(i.children)return le([].slice.call(i.children));return le([])},find:e=>{let i=[];return t.forEach((t=>{le(t).children(e).forEach((t=>{const r=le(t).find(e).toArray();i=[...i,t,...r]}))})),le(i)},each:e=>(t.forEach(((t,i)=>e(i,t))),le(t)),not:e=>{
const i=le(e);return le(t.filter((e=>-1===i.indexOf(le(e)[0]))))},first:()=>le(t.slice(0,1)),toArray:()=>[...t],bind:(e,i)=>(e.split(" ").forEach((e=>{(r[e]||(r[e]=[])).push(i),t.forEach((t=>t.addEventListener(e,i)))})),le(t)),unbind:e=>(e.split(" ").forEach((e=>{r[e]&&(r[e].forEach((i=>{t.forEach((t=>{t.removeEventListener(e,i)}))})),r[e]=[])})),le(t)),value:i=>{if(void 0===i){let e;return t.reverse().some((t=>{if(!t.disabled)return"checkbox"!=t.type||1==t.checked?(e=t.value,!0):void 0})),e}{
const r=t.length?t[t.length-1]:void 0;return r&&("checkbox"==r.type?r.value==i&&(r.checked=!0):"select-one"==r.type?r.value=e(i):((e=>e&&void 0!==e.type)(r)&&"text"==r.type&&(r.value=e(i)),r.setAttribute("value",e(i)))),le(t)}},data:(i,r)=>{const n=t[0];return ae(n)&&n.dataset?void 0===r?n.dataset[i]:(null===r?delete n.dataset[i]:n.dataset[i]=e(r),le(t)):void 0===r?le(t):void 0},offset:()=>{const e=t[0];return ae(e)&&e?.getBoundingClientRect()||{left:-1,top:-1,right:-1,bottom:-1,x:-1,y:-1,
height:-1,width:-1}},height:()=>{const e=t[0];return e&&((e=>e&&void 0!==e.document)(e)?window.innerHeight:e.offsetHeight)||0},scrollTop:()=>{const e=t[0];return e&&(e.scrollTop||e.pageYOffset)||0},get:e=>t[e],on:(e,i)=>(e.split(" ").forEach((e=>t.forEach((t=>t?.addEventListener(e,i))))),le(t)),off:(e,i)=>(e.split(" ").forEach((e=>t.forEach((t=>t?.removeEventListener(e,i))))),le(t)),trigger:(e,i)=>{const r=new Event(e,{bubbles:!0,cancelable:!0});return i&&Object.assign(r,i),t.forEach((t=>{
if(["focus","blur"].includes(e)){const i=t[e];"function"==typeof i&&i.apply(t,[])}t.dispatchEvent(r)})),le(t)},toggle:e=>(t.forEach((t=>{const i=le(t);(void 0===e?i.is(":visible"):!e)?i.hide():i.show()})),le(t)),hide:()=>(t.filter(ae).forEach((e=>{const t=e?.style?.display;t&&-1==t.indexOf("none")&&(e.backuped_display=t),le(e).attr("style","display: none !important")})),le(t)),fadeOut:async e=>new Promise((i=>{t.filter(ae).forEach((t=>{t.style.opacity="1",
t.style.transition=`opacity ${e||150}ms`,setTimeout((()=>{t.style.opacity="0"}),1)})),setTimeout((()=>{t.filter(ae).forEach((e=>{e.style.transition="",e.style.opacity=""})),n.hide(),i(le(t))}),(e||150)+1)})),show:()=>(t.filter(ae).forEach((e=>{e.style.display=e.backuped_display||""})),le(t)),fadeIn:async e=>new Promise((i=>{t.filter(ae).forEach((t=>{t.style.opacity="0",t.style.transition=`opacity ${e||150}ms`,setTimeout((()=>{t.style.opacity="1"}),1)})),n.show(),setTimeout((()=>{
t.filter(ae).forEach((e=>{e.style.transition="",e.style.opacity=""})),i(le(t))}),(e||150)+1)})),animate:(e,i)=>new Promise((r=>{const n=t[0];n.current_action&&window.clearInterval(n.current_action),n.current_action=window.setInterval((()=>{if(void 0!==e.scrollTop){const i=n===window?document.documentElement:n,s=i.scrollTop;i.scrollTop<e.scrollTop?i.scrollTop=i.scrollTop+3:i.scrollTop=i.scrollTop-3,(i.scrollTop===s||Math.abs(i.scrollTop-e.scrollTop)<=3)&&(i.scrollTop=e.scrollTop,
window.clearInterval(n.current_action),delete n.current_action,r(le(t))),window.getComputedStyle(i)}else t.forEach((t=>{if(void 0!==e.height){const i=le(t).get(0);i&&i.style&&(i.style.height=`${e.height}px`)}})),r(le(t))}),void 0===i?100:i)})),serialize:()=>{if(1==t.length&&(e=t[0])&&"FORM"==e.tagName)return le(t[0]).find("input, textarea, select, button").map((e=>{const t=e.name,i=le(e).value();if("string"==typeof t&&"string"==typeof i)return`${t}=${encodeURIComponent(i)}`
})).filter((e=>"string"==typeof e)).join("&");var e}});return n}return le(void 0===i||null==i?[]:[i])};class ce{constructor(){this.events={}}on(e,t){const{events:i}=this;let r=i[e];return r||(r=[],i[e]=r),r.push(t),()=>this.off(e,t)}once(e,t){const i=this.on(e,((...e)=>(i(),t.bind(this)(...e))));return i}off(e,t){const i=this.events[e];if(i){const e=i.indexOf(t);e>=0&&i.splice(e,1)}}emit(e,...t){const i=this.events[e];if(i)for(const e of i)if(e(...t))return!0;return!1}}
const de=e=>e.error,he="Extension communication timed out!";class fe extends b{constructor(e,t,i){super(),this.name=e,this.path=t,this.handler=i}async get(){const e=await this.handler.get(this.name,this.path,this.cache?.lastModified);return this.cache?.lastModified&&e.lastModified===this.cache.lastModified||(this.cache=e),this.cache}async set(e){this.cache=e,await this.handler.set(this.name,this.path,e)}}const ue=e=>({"/":"∕","\\":"⑊"}[e]||e),pe=e=>e.replace(/[/:\\]/g,ue);let ye;const me=e=>{
const t=async()=>{if(!ye){let t;ye=e();try{t=await ye}catch(e){throw ye=void 0,e}return ye=void 0,t}try{await ye}catch(e){}return t()};return t()},we="undefined"==typeof globalThis?{}:globalThis,ge=we.cloneInto||(e=>e),ve=(we.createObjectIn,we.exportFunction||((e,t,i)=>{const r=i&&i.defineAs;return r&&(t[r]=e),e}));(async e=>{const t=e,i=e.Worker;let r;const n=(({sendPrefix:e,listenPrefix:t,cloneInto:i})=>{let r,n,s=1;const o={},a=e=>{const t=++s;return o[s]=e,t},l=(e,t)=>{
const{m:r,a:n,r:s}=t,o=new CustomEvent(e,{detail:(a={m:r,a:n,r:s},i?i(a,window.document):a)});var a;dispatchEvent.apply(window,[o])},c=t=>{const{m:i,r:s,a}=t.detail;if("message.response"==i){if(null==s)throw"Invalid Message";((e,t)=>{let i;e&&(i=o[e])&&(i(t),delete o[e])})(s,a)}else r&&r({method:i,args:a},s?t=>{l(`${e}_${n}`,{m:"message.response",a:t,r:s})}:()=>{})},d=e=>{e&&(n=e),n&&addEventListener(`${t}_${n}`,c,!0)},h={init:async e=>{n?d():d(e),await function(){let e;return e=void 0,
new Promise((e=>{const t=window.document.readyState;"interactive"==t||"complete"==t?e():window.addEventListener("DOMContentLoaded",(()=>{e()}),{capture:true,once:!0})}))}()},refresh:()=>{const e=n;e&&(h.cleanup(),h.init(e))},send:(t,i,r)=>{l(`${e}_${n}`,{m:t,a:i,r:r?a(r):null})},setMessageListener:e=>{r=e},cleanup:()=>{n&&(removeEventListener(`${t}_${n}`,c,!0),n=void 0)}};return h})({sendPrefix:"2C",listenPrefix:"2P"});n.init("LNlKJ"),e.showOpenFilePicker=ve((async()=>[]),t),
e.showDirectoryPicker=ve((async()=>{let e=0;for(;e++<50&&!r;)await te(100);if(!r)throw alert("No extension is there to communicate."),new DOMException("No extension is there to communicate.");return r}),t);const s=await(e=>new Promise((t=>{let i=1;const r=()=>{e.send("userscripts",{action:"list"},(e=>{!e||de(e)?setTimeout(r,Math.min(i*=2,5e3)):t(e.list)}))};r()})))(n),o=new x("unused",!1);!async function(e,t,i){
for(const{path:r,name:n,namespace:s,requires:o,storage:a}of t)[r,a,...o].filter((e=>e)).forEach((t=>{const[,r,...o]=t.split("/"),a=[pe(s||"<namespace missing>"),pe(n)];"external"===r&&a.push(r);const l=a.reduce(((e,t)=>(e._entries[t]||(e._entries[t]=new x(t,!1)),e._entries[t])),e),c="source"===r?"script.user.js":"storage"===r?"storage.json":o&&o.length?pe(decodeURIComponent(o.join("/"))):"<name missing>",d=new fe(c,t,i);l._entries[c]=new T(c,d,!0)}));new h(e)}(o,s,{
get:async(e,t,i)=>await me((async()=>{const{value:r,lastModified:s}=await((e,t,i)=>new Promise(((r,n)=>{const s=setTimeout((()=>n(new DOMException(he))),15e3);e.send("userscripts",{action:"get",path:t,ifNotModifiedSince:i},(e=>{if(clearTimeout(s),e&&!de(e)&&e.lastModified){const{value:t,lastModified:i}=e;r({value:t,lastModified:i})}else n(e?.error)}))})))(n,t,i);return new File([r||""],e,{lastModified:s})})),set:async(e,t,i)=>await me((async()=>{await((e,t,i,r)=>new Promise(((n,s)=>{
const o=setTimeout((()=>s(new DOMException(he))),15e3);e.send("userscripts",{action:"patch",path:t,value:i,lastModified:r},(e=>{clearTimeout(o),!e||e.error?s(e?.error):n()}))})))(n,t,await i.text(),i.lastModified)}))});const a=new ce;r=await async function(e,t={}){if(!e){if(!globalThis.navigator?.storage&&"http:"===globalThis.location?.protocol)throw new Error("Native getDirectory not supported in HTTP context. Please use HTTPS instead or provide an adapter.")
;if(!globalThis.navigator?.storage?.getDirectory)throw new Error("Native StorageManager.getDirectory() is not supported in current environment. Please provide an adapter instead.");return globalThis.navigator.storage.getDirectory()}const i=await e,r="function"==typeof i?await i(t):await i.default(t);return new d(r)}(S,{name:"Tampermonkey",eventEmitter:a,entries:o._entries}),t.FileSystemDirectoryHandle=ve(h,t),t.FileSystemFileHandle=ve(l,t);{const e=t.Reflect,r=t.Proxy;t.Worker=new r(i,ge({
construct:(t,[n,s])=>{const o=new i(n,s);let a;return new r(o,{get:(t,i)=>"postMessage"===i?e=>{const{method:t}=e;if("listDirectory"!==t&&"searchDirectory"!==t)o.postMessage(e);else{const{vsWorker:t,req:i,method:r}=e;setTimeout((()=>{a&&a({data:{vsWorker:t,seq:i,method:r,type:1,res:{results:[],limitHit:0}}})}),100)}}:["addEventListener","removeEventListener","terminate"].includes(i)?"addEventListener"===i?(e,t)=>"message"===e?(a=t,o.addEventListener(e,(e=>{a&&a(e)
}))):o.addEventListener(e,t):o[i].bind(o):e.get(t,i),set:(t,i,r)=>"onmessage"===i&&"function"==typeof r?(a=r,o.onmessage=e=>a&&a(e)):e.set(t,i,r)})}},t,{cloneFunctions:!0}))}le((()=>{const e=setInterval((()=>{let t=le(".codicon-folder-opened").parent()[0];if(!t){const e=le(".monaco-text-button"),i=e.text();"string"==typeof i&&-1!=i.indexOf("Open Folder")&&(t=e[0])}t&&(t.click(),console.log("Tampermonkey FileSystem automatically opened"),clearInterval(e))}),500)})),
console.log("Tampermonkey FileSystem registration finished")})(window)})();})()