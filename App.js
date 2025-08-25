
import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, View, Text, TextInput, Pressable, ScrollView, StyleSheet } from 'react-native';

/**
 * NyayInfra — Expo RN Demo (no backend)
 * - Governance-first legal infrastructure UX for Android
 * - Mirrors the web MVP: intake, matching, escrow (mock), knowledge hub, SME plans, governance
 * Build APK:
 *   1) npm i -g expo-cli (if needed)
 *   2) npm install
 *   3) npx expo run:android   (Android Studio + SDK required)  -> debug APK
 *   or use EAS Build for a release APK/AAB.
 */

const FEE_BANDS = [
  { id: 'basic-consult', label: 'Basic Consultation', min: 499, max: 1499, slaDays: 2 },
  { id: 'doc-review', label: 'Document Review (<=10 pages)', min: 1999, max: 4999, slaDays: 3 },
  { id: 'contract-draft', label: 'Contract Draft (standard)', min: 4999, max: 11999, slaDays: 5 },
  { id: 'startup-pack', label: 'Startup Compliance Pack (monthly)', min: 4999, max: 19999, slaDays: 30 },
  { id: 'district-lit', label: 'District Court Filing (non-complex)', min: 15000, max: 40000, slaDays: 14 },
];

const AREAS = [
  'Family Law','Property / RERA','Consumer Dispute','Criminal','Civil','Company / Startup','IP / Trademark','Employment / Labour'
];

const MOCK_LAWYERS = [
  { id: 'L-1001', name: 'Aarav Menon', years: 5, barEnrollment: 'KAR/2019/12345', city: 'Bengaluru',
    areas: ['Company / Startup','Contract','IP / Trademark'], rating: 4.7, verified: true, firstGen: true,
    feePrefs: { 'basic-consult': 999, 'contract-draft': 7499, 'startup-pack': 9999 } },
  { id: 'L-1002', name: 'Nituparna Ghosh', years: 7, barEnrollment: 'WB/2017/88770', city: 'Kolkata',
    areas: ['Family Law','Property / RERA','Civil'], rating: 4.6, verified: true, firstGen: false,
    feePrefs: { 'basic-consult': 799, 'doc-review': 2999, 'district-lit': 25000 } },
  { id: 'L-1003', name: 'Raghav Kapoor', years: 2, barEnrollment: 'DEL/2023/55661', city: 'Delhi',
    areas: ['Consumer Dispute','Civil'], rating: 4.3, verified: true, firstGen: true,
    feePrefs: { 'basic-consult': 499, 'doc-review': 2499, 'district-lit': 18000 } },
  { id: 'L-1004', name: 'Aisha Khan', years: 10, barEnrollment: 'MH/2014/33221', city: 'Mumbai',
    areas: ['IP / Trademark','Company / Startup','Employment / Labour'], rating: 4.8, verified: true, firstGen: false,
    feePrefs: { 'basic-consult': 1299, 'contract-draft': 10999, 'startup-pack': 15999 } },
];

const Tab = ({ label, active, onPress }) => (
  <Pressable onPress={onPress} style={[styles.tab, active && styles.tabActive]}>
    <Text style={[styles.tabText, active && styles.tabTextActive]}>{label}</Text>
  </Pressable>
);

const Badge = ({ children }) => (
  <View style={styles.badge}><Text style={styles.badgeText}>{children}</Text></View>
);

