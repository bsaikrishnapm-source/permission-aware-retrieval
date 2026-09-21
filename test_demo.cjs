"use strict";
const assert=require("node:assert/strict");const {test}=require("node:test");const fs=require("node:fs");const vm=require("node:vm");const path=require("node:path");const P=require("./demo/engine.js");const context={window:{}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,"demo/data.js"),"utf8"),context);const data=JSON.parse(JSON.stringify(context.window.DEMO_DATA));const person={tenant:"alpha",role:"support",revoked:false};

test("original eight cases preserve expected authorized sources",()=>{const m=new P.Retrieval(data);for(const q of data.queries)assert.deepEqual(m.search(q.topic,q).sources.map(s=>s.id).sort(),q.expected);});
test("revocation blocks opening retrieved evidence",()=>{const m=new P.Retrieval(data);m.search("refund",person);assert.equal(m.open("D1",{...person,revoked:true}).status,"ACCESS_DENIED");});
test("tenant switch blocks source text",()=>{assert.equal(new P.Retrieval(data).open("D1",{...person,tenant:"beta"}).status,"ACCESS_DENIED");});
test("current conflicting values abstain",()=>{const m=new P.Retrieval(data);m.docs.push({...m.docs[0],id:"D6",value:"different",text:"different"});assert.equal(m.search("refund",person).status,"CONFLICT");});
test("newer version supersedes older eligible version",()=>{const m=new P.Retrieval(data);m.docs.push({...m.docs[0],id:"D6",version:2,value:"new"});assert.deepEqual(m.search("refund",person).sources.map(s=>s.id),["D6"]);});
test("consistent duplicate is not a conflict",()=>{const m=new P.Retrieval(data);m.docs.push({...m.docs[0],id:"D6"});assert.equal(m.search("refund",person).status,"EVIDENCE_FOUND");});
test("unauthorized conflict does not affect response",()=>{const m=new P.Retrieval(data);m.docs.push({...m.docs[0],id:"D6",tenant:"beta",value:"new"});assert.equal(m.search("refund",person).status,"EVIDENCE_FOUND");});
test("audit excludes text, is bounded and can be cleared",()=>{const m=new P.Retrieval(data);for(let i=0;i<70;i++)m.open("D1",person);assert.equal(m.audit.length,50);assert.ok(!JSON.stringify(m.audit).includes("30 days"));m.clearAudit();assert.equal(m.audit.length,0);});
