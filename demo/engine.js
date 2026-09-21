(function(){
"use strict";
function finite(value, name, min=0, max=Number.MAX_SAFE_INTEGER) {
  if(typeof value!=="number" || !Number.isFinite(value) || value<min || value>max) throw new Error(`${name} must be a finite number from ${min} to ${max}`);
  return value;
}
function clone(value){return JSON.parse(JSON.stringify(value));}
function unique(rows,key){if(new Set(rows.map(r=>r[key])).size!==rows.length)throw new Error(`Duplicate ${key}`);}
function ratio(a,b){return b ? a/b : null;}

class Retrieval {
 constructor(data){this.docs=clone(data.documents);this.audit=[];this.seq=0;}
 log(decision,ids=[]){this.audit.push({event:++this.seq,policy_version:"structured-v1",decision,source_ids:ids});this.audit=this.audit.slice(-50);}
 eligible(d,person){return !person.revoked && d.tenant===person.tenant && d.roles.includes(person.role)&&d.active;}
 search(topic,person){
  const allowed=this.docs.filter(d=>d.topic===topic&&this.eligible(d,person));
  const groups=new Map();
  for(const d of allowed){const key=d.policy_key||d.topic; if(!groups.has(key))groups.set(key,[]);groups.get(key).push(d);}
  const hits=[];let conflict=false;
  for(const docs of groups.values()){
   const latest=Math.max(...docs.map(d=>d.version||1)); const current=docs.filter(d=>(d.version||1)===latest);
   const values=new Set(current.map(d=>JSON.stringify(d.value===undefined?d.text:d.value)));
   if(values.size>1)conflict=true;hits.push(...current);
  }
  const status=conflict?"CONFLICT":hits.length?"EVIDENCE_FOUND":"NO_AUTHORIZED_EVIDENCE";
  this.log(status, hits.map(d=>d.id));
  return {status, sources:hits.map(d=>({id:d.id,topic:d.topic,version:d.version||1})), next:conflict?"Escalate policy conflict":hits.length?"Open evidence to recheck current access":"Request authorized assistance"};
 }
 open(id,person){const d=this.docs.find(d=>d.id===id);if(!d||!this.eligible(d,person)){this.log("ACCESS_DENIED");return {status:"ACCESS_DENIED",text:"Access is no longer available. Request authorized assistance."};}
 this.log("EVIDENCE_OPENED",[id]);return {status:"EVIDENCE_OPENED",id,text:d.text};}
 clearAudit(){this.audit=[];}
}
const API={Retrieval};

if(typeof module!=="undefined"&&module.exports)module.exports=API;else window.Product=API;
})();