export default function App() {
  const [view, setView] = useState('home');
  return (
    <SafeAreaView style={{ flex:1 }}>
      <View style={styles.header}>
        <Text style={styles.brand}>NyayInfra</Text>
        <Badge>Alpha Demo</Badge>
      </View>

      <View style={styles.nav}>
        {['home','intake','match','escrow','knowledge','sme','gov'].map(v => (
          <Tab key={v} label={labelFor(v)} active={view===v} onPress={()=>setView(v)} />
        ))}
      </View>

      <ScrollView contentContainerStyle={{ padding:16 }}>
        {view==='home' && <Home onGetStarted={()=>setView('intake')} />}
        {view==='intake' && <ClientIntake />}
        {view==='match' && <QuickMatch />}
        {view==='escrow' && <EscrowDrafts />}
        {view==='knowledge' && <KnowledgeHub />}
        {view==='sme' && <SMEPlans />}
        {view==='gov' && <Governance />}
      </ScrollView>

      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

function labelFor(v){
  return ({
    home: 'Home', intake: 'Client Intake', match: 'Match', escrow: 'Escrow',
    knowledge: 'Knowledge', sme: 'SME Packs', gov: 'Governance'
  })[v];
}

function Home({ onGetStarted }){
  return (
    <View>
      <Text style={styles.h1}>Legal Infrastructure, not a directory.</Text>
      <Text style={styles.p}>
        Escrow-backed engagements, transparent fee bands, and merit-first discovery. Built to be compliant with Indian norms.
      </Text>
      <Pressable style={styles.primaryBtn} onPress={onGetStarted}><Text style={styles.btnText}>I need legal help</Text></Pressable>
    </View>
  );
}

function Field({ label, children }){
  return (<View style={{ marginBottom:12 }}><Text style={styles.label}>{label}</Text>{children}</View>);
}

function TextBox(props){ return <TextInput {...props} style={[styles.input, props.style]} placeholderTextColor="#999" />; }

function ClientIntake(){
  const [city, setCity] = useState('');
  const [area, setArea] = useState(AREAS[0]);
  const [feeId, setFeeId] = useState(FEE_BANDS[0].id);
  const [desc, setDesc] = useState('');

  return (
    <View style={styles.card}>
      <Text style={styles.h2}>Client Intake</Text>
      <Field label="City"><TextBox value={city} onChangeText={setCity} placeholder="e.g., Delhi" /></Field>
      <Field label="Area of Law"><TextBox value={area} onChangeText={setArea} placeholder="Select area" /></Field>
      <Field label="Fee Band (code)"><TextBox value={feeId} onChangeText={setFeeId} placeholder="basic-consult / doc-review / ..." /></Field>
      <Field label="Describe your requirement">
        <TextInput multiline numberOfLines={6} value={desc} onChangeText={setDesc} placeholder="Tell us what you need in plain English." style={[styles.input,{height:120,textAlignVertical:'top'}]} placeholderTextColor="#999" />
      </Field>
      <Pressable style={styles.secondaryBtn} onPress={()=>alert('Intake submitted (demo). Now try Match tab.')}>
        <Text style={styles.btnTextDark}>Submit</Text>
      </Pressable>
    </View>
  );
}

function QuickMatch(){
  const [city, setCity] = useState('');
  const [area, setArea] = useState(AREAS[0]);
  const [fee, setFee] = useState(FEE_BANDS[0].id);
  const [results, setResults] = useState([]);

  const doSearch = () => {
    const band = FEE_BANDS.find(b=>b.id===fee);
    const matched = MOCK_LAWYERS.filter(l =>
      (!city || l.city.toLowerCase().includes(city.toLowerCase())) &&
      l.areas.join(' ').includes(area.split(' ')[0]) &&
      l.feePrefs[fee] >= band.min && l.feePrefs[fee] <= band.max
    ).sort((a,b)=> (b.rating - a.rating) + (a.firstGen?0.05:0) - (b.firstGen?0.05:0));
    setResults(matched);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.h2}>Quick Match</Text>
      <Field label="City"><TextBox value={city} onChangeText={setCity} placeholder="optional" /></Field>
      <Field label="Area of Law"><TextBox value={area} onChangeText={setArea} /></Field>
      <Field label="Fee Band (code)"><TextBox value={fee} onChangeText={setFee} /></Field>
      <Pressable style={styles.primaryBtn} onPress={doSearch}><Text style={styles.btnText}>Find Matches</Text></Pressable>
      {results.map(l => <LawyerCard key={l.id} lawyer={l} feeId={fee} />)}
    </View>
  );
}

function Row({ children, style }){ return <View style={[{ flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginTop:8 }, style]}>{children}</View>; }

function LawyerCard({ lawyer, feeId }){
  const band = FEE_BANDS.find(b=>b.id===feeId);
  return (
    <View style={styles.item}>
      <Row><Text style={styles.itemTitle}>{lawyer.name}</Text><Text>⭐ {lawyer.rating}</Text></Row>
      <Text style={styles.muted}>{lawyer.city} • {lawyer.years} yrs • Bar: {lawyer.barEnrollment}</Text>
      <Text style={styles.muted}>Areas: {lawyer.areas.join(', ')}</Text>
      <Row><Text>Fee: ₹{lawyer.feePrefs[feeId]} (band ₹{band.min}–{band.max})</Text>
        <Pressable style={styles.secondaryBtn} onPress={()=>startEscrowDraft(lawyer, feeId)}><Text style={styles.btnTextDark}>Start Escrow Draft</Text></Pressable>
      </Row>
    </View>
  );
}

let ESCROW_DRAFTS = [];
function startEscrowDraft(lawyer, feeId){
  const band = FEE_BANDS.find(b=>b.id===feeId);
  const draft = {
    id: `E-${Date.now()}`,
    lawyerId: lawyer.id,
    lawyerName: lawyer.name,
    feeId, feeQuoted: lawyer.feePrefs[feeId],
    bandMin: band.min, bandMax: band.max,
    milestones: [
      { id: 1, label: 'Engagement + Intake', amount: Math.round(lawyer.feePrefs[feeId]*0.2), status: 'pending' },
      { id: 2, label: 'Draft/Prepare/Review', amount: Math.round(lawyer.feePrefs[feeId]*0.5), status: 'pending' },
      { id: 3, label: 'Delivery + Filing', amount: lawyer.feePrefs[feeId] - Math.round(lawyer.feePrefs[feeId]*0.7), status: 'pending' },
    ]
  };
  ESCROW_DRAFTS = [draft, ...ESCROW_DRAFTS];
  alert(`Escrow draft created: ${draft.id}`);
}

function EscrowDrafts(){
  const [drafts, setDrafts] = useState(ESCROW_DRAFTS);
  const toggle = (id, mid) => {
    const next = drafts.map(d => d.id===id ? { ...d, milestones: d.milestones.map(m => m.id===mid ? { ...m, status: m.status==='paid'?'pending':'paid' } : m) } : d);
    ESCROW_DRAFTS = next; setDrafts(next);
  };
  return (
    <View style={styles.card}>
      <Text style={styles.h2}>Escrow (Mock)</Text>
      {drafts.length===0 && <Text style={styles.muted}>No drafts yet. Create one from the Match tab.</Text>}
      {drafts.map(d => (
        <View key={d.id} style={styles.item}>
          <Text style={styles.itemTitle}>{d.id} • {d.lawyerName}</Text>
          <Text style={styles.muted}>Band: ₹{d.bandMin}–{d.bandMax} • Quoted: ₹{d.feeQuoted}</Text>
          {d.milestones.map(m => (
            <Row key={m.id}>
              <View><Text>{m.label}</Text><Text style={styles.muted}>₹{m.amount}</Text></View>
              <Pressable style={styles.secondaryBtn} onPress={()=>toggle(d.id, m.id)}><Text style={styles.btnTextDark}>Mark {m.status==='paid'?'Unpaid':'Paid'}</Text></Pressable>
            </Row>
          ))}
        </View>
      ))}
    </View>
  );
}

function KnowledgeHub(){
  const items = [
    { id:'C-1', title:'How District Court Filings Work (Plain English)', author:'Aarav Menon', area:'Civil' },
    { id:'C-2', title:'Startup Compliance Checklist – ROC, GST, Labour', author:'Aisha Khan', area:'Company / Startup' },
    { id:'C-3', title:'Protecting Your Brand: Trademark Basics in India', author:'Aisha Khan', area:'IP / Trademark' },
    { id:'C-4', title:'When to Litigate vs. Mediate in Family Matters', author:'Nituparna Ghosh', area:'Family Law' },
  ];
  return (
    <View style={styles.card}>
      <Text style={styles.h2}>Knowledge Hub</Text>
      {items.map(c => (
        <View key={c.id} style={styles.item}>
          <Text style={styles.itemTitle}>{c.title}</Text>
          <Text style={styles.muted}>By {c.author} • {c.area}</Text>
          <Pressable style={styles.secondaryBtn} onPress={()=>alert('Demo article')}><Text style={styles.btnTextDark}>Read</Text></Pressable>
        </View>
      ))}
    </View>
  );
}

function SMEPlans(){
  const plans = [
    { id:'basic', name:'Starter', price:4999, features:['2 contracts / month','Compliance reminders','48h SLA'] },
    { id:'growth', name:'Growth', price:14999, features:['Unlimited contracts','Monthly legal audit','Dedicated counsel window'] },
    { id:'premium', name:'Premium', price:39999, features:['Dedicated counsel','Dispute management','Quarterly board review'] },
  ];
  return (
    <View style={styles.card}>
      <Text style={styles.h2}>SME / Startup Packs</Text>
      {plans.map(p => (
        <View key={p.id} style={styles.item}>
          <Text style={styles.itemTitle}>{p.name} — ₹{p.price}/mo</Text>
          {p.features.map(f => <Text key={f} style={styles.muted}>• {f}</Text>)}
          <Pressable style={styles.primaryBtn} onPress={()=>alert(`Selected ${p.name} (demo)`) }><Text style={styles.btnText}>Choose {p.name}</Text></Pressable>
        </View>
      ))}
    </View>
  );
}

function Governance(){
  const rules = [
    ['Fee Bands, not Ads','Standard bands by case-type; lawyers quote within bands.'],
    ['Escrow & Milestones','Payment held until deliverables are confirmed.'],
    ['Merit Discovery','Ranking by outcomes, timeliness, reviews; boost for first-gen lawyers.'],
    ['Compliance-first','Profiles = credentials + practice areas; avoid ad-like testimonials.'],
    ['Privacy by Design','Minimal data; encrypted comms in production.'],
    ['Dispute Redressal','Mediation desk; structured refunds if SLA breached.'],
  ];
  return (
    <View style={styles.card}>
      <Text style={styles.h2}>Governance Principles</Text>
      {rules.map(([t,s])=> (
        <View key={t} style={{ marginVertical:6 }}>
          <Text style={{ fontWeight:'600' }}>{t}</Text>
          <Text style={styles.muted}>{s}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  header:{ flexDirection:'row', alignItems:'center', justifyContent:'space-between', padding:16, borderBottomWidth:1, borderColor:'#eee' },
  brand:{ fontSize:20, fontWeight:'700' },
  nav:{ flexDirection:'row', flexWrap:'wrap', paddingHorizontal:8, paddingBottom:8, borderBottomWidth:1, borderColor:'#eee' },
  tab:{ paddingVertical:8, paddingHorizontal:12, margin:4, borderRadius:16, backgroundColor:'#f2f2f2' },
  tabActive:{ backgroundColor:'#111' },
  tabText:{ color:'#111' },
  tabTextActive:{ color:'#fff' },
  h1:{ fontSize:24, fontWeight:'800', marginBottom:8 },
  h2:{ fontSize:18, fontWeight:'700', marginBottom:8 },
  p:{ fontSize:14, color:'#333', marginBottom:12 },
  label:{ fontSize:12, color:'#555', marginBottom:6 },
  input:{ borderWidth:1, borderColor:'#ddd', borderRadius:10, padding:10, color:'#111' },
  primaryBtn:{ backgroundColor:'#111', paddingVertical:10, paddingHorizontal:16, borderRadius:12, alignSelf:'flex-start', marginTop:8 },
  secondaryBtn:{ backgroundColor:'#eee', paddingVertical:8, paddingHorizontal:12, borderRadius:12, alignSelf:'flex-start', marginTop:8 },
  btnText:{ color:'#fff', fontWeight:'700' },
  btnTextDark:{ color:'#111', fontWeight:'700' },
  badge:{ backgroundColor:'#f1f1f1', paddingHorizontal:10, paddingVertical:4, borderRadius:999 },
  badgeText:{ fontSize:12, color:'#333' },
  card:{ backgroundColor:'#fff', borderRadius:14, padding:12, borderWidth:1, borderColor:'#eee', marginBottom:12 },
  item:{ backgroundColor:'#fafafa', borderRadius:12, padding:12, marginTop:8, borderWidth:1, borderColor:'#eee' },
  itemTitle:{ fontWeight:'700', marginBottom:4 },
  muted:{ color:'#666' }
});
