import {arrayMove} from "@dnd-kit/sortable";import {seed} from "./data.js";
export const uid=()=>Math.random().toString(36).slice(2,9);
export const today=()=>new Date().toISOString().slice(0,10);
export const overdue=c=>!!c.due&&c.due<today();
export const soon=c=>!!c.due&&!overdue(c)&&(new Date(c.due)-new Date(today()))<=172800000;
export const progress=c=>c.check.length?Math.round(100*c.check.filter(x=>x.d).length/c.check.length):0;
export const load=()=>{try{return JSON.parse(localStorage.getItem("fb-state"))||seed()}catch{return seed()}};
export function reducer(s,a){switch(a.t){
case"addCol":return{...s,cols:[...s.cols,{id:uid(),titre:a.titre,ids:[]}]};
case"renameCol":return{...s,cols:s.cols.map(c=>c.id===a.id?{...c,titre:a.titre}:c)};
case"delCol":{const col=s.cols.find(c=>c.id===a.id);const cards={...s.cards};col.ids.forEach(i=>delete cards[i]);return{...s,cols:s.cols.filter(c=>c.id!==a.id),cards}}
case"addCard":{const card={id:uid(),titre:"",desc:"",labels:[],prio:"Moyenne",due:"",check:[],...a.card};return{...s,cards:{...s.cards,[card.id]:card},cols:s.cols.map(c=>c.id===a.col?{...c,ids:[...c.ids,card.id]}:c)}}
case"saveCard":return{...s,cards:{...s.cards,[a.card.id]:a.card}};
case"delCard":{const cards={...s.cards};delete cards[a.id];return{...s,cards,cols:s.cols.map(c=>({...c,ids:c.ids.filter(i=>i!==a.id)}))}}
case"restore":return{...s,cards:{...s.cards,[a.card.id]:a.card},cols:s.cols.map(c=>c.id===a.col?{...c,ids:[...c.ids.slice(0,a.index),a.card.id,...c.ids.slice(a.index)]}:c)};
case"move":{const {id,over}=a;const isCol=over.startsWith("col:");const from=s.cols.find(c=>c.ids.includes(id));const to=isCol?s.cols.find(c=>"col:"+c.id===over):s.cols.find(c=>c.ids.includes(over));if(!from||!to)return s;
const fi=from.ids.indexOf(id);if(from.id===to.id){const ti=isCol?to.ids.length-1:to.ids.indexOf(over);return{...s,cols:s.cols.map(c=>c.id===from.id?{...c,ids:arrayMove(c.ids,fi,ti)}:c)}}
const ti=isCol?to.ids.length:to.ids.indexOf(over);return{...s,cols:s.cols.map(c=>c.id===from.id?{...c,ids:c.ids.filter(x=>x!==id)}:c.id===to.id?{...c,ids:[...c.ids.slice(0,ti),id,...c.ids.slice(ti)]}:c)}}
case"reset":return seed();default:return s}}
