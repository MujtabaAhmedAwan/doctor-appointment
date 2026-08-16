export const SPECIALTIES = [
  {id:1, name:"Cardiology",    emoji:"🫀", color:"#FEE2E2", accent:"#EF4444"},
  {id:2, name:"Neurology",     emoji:"🧠", color:"#EDE9FE", accent:"#8B5CF6"},
  {id:3, name:"Orthopedics",   emoji:"🦴", color:"#FEF3C7", accent:"#F59E0B"},
  {id:4, name:"Pediatrics",    emoji:"👶", color:"#DCFCE7", accent:"#22C55E"},
  {id:5, name:"Dermatology",   emoji:"🌡️", color:"#FCE7F3", accent:"#EC4899"},
  {id:6, name:"Ophthalmology", emoji:"👁️", color:"#E0F2FE", accent:"#0EA5E9"},
  {id:7, name:"Nephrology",    emoji:"🫘", color:"#F0FDF4", accent:"#10B981"},
  {id:8, name:"Gastrology",    emoji:"🫁", color:"#FFF7ED", accent:"#F97316"},
];

export const DOCTORS = [
  {id:1, name:"Dr. Sarah Chen",      specialty:"Cardiologist",    rating:4.9, reviews:312, exp:"12 yrs", available:true,  price:2500, img:"SC", color:"#0EA5E9", location:"North Avenue Clinic",  days:["Mon","Tue","Wed","Thu"],    services:["ECG","Echo","Stress Test","Consultation"]},
  {id:2, name:"Dr. Ahmed Malik",     specialty:"Neurologist",     rating:4.8, reviews:198, exp:"8 yrs",  available:true,  price:3000, img:"AM", color:"#8B5CF6", location:"Main Street Hospital",  days:["Mon","Wed","Fri"],          services:["EEG","MRI Review","Nerve Conduction"]},
  {id:3, name:"Dr. Priya Sharma",    specialty:"Pediatrician",    rating:4.9, reviews:445, exp:"15 yrs", available:false, price:1800, img:"PS", color:"#22C55E", location:"City Medical Center",   days:["Tue","Thu","Sat"],          services:["Growth Check","Immunization","Nutrition"]},
  {id:4, name:"Dr. James Wilson",    specialty:"Orthopedic",      rating:4.7, reviews:267, exp:"10 yrs", available:true,  price:2800, img:"JW", color:"#F59E0B", location:"Spine & Joint Center",  days:["Mon","Tue","Thu","Fri"],    services:["X-Ray Review","Joint Injection","Physio"]},
  {id:5, name:"Dr. Fatima Hassan",   specialty:"Dermatologist",   rating:4.8, reviews:389, exp:"9 yrs",  available:false, price:2200, img:"FH", color:"#EC4899", location:"Skin & Laser Clinic",   days:["Wed","Thu","Fri","Sat"],    services:["Skin Biopsy","Laser","Acne Treatment"]},
  {id:6, name:"Dr. Usman Tariq",     specialty:"Ophthalmologist", rating:4.9, reviews:521, exp:"18 yrs", available:true,  price:2000, img:"UT", color:"#0EA5E9", location:"Eye Care Institute",    days:["Mon","Tue","Wed","Sat"],    services:["Slit Lamp","Vision Test","Retinal Scan"]},
];

export const INSIGHTS = [
  { tip:"Drink at least 8 glasses of water daily to keep your body hydrated and support kidney function.", icon:"💧" },
  { tip:"30 minutes of moderate exercise 5 days per week reduces cardiovascular disease risk by 35%.", icon:"🏃" },
  { tip:"Adequate sleep (7–9 hours) strengthens immunity and improves cognitive performance.", icon:"😴" },
];

export const MY_APPOINTMENTS = [
  {id: 1, doctor: "Dr. Sarah Chen", specialty: "Cardiologist", date: "Fri, Aug 22 @ 9:45 AM", status: "Confirmed", type: "In-person", color: "#0EA5E9", img: "SC"},
  {id: 2, doctor: "Dr. Ahmed Malik", specialty: "Neurologist", date: "Wed, Sep 3 @ 2:00 PM", status: "Pending", type: "Video", color: "#8B5CF6", img: "AM"},
];

export const MY_HISTORY = [
  {id: 3, doctor: "Dr. Priya Sharma", specialty: "Pediatrician", date: "Mon, Jul 14 @ 10:00 AM", status: "Completed", type: "In-person", color: "#22C55E", img: "PS"},
  {id: 4, doctor: "Dr. James Wilson", specialty: "Orthopedic", date: "Thu, Jun 26 @ 3:30 PM", status: "Completed", type: "In-person", color: "#F59E0B", img: "JW"},
];

export const INCOMING_REQUESTS = [
  {id: 101, patient: "Ali Khan", date: "Mon, Oct 12 @ 10:00 AM", type: "In-person", status: "Pending", img: "AK", color: "#3B82F6", reason: "General Checkup" },
  {id: 102, patient: "Sara Ahmed", date: "Tue, Oct 13 @ 2:30 PM", type: "Video", status: "Pending", img: "SA", color: "#EC4899", reason: "Fever and Cough" }
];
