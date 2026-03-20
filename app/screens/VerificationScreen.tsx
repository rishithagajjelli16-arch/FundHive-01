import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types';

type Nav   = NativeStackNavigationProp<RootStackParamList, 'Verification'>;
type Route = RouteProp<RootStackParamList, 'Verification'>;
interface Props { navigation: Nav; route: Route; }

// ── Validators ────────────────────────────────────────────────────────────────
// CIN: 1 letter + 5 digits + 2 letters + 4 digits + 3 letters + 6 digits = 21 chars
// e.g. U12345KA2026PTC123456
const CIN_REGEX   = /^[A-Z]{1}[0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/;
// DIN: exactly 8 digits
const DIN_REGEX   = /^[0-9]{8}$/;
// DPIIT: starts with DIPP followed by 4–8 digits, e.g. DIPP12345
const DPIIT_REGEX = /^DIPP\d{4,8}$/;

const FREE_DOMAINS = [
  'gmail.com', 'yahoo.com', 'yahoo.in', 'yahoo.co.uk',
  'hotmail.com', 'outlook.com', 'live.com',
  'protonmail.com', 'icloud.com', 'aol.com', 'rediffmail.com',
];

// LinkedIn, Crunchbase, AngelList / angel.co
const PORTFOLIO_REGEX =
  /^(https?:\/\/)?(www\.)?(linkedin\.com|crunchbase\.com|angel\.co|angellist\.com)\/.+/i;

function isProfessionalEmail(email: string): boolean {
  if (!email.includes('@')) return false;
  const domain = email.split('@')[1]?.toLowerCase() ?? '';
  return domain.length > 3 && domain.includes('.') && !FREE_DOMAINS.includes(domain);
}

// ── Role config ───────────────────────────────────────────────────────────────
const ROLE_META = {
  founder: {
    icon: '🚀', color: '#10B981',
    title: 'Startup Verification',
    sub: 'Verify your company to build trust with investors.',
  },
  investor: {
    icon: '💼', color: '#3B82F6',
    title: 'Investor Verification',
    sub: 'Verify your credentials to unlock startup deal flow.',
  },
  incubator: {
    icon: '🏢', color: '#8B5CF6',
    title: 'Incubator Verification',
    sub: 'Verify your institution to connect with promising startups.',
  },
};

// ── Sub-components ─────────────────────────────────────────────────────────────
function Field({
  label, hint, children,
}: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <View style={s.fieldGroup}>
      <Text style={s.label}>{label}</Text>
      {hint ? <Text style={s.fieldHint}>{hint}</Text> : null}
      {children}
    </View>
  );
}

function ErrText({ msg }: { msg?: string }) {
  return msg ? <Text style={s.errTxt}>{msg}</Text> : null;
}

function OkText({ show, msg }: { show: boolean; msg: string }) {
  return show ? <Text style={s.okTxt}>{msg}</Text> : null;
}

