import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView, useReducedMotion, useMotionValue, useTransform, animate } from "framer-motion";

// ── DESIGN TOKENS ──────────────────────────────────────────────────────────
const T = {
  primary:   "#0EA5E9",   // sky-500 — clinical clarity
  primary2:  "#0284C7",   // sky-600
  accent:    "#10B981",   // emerald — health/life
  accentSoft:"#D1FAE5",
  surface:   "#FFFFFF",
  surfaceAlt:"#F0F9FF",
  bg:        "#F8FAFC",
  cardBg:    "#FFFFFF",
  text:      "#0F172A",
  textMid:   "#475569",
  textLo:    "#94A3B8",
  border:    "#E2E8F0",
  danger:    "#EF4444",
  warning:   "#F59E0B",
};

// ── ANIMATION VARIANTS ────────────────────────────────────────────────────
const fadeUp   = { hidden:{opacity:0,y:20}, visible:{opacity:1,y:0,transition:{duration:0.45,ease:[0.25,0.46,0.45,0.94]}} };
const fadeIn   = { hidden:{opacity:0},      visible:{opacity:1,transition:{duration:0.35}} };
const scaleIn  = { hidden:{opacity:0,scale:0.93}, visible:{opacity:1,scale:1,transition:{type:"spring",stiffness:320,damping:22}} };
const stagger  = { visible:{transition:{staggerChildren:0.07,delayChildren:0.1}} };
const slideL   = { hidden:{opacity:0,x:30}, visible:{opacity:1,x:0,transition:{duration:0.4,ease:"easeOut"}} };

// ── ICONS ─────────────────────────────────────────────────────────────────
const Icon = ({ name, size=20, color="currentColor" }) => {
  const icons = {
    home:     <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>,
    search:   <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>,
    calendar: <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>,
    user:     <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>,
    star:     <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>,
    heart:    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>,
    bell:     <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>,
    phone:    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 7V5z"/>,
    video:    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>,
    map:      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>,
    check:    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>,
    x:        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>,
    arrow:    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>,
    clock:    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>,
    logout:   <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>,
    steth:    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>,
    eye:      <><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></>,
    eyeOff:   <><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></>,
    pills:    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>,
  };
  return (
    <svg width={size} height={size} fill="none" stroke={color} strokeWidth={1.8} viewBox="0 0 24 24">
      {icons[name]}
    </svg>
  );
};

// ── DATA ──────────────────────────────────────────────────────────────────
const SPECIALTIES = [
  {id:1, name:"Cardiology",    emoji:"🫀", color:"#FEE2E2", accent:"#EF4444"},
  {id:2, name:"Neurology",     emoji:"🧠", color:"#EDE9FE", accent:"#8B5CF6"},
  {id:3, name:"Orthopedics",   emoji:"🦴", color:"#FEF3C7", accent:"#F59E0B"},
  {id:4, name:"Pediatrics",    emoji:"👶", color:"#DCFCE7", accent:"#22C55E"},
  {id:5, name:"Dermatology",   emoji:"🌡️", color:"#FCE7F3", accent:"#EC4899"},
  {id:6, name:"Ophthalmology", emoji:"👁️", color:"#E0F2FE", accent:"#0EA5E9"},
  {id:7, name:"Nephrology",    emoji:"🫘", color:"#F0FDF4", accent:"#10B981"},
  {id:8, name:"Gastrology",    emoji:"🫁", color:"#FFF7ED", accent:"#F97316"},
];

const DOCTORS = [
  {id:1, name:"Dr. Sarah Chen",      specialty:"Cardiologist",    rating:4.9, reviews:312, exp:"12 yrs", available:true,  price:2500, img:"SC", color:"#0EA5E9", location:"North Avenue Clinic",  days:["Mon","Tue","Wed","Thu"],    services:["ECG","Echo","Stress Test","Consultation"]},
  {id:2, name:"Dr. Ahmed Malik",     specialty:"Neurologist",     rating:4.8, reviews:198, exp:"8 yrs",  available:true,  price:3000, img:"AM", color:"#8B5CF6", location:"Main Street Hospital",  days:["Mon","Wed","Fri"],          services:["EEG","MRI Review","Nerve Conduction"]},
  {id:3, name:"Dr. Priya Sharma",    specialty:"Pediatrician",    rating:4.9, reviews:445, exp:"15 yrs", available:false, price:1800, img:"PS", color:"#22C55E", location:"City Medical Center",   days:["Tue","Thu","Sat"],          services:["Growth Check","Immunization","Nutrition"]},
  {id:4, name:"Dr. James Wilson",    specialty:"Orthopedic",      rating:4.7, reviews:267, exp:"10 yrs", available:true,  price:2800, img:"JW", color:"#F59E0B", location:"Spine & Joint Center",  days:["Mon","Tue","Thu","Fri"],    services:["X-Ray Review","Joint Injection","Physio"]},
  {id:5, name:"Dr. Fatima Hassan",   specialty:"Dermatologist",   rating:4.8, reviews:389, exp:"9 yrs",  available:false, price:2200, img:"FH", color:"#EC4899", location:"Skin & Laser Clinic",   days:["Wed","Thu","Fri","Sat"],    services:["Skin Biopsy","Laser","Acne Treatment"]},
  {id:6, name:"Dr. Usman Tariq",     specialty:"Ophthalmologist", rating:4.9, reviews:521, exp:"18 yrs", available:true,  price:2000, img:"UT", color:"#0EA5E9", location:"Eye Care Institute",    days:["Mon","Tue","Wed","Sat"],    services:["Slit Lamp","Vision Test","Retinal Scan"]},
];

const MY_APPOINTMENTS = [
  {id:1, doctor:"Dr. Sarah Chen",    specialty:"Cardiologist",  date:"Fri, Aug 22 @ 9:45 AM",   status:"Confirmed", type:"In-person", color:"#0EA5E9", img:"SC"},
  {id:2, doctor:"Dr. Ahmed Malik",   specialty:"Neurologist",   date:"Wed, Sep 3 @ 2:00 PM",    status:"Pending",   type:"Video",     color:"#8B5CF6", img:"AM"},
];
const MY_HISTORY = [
  {id:3, doctor:"Dr. Priya Sharma",  specialty:"Pediatrician",  date:"Mon, Jul 14 @ 10:00 AM",  status:"Completed", type:"In-person", color:"#22C55E", img:"PS"},
  {id:4, doctor:"Dr. James Wilson",  specialty:"Orthopedic",    date:"Thu, Jun 26 @ 3:30 PM",   status:"Completed", type:"In-person", color:"#F59E0B", img:"JW"},
];

const TIME_SLOTS_AM = ["9:00 AM","9:30 AM","10:00 AM","10:30 AM","11:00 AM","11:30 AM"];
const TIME_SLOTS_PM = ["1:00 PM","2:00 PM","2:30 PM","3:00 PM","4:00 PM","4:30 PM","5:00 PM"];
const BUSY_SLOTS    = ["9:30 AM","10:30 AM","2:00 PM","4:00 PM"];

