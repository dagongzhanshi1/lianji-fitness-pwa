export const PARTS=['胸','背','肩','二头','三头','前臂','腿','臀','腹','全身','跑步','骑行','游泳','有氧'];
export const QUICK_PLANS=[['背','二头'],['胸','三头'],['肩','腹'],['腿','臀'],['跑步'],['骑行']];
export const localDay=(value=new Date())=>{const d=new Date(value);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};
export function exercisePart(e){
 if(e.category==='手臂')return /二头/.test(e.subgroup)?'二头':/三头/.test(e.subgroup)?'三头':'前臂';
 if(e.type==='cardio')return /跑步|间歇跑|越野跑/.test(e.name)?'跑步':/骑行|单车/.test(e.name)?'骑行':/游泳|自由泳|蛙泳|蝶泳|仰泳/.test(e.name)?'游泳':'有氧';
 return ({胸部:'胸',背部:'背',肩部:'肩',腿部:'腿',臀部:'臀',腹部与核心:'腹',全身与功能性:'全身'})[e.category]||'全身';
}
export const partsName=parts=>parts?.length?parts.join(' + '):'自由训练';
export function usageCounts(sessions){const counts=new Map();for(const s of sessions)for(const name of new Set(s.exercises.map(e=>e.name)))counts.set(name,(counts.get(name)||0)+1);return counts;}
export function mostUsed(exercises,sessions){const counts=usageCounts(sessions);return exercises.map((e,i)=>({e,i})).sort((a,b)=>(counts.get(b.e.name)||0)-(counts.get(a.e.name)||0)||a.i-b.i).map(x=>x.e);}
export function historyBest(sessions,name,excludeId){let best=null;for(const s of sessions){if(s.id===excludeId)continue;for(const e of s.exercises){if(e.name!==name||e.type!=='strength')continue;for(const set of e.sets){if(!(set.reps>0))continue;if(!best||set.weight>best.weight||(set.weight===best.weight&&s.date>best.date))best={weight:set.weight,reps:set.reps,date:s.date,unit:e.unit||'次'};}}}return best;}
export function serializeDraft(d,now=new Date(),automatic=false){
 const session=structuredClone(d);delete session.editId;delete session.openedAt;
 if(session.nameFromParts)session.name=partsName(session.parts);
 session.exercises=session.exercises.map(e=>e.type==='strength'?{...e,sets:e.sets.map(s=>({...s,done:s.reps>0}))}:{...e,done:e.minutes>0});
 session.incomplete=session.exercises.length===0||session.exercises.some(e=>e.type==='strength'?e.sets.length===0||e.sets.some(s=>!(s.reps>0)):!(e.minutes>0));
 session.minutes=0;
 if(automatic)session.autoSavedAt=new Date(now).toISOString();
 return session;
}
export function archiveOvernight(state,now=new Date()){
 const draft=state.draft;if(!draft)return null;
 const opened=draft.openedAt||draft.startedAt;
 if(localDay(opened)>=localDay(now))return null;
 const next=structuredClone(state),session=serializeDraft(draft,now,true),id=draft.editId||draft.id,index=next.sessions.findIndex(s=>s.id===id);
 if(index>=0)next.sessions[index]=session;else next.sessions.push(session);
 next.draft=null;return next;
}
