import { useState, useRef, useEffect } from "react";

/* ─── PALETTE ─────────────────────────────────────────── */
const G="#16A34A",GL="#86EFAC",GP="#DCFCE7",GD="#14532D",GM="#22C55E";
const GRAY="#E5E7EB",GM2="#9CA3AF",GD2="#6B7280";
const BK="#111827",BKT="#374151",BG="#F9FAFB",BDR="#E5E7EB";
const RED="#DC2626",REDL="#FEE2E2",AMB="#D97706",AMBL="#FEF3C7";
const BL="#2563EB",BLL="#DBEAFE",PUR="#7C3AED",PURL="#EDE9FE";

/* ─── INITIAL DATA ─────────────────────────────────────── */
const INIT = {
  scrutins:[
    {id:1,titre:"Élection Délégué L3 — Génie Logiciel",desc:"Délégué de classe pour la filière GL niveau L3.",filiere:"Génie Logiciel",niveau:"L3",statut:"ouvert",debut:"2026-05-20T08:00",fin:"2026-05-30T18:00",eligible:180},
    {id:2,titre:"Représentant au Conseil Étudiant",desc:"Représentant de tous les étudiants au conseil.",filiere:"",niveau:"",statut:"ouvert",debut:"2026-05-15T08:00",fin:"2026-06-01T17:00",eligible:280},
    {id:3,titre:"Élection Bureau Des Étudiants 2026",desc:"Élection du BDE pour l'année 2026.",filiere:"",niveau:"L3+M1",statut:"brouillon",debut:"2026-06-05T08:00",fin:"2026-06-05T20:00",eligible:420},
    {id:4,titre:"Délégué Filière Droit — L2",desc:"Délégué pour la filière Droit niveau L2.",filiere:"Droit",niveau:"L2",statut:"cloture",debut:"2026-05-01T08:00",fin:"2026-05-18T18:00",eligible:120}
  ],
  cands:{
    1:[
      {id:1,nom:"KENMATIO Vicens",prog:"Renforcement des droits étudiants, accès aux ressources numériques et amélioration des salles de cours.",ini:"KV",col:G,bg:GP,votes:62,photo:null},
      {id:2,nom:"MBARGA Thierry",prog:"Digitalisation de l'administration, partenariats entreprises, événements culturels et sportifs.",ini:"MT",col:BL,bg:BLL,votes:45,photo:null},
      {id:3,nom:"ATEBA Nadège",prog:"Égalité des chances, tutorat inter-niveaux, bibliothèque numérique ouverte 24h/7j.",ini:"AN",col:AMB,bg:AMBL,votes:15,photo:null},
      {id:4,nom:"Vote Blanc",prog:"Voter blanc signifie participer sans soutenir de candidat. Comptabilisé dans la participation.",ini:"⬜",col:GM2,bg:GRAY,votes:6,photo:null,blanc:true}
    ],
    2:[
      {id:5,nom:"ESSOMBA Patrick",prog:"Amélioration des infrastructures, dialogue avec la direction, défense des droits étudiants.",ini:"EP",col:G,bg:GP,votes:113,photo:null},
      {id:6,nom:"NKOLO Sandrine",prog:"Bien-être étudiant, développement des associations, espace culturel dédié et cafétéria améliorée.",ini:"NS",col:PUR,bg:PURL,votes:72,photo:null},
      {id:7,nom:"FOUDA Alain",prog:"Innovation pédagogique, laboratoires de recherche, bourses internes et stages rémunérés.",ini:"FA",col:"#0891B2",bg:"#CFFAFE",votes:37,photo:null},
      {id:8,nom:"Vote Blanc",prog:"Voter blanc signifie participer sans soutenir de candidat.",ini:"⬜",col:GM2,bg:GRAY,votes:12,photo:null,blanc:true}
    ],
    3:[
      {id:9,nom:"BIYONG Marie-Claire",prog:"Événements culturels, sponsoring externe, bureau moderne et bien équipé.",ini:"BM",col:"#E11D48",bg:"#FFE4E6",votes:0,photo:null},
      {id:10,nom:"ONDOUA Jean-Paul",prog:"Communication digitale, réseaux alumni, partenariats locaux et gestion transparente.",ini:"OJ",col:G,bg:GP,votes:0,photo:null},
      {id:11,nom:"MEKA Estelle",prog:"Sport, santé, bien-être, salle de sport, tournois inter-filières et programme santé.",ini:"ME",col:AMB,bg:AMBL,votes:0,photo:null},
      {id:12,nom:"NGONO Boris",prog:"Culture et arts, expositions étudiantes, concours créatifs et soirées thématiques.",ini:"NB",col:BL,bg:BLL,votes:0,photo:null},
      {id:13,nom:"Vote Blanc",prog:"Voter blanc signifie participer sans soutenir de candidat.",ini:"⬜",col:GM2,bg:GRAY,votes:0,photo:null,blanc:true}
    ],
    4:[
      {id:14,nom:"ZANG Hélène",prog:"Bibliothèque juridique numérique, mentorat entre niveaux, échanges universitaires.",ini:"ZH",col:G,bg:GP,votes:48,photo:null},
      {id:15,nom:"ABANDA Christophe",prog:"Représentation aux examens nationaux, échanges inter-universités, droits des étudiants.",ini:"AC",col:PUR,bg:PURL,votes:32,photo:null},
      {id:16,nom:"Vote Blanc",prog:"Voter blanc signifie participer sans soutenir de candidat.",ini:"⬜",col:GM2,bg:GRAY,votes:15,photo:null,blanc:true}
    ]
  },
  electeurs:[
    {id:1,mat:"20INF4587",nom:"FOUOGUE Gabriella",fil:"Génie Logiciel",niv:"L3",email:"g.fouogue@univ.cm",stat:"eligible",vote:true},
    {id:2,mat:"21INF3291",nom:"KENMATIO Vicens",fil:"Génie Logiciel",niv:"L3",email:"v.kenmatio@univ.cm",stat:"eligible",vote:false},
    {id:3,mat:"22GEST114",nom:"MBARGA Thierry",fil:"Gestion",niv:"L2",email:"t.mbarga@univ.cm",stat:"attente",vote:false},
    {id:4,mat:"20DR1025",nom:"ATEBA Nadège",fil:"Droit",niv:"L3",email:"n.ateba@univ.cm",stat:"suspendu",vote:false},
    {id:5,mat:"21INF5012",nom:"ESSOMBA Patrick",fil:"Génie Logiciel",niv:"L3",email:"p.essomba@univ.cm",stat:"eligible",vote:true},
    {id:6,mat:"22DR2140",nom:"NKOLO Sandrine",fil:"Droit",niv:"L2",email:"s.nkolo@univ.cm",stat:"eligible",vote:false},
    {id:7,mat:"20GEST098",nom:"FOUDA Alain",fil:"Gestion",niv:"M1",email:"a.fouda@univ.cm",stat:"eligible",vote:false},
    {id:8,mat:"23INF1102",nom:"BIYONG Marie-Claire",fil:"Génie Logiciel",niv:"L1",email:"mc.biyong@univ.cm",stat:"attente",vote:false}
  ],
  whitelist:{
    "20INF4587":{nom:"FOUOGUE Gabriella",email:"g.fouogue@univ.cm",fil:"Génie Logiciel",niv:"L3"},
    "21INF3291":{nom:"KENMATIO Vicens",email:"v.kenmatio@univ.cm",fil:"Génie Logiciel",niv:"L3"},
    "22GEST114":{nom:"MBARGA Thierry",email:"t.mbarga@univ.cm",fil:"Gestion",niv:"L2"},
    "20DR1025":{nom:"ATEBA Nadège",email:"n.ateba@univ.cm",fil:"Droit",niv:"L3"}
  }
};

/* ─── HELPERS ──────────────────────────────────────────── */
let _uid = 300;
const uid = () => ++_uid;
const fmtDate = d => { try { return new Date(d).toLocaleDateString("fr-FR",{day:"2-digit",month:"short",year:"numeric"}); } catch { return d||"?"; } };
const dlCSV = (rows,name) => { const b=new Blob(["\uFEFF"+rows.map(r=>r.join(";")).join("\n")],{type:"text/csv;charset=utf-8;"}); const a=document.createElement("a"); a.href=URL.createObjectURL(b); a.download=name; document.body.appendChild(a); a.click(); document.body.removeChild(a); };

/* ─── REUSABLE COMPONENTS ──────────────────────────────── */
const Btn = ({children,onClick,variant="green",size="md",disabled=false,full=false,style:st={}}) => {
  const base = {border:"none",borderRadius:8,fontFamily:"inherit",fontWeight:600,cursor:disabled?"not-allowed":"pointer",opacity:disabled?.5:1,transition:"all .2s",display:"inline-flex",alignItems:"center",gap:6,...(full?{width:"100%",justifyContent:"center"}:{}),...st};
  const sz = size==="sm"?{padding:"6px 12px",fontSize:"0.78rem"}:{padding:"10px 22px",fontSize:"0.875rem"};
  const v = {
    green:{background:G,color:"white"},
    red:{background:REDL,color:RED,border:`1px solid #fecaca`},
    outline:{background:"white",color:BKT,border:`1px solid ${BDR}`},
    blue:{background:BLL,color:BL,border:`1px solid #bfdbfe`},
    ghost:{background:"transparent",color:G,border:`1.5px solid ${G}`}
  }[variant]||{};
  return <button style={{...base,...sz,...v}} onClick={disabled?undefined:onClick}>{children}</button>;
};

const Badge = ({children,color="green"}) => {
  const map = {green:{background:GP,color:GD},amber:{background:AMBL,color:"#92400e"},gray:{background:GRAY,color:GD2},red:{background:REDL,color:"#991b1b"},blue:{background:BLL,color:"#1e40af"}};
  const c = map[color]||map.green;
  return <span style={{...c,padding:"3px 10px",borderRadius:99,fontSize:"0.72rem",fontWeight:700,display:"inline-flex",alignItems:"center",gap:5,whiteSpace:"nowrap"}}><span style={{width:5,height:5,borderRadius:"50%",background:c.color,display:"inline-block"}}></span>{children}</span>;
};

const Input = ({value,onChange,placeholder,type="text",style:st={}}) => (
  <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
    style={{width:"100%",padding:"10px 13px",border:`1.5px solid ${BDR}`,borderRadius:8,fontSize:"0.9rem",fontFamily:"inherit",color:BK,background:"white",outline:"none",...st}}
    onFocus={e=>e.target.style.borderColor=G} onBlur={e=>e.target.style.borderColor=BDR}/>
);

const Select = ({value,onChange,children,style:st={}}) => (
  <select value={value} onChange={e=>onChange(e.target.value)}
    style={{padding:"10px 13px",border:`1.5px solid ${BDR}`,borderRadius:8,fontSize:"0.9rem",fontFamily:"inherit",background:"white",outline:"none",...st}}>
    {children}
  </select>
);

const Card = ({children,style:st={}}) => (
  <div style={{background:"white",border:`1px solid ${BDR}`,borderRadius:12,boxShadow:"0 1px 3px rgba(0,0,0,.08)",...st}}>{children}</div>
);

