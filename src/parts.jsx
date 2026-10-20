import {useEffect,useState} from "react";import {motion} from "framer-motion";import {useSortable,SortableContext,verticalListSortingStrategy} from "@dnd-kit/sortable";
import {useDroppable} from "@dnd-kit/core";import {CSS} from "@dnd-kit/utilities";import {Calendar,CheckSquare,Plus,Trash2,X} from "lucide-react";
import {LABELS,PRIOS} from "./data.js";import {overdue,soon,progress} from "./store.js";
const prioColor=p=>PRIOS.find(x=>x[0]===p)?.[1]||"#94A3B8";
const fmt=d=>new Date(d).toLocaleDateString("fr-FR",{day:"numeric",month:"short"});
export function CardBody({c}){const pr=progress(c);return <>
<div className="mb-2 flex flex-wrap gap-1.5">{c.labels.map(l=><span key={l} className="rounded-full px-2 py-0.5 text-[10px] font-medium text-white" style={{background:LABELS[l]}}>{l}</span>)}</div>
<p className="text-sm font-medium leading-snug">{c.titre}</p>
<div className="mt-3 flex items-center gap-3 text-xs opacity-80"><span className="flex items-center gap-1"><i className="h-2 w-2 rounded-full" style={{background:prioColor(c.prio)}}/>{c.prio}</span>
{c.due&&<span className={"flex items-center gap-1 rounded px-1.5 py-0.5 "+(overdue(c)?"bg-rose-500/20 text-rose-400":soon(c)?"bg-amber-500/20 text-amber-500":"")}><Calendar size={12}/>{fmt(c.due)}</span>}
{c.check.length>0&&<span className="flex items-center gap-1"><CheckSquare size={12}/>{c.check.filter(x=>x.d).length}/{c.check.length}</span>}</div>
{c.check.length>0&&<div className="mt-2 h-1 overflow-hidden rounded bg-black/10 dark:bg-white/10"><motion.div initial={{width:0}} animate={{width:pr+"%"}} className="h-full bg-accent"/></div>}</>}
export function Card({c,open}){const {attributes,listeners,setNodeRef,transform,transition,isDragging}=useSortable({id:c.id});
return <div ref={setNodeRef} style={{transform:CSS.Transform.toString(transform),transition,opacity:isDragging?.35:1}} {...attributes} {...listeners} onClick={()=>open(c.id)} className="glass cursor-grab touch-manipulation rounded-xl p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/10"><CardBody c={c}/></div>}
export function Column({col,cards,open,dispatch,onDelete}){const {setNodeRef,isOver}=useDroppable({id:"col:"+col.id});const [t,setT]=useState("");const [ed,setEd]=useState(false);const [name,setName]=useState(col.titre);
const add=e=>{e.preventDefault();if(t.trim()){dispatch({t:"addCard",col:col.id,card:{titre:t.trim()}});setT("")}};
const ren=()=>{setEd(false);name.trim()?dispatch({t:"renameCol",id:col.id,titre:name.trim()}):setName(col.titre)};
return <section className={"flex max-h-full w-[85vw] shrink-0 snap-center flex-col rounded-2xl p-3 transition sm:w-80 "+(isOver?"bg-indigo-500/20 ring-2 ring-indigo-400/60":"bg-black/[.04] dark:bg-white/[.04]")}>
<div className="mb-3 flex items-center gap-2 px-1">{ed?<input autoFocus value={name} onChange={e=>setName(e.target.value)} onBlur={ren} onKeyDown={e=>e.key==="Enter"&&ren()} className="w-full rounded bg-transparent text-sm font-semibold outline-none ring-1 ring-accent"/>:<h2 onDoubleClick={()=>setEd(true)} title="Double-clic pour renommer" className="flex-1 text-sm font-semibold">{col.titre}</h2>}
<span className="rounded-full bg-black/10 px-2 py-0.5 text-xs dark:bg-white/10">{col.ids.length}</span>
<button aria-label="Supprimer la colonne" onClick={onDelete} className="opacity-40 transition hover:text-rose-500 hover:opacity-100"><Trash2 size={15}/></button></div>
<div ref={setNodeRef} className="min-h-[60px] flex-1 space-y-3 overflow-y-auto pb-1"><SortableContext items={cards.map(c=>c.id)} strategy={verticalListSortingStrategy}>{cards.map(c=><Card key={c.id} c={c} open={open}/>)}</SortableContext>
{!cards.length&&<p className="rounded-xl border border-dashed border-current/20 py-6 text-center text-xs opacity-50">Aucune carte ici</p>}</div>
<form onSubmit={add} className="mt-3 flex items-center gap-2"><Plus size={16} className="opacity-50"/><input value={t} onChange={e=>setT(e.target.value)} placeholder="Ajouter une carte (Entrée)" className="w-full bg-transparent text-sm outline-none placeholder:opacity-50"/></form></section>}
export function Modal({init,isNew,onClose,onSave,onDelete}){const [c,setC]=useState(init);const [it,setIt]=useState("");const set=(k,v)=>setC({...c,[k]:v});
useEffect(()=>{const h=e=>e.key==="Escape"&&onClose();window.addEventListener("keydown",h);return()=>window.removeEventListener("keydown",h)},[]);
const inp="w-full rounded-lg border border-black/10 bg-white/60 px-3 py-2 text-sm outline-none focus:border-accent dark:border-white/10 dark:bg-white/5";
return <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 backdrop-blur-sm" onMouseDown={e=>e.target===e.currentTarget&&onClose()}>
<motion.div initial={{scale:.94,y:20}} animate={{scale:1,y:0}} className="glass max-h-[90vh] w-full max-w-lg space-y-4 overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl dark:bg-[#15152b]">
<div className="flex items-center justify-between"><h2 className="text-lg font-semibold">{isNew?"Nouvelle carte":"Modifier la carte"}</h2><button aria-label="Fermer" onClick={onClose}><X/></button></div>
<input autoFocus value={c.titre} onChange={e=>set("titre",e.target.value)} placeholder="Titre" className={inp}/>
<textarea value={c.desc} onChange={e=>set("desc",e.target.value)} placeholder="Description" rows={3} className={inp}/>
<div><p className="mb-2 text-xs uppercase tracking-wider opacity-60">Étiquettes</p><div className="flex flex-wrap gap-2">{Object.entries(LABELS).map(([l,col])=><button key={l} onClick={()=>set("labels",c.labels.includes(l)?c.labels.filter(x=>x!==l):[...c.labels,l])} className="rounded-full border px-3 py-1 text-xs transition" style={c.labels.includes(l)?{background:col,borderColor:col,color:"#fff"}:{borderColor:col+"88"}}>{l}</button>)}</div></div>
<div className="grid grid-cols-2 gap-3"><div><p className="mb-2 text-xs uppercase tracking-wider opacity-60">Priorité</p><select value={c.prio} onChange={e=>set("prio",e.target.value)} className={inp}>{PRIOS.map(p=><option key={p[0]}>{p[0]}</option>)}</select></div>
<div><p className="mb-2 text-xs uppercase tracking-wider opacity-60">Échéance</p><input type="date" value={c.due} onChange={e=>set("due",e.target.value)} className={inp}/></div></div>
<div><p className="mb-2 text-xs uppercase tracking-wider opacity-60">Checklist</p><ul className="space-y-1">{c.check.map((x,i)=><li key={i} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={x.d} onChange={()=>set("check",c.check.map((y,j)=>j===i?{...y,d:!y.d}:y))}/><span className={"flex-1 "+(x.d?"line-through opacity-50":"")}>{x.t}</span><button aria-label="Retirer" onClick={()=>set("check",c.check.filter((_,j)=>j!==i))} className="opacity-40 hover:opacity-100"><X size={14}/></button></li>)}</ul>
<form onSubmit={e=>{e.preventDefault();if(it.trim()){set("check",[...c.check,{t:it.trim(),d:false}]);setIt("")}}}><input value={it} onChange={e=>setIt(e.target.value)} placeholder="Ajouter un élément (Entrée)" className={inp+" mt-2"}/></form></div>
<div className="flex items-center justify-between pt-2">{!isNew?<button onClick={()=>onDelete(c.id)} className="flex items-center gap-1 text-sm text-rose-500"><Trash2 size={15}/>Supprimer</button>:<span/>}
<button onClick={()=>c.titre.trim()&&onSave({...c,titre:c.titre.trim()})} className="rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500 active:scale-95">Enregistrer</button></div></motion.div></motion.div>}
