"use strict";(self["webpackChunkspotter"]=self["webpackChunkspotter"]||[]).push([[4811],{24811:function(e,a,t){t.r(a),t.d(a,{ShareWeb:function(){return n}});var r=t(29895);class n extends r.Uw{async canShare(){return"undefined"!==typeof navigator&&navigator.share?{value:!0}:{value:!1}}async share(e){if("undefined"===typeof navigator||!navigator.share)throw this.unavailable("Share API not available in this browser");return await navigator.share({title:e.title,text:e.text,url:e.url}),{}}}}}]);
//# sourceMappingURL=4811.673d61fa.js.map