"use strict";(self["webpackChunkspotter"]=self["webpackChunkspotter"]||[]).push([[8990],{48990:function(t,e,n){n.r(e),n.d(e,{createSwipeBackGesture:function(){return c}});var r=n(96587),o=n(80545),s=n(66515);
/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
const c=(t,e,n,c,i)=>{const a=t.ownerDocument.defaultView;let u=(0,o.i)(t);const h=t=>{const e=50,{startX:n}=t;return u?n>=a.innerWidth-e:n<=e},l=t=>u?-t.deltaX:t.deltaX,d=t=>u?-t.velocityX:t.velocityX,p=n=>(u=(0,o.i)(t),h(n)&&e()),f=t=>{const e=l(t),n=e/a.innerWidth;c(n)},k=t=>{const e=l(t),n=a.innerWidth,o=e/n,s=d(t),c=n/2,u=s>=0&&(s>.2||e>c),h=u?1-o:o,p=h*n;let f=0;if(p>5){const t=p/Math.abs(s);f=Math.min(t,540)}i(u,o<=0?.01:(0,r.h)(0,o,.9999),f)};return(0,s.createGesture)({el:t,gestureName:"goback-swipe",gesturePriority:40,threshold:10,canStart:p,onStart:n,onMove:f,onEnd:k})}}}]);
//# sourceMappingURL=8990.539dc2ff.js.map