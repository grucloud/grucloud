"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[23783],{23783:(t,c,n)=>{n.d(c,{Z:()=>I});var e=n(63366);function a(t,c){(null==c||c>t.length)&&(c=t.length);for(var n=0,e=new Array(c);n<c;n++)e[n]=t[n];return e}function o(t){return function(t){if(Array.isArray(t))return a(t)}(t)||function(t){if("undefined"!=typeof Symbol&&null!=t[Symbol.iterator]||null!=t["@@iterator"])return Array.from(t)}(t)||function(t,c){if(t){if("string"==typeof t)return a(t,c);var n=Object.prototype.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?a(t,c):void 0}}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function r(t){return r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},r(t)}function i(t){var c=function(t,c){if("object"!==r(t)||null===t)return t;var n=t[Symbol.toPrimitive];if(void 0!==n){var e=n.call(t,c||"default");if("object"!==r(e))return e;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===c?String:Number)(t)}(t,"string");return"symbol"===r(c)?c:String(c)}function l(t,c,n){return(c=i(c))in t?Object.defineProperty(t,c,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[c]=n,t}var s=n(67294),u=n(87462);function f(t,c){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var e=Object.getOwnPropertySymbols(t);c&&(e=e.filter((function(c){return Object.getOwnPropertyDescriptor(t,c).enumerable}))),n.push.apply(n,e)}return n}function p(t){for(var c=1;c<arguments.length;c++){var n=null!=arguments[c]?arguments[c]:{};c%2?f(Object(n),!0).forEach((function(c){l(t,c,n[c])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):f(Object(n)).forEach((function(c){Object.defineProperty(t,c,Object.getOwnPropertyDescriptor(n,c))}))}return t}var y={};function g(t){var c=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=arguments.length>2?arguments[2]:void 0;return function(t){if(0===t.length||1===t.length)return t;var c,n,e=t.join(".");return y[e]||(y[e]=0===(n=(c=t).length)||1===n?c:2===n?[c[0],c[1],"".concat(c[0],".").concat(c[1]),"".concat(c[1],".").concat(c[0])]:3===n?[c[0],c[1],c[2],"".concat(c[0],".").concat(c[1]),"".concat(c[0],".").concat(c[2]),"".concat(c[1],".").concat(c[0]),"".concat(c[1],".").concat(c[2]),"".concat(c[2],".").concat(c[0]),"".concat(c[2],".").concat(c[1]),"".concat(c[0],".").concat(c[1],".").concat(c[2]),"".concat(c[0],".").concat(c[2],".").concat(c[1]),"".concat(c[1],".").concat(c[0],".").concat(c[2]),"".concat(c[1],".").concat(c[2],".").concat(c[0]),"".concat(c[2],".").concat(c[0],".").concat(c[1]),"".concat(c[2],".").concat(c[1],".").concat(c[0])]:n>=4?[c[0],c[1],c[2],c[3],"".concat(c[0],".").concat(c[1]),"".concat(c[0],".").concat(c[2]),"".concat(c[0],".").concat(c[3]),"".concat(c[1],".").concat(c[0]),"".concat(c[1],".").concat(c[2]),"".concat(c[1],".").concat(c[3]),"".concat(c[2],".").concat(c[0]),"".concat(c[2],".").concat(c[1]),"".concat(c[2],".").concat(c[3]),"".concat(c[3],".").concat(c[0]),"".concat(c[3],".").concat(c[1]),"".concat(c[3],".").concat(c[2]),"".concat(c[0],".").concat(c[1],".").concat(c[2]),"".concat(c[0],".").concat(c[1],".").concat(c[3]),"".concat(c[0],".").concat(c[2],".").concat(c[1]),"".concat(c[0],".").concat(c[2],".").concat(c[3]),"".concat(c[0],".").concat(c[3],".").concat(c[1]),"".concat(c[0],".").concat(c[3],".").concat(c[2]),"".concat(c[1],".").concat(c[0],".").concat(c[2]),"".concat(c[1],".").concat(c[0],".").concat(c[3]),"".concat(c[1],".").concat(c[2],".").concat(c[0]),"".concat(c[1],".").concat(c[2],".").concat(c[3]),"".concat(c[1],".").concat(c[3],".").concat(c[0]),"".concat(c[1],".").concat(c[3],".").concat(c[2]),"".concat(c[2],".").concat(c[0],".").concat(c[1]),"".concat(c[2],".").concat(c[0],".").concat(c[3]),"".concat(c[2],".").concat(c[1],".").concat(c[0]),"".concat(c[2],".").concat(c[1],".").concat(c[3]),"".concat(c[2],".").concat(c[3],".").concat(c[0]),"".concat(c[2],".").concat(c[3],".").concat(c[1]),"".concat(c[3],".").concat(c[0],".").concat(c[1]),"".concat(c[3],".").concat(c[0],".").concat(c[2]),"".concat(c[3],".").concat(c[1],".").concat(c[0]),"".concat(c[3],".").concat(c[1],".").concat(c[2]),"".concat(c[3],".").concat(c[2],".").concat(c[0]),"".concat(c[3],".").concat(c[2],".").concat(c[1]),"".concat(c[0],".").concat(c[1],".").concat(c[2],".").concat(c[3]),"".concat(c[0],".").concat(c[1],".").concat(c[3],".").concat(c[2]),"".concat(c[0],".").concat(c[2],".").concat(c[1],".").concat(c[3]),"".concat(c[0],".").concat(c[2],".").concat(c[3],".").concat(c[1]),"".concat(c[0],".").concat(c[3],".").concat(c[1],".").concat(c[2]),"".concat(c[0],".").concat(c[3],".").concat(c[2],".").concat(c[1]),"".concat(c[1],".").concat(c[0],".").concat(c[2],".").concat(c[3]),"".concat(c[1],".").concat(c[0],".").concat(c[3],".").concat(c[2]),"".concat(c[1],".").concat(c[2],".").concat(c[0],".").concat(c[3]),"".concat(c[1],".").concat(c[2],".").concat(c[3],".").concat(c[0]),"".concat(c[1],".").concat(c[3],".").concat(c[0],".").concat(c[2]),"".concat(c[1],".").concat(c[3],".").concat(c[2],".").concat(c[0]),"".concat(c[2],".").concat(c[0],".").concat(c[1],".").concat(c[3]),"".concat(c[2],".").concat(c[0],".").concat(c[3],".").concat(c[1]),"".concat(c[2],".").concat(c[1],".").concat(c[0],".").concat(c[3]),"".concat(c[2],".").concat(c[1],".").concat(c[3],".").concat(c[0]),"".concat(c[2],".").concat(c[3],".").concat(c[0],".").concat(c[1]),"".concat(c[2],".").concat(c[3],".").concat(c[1],".").concat(c[0]),"".concat(c[3],".").concat(c[0],".").concat(c[1],".").concat(c[2]),"".concat(c[3],".").concat(c[0],".").concat(c[2],".").concat(c[1]),"".concat(c[3],".").concat(c[1],".").concat(c[0],".").concat(c[2]),"".concat(c[3],".").concat(c[1],".").concat(c[2],".").concat(c[0]),"".concat(c[3],".").concat(c[2],".").concat(c[0],".").concat(c[1]),"".concat(c[3],".").concat(c[2],".").concat(c[1],".").concat(c[0])]:void 0),y[e]}(t.filter((function(t){return"token"!==t}))).reduce((function(t,c){return p(p({},t),n[c])}),c)}function m(t){return t.join(" ")}function v(t){var c=t.node,n=t.stylesheet,e=t.style,a=void 0===e?{}:e,o=t.useInlineStyles,r=t.key,i=c.properties,l=c.type,f=c.tagName,y=c.value;if("text"===l)return y;if(f){var h,b=function(t,c){var n=0;return function(e){return n+=1,e.map((function(e,a){return v({node:e,stylesheet:t,useInlineStyles:c,key:"code-segment-".concat(n,"-").concat(a)})}))}}(n,o);if(o){var d=Object.keys(n).reduce((function(t,c){return c.split(".").forEach((function(c){t.includes(c)||t.push(c)})),t}),[]),N=i.className&&i.className.includes("token")?["token"]:[],O=i.className&&N.concat(i.className.filter((function(t){return!d.includes(t)})));h=p(p({},i),{},{className:m(O)||void 0,style:g(i.className,Object.assign({},i.style,a),n)})}else h=p(p({},i),{},{className:m(i.className)});var S=b(c.children);return s.createElement(f,(0,u.Z)({key:r},h),S)}}const h=function(t,c){return-1!==t.listLanguages().indexOf(c)};var b=["language","children","style","customStyle","codeTagProps","useInlineStyles","showLineNumbers","showInlineLineNumbers","startingLineNumber","lineNumberContainerStyle","lineNumberStyle","wrapLines","wrapLongLines","lineProps","renderer","PreTag","CodeTag","code","astGenerator"];function d(t,c){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var e=Object.getOwnPropertySymbols(t);c&&(e=e.filter((function(c){return Object.getOwnPropertyDescriptor(t,c).enumerable}))),n.push.apply(n,e)}return n}function N(t){for(var c=1;c<arguments.length;c++){var n=null!=arguments[c]?arguments[c]:{};c%2?d(Object(n),!0).forEach((function(c){l(t,c,n[c])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):d(Object(n)).forEach((function(c){Object.defineProperty(t,c,Object.getOwnPropertyDescriptor(n,c))}))}return t}var O=/\n/g;function S(t){var c=t.codeString,n=t.codeStyle,e=t.containerStyle,a=void 0===e?{float:"left",paddingRight:"10px"}:e,o=t.numberStyle,r=void 0===o?{}:o,i=t.startingLineNumber;return s.createElement("code",{style:Object.assign({},n,a)},function(t){var c=t.lines,n=t.startingLineNumber,e=t.style;return c.map((function(t,c){var a=c+n;return s.createElement("span",{key:"line-".concat(c),className:"react-syntax-highlighter-line-number",style:"function"==typeof e?e(a):e},"".concat(a,"\n"))}))}({lines:c.replace(/\n$/,"").split("\n"),style:r,startingLineNumber:i}))}function w(t,c){return{type:"element",tagName:"span",properties:{key:"line-number--".concat(t),className:["comment","linenumber","react-syntax-highlighter-line-number"],style:c},children:[{type:"text",value:t}]}}function j(t,c,n){var e,a={display:"inline-block",minWidth:(e=n,"".concat(e.toString().length,".25em")),paddingRight:"1em",textAlign:"right",userSelect:"none"},o="function"==typeof t?t(c):t;return N(N({},a),o)}function P(t){var c=t.children,n=t.lineNumber,e=t.lineNumberStyle,a=t.largestLineNumber,o=t.showInlineLineNumbers,r=t.lineProps,i=void 0===r?{}:r,l=t.className,s=void 0===l?[]:l,u=t.showLineNumbers,f=t.wrapLongLines,p="function"==typeof i?i(n):i;if(p.className=s,n&&o){var y=j(e,n,a);c.unshift(w(n,y))}return f&u&&(p.style=N(N({},p.style),{},{display:"flex"})),{type:"element",tagName:"span",properties:p,children:c}}function L(t){for(var c=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[],n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:[],e=0;e<t.length;e++){var a=t[e];if("text"===a.type)n.push(P({children:[a],className:o(new Set(c))}));else if(a.children){var r=c.concat(a.properties.className);L(a.children,r).forEach((function(t){return n.push(t)}))}}return n}function k(t,c,n,e,a,o,r,i,l){var s,u=L(t.value),f=[],p=-1,y=0;function g(t,o){var s=arguments.length>2&&void 0!==arguments[2]?arguments[2]:[];return c||s.length>0?function(t,c){return P({children:t,lineNumber:c,lineNumberStyle:i,largestLineNumber:r,showInlineLineNumbers:a,lineProps:n,className:arguments.length>2&&void 0!==arguments[2]?arguments[2]:[],showLineNumbers:e,wrapLongLines:l})}(t,o,s):function(t,c){if(e&&c&&a){var n=j(i,c,r);t.unshift(w(c,n))}return t}(t,o)}for(var m=function(){var t=u[y],c=t.children[0].value;if(c.match(O)){var n=c.split("\n");n.forEach((function(c,a){var r=e&&f.length+o,i={type:"text",value:"".concat(c,"\n")};if(0===a){var l=g(u.slice(p+1,y).concat(P({children:[i],className:t.properties.className})),r);f.push(l)}else if(a===n.length-1){var s=u[y+1]&&u[y+1].children&&u[y+1].children[0],m={type:"text",value:"".concat(c)};if(s){var v=P({children:[m],className:t.properties.className});u.splice(y+1,0,v)}else{var h=g([m],r,t.properties.className);f.push(h)}}else{var b=g([i],r,t.properties.className);f.push(b)}})),p=y}y++};y<u.length;)m();if(p!==u.length-1){var v=u.slice(p+1,u.length);if(v&&v.length){var h=g(v,e&&f.length+o);f.push(h)}}return c?f:(s=[]).concat.apply(s,f)}function E(t){var c=t.rows,n=t.stylesheet,e=t.useInlineStyles;return c.map((function(t,c){return v({node:t,stylesheet:n,useInlineStyles:e,key:"code-segement".concat(c)})}))}function x(t){return t&&void 0!==t.highlightAuto}function I(t,c){return function(n){var a=n.language,o=n.children,r=n.style,i=void 0===r?c:r,l=n.customStyle,u=void 0===l?{}:l,f=n.codeTagProps,p=void 0===f?{className:a?"language-".concat(a):void 0,style:N(N({},i['code[class*="language-"]']),i['code[class*="language-'.concat(a,'"]')])}:f,y=n.useInlineStyles,g=void 0===y||y,m=n.showLineNumbers,v=void 0!==m&&m,d=n.showInlineLineNumbers,O=void 0===d||d,w=n.startingLineNumber,j=void 0===w?1:w,P=n.lineNumberContainerStyle,L=n.lineNumberStyle,I=void 0===L?{}:L,A=n.wrapLines,C=n.wrapLongLines,D=void 0!==C&&C,T=n.lineProps,G=void 0===T?{}:T,Z=n.renderer,R=n.PreTag,V=void 0===R?"pre":R,$=n.CodeTag,M=void 0===$?"code":$,U=n.code,W=void 0===U?(Array.isArray(o)?o[0]:o)||"":U,q=n.astGenerator,z=function(t,c){if(null==t)return{};var n,a,o=(0,e.Z)(t,c);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);for(a=0;a<r.length;a++)n=r[a],c.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(t,n)&&(o[n]=t[n])}return o}(n,b);q=q||t;var B=v?s.createElement(S,{containerStyle:P,codeStyle:p.style||{},numberStyle:I,startingLineNumber:j,codeString:W}):null,F=i.hljs||i['pre[class*="language-"]']||{backgroundColor:"#fff"},H=x(q)?"hljs":"prismjs",J=g?Object.assign({},z,{style:Object.assign({},F,u)}):Object.assign({},z,{className:z.className?"".concat(H," ").concat(z.className):H,style:Object.assign({},u)});if(p.style=N(N({},p.style),{},D?{whiteSpace:"pre-wrap"}:{whiteSpace:"pre"}),!q)return s.createElement(V,J,B,s.createElement(M,p,W));(void 0===A&&Z||D)&&(A=!0),Z=Z||E;var K=[{type:"text",value:W}],Q=function(t){var c=t.astGenerator,n=t.language,e=t.code,a=t.defaultCodeValue;if(x(c)){var o=h(c,n);return"text"===n?{value:a,language:"text"}:o?c.highlight(n,e):c.highlightAuto(e)}try{return n&&"text"!==n?{value:c.highlight(e,n)}:{value:a}}catch(r){return{value:a}}}({astGenerator:q,language:a,code:W,defaultCodeValue:K});null===Q.language&&(Q.value=K);var X=k(Q,A,G,v,O,j,Q.value.length+j,I,D);return s.createElement(V,J,s.createElement(M,p,!O&&B,Z({rows:X,stylesheet:i,useInlineStyles:g})))}}}}]);