/* MTech RTU experience: a compressor failure on a rooftop unit, from a sensor alert to verified operation.
   The technician does the work, the glasses guide the next step, AI QC checks and documents as it happens,
   and digital coworkers coordinate around it. Every action visibly produces its result before the next one starts.
   Shared by the home page (short) and Field awareness (full). Usage: MTRTU(element, {full:true|false}). */
(function(){
'use strict';
function el(tag,cls,txt){var e=document.createElement(tag);if(cls)e.className=cls;if(txt!=null)e.textContent=txt;return e}
function clamp(x){return Math.max(0,Math.min(1,x))}
function ease(t){return t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2}
function mix(a,b,t){return a+(b-a)*t}
var REDUCE=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
/* phones get a lighter scene: lower resolution, smaller shadows, 30 fps */
var PHONE=window.matchMedia('(max-width:700px), (pointer:coarse)').matches;
var PLAY='<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2l10 6-10 6z"/></svg>',PAUSE='<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 2h4v12H3zM9 2h4v12H9z"/></svg>',AGAIN='<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 2a6 6 0 1 1-5.6 3.8l1.8.8A4 4 0 1 0 8 4v2L4.5 3 8 0z"/></svg>';

/* the four parts of the idea; one lights up whenever it is doing something */
var ROLES=[['tech','The technician','does the work'],['glasses','MTech glasses','guide the next step'],['ai','AI QC','checks and documents'],['cw','Digital coworkers','coordinate around it']];

/* the SVS job record, in story order; rows appear only once the story reaches them (f: full version only) */
var FIELDS=[['asset','Unit'],['problem','Problem'],['visit','Visit'],['volts','Line voltage',1],['reading','Compressor test'],['evidence','Evidence'],['diag','Diagnosis'],['part','Part'],['approval','Approval'],
  ['recovery','Refrigerant',1],['assetupd','Asset record'],['test','Pressure test',1],['result','Result'],['package','Completion']];

/* six moments: a plain sentence, a short explanation that is always shown, and the detail behind "What just happened?" */
function B(t,fn,f){return {t:t,fn:fn,f:!!f}}
var MOM=[
 {k:'Alert',h:'The building is getting warm',plain:'The building is getting warm. A connected sensor alerts the service team.',
  short:'A sensor on the rooftop unit sees warm air and a stopped compressor. SVS opens a job for that exact unit, with its service history attached.',
  more:'The sensor measures supply-air temperature and compressor current. The compressor tripped on locked-rotor current and stopped, and supply air climbed from about 55 °F to 71 °F. The alert is a clue, not a diagnosis: the technician still has to prove what failed.',dur:12,sdur:9,
  beats:[B(0,function(S){S.cam('aerial');S.lens(0);S.tech(0);S.fault('rising');S.iot(1);S.chip('iot',1)}),B(.25,function(S){S.fault('tripped')}),
   B(.36,function(S){S.role('ai');S.link('iot','problem','Warm air · compressor stopped','From the unit’s sensor')}),
   B(.62,function(S){S.role('cw');S.focus('cw');S.feed('Service','Opened a same-day visit for RTU-3 and assigned a technician.')}),
   B(.74,function(S){S.link('feed','visit','Same day · technician assigned','Added by the service coworker')}),B(.92,function(S){S.chip('iot',0);S.focus(0)})]},
 {k:'Arrive',h:'The technician arrives knowing which unit and why',plain:'The technician arrives knowing which unit and why.',
  short:'From here on we are looking through the technician’s MTech glasses. They match the unit to the job and show the problem and last service beside it.',
  more:'There are three identical units on this roof. The glasses read RTU-3’s tag and match it to the open job, so nobody guesses. The problem from the sensor and the March service note appear next to the equipment. It is a focused starting point; the diagnosis still has to come from evidence.',dur:14,sdur:11,
  beats:[B(0,function(S){S.iot(0);S.cam('tech');S.tech(1);S.role('tech');S.chip('tech',1)}),B(.26,function(S){S.chip('tech',0);S.cam('approach')}),B(.4,function(S){S.tech(0);S.lens(1);S.role('glasses')}),
   B(.46,function(S){S.scan();S.chip('n2',1);S.chip('n4',1)},1),B(.5,function(S){S.chip('tag',1)}),B(.62,function(S){S.chip('sym',1)}),B(.73,function(S){S.chip('hist',1)}),
   B(.86,function(S){['n2','n4','tag','sym','hist'].forEach(function(c){S.chip(c,0)});S.instr('First: open the compressor compartment')})]},
 {k:'Check',h:'The glasses guide the check',plain:'The glasses guide the check. The record fills itself in.',
  short:'The technician tests the compressor and says the reading out loud. It is recorded in the job automatically, then AI QC checks the photo of the meter.',
  more:'One instruction at a time: measure across the compressor windings. “C to R reads open” means the winding inside the compressor has failed, so it cannot run. The spoken reading becomes a field in SVS without typing, and AI QC confirms the meter photo shows the same value before it counts as evidence.',dur:18,sdur:16,
  beats:[B(0,function(S){S.cam('compartment');S.panel(1);S.role('glasses');S.instr('Test the compressor')}),
   B(.08,function(S){S.hands('meter');S.meter('462');S.hl('contactor');S.instr('Check line voltage at the contactor')},1),B(.12,function(S){S.role('tech');S.voice('“Line voltage, four sixty-two.”','volts','462 V · normal')},1),
   B(.3,function(S){S.role('glasses');S.hands('meter');S.meter('O.L');S.hl('compressor');S.instr('Measure the windings: C to R')}),B(.38,function(S){S.role('tech');S.voice('“C to R reads open.”','reading','Winding open · compressor failed')}),
   B(.6,function(S){S.hl(0);S.role('ai');S.qc('meter',1,'Meter photo',['Reading visible','Matches what was said'],'94% match · high confidence','evidence','Meter photo · checked')}),
   B(.88,function(S){S.role('glasses');S.chip('comp',1);S.fill('diag','Compressor failed · replace','Backed by the reading and photo');S.ready('Diagnosis recorded')})]},
 {k:'Plan',h:'Coworkers arrange the replacement',plain:'The compressor has failed. Coworkers arrange the replacement.',
  short:'The parts coworker finds a replacement at the branch. The project coworker gets the customer’s approval and books delivery. The technician sees the plan.',
  more:'The diagnosis, reading and photo go to the parts coworker, which checks the van, the branch and the supplier. Because the repair is above what the visit is pre-approved to spend, the project coworker sends the quote to the store’s facilities manager and books the delivery once it is approved. The technician never leaves the roof to arrange any of it.',dur:15,sdur:12,
  beats:[B(0,function(S){S.cam('roofwide');S.hands(0);S.hl(0);S.instr(0);S.chip('comp',0);S.role('cw');S.focus('cw');S.toast('The parts coworker is finding the replacement')}),
   B(.12,function(S){S.feed('Parts','Checking the van, the branch and the supplier…')}),B(.3,function(S){S.feed('Parts','Found one: a CMP-54 compressor at the branch, 12 miles away.')}),
   B(.4,function(S){S.link('feed','part','CMP-54 compressor · branch stock','Added by the parts coworker')}),
   B(.56,function(S){S.toast('The project coworker is getting approval');S.feed('Project','Above the visit’s pre-approved limit. Quote sent to the store’s facilities manager.')}),
   B(.7,function(S){S.feed('Project','Approved at 10:41. Delivery booked for 11:30.');S.link('feed','approval','Approved · delivery 11:30','Added by the project coworker')}),
   B(.86,function(S){S.focus(0);S.role('glasses');S.instr('Plan: recover refrigerant now · compressor arrives 11:30');S.comp('dolly');S.chip('newc',1)})]},
 {k:'Repair',h:'The technician replaces the compressor',plain:'The technician replaces it. AI checks each photo as it is taken.',
  short:'A photo that misses the serial number is caught on the spot, and the glasses show exactly what to retake. The accepted photo updates the unit’s record.',
  more:'Key steps of the repair: recover the refrigerant, swap the compressor, braze it in under nitrogen, then pressure-test and evacuate. AI QC reads each photo as it is taken. The first nameplate photo cuts off the serial number, so it is rejected while the technician is still there; the retake is accepted and proposed as an update to the unit’s asset record in SVS.',dur:22,sdur:16,
  beats:[B(0,function(S){S.chip('newc',0);S.cam('compartment2');S.hands('gauges');S.role('tech');S.instr('Recover the refrigerant')},1),B(.06,function(S){S.voice('“Recovered eleven point two pounds.”','recovery','11.2 lb recovered')},1),
   B(.2,function(S){S.chip('newc',0);S.cam('compartment2');S.comp('installed');S.hands('torch');S.role('tech');S.instr('Braze in the new compressor')}),
   B(.34,function(S){S.hands(0);S.role('glasses');S.instr('Photograph the new compressor’s nameplate');S.hl('plate')}),
   B(.36,function(S){S.role('ai');S.qc('plate',0,'Nameplate photo',['Nameplate in frame','Serial number readable'],'23% match · serial cut off')}),
   B(.56,function(S){S.role('ai');S.qc('plate',1,'Nameplate photo · retake',['Nameplate in frame','Serial number readable'],'91% match · high confidence','assetupd','New compressor CMP-54 · SN 26K118432')}),
   B(.82,function(S){S.hl(0);S.ready('Photo accepted')}),
   B(.87,function(S){S.role('tech');S.hands('gauges');S.voice('“Holding three hundred for fifteen.”','test','300 psi · held 15 min')},1),
   B(.97,function(S){S.hands(0);S.role('glasses');S.instr('Restore power and start the unit')})]},
 {k:'Verify',h:'The unit runs again',plain:'The unit runs again, and the paperwork is already done.',
  short:'The sensor shows the air cooling back to normal. AI QC checks the results and saves the completion package, and coworkers start the invoice and the warranty claim.',
  more:'After restart, supply air falls back toward 55 °F and the compressor draws 14.2 A, within its rating. AI QC compares the readings and photos with what this repair requires, and SVS receives the completion package. The technician walks away from a working unit with nothing left to write up, while billing and the warranty claim on the failed compressor are already moving.',dur:16,sdur:13,
  beats:[B(0,function(S){S.cam('verify');S.panel(0);S.hands(0);S.instr(0);S.fault('running');S.iot(1);S.role('tech')}),B(.12,function(S){S.chip('fan',1)}),
   B(.3,function(S){S.chip('fan',0);S.role('ai');S.link('iot','result','Cooling restored · supply air 55 °F','From the unit’s sensor')}),
   B(.46,function(S){S.chip('qcf',1);S.fill('package','Readings, photos and notes · accepted','Checked by AI QC')}),
   B(.62,function(S){S.chip('qcf',0);S.role('cw');S.focus('cw');S.feed('Accounting','Invoice prepared from the approved quote.')}),
   B(.72,function(S){S.feed('Warranty','Warranty claim filed for the failed compressor, with the photos.')}),
   B(.86,function(S){S.focus(0);S.role(0);S.iot(0);S.cam('walkaway');S.lens(0);S.chip('done',1)})]}
];

window.MTRTU=function(root,opt){
  opt=opt||{};var full=!!opt.full;
  var moms=MOM.map(function(m){return {m:m,d:full?m.dur:m.sdur,beats:m.beats.filter(function(b){return full||!b.f})}});

  /* ---------- DOM ---------- */
  root.classList.add('rtu');root.innerHTML='';
  var main=el('div','rtu-main'),side=el('div','rtu-side');root.appendChild(main);root.appendChild(side);
  var roles=el('ol','rtu-roles');roles.setAttribute('aria-label','Who is doing what');var roleEl={};
  ROLES.forEach(function(r){var li=el('li');li.appendChild(el('b','',r[1]));li.appendChild(el('span','',r[2]));roles.appendChild(li);roleEl[r[0]]=li});main.appendChild(roles);
  var stage=el('div','rtu-stage');main.appendChild(stage);
  stage.setAttribute('role','img');stage.setAttribute('aria-label','Simulation of a rooftop unit compressor repair, partly seen through the technician’s MTech glasses');
  var cv=el('canvas');cv.setAttribute('aria-hidden','true');stage.appendChild(cv);
  var labels=el('div','rtu-labels');stage.appendChild(labels);
  var lens=el('div','rtu-lens');lens.appendChild(el('span','','Technician’s view through MTech glasses'));stage.appendChild(lens);
  var tagSim=el('span','rtu-sim','Simulation');stage.appendChild(tagSim);
  var iot=el('div','rtu-iot');iot.innerHTML='<div class="t"><span>Sensor on RTU-3</span><b>Normal</b></div><svg viewBox="0 0 120 40" preserveAspectRatio="none"><rect class="band" x="0" y="22" width="120" height="10"/><polyline class="ln2" points=""/></svg><div class="row"><i>Air from the unit</i><span class="sa"></span></div><div class="row"><i>Compressor</i><span class="ca"></span></div>';stage.appendChild(iot);
  var instr=el('div','rtu-instr');stage.appendChild(instr);
  var say=el('div','rtu-say');stage.appendChild(say);
  var shot=el('div','rtu-shot');shot.innerHTML='<i class="a"></i><i class="b"></i><i class="c"></i><i class="d"></i>';stage.appendChild(shot);
  var flash=el('div','rtu-flash');stage.appendChild(flash);
  var qcCard=el('div','rtu-qc');qcCard.innerHTML='<header><b>AI QC</b><span>Checking photo</span></header><canvas width="240" height="150"></canvas><p class="w"></p><ul></ul><p class="s"></p><p class="v"></p>';stage.appendChild(qcCard);
  var thumb=qcCard.querySelector('canvas'),tctx=thumb.getContext('2d');
  var toastEl=el('div','rtu-toast');stage.appendChild(toastEl);
  var story=el('div','rtu-story');story.setAttribute('aria-live','polite');var stN=el('span','n'),stP=el('p','pl'),stS=el('p','sh');story.appendChild(stN);story.appendChild(stP);story.appendChild(stS);main.appendChild(story);
  var ctl=el('div','rtu-ctl');main.appendChild(ctl);
  var playB=el('button','rtu-play');playB.type='button';ctl.appendChild(playB);
  var chs=el('ol','rtu-chs');ctl.appendChild(chs);
  var chB=moms.map(function(x,i){var li=el('li'),b=el('button','',(i+1)+' '+x.m.k);b.type='button';b.setAttribute('aria-label','Chapter '+(i+1)+': '+x.m.h);b.addEventListener('click',function(){seek(i);play(true)});li.appendChild(b);chs.appendChild(li);return b});
  var why=el('button','rtu-why','What just happened?');why.type='button';why.setAttribute('aria-expanded','false');ctl.appendChild(why);
  var more=el('div','rtu-more');more.hidden=true;more.setAttribute('aria-live','polite');main.appendChild(more);
  why.addEventListener('click',function(){var o=more.hidden;more.hidden=!o;why.setAttribute('aria-expanded',o?'true':'false');renderMore()});
  function renderMore(){if(more.hidden)return;var m=moms[mi].m;more.innerHTML='';more.appendChild(el('b','',(mi+1)+' · '+m.h));more.appendChild(document.createTextNode(m.more))}
  var svs=el('section','rtu-box rtu-svs');svs.innerHTML='<header><b>SVS</b><i>Job record · RTU-3</i></header>';var dl=el('dl');svs.appendChild(dl);
  var fullB=el('button','rtu-full','Open full record');fullB.type='button';fullB.setAttribute('aria-expanded','false');svs.appendChild(fullB);
  fullB.addEventListener('click',function(){var o=!svs.classList.contains('open');svs.classList.toggle('open',o);fullB.textContent=o?'Show only what’s happened':'Open full record';fullB.setAttribute('aria-expanded',o?'true':'false')});
  side.appendChild(svs);
  var rows={};FIELDS.forEach(function(f){if(f[2]&&!full)return;var d=el('div','pending'),dt=el('dt','',f[1]),dd=el('dd'),v=el('span','v','—'),src=el('span','src');dd.appendChild(v);dd.appendChild(src);d.appendChild(dt);d.appendChild(dd);dl.appendChild(d);rows[f[0]]={d:d,v:v,src:src}});
  var cw=el('section','rtu-box rtu-cw');cw.innerHTML='<header><b>Digital coworkers</b><i>Same job</i></header>';var feedL=el('ol');cw.appendChild(feedL);side.appendChild(cw);
  var token=el('div','rtu-token');root.appendChild(token);

  /* ---------- 3D scene ---------- */
  var R=null;if(window.THREE){try{R=new THREE.WebGLRenderer({canvas:cv,antialias:true,powerPreference:'high-performance'})}catch(e){R=null}}
  var G={},scene,camera;
  if(R)build();else{root.classList.add('nogl');var nm=el('p','mono','This simulation needs WebGL. The record and coworker feed still play.');nm.style.padding='20px';stage.insertBefore(nm,labels)}

  function build(){
    var DPR=Math.min(PHONE?1.5:2,window.devicePixelRatio||1);R.setPixelRatio(DPR);R.shadowMap.enabled=true;R.shadowMap.type=THREE.PCFSoftShadowMap;R.toneMapping=THREE.ACESFilmicToneMapping;R.toneMappingExposure=1.05;R.setClearColor(0xdfe4e8);
    scene=new THREE.Scene();camera=new THREE.PerspectiveCamera(42,16/9,.03,260);scene.add(camera);
    var sd=7331;function rnd(){sd=(sd*16807)%2147483647;return (sd-1)/2147483646}
    function M(c,o){return new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:.7,metalness:.15},o||{}))}
    function mesh(g,m,x,y,z,par){var o=new THREE.Mesh(g,m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;(par||scene).add(o);return o}
    function bx(w,h,d){return new THREE.BoxGeometry(w,h,d)}
    function cy(r,h,s){return new THREE.CylinderGeometry(r,r,h,s||24)}
    var UP=new THREE.Vector3(0,1,0);
    function rod(a,b,r,m,par){var A=new THREE.Vector3(a[0],a[1],a[2]),Bv=new THREE.Vector3(b[0],b[1],b[2]),o=mesh(cy(r,1,10),m,0,0,0,par);o.position.copy(A).add(Bv).multiplyScalar(.5);o.quaternion.setFromUnitVectors(UP,Bv.clone().sub(A).normalize());o.scale.set(1,A.distanceTo(Bv),1);return o}
    function canvasTex(w,h,draw){var c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);var t=new THREE.CanvasTexture(c);t.anisotropy=4;return t}
    var GALV=M(0xc9cac4,{metalness:.45,roughness:.42}),GALV2=M(0xb9bbb6,{metalness:.45,roughness:.5}),DARK=M(0x3c4146,{metalness:.35,roughness:.6}),LOUV=M(0x5d6268,{metalness:.4,roughness:.5}),
        CURB=M(0x8f8a80,{roughness:.9}),COMP=M(0x26302c,{metalness:.35,roughness:.45}),NEWC=M(0x2d4b6b,{metalness:.35,roughness:.4}),COPPER=M(0xb8733f,{metalness:.8,roughness:.35}),
        YEL=M(0xe7b416,{roughness:.55}),WHITE=M(0xeeeeea,{roughness:.5}),GLOVE=M(0x55606b,{roughness:.85}),CUFF=M(0x2f353b,{roughness:.8}),METER=M(0xf2c230,{roughness:.5}),BLK=M(0x15181b,{roughness:.6}),
        CAVITY=M(0x2b3035,{roughness:.9}),PARA=M(0xb9b2a5,{roughness:.95}),COPE=M(0xa7aaab,{metalness:.5,roughness:.4});
    /* sky, roof membrane with seams, parapet, a city beyond */
    var skyG=new THREE.SphereGeometry(200,32,12,0,Math.PI*2,0,Math.PI/2+.05),cols=[],top=new THREE.Color(0x5b8fd0),hor=new THREE.Color(0xe9e6df);
    for(var i=0;i<skyG.attributes.position.count;i++){var y=skyG.attributes.position.getY(i)/200,c=hor.clone().lerp(top,Math.pow(Math.max(0,y),.6));cols.push(c.r,c.g,c.b)}
    skyG.setAttribute('color',new THREE.Float32BufferAttribute(cols,3));var sky=new THREE.Mesh(skyG,new THREE.MeshBasicMaterial({vertexColors:true,side:THREE.BackSide,fog:false,depthWrite:false}));sky.renderOrder=-10;scene.add(sky);
    var memb=canvasTex(512,512,function(x,w,h){x.fillStyle='#d6d8d4';x.fillRect(0,0,w,h);for(var k=0;k<7000;k++){x.fillStyle=['#cfd1cd','#dcdeda','#c8cac6'][k%3];x.fillRect(rnd()*w,rnd()*h,1.5,1.5)}x.strokeStyle='rgba(120,124,122,.45)';x.lineWidth=2;for(var s=0;s<=w;s+=128){x.beginPath();x.moveTo(s,0);x.lineTo(s,h);x.stroke()}});
    memb.wrapS=memb.wrapT=THREE.RepeatWrapping;memb.repeat.set(15,15);
    var street=mesh(new THREE.PlaneGeometry(800,800),M(0x9ba3a6,{roughness:1}),0,-14,0);street.rotation.x=-Math.PI/2;street.castShadow=false;
    var roof=mesh(new THREE.PlaneGeometry(60,60),M(0xffffff,{map:memb,roughness:.95}),0,0,0);roof.rotation.x=-Math.PI/2;roof.castShadow=false;
    [[0,-14,30,.25],[0,14,30,.25],[-15,0,.25,28],[15,0,.25,28]].forEach(function(p){mesh(bx(p[2],.8,p[3]),PARA,p[0],.4,p[1]);mesh(bx(p[2]+.1,.05,p[3]+.1),COPE,p[0],.82,p[1])});
    var city=new THREE.Group();scene.add(city);
    for(var b=0;b<46;b++){var a=-1.4+rnd()*2.8,dist=40+rnd()*55,bw=4+rnd()*9,bh=6+rnd()*26,bd=4+rnd()*9,cx=Math.sin(a)*dist,cz=-Math.cos(a)*dist;if(cz>-30)continue;
      var bm=mesh(bx(bw,bh,bd),M([0x9ea9b4,0xaeb6bd,0x8f9aa6,0xb7b2a8][b%4],{roughness:.9}),cx,bh/2-6,cz,city);bm.castShadow=false}
    /* hatch, an exhaust fan and conduit for a real rooftop */
    mesh(bx(.95,.35,.95),GALV2,-9,.175,6);mesh(bx(1,.06,1),GALV,-9,.38,6);
    mesh(cy(.32,.5),GALV,7,.25,3);mesh(new THREE.ConeGeometry(.42,.25,24),GALV,7,.62,3);
    rod([-12,.06,-1],[-2.2,.06,-1],.025,COPE);[-11,-8,-5,-2.5].forEach(function(x){mesh(bx(.12,.06,.18),DARK,x,.03,-1)});
    /* neighbours: identical units, so identification matters */
    function unit(x,z,par){var g=new THREE.Group();g.position.set(x,0,z);(par||scene).add(g);mesh(bx(2.7,.25,1.6),CURB,0,.125,0,g);mesh(bx(2.6,1.2,1.5),GALV,0,.93,0,g);
      var ring=mesh(new THREE.TorusGeometry(.46,.04,8,32),DARK,.75,1.56,0,g);ring.rotation.x=Math.PI/2;for(var l=0;l<16;l++)mesh(bx(.02,.025,1.3),LOUV,1.31,.45+l*.065,0,g);return g}
    unit(-6.2,-3.2);unit(5.8,-5.6);
    /* RTU-3 */
    var U=new THREE.Group();scene.add(U);G.U=U;
    mesh(bx(2.7,.25,1.6),CURB,0,.125,0,U);mesh(bx(2.62,.08,1.52),DARK,0,.29,0,U);
    mesh(bx(1.66,1.2,1.5),GALV,-.47,.93,0,U);mesh(bx(.94,.1,1.5),GALV,.83,1.48,0,U);mesh(bx(.94,.1,1.5),GALV,.83,.38,0,U);mesh(bx(.94,1.0,.95),GALV,.83,.93,-.275,U);mesh(bx(.04,1.0,.55),GALV,1.28,.93,.475,U);
    for(var l=0;l<16;l++){mesh(bx(.02,.025,1.32),LOUV,1.312,.43+l*.066,0,U);mesh(bx(1.1,.025,.02),LOUV,.7,.43+l*.066,-.762,U)}
    function door(x,w){var d=mesh(bx(w,.95,.02),GALV2,x,.92,.762,U);mesh(bx(.03,.14,.03),DARK,x+w/2-.08,.92,.785,U);return d}
    door(-.85,.7);door(-.1,.7);
    var cp=new THREE.Group();U.add(cp);G.cpanel=cp;mesh(bx(.84,.95,.02),GALV2,0,0,0,cp);mesh(bx(.03,.14,.03),DARK,-.34,0,.025,cp);cp.position.set(.8,.92,.762);
    var plate=mesh(bx(.24,.12,.005),new THREE.MeshStandardMaterial({map:canvasTex(256,128,function(x){x.fillStyle='#eef0ee';x.fillRect(0,0,256,128);x.fillStyle='#222';x.font='bold 30px Arial';x.fillText('RTU-3',14,44);x.font='20px Arial';x.fillText('PRU-090 · 460V 3PH',14,80);x.fillText('SN 2419G30871',14,110)}),roughness:.6}),-.85,1.43,.773,U);
    var qr=mesh(bx(.07,.07,.004),new THREE.MeshStandardMaterial({map:canvasTex(64,64,function(x){x.fillStyle='#fff';x.fillRect(0,0,64,64);x.fillStyle='#000';for(var a2=0;a2<8;a2++)for(var b2=0;b2<8;b2++)if((a2*7+b2*3+a2*b2)%3===0)x.fillRect(4+a2*7,4+b2*7,7,7);[[4,4],[46,4],[4,46]].forEach(function(q){x.fillRect(q[0],q[1],14,14);x.fillStyle='#fff';x.fillRect(q[0]+3,q[1]+3,8,8);x.fillStyle='#000';x.fillRect(q[0]+5,q[1]+5,4,4)})}),roughness:.6}),-.6,1.43,.773,U);
    /* compressor compartment */
    mesh(bx(.9,.98,.01),CAVITY,.83,.93,.206,U);mesh(bx(.9,.01,.54),CAVITY,.83,.435,.48,U);mesh(bx(.01,.98,.54),CAVITY,.365,.93,.48,U);
    function compressor(mat,par,plateTex){var g=new THREE.Group();(par||U).add(g);mesh(cy(.17,.4,28),mat,0,.2,0,g);mesh(new THREE.SphereGeometry(.17,28,12,0,Math.PI*2,0,Math.PI/2),mat,0,.4,0,g);
      mesh(cy(.2,.03,24),DARK,0,.015,0,g);mesh(bx(.09,.07,.04),DARK,0,.3,.17,g);rod([0,.47,0],[0,.62,0],.018,COPPER,g);rod([.17,.28,0],[.3,.28,0],.014,COPPER,g);
      if(plateTex){var p=mesh(bx(.11,.07,.004),new THREE.MeshStandardMaterial({map:plateTex,roughness:.5}),-.09,.17,.165,g);p.rotation.y=-.5}return g}
    var oldC=compressor(COMP);oldC.position.set(.85,.46,.45);G.oldC=oldC;
    var newTex=canvasTex(220,140,function(x){x.fillStyle='#f4f4f0';x.fillRect(0,0,220,140);x.fillStyle='#111';x.font='bold 26px Arial';x.fillText('CMP-54',12,36);x.font='18px Arial';x.fillText('SCROLL · R-410A',12,66);x.fillText('SN 26K118432',12,96);x.fillText('RLA 15.4 A',12,124)});
    var newC=compressor(NEWC,scene,newTex);G.newC=newC;
    var dolly=new THREE.Group();scene.add(dolly);dolly.position.set(2.3,0,1.5);G.dolly=dolly;rod([-.18,.02,-.12],[-.18,.95,-.18],.015,DARK,dolly);rod([.18,.02,-.12],[.18,.95,-.18],.015,DARK,dolly);mesh(bx(.42,.02,.28),DARK,0,.03,.02,dolly);
    [-.2,.2].forEach(function(x){var w=mesh(cy(.07,.04,16),BLK,x,.07,-.16,dolly);w.rotation.z=Math.PI/2});
    rod([.85,1.08,.45],[.85,1.25,.45],.018,COPPER,U);rod([.85,1.25,.45],[1.2,1.25,.32],.018,COPPER,U);rod([1.15,.74,.45],[1.25,.74,.3],.014,COPPER,U);
    mesh(bx(.06,.12,.09),M(0x9aa0a6,{roughness:.5}),.4,1.2,.48,U);mesh(cy(.035,.12,16),M(0xd0d3d6,{metalness:.6,roughness:.3}),.41,1.02,.34,U);var WIRE=M(0x222222);rod([.4,1.14,.48],[.4,.8,.6],.006,WIRE,U);rod([.4,.8,.6],[.8,.77,.63],.006,WIRE,U);
    G.pts={contactor:[.42,1.2,.5],compressor:[.85,.8,.62],plate:[.76,.63,.62],meter:[.6,1.07,1.02],fan:[.75,1.6,0],unit:[0,1.6,.75],tag:[-.85,1.43,.78]};
    /* condenser fan on top: grille ring and blades that spin when the unit runs */
    var fr=mesh(new THREE.TorusGeometry(.47,.035,8,36),DARK,.75,1.56,0,U);fr.rotation.x=Math.PI/2;
    for(var k=0;k<4;k++){var g2=mesh(new THREE.TorusGeometry(.1+k*.11,.006,6,32),DARK,.75,1.59,0,U);g2.rotation.x=Math.PI/2}
    var blades=new THREE.Group();blades.position.set(.75,1.54,0);U.add(blades);G.blades=blades;for(var k2=0;k2<3;k2++){var bl=mesh(bx(.4,.012,.12),DARK,.2,0,0,blades);bl.rotation.x=.35;var piv=new THREE.Group();piv.rotation.y=k2*Math.PI*2/3;blades.add(piv);piv.add(bl)}
    /* IoT sensor with antenna and status light, disconnect on a stand, gas line */
    mesh(bx(.06,.16,.12),WHITE,-1.33,1.15,.3,U);rod([-1.33,1.23,.34],[-1.33,1.4,.34],.006,DARK,U);var led=mesh(new THREE.SphereGeometry(.012,10,8),new THREE.MeshBasicMaterial({color:0x2dd4ff}),-1.365,1.18,.3,U);G.led=led;
    G.pts.iot=[-1.36,1.25,.3];
    rod([-1.9,0,1.05],[-1.9,1.05,1.05],.02,DARK);rod([-1.6,0,1.05],[-1.6,1.05,1.05],.02,DARK);mesh(bx(.26,.34,.14),M(0x8d9298,{metalness:.5,roughness:.45}),-1.75,.9,1.05);rod([-1.75,1.07,1.05],[-1.3,1.3,.6],.016,COPE);
    rod([-4,.1,-.6],[-1.6,.1,-.6],.03,YEL);rod([-1.6,.1,-.6],[-1.6,.5,-.6],.03,YEL);rod([-1.6,.5,-.6],[-1.3,.5,-.6],.03,YEL);[-3.5,-2.5].forEach(function(x){mesh(bx(.1,.08,.14),DARK,x,.04,-.6)});
    G.pts.n2=[-6.2,1.9,-3.2];G.pts.n4=[5.8,1.9,-5.6];G.pts.dolly=[2.3,1.05,1.5];G.pts.done=[0,2.1,0];
    /* gloved hands and the tools they hold */
    function hand(){var g=new THREE.Group();mesh(bx(.085,.03,.095),GLOVE,0,0,0,g);mesh(cy(.036,.05,14),CUFF,0,0,-.07,g).rotation.x=Math.PI/2;
      for(var f=0;f<4;f++){var fg=mesh(cy(.0095,.065,8),GLOVE,-.03+f*.02,-.008,.075,g);fg.rotation.x=Math.PI/2+.5}var th=mesh(cy(.011,.055,8),GLOVE,.05,-.004,.02,g);th.rotation.z=Math.PI/2;th.rotation.y=.6;scene.add(g);g.visible=false;return g}
    var hL=hand(),hR=hand();G.hL=hL;G.hR=hR;
    var meter=new THREE.Group();scene.add(meter);mesh(bx(.08,.15,.035),METER,0,0,0,meter);function lcd(t){return canvasTex(120,80,function(x){x.fillStyle='#b8c4a8';x.fillRect(0,0,120,80);x.fillStyle='#111';x.font='bold 46px monospace';x.textAlign='center';x.fillText(t,60,58)})}G.lcd={'O.L':lcd('O.L'),'462':lcd('462')};G.mscr=mesh(bx(.06,.04,.004),new THREE.MeshBasicMaterial({map:G.lcd['O.L']}),0,.035,.019,meter);meter.visible=false;G.meter=meter;
    var probe=new THREE.Group();scene.add(probe);mesh(cy(.006,.12,8),M(0xc62828),0,0,0,probe);probe.visible=false;G.probe=probe;
    var lead=new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(),new THREE.Vector3()]),new THREE.LineBasicMaterial({color:0xc62828}));scene.add(lead);lead.visible=false;lead.frustumCulled=false;G.lead=lead;
    var gauges=new THREE.Group();scene.add(gauges);mesh(bx(.17,.05,.05),M(0x9aa0a6,{metalness:.5}),0,0,0,gauges);[[-.045,0x1565c0],[.045,0xc62828]].forEach(function(q){var d=mesh(cy(.038,.02,20),M(q[1]),q[0],.05,0,gauges);d.rotation.x=Math.PI/2;mesh(cy(.032,.004,20),WHITE,q[0],.05,.012,gauges).rotation.x=Math.PI/2});gauges.visible=false;G.gauges=gauges;
    var hoses=[0x1565c0,0xc62828].map(function(c){var l=new THREE.Line(new THREE.BufferGeometry().setFromPoints([0,1,2,3,4].map(function(){return new THREE.Vector3()})),new THREE.LineBasicMaterial({color:c}));scene.add(l);l.visible=false;l.frustumCulled=false;return l});G.hoses=hoses;
    var torch=new THREE.Group();scene.add(torch);rod([0,0,0],[0,0,.2],.012,M(0xc9a227,{metalness:.7,roughness:.3}),torch);var flame=mesh(new THREE.ConeGeometry(.012,.06,12),new THREE.MeshBasicMaterial({color:0x6cc8ff,transparent:true,opacity:.85,blending:THREE.AdditiveBlending,depthWrite:false}),0,0,.24,torch);flame.rotation.x=Math.PI/2;flame.castShadow=false;torch.visible=false;G.torch=torch;G.flame=flame;
    /* the technician, seen once from outside before we look through their glasses */
    var NAVY=M(0x2c3a52,{roughness:.85}),SHIRT=M(0x3b4a5c,{roughness:.85}),SKIN=M(0xc99b74,{roughness:.7}),HIVIS=M(0xd4ec3c,{roughness:.6}),HAT=M(0xf2f2ee,{roughness:.4});
    var tech=new THREE.Group();tech.position.set(-.6,0,4.5);scene.add(tech);G.tech=tech;
    rod([-.09,0,0],[-.08,.86,0],.06,NAVY,tech);rod([.09,0,0],[.08,.86,0],.06,NAVY,tech);mesh(bx(.13,.06,.24),BLK,-.09,.03,-.04,tech);mesh(bx(.13,.06,.24),BLK,.09,.03,-.04,tech);
    mesh(bx(.36,.56,.22),SHIRT,0,1.14,0,tech);mesh(bx(.38,.38,.235),HIVIS,0,1.2,0,tech);
    rod([-.2,1.38,0],[-.27,.94,-.08],.045,SHIRT,tech);rod([.2,1.38,0],[.27,.94,-.08],.045,SHIRT,tech);
    mesh(cy(.05,.08,12),SKIN,0,1.46,0,tech);mesh(new THREE.SphereGeometry(.1,20,14),SKIN,0,1.6,0,tech);
    mesh(new THREE.SphereGeometry(.118,20,10,0,Math.PI*2,0,Math.PI/2),HAT,0,1.645,0,tech);mesh(cy(.125,.012,24),HAT,0,1.65,-.015,tech);
    mesh(bx(.18,.032,.02),M(0x1b1f24,{roughness:.3}),0,1.612,-.1,tech);rod([-.09,1.612,-.1],[-.1,1.62,.04],.006,M(0x1b1f24),tech);rod([.09,1.612,-.1],[.1,1.62,.04],.006,M(0x1b1f24),tech);
    mesh(bx(.034,.03,.04),new THREE.MeshBasicMaterial({color:0x2dd4ff}),.075,1.638,-.095,tech);
    G.pts.tech=[-.6,1.95,4.5];
    /* highlight ring and scan edges */
    var acc=new THREE.Color(0x2dd4ff);
    var hl=new THREE.Mesh(new THREE.RingGeometry(.12,.135,48),new THREE.MeshBasicMaterial({color:acc,transparent:true,opacity:0,side:THREE.DoubleSide,depthTest:false}));hl.renderOrder=20;scene.add(hl);G.hlm=hl;
    var edges=new THREE.LineSegments(new THREE.EdgesGeometry(bx(2.62,1.22,1.52)),new THREE.LineBasicMaterial({color:acc,transparent:true,opacity:0,depthTest:false}));edges.position.set(0,.93,0);U.add(edges);edges.renderOrder=19;G.edges=edges;
    /* afternoon sun with soft shadows */
    scene.add(new THREE.HemisphereLight(0xe6efff,0x8a8678,.85));scene.add(new THREE.AmbientLight(0xffffff,.12));
    var sun=new THREE.DirectionalLight(0xfff0d8,1.25);sun.position.set(-8,10,6);sun.target.position.set(0,0,0);scene.add(sun);scene.add(sun.target);sun.castShadow=true;sun.shadow.mapSize.set(PHONE?1024:2048,PHONE?1024:2048);
    var sc=sun.shadow.camera;sc.left=-9;sc.right=9;sc.top=9;sc.bottom=-9;sc.near=1;sc.far=40;sun.shadow.bias=-.0004;sun.shadow.radius=3;
    scene.fog=new THREE.Fog(0xe2e4e3,30,160);
    camera.position.set(9,7,11);camera.lookAt(0,.6,0);
  }

  /* camera framings */
  var CAM={aerial:[[8.5,6.8,10.5],[0,.7,-.5]],tech:[[-2.7,2.05,7.6],[-.5,1.35,3.9]],approach:[[-.6,1.68,4.4],[-.1,1,0]],compartment:[[1.02,1.5,2.15],[.78,.86,.42]],roofwide:[[-3.2,2.5,6.2],[.4,.8,0]],
    compartment2:[[1.16,1.42,2.05],[.83,.8,.45]],verify:[[3.4,2.1,4.4],[.3,1.1,0]],walkaway:[[-5.5,3.6,10],[0,.8,0]]};
  var camA=null,camB=null,camT=0,camDur=1.8,camName='aerial';

  /* ---------- labels that sit on the equipment ---------- */
  var st,chipEls={},CH={
    iot:['Sensor','Watching this unit','r'],tech:['Technician','Wearing MTech glasses',''],tag:['RTU-3','Tag matches this job',''],sym:['Problem','Warm air · compressor stopped','warn'],
    hist:['Last service','March: capacitor replaced',''],n2:['RTU-2','Not this job','dim'],n4:['RTU-4','Not this job','dim'],comp:['Compressor','Failed · needs replacing','warn l'],
    newc:['Replacement','Delivered 11:32','l'],fan:['Running again','Fan and compressor on','ok'],qcf:['AI QC ✓','Readings and photos meet the requirements','ok'],done:['Visit complete','Nothing left to write up','ok']};
  var CHP={iot:'iot',tech:'tech',tag:'tag',sym:'fan',hist:'plate2',n2:'n2',n4:'n4',comp:'compressor',newc:'dolly',fan:'fan',qcf:'unit',done:'done'};
  Object.keys(CH).forEach(function(k){var c=CH[k],w=el('div','rtu-chip '+c[2]),d=el('div');d.appendChild(el('b','',c[0]));d.appendChild(document.createTextNode(c[1]));w.appendChild(d);labels.appendChild(w);chipEls[k]=w});

  /* ---------- state the beats act on ---------- */
  var inst=false,clock=0,queue=[],hist=[];
  function reset(){
    st={lens:0,tech:0,chips:{},hl:null,panel:0,panelP:0,hands:0,comp:'old',fault:'normal',faultT:0,instr:'',instrOk:0,sayT:-9,sayDur:2.8,shotT:-9,shotOk:1,shotTgt:null,snap:null,scanT:-9,fan:1,iot:0,toastT:-9};
    queue=[];token.className='rtu-token';qcCard.className='rtu-qc';root.removeAttribute('data-focus');setRole(0);
    Object.keys(rows).forEach(function(k){var r=rows[k];r.d.className='pending';r.v.textContent='—';r.src.textContent=''});
    put('asset','RTU-3 · 7.5-ton unit · Site 14 roof','From SVS',true);
    feedL.innerHTML='';feedL.appendChild(el('li','empty','Nothing to coordinate yet.'));
    hist=[];for(var i=0;i<60;i++)hist.push(55+Math.sin(i*.7)*.4);
    camName='aerial';camA=camB=CAM.aerial;camT=99;
  }
  function later(d,fn){if(inst){fn();return}queue.push({at:clock+d,fn:fn})}
  function setRole(k){Object.keys(roleEl).forEach(function(r){roleEl[r].classList.toggle('on',r===k)})}
  /* a field arrives in the record: it appears, highlights, and says where it came from */
  function put(k,v,note,quiet){var r=rows[k];if(!r)return;r.d.className=quiet||inst?'':'new';r.v.textContent=v;r.src.textContent=note||'';
    if(!quiet&&!inst)later(2.4,function(){if(r.d.className==='new')r.d.className=''})}
  function rel(e){var a=e.getBoundingClientRect(),b=root.getBoundingClientRect();return {x:a.left-b.left+a.width/2,y:a.top-b.top+a.height/2}}
  /* the visible link between an action and its result: a token travels from where it happened to the field it fills */
  function fly(fromEl,k,v,note){var r=rows[k];if(!r)return;if(inst){put(k,v,note);return}
    r.d.className='incoming';r.v.textContent='…';r.src.textContent='';
    var a=rel(fromEl),b=rel(r.v);token.textContent=v;token.style.transition='none';token.style.transform='translate3d('+a.x+'px,'+a.y+'px,0) translate(-50%,-50%) scale(.9)';token.className='rtu-token on';
    void token.offsetWidth;token.style.transition='transform .95s cubic-bezier(.5,0,.2,1),opacity .3s';token.style.transform='translate3d('+b.x+'px,'+b.y+'px,0) translate(-50%,-50%) scale(.8)';
    later(1.0,function(){token.className='rtu-token';put(k,v,note)})}
  var SRC={iot:function(){return iot},feed:function(){return feedL.firstChild||cw},say:function(){return say},qc:function(){return qcCard}};
  var S={
    cam:function(n){if(inst||REDUCE){camName=n;camA=camB=CAM[n];camT=99;return}camA=curCam();camB=CAM[n];camName=n;camT=0},
    lens:function(on){st.lens=on},tech:function(on){st.tech=on},iot:function(on){st.iot=on},
    fault:function(f){st.fault=f;st.faultT=clock;st.fan=f==='running'||f==='normal'?1:0},
    chip:function(k,on){st.chips[k]=on},
    role:function(k){setRole(k)},
    focus:function(k){if(k)root.setAttribute('data-focus',k);else root.removeAttribute('data-focus')},
    toast:function(t){if(inst)return;toastEl.textContent=t;st.toastT=clock},
    fill:function(k,v,note){put(k,v,note)},
    link:function(src,k,v,note){fly(SRC[src](),k,v,note)},
    feed:function(who,txt){var e=feedL.querySelector('.empty');if(e)e.remove();var li=el('li');li.appendChild(el('b','',who+' coworker'));li.appendChild(document.createTextNode(txt));if(inst)li.style.animation='none';feedL.insertBefore(li,feedL.firstChild)},
    instr:function(t){st.instr=t||'';st.instrOk=0},
    ready:function(t){st.instr='✓ '+t+' · ready for the next step';st.instrOk=1},
    /* a spoken reading: the words appear, then the matching field fills */
    voice:function(t,k,v){if(inst){put(k,v,'Spoken · recorded automatically');return}say.textContent=t;st.sayT=clock;later(1.3,function(){fly(say,k,v,'Spoken · recorded automatically')})},
    hl:function(k){st.hl=k||null},
    panel:function(o){st.panel=o;if(inst)st.panelP=o},
    hands:function(p){st.hands=p||0},
    meter:function(t){st.meter=t},
    comp:function(c){st.comp=c},
    scan:function(){if(!inst)st.scanT=clock},
    /* a photo: capture, AI QC checks it on screen, then it moves into the record (or asks for a retake) */
    qc:function(tgt,ok,what,checks,score,k,v){
      if(inst){if(ok&&k)put(k,v,'Checked by AI QC · saved');return}
      st.shotT=clock;st.shotOk=ok;st.shotTgt=tgt;st.snap={tgt:tgt,bad:!ok};
      var ul=qcCard.querySelector('ul');ul.innerHTML='';qcCard.querySelector('.w').textContent=what;qcCard.querySelector('.s').textContent='';qcCard.querySelector('.v').textContent='';
      checks.forEach(function(c){ul.appendChild(el('li','',c))});
      later(.5,function(){qcCard.className='rtu-qc on'});
      checks.forEach(function(c,i){later(.9+i*.45,function(){var li=ul.children[i];li.className=(!ok&&i===checks.length-1)?'no':'yes'})});
      var tEnd=.9+checks.length*.45;
      later(tEnd,function(){qcCard.querySelector('.s').textContent=score;qcCard.querySelector('.v').textContent=ok?'Evidence checked and saved':'Retake needed';qcCard.className='rtu-qc on '+(ok?'ok':'bad')});
      if(ok&&k)later(tEnd+.9,function(){fly(qcCard,k,v,'Checked by AI QC · saved');qcCard.className='rtu-qc'});
      if(!ok)later(tEnd+.4,function(){st.instr='Retake: include the bottom edge of the nameplate';st.instrOk=0});
      if(!ok)later(tEnd+2.6,function(){qcCard.className='rtu-qc'});
    }
  };
  function curCam(){if(!R)return CAM[camName];var e=ease(clamp(camT/camDur));return [[mix(camA[0][0],camB[0][0],e),mix(camA[0][1],camB[0][1],e),mix(camA[0][2],camB[0][2],e)],[mix(camA[1][0],camB[1][0],e),mix(camA[1][1],camB[1][1],e),mix(camA[1][2],camB[1][2],e)]]}

  /* ---------- timeline ---------- */
  var mi=0,lt=0,fired=0,playing=false,userPaused=false,ended=false;
  function clean(){st.chips={};st.hl=null}
  function fire(upTo){var M=moms[mi];while(fired<M.beats.length&&M.beats[fired].t*M.d<=upTo){M.beats[fired].fn(S);fired++}}
  function seek(i){dirty=true;reset();inst=true;for(var j=0;j<i;j++){mi=j;fired=0;clean();fire(1e9)}inst=false;root.removeAttribute('data-focus');mi=i;lt=0;fired=0;ended=false;clean();fire(0);uiMoment()}
  function uiMoment(){var M=moms[mi].m;stN.textContent=(mi+1)+' of '+moms.length+' · '+M.k;stP.textContent=M.plain;stS.textContent=M.short;chB.forEach(function(b,i){b.classList.toggle('on',i===mi)});renderMore()}
  function play(user){if(user)userPaused=false;if(ended){seek(0)}playing=true;setBtn()}
  function pause(user){playing=false;if(user)userPaused=true;setBtn()}
  function setBtn(){playB.innerHTML=ended?AGAIN:playing?PAUSE:PLAY;playB.setAttribute('aria-label',ended?'Replay':playing?'Pause':'Play')}
  playB.addEventListener('click',function(){if(playing)pause(true);else play(true)});
  function step(dt){lt+=dt;fire(lt);if(lt>=moms[mi].d){if(mi<moms.length-1){mi++;lt=0;fired=0;clean();fire(0);uiMoment()}else{lt=moms[mi].d;playing=false;ended=true;setBtn()}}}

  /* ---------- per-frame rendering ---------- */
  var v3=R?new THREE.Vector3():null,W=1,H=1,last=0,vis=false,raf=0,lastDraw=0,dirty=true;
  function size(){dirty=true;W=stage.clientWidth;H=stage.clientHeight;if(R){R.setSize(W,H,false);camera.aspect=W/H;camera.fov=W/H<1?58:42;camera.updateProjectionMatrix()}}
  function proj(p){v3.set(p[0],p[1],p[2]).project(camera);return [(v3.x*.5+.5)*W,(-v3.y*.5+.5)*H,v3.z]}
  function anchor(k){var P=G.pts;if(k==='plate2')return [.8,1.12,.79];if(k==='compressor')return st.comp==='installed'?[.85,.9,.62]:P.compressor;return P[k]}
  function shotBox(){var pts=st.shotTgt==='meter'?[[.58,1.06,1.26],[.67,1.2,1.2]]:[[.68,.58,.6],[.82,.68,.62]];var a1=proj(pts[0]),a2=proj(pts[1]);
    return [Math.min(a1[0],a2[0])-16,Math.min(a1[1],a2[1])-16,Math.max(a1[0],a2[0])+16,Math.max(a1[1],a2[1])+16]}
  function frame(now){
    raf=0;if(!vis)return;var rdt=Math.min(.1,(now-(last||now))/1000);last=now;var dt=playing?rdt:0;
    clock+=dt;if(playing){step(dt);for(var qi=0;qi<queue.length;qi++){if(queue[qi].at<=clock){var q=queue.splice(qi,1)[0];qi--;q.fn()}}}camT+=dt;
    /* sensor readings follow the fault state */
    var fT=clock-st.faultT,temp,amps,cls;
    if(st.fault==='rising'){temp=55+16*clamp(fT/4);amps='Struggling';cls='alert'}
    else if(st.fault==='tripped'){temp=71+Math.sin(clock)*.4;amps='Stopped';cls='alert'}
    else if(st.fault==='running'){temp=71-16*ease(clamp(fT/6));amps='Running · 14.2 A';cls=fT>5?'ok':''}
    else {temp=55+Math.sin(clock*.8)*.3;amps='Running';cls=''}
    if(dt&&(!hist.length||clock-(hist.t||0)>.2)){hist.push(temp+Math.sin(clock*3)*.25);if(hist.length>60)hist.shift();hist.t=clock}
    iot.className='rtu-iot'+(st.iot?' on':'')+(cls?' '+cls:'');iot.querySelector('.t b').textContent=cls==='alert'?'Alert':cls==='ok'?'Back to normal':'Normal';
    iot.querySelector('.sa').textContent=temp.toFixed(0)+' °F'+(temp>60?' · should be ~55':'');iot.querySelector('.sa').className='sa '+(temp>60?'al':temp<57&&st.fault==='running'?'gd':'');
    iot.querySelector('.ca').textContent=amps;iot.querySelector('.ca').className='ca '+(cls==='alert'?'al':cls==='ok'?'gd':'');
    iot.querySelector('polyline').setAttribute('points',hist.map(function(v,i){return (i*120/59).toFixed(1)+','+(40-(v-50)*1.7).toFixed(1)}).join(' '));
    instr.textContent=st.instr;instr.className='rtu-instr'+(st.instr?' on':'')+(st.instrOk?' ok':'');
    say.classList.toggle('on',clock-st.sayT<st.sayDur);toastEl.classList.toggle('on',clock-st.toastT<3);
    lens.classList.toggle('on',!!st.lens);tagSim.classList.toggle('on',!st.lens);
    /* draw at 30 fps on phones, and only occasionally while paused */
    var gap=playing?(PHONE?32:0):250;if(R&&(dirty||now-lastDraw>=gap)){lastDraw=now;dirty=false;
      /* camera, with a slight head sway when we are looking through the glasses */
      var c=curCam(),sw=st.lens&&!REDUCE?1:0;camera.position.set(c[0][0]+Math.sin(clock*.9)*.012*sw,c[0][1]+Math.sin(clock*1.7)*.008*sw,c[0][2]);camera.lookAt(c[1][0],c[1][1],c[1][2]);
      st.panelP+=(st.panel-st.panelP)*Math.min(1,dt*2.5);if(inst||REDUCE)st.panelP=st.panel;var pp=ease(clamp(st.panelP));G.cpanel.position.set(.8+pp*.95,.92-pp*.42,.762+pp*.55);G.cpanel.rotation.set(-pp*.18,-pp*.25,0);
      G.blades.rotation.y+=st.fan&&(st.fault!=='running'||fT>1.5)?dt*(st.fault==='running'?14:12):0;
      G.led.material.color.setHex(st.fault==='rising'||st.fault==='tripped'?(Math.sin(clock*8)>0?0xffb020:0x553300):0x2dd4ff);
      G.tech.visible=!!st.tech;
      var ins=st.comp==='installed';G.oldC.position.set(ins?2.3:.85,ins?.1:.46,ins?1.45:.45);
      G.newC.visible=st.comp!=='old';if(st.comp==='dolly')G.newC.position.set(2.3,.06,1.48);else if(ins)G.newC.position.set(.85,.46,.45);
      /* hands and tools */
      var hp=st.hands;[G.hL,G.hR,G.meter,G.probe,G.lead,G.gauges,G.torch].concat(G.hoses).forEach(function(o){o.visible=false});
      if(hp==='meter'){var mt=G.lcd[st.meter||'O.L'];if(G.mscr.material.map!==mt){G.mscr.material.map=mt;G.mscr.material.needsUpdate=true}G.hL.visible=G.hR.visible=G.meter.visible=G.probe.visible=G.lead.visible=true;G.hL.position.set(.6,1.06,1.3);G.hL.rotation.set(-.9,.3,0);G.meter.position.set(.62,1.13,1.24);G.meter.rotation.set(-.55,.25,0);
        G.hR.position.set(.96,.84,.86);G.hR.rotation.set(-.4,-.5,0);G.probe.position.set(.88,.79,.7);G.probe.rotation.set(1.1,0,.4);
        var lp=G.lead.geometry.attributes.position;lp.setXYZ(0,.62,1.06,1.24);lp.setXYZ(1,.86,.77,.66);lp.needsUpdate=true}
      if(hp==='gauges'){G.hL.visible=G.hR.visible=G.gauges.visible=true;G.hoses.forEach(function(h){h.visible=true});G.gauges.position.set(.58,1.12,1.26);G.gauges.rotation.set(-.5,.2,0);G.hL.position.set(.56,1.06,1.3);G.hL.rotation.set(-.8,.2,0);
        G.hR.position.set(1.02,.95,.8);G.hR.rotation.set(-.5,-.6,0);G.hoses.forEach(function(h,i){var a=h.geometry.attributes.position;for(var k=0;k<5;k++){var f=k/4;a.setXYZ(k,mix(.54+i*.09,1.0+i*.05,f),mix(1.09,.95,f)-Math.sin(f*Math.PI)*.2,mix(1.26,.5,f))}a.needsUpdate=true})}
      if(hp==='torch'){G.hR.visible=G.torch.visible=G.hL.visible=true;G.hR.position.set(1.1,1.08,1.0);G.hR.rotation.set(-.3,-.7,0);G.torch.position.set(1.08,1.09,.98);G.torch.lookAt(.86,1.02,.46);G.flame.scale.set(1,.8+Math.random()*.4,1);
        G.hL.position.set(.62,1.0,1.1);G.hL.rotation.set(-.6,.4,0)}
      /* highlight ring faces the camera and breathes */
      var hk=st.hl;if(hk){var hp3=anchor(hk);G.hlm.position.set(hp3[0],hp3[1],hp3[2]);G.hlm.quaternion.copy(camera.quaternion);G.hlm.scale.setScalar(1+.12*Math.sin(clock*4));G.hlm.material.opacity=.95}else G.hlm.material.opacity=Math.max(0,G.hlm.material.opacity-rdt*3);
      var sT=clock-st.scanT;G.edges.material.opacity=sT<2.2?Math.sin(clamp(sT/2.2)*Math.PI)*.9:st.lens&&camName==='approach'?.25:0;
      R.render(scene,camera);
      /* the photo AI QC is looking at: copied straight from the rendered view */
      if(st.snap&&clock-st.shotT>.25){var bb=shotBox(),k2=cv.width/W,pad=40,x0=Math.max(0,bb[0]-pad),y0=Math.max(0,bb[1]-pad),w0=Math.min(W,bb[2]+pad)-x0,h0=Math.min(H,bb[3]+pad)-y0;
        try{tctx.fillStyle='#111';tctx.fillRect(0,0,240,150);var sc2=Math.min(240/w0,150/h0),dw=w0*sc2,dh=h0*sc2;tctx.drawImage(cv,x0*k2,y0*k2,w0*k2,h0*k2,(240-dw)/2,(150-dh)/2,dw,dh);
          if(st.snap.bad){tctx.fillStyle='rgba(10,10,10,.82)';tctx.fillRect(0,96,240,54);tctx.strokeStyle='#ffb020';tctx.lineWidth=3;tctx.strokeRect(3,94,234,53);tctx.fillStyle='#ffb020';tctx.font='600 13px monospace';tctx.fillText('SERIAL CUT OFF',62,128)}}catch(e){}
        st.snap=null}
      /* labels that track the scene, kept inside the frame */
      Object.keys(chipEls).forEach(function(k){var on=st.chips[k],e=chipEls[k];if(!on){e.style.opacity='0';return}var a=anchor(CHP[k]);if(!a){e.style.opacity='0';return}var p=proj(a);
        if(p[2]>1){e.style.opacity='0';return}
        var cw2=e.firstChild.offsetWidth,x=p[0],nar=W<640,cl=e.classList;
        if(cl.contains('l')&&!nar)x=Math.min(x,W-cw2-22);else if(cl.contains('r')&&!nar)x=Math.max(x,cw2+22);else x=Math.max(cw2/2+8,Math.min(W-cw2/2-8,x));
        e.style.transform='translate3d('+x.toFixed(1)+'px,'+Math.max(p[1],60).toFixed(1)+'px,0)';e.style.opacity=k==='n2'||k==='n4'?'.7':'1'});
      /* photo capture brackets and flash */
      var shT=clock-st.shotT;if(shT<1.4&&st.shotTgt){var b2=shotBox();
        shot.style.transform='translate3d('+b2[0].toFixed(1)+'px,'+b2[1].toFixed(1)+'px,0)';shot.style.width=(b2[2]-b2[0]).toFixed(1)+'px';shot.style.height=(b2[3]-b2[1]).toFixed(1)+'px';
        shot.className='rtu-shot';shot.style.opacity='1';flash.style.opacity=String(Math.max(0,.55-shT*2.2))}else{shot.style.opacity='0';flash.style.opacity='0'}
    }
    var p=clamp(lt/moms[mi].d);chB.forEach(function(b,i){b.style.setProperty('--p',(i<mi?100:i===mi?p*100:0).toFixed(1)+'%')});
    raf=requestAnimationFrame(frame);
  }
  size();window.addEventListener('resize',size);
  if(window.ResizeObserver)new ResizeObserver(size).observe(stage);
  seek(0);setBtn();
  new IntersectionObserver(function(es){var e=es[0];vis=e.isIntersecting;if(vis){if(!raf){last=0;raf=requestAnimationFrame(frame)}if(e.intersectionRatio>.45&&!userPaused&&!ended&&!REDUCE&&opt.autoplay!==false)play(false)}else if(playing){pause(false)}},{threshold:[0,.45]}).observe(stage);
  return {seek:function(i){seek(i);play(true)},play:function(){play(true)},pause:function(){pause(true)}};
};
})();
