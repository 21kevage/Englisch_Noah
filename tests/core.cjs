const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync(__dirname+'/../index.html','utf8');const script=html.match(/<script>([\s\S]*)<\/script>/)[1];const elements=new Map(),storage=new Map();const element=s=>{if(!elements.has(s))elements.set(s,{textContent:'',innerHTML:'',hidden:true,disabled:false,querySelectorAll:()=>[]});return elements.get(s)};
const ctx=vm.createContext({console,Date,Math,Set,JSON,Array,Number,String,Error,localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},document:{querySelector:element},alert:()=>{},setTimeout,clearTimeout});vm.runInContext(script,ctx);const run=s=>vm.runInContext(s,ctx);
assert.equal(run('db.entries.length'),0);
run("db.entries=vocabularyPack({type:'noah-vocabulary',version:1,entries:[{id:'book-1',en:'test',de:'Test',unit:'Test',section:'Test',page:'',sentence:'A test.',translation:'Ein Test.',note:'',also:''}]})");assert.equal(run('db.entries.filter(e=>e.approved).length'),0);
assert.equal(run("norm('The romans built')===norm('The Romans built')"),false);
assert.equal(run("norm('It take a lot')===norm('It takes a lot')"),false);
assert.equal(run('norm("Hadrian’s Wall.")===norm("Hadrian\'s Wall")'),true);
assert.equal(run("norm('both ... and ...')===norm('both … and …')"),true);
assert.equal(run("norm('both .. and ...')===norm('both ... and ...')"),false);
assert.match(run("difference('The romans had a empire in 122.','The Romans had an empire in 122.')"),/romans → Romans/);
assert.match(run("difference('The romans had a empire in 122.','The Romans had an empire in 122.')"),/a → an/);
run("db.entries[0].approved=db.entries[0].pending;db.entries[0].pending=null;session={mode:'sentence',queue:['book-1'],index:0,done:false,results:[],retried:new Set()};record(false,'Textvergleich')");assert.equal(run('session.queue.length'),2);assert.equal(run('db.entries[0].progress.sentence.lastOK'),false);
run("session.index=1;session.done=false;record(true,'Textvergleich')");assert.equal(run('db.entries[0].progress.sentence.days.length'),0);
assert.equal(run('validate(JSON.parse(JSON.stringify(db))).entries.length'),1);
assert.throws(()=>run("validate({version:1,pin:'',entries:[{}]})"));assert.throws(()=>run("validate({version:1,pin:'',entries:[db.entries[0],db.entries[0]]})"));
assert.equal(run("esc('<img onerror=x>')"),'&lt;img onerror=x&gt;');assert.equal(run("JSON.parse(localStorage.getItem(KEY)).entries[0].progress.sentence.attempts"),2);
console.log('PASS: seed count, unapproved defaults, capitalization, grammar mismatch, apostrophe normalization, word differences, retry progress, backup roundtrip, malformed backup rejection, HTML escaping, storage write.');
// Unlesbare Daten beim Start: Rohdaten beiseitelegen, nicht überschreiben
{const st=new Map([['noah-english-v01','{"version":99,"kaputt":true}']]);const els=new Map();const el=s=>{if(!els.has(s))els.set(s,{textContent:'',innerHTML:'',hidden:true,disabled:false,querySelectorAll:()=>[]});return els.get(s)};
const ls={getItem:k=>st.has(k)?st.get(k):null,setItem:(k,v)=>st.set(k,v),get length(){return st.size},key:i=>[...st.keys()][i]??null};
const c2=vm.createContext({console,Date,Math,Set,JSON,Array,Number,String,Error,localStorage:ls,document:{querySelector:el},alert:()=>{},setTimeout});vm.runInContext(script,c2);
const keys=vm.runInContext('rescueKeys()',c2);assert.equal(keys.length,1);assert.equal(st.get(keys[0]),'{"version":99,"kaputt":true}');assert.equal(vm.runInContext('db.entries.length',c2),0);assert.match(el('#storage').textContent,/beiseitegelegt/);
// Wenn das Beiseitelegen scheitert, darf save() nichts überschreiben
const st3=new Map([['noah-english-v01','kaputt']]);const ls3={getItem:k=>st3.get(k)??null,setItem:(k,v)=>{if(k.startsWith('noah-english-rescue-'))throw Error('voll');st3.set(k,v)}};
const c3=vm.createContext({console,Date,Math,Set,JSON,Array,Number,String,Error,localStorage:ls3,document:{querySelector:el},alert:()=>{},setTimeout});vm.runInContext(script,c3);vm.runInContext('save()',c3);assert.equal(st3.get('noah-english-v01'),'kaputt');
console.log('PASS: unlesbare Daten werden beiseitegelegt, save() überschreibt nichts, wenn Sichern scheitert.');}
// Zurück in der Lernrunde nimmt Antworten vollständig zurück
{run("db.entries=['a','b','c'].map(k=>({id:'gb-'+k,pending:null,progress:{},approved:{id:'gb-'+k,unit:'Unit 1',section:'Test',page:'1',en:'w'+k,de:'d'+k,sentence:'',translation:'',note:'',also:''}}));save();start('word');");
 const q0=run("session.queue.length");assert.ok(q0>=2);const first=run("session.queue[0]");
 run("record(false,'Selbstbewertung');session.index++;question();");
 assert.equal(run("session.queue.length"),q0+1);assert.ok(run(`!!db.entries.find(e=>e.id==='${first}').progress.word`));
 run("record(true,'Selbstbewertung');session.index++;question();goBack();");assert.equal(run("session.index"),1);assert.equal(run("session.results.length"),1);
 run("goBack();");assert.equal(run("session.index"),0);assert.equal(run("session.queue.length"),q0);assert.equal(run("session.results.length"),0);assert.equal(run("session.retried.size"),0);
 assert.equal(run(`db.entries.find(e=>e.id==='${first}').progress.word`),undefined);run("goBack();");assert.equal(run("session.index"),0);
 console.log('PASS: Zurück stellt Fortschritt, Warteschlange und Ergebnisse wieder her.');}
