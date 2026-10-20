const iso=n=>{const d=new Date();d.setDate(d.getDate()+n);return d.toISOString().slice(0,10)};
export const LABELS={Design:"#EC4899",Dev:"#6366F1",Bug:"#F59E0B",Marketing:"#10B981",Recherche:"#06B6D4"};
export const PRIOS=[["Basse","#94A3B8"],["Moyenne","#38BDF8"],["Haute","#F59E0B"],["Urgente","#F43F5E"]];
const K=(id,titre,desc,labels,prio,due,check=[])=>({id,titre,desc,labels,prio,due,check:check.map(([t,d])=>({t,d:!!d}))});
export const seed=()=>{const l=[
K("c1","Refonte de la page d'accueil","Nouveau hero et sections de confiance.",["Design"],"Haute",iso(3),[["Maquettes",1],["Validation client",0],["Intégration",0]]),
K("c2","Corriger le bug du panier","La quantité ne se met pas à jour sur mobile.",["Bug","Dev"],"Urgente",iso(-1),[["Reproduire",1],["Corriger",0]]),
K("c3","Interviews utilisateurs","5 entretiens pour valider le parcours d'achat.",["Recherche"],"Moyenne",iso(6)),
K("c4","Campagne newsletter d'octobre","",["Marketing"],"Basse",iso(10)),
K("c5","API de paiement","Intégration du module de paiement mobile.",["Dev"],"Haute",iso(5),[["Documentation",1],["Endpoints",1],["Tests",0]]),
K("c6","Système de design","Couleurs, typographies et composants.",["Design","Dev"],"Moyenne",iso(8),[["Tokens",1],["Boutons",1],["Formulaires",0],["Modales",0]]),
K("c7","Optimiser les images","Passer en WebP et lazy loading.",["Dev"],"Moyenne",iso(2)),
K("c8","Page 404 illustrée","",["Design"],"Basse",""),
K("c9","Authentification","Connexion, inscription, mot de passe oublié.",["Dev"],"Haute",iso(-3),[["Formulaires",1],["Validation",1],["Sessions",1]]),
K("c10","Plan de lancement","Calendrier et responsabilités.",["Marketing"],"Moyenne","",[["Brouillon",1],["Relecture",1]]),
K("c11","Audit d'accessibilité","Contrastes, clavier, lecteurs d'écran.",["Recherche","Dev"],"Haute",iso(4)),
K("c12","Mise en place du projet","Dépôt, outils et conventions.",["Dev"],"Basse","",[["Dépôt",1],["Lint",1]])];
const by=a=>a.map(i=>"c"+i);
return{cols:[{id:"todo",titre:"À faire",ids:by([3,4,8,11])},{id:"doing",titre:"En cours",ids:by([1,2,7])},{id:"review",titre:"En revue",ids:by([5,6])},{id:"done",titre:"Terminé",ids:by([9,10,12])}],cards:Object.fromEntries(l.map(c=>[c.id,c]))}};
