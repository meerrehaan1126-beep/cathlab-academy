"use client";
import { useMemo, useState } from "react";
import { Calculator, HeartPulse, Info } from "lucide-react";

function Num({label,value,set,step="any",suffix}:{label:string;value:string;set:(v:string)=>void;step?:string;suffix?:string}){
  return <label className="block"><span className="text-xs font-bold text-slate-600">{label} {suffix&&<span className="text-slate-400">({suffix})</span>}</span><input type="number" step={step} value={value} onChange={e=>set(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-500 bg-white"/></label>;
}
function Result({label,value,unit,note,color="#0F2040"}:{label:string;value:string;unit?:string;note?:string;color?:string}){
  return <div className="rounded-2xl p-4 text-white" style={{background:color}}><p className="text-[11px] font-bold opacity-75 uppercase tracking-wide">{label}</p><p className="text-2xl font-extrabold mt-0.5">{value} {unit&&<span className="text-sm font-semibold opacity-80">{unit}</span>}</p>{note&&<p className="text-xs opacity-85 mt-1 leading-relaxed">{note}</p>}</div>;
}
const n=(v:string)=>{ const x=parseFloat(v); return isNaN(x)?0:x; };
const TABS=["Hemodynamics (Fick & Resistances)","Valve Area (Gorlin/Hakki)","Shunt Qp/Qs","Kidney & Contrast","BMI / BSA / Heparin","TIMI Risk (UA/NSTEMI)"] as const;

export default function CalculatorsPage(){
  const [tab,setTab]=useState<(typeof TABS)[number]>(TABS[0]);
  // Fick
  const [vo2,setVo2]=useState("250"); const [hb,setHb]=useState("13"); const [aoSat,setAoSat]=useState("97"); const [mvSat,setMvSat]=useState("72"); const [hr,setHr]=useState("72"); const [map,setMap]=useState("90"); const [ra,setRa]=useState("5"); const [mpap,setMpap]=useState("15"); const [pcwp,setPcwp]=useState("10"); const [bsaIn,setBsaIn]=useState("1.8");
  const fick=useMemo(()=>{ const avDiff=1.36*n(hb)*10*((n(aoSat)-n(mvSat))/100); const co=avDiff>0?n(vo2)/avDiff:0; const ci=n(bsaIn)>0?co/n(bsaIn):0; const sv=n(hr)>0?co*1000/n(hr):0; const svr=co>0?80*(n(map)-n(ra))/co:0; const pvr=co>0?80*(n(mpap)-n(pcwp))/co:0; const pvrW=co>0?(n(mpap)-n(pcwp))/co:0; return {co,ci,sv,svr,pvr,pvrW,avDiff}; },[vo2,hb,aoSat,mvSat,hr,map,ra,mpap,pcwp,bsaIn]);
  // Valve
  const [coV,setCoV]=useState("5"); const [hrV,setHrV]=useState("72"); const [sep,setSep]=useState("0.33"); const [meanGrad,setMeanGrad]=useState("45"); const [peakGrad,setPeakGrad]=useState("64"); const [dfp,setDfp]=useState("0.45");
  const valve=useMemo(()=>{ const gorlinAV=(n(hrV)*n(sep)*44.3*Math.sqrt(Math.max(0,n(meanGrad))))>0? (n(coV)*1000)/(n(hrV)*n(sep)*44.3*Math.sqrt(Math.max(0.1,n(meanGrad)))):0; const gorlinMV=(n(hrV)*n(dfp)*44.3*0.85*Math.sqrt(Math.max(0.1,n(meanGrad))))>0? (n(coV)*1000)/(n(hrV)*n(dfp)*37.7*Math.sqrt(Math.max(0.1,n(meanGrad)))):0; const hakki=Math.sqrt(Math.max(0.1,n(peakGrad)))>0?n(coV)/Math.sqrt(Math.max(0.1,n(peakGrad))):0; return {gorlinAV,gorlinMV,hakki}; },[coV,hrV,sep,meanGrad,peakGrad,dfp]);
  // Shunt
  const [sAo,setSAo]=useState("97"); const [sMv,setSMv]=useState("72"); const [sPv,setSPv]=useState("97"); const [sPa,setSPa]=useState("82");
  const qpqs=useMemo(()=>{ const d=(n(sPv)-n(sPa)); return d!==0?(n(sAo)-n(sMv))/d:0; },[sAo,sMv,sPv,sPa]);
  // Kidney
  const [age,setAge]=useState("60"); const [sex,setSex]=useState("male"); const [creat,setCreat]=useState("1.1"); const [wtK,setWtK]=useState("70"); const [contrastUsed,setContrastUsed]=useState("120");
  const kidney=useMemo(()=>{ // CKD-EPI 2021 (race-free)
    const scr=n(creat); const k=sex==="female"?0.7:0.9; const a=sex==="female"?-0.241:-0.302; const egfr=scr>0?142*Math.pow(Math.min(scr/k,1),a)*Math.pow(Math.max(scr/k,1),-1.200)*Math.pow(0.9938,n(age))*(sex==="female"?1.012:1):0;
    const cig=scr>0?5*n(wtK)/scr:0; const ratio=egfr>0?n(contrastUsed)/egfr:0; return {egfr,cig,ratio}; },[age,sex,creat,wtK,contrastUsed]);
  // BMI/BSA/Heparin
  const [ht,setHt]=useState("170"); const [wt,setWt]=useState("70"); const [hepPerKg,setHepPerKg]=useState("80");
  const body=useMemo(()=>{ const hM=n(ht)/100; const bmi=hM>0?n(wt)/(hM*hM):0; const bsa=Math.sqrt((n(ht)*n(wt))/3600); return {bmi,bsa,hep:n(wt)*n(hepPerKg)}; },[ht,wt,hepPerKg]);
  // TIMI UA/NSTEMI
  const [timi,setTimi]=useState([false,false,false,false,false,false,false]);
  const timiScore=timi.filter(Boolean).length;
  const timiRisk=["4.7%","8.3%","13.2%","19.9%","26.2%","40.9%","40.9%","40.9%"][timiScore];
  const TIMI_ITEMS=["Age ≥65 years","≥3 CAD risk factors (HTN, DM, lipids, smoking, family hx)","Known CAD (stenosis ≥50%)","Aspirin use in last 7 days","Severe angina (≥2 episodes in 24h)","ST deviation ≥0.5 mm","Positive cardiac marker (troponin)"];

  return(
    <div className="space-y-6">
      <div className="rounded-3xl bg-[#0F2040] text-white p-6 sm:p-8">
        <p className="text-xs font-bold text-[#5EEAD4]">CLINICAL CALCULATORS</p><h1 className="mt-2 text-3xl font-extrabold">Numbers the cathlab runs on</h1>
        <p className="mt-2 text-white/70 text-sm max-w-2xl leading-relaxed">Practise with sample cath data until formulas become reflex. In the lab, verify with your hemodynamic system — but understanding what the machine computes is what makes you a technologist, not a button-pusher.</p>
      </div>
      <div className="flex gap-2 overflow-x-auto no-scrollbar">{TABS.map(t=><button key={t} onClick={()=>setTab(t)} className={`px-4 py-2.5 rounded-full text-[13px] font-bold whitespace-nowrap ${tab===t?"bg-[#0E9A8B] text-white":"bg-white border border-slate-200"}`}>{t}</button>)}</div>

      {tab===TABS[0]&&<div className="grid lg:grid-cols-2 gap-5 items-start">
        <div className="bg-white rounded-3xl border p-6"><h2 className="font-extrabold text-[#0F2040] flex gap-2 items-center"><HeartPulse className="h-5 w-5 text-[#E94E3C]"/> Fick Cardiac Output & Resistances</h2>
          <div className="grid grid-cols-2 gap-3 mt-5">
            <Num label="O₂ consumption VO₂" value={vo2} set={setVo2} suffix="mL/min"/><Num label="Haemoglobin" value={hb} set={setHb} suffix="g/dL"/>
            <Num label="Aortic O₂ sat" value={aoSat} set={setAoSat} suffix="%"/><Num label="Mixed venous O₂ sat" value={mvSat} set={setMvSat} suffix="%"/>
            <Num label="Heart rate" value={hr} set={setHr} suffix="bpm"/><Num label="BSA" value={bsaIn} set={setBsaIn} suffix="m²"/>
            <Num label="Mean arterial pressure" value={map} set={setMap} suffix="mmHg"/><Num label="RA pressure" value={ra} set={setRa} suffix="mmHg"/>
            <Num label="Mean PA pressure" value={mpap} set={setMpap} suffix="mmHg"/><Num label="PCWP" value={pcwp} set={setPcwp} suffix="mmHg"/>
          </div>
          <p className="mt-4 text-xs bg-slate-50 rounded-xl p-3 text-slate-600"><b>Formula:</b> CO = VO₂ ÷ [1.36 × Hb × 10 × (SaO₂−SvO₂)] &nbsp;•&nbsp; SVR = 80(MAP−RA)/CO &nbsp;•&nbsp; PVR = 80(mPAP−PCWP)/CO</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Result label="Cardiac Output (Fick)" value={fick.co.toFixed(2)} unit="L/min" note="Normal 4–8 L/min" color="#0F2040"/>
          <Result label="Cardiac Index" value={fick.ci.toFixed(2)} unit="L/min/m²" note="Normal 2.5–4.0" color="#0E9A8B"/>
          <Result label="Stroke Volume" value={fick.sv.toFixed(0)} unit="mL" note="Normal ~70 mL" color="#2563A8"/>
          <Result label="A–V O₂ Difference" value={fick.avDiff.toFixed(1)} unit="mL/L" color="#7A4FA3"/>
          <Result label="SVR" value={fick.svr.toFixed(0)} unit="dyn·s·cm⁻⁵" note="Normal 800–1200" color="#E94E3C"/>
          <Result label="PVR" value={`${fick.pvr.toFixed(0)} (${fick.pvrW.toFixed(2)} WU)`} note="Normal <250 dyn (<2 WU)" color="#D98E00"/>
          <div className="col-span-2 rounded-2xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-900 flex gap-2"><Info className="h-4 w-4 shrink-0 mt-0.5"/><span>{fick.ci>0&&fick.ci<2.2?"⚠️ CI <2.2 suggests low-output state — in shock, correlate with lactate, urine output & mixed venous sat.":fick.pvrW>3?"⚠️ PVR >3 Wood units — pulmonary vascular disease; important for shunt/transplant decisions.":"Try: drop mixed venous sat to 55% (low output) and watch CO/CI fall — classic cardiogenic shock pattern."}</span></div>
        </div>
      </div>}

      {tab===TABS[1]&&<div className="grid lg:grid-cols-2 gap-5 items-start">
        <div className="bg-white rounded-3xl border p-6"><h2 className="font-extrabold text-[#0F2040]">Gorlin & Hakki Valve Area</h2>
          <div className="grid grid-cols-2 gap-3 mt-5">
            <Num label="Cardiac output" value={coV} set={setCoV} suffix="L/min"/><Num label="Heart rate" value={hrV} set={setHrV} suffix="bpm"/>
            <Num label="Systolic ejection period" value={sep} set={setSep} suffix="sec/beat"/><Num label="Diastolic filling period" value={dfp} set={setDfp} suffix="sec/beat"/>
            <Num label="Mean gradient" value={meanGrad} set={setMeanGrad} suffix="mmHg"/><Num label="Peak-to-peak gradient (Hakki)" value={peakGrad} set={setPeakGrad} suffix="mmHg"/>
          </div><p className="mt-4 text-xs bg-slate-50 rounded-xl p-3 text-slate-600"><b>Gorlin AVA</b> = CO ÷ [HR × SEP × 44.3 × √mean gradient] • <b>Hakki</b> ≈ CO ÷ √peak-to-peak gradient • <b>Gorlin MVA</b> uses DFP & 37.7 constant</p></div>
        <div className="grid gap-3">
          <Result label="Aortic Valve Area — Gorlin" value={valve.gorlinAV.toFixed(2)} unit="cm²" note={valve.gorlinAV<1?"🔴 Severe AS range (<1.0 cm²)":valve.gorlinAV<1.5?"🟠 Moderate AS (1.0–1.5)":"🟢 Mild / normal range (>1.5)"} color="#E94E3C"/>
          <Result label="Aortic Valve Area — Hakki (quick)" value={valve.hakki.toFixed(2)} unit="cm²" note="Great bedside estimate during cath" color="#0F2040"/>
          <Result label="Mitral Valve Area — Gorlin (same gradient)" value={valve.gorlinMV.toFixed(2)} unit="cm²" note="Severe MS ≤1.5 cm² (use mitral mean gradient & DFP)" color="#0E9A8B"/>
          <div className="rounded-2xl bg-white border p-4 text-sm text-slate-600">Default values simulate severe AS (mean gradient 45 mmHg). Lower CO to 3 L/min to see <b>low-flow, low-gradient AS</b> — area stays severe despite modest gradient.</div>
        </div>
      </div>}

      {tab===TABS[2]&&<div className="grid lg:grid-cols-2 gap-5 items-start">
        <div className="bg-white rounded-3xl border p-6"><h2 className="font-extrabold text-[#0F2040]">Shunt — Qp/Qs by Oximetry</h2>
          <div className="grid grid-cols-2 gap-3 mt-5"><Num label="Aortic sat (SaO₂)" value={sAo} set={setSAo} suffix="%"/><Num label="Mixed venous sat" value={sMv} set={setSMv} suffix="%"/><Num label="Pulmonary vein sat" value={sPv} set={setSPv} suffix="%"/><Num label="PA sat" value={sPa} set={setSPa} suffix="%"/></div>
          <p className="mt-4 text-xs bg-slate-50 rounded-xl p-3 text-slate-600"><b>Qp/Qs</b> = (SaO₂ − SvO₂) ÷ (SpvO₂ − SpaO₂) • Mixed venous ≈ (3×SVC + IVC)/4 (Flamm)</p></div>
        <div className="grid gap-3"><Result label="Qp / Qs" value={qpqs.toFixed(2)} note={qpqs>=1.5?"🔴 Significant left-to-right shunt (≥1.5) — closure often considered":qpqs>1.1?"🟠 Small left-to-right shunt":"🟢 No significant shunt (≈1.0)"} color="#2563A8"/>
        <div className="rounded-2xl bg-white border p-4 text-sm text-slate-600 space-y-1.5"><p><b>Step-up localisation:</b></p><p>• ≥7% at RA level → ASD</p><p>• ≥5% at RV level → VSD</p><p>• ≥5% at PA level → PDA</p><p className="text-xs text-slate-400 pt-1">Always label oximetry syringes at the table!</p></div></div>
      </div>}

      {tab===TABS[3]&&<div className="grid lg:grid-cols-2 gap-5 items-start">
        <div className="bg-white rounded-3xl border p-6"><h2 className="font-extrabold text-[#0F2040]">eGFR (CKD-EPI 2021) & Contrast Limit</h2>
          <div className="grid grid-cols-2 gap-3 mt-5"><Num label="Age" value={age} set={setAge} suffix="years"/>
            <label className="block"><span className="text-xs font-bold text-slate-600">Sex</span><select value={sex} onChange={e=>setSex(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm bg-white"><option value="male">Male</option><option value="female">Female</option></select></label>
            <Num label="Serum creatinine" value={creat} set={setCreat} suffix="mg/dL"/><Num label="Weight" value={wtK} set={setWtK} suffix="kg"/>
            <Num label="Contrast used / planned" value={contrastUsed} set={setContrastUsed} suffix="mL"/></div>
          <p className="mt-4 text-xs bg-slate-50 rounded-xl p-3 text-slate-600"><b>Cigarroa limit</b> = 5 mL × weight ÷ creatinine • Contrast/eGFR ratio ideally &lt;2–3 • Hydrate, minimise, stage if needed</p></div>
        <div className="grid gap-3">
          <Result label="eGFR" value={kidney.egfr.toFixed(0)} unit="mL/min/1.73m²" note={kidney.egfr>=60?"🟢 ≥60 — standard precautions":kidney.egfr>=30?"🟠 30–59 — CI-AKI precautions, hydration":"🔴 <30 — high risk: nephrology, ultra-low contrast"} color="#0E9A8B"/>
          <Result label="Cigarroa Max Contrast" value={kidney.cig.toFixed(0)} unit="mL" note={`Contrast/eGFR ratio: ${kidney.ratio.toFixed(2)}`} color="#0F2040"/>
          <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-900">{n(contrastUsed)>kidney.cig?"⚠️ Planned contrast exceeds Cigarroa limit — announce to operator, consider staging IVUS-guided low-contrast PCI.":"Announce contrast volume every 100 mL during the case — make it a habit now."}</div>
        </div>
      </div>}

      {tab===TABS[4]&&<div className="grid lg:grid-cols-2 gap-5 items-start">
        <div className="bg-white rounded-3xl border p-6"><h2 className="font-extrabold text-[#0F2040]">BMI, BSA & Heparin Dose</h2>
          <div className="grid grid-cols-2 gap-3 mt-5"><Num label="Height" value={ht} set={setHt} suffix="cm"/><Num label="Weight" value={wt} set={setWt} suffix="kg"/><Num label="Heparin dose" value={hepPerKg} set={setHepPerKg} suffix="U/kg (PCI 70–100)"/></div>
          <p className="mt-4 text-xs bg-slate-50 rounded-xl p-3 text-slate-600">BSA (Mosteller) = √[height(cm) × weight(kg) ÷ 3600] — needed for cardiac index & indexed valve area.</p></div>
        <div className="grid grid-cols-2 gap-3">
          <Result label="BMI" value={body.bmi.toFixed(1)} unit="kg/m²" note={body.bmi<18.5?"Underweight":body.bmi<25?"Normal (18.5–24.9)":body.bmi<30?"Overweight":"Obese"} color="#2563A8"/>
          <Result label="BSA" value={body.bsa.toFixed(2)} unit="m²" note="Use in Fick calculator →" color="#0E9A8B"/>
          <div className="col-span-2"><Result label="Total Heparin Bolus" value={body.hep.toLocaleString()} unit="units" note="Always confirm with operator; check ACT 5 min after bolus. Protamine reversal: 1 mg / 100 units." color="#E94E3C"/></div>
        </div>
      </div>}

      {tab===TABS[5]&&<div className="grid lg:grid-cols-2 gap-5 items-start">
        <div className="bg-white rounded-3xl border p-6"><h2 className="font-extrabold text-[#0F2040]">TIMI Risk Score — UA/NSTEMI</h2><p className="text-xs text-slate-500 mt-1">Tick each present (1 point each). Predicts 14-day death/MI/urgent revascularisation.</p>
          <div className="mt-4 space-y-2">{TIMI_ITEMS.map((item,i)=>(<button key={item} onClick={()=>{const u=[...timi];u[i]=!u[i];setTimi(u);}} className={`w-full text-left rounded-xl border-2 px-4 py-3 text-sm font-medium flex gap-3 items-center ${timi[i]?"border-[#E94E3C] bg-red-50/60":"border-slate-200 bg-white"}`}><span className={`grid h-6 w-6 place-items-center rounded-md text-white text-xs font-bold shrink-0 ${timi[i]?"bg-[#E94E3C]":"bg-slate-300"}`}>{timi[i]?"✓":""}</span>{item}</button>))}</div></div>
        <div className="grid gap-3">
          <Result label="TIMI Score" value={`${timiScore} / 7`} note={`14-day composite risk ≈ ${timiRisk}`} color={timiScore>=5?"#E94E3C":timiScore>=3?"#D98E00":"#0E9A8B"}/>
          <div className="rounded-2xl bg-white border p-5 text-sm text-slate-600 space-y-2"><p><b className="text-[#0F2040]">Interpretation</b></p><p>• 0–2 Low • 3–4 Intermediate • 5–7 High risk</p><p>High score → early invasive strategy favoured. In practice Heart Team also weighs GRACE score, troponin trend, ECG & hemodynamics.</p><p className="text-xs text-slate-400">Educational tool — not a substitute for clinical judgement.</p></div>
        </div>
      </div>}
      <p className="text-center text-xs text-slate-400 flex items-center justify-center gap-1"><Calculator className="h-3.5 w-3.5"/> For education & posting practice. Always cross-check with cathlab hemodynamic system and operator.</p>
    </div>
  );
}
