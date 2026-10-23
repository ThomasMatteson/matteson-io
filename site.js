/* MTech shared script for the detail pages: blueprint switch, SVG helpers and the work-capsule motif. */
(function(){
'use strict';
var NS='http://www.w3.org/2000/svg';
var MT=window.MT={};
MT.$=function(s,r){return (r||document).querySelector(s)};
MT.$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
MT.S=function(tag,attrs,parent){var e=document.createElementNS(NS,tag);for(var k in attrs)e.setAttribute(k,attrs[k]);if(parent)parent.appendChild(e);return e};
MT.T=function(txt,attrs,parent){var e=MT.S('text',attrs,parent);e.textContent=txt;return e};
MT.ease=function(t){return t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2};
MT.clamp=function(x){return Math.max(0,Math.min(1,x))};
MT.reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* blueprint switch, remembered across pages */
var root=document.documentElement;
try{if(localStorage.getItem('mtech-bp')==='1')root.classList.add('bp')}catch(e){}
document.addEventListener('DOMContentLoaded',function(){
  var b=MT.$('#bp');if(!b)return;
  b.setAttribute('aria-checked',root.classList.contains('bp')?'true':'false');
  b.addEventListener('click',function(){var on=!root.classList.contains('bp');root.classList.toggle('bp',on);b.setAttribute('aria-checked',on?'true':'false');try{localStorage.setItem('mtech-bp',on?'1':'0')}catch(e){}});
});

/* drawing helpers */
MT.box=function(g,x,y,w,h,label,sub,cls){MT.S('rect',{x:x-w/2,y:y-h/2,width:w,height:h,class:cls||'ln fillp'},g);MT.T(label,{x:x,y:y+(sub?-3:4),class:'lblf',style:'text-anchor:middle'},g);if(sub)MT.T(sub,{x:x,y:y+13,class:'lbl',style:'text-anchor:middle;font-size:9.5px'},g)};
MT.arrow=function(g,x1,y1,x2,y2,cls){MT.S('line',{x1:x1,y1:y1,x2:x2,y2:y2,class:cls||'ln'},g);var a=Math.atan2(y2-y1,x2-x1),s=7;MT.S('path',{d:'M'+(x2-s*Math.cos(a-.5))+' '+(y2-s*Math.sin(a-.5))+'L'+x2+' '+y2+'L'+(x2-s*Math.cos(a+.5))+' '+(y2-s*Math.sin(a+.5)),class:cls||'ln'},g)};
MT.num=function(g,n,x,y,tx,ty){MT.S('line',{x1:x,y1:y,x2:tx,y2:ty,class:'thin'},g);MT.S('circle',{cx:x,cy:y,r:10,class:'num'},g);MT.T(n,{x:x,y:y+4,class:'numt'},g)};
MT.frame=function(svg,w,h){MT.S('rect',{x:8,y:8,width:w-16,height:h-16,class:'thin'},svg)};
MT.rr=function(x,y,w,h,r){return 'M'+(x+r)+' '+y+'H'+(x+w-r)+'A'+r+' '+r+' 0 0 1 '+(x+w)+' '+(y+r)+'V'+(y+h-r)+'A'+r+' '+r+' 0 0 1 '+(x+w-r)+' '+(y+h)+'H'+(x+r)+'A'+r+' '+r+' 0 0 1 '+x+' '+(y+h-r)+'V'+(y+r)+'A'+r+' '+r+' 0 0 1 '+(x+r)+' '+y+'Z'};

/* the work capsule: owner, authority, evidence and next action travel together */
MT.capsule=function(parent,w,rows){
  var g=MT.S('g',{},parent),h=22+rows.length*19;
  MT.S('rect',{x:-w/2,y:-h/2,width:w,height:h,class:'ln fillp'},g);
  MT.S('rect',{x:-w/2,y:-h/2,width:w,height:5,class:'fillacc'},g);
  var vals=rows.map(function(r,i){var y=-h/2+24+i*19;MT.T(r[0],{x:-w/2+10,y:y,class:'lbl',style:'font-size:9.5px'},g);return MT.T(r[1],{x:-w/2+w*.42,y:y,class:'lblf',style:'font-size:11px'},g)});
  return {g:g,vals:vals,h:h};
};

/* line icons (24 × 24, drawn with the current color); any element with data-icon gets one */
var IC={
  owner:'<circle cx="10" cy="8" r="4"/><path d="M3 21c0-4 3-7 7-7s7 3 7 7"/><path d="M16 11l2 2 4-4"/>',
  lock:'<rect x="5" y="11" width="14" height="10"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/><path d="M12 15v2"/>',
  key:'<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M17 6l3 3M15 8l2 2"/>',
  link:'<path d="M10 14a4 4 0 0 0 6 0l3-3a4 4 0 0 0-6-6l-1 1"/><path d="M14 10a4 4 0 0 0-6 0l-3 3a4 4 0 0 0 6 6l1-1"/>',
  eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  doc:'<path d="M6 2h9l5 5v15H6z"/><path d="M14 2v6h6M9 13h8M9 17h6"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>',
  flow:'<rect x="2" y="9" width="6" height="6"/><rect x="16" y="3" width="6" height="6"/><rect x="16" y="15" width="6" height="6"/><path d="M8 12h4M12 6v12M12 6h4M12 18h4"/>',
  gauge:'<path d="M3 17a9 9 0 1 1 18 0"/><path d="M12 17l4-6"/><path d="M3 21h18"/>',
  sensor:'<circle cx="12" cy="14" r="2"/><path d="M8 10a6 6 0 0 1 8 0M5 7a10 10 0 0 1 14 0M12 16v6"/>',
  camera:'<path d="M3 7h4l2-3h6l2 3h4v13H3z"/><circle cx="12" cy="13" r="4"/>',
  shield:'<path d="M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5z"/><path d="M8 12l3 3 5-6"/>',
  users:'<circle cx="9" cy="8" r="3.5"/><path d="M2 20c0-4 3-6 7-6s7 2 7 6"/><circle cx="17" cy="7" r="2.5"/><path d="M17 13c3 0 5 2 5 5"/>',
  chat:'<path d="M3 4h18v12H8l-5 4z"/><path d="M7 9h10M7 12h6"/>',
  layers:'<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',
  pin:'<path d="M12 22s7-7 7-12a7 7 0 0 0-14 0c0 5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/>',
  gas:'<path d="M6 18a4 4 0 0 1 0-8 6 6 0 0 1 11.5-1A4.5 4.5 0 0 1 18 18z"/><path d="M8 21h8"/>',
  pulse:'<path d="M2 12h4l2-5 4 10 2-5h8"/>',
  qr:'<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h3v3h-3zM18 18h3v3h-3zM14 21h1M21 14v1"/>',
  wrench:'<path d="M14 7a4 4 0 0 1 5-5l-3 3 2 2 3-3a4 4 0 0 1-5 5L8 17a2 2 0 0 1-3-3z"/>',
  stop:'<path d="M8 2h8l6 6v8l-6 6H8l-6-6V8z"/><path d="M8 12h8"/>',
  cloud:'<path d="M6 19a4 4 0 0 1-.5-8A6 6 0 0 1 17 9a5 5 0 0 1 1 10z"/>',
  chip:'<rect x="6" y="6" width="12" height="12"/><rect x="9" y="9" width="6" height="6"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/>',
  vr:'<path d="M2 8h20v9h-6l-2-3h-4l-2 3H2z"/><circle cx="7" cy="12" r="1.5"/><circle cx="17" cy="12" r="1.5"/>',
  book:'<path d="M4 4h7a3 3 0 0 1 3 3v14a2 2 0 0 0-2-2H4z"/><path d="M20 4h-6v15h6z"/>',
  spark:'<path d="M12 2v6M12 16v6M2 12h6M16 12h6M5 5l4 4M15 15l4 4M19 5l-4 4M9 15l-4 4"/>',
  check:'<rect x="3" y="3" width="18" height="18"/><path d="M7 12l3 3 7-7"/>',
  money:'<rect x="2" y="6" width="20" height="12"/><circle cx="12" cy="12" r="3"/><path d="M6 9v6M18 9v6"/>',
  truck:'<path d="M2 6h12v10H2zM14 10h4l3 3v3h-7z"/><circle cx="6" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
  box:'<path d="M3 7l9-4 9 4v10l-9 4-9-4z"/><path d="M3 7l9 4 9-4M12 11v10"/>'
};
MT.icon=function(n){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(IC[n]||IC.spark)+'</svg>'};
document.addEventListener('DOMContentLoaded',function(){MT.$$('[data-icon]').forEach(function(e){e.innerHTML=MT.icon(e.getAttribute('data-icon'))})});

/* run a loop only while its element is on screen */
MT.loop=function(el,draw){
  if(MT.reduce){draw(0,true);return}
  var t0=performance.now(),vis=true,raf=0;
  function f(now){raf=0;if(!vis)return;draw(Math.max(0,(now-t0)/1000),false);raf=requestAnimationFrame(f)}
  new IntersectionObserver(function(es){vis=es[0].isIntersecting;if(vis&&!raf)raf=requestAnimationFrame(f)}).observe(el);
  draw(0,false);
};
})();
