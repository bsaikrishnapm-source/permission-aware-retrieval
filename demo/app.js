"use strict";
const $=id=>document.getElementById(id);
function el(tag,text,cls){const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e;}
function num(id){const v=$(id).value;if(v.trim()==="")throw new Error("Enter a value for "+id);return Number(v);}
function field(id,label,value,options){
 const wrap=el("label");wrap.append(el("span",label));let input;
 if(options){input=el("select");for(const item of options){const o=el("option",typeof item==="string"?item:item[1]);o.value=typeof item==="string"?item:item[0];input.append(o);}}
 else{input=el("input");input.type=typeof value==="number"?"number":"text";if(input.type==="number"){input.step="any";input.min="0";}}
 input.id=id;input.value=value;wrap.append(input);$("controls").append(wrap);return input;
}
function button(label,fn,secondary=false){const b=el("button",label,secondary?"secondary":"");b.type="button";b.onclick=()=>{try{$("error").textContent="";fn();}catch(e){$("error").textContent=e.message;}};$("actions").append(b);return b;}
function metric(label,value){const c=el("div",undefined,"metric");c.append(el("span",label),el("strong",String(value)));$("metrics").append(c);}
function clear(){for(const id of ["metrics","results","notes"])$(id).replaceChildren();}
function message(text){$("notes").append(el("p",text));}
function table(title,rows,columns){
 const section=el("section",undefined,"result-section");section.append(el("h2",title));if(!rows.length){section.append(el("p","No records for this scenario."));$("results").append(section);return;}
 const wrap=el("div",undefined,"table-scroll"),t=el("table"),head=el("thead"),hr=el("tr");
 for(const [key,label]of columns)hr.append(el("th",label));head.append(hr);t.append(head);
 const body=el("tbody");for(const row of rows){const tr=el("tr");for(const [key]of columns){const v=row[key];tr.append(el("td",v===null||v===undefined?"—":Array.isArray(v)?v.join(", "):String(v)));}body.append(tr);}t.append(body);wrap.append(t);section.append(wrap);$("results").append(section);
}
function download(name,data,type="application/json"){
 const body=typeof data==="string"?data:JSON.stringify(data,null,2);
 const url=URL.createObjectURL(new Blob([body],{type}));const a=el("a");a.href=url;a.download=name;document.body.append(a);a.click();a.remove();URL.revokeObjectURL(url);
}
function csv(rows){if(!rows.length)return "";const keys=Object.keys(rows[0]);const cell=v=>{let s=typeof v==="object"?JSON.stringify(v):String(v??"");if(/^[=+@\-\t\r]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';};return [keys.map(cell).join(","),...rows.map(r=>keys.map(k=>cell(r[k])).join(","))].join("\r\n");}
function pct(n){return n===null?"N/A":(n*100).toFixed(1)+"%";}
function money(n){return "$"+n.toFixed(2);}
const copies=[];
function saveComparison(label,result){copies.push({label,at:new Date().toISOString(),result:JSON.parse(JSON.stringify(result))});if(copies.length>5)copies.shift();$("saved").textContent=copies.length+" comparison snapshots saved in this tab";}
let lastResult=null;


let model=new Product.Retrieval(DEMO_DATA),context=null;
field("tenant","Demo tenant","alpha",["alpha","beta"]);field("role","Demo role","support",["support","finance"]);
field("topic","Policy topic","refund",["refund","billing","password","vacation"]);
field("scenario","Policy scenario","normal",[["normal","Normal corpus"],["conflict","Conflicting current policies"],["duplicate","Consistent duplicate"],["newer","Higher version takes precedence"]]);
function person(){return {tenant:$("tenant").value,role:$("role").value,revoked:$("access").value==="revoked"};}
field("access","Current evidence access","active",[["active","Active"],["revoked","Revoked"]]);
function run(){
 clear();model.docs=JSON.parse(JSON.stringify(DEMO_DATA.documents));
 const scenario=$("scenario").value;
 if(scenario!=="normal"){const d=JSON.parse(JSON.stringify(model.docs[0]));d.id="D6";if(scenario!=="duplicate"){d.value="Refund within 14 days";d.text="Refund requests are eligible within 14 days.";}if(scenario==="newer")d.version=2;model.docs.push(d);}
 context=model.search($("topic").value,person());lastResult={...context,audit:model.audit};
 metric("Decision",context.status);metric("Eligible sources",context.sources.length);metric("Audit entries",model.audit.length);
 message(context.next+". Opening a source always checks the current demo role and access setting.");
 table("Authorized evidence references",context.sources,[["id","Source"],["topic","Topic"],["version","Version"]]);
 for(const source of context.sources){const b=el("button","Open "+source.id,"secondary");b.onclick=()=>{const result=model.open(source.id,person());$("opened").textContent=result.status+": "+result.text;lastResult={...context,opened:result,audit:model.audit};};$("results").append(b);}
 const opened=el("p","","evidence");opened.id="opened";opened.setAttribute("aria-live","polite");$("results").append(opened);
 table("Audit preview (no document text)",model.audit,[["event","Event"],["decision","Decision"],["source_ids","Source IDs"]]);
 message("Try: retrieve a source, change access to Revoked, then click Open. These controls simulate identity; browser state is not an authorization service.");
}
button("Retrieve evidence",run);button("Escalate for review",()=>{model.log("ESCALATED",context?.sources.map(s=>s.id)||[]);lastResult={...context,audit:model.audit};message("Escalation recorded locally. No message was sent.");},true);
button("Clear audit",()=>{model.clearAudit();lastResult={...context,audit:model.audit};message("Audit buffer cleared. No logs persist after refresh.");},true);
run();

button("Save comparison snapshot",()=>{if(!lastResult)throw new Error("Run the scenario first");saveComparison("Scenario "+(copies.length+1),lastResult);table("Saved comparisons",copies.map(c=>({label:c.label,time:c.at})),[["label","Snapshot"],["time","Captured (UTC)"]]);},true);
button("Download evidence JSON",()=>download("product-evidence.json",{current:lastResult,comparisons:copies,scope:"Independent prototype; synthetic data only"}),true);
