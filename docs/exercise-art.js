import {demos,MEDIA_ROOT} from './exercise-media.js';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function grip(name){
 if(/中立|对握|锤式/.test(name))return '中立握 · 掌心相对';
 if(/反握|反手/.test(name)&&/弯举/.test(name))return '反向弯举 · 手背朝上';
 if(/反握|反手/.test(name))return /引体|下拉/.test(name)?'反握 · 掌心朝向自己':'反握 · 按图示掌心方向';
 if(/引体|下拉/.test(name)&&!/直臂/.test(name))return '正握 · 掌心背向自己';
 return '';
}
export function diagramInfo(e){const demo=demos[e.name],detail=grip(e.name);return {family:demo?.id||'unavailable',known:!!demo,id:demo?.id,owned:!!demo?.owned,src:demo?(demo.src||MEDIA_ROOT+demo.id+'.gif'):null,variant:detail,cue:demo?(detail?detail+'。请同时核对画面中的手掌朝向、握距和握把形状。':'查看动作关键姿势，核对器械和身体支撑位置。'):'暂未找到这个动作或变式的准确写实示范；保留记录功能，不以其他动作代替。',source:demo?.owned?null:'https://github.com/JahelCuadrado/ExerciseGymGifsDB'};}
export function illustration(e,small=false){const info=diagramInfo(e);if(!info.known)return `<div class="movement-illustration realistic-demo unavailable-demo" role="img" aria-label="${esc(e.name)}暂无准确示范"><span>暂无准确示范</span><small>不以相似动作替代</small></div>`;
 return `<div class="movement-illustration realistic-demo" data-demo-id="${esc(info.id)}"><img data-exercise-demo src="${esc(info.src)}" alt="${esc(e.name)}写实示范${info.variant?'：'+esc(info.variant):''}" loading="${small?'lazy':'eager'}" decoding="async" crossorigin="anonymous" referrerpolicy="no-referrer"><span class="demo-loading">加载写实示意图</span><span class="demo-error">示范暂未加载<br><small>联网查看后可缓存</small></span></div>`;}
