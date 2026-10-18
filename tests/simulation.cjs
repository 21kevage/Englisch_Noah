// Simuliert 90 Tage Nutzung und prüft, dass kein Wort liegen bleibt. Start: node tests/simulation.cjs
const fs=require('fs'),vm=require('vm');
const html=fs.readFileSync('index.html','utf8'),script=html.match(/<script>([\s\S]*)<\/script>/)[1];
function simulate({words=80,days=90,roundsPerDay=2,errRate=.2,skipEvery=0}){
 let offset=0;const RealDate=Date;
 class FakeDate extends RealDate{constructor(...a){a.length?super(...a):super(RealDate.now()+offset);}static now(){return RealDate.now()+offset;}}
 const st=new Map(),el=()=>({textContent:'',innerHTML:'',hidden:true,disabled:false,value:'',querySelectorAll:()=>[]});const els=new Map();
 const ctx=vm.createContext({console,Date:FakeDate,Math,Set,Map,JSON,Array,Number,String,Error,Object,localStorage:{getItem:k=>st.get(k)??null,setItem:(k,v)=>st.set(k,v)},document:{querySelector:s=>{if(!els.has(s))els.set(s,el());return els.get(s)}},alert:()=>{},setTimeout,clearTimeout});
 vm.runInContext(script,ctx);const run=c=>vm.runInContext(c,ctx);
 run(`db.entries=[...Array(${words})].map((_,i)=>({id:'v'+i,pending:null,progress:{},approved:{id:'v'+i,unit:'U',section:'S',page:'1',en:'e'+i,de:'d'+i,sentence:'',translation:'',note:'',also:''}}));`);
 const last={},first={},gaps={};
 for(let d=0;d<days;d++){
  if(skipEvery&&d%skipEvery===skipEvery-1)continue; // Pausentage
  for(let r=0;r<roundsPerDay;r++){
   offset=d*86400000+(17+r)*3600000- (new Date().getHours()*3600000);
   run("start('word');");
   while(run("session.index<session.queue.length")){
    const id=run("session.queue[session.index]");
    if(first[id]===undefined)first[id]=d; if(last[id]!==undefined)gaps[id]=Math.max(gaps[id]||0,d-last[id]); last[id]=d;
    run(`session.done=false;record(${Math.random()>errRate},'Sim');session.index++;`);
   }
  }
 }
 const ids=[...Array(words)].map((_,i)=>'v'+i);
 const unseen=ids.filter(i=>first[i]===undefined).length,allSeenBy=Math.max(...ids.map(i=>first[i]??Infinity));
 const maxGap=Math.max(...Object.values(gaps)),endGap=Math.max(...ids.map(i=>days-1-(last[i]??-99)));
 const sure=run("db.entries.filter(e=>status(e.progress.word)==='Sicher').length");
 return {unseen,allSeenBy,maxGap,endGap,sure};
}
for(const c of [{},{errRate:.4},{roundsPerDay:1},{words:150},{skipEvery:3}]){
 const r=simulate(c);console.log(JSON.stringify(c),'=>',`nie gesehen: ${r.unseen}, alle gesehen bis Tag ${r.allSeenBy+1}, längste Pause eines Worts: ${r.maxGap} Tage, sicher am Ende: ${r.sure}`);
}