const Modal = ({open,onClose,title,children,wide=false}) => {
  if(!open) return null;
  return (
    <div onClick={e=>{if(e.target===e.currentTarget)onClose();}} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",zIndex:400,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:"white",borderRadius:20,padding:24,maxWidth:wide?560:480,width:"100%",maxHeight:"90vh",overflowY:"auto",boxShadow:"0 10px 40px rgba(0,0,0,.15)",animation:"mIn .2s ease"}}>
        <style>{`@keyframes mIn{from{transform:scale(.95);opacity:0}to{transform:scale(1);opacity:1}}`}</style>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <h3 style={{fontFamily:"'Sora',sans-serif",fontWeight:700,fontSize:"1.1rem",color:BK,margin:0}}>{title}</h3>
          <button onClick={onClose} style={{border:"none",background:GRAY,borderRadius:"50%",width:30,height:30,cursor:"pointer",fontSize:"1rem",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
};

const FormGroup = ({label,children,hint}) => (
  <div style={{marginBottom:14}}>
    <label style={{display:"block",fontSize:"0.85rem",fontWeight:600,color:BKT,marginBottom:5}}>{label}</label>
    {children}
    {hint&&<div style={{fontSize:"0.75rem",color:GM2,marginTop:3}}>{hint}</div>}
  </div>
);

const InfoBox = ({children,color="blue"}) => {
  const m={blue:{background:BLL,border:`1px solid #bfdbfe`,color:"#1e40af"},green:{background:GP,border:`1px solid ${GL}`,color:GD},amber:{background:AMBL,border:`1px solid #fcd34d`,color:"#92400e"},red:{background:REDL,border:`1px solid #fecaca`,color:"#991b1b"}};
  return <div style={{borderRadius:8,padding:"11px 14px",fontSize:"0.82rem",marginBottom:14,...(m[color]||m.blue)}}>{children}</div>;
};

const Tabs = ({tabs,active,onChange}) => (
  <div style={{display:"flex",gap:3,background:GRAY,padding:4,borderRadius:8,width:"fit-content",flexWrap:"wrap",marginBottom:20}}>
    {tabs.map(t=>(
      <button key={t.value} onClick={()=>onChange(t.value)} style={{padding:"7px 15px",borderRadius:6,fontSize:"0.82rem",fontWeight:600,cursor:"pointer",border:"none",background:active===t.value?"white":"transparent",color:active===t.value?GD:GD2,boxShadow:active===t.value?"0 1px 3px rgba(0,0,0,.08)":"none",transition:"all .2s"}}>
        {t.label}
      </button>
    ))}
  </div>
);

const ProgressBar = ({value,max,color=G}) => {
  const pct = max>0?Math.min(100,Math.round(value/max*100)):0;
  return (
    <div style={{display:"flex",alignItems:"center",gap:8}}>
      <div style={{flex:1,height:9,background:GRAY,borderRadius:99,overflow:"hidden",minWidth:60}}>
        <div style={{width:`${pct}%`,height:"100%",background:color,borderRadius:99,transition:"width .8s"}}/>
      </div>
      <span style={{fontSize:"0.8rem",fontWeight:700,color:G,minWidth:35}}>{pct}%</span>
    </div>
  );
};

const ResultBar = ({nom,votes,total,isWinner,isBlank}) => {
  const pct = total>0?Math.round(votes/total*100):0;
  return (
    <div style={{marginBottom:16}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
        <span style={{fontWeight:600,fontSize:"0.9rem",color:isBlank?GD2:BK}}>{isWinner?"🥇 ":""}{nom}</span>
        <span style={{fontSize:"0.8rem",color:GD2}}>{votes} vote{votes!==1?"s":""}</span>
      </div>
      <div style={{height:11,background:GRAY,borderRadius:99,overflow:"hidden"}}>
        <div style={{width:`${pct}%`,height:"100%",borderRadius:99,background:isBlank?GM2:isWinner?`linear-gradient(90deg,${G},${GM})`:G,transition:"width 1s"}}/>
      </div>
      <div style={{textAlign:"right",marginTop:3,fontSize:"0.78rem",fontWeight:700,color:isBlank?GD2:G}}>{pct}%</div>
    </div>
  );
};

/* ─── SIDEBAR ──────────────────────────────────────────── */
const Sidebar = ({items,mobileOpen}) => (
  <aside style={{width:250,background:"white",borderRight:`1px solid ${BDR}`,padding:"16px 10px",flexShrink:0,position:"sticky",top:60,height:"calc(100vh - 60px)",overflowY:"auto",transition:"transform .3s",
    ...(window.innerWidth<768?{position:"fixed",top:60,left:0,bottom:0,zIndex:160,transform:mobileOpen?"translateX(0)":"translateX(-100%)"}:{})}}>
    {items.map((grp,gi)=>(
      <div key={gi} style={{marginBottom:20}}>
        <div style={{fontSize:"0.68rem",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:GM2,padding:"0 11px",marginBottom:6}}>{grp.label}</div>
        {grp.items.map((it,i)=>(
          <div key={i} onClick={it.onClick} style={{display:"flex",alignItems:"center",gap:9,padding:"9px 11px",borderRadius:8,cursor:"pointer",color:it.active?GD:BKT,background:it.active?GP:"transparent",fontWeight:500,fontSize:"0.875rem",marginBottom:2,transition:"all .2s"}}
            onMouseEnter={e=>{if(!it.active)e.currentTarget.style.background=GRAY;}} onMouseLeave={e=>{if(!it.active)e.currentTarget.style.background="transparent";}}>
            <svg viewBox="0 0 24 24" width={17} height={17} fill="none" stroke="currentColor" strokeWidth={2}><path d={it.icon}/></svg>
            <span style={{flex:1}}>{it.label}</span>
            {it.badge&&<span style={{background:it.badgeColor||G,color:"white",fontSize:"0.68rem",fontWeight:700,padding:"2px 6px",borderRadius:99}}>{it.badge}</span>}
          </div>
        ))}
      </div>
    ))}
  </aside>
);

/* ─── CANDIDATE CARD ───────────────────────────────────── */
const CandCard = ({cand,selected,onSelect,disabled,showActions,onEdit,onDelete}) => (
  <div onClick={!disabled&&onSelect?onSelect:undefined}
    style={{background:selected?GP:"white",border:`2px solid ${selected?G:cand.blanc?"#D1D5DB":BDR}`,borderStyle:cand.blanc?"dashed":"solid",borderRadius:12,padding:"20px 16px",cursor:disabled||!onSelect?"default":"pointer",textAlign:"center",position:"relative",transition:"all .2s",boxShadow:"0 1px 3px rgba(0,0,0,.08)"}}
    onMouseEnter={e=>{if(!disabled&&onSelect&&!selected){e.currentTarget.style.borderColor=GL;e.currentTarget.style.transform="translateY(-2px)";}}}
    onMouseLeave={e=>{if(!disabled&&onSelect&&!selected){e.currentTarget.style.borderColor=cand.blanc?"#D1D5DB":BDR;e.currentTarget.style.transform="none";}}}>
    {selected&&<div style={{position:"absolute",top:10,right:10,width:22,height:22,background:G,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontSize:12,fontWeight:700}}>✓</div>}
    <div style={{width:80,height:80,borderRadius:"50%",margin:"0 auto 12px",overflow:"hidden",border:`3px solid ${GL}`,boxShadow:"0 2px 8px rgba(0,0,0,.12)"}}>
      {cand.photo?<img src={cand.photo} alt={cand.nom} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
        :<div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",background:cand.bg,color:cand.col,fontWeight:700,fontSize:"1.3rem",fontFamily:"'Sora',sans-serif"}}>{cand.ini}</div>}
    </div>
    <div style={{fontWeight:700,fontSize:"0.95rem",color:cand.blanc?GD2:BK,marginBottom:4}}>{cand.nom}</div>
    <div style={{marginBottom:6}}>{cand.blanc?<Badge color="gray">Système</Badge>:<Badge color="green">Candidat</Badge>}</div>
    <div style={{fontSize:"0.78rem",color:GD2,lineHeight:1.5,display:"-webkit-box",WebkitLineClamp:3,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{cand.prog}</div>
    {showActions&&!cand.blanc&&(
      <div style={{display:"flex",gap:6,justifyContent:"center",marginTop:12}}>
        <Btn size="sm" variant="outline" onClick={e=>{e.stopPropagation();onEdit&&onEdit();}}>Modifier</Btn>
        <Btn size="sm" variant="red" onClick={e=>{e.stopPropagation();onDelete&&onDelete();}}>Supprimer</Btn>
      </div>
    )}
    {showActions&&cand.blanc&&<div style={{marginTop:12,fontSize:"0.72rem",color:GM2,fontStyle:"italic"}}>🔒 Géré par le système</div>}
  </div>
);

/* ─── NOTIFICATION ─────────────────────────────────────── */
const Notification = ({notif}) => (
  <div style={{position:"fixed",top:72,right:16,zIndex:500,background:"white",border:`1px solid ${BDR}`,borderRadius:12,padding:"12px 15px",display:"flex",alignItems:"center",gap:10,boxShadow:"0 10px 40px rgba(0,0,0,.1)",maxWidth:320,transform:notif.show?"translateX(0)":"translateX(calc(100% + 24px))",transition:"transform .35s ease"}}>
    <div style={{width:34,height:34,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",background:notif.type==="s"?GP:REDL,flexShrink:0}}>
      {notif.type==="s"?<svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke={G} strokeWidth={2.5}><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        :<svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth={2.5}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>}
    </div>
    <div><strong style={{display:"block",fontSize:"0.875rem",fontWeight:600,color:BK}}>{notif.title}</strong><span style={{fontSize:"0.78rem",color:GD2}}>{notif.msg}</span></div>
  </div>
);

/* ═══════════════════════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════════════════════ */
export default function App() {
  const [page, setPage] = useState("landing");
  const [user, setUser] = useState(null);
  const [data, setData] = useState(INIT);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notif, setNotif] = useState({show:false,type:"s",title:"",msg:""});
  const notifTimer = useRef(null);

  // Admin state
  const [scFilter, setScFilter] = useState("tous");
  const [editingSc, setEditingSc] = useState(null);
  const [deletingSc, setDeletingSc] = useState(null);
  const [scForm, setScForm] = useState({titre:"",desc:"",debut:"",fin:"",filiere:"",niveau:""});
  const [cndScId, setCndScId] = useState(1);
  const [editingCnd, setEditingCnd] = useState(null);
  const [deletingCnd, setDeletingCnd] = useState({scId:null,cId:null});
  const [cndForm, setCndForm] = useState({nom:"",prog:"",ini:"",photo:null,scId:1});
  const [showNewCndModal, setShowNewCndModal] = useState(false);
  const [showNewScModal, setShowNewScModal] = useState(false);
  const [elSearch, setElSearch] = useState("");
  const [elFil, setElFil] = useState("");
  const [elNiv, setElNiv] = useState("");
  const [elStat, setElStat] = useState("");
  const [elPage, setElPage] = useState(1);
  const [viewingEl, setViewingEl] = useState(null);
  const [resScId, setResScId] = useState(null);
  const csvRef = useRef();

  // Student state
  const [voteSc, setVoteSc] = useState(null);
  const [voteIdx, setVoteIdx] = useState(null);
  const [showConfirmVote, setShowConfirmVote] = useState(false);
  const [showVoteSuccess, setShowVoteSuccess] = useState(false);
  const [showPwModal, setShowPwModal] = useState(false);
  const [pwForm, setPwForm] = useState({old:"",new:"",conf:""});
  const [pwStrength, setPwStrength] = useState(0);

  // Matricule check
  const [matVal, setMatVal] = useState("");
  const [matData, setMatData] = useState(null);
  const [regPw, setRegPw] = useState("");
  const [regPwConf, setRegPwConf] = useState("");

  const isMobile = window.innerWidth < 768;

  const ntf = (type,title,msg) => {
    clearTimeout(notifTimer.current);
    setNotif({show:true,type,title,msg});
    notifTimer.current = setTimeout(()=>setNotif(n=>({...n,show:false})),4000);
  };

  const goTo = (p) => { setPage(p); setSidebarOpen(false); if(p==="admin-resultats"&&!resScId){ const opens=data.scrutins.filter(s=>s.statut!=="brouillon"); if(opens.length) setResScId(opens[0].id); } if(p==="vote"&&!voteSc){ const opens=data.scrutins.filter(s=>s.statut==="ouvert"); if(opens.length) setVoteSc(opens[0].id); } };

  /* ─── AUTH ─────────────────────────────────────────────── */
  const loginAs = (role) => { setUser(role); goTo(role==="admin"?"dashboard-admin":"dashboard-student"); ntf("s",role==="admin"?"Accès admin accordé.":"Connexion réussie !",role==="admin"?"Bienvenue, Administrateur.":"Bienvenue, Gabriella."); };
  const logout = () => { setUser(null); goTo("landing"); };

  const checkMat = (v) => { setMatVal(v); setMatData(data.whitelist[v]||null); };
  const calcPwStr = (v) => { let s=0; if(v.length>=8)s++; if(/[A-Z]/.test(v))s++; if(/[0-9]/.test(v))s++; if(/[^A-Za-z0-9]/.test(v))s++; return s; };

  /* ─── SCRUTINS CRUD ─────────────────────────────────────── */
  const filteredScs = () => scFilter==="tous" ? data.scrutins : data.scrutins.filter(s=>s.statut===scFilter);

  const openEditSc = (sc) => { setEditingSc(sc.id); setScForm({titre:sc.titre,desc:sc.desc||"",debut:sc.debut,fin:sc.fin,filiere:sc.filiere||"",niveau:sc.niveau||""}); };

  const saveSc = () => {
    if(!scForm.titre.trim()){ntf("e","Erreur","Le titre est obligatoire.");return;}
    setData(d=>({...d,scrutins:d.scrutins.map(s=>s.id===editingSc?{...s,...scForm}:s)}));
    setEditingSc(null); ntf("s","Scrutin modifié !","Les changements sont enregistrés.");
  };

  const createSc = () => {
    if(!scForm.titre.trim()){ntf("e","Erreur","Le titre est obligatoire.");return;}
    const id=uid();
    setData(d=>({...d,
      scrutins:[...d.scrutins,{id,...scForm,statut:"brouillon",eligible:0}],
      cands:{...d.cands,[id]:[{id:uid(),nom:"Vote Blanc",prog:"Vote blanc — candidat système.",ini:"⬜",col:GM2,bg:GRAY,votes:0,photo:null,blanc:true}]}
    }));
    setShowNewScModal(false); setScForm({titre:"",desc:"",debut:"",fin:"",filiere:"",niveau:""});
    ntf("s","Scrutin créé !","En mode brouillon. Ajoutez des candidats puis ouvrez-le.");
  };

  const deleteSc = () => {
    const id=deletingSc; setDeletingSc(null);
    setData(d=>{ const cands={...d.cands}; delete cands[id]; return {...d,scrutins:d.scrutins.filter(s=>s.id!==id),cands}; });
    ntf("s","Scrutin supprimé.","");
  };

  const toggleStatut = (id,st) => {
    setData(d=>({...d,scrutins:d.scrutins.map(s=>s.id===id?{...s,statut:st}:s)}));
    ntf("s",{ouvert:"Scrutin ouvert !",cloture:"Scrutin clôturé. Résultats publiés."}[st]||"Statut modifié","");
  };

  /* ─── CANDIDATS CRUD ────────────────────────────────────── */
  const openEditCnd = (scId,c) => { setEditingCnd({scId,id:c.id}); setCndForm({nom:c.nom,prog:c.prog,ini:c.ini,photo:c.photo,scId}); };

  const saveCnd = () => {
    const {scId,id}=editingCnd;
    setData(d=>({...d,cands:{...d.cands,[scId]:d.cands[scId].map(c=>c.id===id?{...c,...cndForm}:c)}}));
    setEditingCnd(null); ntf("s","Candidat modifié !","");
  };

  const deleteCnd = () => {
    const {scId,cId}=deletingCnd; setDeletingCnd({scId:null,cId:null});
    setData(d=>({...d,cands:{...d.cands,[scId]:d.cands[scId].filter(c=>c.id!==cId)}}));
    ntf("s","Candidat supprimé.","");
  };

  const addCnd = () => {
    if(!cndForm.nom.trim()){ntf("e","Erreur","Le nom est obligatoire.");return;}
    const {scId}=cndForm; const exist=(data.cands[scId]||[]).filter(c=>!c.blanc);
    const palette=[[G,GP],[BL,BLL],[PUR,PURL],["#E11D48","#FFE4E6"],["#0891B2","#CFFAFE"],[AMB,AMBL]];
    const [col,bg]=palette[exist.length%palette.length];
    const ini=cndForm.ini||(cndForm.nom.split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2));
    const newCnd={id:uid(),nom:cndForm.nom,prog:cndForm.prog,ini,col,bg,votes:0,photo:cndForm.photo,blanc:false};
    setData(d=>{ const prev=d.cands[scId]||[]; const bi=prev.findIndex(c=>c.blanc); const updated=bi>=0?[...prev.slice(0,bi),newCnd,...prev.slice(bi)]:[...prev,newCnd]; return {...d,cands:{...d.cands,[scId]:updated}}; });
    setShowNewCndModal(false); setCndForm({nom:"",prog:"",ini:"",photo:null,scId:cndScId});
    ntf("s","Candidat ajouté !","");
  };

  const handlePhotoUpload = (e,setter) => {
    const f=e.target.files[0]; if(!f) return;
    const r=new FileReader(); r.onload=ev=>setter(ev.target.result); r.readAsDataURL(f);
  };

  /* ─── ÉLECTEURS ─────────────────────────────────────────── */
  const EL_PS = 5;
  const filteredEl = () => data.electeurs.filter(e=>{
    if(elFil&&e.fil!==elFil) return false;
    if(elNiv&&e.niv!==elNiv) return false;
    if(elStat&&e.stat!==elStat) return false;
    if(elSearch){const q=elSearch.toLowerCase(); if(![e.nom,e.mat,e.email].some(v=>v.toLowerCase().includes(q))) return false;}
    return true;
  });

  const changeElStat = (id,st) => {
    if(st==="rejete"){ setData(d=>({...d,electeurs:d.electeurs.filter(e=>e.id!==id)})); ntf("s","Électeur rejeté.",""); }
    else { setData(d=>({...d,electeurs:d.electeurs.map(e=>e.id===id?{...e,stat:st}:e)})); ntf("s","Statut modifié.",""); }
    setViewingEl(null); setElPage(1);
  };

  const exportElCSV = () => {
    const rows=[["Matricule","Nom","Filière","Niveau","Email","Statut","A voté"],...data.electeurs.map(e=>[e.mat,e.nom,e.fil,e.niv,e.email,e.stat,e.vote?"Oui":"Non"])];
    dlCSV(rows,"electeurs.csv"); ntf("s","CSV exporté !","Fichier électeurs téléchargé.");
  };

  const exportResultatsCSV = () => {
    const scId=resScId; const cs=data.cands[scId]||[]; const tv=cs.reduce((a,c)=>a+c.votes,0);
    const sc=data.scrutins.find(s=>s.id===scId);
    const rows=[["Candidat","Votes","Pourcentage"],...cs.map(c=>[c.nom,c.votes,tv?Math.round(c.votes/tv*100)+"%":"0%"])];
    dlCSV(rows,"resultats_"+(sc?sc.titre.replace(/\s+/g,"_"):"")+".csv"); ntf("s","Résultats exportés !","");
  };

  const exportAuditCSV = () => { dlCSV([["Date","Action","Détail"],["25/05/2026 14:32","VOTE","scrutin_id=1"],["25/05/2026 14:28","CONNEXION","20INF4587"]],"audit.csv"); ntf("s","Logs exportés !",""); };

  const handleCSVImport = (e) => { const f=e.target.files[0]; if(!f) return; const r=new FileReader(); r.onload=()=>{ ntf("s","Liste blanche importée !",`${f.name} · Données chargées avec succès`); }; r.readAsText(f,"UTF-8"); };

  /* ─── VOTE ──────────────────────────────────────────────── */
  const confirmVote = () => { setShowConfirmVote(false); setTimeout(()=>setShowVoteSuccess(true),200); };

  /* ─── PASSWORD ──────────────────────────────────────────── */
  const doPwChange = () => {
    if(!pwForm.old){ntf("e","Erreur","Mot de passe actuel requis.");return;}
    if(pwForm.new.length<8){ntf("e","Erreur","Minimum 8 caractères requis.");return;}
    if(pwForm.new!==pwForm.conf){ntf("e","Erreur","Les mots de passe ne correspondent pas.");return;}
    setShowPwModal(false); setPwForm({old:"",new:"",conf:""}); ntf("s","Mot de passe modifié !","Votre nouveau mot de passe est actif.");
  };

  /* ─── SIDEBAR ITEMS ─────────────────────────────────────── */
  const studentSb = [{ label:"Menu", items:[
    {label:"Tableau de bord",icon:"M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z",onClick:()=>goTo("dashboard-student"),active:page==="dashboard-student"},
    {label:"Mes scrutins",icon:"M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",onClick:()=>goTo("vote"),active:page==="vote",badge:data.scrutins.filter(s=>s.statut==="ouvert").length},
    {label:"Résultats",icon:"M22 12h-4l-3 9L9 3l-3 9H2",onClick:()=>goTo("results-student"),active:page==="results-student"},
    {label:"Mon profil",icon:"M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 11a4 4 0 100-8 4 4 0 000 8",onClick:()=>goTo("profile"),active:page==="profile"}
  ]}];

  const adminSb = [{ label:"Administration", items:[
    {label:"Vue d'ensemble",icon:"M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z",onClick:()=>goTo("dashboard-admin"),active:page==="dashboard-admin"},
    {label:"Scrutins",icon:"M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",onClick:()=>goTo("admin-scrutins"),active:page==="admin-scrutins",badge:data.scrutins.length},
    {label:"Électeurs",icon:"M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 7a4 4 0 100-8 4 4 0 000 8",onClick:()=>goTo("admin-electeurs"),active:page==="admin-electeurs"},
    {label:"Candidats",icon:"M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 11a4 4 0 100-8 4 4 0 000 8",onClick:()=>goTo("admin-candidats"),active:page==="admin-candidats"},
    {label:"Résultats live",icon:"M22 12h-4l-3 9L9 3l-3 9H2",onClick:()=>goTo("admin-resultats"),active:page==="admin-resultats"},
    {label:"Logs d'audit",icon:"M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586l5.414 5.414V19a2 2 0 01-2 2z",onClick:()=>goTo("admin-audit"),active:page==="admin-audit"}
  ]}];

  const curSb = user==="admin"?adminSb:user==="student"?studentSb:[];

  /* ═══ RENDER ═══════════════════════════════════════════════ */
  return (
    <div style={{fontFamily:"'Outfit','Helvetica Neue',sans-serif",background:BG,minHeight:"100vh",color:BK,lineHeight:1.6}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Sora:wght@600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:5px;height:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:#9CA3AF;border-radius:99px}
        button:hover:not(:disabled){filter:brightness(.95)}
        @media(max-width:768px){.hide-mobile{display:none!important}.show-mobile{display:flex!important}}
        @media(min-width:769px){.show-mobile{display:none!important}}
      `}</style>

      {/* ─── NAV ─────────────────────────────────────────── */}
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:200,background:"rgba(255,255,255,.97)",backdropFilter:"blur(12px)",borderBottom:`1px solid ${BDR}`,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 20px",height:60,boxShadow:"0 1px 3px rgba(0,0,0,.06)"}}>
        <div onClick={()=>goTo("landing")} style={{display:"flex",alignItems:"center",gap:9,fontFamily:"'Sora',sans-serif",fontWeight:700,fontSize:"1.1rem",color:G,cursor:"pointer"}}>
          <div style={{width:34,height:34,background:G,borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <svg width={18} height={18} viewBox="0 0 24 24" fill="white"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          VoteSecure
        </div>
        {!user&&(
          <div className="hide-mobile" style={{display:"flex",alignItems:"center",gap:6}}>
            {["landing","results-public"].map(p=>(<button key={p} onClick={()=>goTo(p)} style={{padding:"7px 14px",borderRadius:8,border:"none",background:"none",fontFamily:"inherit",fontWeight:500,fontSize:"0.875rem",color:BKT,cursor:"pointer"}}>{p==="landing"?"Accueil":"Résultats"}</button>))}
            <button onClick={()=>goTo("login")} style={{padding:"7px 14px",borderRadius:8,border:"none",background:"none",fontFamily:"inherit",fontWeight:500,fontSize:"0.875rem",color:BKT,cursor:"pointer"}}>Connexion</button>
            <Btn onClick={()=>goTo("register")}>S'inscrire</Btn>
          </div>
        )}
        {user&&(
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:34,height:34,borderRadius:"50%",background:user==="admin"?G:GP,border:`2px solid ${GL}`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:"0.8rem",color:user==="admin"?"white":GD}}>{user==="admin"?"AD":"FK"}</div>
            <span className="hide-mobile" style={{fontSize:"0.875rem",fontWeight:600,color:BKT}}>{user==="admin"?"Administrateur":"Fouogue K."}</span>
            <Btn size="sm" variant="outline" onClick={logout}>Déconnexion</Btn>
          </div>
        )}
        {curSb.length>0&&(
          <button className="show-mobile" onClick={()=>setSidebarOpen(o=>!o)} style={{display:"none",flexDirection:"column",gap:5,border:"none",background:"none",cursor:"pointer",padding:8}}>
            <span style={{display:"block",width:22,height:2,background:BKT,borderRadius:2}}></span>
            <span style={{display:"block",width:22,height:2,background:BKT,borderRadius:2}}></span>
            <span style={{display:"block",width:22,height:2,background:BKT,borderRadius:2}}></span>
          </button>
        )}
      </nav>

      {sidebarOpen&&<div onClick={()=>setSidebarOpen(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",zIndex:150}}/>}

      <main style={{marginTop:60,minHeight:"calc(100vh - 60px)"}}>

        {/* ═══ LANDING ═══════════════════════════════════════ */}
        {page==="landing"&&(
          <div>
            <div style={{background:"linear-gradient(135deg,#f0fdf4,#dcfce7 50%,#bbf7d0)",padding:"72px 24px 56px",textAlign:"center",position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:-80,right:-80,width:350,height:350,background:"radial-gradient(circle,rgba(134,239,172,.35),transparent 70%)",borderRadius:"50%"}}/>
              <div style={{display:"inline-flex",alignItems:"center",gap:6,background:"white",border:`1px solid ${GL}`,padding:"5px 15px",borderRadius:99,fontSize:"0.78rem",fontWeight:700,color:GD,marginBottom:20,boxShadow:"0 1px 3px rgba(0,0,0,.08)"}}>
                <span style={{width:7,height:7,background:G,borderRadius:"50%",animation:"pulse 2s infinite"}}></span>Plateforme officielle — Élections étudiantes
              </div>
              <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
              <h1 style={{fontFamily:"'Sora',sans-serif",fontSize:"clamp(1.9rem,5vw,3.2rem)",fontWeight:700,color:BK,lineHeight:1.15,marginBottom:16,position:"relative",zIndex:1}}>
                Votez pour vos <em style={{color:G,fontStyle:"normal"}}>représentants</em><br/>en toute sécurité
              </h1>
              <p style={{fontSize:"1.05rem",color:BKT,maxWidth:540,margin:"0 auto 28px",position:"relative",zIndex:1}}>Système sécurisé par chiffrement RSA 2048. Anonymat garanti, résultats transparents et auditables.</p>
              <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap",position:"relative",zIndex:1}}>
                <Btn onClick={()=>goTo("register")}>Commencer à voter</Btn>
                <Btn variant="ghost" onClick={()=>goTo("results-public")}>Voir les résultats</Btn>
              </div>
              <div style={{display:"flex",gap:32,justifyContent:"center",marginTop:48,flexWrap:"wrap",position:"relative",zIndex:1}}>
                {[["1 247","Électeurs inscrits"],["3","Scrutins actifs"],["98.4%","Disponibilité"],["RSA 2048","Chiffrement"]].map(([v,l])=>(
                  <div key={l} style={{textAlign:"center"}}><strong style={{display:"block",fontFamily:"'Sora',sans-serif",fontSize:"1.9rem",fontWeight:700,color:G}}>{v}</strong><span style={{fontSize:"0.82rem",color:GD2}}>{l}</span></div>
                ))}
              </div>
            </div>
            <div style={{maxWidth:1100,margin:"0 auto",padding:"48px 24px"}}>
              <div style={{textAlign:"center",marginBottom:40}}>
                <div style={{display:"inline-block",background:GP,color:GD,fontSize:"0.72rem",fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",padding:"4px 13px",borderRadius:99,marginBottom:10}}>Fonctionnalités</div>
                <h2 style={{fontFamily:"'Sora',sans-serif",fontSize:"1.85rem",fontWeight:700,marginBottom:10}}>Tout ce dont vous avez besoin</h2>
                <p style={{color:GD2,maxWidth:460,margin:"0 auto"}}>Plateforme complète pour des élections étudiantes transparentes et sécurisées.</p>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",gap:20}}>
                {[["M7 11V7a5 5 0 0110 0v4M3 11h18v11a2 2 0 01-2 2H5a2 2 0 01-2-2z","Chiffrement RSA 2048","Chaque bulletin chiffré avant transmission. Données ininterceptables."],
                  ["M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100-8 4 4 0 000 8M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75","Anonymat total","Aucun lien entre identité et bulletin. Vie privée garantie."],
                  ["M22 12h-4l-3 9L9 3l-3 9H2","Résultats temps réel","Admin suit les résultats live. Électeurs y accèdent après clôture."],
                  ["M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z","Hash chain d'audit","Journalisation SHA-256 chaînée garantissant l'intégrité du scrutin."],
                  ["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z","Anti-fraude académique","Inscription via liste blanche officielle. Filière et niveau non modifiables."],
                  ["M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z","Éligibilité par filière","Chaque scrutin cible une filière précise. Vous ne voyez que vos votes."]
                ].map(([icon,title,desc])=>(
                  <div key={title} style={{background:"white",border:`1px solid ${BDR}`,borderRadius:20,padding:28,boxShadow:"0 1px 3px rgba(0,0,0,.06)",transition:"all .25s",cursor:"default"}}
                    onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 4px 16px rgba(0,0,0,.08)";e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.borderColor=GL;}}
                    onMouseLeave={e=>{e.currentTarget.style.boxShadow="0 1px 3px rgba(0,0,0,.06)";e.currentTarget.style.transform="none";e.currentTarget.style.borderColor=BDR;}}>
                    <div style={{width:48,height:48,borderRadius:12,background:GP,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:14}}>
                      <svg viewBox="0 0 24 24" width={24} height={24} fill="none" stroke={G} strokeWidth={2}><path d={icon}/></svg>
                    </div>
                    <h3 style={{fontWeight:600,marginBottom:6}}>{title}</h3>
                    <p style={{fontSize:"0.875rem",color:GD2,lineHeight:1.65}}>{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══ LOGIN ═════════════════════════════════════════ */}
        {page==="login"&&(
          <div style={{minHeight:"calc(100vh - 60px)",background:`linear-gradient(135deg,#f0fdf4,${BG} 60%)`,display:"flex",alignItems:"center",justifyContent:"center",padding:"32px 16px"}}>
            <div style={{background:"white",border:`1px solid ${BDR}`,borderRadius:20,padding:36,width:"100%",maxWidth:420,boxShadow:"0 10px 40px rgba(0,0,0,.08)"}}>
              <div style={{textAlign:"center",marginBottom:28}}>
                <div style={{width:56,height:56,background:G,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px"}}><svg width={28} height={28} viewBox="0 0 24 24" fill="white"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></div>
                <h2 style={{fontFamily:"'Sora',sans-serif",fontWeight:700,fontSize:"1.4rem",marginBottom:4}}>Connexion</h2>
                <p style={{color:GD2,fontSize:"0.875rem"}}>Accédez à votre espace de vote sécurisé</p>
              </div>
              <FormGroup label="Matricule ou Email"><Input value="" onChange={()=>{}} placeholder="20INF4587 ou nom@univ.cm"/></FormGroup>
              <FormGroup label="Mot de passe"><Input type="password" value="" onChange={()=>{}} placeholder="••••••••"/></FormGroup>
              <FormGroup label="Vérification de sécurité">
                <div style={{background:BG,border:`1.5px solid ${BDR}`,borderRadius:8,padding:"13px 15px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{width:20,height:20,border:`2px solid ${GM2}`,borderRadius:4,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",background:GP,borderColor:G}}>
                      <span style={{color:G,fontSize:11,fontWeight:700}}>✓</span>
                    </div>
                    <span style={{fontSize:"0.85rem",color:BKT}}>Je ne suis pas un robot</span>
                  </div>
                  <span style={{fontSize:"0.68rem",color:GM2,textAlign:"right",lineHeight:1.4}}>reCAPTCHA<br/>Confidentialité</span>
                </div>
              </FormGroup>
              <Btn full onClick={()=>loginAs("student")} style={{marginTop:4}}>Se connecter</Btn>
              <div style={{textAlign:"center",marginTop:14,fontSize:"0.875rem"}}>Pas de compte ? <span onClick={()=>goTo("register")} style={{color:G,fontWeight:600,cursor:"pointer"}}>S'inscrire</span></div>
              <div style={{margin:"18px 0",textAlign:"center",color:GM2,fontSize:"0.82rem",position:"relative"}}>
                <span style={{background:"white",padding:"0 12px",position:"relative",zIndex:1}}>Accès démo rapide</span>
                <div style={{position:"absolute",top:"50%",left:0,right:0,height:1,background:BDR}}/>
              </div>
              <div style={{display:"flex",gap:8}}>
                <Btn variant="outline" full onClick={()=>loginAs("student")}>👤 Électeur</Btn>
                <Btn variant="outline" full onClick={()=>loginAs("admin")}>⚙️ Administrateur</Btn>
              </div>
            </div>
          </div>
        )}

        {/* ═══ REGISTER ══════════════════════════════════════ */}
        {page==="register"&&(
          <div style={{minHeight:"calc(100vh - 60px)",background:`linear-gradient(135deg,#f0fdf4,${BG} 60%)`,display:"flex",alignItems:"center",justifyContent:"center",padding:"32px 16px"}}>
            <div style={{background:"white",border:`1px solid ${BDR}`,borderRadius:20,padding:36,width:"100%",maxWidth:480,boxShadow:"0 10px 40px rgba(0,0,0,.08)"}}>
              <div style={{textAlign:"center",marginBottom:24}}>
                <div style={{width:56,height:56,background:G,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px"}}><svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5}><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8zM20 8v6M23 11h-6"/></svg></div>
                <h2 style={{fontFamily:"'Sora',sans-serif",fontWeight:700,fontSize:"1.4rem",marginBottom:4}}>Créer un compte</h2>
                <p style={{color:GD2,fontSize:"0.875rem"}}>Votre matricule est vérifié sur la liste officielle</p>
              </div>
              <InfoBox color="blue"><strong>ℹ Comment ça marche :</strong> Saisissez votre matricule. Le système le vérifie et pré-remplit automatiquement vos données académiques.</InfoBox>
              <FormGroup label={<>Numéro de matricule <span style={{color:RED}}>*</span></>} hint={matVal.length>0?(matData?"✓ Matricule reconnu dans la liste officielle":matVal.length>=8?"✗ Matricule non reconnu. Contactez l'administration.":"Vérification en cours..."):"Saisissez votre matricule pour vérification"}>
                <Input value={matVal} onChange={v=>{checkMat(v);}} placeholder="Ex: 20INF4587"/>
              </FormGroup>
              {matData&&(
                <div style={{background:GP,border:`1px solid ${GL}`,borderRadius:8,padding:"12px 14px",marginBottom:14}}>
                  <div style={{fontSize:"0.78rem",fontWeight:700,color:GD,marginBottom:8}}>✓ Matricule reconnu — Données académiques officielles</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                    {[["Nom complet",matData.nom],["Email",matData.email],["Filière",matData.fil],["Niveau",matData.niv]].map(([l,v])=>(
                      <div key={l}><div style={{fontSize:"0.72rem",color:GD2}}>{l}</div><div style={{fontWeight:600,fontSize:"0.875rem"}}>{v}</div></div>
                    ))}
                  </div>
                  <div style={{fontSize:"0.72rem",color:GD,marginTop:6,fontStyle:"italic"}}>🔒 Données officielles non modifiables</div>
                </div>
              )}
              {matData&&(<>
                <FormGroup label={<>Mot de passe <span style={{color:RED}}>*</span></>} hint="Majuscule + chiffre recommandés">
                  <Input type="password" value={regPw} onChange={v=>{setRegPw(v);setPwStrength(calcPwStr(v));}} placeholder="Min. 8 caractères"/>
                  <div style={{height:5,borderRadius:99,background:GRAY,overflow:"hidden",marginTop:5}}>
                    <div style={{width:[0,30,60,85,100][pwStrength]+"%",height:"100%",borderRadius:99,background:["#E5E7EB","#EF4444","#F59E0B","#22C55E",G][pwStrength],transition:"all .3s"}}/>
                  </div>
                </FormGroup>
                <FormGroup label={<>Confirmer le mot de passe <span style={{color:RED}}>*</span></>}>
                  <Input type="password" value={regPwConf} onChange={setRegPwConf} placeholder="Répétez"/>
                </FormGroup>
              </>)}
              <FormGroup label="Vérification de sécurité">
                <div style={{background:BG,border:`1.5px solid ${BDR}`,borderRadius:8,padding:"13px 15px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{width:20,height:20,border:`2px solid ${G}`,borderRadius:4,background:GP,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{color:G,fontSize:11,fontWeight:700}}>✓</span></div>
                    <span style={{fontSize:"0.85rem",color:BKT}}>Je ne suis pas un robot</span>
                  </div>
                  <span style={{fontSize:"0.68rem",color:GM2}}>reCAPTCHA</span>
                </div>
              </FormGroup>
              <Btn full onClick={()=>loginAs("student")}>Créer mon compte</Btn>
              <div style={{textAlign:"center",marginTop:14,fontSize:"0.875rem"}}>Déjà inscrit ? <span onClick={()=>goTo("login")} style={{color:G,fontWeight:600,cursor:"pointer"}}>Se connecter</span></div>
            </div>
          </div>
        )}

        {/* ═══ STUDENT PAGES ═════════════════════════════════ */}
        {["dashboard-student","vote","results-student","profile"].includes(page)&&user==="student"&&(
          <div style={{display:"flex",minHeight:"calc(100vh - 60px)"}}>
            <Sidebar items={studentSb} mobileOpen={sidebarOpen}/>
            <div style={{flex:1,padding:isMobile?20:28,overflowX:"hidden",minWidth:0}}>

              {/* Student Dashboard */}
              {page==="dashboard-student"&&(
                <div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24,flexWrap:"wrap",gap:12}}>
                    <div><h1 style={{fontFamily:"'Sora',sans-serif",fontWeight:700,fontSize:"1.5rem"}}>Bonjour, Gabriella 👋</h1><p style={{color:GD2,fontSize:"0.875rem",marginTop:2}}>Vos scrutins actifs et informations</p></div>
                    <Btn onClick={()=>goTo("vote")}>Voter maintenant</Btn>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:16,marginBottom:24}}>
                    {[[data.scrutins.filter(s=>s.statut==="ouvert").length,"Scrutins éligibles",G,GP],[1,"Vote émis",BL,BLL],[2,"En attente",AMB,AMBL],["L3","Génie Logiciel",G,GP]].map(([v,l,col,bg])=>(
                      <Card key={l} style={{padding:20}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                          <div style={{width:40,height:40,borderRadius:8,background:bg,display:"flex",alignItems:"center",justifyContent:"center"}}>
                            <svg viewBox="0 0 24 24" width={19} height={19} fill="none" stroke={col} strokeWidth={2}><circle cx="12" cy="12" r="10"/></svg>
                          </div>
                          <span style={{fontSize:"0.75rem",fontWeight:600,color:G}}>Actif</span>
                        </div>
                        <div style={{fontFamily:"'Sora',sans-serif",fontSize:"1.85rem",fontWeight:700,color:BK}}>{v}</div>
                        <div style={{fontSize:"0.82rem",color:GD2,marginTop:2}}>{l}</div>
                      </Card>
                    ))}
                  </div>
                  <Card style={{marginBottom:20}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 20px",borderBottom:`1px solid ${BDR}`,flexWrap:"wrap",gap:8}}>
                      <h3 style={{fontWeight:600}}>Mes scrutins actifs</h3>
                      <Btn size="sm" variant="outline" onClick={()=>goTo("vote")}>Voir tous</Btn>
                    </div>
                    <div style={{overflowX:"auto"}}>
                      <table style={{width:"100%",borderCollapse:"collapse",minWidth:500}}>
                        <thead><tr style={{background:BG}}>{["Scrutin","Cible","Clôture","Statut","Action"].map(h=><th key={h} style={{padding:"11px 14px",textAlign:"left",fontSize:"0.72rem",fontWeight:700,color:GD2,textTransform:"uppercase",letterSpacing:"0.05em",whiteSpace:"nowrap"}}>{h}</th>)}</tr></thead>
                        <tbody>
                          {data.scrutins.filter(s=>s.statut==="ouvert").map((sc,i)=>(
                            <tr key={sc.id} style={{borderTop:`1px solid ${BDR}`}}>
                              <td style={{padding:"12px 14px",fontSize:"0.875rem",fontWeight:600}}>{sc.titre}</td>
                              <td style={{padding:"12px 14px"}}><Badge>{(sc.filiere||"Toutes filières")+(sc.niveau?" / "+sc.niveau:"")}</Badge></td>
                              <td style={{padding:"12px 14px",fontSize:"0.875rem",color:GD2}}>{fmtDate(sc.fin)}</td>
                              <td style={{padding:"12px 14px"}}>{i===1?<Badge color="green">Vote émis ✓</Badge>:<Badge color="amber">Pas encore voté</Badge>}</td>
                              <td style={{padding:"12px 14px"}}>{i===1?<Btn size="sm" variant="outline" disabled>Voté</Btn>:<Btn size="sm" onClick={()=>{setVoteSc(sc.id);goTo("vote");}}>Voter</Btn>}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </div>
              )}

              {/* Vote Page */}
              {page==="vote"&&(
                <div>
                  <div style={{marginBottom:16}}>
                    <label style={{display:"block",fontSize:"0.85rem",fontWeight:600,color:BKT,marginBottom:5}}>Choisir un scrutin</label>
                    <Select value={voteSc||""} onChange={v=>{setVoteSc(Number(v));setVoteIdx(null);}} style={{maxWidth:420,width:"100%"}}>
                      {data.scrutins.filter(s=>s.statut==="ouvert").map(sc=><option key={sc.id} value={sc.id}>{sc.titre}</option>)}
                    </Select>
                  </div>
                  {voteSc&&(()=>{
                    const sc=data.scrutins.find(s=>s.id===voteSc); const cs=data.cands[voteSc]||[];
                    const voted=voteSc===2;
                    return (<>
                      <Card style={{padding:"20px 24px",marginBottom:20}}>
                        <h2 style={{fontFamily:"'Sora',sans-serif",fontWeight:700,fontSize:"1.2rem",marginBottom:4}}>{sc?.titre}</h2>
                        <p style={{fontSize:"0.875rem",color:GD2}}>Scrutin ouvert · {cs.filter(c=>!c.blanc).length} candidats · Vote anonyme RSA 2048</p>
                        <div style={{display:"inline-flex",alignItems:"center",gap:8,background:AMBL,color:"#92400e",padding:"9px 16px",borderRadius:8,fontWeight:600,fontSize:"0.875rem",marginTop:12}}>
                          <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                          Clôture le {fmtDate(sc?.fin)}
                        </div>
                      </Card>
                      {voted?<InfoBox color="green">✅ <strong>Vous avez déjà voté pour ce scrutin.</strong> Résultats disponibles après clôture.</InfoBox>:<InfoBox color="blue">🔒 Sélectionnez un candidat puis confirmez votre vote. Action irréversible.</InfoBox>}
                      <h3 style={{fontSize:"0.95rem",fontWeight:600,color:BKT,marginBottom:14}}>Sélectionnez un candidat</h3>
                      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))",gap:14}}>
                        {cs.map((c,i)=><CandCard key={c.id} cand={c} selected={voteIdx===i} onSelect={voted?null:()=>setVoteIdx(i)} disabled={voted}/>)}
                      </div>
                      <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:20,padding:"16px 20px",background:"white",border:`1px solid ${BDR}`,borderRadius:12,boxShadow:"0 1px 3px rgba(0,0,0,.08)"}}>
                        <Btn variant="outline" onClick={()=>goTo("dashboard-student")}>Annuler</Btn>
                        <Btn disabled={voteIdx===null||voted} onClick={()=>{const c=cs[voteIdx];if(c)setShowConfirmVote(c);}}>Confirmer mon vote</Btn>
                      </div>
                    </>);
                  })()}
                </div>
              )}

              {/* Results Student */}
              {page==="results-student"&&(
                <div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24,flexWrap:"wrap",gap:12}}>
                    <div><h1 style={{fontFamily:"'Sora',sans-serif",fontWeight:700,fontSize:"1.5rem"}}>Résultats des scrutins</h1><p style={{color:GD2,fontSize:"0.875rem",marginTop:2}}>Accessibles après clôture uniquement</p></div>
                  </div>
                  {data.scrutins.filter(s=>s.statut==="cloture").map(sc=>{
                    const cs=data.cands[sc.id]||[]; const tv=cs.reduce((a,c)=>a+c.votes,0);
                    const sorted=[...cs].sort((a,b)=>b.votes-a.votes);
                    return (
                      <div key={sc.id} style={{background:"white",border:`1px solid ${BDR}`,borderRadius:20,overflow:"hidden",boxShadow:"0 4px 16px rgba(0,0,0,.06)",marginBottom:20}}>
                        <div style={{background:G,color:"white",padding:"20px 28px"}}>
                          <h3 style={{fontFamily:"'Sora',sans-serif",fontWeight:700,fontSize:"1.1rem"}}>{sc.titre}</h3>
                          <p style={{fontSize:"0.82rem",opacity:.85,marginTop:3}}>Clôturé le {fmtDate(sc.fin)} · {tv}/{sc.eligible} votants</p>
                        </div>
                        <div style={{padding:"20px 28px"}}>
                          {sorted[0]&&<div style={{display:"flex",alignItems:"center",gap:14,background:GP,border:`1px solid ${GL}`,borderRadius:12,padding:"12px 16px",marginBottom:20}}>
                            <span style={{fontSize:"1.8rem"}}>🏆</span>
                            <div><div style={{fontWeight:700,fontSize:"0.95rem"}}>{sorted[0].nom} — Vainqueur</div><div style={{fontSize:"0.82rem",color:G,fontWeight:600}}>{tv?Math.round(sorted[0].votes/tv*100):0}% · {sorted[0].votes} votes</div></div>
                          </div>}
                          {sorted.map((c,i)=><ResultBar key={c.id} nom={c.nom} votes={c.votes} total={tv} isWinner={i===0&&!c.blanc} isBlank={c.blanc}/>)}
                          <div style={{display:"flex",gap:24,marginTop:16,paddingTop:14,borderTop:`1px solid ${BDR}`,flexWrap:"wrap"}}>
                            {[["Participation",tv>0?Math.round(tv/sc.eligible*100)+"%":"0%",G],["Total votes",tv,BK],["Abstentions",sc.eligible-tv,BK]].map(([l,v,c])=>(
                              <div key={l}><div style={{fontSize:"0.72rem",color:GM2,fontWeight:700,textTransform:"uppercase"}}>{l}</div><div style={{fontSize:"1.2rem",fontWeight:700,color:c}}>{v}</div></div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {data.scrutins.filter(s=>s.statut==="ouvert").map(sc=>(
                    <Card key={sc.id} style={{padding:24,textAlign:"center",marginBottom:16}}>
                      <div style={{width:52,height:52,background:AMBL,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px"}}><svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke={AMB} strokeWidth={2}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
                      <h3 style={{fontSize:"0.95rem",fontWeight:600,marginBottom:4}}>{sc.titre} — En cours</h3>
                      <p style={{fontSize:"0.875rem",color:GD2}}>Résultats disponibles après clôture le {fmtDate(sc.fin)}</p>
                    </Card>
                  ))}
                </div>
              )}

              {/* Profile */}
              {page==="profile"&&(
                <div style={{maxWidth:680}}>
                  <div style={{marginBottom:24}}><h1 style={{fontFamily:"'Sora',sans-serif",fontWeight:700,fontSize:"1.5rem"}}>Mon profil</h1><p style={{color:GD2,fontSize:"0.875rem",marginTop:2}}>Informations académiques officielles</p></div>
                  <div style={{background:"white",border:`1px solid ${BDR}`,borderRadius:20,overflow:"hidden",boxShadow:"0 4px 16px rgba(0,0,0,.06)"}}>
                    <div style={{height:110,background:`linear-gradient(135deg,${G},${GM})`,position:"relative"}}>
                      <div style={{position:"absolute",bottom:-34,left:22}}>
                        <div style={{width:68,height:68,borderRadius:"50%",background:"white",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Sora',sans-serif",fontSize:"1.4rem",fontWeight:700,color:GD,border:"4px solid white",boxShadow:"0 4px 12px rgba(0,0,0,.1)"}}>FK</div>
                      </div>
                    </div>
                    <div style={{padding:"44px 22px 22px"}}>
                      <div style={{fontFamily:"'Sora',sans-serif",fontSize:"1.2rem",fontWeight:700}}>FOUOGUE Gabriella Kamga</div>
                      <div style={{color:GD2,fontSize:"0.875rem",marginTop:3}}>Étudiante · Génie Logiciel · L3</div>
                      <div style={{display:"flex",gap:8,marginTop:12,flexWrap:"wrap"}}><Badge>Compte actif</Badge><Badge color="blue">3 scrutins éligibles</Badge></div>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginTop:20}}>
                        {[["Matricule","20INF4587"],["Email","g.fouogue@univ.cm"],["Filière","Génie Logiciel"],["Niveau","L3"],["Inscription","20 mai 2026"],["Votes émis","1 / 3 scrutins"]].map(([l,v])=>(
                          <div key={l}><div style={{fontSize:"0.73rem",fontWeight:700,color:GM2,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:3}}>{l}</div><div style={{fontSize:"0.9rem",fontWeight:600}}>{v}</div></div>
                        ))}
                      </div>
                      <InfoBox color="amber" style={{marginTop:20}}><strong>⚠ Données non modifiables :</strong> Filière et niveau issus de la liste blanche. Contactez l'administration pour correction.</InfoBox>
                      <div style={{display:"flex",gap:10,flexWrap:"wrap",marginTop:16}}>
                        <Btn onClick={()=>setShowPwModal(true)}>Changer le mot de passe</Btn>
                        <Btn variant="outline" onClick={()=>{dlCSV([["Date","Action","Détail"],["24/05/2026 14:32","VOTE","Représentant Conseil · Anonymisé"],["24/05/2026 14:28","CONNEXION","Session JWT"],["20/05/2026 10:05","INSCRIPTION","Compte créé"]],"historique_fouogue.csv");ntf("s","Historique téléchargé !","Fichier CSV exporté.");}}>⬇ Télécharger mon historique</Btn>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══ ADMIN PAGES ═══════════════════════════════════ */}
        {["dashboard-admin","admin-scrutins","admin-electeurs","admin-candidats","admin-resultats","admin-audit"].includes(page)&&user==="admin"&&(
          <div style={{display:"flex",minHeight:"calc(100vh - 60px)"}}>
            <Sidebar items={adminSb} mobileOpen={sidebarOpen}/>
            <div style={{flex:1,padding:isMobile?16:28,overflowX:"hidden",minWidth:0}}>

              {/* Admin Dashboard */}
              {page==="dashboard-admin"&&(
                <div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24,flexWrap:"wrap",gap:12}}>
                    <div><h1 style={{fontFamily:"'Sora',sans-serif",fontWeight:700,fontSize:"1.5rem"}}>Tableau de bord Admin</h1><p style={{color:GD2,fontSize:"0.875rem",marginTop:2}}>Vue d'ensemble en temps réel</p></div>
                    <Btn onClick={()=>{setShowNewScModal(true);setScForm({titre:"",desc:"",debut:"",fin:"",filiere:"",niveau:""});}}>+ Nouveau scrutin</Btn>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:16,marginBottom:24}}>
                    {[[data.electeurs.length,"Électeurs inscrits",BL,BLL],[data.scrutins.filter(s=>s.statut==="ouvert").length,"Scrutins actifs",G,GP],[data.scrutins.reduce((a,sc)=>{const cs=data.cands[sc.id]||[];return a+cs.reduce((b,c)=>b+c.votes,0);},0),"Votes enregistrés",G,GP],["71.5%","Participation moy.",AMB,AMBL]].map(([v,l,col,bg])=>(
                      <Card key={l} style={{padding:20}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                          <div style={{width:40,height:40,borderRadius:8,background:bg,display:"flex",alignItems:"center",justifyContent:"center"}}><svg viewBox="0 0 24 24" width={19} height={19} fill="none" stroke={col} strokeWidth={2}><circle cx="12" cy="12" r="10"/></svg></div>
                          <span style={{fontSize:"0.75rem",fontWeight:600,color:G}}>↑</span>
                        </div>
                        <div style={{fontFamily:"'Sora',sans-serif",fontSize:"1.85rem",fontWeight:700,color:BK}}>{v}</div>
                        <div style={{fontSize:"0.82rem",color:GD2,marginTop:2}}>{l}</div>
                      </Card>
                    ))}
                  </div>
                  <Card style={{marginBottom:20}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 20px",borderBottom:`1px solid ${BDR}`,flexWrap:"wrap",gap:8}}>
                      <h3 style={{fontWeight:600}}>Scrutins actifs</h3>
                      <Btn size="sm" variant="outline" onClick={()=>goTo("admin-scrutins")}>Gérer tous</Btn>
                    </div>
                    <div style={{overflowX:"auto"}}>
                      <table style={{width:"100%",borderCollapse:"collapse",minWidth:500}}>
                        <thead><tr style={{background:BG}}>{["Titre","Votes","Participation","Statut","Action"].map(h=><th key={h} style={{padding:"11px 14px",textAlign:"left",fontSize:"0.72rem",fontWeight:700,color:GD2,textTransform:"uppercase",letterSpacing:"0.05em"}}>{h}</th>)}</tr></thead>
                        <tbody>
                          {data.scrutins.filter(s=>s.statut==="ouvert").map(sc=>{
                            const cs=data.cands[sc.id]||[]; const tv=cs.reduce((a,c)=>a+c.votes,0);
                            return (<tr key={sc.id} style={{borderTop:`1px solid ${BDR}`}}>
                              <td style={{padding:"12px 14px",fontWeight:600,fontSize:"0.875rem"}}>{sc.titre}</td>
                              <td style={{padding:"12px 14px",fontSize:"0.875rem"}}>{tv}/{sc.eligible}</td>
                              <td style={{padding:"12px 14px",minWidth:160}}><ProgressBar value={tv} max={sc.eligible}/></td>
                              <td style={{padding:"12px 14px"}}><Badge>Ouvert</Badge></td>
                              <td style={{padding:"12px 14px"}}><div style={{display:"flex",gap:6,flexWrap:"wrap"}}><Btn size="sm" variant="outline" onClick={()=>{setResScId(sc.id);goTo("admin-resultats");}}>Résultats</Btn><Btn size="sm" variant="red" onClick={()=>toggleStatut(sc.id,"cloture")}>Clôturer</Btn></div></td>
                            </tr>);
                          })}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                  <Card>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 20px",borderBottom:`1px solid ${BDR}`,flexWrap:"wrap",gap:8}}>
                      <h3 style={{fontWeight:600}}>Liste blanche officielle</h3>
                      <Btn size="sm" variant="outline" onClick={exportElCSV}>⬇ Exporter CSV</Btn>
                    </div>
                    <div style={{padding:20}}>
                      <input ref={csvRef} type="file" accept=".csv" style={{display:"none"}} onChange={handleCSVImport}/>
                      <div onClick={()=>csvRef.current?.click()} style={{border:`2px dashed ${GL}`,background:GP,borderRadius:12,padding:32,textAlign:"center",cursor:"pointer",transition:"all .2s"}}
                        onMouseEnter={e=>{e.currentTarget.style.borderColor=G;e.currentTarget.style.background="#dcfce7";}}
                        onMouseLeave={e=>{e.currentTarget.style.borderColor=GL;e.currentTarget.style.background=GP;}}>
                        <svg viewBox="0 0 24 24" width={36} height={36} fill="none" stroke={G} strokeWidth={1.5} style={{display:"block",margin:"0 auto 10px"}}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                        <p style={{fontSize:"0.9rem",color:GD,fontWeight:600,marginBottom:4}}>Cliquez pour importer votre fichier CSV</p>
                        <span style={{fontSize:"0.78rem",color:GD2}}>Format : CSV UTF-8 · Colonnes : matricule, nom, prénom, email, filière, niveau</span>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {/* Admin Scrutins */}
              {page==="admin-scrutins"&&(
                <div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24,flexWrap:"wrap",gap:12}}>
                    <div><h1 style={{fontFamily:"'Sora',sans-serif",fontWeight:700,fontSize:"1.5rem"}}>Gestion des scrutins</h1><p style={{color:GD2,fontSize:"0.875rem",marginTop:2}}>{filteredScs().length} scrutin(s) — filtre : {scFilter}</p></div>
                    <Btn onClick={()=>{setShowNewScModal(true);setScForm({titre:"",desc:"",debut:"",fin:"",filiere:"",niveau:""});}}>+ Nouveau scrutin</Btn>
                  </div>
                  <Tabs tabs={[{label:`Tous (${data.scrutins.length})`,value:"tous"},{label:`Ouverts (${data.scrutins.filter(s=>s.statut==="ouvert").length})`,value:"ouvert"},{label:`Brouillons (${data.scrutins.filter(s=>s.statut==="brouillon").length})`,value:"brouillon"},{label:`Clôturés (${data.scrutins.filter(s=>s.statut==="cloture").length})`,value:"cloture"}]} active={scFilter} onChange={setScFilter}/>
                  {filteredScs().length===0&&<Card style={{padding:40,textAlign:"center",color:GD2}}>Aucun scrutin pour ce filtre.</Card>}
                  {filteredScs().map(sc=>{
                    const cs=data.cands[sc.id]||[]; const tv=cs.reduce((a,c)=>a+c.votes,0); const pt=sc.eligible>0?Math.round(tv/sc.eligible*100):0;
                    const cible=(sc.filiere||"Toutes filières")+(sc.niveau?" / "+sc.niveau:"");
                    return (
                      <Card key={sc.id} style={{marginBottom:12,padding:20}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:16,flexWrap:"wrap"}}>
                          <div style={{flex:1,minWidth:200}}>
                            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                              {sc.statut==="ouvert"?<Badge>Ouvert</Badge>:sc.statut==="brouillon"?<Badge color="amber">Brouillon</Badge>:<Badge color="gray">Clôturé</Badge>}
                              <span style={{fontSize:"0.72rem",color:GM2}}>ID:#{sc.id}</span>
                            </div>
                            <div style={{fontSize:"1rem",fontWeight:700,color:BK,marginBottom:4}}>{sc.titre}</div>
                            <div style={{fontSize:"0.82rem",color:GD2,marginBottom:12}}>Du {fmtDate(sc.debut)} au {fmtDate(sc.fin)} · {cible} · {sc.eligible} éligibles</div>
                            <div style={{display:"flex",gap:24,flexWrap:"wrap"}}>
                              {[["Votes",`${tv}/${sc.eligible}`],["Participation",`${pt}%`],["Candidats",`${cs.filter(c=>!c.blanc).length} + vote blanc`]].map(([l,v])=>(
                                <div key={l}><div style={{fontSize:"0.72rem",color:GM2}}>{l}</div><div style={{fontWeight:700,color:l==="Participation"?G:BK}}>{v}</div></div>
                              ))}
                            </div>
                          </div>
                          <div style={{display:"flex",flexDirection:"column",gap:6,flexShrink:0}}>
                            {sc.statut==="ouvert"&&<><Btn size="sm" variant="outline" onClick={()=>openEditSc(sc)}>Modifier</Btn><Btn size="sm" variant="outline" onClick={()=>{setResScId(sc.id);goTo("admin-resultats");}}>Résultats</Btn><Btn size="sm" variant="red" onClick={()=>toggleStatut(sc.id,"cloture")}>Clôturer</Btn><Btn size="sm" variant="red" onClick={()=>setDeletingSc(sc.id)}>Supprimer</Btn></>}
                            {sc.statut==="brouillon"&&<><Btn size="sm" onClick={()=>toggleStatut(sc.id,"ouvert")}>Ouvrir</Btn><Btn size="sm" variant="outline" onClick={()=>openEditSc(sc)}>Modifier</Btn><Btn size="sm" variant="red" onClick={()=>setDeletingSc(sc.id)}>Supprimer</Btn></>}
                            {sc.statut==="cloture"&&<><Btn size="sm" variant="outline" onClick={()=>{setResScId(sc.id);goTo("admin-resultats");}}>Voir résultats</Btn><Btn size="sm" variant="red" onClick={()=>setDeletingSc(sc.id)}>Supprimer</Btn></>}
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}

              {/* Admin Électeurs */}
              {page==="admin-electeurs"&&(()=>{
                const els=filteredEl(); const total=els.length; const pages=Math.max(1,Math.ceil(total/EL_PS)); const pg=Math.min(elPage,pages); const start=(pg-1)*EL_PS; const slice=els.slice(start,start+EL_PS);
                return (
                  <div>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24,flexWrap:"wrap",gap:12}}>
                      <div><h1 style={{fontFamily:"'Sora',sans-serif",fontWeight:700,fontSize:"1.5rem"}}>Gestion des électeurs</h1><p style={{color:GD2,fontSize:"0.875rem",marginTop:2}}>{data.electeurs.length} inscrits · {data.electeurs.filter(e=>e.stat==="attente").length} en attente</p></div>
                      <Btn variant="outline" onClick={exportElCSV}>⬇ Exporter CSV</Btn>
                    </div>
                    <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap"}}>
                      <Input value={elSearch} onChange={v=>{setElSearch(v);setElPage(1);}} placeholder="Rechercher nom, matricule, email…" style={{flex:1,minWidth:200}}/>
                      <Select value={elFil} onChange={v=>{setElFil(v);setElPage(1);}} style={{minWidth:150}}><option value="">Toutes filières</option><option>Génie Logiciel</option><option>Gestion</option><option>Droit</option></Select>
                      <Select value={elNiv} onChange={v=>{setElNiv(v);setElPage(1);}} style={{minWidth:120}}><option value="">Tous niveaux</option>{["L1","L2","L3","M1","M2"].map(n=><option key={n}>{n}</option>)}</Select>
                      <Select value={elStat} onChange={v=>{setElStat(v);setElPage(1);}} style={{minWidth:140}}><option value="">Tous statuts</option><option value="eligible">Éligible</option><option value="attente">En attente</option><option value="suspendu">Suspendu</option></Select>
                    </div>
                    <Card>
                      <div style={{overflowX:"auto"}}>
                        <table style={{width:"100%",borderCollapse:"collapse",minWidth:600}}>
                          <thead><tr style={{background:BG}}>{["Matricule","Nom","Filière/Niv.","Email","Statut","A voté","Actions"].map(h=><th key={h} style={{padding:"11px 14px",textAlign:"left",fontSize:"0.72rem",fontWeight:700,color:GD2,textTransform:"uppercase",letterSpacing:"0.05em",whiteSpace:"nowrap"}}>{h}</th>)}</tr></thead>
                          <tbody>
                            {slice.map(e=>(
                              <tr key={e.id} style={{borderTop:`1px solid ${BDR}`}}>
                                <td style={{padding:"12px 14px"}}><code style={{fontSize:"0.78rem",background:BG,padding:"2px 6px",borderRadius:4}}>{e.mat}</code></td>
                                <td style={{padding:"12px 14px",fontWeight:600,fontSize:"0.875rem"}}>{e.nom}</td>
                                <td style={{padding:"12px 14px",fontSize:"0.82rem",color:GD2}}>{e.fil}/{e.niv}</td>
                                <td style={{padding:"12px 14px",fontSize:"0.8rem"}}>{e.email}</td>
                                <td style={{padding:"12px 14px"}}>{e.stat==="eligible"?<Badge>Éligible</Badge>:e.stat==="attente"?<Badge color="amber">En attente</Badge>:<Badge color="red">Suspendu</Badge>}</td>
                                <td style={{padding:"12px 14px"}}>{e.vote?<Badge color="blue">Oui</Badge>:<Badge color="gray">Non</Badge>}</td>
                                <td style={{padding:"12px 14px"}}>
                                  <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                                    {e.stat==="eligible"&&<><Btn size="sm" variant="outline" onClick={()=>setViewingEl(e)}>Voir</Btn><Btn size="sm" variant="red" onClick={()=>changeElStat(e.id,"suspendu")}>Suspendre</Btn></>}
                                    {e.stat==="attente"&&<><Btn size="sm" onClick={()=>changeElStat(e.id,"eligible")}>Valider</Btn><Btn size="sm" variant="red" onClick={()=>changeElStat(e.id,"rejete")}>Rejeter</Btn></>}
                                    {e.stat==="suspendu"&&<><Btn size="sm" onClick={()=>changeElStat(e.id,"eligible")}>Réactiver</Btn><Btn size="sm" variant="outline" onClick={()=>setViewingEl(e)}>Voir</Btn></>}
                                  </div>
                                </td>
                              </tr>
                            ))}
                            {slice.length===0&&<tr><td colSpan={7} style={{padding:32,textAlign:"center",color:GD2}}>Aucun résultat.</td></tr>}
                          </tbody>
                        </table>
                      </div>
                      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 16px",borderTop:`1px solid ${BDR}`,flexWrap:"wrap",gap:8}}>
                        <span style={{fontSize:"0.82rem",color:GD2}}>{total===0?"0":`${start+1}–${Math.min(start+EL_PS,total)}`} sur {total}</span>
                        <div style={{display:"flex",gap:6}}>
                          <Btn size="sm" variant="outline" disabled={pg<=1} onClick={()=>setElPage(p=>Math.max(1,p-1))}>← Préc.</Btn>
                          <Btn size="sm" disabled={pg>=pages} onClick={()=>setElPage(p=>p+1)}>Suiv. →</Btn>
                        </div>
                      </div>
                    </Card>
                  </div>
                );
              })()}

              {/* Admin Candidats */}
              {page==="admin-candidats"&&(
                <div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24,flexWrap:"wrap",gap:12}}>
                    <div><h1 style={{fontFamily:"'Sora',sans-serif",fontWeight:700,fontSize:"1.5rem"}}>Gestion des candidats</h1><p style={{color:GD2,fontSize:"0.875rem",marginTop:2}}>Gérer les candidats par scrutin</p></div>
                    <Btn onClick={()=>{setCndForm({nom:"",prog:"",ini:"",photo:null,scId:cndScId});setShowNewCndModal(true);}}>+ Ajouter un candidat</Btn>
                  </div>
                  <div style={{marginBottom:20}}>
                    <label style={{display:"block",fontSize:"0.85rem",fontWeight:600,color:BKT,marginBottom:5}}>Scrutin sélectionné</label>
                    <Select value={cndScId} onChange={v=>{setCndScId(Number(v));}} style={{maxWidth:420,width:"100%"}}>
                      {data.scrutins.map(sc=><option key={sc.id} value={sc.id}>{sc.titre}</option>)}
                    </Select>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:14}}>
                    {(data.cands[cndScId]||[]).map(c=>(
                      <CandCard key={c.id} cand={c} showActions onEdit={()=>openEditCnd(cndScId,c)} onDelete={()=>setDeletingCnd({scId:cndScId,cId:c.id})}/>
                    ))}
                  </div>
                </div>
              )}

              {/* Admin Résultats Live */}
              {page==="admin-resultats"&&(()=>{
                const sc=data.scrutins.find(s=>s.id===resScId); const cs=data.cands[resScId]||[]; const tv=cs.reduce((a,c)=>a+c.votes,0); const pt=sc&&sc.eligible>0?Math.round(tv/sc.eligible*100):0;
                const sorted=[...cs].sort((a,b)=>b.votes-a.votes);
                return (
                  <div>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24,flexWrap:"wrap",gap:12}}>
                      <div><h1 style={{fontFamily:"'Sora',sans-serif",fontWeight:700,fontSize:"1.5rem"}}>Résultats en temps réel</h1><p style={{color:GD2,fontSize:"0.875rem",marginTop:2}}>Visible uniquement par l'administrateur</p></div>
                      <Btn variant="outline" onClick={exportResultatsCSV}>⬇ Exporter CSV</Btn>
                    </div>
                    <InfoBox color="amber">⚠ <strong>Accès restreint :</strong> Résultats provisoires. Électeurs n'y accèdent qu'après clôture officielle.</InfoBox>
                    <div style={{marginBottom:20}}>
                      <label style={{display:"block",fontSize:"0.85rem",fontWeight:600,color:BKT,marginBottom:5}}>Scrutin</label>
                      <Select value={resScId||""} onChange={v=>setResScId(Number(v))} style={{maxWidth:420,width:"100%"}}>
                        {data.scrutins.filter(s=>s.statut!=="brouillon").map(sc=><option key={sc.id} value={sc.id}>{sc.titre} ({sc.statut})</option>)}
                      </Select>
                    </div>
                    {sc&&(<>
                      <Card style={{marginBottom:20,padding:20}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14,flexWrap:"wrap",gap:8}}>
                          <div><div style={{fontWeight:600,fontSize:"0.95rem"}}>{sc.titre}</div><div style={{fontSize:"0.8rem",color:GD2,marginTop:2}}>Mise à jour en temps réel · Statut : {sc.statut}</div></div>
                          <div style={{textAlign:"right"}}><div style={{fontFamily:"'Sora',sans-serif",fontSize:"1.5rem",fontWeight:700,color:G}}>{pt}%</div><div style={{fontSize:"0.78rem",color:GD2}}>{tv}/{sc.eligible} votants</div></div>
                        </div>
                        <ProgressBar value={tv} max={sc.eligible}/>
                      </Card>
                      <Card>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 20px",borderBottom:`1px solid ${BDR}`}}><h3 style={{fontWeight:600}}>Résultats provisoires</h3></div>
                        <div style={{padding:"20px 28px"}}>
                          {sorted.map((c,i)=><ResultBar key={c.id} nom={c.nom} votes={c.votes} total={tv} isWinner={i===0&&!c.blanc} isBlank={c.blanc}/>)}
                          <div style={{display:"flex",gap:24,marginTop:16,paddingTop:14,borderTop:`1px solid ${BDR}`,flexWrap:"wrap"}}>
                            {[["Total votes",tv],["Abstentions",sc.eligible-tv],["Éligibles",sc.eligible]].map(([l,v])=>(
                              <div key={l}><div style={{fontSize:"0.72rem",color:GM2,fontWeight:700,textTransform:"uppercase"}}>{l}</div><div style={{fontSize:"1.2rem",fontWeight:700,color:BK}}>{v}</div></div>
                            ))}
                          </div>
                        </div>
                      </Card>
                    </>)}
                  </div>
                );
              })()}

              {/* Admin Audit */}
              {page==="admin-audit"&&(
                <div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24,flexWrap:"wrap",gap:12}}>
                    <div><h1 style={{fontFamily:"'Sora',sans-serif",fontWeight:700,fontSize:"1.5rem"}}>Journal d'audit</h1><p style={{color:GD2,fontSize:"0.875rem",marginTop:2}}>Traçabilité complète via hash chain SHA-256</p></div>
                    <Btn variant="outline" onClick={exportAuditCSV}>⬇ Exporter logs</Btn>
                  </div>
                  <Card>
                    <div style={{padding:"12px 20px",background:GP,borderBottom:`1px solid ${GL}`}}>
                      <div style={{fontSize:"0.875rem",fontWeight:600,color:GD}}>🔗 Intégrité de la chaîne : Vérifiée</div>
                      <div style={{fontSize:"0.78rem",color:GD2,marginTop:2}}>Hash courant : <code style={{background:"white",padding:"2px 6px",borderRadius:4,fontSize:"0.75rem"}}>a7f3c2e1b4d8…f92a</code></div>
                    </div>
                    <div style={{padding:"0 16px"}}>
                      {[{dot:G,act:"VOTE",det:"Bulletin anonyme · scrutin_id=001 · hash:b2c4f1…",t:"25 mai 2026 · 14:32:07"},
                        {dot:BL,act:"CONNEXION",det:"Electeur 20INF4587 · JWT démarré",t:"25 mai 2026 · 14:28:44"},
                        {dot:G,act:"VOTE",det:"Bulletin anonyme · scrutin_id=001 · hash:f7a2d3…",t:"25 mai 2026 · 13:55:21"},
                        {dot:AMB,act:"MODIFICATION_SCRUTIN",det:"Admin: date_fin modifiée · scrutin_id=003",t:"25 mai 2026 · 10:02:15"},
                        {dot:BL,act:"CREATION_SCRUTIN",det:"BDE 2026 créé · 5 candidats + vote blanc système",t:"22 mai 2026 · 09:14:08"},
                        {dot:RED,act:"TENTATIVE_DOUBLE_VOTE",det:"Vote bloqué (RG1) · a_vote=TRUE · scrutin_id=002",t:"21 mai 2026 · 16:42:33"}
                      ].map((a,i)=>(
                        <div key={i} style={{display:"flex",gap:10,padding:"11px 0",borderBottom:i<5?`1px solid ${BDR}`:"none"}}>
                          <div style={{width:9,height:9,borderRadius:"50%",background:a.dot,marginTop:5,flexShrink:0}}/>
                          <div style={{flex:1}}>
                            <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:4}}>
                              <span style={{fontWeight:600,fontSize:"0.875rem",color:BK}}>{a.act}</span>
                              <span style={{fontSize:"0.73rem",color:GM2}}>{a.t}</span>
                            </div>
                            <div style={{fontSize:"0.8rem",color:GD2}}>{a.det}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══ RESULTS PUBLIC ════════════════════════════════ */}
        {page==="results-public"&&(
          <div style={{maxWidth:1100,margin:"0 auto",padding:"48px 24px"}}>
            <div style={{textAlign:"center",marginBottom:40}}>
              <div style={{display:"inline-block",background:GP,color:GD,fontSize:"0.72rem",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",padding:"4px 13px",borderRadius:99,marginBottom:10}}>Transparence</div>
              <h2 style={{fontFamily:"'Sora',sans-serif",fontSize:"1.85rem",fontWeight:700,marginBottom:8}}>Résultats publiés</h2>
              <p style={{color:GD2,maxWidth:460,margin:"0 auto"}}>Accessibles à tous après clôture officielle des scrutins</p>
            </div>
            {data.scrutins.filter(s=>s.statut==="cloture").map(sc=>{
              const cs=data.cands[sc.id]||[]; const tv=cs.reduce((a,c)=>a+c.votes,0); const sorted=[...cs].sort((a,b)=>b.votes-a.votes);
              return (
                <div key={sc.id} style={{background:"white",border:`1px solid ${BDR}`,borderRadius:20,overflow:"hidden",boxShadow:"0 4px 16px rgba(0,0,0,.06)",marginBottom:24}}>
                  <div style={{background:G,color:"white",padding:"20px 28px"}}>
                    <h3 style={{fontFamily:"'Sora',sans-serif",fontWeight:700,fontSize:"1.1rem"}}>{sc.titre}</h3>
                    <p style={{fontSize:"0.82rem",opacity:.85,marginTop:3}}>Clôturé le {fmtDate(sc.fin)} · {tv}/{sc.eligible} votants</p>
                  </div>
                  <div style={{padding:"20px 28px"}}>
                    {sorted[0]&&<div style={{display:"flex",alignItems:"center",gap:14,background:GP,border:`1px solid ${GL}`,borderRadius:12,padding:"12px 16px",marginBottom:20}}>
                      <span style={{fontSize:"1.8rem"}}>🏆</span>
                      <div><div style={{fontWeight:700}}>{sorted[0].nom} — Élu</div><div style={{fontSize:"0.82rem",color:G,fontWeight:600}}>{tv?Math.round(sorted[0].votes/tv*100):0}% · {sorted[0].votes} votes</div></div>
                    </div>}
                    {sorted.map((c,i)=><ResultBar key={c.id} nom={c.nom} votes={c.votes} total={tv} isWinner={i===0&&!c.blanc} isBlank={c.blanc}/>)}
                  </div>
                </div>
              );
            })}
            <div style={{textAlign:"center",padding:32,background:GP,border:`1px solid ${GL}`,borderRadius:12}}>
              <div style={{fontSize:"1.4rem",marginBottom:8}}>🗳️</div>
              <div style={{fontWeight:600,color:GD,marginBottom:16}}>{data.scrutins.filter(s=>s.statut==="ouvert").length} scrutin(s) en cours · Résultats publiés à la clôture</div>
              <Btn onClick={()=>goTo("login")}>Voter maintenant</Btn>
            </div>
          </div>
        )}
      </main>

      {/* ═══ GLOBAL MODALS ═════════════════════════════════════ */}

      {/* Confirm Vote */}
      <Modal open={!!showConfirmVote} onClose={()=>setShowConfirmVote(false)} title="Confirmer votre vote ?">
        <div style={{textAlign:"center"}}>
          <div style={{width:60,height:60,borderRadius:"50%",background:AMBL,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}><svg viewBox="0 0 24 24" width={30} height={30} fill="none" stroke={AMB} strokeWidth={2.5}><path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg></div>
          <p style={{color:GD2,marginBottom:14,fontSize:"0.9rem",lineHeight:1.65}}>Cette action est <strong>irréversible</strong>. Votre bulletin sera chiffré RSA 2048 et enregistré anonymement.</p>
          {showConfirmVote&&<div style={{background:GP,borderRadius:8,padding:"10px 14px",marginBottom:14,fontWeight:600,fontSize:"0.875rem",color:GD}}>Candidat sélectionné : {showConfirmVote.nom}</div>}
        </div>
        <div style={{display:"flex",gap:10}}><Btn variant="outline" full onClick={()=>setShowConfirmVote(false)}>Annuler</Btn><Btn full onClick={confirmVote}>Oui, je confirme</Btn></div>
      </Modal>

      {/* Vote Success */}
      <Modal open={showVoteSuccess} onClose={()=>setShowVoteSuccess(false)} title="">
        <div style={{textAlign:"center"}}>
          <div style={{width:60,height:60,borderRadius:"50%",background:GP,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}><svg viewBox="0 0 24 24" width={30} height={30} fill="none" stroke={G} strokeWidth={2.5}><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></div>
          <h3 style={{fontFamily:"'Sora',sans-serif",fontWeight:700,fontSize:"1.2rem",marginBottom:8}}>Vote enregistré !</h3>
          <p style={{color:GD2,fontSize:"0.875rem",marginBottom:14,lineHeight:1.65}}>Bulletin chiffré RSA 2048, enregistré anonymement. Aucun lien avec votre identité.</p>
          <div style={{background:GP,borderRadius:8,padding:"10px",marginBottom:14,fontSize:"0.78rem",color:GD,fontFamily:"monospace",wordBreak:"break-all"}}>Hash: a7f3c2e1b4d89f2a…</div>
          <Btn full onClick={()=>{setShowVoteSuccess(false);setVoteIdx(null);goTo("dashboard-student");}}>Retour au tableau de bord</Btn>
        </div>
      </Modal>

      {/* New/Edit Scrutin */}
      <Modal open={showNewScModal||!!editingSc} onClose={()=>{setShowNewScModal(false);setEditingSc(null);}} title={editingSc?"Modifier le scrutin":"Créer un scrutin"} wide>
        <FormGroup label={<>Titre <span style={{color:RED}}>*</span></>}><Input value={scForm.titre} onChange={v=>setScForm(f=>({...f,titre:v}))} placeholder="Ex: Élection Délégué L3 GL 2026"/></FormGroup>
        <FormGroup label="Description"><textarea value={scForm.desc} onChange={e=>setScForm(f=>({...f,desc:e.target.value}))} placeholder="Description optionnelle" style={{width:"100%",padding:"10px 13px",border:`1.5px solid ${BDR}`,borderRadius:8,fontSize:"0.9rem",fontFamily:"inherit",outline:"none",minHeight:70,resize:"vertical"}}/></FormGroup>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <FormGroup label="Date ouverture"><input type="datetime-local" value={scForm.debut} onChange={e=>setScForm(f=>({...f,debut:e.target.value}))} style={{width:"100%",padding:"10px 13px",border:`1.5px solid ${BDR}`,borderRadius:8,fontSize:"0.9rem",fontFamily:"inherit",outline:"none"}}/></FormGroup>
          <FormGroup label="Date clôture"><input type="datetime-local" value={scForm.fin} onChange={e=>setScForm(f=>({...f,fin:e.target.value}))} style={{width:"100%",padding:"10px 13px",border:`1.5px solid ${BDR}`,borderRadius:8,fontSize:"0.9rem",fontFamily:"inherit",outline:"none"}}/></FormGroup>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <FormGroup label="Filière cible"><Select value={scForm.filiere} onChange={v=>setScForm(f=>({...f,filiere:v}))} style={{width:"100%"}}><option value="">Toutes filières</option><option>Génie Logiciel</option><option>Gestion</option><option>Droit</option></Select></FormGroup>
          <FormGroup label="Niveau cible"><Select value={scForm.niveau} onChange={v=>setScForm(f=>({...f,niveau:v}))} style={{width:"100%"}}><option value="">Tous niveaux</option>{["L1","L2","L3","M1","M2"].map(n=><option key={n}>{n}</option>)}</Select></FormGroup>
        </div>
        {!editingSc&&<InfoBox color="green">ℹ Le <strong>vote blanc</strong> est créé automatiquement avec le scrutin.</InfoBox>}
        <div style={{display:"flex",gap:10,marginTop:4}}>
          <Btn variant="outline" full onClick={()=>{setShowNewScModal(false);setEditingSc(null);}}>Annuler</Btn>
          <Btn full onClick={editingSc?saveSc:createSc}>{editingSc?"Enregistrer":"Créer le scrutin"}</Btn>
        </div>
      </Modal>

      {/* Confirm Delete Scrutin */}
      <Modal open={!!deletingSc} onClose={()=>setDeletingSc(null)} title="Supprimer le scrutin ?">
        <div style={{textAlign:"center",marginBottom:16}}>
          <div style={{width:60,height:60,borderRadius:"50%",background:REDL,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}><svg viewBox="0 0 24 24" width={30} height={30} fill="none" stroke={RED} strokeWidth={2.5}><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6"/></svg></div>
          <p style={{color:GD2,fontSize:"0.9rem"}}>Action irréversible. Le scrutin et tous ses candidats seront supprimés.</p>
        </div>
        <div style={{display:"flex",gap:10}}><Btn variant="outline" full onClick={()=>setDeletingSc(null)}>Annuler</Btn><Btn full style={{background:RED}} onClick={deleteSc}>Supprimer</Btn></div>
      </Modal>

      {/* New/Edit Candidat */}
      <Modal open={showNewCndModal||!!editingCnd} onClose={()=>{setShowNewCndModal(false);setEditingCnd(null);}} title={editingCnd?"Modifier le candidat":"Ajouter un candidat"} wide>
        {showNewCndModal&&(
          <FormGroup label="Scrutin">
            <Select value={cndForm.scId} onChange={v=>setCndForm(f=>({...f,scId:Number(v)}))} style={{width:"100%"}}>
              {data.scrutins.filter(s=>s.statut!=="cloture").map(sc=><option key={sc.id} value={sc.id}>{sc.titre}</option>)}
            </Select>
          </FormGroup>
        )}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <FormGroup label={<>Nom complet <span style={{color:RED}}>*</span></>}><Input value={cndForm.nom} onChange={v=>setCndForm(f=>({...f,nom:v}))} placeholder="Nom Prénom"/></FormGroup>
          <FormGroup label="Initiales (avatar)" hint="Ex: KV"><Input value={cndForm.ini} onChange={v=>setCndForm(f=>({...f,ini:v.slice(0,3)}))} placeholder="KV"/></FormGroup>
        </div>
        <FormGroup label="Photo du candidat">
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            <div style={{width:72,height:72,borderRadius:"50%",overflow:"hidden",border:`3px solid ${GL}`,flexShrink:0}}>
              {cndForm.photo?<img src={cndForm.photo} alt="preview" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                :<div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",background:GP,color:GD,fontWeight:700,fontFamily:"'Sora',sans-serif",fontSize:"1.2rem"}}>{(cndForm.ini||"?").slice(0,2)}</div>}
            </div>
            <div style={{flex:1}}>
              <input type="file" accept="image/*" style={{display:"none"}} id="photo-inp" onChange={e=>handlePhotoUpload(e,v=>setCndForm(f=>({...f,photo:v})))}/>
              <label htmlFor="photo-inp"><Btn variant="outline" onClick={()=>document.getElementById("photo-inp")?.click()}>📷 Choisir une photo</Btn></label>
              {cndForm.photo&&<Btn size="sm" variant="red" style={{marginLeft:8}} onClick={()=>setCndForm(f=>({...f,photo:null}))}>Supprimer</Btn>}
              <div style={{fontSize:"0.75rem",color:GM2,marginTop:4}}>JPG, PNG · Max 2MB</div>
            </div>
          </div>
        </FormGroup>
        <FormGroup label="Programme électoral"><textarea value={cndForm.prog} onChange={e=>setCndForm(f=>({...f,prog:e.target.value}))} placeholder="Décrivez le programme du candidat…" style={{width:"100%",padding:"10px 13px",border:`1.5px solid ${BDR}`,borderRadius:8,fontSize:"0.9rem",fontFamily:"inherit",outline:"none",minHeight:80,resize:"vertical"}}/></FormGroup>
        <div style={{display:"flex",gap:10,marginTop:4}}>
          <Btn variant="outline" full onClick={()=>{setShowNewCndModal(false);setEditingCnd(null);}}>Annuler</Btn>
          <Btn full onClick={editingCnd?saveCnd:addCnd}>{editingCnd?"Enregistrer":"Ajouter"}</Btn>
        </div>
      </Modal>

      {/* Confirm Delete Candidat */}
      <Modal open={!!deletingCnd.cId} onClose={()=>setDeletingCnd({scId:null,cId:null})} title="Supprimer le candidat ?">
        <div style={{textAlign:"center",marginBottom:16}}>
          <div style={{width:60,height:60,borderRadius:"50%",background:REDL,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}><svg viewBox="0 0 24 24" width={30} height={30} fill="none" stroke={RED} strokeWidth={2.5}><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg></div>
          <p style={{color:GD2,fontSize:"0.9rem"}}>Action irréversible. Le candidat sera retiré du scrutin.</p>
        </div>
        <div style={{display:"flex",gap:10}}><Btn variant="outline" full onClick={()=>setDeletingCnd({scId:null,cId:null})}>Annuler</Btn><Btn full style={{background:RED}} onClick={deleteCnd}>Supprimer</Btn></div>
      </Modal>

      {/* View Électeur */}
      <Modal open={!!viewingEl} onClose={()=>setViewingEl(null)} title="Fiche électeur">
        {viewingEl&&(
          <div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:20}}>
              {[["Matricule",viewingEl.mat],["Nom",viewingEl.nom],["Filière",viewingEl.fil],["Niveau",viewingEl.niv],["Email",viewingEl.email],["A voté",viewingEl.vote?"Oui":"Non"]].map(([l,v])=>(
                <div key={l}><div style={{fontSize:"0.73rem",fontWeight:700,color:GM2,textTransform:"uppercase",marginBottom:3}}>{l}</div><div style={{fontWeight:600,fontSize:"0.9rem"}}>{v}</div></div>
              ))}
            </div>
            <div style={{display:"flex",gap:10}}>
              <Btn variant="outline" full onClick={()=>setViewingEl(null)}>Fermer</Btn>
              {viewingEl.stat==="suspendu"&&<Btn full onClick={()=>changeElStat(viewingEl.id,"eligible")}>Réactiver</Btn>}
              {viewingEl.stat==="eligible"&&<Btn full style={{background:RED}} onClick={()=>changeElStat(viewingEl.id,"suspendu")}>Suspendre</Btn>}
            </div>
          </div>
        )}
      </Modal>

      {/* Change Password */}
      <Modal open={showPwModal} onClose={()=>setShowPwModal(false)} title="Changer le mot de passe">
        <FormGroup label="Mot de passe actuel"><Input type="password" value={pwForm.old} onChange={v=>setPwForm(f=>({...f,old:v}))} placeholder="••••••••"/></FormGroup>
        <FormGroup label="Nouveau mot de passe" hint="Minimum 8 caractères">
          <Input type="password" value={pwForm.new} onChange={v=>{setPwForm(f=>({...f,new:v}));setPwStrength(calcPwStr(v));}} placeholder="Min. 8 caractères"/>
          <div style={{height:5,borderRadius:99,background:GRAY,overflow:"hidden",marginTop:5}}>
            <div style={{width:[0,30,60,85,100][pwStrength]+"%",height:"100%",borderRadius:99,background:["#E5E7EB","#EF4444","#F59E0B","#22C55E",G][pwStrength],transition:"all .3s"}}/>
          </div>
        </FormGroup>
        <FormGroup label="Confirmer"><Input type="password" value={pwForm.conf} onChange={v=>setPwForm(f=>({...f,conf:v}))} placeholder="Répétez"/></FormGroup>
        <div style={{display:"flex",gap:10}}>
          <Btn variant="outline" full onClick={()=>setShowPwModal(false)}>Annuler</Btn>
          <Btn full onClick={doPwChange}>Modifier</Btn>
        </div>
      </Modal>

      {/* Notification */}
      <Notification notif={notif}/>
    </div>
  );
}