const INSIGHTS = [
  { tip:"Drink at least 8 glasses of water daily to keep your body hydrated and support kidney function.", icon:"💧" },
  { tip:"30 minutes of moderate exercise 5 days per week reduces cardiovascular disease risk by 35%.", icon:"🏃" },
  { tip:"Adequate sleep (7–9 hours) strengthens immunity and improves cognitive performance.", icon:"😴" },
];

// ── AVATAR ────────────────────────────────────────────────────────────────
const Avatar = ({ initials, color, size=42 }) => (
  <div style={{
    width:size, height:size, borderRadius:"50%",
    background:`linear-gradient(135deg,${color}dd,${color})`,
    display:"flex", alignItems:"center", justifyContent:"center",
    color:"#fff", fontWeight:700, fontSize:size*0.32, flexShrink:0,
    letterSpacing:"0.02em",
  }}>{initials}</div>
);

// ── STAR RATING ───────────────────────────────────────────────────────────
const Stars = ({ rating }) => (
  <span style={{display:"flex",gap:2,alignItems:"center"}}>
    {[1,2,3,4,5].map(i=>(
      <svg key={i} width={12} height={12} viewBox="0 0 24 24" fill={i<=Math.round(rating)?"#F59E0B":"#E2E8F0"}>
        <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
      </svg>
    ))}
  </span>
);

// ── STATUS BADGE ──────────────────────────────────────────────────────────
const Badge = ({ status }) => {
  const map = {
    Confirmed: { bg:"#DCFCE7", color:"#166534" },
    Pending:   { bg:"#FEF3C7", color:"#92400E" },
    Completed: { bg:"#E0F2FE", color:"#0C4A6E" },
    Cancelled: { bg:"#FEE2E2", color:"#991B1B" },
  };
  const s = map[status]||map.Pending;
  return <span style={{padding:"2px 10px",borderRadius:20,fontSize:11,fontWeight:600,background:s.bg,color:s.color}}>{status}</span>;
};

// ── ANIMATED COUNTER ──────────────────────────────────────────────────────
const Counter = ({ to, suffix="" }) => {
  const ref   = useRef(null);
  const inView= useInView(ref, {once:true});
  const mv    = useMotionValue(0);
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (inView) {
      const ctrl = animate(mv, to, { duration:1.6, ease:"easeOut", onUpdate: v => setVal(Math.round(v)) });
      return ctrl.stop;
    }
  }, [inView]);
  return <motion.span ref={ref}>{val.toLocaleString()}{suffix}</motion.span>;
};

// ── NAV BAR ───────────────────────────────────────────────────────────────
const NavBar = ({ active, setActive }) => {
  const tabs = [
    { id:"home",    label:"Home",    icon:"home" },
    { id:"doctors", label:"Doctors", icon:"search" },
    { id:"visits",  label:"Visits",  icon:"calendar" },
    { id:"profile", label:"Profile", icon:"user" },
  ];
  return (
    <motion.nav
      initial={{ y: 80 }} animate={{ y: 0 }}
      transition={{ type:"spring", stiffness:280, damping:22, delay:0.4 }}
      style={{
        position:"fixed", bottom:0, left:0, right:0, zIndex:100,
        background:"rgba(255,255,255,0.95)", backdropFilter:"blur(20px)",
        borderTop:`1px solid ${T.border}`, display:"flex",
        padding:"8px 0 env(safe-area-inset-bottom,8px)",
        boxShadow:"0 -4px 24px rgba(0,0,0,0.06)",
      }}>
      {tabs.map(t => (
        <button key={t.id} onClick={()=>setActive(t.id)} style={{
          flex:1, border:"none", background:"none", cursor:"pointer",
          display:"flex", flexDirection:"column", alignItems:"center", gap:3, padding:"4px 0",
          color: active===t.id ? T.primary : T.textLo,
          transition:"color 0.2s",
        }}>
          <motion.div whileTap={{scale:0.85}} transition={{type:"spring",stiffness:400,damping:20}}>
            <Icon name={t.icon} size={22} color={active===t.id ? T.primary : T.textLo}/>
          </motion.div>
          <span style={{fontSize:10,fontWeight:active===t.id?700:500}}>{t.label}</span>
          {active===t.id && (
            <motion.div layoutId="navDot" style={{
              position:"absolute", bottom:6, width:4, height:4,
              borderRadius:"50%", background:T.primary,
            }}/>
          )}
        </button>
      ))}
    </motion.nav>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// SCREENS
// ════════════════════════════════════════════════════════════════════════════

// ── ONBOARDING ────────────────────────────────────────────────────────────
const OnboardingScreen = ({ onDone }) => {
  const [step, setStep] = useState(0);
  const slides = [
    { emoji:"🏥", title:"Your Health,\nSimplified", body:"Connect with 500+ verified specialists across 30+ departments — all from your phone.", bg:"#EFF6FF" },
    { emoji:"📅", title:"Book in\n60 Seconds", body:"Pick your preferred time slot, choose in-person or video — and you're confirmed instantly.", bg:"#F0FDF4" },
    { emoji:"📋", title:"Track Every\nVisit", body:"Your complete medical history, appointments, and prescriptions — organized and always accessible.", bg:"#FDF4FF" },
  ];
  const s = slides[step];
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} style={{
      height:"100%", display:"flex", flexDirection:"column", background:s.bg,
      transition:"background 0.5s",
    }}>
      <div style={{flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"40px 32px"}}>
        <motion.div key={step} initial={{scale:0.5,opacity:0}} animate={{scale:1,opacity:1}} transition={{type:"spring",stiffness:300,damping:20}}
          style={{fontSize:96, marginBottom:32}}>
          {s.emoji}
        </motion.div>
        <motion.h1 key={`t${step}`} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.1}}
          style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:32,fontWeight:800,color:T.text,textAlign:"center",lineHeight:1.15,whiteSpace:"pre-line",marginBottom:16}}>
          {s.title}
        </motion.h1>
        <motion.p key={`b${step}`} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.2}}
          style={{color:T.textMid,fontSize:15,lineHeight:1.65,textAlign:"center",maxWidth:280}}>
          {s.body}
        </motion.p>
      </div>
      <div style={{padding:"0 32px 48px", display:"flex", flexDirection:"column", gap:16, alignItems:"center"}}>
        <div style={{display:"flex",gap:8}}>
          {slides.map((_,i)=>(
            <motion.div key={i} animate={{width:i===step?24:8,background:i===step?T.primary:T.border}}
              style={{height:8,borderRadius:4,transition:"all 0.3s"}}/>
          ))}
        </div>
        <motion.button whileTap={{scale:0.96}} onClick={()=>step<slides.length-1?setStep(step+1):onDone()}
          style={{
            width:"100%", padding:"16px", borderRadius:16, border:"none",
            background:`linear-gradient(135deg,${T.primary},${T.primary2})`,
            color:"#fff", fontSize:16, fontWeight:700, cursor:"pointer",
            boxShadow:`0 8px 24px ${T.primary}40`,
          }}>
          {step<slides.length-1?"Continue →":"Get Started"}
        </motion.button>
        {step<slides.length-1 && (
          <button onClick={onDone} style={{border:"none",background:"none",color:T.textLo,fontSize:13,cursor:"pointer"}}>
            Skip
          </button>
        )}
      </div>
    </motion.div>
  );
};