// Wortmodus prüft streng gegen die Buchschreibweise
{run("db.entries=[{id:'s1',pending:null,progress:{},approved:{id:'s1',unit:'Unit 1',section:'T',page:'1',en:'(to) take',de:'dauern',sentence:'',translation:'',note:'',also:''}}];save();start('word');");
 assert.equal(run("norm('take')===norm(target())"),false);assert.equal(run("norm('to take')===norm(target())"),false);assert.equal(run("norm('(to) take')===norm(target())"),true);
 assert.equal(run("typeof answers"),'undefined');
 console.log('PASS: Wortmodus akzeptiert nur die exakte Buchschreibweise.');}
// Auswahl: Fehler und Wiederholungen verhungern nicht, alles kommt dran, Reihenfolge zufällig
{const mk=(id,p)=>({id,pending:null,progress:p?{word:p}:{},approved:{id,unit:'Unit 1',section:'T',page:'1',en:'w'+id,de:'d'+id,sentence:'',translation:'',note:'',also:''}});
 const old=Date.now()-5*86400000,fut=Date.now()+5*86400000;
 const ents=[...Array(40)].map((_,i)=>mk('n'+i)).concat(['w1','w2','w3'].map(id=>mk(id,{attempts:1,days:[],due:old,source:'x',lastOK:false})),['o1','o2','o3'].map(id=>mk(id,{attempts:1,days:['2026-01-01'],due:old,source:'x',lastOK:true})),['l1'].map(id=>mk(id,{attempts:1,days:['2026-01-01'],due:fut,source:'x',lastOK:true})));
 run(`db.entries=${JSON.stringify(ents)};`);
 for(let k=0;k<20;k++){const q=JSON.parse(run("JSON.stringify(pickQueue(db.entries,'word'))"));assert.equal(q.length,8);for(const id of ['w1','w2','w3','o1','o2','o3'])assert.ok(q.includes(id),'fehlt: '+id);assert.ok(!q.includes('l1'));}
 const orders=new Set();for(let k=0;k<10;k++)orders.add(run("JSON.stringify(pickQueue(db.entries,'word'))"));assert.ok(orders.size>1,'Reihenfolge nicht zufällig');
 // Simulation: jede Runde alles richtig, nach endlich vielen Runden war jedes neue Wort dran
 run(`db.entries=${JSON.stringify([...Array(40)].map((_,i)=>mk('n'+i)))};save();`);let rounds=0;
 while(run("db.entries.some(e=>!e.progress.word)")&&rounds<20){run("start('word');while(session.index<session.queue.length){session.done=false;record(true,'Test');session.index++;}");rounds++;}
 assert.equal(rounds,5);
 // Fälligkeit beginnt am Tagesanfang
 run("db.entries=[db.entries[0]];db.entries[0].progress={};start('word');record(true,'Test');");assert.equal(run("db.entries[0].progress.word.due"),run("dayStart(1)"));
 console.log('PASS: Auswahl bevorzugt Fehler und Wiederholungen, zufällige Reihenfolge, alle Wörter kommen dran, Fälligkeit ab Tagesbeginn.');}
