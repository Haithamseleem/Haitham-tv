// Live procedural wallpaper: a WebGL sky + sea that animates and tracks the real clock.
// Zero licensing (fully generated), lightweight (one fullscreen shader). Pauses when hidden.
window.Live = (function () {
  var gl, cv, pr, U, raf = null, running = false, t0 = Date.now();
  var KF = [
    [0,[7,11,31],[15,22,54]],[5,[20,22,54],[48,42,74]],[6.5,[63,90,147],[255,178,122]],
    [9,[74,132,196],[191,224,242]],[12,[47,127,214],[169,215,245]],[15,[63,128,201],[207,231,243]],
    [17.5,[90,109,176],[255,176,102]],[18.7,[57,64,111],[255,126,90]],[19.8,[29,37,80],[106,74,122]],
    [21,[11,18,48],[20,28,60]],[24,[7,11,31],[15,22,54]]
  ];
  function lp(a,b,u){return a+(b-a)*u;}
  function mix(a,b,u){return [lp(a[0],b[0],u),lp(a[1],b[1],u),lp(a[2],b[2],u)];}
  function skyAt(t){var i=0;for(;i<KF.length-1;i++){if(t>=KF[i][0]&&t<=KF[i+1][0])break;}var a=KF[i],b=KF[i+1],u=(t-a[0])/(b[0]-a[0]);return{top:mix(a[1],b[1],u),bot:mix(a[2],b[2],u)};}
  function st(t){var s=skyAt(t),isDay=t>=6.2&&t<=18.6,rise,set,tn;if(isDay){rise=6.2;set=18.6;tn=t;}else{rise=18.6;set=30.2;tn=t<6.2?t+24:t;}var p=Math.max(0,Math.min(1,(tn-rise)/(set-rise)));var bx=0.08+p*0.84,byUp=1-(0.58-Math.sin(p*Math.PI)*0.5);var night=isDay?0:(t<6.2?Math.min(1,(6.2-t)/1.4):Math.min(1,(t-18.6)/1.4));var body=isDay?[255,243,214]:[238,240,247];return{top:s.top,bot:s.bot,body:body,bx:bx,by:byUp,night:night};}
  var VS='attribute vec2 aPos;void main(){gl_Position=vec4(aPos,0.0,1.0);}';
  var FS='precision highp float;uniform vec2 uRes;uniform float uTime,uNight,uHz;uniform vec3 uTop,uBot,uBody;uniform vec2 uBp;'
    +'float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}'
    +'void main(){vec2 uv=gl_FragCoord.xy/uRes.xy;float asp=uRes.x/uRes.y;vec3 col;float hz=uHz;vec2 bp=uBp;'
    +'if(uv.y>hz){float g=(uv.y-hz)/(1.0-hz);col=mix(uBot,uTop,g);vec2 d=(uv-bp)*vec2(asp,1.0);float dist=length(d);'
    +'col+=uBody*exp(-dist*7.0)*(uNight>0.5?0.45:0.85);col=mix(col,uBody,smoothstep(0.045,0.040,dist));'
    +'if(uNight>0.01){vec2 gid=floor(uv*vec2(140.0,90.0));float h=hash(gid);float tw=0.6+0.4*sin(uTime*2.0+h*30.0);col+=vec3(step(0.986,h)*uNight*tw);}}'
    +'else{float sy=uv.y/hz;vec3 seaTop=mix(uBot,vec3(0.05,0.09,0.18),0.4);vec3 seaBot=seaTop*0.35;col=mix(seaBot,seaTop,sy);'
    +'float wave=sin(uv.x*40.0+uTime*1.5+sin(uv.x*13.0+uTime)*1.2)*0.5+0.5;float band=sin(sy*60.0+uTime*2.0)*0.5+0.5;col+=0.03*wave*band;'
    +'float rx=abs(uv.x-bp.x);float refl=exp(-rx*rx*60.0)*sy*0.6;float rsh=0.5+0.5*sin(uv.y*120.0-uTime*3.0);col+=uBody*refl*rsh;}'
    +'gl_FragColor=vec4(col,1.0);}';
  function sh(ty,src){var s=gl.createShader(ty);gl.shaderSource(s,src);gl.compileShader(s);return s;}
  function resize(){var dpr=Math.min(window.devicePixelRatio||1,1.5);cv.width=cv.clientWidth*dpr;cv.height=cv.clientHeight*dpr;if(gl)gl.viewport(0,0,cv.width,cv.height);}
  function init(canvas){
    cv=canvas; if(!cv)return false;
    gl=cv.getContext('webgl')||cv.getContext('experimental-webgl'); if(!gl)return false;
    pr=gl.createProgram(); gl.attachShader(pr,sh(gl.VERTEX_SHADER,VS)); gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,FS)); gl.linkProgram(pr); gl.useProgram(pr);
    var buf=gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER,buf); gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
    var ap=gl.getAttribLocation(pr,'aPos'); gl.enableVertexAttribArray(ap); gl.vertexAttribPointer(ap,2,gl.FLOAT,false,0,0);
    U={}; ['uRes','uTime','uNight','uHz','uTop','uBot','uBody','uBp'].forEach(function(n){U[n]=gl.getUniformLocation(pr,n);});
    resize(); window.addEventListener('resize',resize);
    document.addEventListener('visibilitychange',function(){ if(document.hidden){ if(raf){cancelAnimationFrame(raf);raf=null;} } else if(running&&!raf){ raf=requestAnimationFrame(render); } });
    return true;
  }
  function render(){
    if(!running){raf=null;return;}
    var now=new Date(); var tod=now.getHours()+now.getMinutes()/60+now.getSeconds()/3600;
    var s=st(tod); var time=(Date.now()-t0)/1000;
    gl.uniform2f(U.uRes,cv.width,cv.height); gl.uniform1f(U.uTime,time); gl.uniform1f(U.uNight,s.night); gl.uniform1f(U.uHz,0.38);
    gl.uniform3f(U.uTop,s.top[0]/255,s.top[1]/255,s.top[2]/255); gl.uniform3f(U.uBot,s.bot[0]/255,s.bot[1]/255,s.bot[2]/255);
    gl.uniform3f(U.uBody,s.body[0]/255,s.body[1]/255,s.body[2]/255); gl.uniform2f(U.uBp,s.bx,s.by);
    gl.drawArrays(gl.TRIANGLES,0,6);
    raf=requestAnimationFrame(render);
  }
  function start(){ if(running)return; running=true; if(cv)cv.classList.add('show'); t0=Date.now(); if(!raf)raf=requestAnimationFrame(render); }
  function stop(){ running=false; if(raf){cancelAnimationFrame(raf);raf=null;} if(cv)cv.classList.remove('show'); }
  return { init: init, start: start, stop: stop };
})();
