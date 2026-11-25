// Lets index.html run outside Claude. It provides the same tiny `window.claude.use("db" | "user")`
// API the app expects, backed by Firebase Auth (Google sign-in) and Firestore.
// When the page runs as a Claude artifact, window.claude already exists and this file does nothing.
import {initializeApp} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {getAuth,GoogleAuthProvider,signInWithPopup,onAuthStateChanged,signOut} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import {getFirestore,doc,setDoc,deleteDoc,getDoc,collection,onSnapshot} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import {firebaseConfig} from "./firebase-config.js";

if(!window.claude){
  const app=initializeApp(firebaseConfig), auth=getAuth(app), fs=getFirestore(app);

  function gate(html){
    let g=document.getElementById('fb-gate');
    if(!g){
      g=document.createElement('div'); g.id='fb-gate';
      g.style.cssText='position:fixed;inset:0;z-index:50;background:#fff;display:grid;place-items:center;font-family:system-ui,sans-serif;padding:24px';
      document.body.append(g);
    }
    g.innerHTML=html; return g;
  }
  function hideGate(){const g=document.getElementById('fb-gate'); if(g) g.remove();}
  function showSignIn(msg){
    const g=gate('<div style="max-width:380px;text-align:center"><h1 style="font-size:1.5rem;margin:0 0 8px">TechTO event checklist</h1><p style="color:#505050;margin:0 0 20px">Sign in with your team Google account to continue.</p><button id="fb-in" style="background:#ebff52;border:1px solid #000;border-radius:10px;padding:10px 18px;font-size:1rem;font-weight:600;cursor:pointer">Sign in with Google</button><p id="fb-err" style="color:#b42318;margin:16px 0 0">'+(msg||'')+'</p></div>');
    g.querySelector('#fb-in').onclick=()=>signInWithPopup(auth,new GoogleAuthProvider()).catch(e=>{g.querySelector('#fb-err').textContent='Sign-in failed: '+(e.code||e.message);});
  }
  function showDenied(){
    const g=gate('<div style="max-width:420px;text-align:center"><h1 style="font-size:1.5rem;margin:0 0 8px">No access yet</h1><p style="color:#505050;margin:0 0 20px">This Google account is not on the team list. Ask the owner to add your email, then sign in again.</p><button id="fb-out" style="border:1px solid #000;border-radius:10px;padding:10px 18px;font-size:1rem;font-weight:600;background:#fff;cursor:pointer">Sign out</button></div>');
    g.querySelector('#fb-out').onclick=()=>signOut(auth).then(()=>location.reload());
  }

  let userP=null;
  function ensureUser(){
    if(!userP) userP=new Promise(resolve=>{
      onAuthStateChanged(auth,u=>{
        if(u){
          hideGate();
          setDoc(doc(fs,'profiles',u.uid),{name:u.displayName||u.email,email:u.email},{merge:true}).catch(()=>{});
          resolve(u);
        } else showSignIn();
      });
    });
    return userP;
  }

  window.claude={use:async(name)=>{
    const u=await ensureUser();
    if(name==='db') return {
      doc:p=>({set:d=>setDoc(doc(fs,p),d),delete:()=>deleteDoc(doc(fs,p))}),
      collection:n=>({onSnapshot:(ok,err)=>onSnapshot(collection(fs,n),ok,e=>{if(e&&e.code==='permission-denied') showDenied(); if(err) err(e);})})
    };
    if(name==='user') return {
      me:async()=>({id:u.uid,name:u.displayName||u.email}),
      can:async()=>true,
      profiles:async ids=>{
        const out={};
        await Promise.all(ids.map(async id=>{try{const s=await getDoc(doc(fs,'profiles',id)); if(s.exists()) out[id]={name:s.data().name};}catch(e){}}));
        return out;
      }
    };
    return null;
  }};
}
