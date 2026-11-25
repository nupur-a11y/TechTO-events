// Demo mode: gives index.html the small `window.claude.use("db" | "user")` API it expects,
// backed by in-memory data. Nothing is saved: reloading the page resets everything.
// To keep data for real, swap this script tag for firebase/firebase-adapter.js (see README).
(function(){
  if(window.claude) return;
  var store={}, subs={}, ME='guest';
  function snap(col){
    var docs=Object.keys(store).filter(function(p){return p.indexOf(col+'/')===0;}).map(function(p){
      var id=p.slice(col.length+1), d=store[p];
      return {id:id,data:function(){return JSON.parse(JSON.stringify(d));}};
    });
    return {docs:docs};
  }
  function notify(col){(subs[col]||[]).forEach(function(cb){Promise.resolve().then(function(){cb(snap(col));});});}
  function put(p,d){store[p]=JSON.parse(JSON.stringify(d));}
  var db={
    doc:function(p){return {
      set:function(d){put(p,d);notify(p.split('/')[0]);return Promise.resolve();},
      delete:function(){delete store[p];notify(p.split('/')[0]);return Promise.resolve();}
    };},
    collection:function(c){return {onSnapshot:function(ok){(subs[c]=subs[c]||[]).push(ok);Promise.resolve().then(function(){ok(snap(c));});return function(){};}};}
  };
  var user={
    me:function(){return Promise.resolve({id:ME,name:'You'});},
    can:function(){return Promise.resolve(true);},
    profiles:function(ids){var o={};ids.forEach(function(i){o[i]={name:i==='megha'?'Megha':i==='ammar'?'Ammar':'Teammate'};});return Promise.resolve(o);}
  };
  var ready=fetch('seed.json').then(function(r){return r.json();}).then(function(seed){
    put('types/starter',seed.starter);
    put('types/ty-monthly',{name:'Monthly founders night',createdAt:1});
    seed.items.forEach(function(i){
      put('items/'+i.id,i.data);
      var d=JSON.parse(JSON.stringify(i.data)); d.typeId='ty-monthly'; put('items/m-'+i.id,d);
    });
    put('events/ev-dec',{name:'December founders night',date:'2026-12-10',typeId:'ty-monthly',archived:false,createdBy:'megha',createdAt:1});
    put('events/ev-jan',{name:'January founders night',date:'2027-01-14',typeId:'ty-monthly',archived:false,createdBy:'megha',createdAt:2});
    var now=Date.now();
    put('progress/ev-dec~m-t01',{eventId:'ev-dec',itemId:'m-t01',done:true,doneBy:'megha',doneAt:now-86400000*3,hidden:false});
    put('progress/ev-dec~m-t02',{eventId:'ev-dec',itemId:'m-t02',done:true,doneBy:'ammar',doneAt:now-86400000*2,hidden:false});
    put('notes/n-demo',{eventId:'ev-dec',itemId:'m-t03',text:'Two speakers still to confirm. Will add them to the Luma page as soon as they reply.',by:'megha',at:now-3600000*5});
  });
  window.claude={use:function(name){return ready.then(function(){return name==='db'?db:name==='user'?user:null;});}};
  document.addEventListener('DOMContentLoaded',function(){
    var b=document.createElement('div');
    b.setAttribute('role','note');
    b.style.cssText='background:#d2f5ff;color:#000;font:600 13px/1.4 system-ui,sans-serif;text-align:center;padding:8px 12px';
    b.textContent='Demo: try everything. Changes aren’t saved and reset when you reload the page.';
    document.body.prepend(b);
  });
})();