// ── LOGIN / SIGNUP ────────────────────────────────────────────────────────
const AuthScreen = ({ onAuth }) => {
  const [mode, setMode]   = useState("login");
  const [showPw, setShowPw] = useState(false);
  const [form, setForm]   = useState({ name:"", email:"", password:"" });
  const set = k => e => setForm(p=>({...p,[k]:e.target.value}));
  const inputStyle = { width:"100%", padding:"14px 16px", border:`1.5px solid ${T.border}`,
    borderRadius:12, fontSize:14, outline:"none", background:"#fff",
    fontFamily:"inherit", boxSizing:"border-box", color:T.text };
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} style={{
      height:"100%", display:"flex", flexDirection:"column", background:T.bg, overflowY:"auto",
    }}>
      <div style={{background:`linear-gradient(135deg,${T.primary},${T.primary2})`,padding:"56px 24px 40px",textAlign:"center"}}>
        <div style={{fontSize:48,marginBottom:12}}>🏥</div>
        <h1 style={{color:"#fff",fontSize:26,fontWeight:800,margin:0,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>MediConnect</h1>
        <p style={{color:"rgba(255,255,255,0.8)",fontSize:13,marginTop:6}}>Your health companion</p>
      </div>
      <div style={{flex:1,padding:"32px 24px 40px"}}>
        <div style={{display:"flex",background:T.border,borderRadius:12,padding:4,marginBottom:28}}>
          {["login","signup"].map(m=>(
            <button key={m} onClick={()=>setMode(m)} style={{
              flex:1,padding:"10px",border:"none",cursor:"pointer",borderRadius:10,fontWeight:600,fontSize:14,
              background:mode===m?"#fff":"transparent", color:mode===m?T.text:T.textLo,
              transition:"all 0.2s", boxShadow:mode===m?"0 2px 8px rgba(0,0,0,0.08)":"none",
            }}>{m==="login"?"Sign In":"Sign Up"}</button>
          ))}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <AnimatePresence>
            {mode==="signup" && (
              <motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}}>
                <input value={form.name} onChange={set("name")} placeholder="Full Name" style={inputStyle}/>
              </motion.div>
            )}
          </AnimatePresence>
          <input value={form.email} onChange={set("email")} placeholder="Email address" type="email" style={inputStyle}/>
          <div style={{position:"relative"}}>
            <input value={form.password} onChange={set("password")} placeholder="Password" type={showPw?"text":"password"} style={inputStyle}/>
            <button onClick={()=>setShowPw(!showPw)} style={{
              position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",
              background:"none",border:"none",cursor:"pointer",color:T.textLo,display:"flex",
            }}>
              <Icon name={showPw?"eyeOff":"eye"} size={18}/>
            </button>
          </div>
          <motion.button whileTap={{scale:0.97}} onClick={onAuth} style={{
            padding:"16px", borderRadius:14, border:"none",
            background:`linear-gradient(135deg,${T.primary},${T.primary2})`,
            color:"#fff", fontSize:15, fontWeight:700, cursor:"pointer", marginTop:8,
            boxShadow:`0 8px 20px ${T.primary}40`,
          }}>
            {mode==="login"?"Sign In →":"Create Account →"}
          </motion.button>
        </div>
        <div style={{textAlign:"center",marginTop:24}}>
          <span style={{color:T.textMid,fontSize:13}}>Or continue as </span>
          <button onClick={onAuth} style={{background:"none",border:"none",color:T.primary,fontSize:13,fontWeight:700,cursor:"pointer"}}>
            Medical Practitioner →
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// ── HOME SCREEN ───────────────────────────────────────────────────────────
const HomeScreen = ({ setScreen, setSelectedDoc }) => {
  const [insightIdx, setInsightIdx] = useState(0);
  const insight = INSIGHTS[insightIdx];
  useEffect(()=>{const t=setInterval(()=>setInsightIdx(i=>(i+1)%INSIGHTS.length),5000);return()=>clearInterval(t);},[]);
  const topRef = useRef(null);
  const inView = useInView(topRef,{once:true});

  const openDoctor = d => { setSelectedDoc(d); setScreen("doctorProfile"); };

  return (
    <div style={{overflowY:"auto",height:"100%",paddingBottom:80}}>
      {/* Header */}
      <motion.div initial={{opacity:0,y:-20}} animate={{opacity:1,y:0}} transition={{duration:0.5}}
        style={{background:`linear-gradient(135deg,${T.primary},${T.primary2})`,padding:"48px 20px 24px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <p style={{color:"rgba(255,255,255,0.75)",fontSize:12,margin:0,fontWeight:500}}>Good morning 👋</p>
            <h2 style={{color:"#fff",fontSize:22,fontWeight:800,margin:"4px 0 0",fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Muhammad Majid</h2>
          </div>
          <div style={{display:"flex",gap:12,alignItems:"center"}}>
            <motion.button whileTap={{scale:0.9}} style={{
              background:"rgba(255,255,255,0.2)",border:"none",width:40,height:40,
              borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"
            }}>
              <Icon name="bell" size={18} color="#fff"/>
            </motion.button>
            <Avatar initials="MA" color="#0284C7" size={40}/>
          </div>
        </div>
        {/* Stats row */}
        <div ref={topRef} style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginTop:20}}>
          {[["Doctors","500+"],["Specialties","30+"],["Patients","50K+"]].map(([label,val])=>(
            <div key={label} style={{background:"rgba(255,255,255,0.15)",borderRadius:12,padding:"12px 10px",textAlign:"center"}}>
              <div style={{color:"#fff",fontSize:18,fontWeight:800}}>{val}</div>
              <div style={{color:"rgba(255,255,255,0.7)",fontSize:11}}>{label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      <div style={{padding:"20px 16px",display:"flex",flexDirection:"column",gap:24}}>
        {/* Search bar */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible"
          style={{display:"flex",gap:12,alignItems:"center",background:"#fff",
            borderRadius:14,padding:"12px 16px",boxShadow:"0 2px 12px rgba(0,0,0,0.06)",
            border:`1px solid ${T.border}`}}>
          <Icon name="search" size={18} color={T.textLo}/>
          <span style={{color:T.textLo,fontSize:14}}>Search doctors, specialties...</span>
        </motion.div>

        {/* Browse by Specialty */}
        <motion.section variants={stagger} initial="hidden" animate="visible">
          <h3 style={{fontSize:17,fontWeight:700,color:T.text,margin:"0 0 14px"}}>Browse by Specialty</h3>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:10}}>
            {SPECIALTIES.map(sp=>(
              <motion.div key={sp.id} variants={scaleIn} whileTap={{scale:0.93}}
                style={{background:sp.color,borderRadius:14,padding:"14px 8px",
                  textAlign:"center",cursor:"pointer",border:`1px solid ${sp.accent}22`}}>
                <div style={{fontSize:24,marginBottom:6}}>{sp.emoji}</div>
                <div style={{fontSize:10,fontWeight:600,color:sp.accent,lineHeight:1.3}}>{sp.name}</div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Available Now */}
        <section>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <h3 style={{fontSize:17,fontWeight:700,color:T.text,margin:0}}>Available Now</h3>
            <span style={{fontSize:12,color:T.primary,fontWeight:600,cursor:"pointer"}}>See all</span>
          </div>
          <div style={{display:"flex",gap:12,overflowX:"auto",paddingBottom:8}}>
            {DOCTORS.filter(d=>d.available).map(doc=>(
              <motion.div key={doc.id} variants={slideL} initial="hidden" animate="visible"
                whileTap={{scale:0.97}} onClick={()=>openDoctor(doc)}
                style={{minWidth:200,background:"#fff",borderRadius:16,padding:"16px",
                  boxShadow:"0 2px 12px rgba(0,0,0,0.06)",cursor:"pointer",border:`1px solid ${T.border}`,flexShrink:0}}>
                <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:12}}>
                  <Avatar initials={doc.img} color={doc.color} size={44}/>
                  <div>
                    <div style={{fontSize:13,fontWeight:700,color:T.text,lineHeight:1.3}}>{doc.name}</div>
                    <div style={{fontSize:11,color:T.textLo}}>{doc.specialty}</div>
                  </div>
                </div>
                <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:8}}>
                  <Stars rating={doc.rating}/>
                  <span style={{fontSize:11,color:T.textMid,fontWeight:600}}>{doc.rating}</span>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:4}}>
                  <div style={{width:7,height:7,borderRadius:"50%",background:T.accent}}/>
                  <span style={{fontSize:11,color:T.accent,fontWeight:600}}>Available Now</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Top Specialists */}
        <section>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <h3 style={{fontSize:17,fontWeight:700,color:T.text,margin:0}}>Top Specialists</h3>
            <span style={{fontSize:12,color:T.primary,fontWeight:600,cursor:"pointer"}}>See all</span>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {DOCTORS.slice(0,3).map((doc,i)=>(
              <motion.div key={doc.id} initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:i*0.08}}
                whileTap={{scale:0.98}} onClick={()=>openDoctor(doc)}
                style={{background:"#fff",borderRadius:16,padding:"16px",
                  boxShadow:"0 2px 8px rgba(0,0,0,0.05)",cursor:"pointer",
                  border:`1px solid ${T.border}`,display:"flex",gap:14,alignItems:"center"}}>
                <Avatar initials={doc.img} color={doc.color} size={52}/>
                <div style={{flex:1}}>
                  <div style={{fontSize:14,fontWeight:700,color:T.text}}>{doc.name}</div>
                  <div style={{fontSize:12,color:T.textLo,marginBottom:4}}>{doc.specialty} · {doc.exp} exp</div>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <Stars rating={doc.rating}/>
                    <span style={{fontSize:11,color:T.textMid}}>({doc.reviews})</span>
                  </div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:14,fontWeight:800,color:T.primary}}>Rs.{doc.price}</div>
                  <div style={{fontSize:10,color:T.textLo}}>per visit</div>
                  <motion.div whileTap={{scale:0.9}} style={{
                    background:`${T.primary}15`,borderRadius:8,padding:"5px 10px",marginTop:6,
                    fontSize:11,fontWeight:600,color:T.primary,
                  }}>Book</motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Daily Wellness Insight */}
        <AnimatePresence mode="wait">
          <motion.div key={insightIdx} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-12}}
            style={{
              background:`linear-gradient(135deg,${T.accent}15,${T.accentSoft})`,
              borderRadius:18,padding:"20px",border:`1.5px solid ${T.accent}40`,
            }}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
              <span style={{fontSize:22}}>{insight.icon}</span>
              <span style={{fontSize:12,fontWeight:700,color:T.accent,textTransform:"uppercase",letterSpacing:"0.06em"}}>Daily Wellness Insight</span>
            </div>
            <p style={{fontSize:14,color:"#065F46",lineHeight:1.6,margin:0}}>{insight.tip}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

// ── DOCTORS SCREEN ────────────────────────────────────────────────────────
const DoctorsScreen = ({ setScreen, setSelectedDoc }) => {
  const [search,  setSearch]  = useState("");
  const [selSpec, setSelSpec] = useState("All");
  const filtered = DOCTORS.filter(d=>
    (selSpec==="All"||d.specialty.toLowerCase().includes(selSpec.toLowerCase())) &&
    (d.name.toLowerCase().includes(search.toLowerCase())||d.specialty.toLowerCase().includes(search.toLowerCase()))
  );
  const specs = ["All","Cardio","Neuro","Pediatric","Ortho","Derma","Eye"];
  return (
    <div style={{overflowY:"auto",height:"100%",paddingBottom:80}}>
      <div style={{background:`linear-gradient(135deg,${T.primary},${T.primary2})`,padding:"48px 20px 24px"}}>
        <h2 style={{color:"#fff",fontSize:22,fontWeight:800,margin:"0 0 16px",fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Find Specialists</h2>
        <div style={{display:"flex",alignItems:"center",gap:10,background:"rgba(255,255,255,0.2)",borderRadius:12,padding:"10px 14px"}}>
          <Icon name="search" size={16} color="rgba(255,255,255,0.8)"/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search doctors or specialty..."
            style={{background:"none",border:"none",outline:"none",color:"#fff",fontSize:13,flex:1,
              "::placeholder":{color:"rgba(255,255,255,0.6)"}}}/>
        </div>
      </div>
      <div style={{padding:"16px"}}>
        <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:8,marginBottom:16}}>
          {specs.map(s=>(
            <motion.button key={s} whileTap={{scale:0.93}} onClick={()=>setSelSpec(s)} style={{
              flexShrink:0,padding:"7px 16px",borderRadius:20,border:"none",cursor:"pointer",fontSize:12,fontWeight:600,
              background:selSpec===s?T.primary:"#fff", color:selSpec===s?"#fff":T.textMid,
              boxShadow:selSpec===s?`0 4px 12px ${T.primary}40`:"0 1px 4px rgba(0,0,0,0.06)",
              transition:"all 0.2s",
            }}>{s}</motion.button>
          ))}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          {filtered.map((doc,i)=>(
            <motion.div key={doc.id} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:i*0.06}}
              whileTap={{scale:0.98}} onClick={()=>{setSelectedDoc(doc);setScreen("doctorProfile");}}
              style={{background:"#fff",borderRadius:18,padding:"18px",
                boxShadow:"0 2px 12px rgba(0,0,0,0.05)",cursor:"pointer",border:`1px solid ${T.border}`}}>
              <div style={{display:"flex",gap:14,alignItems:"flex-start"}}>
                <div style={{position:"relative"}}>
                  <Avatar initials={doc.img} color={doc.color} size={56}/>
                  {doc.available&&<div style={{position:"absolute",bottom:2,right:2,width:12,height:12,borderRadius:"50%",background:T.accent,border:"2px solid #fff"}}/>}
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:15,fontWeight:700,color:T.text}}>{doc.name}</div>
                  <div style={{fontSize:12,color:T.textLo,marginBottom:6}}>{doc.specialty}</div>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
                    <Stars rating={doc.rating}/>
                    <span style={{fontSize:11,color:T.textMid}}>{doc.rating} ({doc.reviews} reviews)</span>
                  </div>
                  <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                    <span style={{fontSize:11,color:T.textMid,display:"flex",alignItems:"center",gap:4}}>
                      <Icon name="map" size={11} color={T.textLo}/>{doc.location}
                    </span>
                    <span style={{fontSize:11,color:T.textMid}}>· {doc.exp} exp</span>
                  </div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:15,fontWeight:800,color:T.primary}}>Rs.{doc.price}</div>
                  <div style={{fontSize:10,color:T.textLo,marginBottom:8}}>per visit</div>
                  <motion.button whileTap={{scale:0.92}} style={{
                    background:`linear-gradient(135deg,${T.primary},${T.primary2})`,
                    border:"none",borderRadius:10,padding:"8px 14px",color:"#fff",
                    fontSize:12,fontWeight:700,cursor:"pointer",
                    boxShadow:`0 4px 10px ${T.primary}40`,
                  }}>Book</motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── DOCTOR PROFILE ────────────────────────────────────────────────────────