// ── Main Screen ────────────────────────────────────────────────────────────────
export default function VerificationScreen({ navigation, route }: Props) {
  const { role, fullName } = route.params;
  const meta      = ROLE_META[role as keyof typeof ROLE_META] ?? ROLE_META.founder;
  const firstName = fullName.split(' ')[0];

  // Founder state
  const [cin,        setCin]        = useState('');
  const [workEmail,  setWorkEmail]  = useState('');
  const [linkedinUrl,setLinkedinUrl]= useState('');

  // Investor state
  const [din,          setDin]          = useState('');
  const [portfolioLink,setPortfolioLink]= useState('');

  // Incubator state
  const [dpiit,     setDpiit]     = useState('');
  const [instEmail, setInstEmail] = useState('');

  const [errors,     setErrors]     = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const clr = (k: string) =>
    setErrors(prev => { const n = { ...prev }; delete n[k]; return n; });

  // ── Real-time validity ───────────────────────────────────────────────────────
  const cinOk       = CIN_REGEX.test(cin);
  const dinOk       = DIN_REGEX.test(din);
  const dpiitOk     = DPIIT_REGEX.test(dpiit.toUpperCase());
  const workOk      = isProfessionalEmail(workEmail);
  const instOk      = isProfessionalEmail(instEmail);
  const linkedinOk  = PORTFOLIO_REGEX.test(linkedinUrl);
  const portfolioOk = PORTFOLIO_REGEX.test(portfolioLink);

  const formValid = useMemo(() => {
    if (role === 'founder')   return cinOk && workOk && linkedinOk;
    if (role === 'investor')  return dinOk && portfolioOk;
    if (role === 'incubator') return dpiitOk && instOk;
    return false;
  }, [role, cinOk, workOk, linkedinOk, dinOk, portfolioOk, dpiitOk, instOk]);

  // ── Full validation (on submit) ──────────────────────────────────────────────
  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (role === 'founder') {
      if (!cinOk)
        e.cin = cin.length === 0
          ? 'CIN is required'
          : 'Invalid CIN format · e.g. U12345KA2026PTC123456';
      if (!workOk)
        e.workEmail = !workEmail.includes('@')
          ? 'Enter a valid work email'
          : 'Use your company email — Gmail / Yahoo not accepted';
      if (!linkedinOk)
        e.linkedin = linkedinUrl.length === 0
          ? 'LinkedIn profile URL is required'
          : 'Enter a valid LinkedIn or Crunchbase URL';
    }
    if (role === 'investor') {
      if (!dinOk)
        e.din = din.length === 0 ? 'DIN is required' : 'DIN must be exactly 8 digits';
      if (!portfolioOk)
        e.portfolio = portfolioLink.length === 0
          ? 'Portfolio link is required'
          : 'Enter a valid LinkedIn, Crunchbase, or AngelList URL';
    }
    if (role === 'incubator') {
      if (!dpiitOk)
        e.dpiit = dpiit.length === 0
          ? 'DPIIT number is required'
          : 'Invalid format · e.g. DIPP12345';
      if (!instOk)
        e.instEmail = !instEmail.includes('@')
          ? 'Enter your institutional email'
          : 'Use your institutional email — Gmail / Yahoo not accepted';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setSubmitting(true);
    // TODO: persist verification data to Supabase before navigating
    setTimeout(() => {
      setSubmitting(false);
      Alert.alert(
        '🎉 Verification Submitted!',
        "Your details are under review. You'll be notified once verified.",
        [{ text: 'Continue', onPress: () => navigation.navigate('Dashboard', { userName: fullName, role }) }],
      );
    }, 900);
  };

  return (
    <SafeAreaView style={s.safe} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />

      {/* ── Header ── */}
      <View style={s.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={s.backBtn}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Text style={s.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Verification</Text>
        <View style={{ width: 36 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          style={s.scroll}
          contentContainerStyle={s.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">

          {/* ── Hero card ── */}
          <View style={[s.heroCard, { borderColor: meta.color + '40' }]}>
            <View style={[s.heroBadgeBg, { backgroundColor: meta.color + '18' }]}>
              <Text style={s.heroIcon}>{meta.icon}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[s.heroTitle, { color: meta.color }]}>{meta.title}</Text>
              <Text style={s.heroSub}>{meta.sub}</Text>
            </View>
          </View>

          {/* ── Welcome copy ── */}
          <Text style={s.welcomeTxt}>Hey {firstName} 👋</Text>
          <Text style={s.welcomeDesc}>
            Just two quick details to keep FundHive scammer-free. Your data is
            encrypted and stays strictly within the platform.
          </Text>

          {/* ══ FOUNDER FIELDS ══════════════════════════════════════════════════ */}
          {role === 'founder' && (
            <>
              <Field
                label="Company Identification Number (CIN)"
                hint="21-character number issued by MCA · e.g. U12345KA2026PTC123456">
                <TextInput
                  style={[s.input, errors.cin ? s.inputErr : cinOk ? s.inputOk : null]}
                  placeholder="U12345KA2026PTC123456"
                  placeholderTextColor="#52525B"
                  value={cin}
                  maxLength={21}
                  autoCapitalize="characters"
                  autoCorrect={false}
                  onChangeText={t => { setCin(t.toUpperCase()); clr('cin'); }}
                />
                <View style={s.metaRow}>
                  {cinOk
                    ? <OkText show msg="✓ Valid CIN format" />
                    : <ErrText msg={errors.cin} />}
                  <Text style={s.charCount}>{cin.length}/21</Text>
                </View>
              </Field>

              <Field
                label="Work / Company Email"
                hint="Must be your company domain — Gmail or Yahoo are not accepted">
                <TextInput
                  style={[s.input, errors.workEmail ? s.inputErr : workOk ? s.inputOk : null]}
                  placeholder="name@yourcompany.com"
                  placeholderTextColor="#52525B"
                  value={workEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  onChangeText={t => { setWorkEmail(t.toLowerCase()); clr('workEmail'); }}
                />
                {workOk
                  ? <OkText show msg="✓ Professional email accepted" />
                  : <ErrText msg={errors.workEmail} />}
              </Field>

              <Field
                label="LinkedIn / Crunchbase Profile URL"
                hint="Your public professional profile">
                <TextInput
                  style={[s.input, errors.linkedin ? s.inputErr : linkedinOk ? s.inputOk : null]}
                  placeholder="https://linkedin.com/in/yourname"
                  placeholderTextColor="#52525B"
                  value={linkedinUrl}
                  keyboardType="url"
                  autoCapitalize="none"
                  autoCorrect={false}
                  onChangeText={t => { setLinkedinUrl(t.trim()); clr('linkedin'); }}
                />
                {linkedinOk
                  ? <OkText show msg="✓ Valid profile link" />
                  : <ErrText msg={errors.linkedin} />}
              </Field>
            </>
          )}

          {/* ══ INVESTOR FIELDS ═════════════════════════════════════════════════ */}
          {role === 'investor' && (
            <>
              <Field
                label="Director Identification Number (DIN)"
                hint="8-digit ID issued by MCA to Company Directors">
                <TextInput
                  style={[s.input, errors.din ? s.inputErr : dinOk ? s.inputOk : null]}
                  placeholder="12345678"
                  placeholderTextColor="#52525B"
                  value={din}
                  keyboardType="number-pad"
                  maxLength={8}
                  onChangeText={t => { setDin(t.replace(/\D/g, '')); clr('din'); }}
                />
                <View style={s.metaRow}>
                  {dinOk
                    ? <OkText show msg="✓ Valid DIN" />
                    : <ErrText msg={errors.din} />}
                  <Text style={s.charCount}>{din.length}/8</Text>
                </View>
              </Field>

              <Field
                label="Portfolio Link"
                hint="Your public investor profile — Crunchbase, AngelList, or LinkedIn">
                <TextInput
                  style={[s.input, errors.portfolio ? s.inputErr : portfolioOk ? s.inputOk : null]}
                  placeholder="https://crunchbase.com/person/yourname"
                  placeholderTextColor="#52525B"
                  value={portfolioLink}
                  keyboardType="url"
                  autoCapitalize="none"
                  autoCorrect={false}
                  onChangeText={t => { setPortfolioLink(t.trim()); clr('portfolio'); }}
                />
                {portfolioOk
                  ? <OkText show msg="✓ Valid portfolio link" />
                  : <ErrText msg={errors.portfolio} />}
                <Text style={s.acceptedChips}>Accepted: LinkedIn · Crunchbase · AngelList</Text>
              </Field>
            </>
          )}

          {/* ══ INCUBATOR FIELDS ════════════════════════════════════════════════ */}
          {role === 'incubator' && (
            <>
              <Field
                label="DPIIT Recognition Number"
                hint="Government ID for recognized incubators · e.g. DIPP12345">
                <TextInput
                  style={[s.input, errors.dpiit ? s.inputErr : dpiitOk ? s.inputOk : null]}
                  placeholder="DIPP12345"
                  placeholderTextColor="#52525B"
                  value={dpiit}
                  maxLength={14}
                  autoCapitalize="characters"
                  autoCorrect={false}
                  onChangeText={t => { setDpiit(t.toUpperCase()); clr('dpiit'); }}
                />
                {dpiitOk
                  ? <OkText show msg="✓ Valid DPIIT number" />
                  : <ErrText msg={errors.dpiit} />}
              </Field>

              <Field
                label="Official Institutional Email"
                hint="Must be your institution's domain — Gmail or Yahoo are not accepted">
                <TextInput
                  style={[s.input, errors.instEmail ? s.inputErr : instOk ? s.inputOk : null]}
                  placeholder="name@iit-incubator.org"
                  placeholderTextColor="#52525B"
                  value={instEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  onChangeText={t => { setInstEmail(t.toLowerCase()); clr('instEmail'); }}
                />
                {instOk
                  ? <OkText show msg="✓ Institutional email accepted" />
                  : <ErrText msg={errors.instEmail} />}
              </Field>
            </>
          )}

          {/* ── Selfie / Liveness check (Optional) ── */}
          <View style={s.selfieCard}>
            <View style={s.selfieHeaderRow}>
              <Text style={s.selfieTitle}>📸  Liveness Check</Text>
              <View style={s.optionalTag}>
                <Text style={s.optionalTxt}>Optional</Text>
              </View>
            </View>
            <Text style={s.selfieDesc}>
              Take a quick selfie to confirm you're a real person. It will be
              cross-referenced with your LinkedIn photo for identity matching.
            </Text>
            <TouchableOpacity
              style={s.selfieBtn}
              activeOpacity={0.8}
              onPress={() =>
                Alert.alert(
                  'Coming Soon',
                  'Selfie verification will be available in a future update.',
                )
              }>
              <Text style={s.selfieBtnIcon}>📷</Text>
              <Text style={s.selfieBtnTxt}>Take Selfie</Text>
            </TouchableOpacity>
          </View>

          {/* ── Security note ── */}
          <View style={s.securityRow}>
            <Text style={s.securityIcon}>🔒</Text>
            <Text style={s.securityTxt}>
              All verification data is encrypted and accessed only by the FundHive
              compliance team. It is never shared with third parties.
            </Text>
          </View>

          {/* ── Submit ── */}
          <TouchableOpacity
            style={[s.submitBtn, !formValid && s.submitDisabled]}
            onPress={handleSubmit}
            disabled={!formValid || submitting}
            activeOpacity={0.85}>
            <Text style={[s.submitTxt, !formValid && s.submitTxtDisabled]}>
              {submitting ? 'Submitting…' : 'Submit for Verification'}
            </Text>
          </TouchableOpacity>

          {!formValid && (
            <Text style={s.disabledNote}>
              Complete all required fields correctly to enable submission
            </Text>
          )}

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0A0A0A' },

  // Header
  header:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.07)' },
  backBtn:     { width: 36 },
  backArrow:   { color: '#FFFFFF', fontSize: 22 },
  headerTitle: { color: '#FFFFFF', fontSize: 17, fontWeight: '700', letterSpacing: 0.2 },

  // Scroll
  scroll:        { flex: 1 },
  scrollContent: { paddingHorizontal: 22, paddingTop: 24, paddingBottom: 60 },

  // Hero card
  heroCard:    { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: '#111111', borderRadius: 16, borderWidth: 1, padding: 16, marginBottom: 24 },
  heroBadgeBg: { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  heroIcon:    { fontSize: 26 },
  heroTitle:   { fontSize: 15, fontWeight: '700', marginBottom: 3 },
  heroSub:     { color: '#71717A', fontSize: 12, lineHeight: 17 },

  // Welcome copy
  welcomeTxt:  { color: '#FFFFFF', fontSize: 22, fontWeight: '700', marginBottom: 8 },
  welcomeDesc: { color: '#71717A', fontSize: 14, lineHeight: 21, marginBottom: 32 },

  // Fields
  fieldGroup: { marginBottom: 22 },
  label:      { color: '#A1A1AA', fontSize: 11, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 },
  fieldHint:  { color: '#52525B', fontSize: 11, marginBottom: 10, lineHeight: 16 },
  input:      { backgroundColor: '#111111', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', color: '#FFFFFF', fontSize: 15, paddingHorizontal: 16, height: 52 },
  inputErr:   { borderColor: '#EF4444' },
  inputOk:    { borderColor: '#10B981' },
  metaRow:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 },
  charCount:  { color: '#52525B', fontSize: 11 },
  errTxt:     { color: '#EF4444', fontSize: 12, marginTop: 6 },
  okTxt:      { color: '#10B981', fontSize: 12, marginTop: 6 },
  acceptedChips: { color: '#52525B', fontSize: 11, marginTop: 8 },

  // Selfie card
  selfieCard:      { backgroundColor: '#111111', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)', padding: 18, marginBottom: 18 },
  selfieHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  selfieTitle:     { color: '#FFFFFF', fontSize: 14, fontWeight: '700', flex: 1 },
  optionalTag:     { backgroundColor: 'rgba(113,113,122,0.2)', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  optionalTxt:     { color: '#71717A', fontSize: 11, fontWeight: '600' },
  selfieDesc:      { color: '#71717A', fontSize: 13, lineHeight: 19, marginBottom: 14 },
  selfieBtn:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', paddingVertical: 12 },
  selfieBtnIcon:   { fontSize: 16 },
  selfieBtnTxt:    { color: '#A1A1AA', fontSize: 14, fontWeight: '600' },

  // Security note
  securityRow:  { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 28 },
  securityIcon: { fontSize: 16 },
  securityTxt:  { flex: 1, color: '#3F3F46', fontSize: 11, lineHeight: 16 },

  // Submit
  submitBtn:         { backgroundColor: '#FFFFFF', borderRadius: 50, paddingVertical: 17, alignItems: 'center', shadowColor: '#FFFFFF', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 4 },
  submitDisabled:    { backgroundColor: '#1C1C1E', shadowOpacity: 0, elevation: 0 },
  submitTxt:         { color: '#0A0A0A', fontSize: 16, fontWeight: '700', letterSpacing: 0.2 },
  submitTxtDisabled: { color: '#3F3F46' },
  disabledNote:      { color: '#3F3F46', fontSize: 12, textAlign: 'center', marginTop: 12 },
});
