(function(t){function e(e){for(var r,o,a=e[0],c=e[1],h=e[2],u=0,f=[];u<a.length;u++)o=a[u],Object.prototype.hasOwnProperty.call(i,o)&&i[o]&&f.push(i[o][0]),i[o]=0;for(r in c)Object.prototype.hasOwnProperty.call(c,r)&&(t[r]=c[r]);d&&d(e);while(f.length)f.shift()();return s.push.apply(s,h||[]),n()}function n(){for(var t,e=0;e<s.length;e++){for(var n=s[e],r=!0,a=1;a<n.length;a++){var c=n[a];0!==i[c]&&(r=!1)}r&&(s.splice(e--,1),t=o(o.s=n[0]))}return t}var r={},i={app:0},s=[];function o(e){if(r[e])return r[e].exports;var n=r[e]={i:e,l:!1,exports:{}};return t[e].call(n.exports,n,n.exports,o),n.l=!0,n.exports}o.m=t,o.c=r,o.d=function(t,e,n){o.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},o.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},o.t=function(t,e){if(1&e&&(t=o(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(o.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)o.d(n,r,function(e){return t[e]}.bind(null,r));return n},o.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return o.d(e,"a",e),e},o.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},o.p="/";var a=window["webpackJsonp"]=window["webpackJsonp"]||[],c=a.push.bind(a);a.push=e,a=a.slice();for(var h=0;h<a.length;h++)e(a[h]);var d=c;s.push([0,"chunk-vendors"]),n()})({0:function(t,e,n){t.exports=n("56d7")},"034f":function(t,e,n){"use strict";var r=n("85ec"),i=n.n(r);i.a},5100:function(t,e,n){},"56d7":function(t,e,n){"use strict";n.r(e);n("e260"),n("e6cf"),n("cca6"),n("a79d");var r=n("2b0e"),i=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{attrs:{id:"app"}},[n("CanvasTool")],1)},s=[],o=function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",[r("div",[r("el-button-group",[r("el-button",{on:{click:function(e){return t.setType("rect")}}},[t._v("矩形")]),r("el-button",{on:{click:function(e){return t.setType("arc")}}},[t._v("圆形")]),r("el-button",{on:{click:function(e){return t.setType("pen")}}},[t._v("画笔")]),r("el-button",{on:{click:function(e){return t.clearCanvas()}}},[t._v("清空")])],1),r("img",{attrs:{src:n("cf05"),alt:""},on:{dragstart:function(e){return t.dragstart(e)}}})],1),r("canvas",{attrs:{id:"canvas",width:"500",height:"500"},on:{mousedown:t.cdown,mousemove:t.cmove,mouseup:t.cup,dragover:function(e){return t.dragoverCanvas(e)},drop:function(e){return t.dropCanvas(e)}}})])},a=[],c=(n("cb29"),n("9f12")),h=function t(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:100,i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:100,s=arguments.length>4&&void 0!==arguments[4]?arguments[4]:"",o=arguments.length>5&&void 0!==arguments[5]?arguments[5]:"rect";Object(c["a"])(this,t),this.x=e,this.y=n,this.width=r,this.height=i,this.imgSrc=s,this.renderType=o},d={name:"HelloWorld",data:function(){return{ctx:null,down:!1,draging:!1,downObj:{x:0,y:0},renderList:[],renderType:"rect"}},methods:{dragstart:function(t){var e={imgSrc:t.target.src,width:t.target.width,height:t.target.height};t.dataTransfer.setData("Text",JSON.stringify(e))},dragoverCanvas:function(t){t.preventDefault()},dropCanvas:function(t){t.preventDefault(),t.stopPropagation();var e=JSON.parse(t.dataTransfer.getData("Text")),n=e.imgSrc,r=e.width,i=e.height;this.renderList.push(new h(0,0,r,i,n,"img")),this.render()},drawImage:function(t){var e=this,n=new Image;n.src=t.imgSrc;var r=t.x,i=t.y,s=t.width,o=t.height;n.onload=function(){e.ctx.drawImage(n,r,i,s,o)}},cdown:function(t){this.down=!0;var e=t.offsetX,n=t.offsetY;if(this.downObj={x:e,y:n},this.isChoosed(t)){var r=this.choosedIndex;this.draging=!0,this.x=this.renderList[r].x,this.y=this.renderList[r].y}else this.draging=!1,this.renderList.push({x:e,y:n,width:0,height:0,renderType:this.renderType})},cmove:function(t){var e=t.offsetX,n=t.offsetY,r=this.downObj,i=r.x,s=r.y;if(this.down)if(this.draging){var o=this.choosedIndex;this.renderList[o].x=e>i?this.x+(e-i):this.x-(i-e),this.renderList[o].y=n>s?this.y+(n-s):this.y-(s-n),this.render()}else{var a=e-i,c=n-s;a<0&&(i+=a),c<0&&(s+=c),Object.assign(this.renderList[this.renderList.length-1],{x:i,y:s,width:Math.abs(a),height:Math.abs(c)}),this.render()}},cup:function(){this.down=!1,this.render()},isChoosed:function(t){for(var e=t.offsetX,n=t.offsetY,r=0;r<this.renderList.length;r++){var i=this.renderList[r],s=i.x,o=i.y,a=i.width,c=i.height;if(s<e&&e<a+s&&o<n&&n<o+c)return this.choosedIndex=r,!0}return!1},setType:function(t){this.renderType=t},render:function(){this.ctx.strokeStyle="#02BF0F",this.ctx.fillStyle="rgb(2,191,15,.2)",this.ctx.clearRect(0,0,500,500);for(var t=0;t<this.renderList.length;t++){var e=this.renderList[t],n=e.x,r=e.y,i=e.width,s=e.height,o=e.renderType;if(this.down)switch(o){case"rect":this.ctx.fillRect(n,r,i,s);break;case"arc":this.ctx.beginPath(),this.ctx.arc(n,r,s,0,2*Math.PI),this.ctx.fill();break;case"img":this.drawImage(this.renderList[t]);break}else switch(o){case"rect":this.ctx.strokeRect(n,r,i,s);break;case"arc":this.ctx.beginPath(),this.ctx.arc(n,r,s,0,2*Math.PI),this.ctx.stroke();break;case"img":this.drawImage(this.renderList[t]);break}}},clearCanvas:function(){this.renderList=[],this.ctx.clearRect(0,0,500,500)}},mounted:function(){this.ctx=document.getElementById("canvas").getContext("2d")}},u=d,f=(n("8791"),n("2877")),l=Object(f["a"])(u,o,a,!1,null,"40333b1a",null),p=l.exports,g={name:"app",components:{CanvasTool:p}},v=g,b=(n("034f"),Object(f["a"])(v,i,s,!1,null,null,null)),y=b.exports,x=n("5c96"),w=n.n(x);n("0fae");r["default"].use(w.a),r["default"].config.productionTip=!1,new r["default"]({render:function(t){return t(y)}}).$mount("#app")},"85ec":function(t,e,n){},8791:function(t,e,n){"use strict";var r=n("5100"),i=n.n(r);i.a},cf05:function(t,e,n){t.exports=n.p+"img/logo.82b9c7a5.png"}});
//# sourceMappingURL=app.c9baf734.js.map