const DoctorProfile = ({ doctor, setScreen }) => {
  const [tab, setTab] = useState("info");
  if (!doctor) return null;
  return (
    <motion.div initial={{opacity:0,x:40}} animate={{opacity:1,x:0}} transition={{duration:0.35}}
      style={{overflowY:"auto",height:"100%",paddingBottom:100}}>
      {/* Header */}
      <div style={{background:`linear-gradient(135deg,${doctor.color},${doctor.color}cc)`,padding:"48px 20px 32px",position:"relative"}}>
        <motion.button whileTap={{scale:0.9}} onClick={()=>setScreen("doctors")} style={{
          background:"rgba(255,255,255,0.2)",border:"none",borderRadius:10,
          padding:"8px 12px",color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",marginBottom:20,
          display:"flex",alignItems:"center",gap:6,
        }}>
          <span>←</span> Back
        </motion.button>
        <div style={{display:"flex",gap:16,alignItems:"center"}}>
          <Avatar initials={doctor.img} color="rgba(255,255,255,0.3)" size={72}/>
          <div>
            <h2 style={{color:"#fff",fontSize:20,fontWeight:800,margin:0,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>{doctor.name}</h2>
            <p style={{color:"rgba(255,255,255,0.8)",fontSize:13,margin:"4px 0 8px"}}>{doctor.specialty} · {doctor.exp} experience</p>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <Stars rating={doctor.rating}/>
              <span style={{color:"rgba(255,255,255,0.9)",fontSize:12,fontWeight:600}}>{doctor.rating} ({doctor.reviews} reviews)</span>
            </div>
          </div>
        </div>
        <div style={{display:"flex",gap:12,marginTop:20}}>
          <motion.button whileTap={{scale:0.94}} style={{flex:1,padding:"12px",background:"rgba(255,255,255,0.2)",
            border:"1.5px solid rgba(255,255,255,0.4)",borderRadius:12,color:"#fff",fontSize:13,fontWeight:700,
            cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
            <Icon name="phone" size={16} color="#fff"/> Call Assistant
          </motion.button>
          <motion.button whileTap={{scale:0.94}} onClick={()=>setScreen("booking")} style={{flex:1,padding:"12px",
            background:"#fff",border:"none",borderRadius:12,color:doctor.color,fontSize:13,fontWeight:800,
            cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6,
            boxShadow:"0 4px 16px rgba(0,0,0,0.15)"}}>
            <Icon name="calendar" size={16} color={doctor.color}/> Book Appointment
          </motion.button>
        </div>
      </div>
      {/* Tabs */}
      <div style={{display:"flex",borderBottom:`1px solid ${T.border}`,background:"#fff",padding:"0 16px"}}>
        {["info","schedule","services","reviews"].map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{
            flex:1,padding:"14px 4px",border:"none",background:"none",cursor:"pointer",
            fontSize:12,fontWeight:600,color:tab===t?T.primary:T.textLo,
            borderBottom:`2px solid ${tab===t?T.primary:"transparent"}`,textTransform:"capitalize",
          }}>{t}</button>
        ))}
      </div>
      {/* Content */}
      <div style={{padding:"20px 16px"}}>
        {tab==="info" && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible">
            <div style={{background:"#fff",borderRadius:16,padding:"18px",border:`1px solid ${T.border}`,marginBottom:16}}>
              <h4 style={{fontSize:14,fontWeight:700,color:T.text,margin:"0 0 10px"}}>About</h4>
              <p style={{fontSize:13,color:T.textMid,lineHeight:1.65,margin:0}}>
                {doctor.name} is a highly experienced {doctor.specialty} with {doctor.exp} of clinical practice.
                Specializing in advanced diagnostics and patient-centric care, they are affiliated with {doctor.location}.
              </p>
            </div>
            <div style={{background:"#fff",borderRadius:16,padding:"18px",border:`1px solid ${T.border}`}}>
              <h4 style={{fontSize:14,fontWeight:700,color:T.text,margin:"0 0 12px"}}>Location</h4>
              <div style={{display:"flex",gap:10,alignItems:"center"}}>
                <div style={{width:40,height:40,background:`${doctor.color}15`,borderRadius:10,
                  display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <Icon name="map" size={18} color={doctor.color}/>
                </div>
                <span style={{fontSize:13,color:T.textMid}}>{doctor.location}</span>
              </div>
            </div>
          </motion.div>
        )}
        {tab==="schedule" && (
          <motion.div variants={stagger} initial="hidden" animate="visible">
            {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(day=>{
              const active=doctor.days.includes(day);
              return (
                <motion.div key={day} variants={fadeUp}
                  style={{display:"flex",justifyContent:"space-between",alignItems:"center",
                    padding:"14px 16px",background:"#fff",borderRadius:12,marginBottom:8,
                    border:`1px solid ${active?doctor.color+"30":T.border}`,
                    opacity:active?1:0.5}}>
                  <span style={{fontSize:13,fontWeight:600,color:active?T.text:T.textLo}}>{day}</span>
                  <span style={{fontSize:12,color:active?doctor.color:T.textLo,fontWeight:600}}>
                    {active?"9:00 AM – 5:00 PM":"Not Available"}
                  </span>
                </motion.div>
              );
            })}
          </motion.div>
        )}
        {tab==="services" && (
          <motion.div variants={stagger} initial="hidden" animate="visible">
            {doctor.services.map(sv=>(
              <motion.div key={sv} variants={fadeUp}
                style={{display:"flex",gap:12,alignItems:"center",padding:"14px 16px",
                  background:"#fff",borderRadius:12,marginBottom:8,border:`1px solid ${T.border}`}}>
                <div style={{width:32,height:32,background:`${doctor.color}15`,borderRadius:8,
                  display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <Icon name="check" size={14} color={doctor.color}/>
                </div>
                <span style={{fontSize:13,fontWeight:600,color:T.text}}>{sv}</span>
              </motion.div>
            ))}
          </motion.div>
        )}
        {tab==="reviews" && (
          <motion.div variants={stagger} initial="hidden" animate="visible">
            {["Great doctor, very attentive.","Professional and thorough.","Highly recommend!"].map((rev,i)=>(
              <motion.div key={i} variants={fadeUp}
                style={{background:"#fff",borderRadius:14,padding:"16px",marginBottom:12,border:`1px solid ${T.border}`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                  <div style={{display:"flex",gap:8,alignItems:"center"}}>
                    <Avatar initials={["AR","SK","FT"][i]} color={["#0EA5E9","#8B5CF6","#22C55E"][i]} size={32}/>
                    <span style={{fontSize:13,fontWeight:700,color:T.text}}>Patient {i+1}</span>
                  </div>
                  <Stars rating={5}/>
                </div>
                <p style={{fontSize:13,color:T.textMid,margin:0,lineHeight:1.5}}>{rev}</p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

// ── BOOKING SCREEN ────────────────────────────────────────────────────────
const BookingScreen = ({ doctor, setScreen }) => {
  const [type,     setType]    = useState("inperson");
  const [selDate,  setSelDate] = useState(null);
  const [selTime,  setSelTime] = useState(null);
  const [booked,   setBooked]  = useState(false);

  const today    = new Date();
  const days     = Array.from({length:14},(_,i)=>{
    const d=new Date(today); d.setDate(today.getDate()+i); return d;
  });
  const dayNames = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  if (!doctor) return null;

  const handleBook = () => {
    if (!selDate||!selTime) return;
    setBooked(true);
  };

  if (booked) return (
    <motion.div initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}}
      style={{height:"100%",display:"flex",flexDirection:"column",alignItems:"center",
        justifyContent:"center",padding:32,textAlign:"center"}}>
      <motion.div initial={{scale:0}} animate={{scale:1}} transition={{type:"spring",stiffness:300,damping:18,delay:0.1}}
        style={{width:80,height:80,background:`${T.accent}20`,borderRadius:"50%",
          display:"flex",alignItems:"center",justifyContent:"center",marginBottom:20}}>
        <Icon name="check" size={36} color={T.accent}/>
      </motion.div>
      <h2 style={{fontSize:24,fontWeight:800,color:T.text,marginBottom:10,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Appointment Booked!</h2>
      <p style={{color:T.textMid,fontSize:14,lineHeight:1.6,marginBottom:28}}>
        Your {type==="video"?"video":"in-person"} appointment with {doctor.name}<br/>
        on {selDate?.toDateString()} at {selTime} is confirmed.
      </p>
      <motion.button whileTap={{scale:0.96}} onClick={()=>{setBooked(false);setScreen("visits");}} style={{
        background:`linear-gradient(135deg,${T.primary},${T.primary2})`,
        border:"none",borderRadius:14,padding:"15px 40px",color:"#fff",
        fontSize:15,fontWeight:700,cursor:"pointer",boxShadow:`0 8px 24px ${T.primary}40`,
      }}>View My Appointments</motion.button>
    </motion.div>
  );

  return (
    <motion.div initial={{opacity:0,x:40}} animate={{opacity:1,x:0}}
      style={{overflowY:"auto",height:"100%",paddingBottom:100}}>
      <div style={{background:`linear-gradient(135deg,${doctor.color},${doctor.color}cc)`,padding:"48px 20px 24px"}}>
        <motion.button whileTap={{scale:0.9}} onClick={()=>setScreen("doctorProfile")} style={{
          background:"rgba(255,255,255,0.2)",border:"none",borderRadius:10,
          padding:"8px 12px",color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",marginBottom:16,
          display:"flex",alignItems:"center",gap:6,
        }}>← Back</motion.button>
        <h2 style={{color:"#fff",fontSize:20,fontWeight:800,margin:0,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Book Appointment</h2>
        <p style={{color:"rgba(255,255,255,0.8)",fontSize:13,margin:"4px 0 0"}}>{doctor.name}</p>
      </div>
      <div style={{padding:"20px 16px",display:"flex",flexDirection:"column",gap:20}}>
        {/* Consultation type */}
        <div style={{background:"#fff",borderRadius:16,padding:"18px",border:`1px solid ${T.border}`}}>
          <h4 style={{fontSize:14,fontWeight:700,color:T.text,margin:"0 0 12px"}}>Consultation Type</h4>
          <div style={{display:"flex",gap:10}}>
            {[{k:"inperson",label:"In-Person",icon:"steth"},{k:"video",label:"Video Call",icon:"video"}].map(opt=>(
              <motion.button key={opt.k} whileTap={{scale:0.94}} onClick={()=>setType(opt.k)} style={{
                flex:1,padding:"14px",borderRadius:12,cursor:"pointer",
                border:`2px solid ${type===opt.k?doctor.color:T.border}`,
                background:type===opt.k?`${doctor.color}10`:"#fff",
                display:"flex",flexDirection:"column",alignItems:"center",gap:6,
              }}>
                <Icon name={opt.icon} size={20} color={type===opt.k?doctor.color:T.textLo}/>
                <span style={{fontSize:12,fontWeight:600,color:type===opt.k?doctor.color:T.textLo}}>{opt.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
        {/* Calendar */}
        <div style={{background:"#fff",borderRadius:16,padding:"18px",border:`1px solid ${T.border}`}}>
          <h4 style={{fontSize:14,fontWeight:700,color:T.text,margin:"0 0 12px"}}>Select Date</h4>
          <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:6}}>
            {days.map((d,i)=>{
              const dayName=dayNames[d.getDay()];
              const isActive=doctor.days.includes(dayName);
              const isSel=selDate?.toDateString()===d.toDateString();
              if (!isActive&&i>0) return null;
              return (
                <motion.button key={i} whileTap={{scale:0.9}} onClick={()=>{
                  if(!isActive){alert(`Dr. ${doctor.name} is not available on ${dayName}s.`);return;}
                  setSelDate(d);
                }} style={{
                  flexShrink:0,width:52,padding:"10px 6px",borderRadius:12,border:"none",cursor:"pointer",
                  background:isSel?doctor.color:isActive?"#fff":"#f8fafc",
                  boxShadow:isSel?`0 4px 14px ${doctor.color}50`:"0 1px 4px rgba(0,0,0,0.05)",
                  border:`1px solid ${isSel?doctor.color:T.border}`,
                  opacity:isActive?1:0.4,
                }}>
                  <div style={{fontSize:10,fontWeight:600,color:isSel?"#fff":T.textLo,marginBottom:4}}>{dayName}</div>
                  <div style={{fontSize:15,fontWeight:800,color:isSel?"#fff":T.text}}>{d.getDate()}</div>
                </motion.button>
              );
            })}
          </div>
        </div>
        {/* Time Slots */}
        {selDate && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible"
            style={{background:"#fff",borderRadius:16,padding:"18px",border:`1px solid ${T.border}`}}>
            <h4 style={{fontSize:14,fontWeight:700,color:T.text,margin:"0 0 14px"}}>Morning Slots</h4>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:16}}>
              {TIME_SLOTS_AM.map(t=>{
                const busy=BUSY_SLOTS.includes(t),sel=selTime===t;
                return (
                  <motion.button key={t} whileTap={!busy?{scale:0.92}:{}} onClick={()=>!busy&&setSelTime(t)} style={{
                    padding:"10px 6px",borderRadius:10,border:"none",cursor:busy?"not-allowed":"pointer",
                    background:sel?doctor.color:busy?"#F1F5F9":"#fff",
                    color:sel?"#fff":busy?T.textLo:T.text,
                    fontSize:11,fontWeight:600,border:`1px solid ${sel?doctor.color:T.border}`,
                    opacity:busy?0.5:1,
                  }}>{t}</motion.button>
                );
              })}
            </div>
            <h4 style={{fontSize:14,fontWeight:700,color:T.text,margin:"0 0 10px"}}>Afternoon Slots</h4>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
              {TIME_SLOTS_PM.map(t=>{
                const busy=BUSY_SLOTS.includes(t),sel=selTime===t;
                return (
                  <motion.button key={t} whileTap={!busy?{scale:0.92}:{}} onClick={()=>!busy&&setSelTime(t)} style={{
                    padding:"10px 6px",borderRadius:10,border:"none",cursor:busy?"not-allowed":"pointer",
                    background:sel?doctor.color:busy?"#F1F5F9":"#fff",
                    color:sel?"#fff":busy?T.textLo:T.text,
                    fontSize:11,fontWeight:600,border:`1px solid ${sel?doctor.color:T.border}`,
                    opacity:busy?0.5:1,
                  }}>{t}</motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
        {/* Patient Details */}
        <div style={{background:"#fff",borderRadius:16,padding:"18px",border:`1px solid ${T.border}`}}>
          <h4 style={{fontSize:14,fontWeight:700,color:T.text,margin:"0 0 12px"}}>Patient Details</h4>
          {[["Full Name","Muhammad Majid Ali"],["Email","malikmajid5140@gmail.com"],["Phone","+92 300 XXXXXXX"]].map(([label,val])=>(
            <div key={label} style={{marginBottom:10}}>
              <div style={{fontSize:11,color:T.textLo,fontWeight:600,marginBottom:4}}>{label}</div>
              <div style={{fontSize:13,color:T.text,fontWeight:500,padding:"10px 12px",
                background:T.bg,borderRadius:8,border:`1px solid ${T.border}`}}>{val}</div>
            </div>
          ))}
        </div>
        <motion.button whileTap={{scale:0.97}} onClick={handleBook} style={{
          padding:"16px",borderRadius:14,border:"none",
          background:selDate&&selTime?`linear-gradient(135deg,${doctor.color},${doctor.color}cc)`:"#E2E8F0",
          color:selDate&&selTime?"#fff":T.textLo,fontSize:15,fontWeight:700,cursor:"pointer",
          boxShadow:selDate&&selTime?`0 8px 24px ${doctor.color}40`:"none",
        }}>
          {selDate&&selTime?"Confirm Appointment →":"Select Date & Time"}
        </motion.button>
      </div>
    </motion.div>
  );
};

// ── VISITS SCREEN ─────────────────────────────────────────────────────────
const VisitsScreen = () => {
  const [tab, setTab]          = useState("active");
  const [detail, setDetail]    = useState(null);
  const [cancelled, setCancelled] = useState([]);

  const appts = tab==="active" ? MY_APPOINTMENTS.filter(a=>!cancelled.includes(a.id)) : MY_HISTORY;

  return (
    <div style={{overflowY:"auto",height:"100%",paddingBottom:80}}>
      <div style={{background:`linear-gradient(135deg,${T.primary},${T.primary2})`,padding:"48px 20px 24px"}}>
        <h2 style={{color:"#fff",fontSize:22,fontWeight:800,margin:0,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>My Appointments</h2>
      </div>
      <div style={{display:"flex",background:"#fff",borderBottom:`1px solid ${T.border}`}}>
        {["active","history"].map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{
            flex:1,padding:"14px",border:"none",background:"none",cursor:"pointer",
            fontSize:13,fontWeight:600,color:tab===t?T.primary:T.textLo,
            borderBottom:`2px solid ${tab===t?T.primary:"transparent"}`,textTransform:"capitalize",
          }}>{t==="active"?"Active Visits":"History"}</button>
        ))}
      </div>
      <div style={{padding:"16px",display:"flex",flexDirection:"column",gap:12}}>
        {appts.length===0 && (
          <div style={{textAlign:"center",padding:"48px 0",color:T.textLo}}>
            <div style={{fontSize:48,marginBottom:12}}>📋</div>
            <p style={{fontSize:14}}>No appointments here yet.</p>
          </div>
        )}
        {appts.map((a,i)=>(
          <motion.div key={a.id} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:i*0.07}}
            style={{background:"#fff",borderRadius:18,padding:"18px",border:`1px solid ${T.border}`,
              boxShadow:"0 2px 10px rgba(0,0,0,0.04)"}}>
            <div style={{display:"flex",gap:14,alignItems:"center",marginBottom:12}}>
              <Avatar initials={a.img} color={a.color} size={46}/>
              <div style={{flex:1}}>
                <div style={{fontSize:14,fontWeight:700,color:T.text}}>{a.doctor}</div>
                <div style={{fontSize:12,color:T.textLo}}>{a.specialty}</div>
              </div>
              <Badge status={a.status}/>
            </div>
            <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:14}}>
              <span style={{fontSize:12,color:T.textMid,display:"flex",alignItems:"center",gap:4}}>
                <Icon name="clock" size={12} color={T.textLo}/>{a.date}
              </span>
              <span style={{fontSize:12,color:T.textMid,display:"flex",alignItems:"center",gap:4}}>
                {a.type==="Video"?<Icon name="video" size={12} color={T.textLo}/>:<Icon name="steth" size={12} color={T.textLo}/>}
                {a.type}
              </span>
            </div>
            <div style={{display:"flex",gap:8}}>
              <motion.button whileTap={{scale:0.94}} onClick={()=>setDetail(a)} style={{
                flex:1,padding:"10px",borderRadius:10,border:`1px solid ${T.border}`,
                background:"#fff",fontSize:12,fontWeight:600,color:T.textMid,cursor:"pointer",
              }}>View Details</motion.button>
              {tab==="active" && (
                <motion.button whileTap={{scale:0.94}} onClick={()=>setCancelled(p=>[...p,a.id])} style={{
                  flex:1,padding:"10px",borderRadius:10,border:`1px solid #FEE2E2`,
                  background:"#FEF2F2",fontSize:12,fontWeight:600,color:T.danger,cursor:"pointer",
                }}>Cancel</motion.button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
      {/* Detail Modal */}
      <AnimatePresence>
        {detail && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            onClick={()=>setDetail(null)}
            style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:200,display:"flex",alignItems:"flex-end"}}>
            <motion.div initial={{y:"100%"}} animate={{y:0}} exit={{y:"100%"}}
              transition={{type:"spring",stiffness:300,damping:28}}
              onClick={e=>e.stopPropagation()}
              style={{background:"#fff",borderRadius:"20px 20px 0 0",padding:"28px 20px 40px",width:"100%"}}>
              <div style={{width:40,height:4,background:T.border,borderRadius:2,margin:"0 auto 20px"}}/>
              <h3 style={{fontSize:17,fontWeight:800,color:T.text,margin:"0 0 16px"}}>Appointment Details</h3>
              <div style={{display:"flex",gap:14,alignItems:"center",marginBottom:16}}>
                <Avatar initials={detail.img} color={detail.color} size={52}/>
                <div>
                  <div style={{fontSize:15,fontWeight:700,color:T.text}}>{detail.doctor}</div>
                  <div style={{fontSize:12,color:T.textLo}}>{detail.specialty}</div>
                </div>
                <Badge status={detail.status}/>
              </div>
              {[["Date & Time",detail.date],["Type",detail.type],["Status",detail.status]].map(([k,v])=>(
                <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"12px 0",borderBottom:`1px solid ${T.border}`}}>
                  <span style={{fontSize:13,color:T.textLo,fontWeight:500}}>{k}</span>
                  <span style={{fontSize:13,color:T.text,fontWeight:600}}>{v}</span>
                </div>
              ))}
              <motion.button whileTap={{scale:0.96}} onClick={()=>setDetail(null)} style={{
                width:"100%",marginTop:20,padding:"15px",borderRadius:14,border:"none",
                background:T.bg,fontSize:14,fontWeight:600,color:T.text,cursor:"pointer",
              }}>Close</motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── PROFILE SCREEN ────────────────────────────────────────────────────────
const ProfileScreen = ({ setFlowState }) => (
  <div style={{overflowY:"auto",height:"100%",paddingBottom:80}}>
    <div style={{background:`linear-gradient(135deg,${T.primary},${T.primary2})`,padding:"48px 20px 40px",textAlign:"center"}}>
      <Avatar initials="MA" color="rgba(255,255,255,0.3)" size={80}/>
      <h2 style={{color:"#fff",fontSize:22,fontWeight:800,margin:"14px 0 4px",fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Muhammad Majid</h2>
      <p style={{color:"rgba(255,255,255,0.75)",fontSize:13,margin:0}}>malikmajid5140@gmail.com</p>
    </div>
    <div style={{padding:"20px 16px",display:"flex",flexDirection:"column",gap:12}}>
      {[
        {icon:"user",  label:"Personal Information", sub:"Name, email, date of birth"},
        {icon:"heart", label:"Medical History",       sub:"Conditions, allergies, medications"},
        {icon:"pills", label:"My Prescriptions",      sub:"View all prescriptions"},
        {icon:"bell",  label:"Notifications",         sub:"Appointment reminders, health tips"},
        {icon:"steth", label:"Register as Doctor",    sub:"Switch to practitioner account", accent:true},
      ].map(item=>(
        <motion.div key={item.label} whileTap={{scale:0.98}} style={{
          background:"#fff",borderRadius:16,padding:"16px",border:`1px solid ${item.accent?T.primary+"40":T.border}`,
          display:"flex",gap:14,alignItems:"center",cursor:"pointer",
          background:item.accent?`${T.primary}08`:"#fff",
        }}>
          <div style={{width:40,height:40,borderRadius:12,
            background:item.accent?`${T.primary}20`:`${T.textLo}10`,
            display:"flex",alignItems:"center",justifyContent:"center"}}>
            <Icon name={item.icon} size={18} color={item.accent?T.primary:T.textMid}/>
          </div>
          <div style={{flex:1}}>
            <div style={{fontSize:14,fontWeight:600,color:item.accent?T.primary:T.text}}>{item.label}</div>
            <div style={{fontSize:11,color:T.textLo,marginTop:2}}>{item.sub}</div>
          </div>
          <Icon name="arrow" size={16} color={item.accent?T.primary:T.textLo}/>
        </motion.div>
      ))}
      <motion.button whileTap={{scale:0.97}} onClick={()=>setFlowState("auth")} style={{
        padding:"16px",borderRadius:14,border:`1px solid #FEE2E2`,
        background:"#FEF2F2",fontSize:14,fontWeight:700,color:T.danger,cursor:"pointer",
        display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginTop:8,
      }}>
        <Icon name="logout" size={18} color={T.danger}/> Sign Out
      </motion.button>
    </div>
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// ROOT APP
// ════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [flowState,    setFlowState]    = useState("onboarding"); // onboarding | auth | app
  const [activeTab,    setActiveTab]    = useState("home");
  const [screen,       setScreen]       = useState("home");       // home | doctors | doctorProfile | booking | visits | profile
  const [selectedDoc,  setSelectedDoc]  = useState(null);
  const prefersReduced = useReducedMotion();

  useEffect(()=>{
    const f=document.createElement("link");
    f.href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap";
    f.rel="stylesheet"; document.head.appendChild(f);
  },[]);

  const handleTabChange = t => {
    setActiveTab(t);
    setScreen(t);
  };

  const renderScreen = () => {
    const screenMap = {
      home:         <HomeScreen setScreen={setScreen} setSelectedDoc={setSelectedDoc}/>,
      doctors:      <DoctorsScreen setScreen={setScreen} setSelectedDoc={setSelectedDoc}/>,
      doctorProfile:<DoctorProfile doctor={selectedDoc} setScreen={setScreen}/>,
      booking:      <BookingScreen doctor={selectedDoc} setScreen={setScreen}/>,
      visits:       <VisitsScreen/>,
      profile:      <ProfileScreen setFlowState={setFlowState}/>,
    };
    return screenMap[screen]||screenMap.home;
  };

  return (
    <div style={{
      maxWidth:420, margin:"0 auto", height:"100vh", display:"flex", flexDirection:"column",
      fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif",
      background:T.bg, overflow:"hidden", position:"relative",
    }}>
      <style>{`
        * { box-sizing:border-box; -webkit-tap-highlight-color:transparent; }
        input::placeholder { color:#94A3B8; }
        ::-webkit-scrollbar { display:none; }
        button { font-family:inherit; }
      `}</style>

      <AnimatePresence mode="wait">
        {flowState==="onboarding" && (
          <motion.div key="onboard" style={{position:"absolute",inset:0,zIndex:50}} exit={{opacity:0,scale:1.05}} transition={{duration:0.3}}>
            <OnboardingScreen onDone={()=>setFlowState("auth")}/>
          </motion.div>
        )}
        {flowState==="auth" && (
          <motion.div key="auth" style={{position:"absolute",inset:0,zIndex:50}} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.3}}>
            <AuthScreen onAuth={()=>setFlowState("app")}/>
          </motion.div>
        )}
      </AnimatePresence>

      {flowState==="app" && (
        <>
          <div style={{flex:1,overflow:"hidden",position:"relative"}}>
            <AnimatePresence mode="wait">
              <motion.div key={screen} style={{position:"absolute",inset:0}}
                initial={prefersReduced?{}:{opacity:0}} animate={{opacity:1}} exit={prefersReduced?{}:{opacity:0}}
                transition={{duration:0.25}}>
                {renderScreen()}
              </motion.div>
            </AnimatePresence>
          </div>
          <NavBar active={activeTab} setActive={handleTabChange}/>
        </>
      )}
    </div>
  );
}
