import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Pressable,
  StatusBar,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import DateTimePicker from '@react-native-community/datetimepicker';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Register'>;
interface Props { navigation: Nav; }

// ── Constants ──
const COUNTRY_CODES = [
  { code: 'IN', flag: '🇮🇳', name: 'India', dial: '+91' },
  { code: 'US', flag: '🇺🇸', name: 'United States', dial: '+1' },
  { code: 'GB', flag: '🇬🇧', name: 'United Kingdom', dial: '+44' },
  { code: 'AE', flag: '🇦🇪', name: 'UAE', dial: '+971' },
  { code: 'CA', flag: '🇨🇦', name: 'Canada', dial: '+1' },
  { code: 'AU', flag: '🇦🇺', name: 'Australia', dial: '+61' },
  { code: 'DE', flag: '🇩🇪', name: 'Germany', dial: '+49' },
  { code: 'FR', flag: '🇫🇷', name: 'France', dial: '+33' },
  { code: 'SG', flag: '🇸🇬', name: 'Singapore', dial: '+65' },
  { code: 'JP', flag: '🇯🇵', name: 'Japan', dial: '+81' },
  { code: 'CN', flag: '🇨🇳', name: 'China', dial: '+86' },
  { code: 'BR', flag: '🇧🇷', name: 'Brazil', dial: '+55' },
  { code: 'ZA', flag: '🇿🇦', name: 'South Africa', dial: '+27' },
  { code: 'NG', flag: '🇳🇬', name: 'Nigeria', dial: '+234' },
  { code: 'PK', flag: '🇵🇰', name: 'Pakistan', dial: '+92' },
  { code: 'NL', flag: '🇳🇱', name: 'Netherlands', dial: '+31' },
  { code: 'SE', flag: '🇸🇪', name: 'Sweden', dial: '+46' },
  { code: 'CH', flag: '🇨🇭', name: 'Switzerland', dial: '+41' },
  { code: 'KE', flag: '🇰🇪', name: 'Kenya', dial: '+254' },
  { code: 'MX', flag: '🇲🇽', name: 'Mexico', dial: '+52' },
];

const ROLES = [
  { id: 'founder',   label: 'Startup',   icon: '🚀', desc: 'Build & raise' },
  { id: 'investor',  label: 'Investor',  icon: '💼', desc: 'Fund startups' },
  { id: 'incubator', label: 'Incubator', icon: '🏢', desc: 'Nurture growth' },
];

const GENDERS = [
  { id: 'him',  label: 'Him'  },
  { id: 'her',  label: 'Her'  },
  { id: 'them', label: 'Them' },
];

const ALLOWED_DOMAINS = [
  'gmail.com', 'outlook.com', 'hotmail.com',
  'yahoo.com', 'yahoo.in', 'yahoo.co.uk',
];

// ── Helpers ──
function pwStrength(pw: string): { score: number; label: string; color: string } {
  if (!pw)          return { score: 0, label: '',          color: '#27272A' };
  if (pw.length < 6) return { score: 1, label: 'Too short', color: '#EF4444' };
  let s = 0;
  if (pw.length >= 8)           s++;
  if (/[A-Z]/.test(pw))         s++;
  if (/[0-9]/.test(pw))         s++;
  if (/[^A-Za-z0-9]/.test(pw))  s++;
  if (s <= 1) return { score: 2, label: 'Weak',   color: '#F59E0B' };
  if (s === 2) return { score: 3, label: 'Medium', color: '#3B82F6' };
  return              { score: 4, label: 'Strong', color: '#10B981' };
}

// ── Sub-components ──
function Field({ label, children }: { label: string | React.ReactNode; children: React.ReactNode }) {
  return (
    <View style={s.fieldGroup}>
      {typeof label === 'string'
        ? <Text style={s.label}>{label}</Text>
        : label}
      {children}
    </View>
  );
}

function ErrText({ msg }: { msg?: string }) {
  return msg ? <Text style={s.errTxt}>{msg}</Text> : null;
}

// ── Main Screen ──
export default function RegisterScreen({ navigation }: Props) {
  const [fullName,     setFullName]     = useState('');
  const [email,        setEmail]        = useState('');
  const [country,      setCountry]      = useState(COUNTRY_CODES[0]);
  const [phone,        setPhone]        = useState('');
  const [role,         setRole]         = useState('');
  const [gender,       setGender]       = useState('');
  const [dob,          setDob]          = useState<Date | null>(null);
  const [showDobPicker, setShowDobPicker] = useState(false);
  const [password,     setPassword]     = useState('');
  const [confirmPw,    setConfirmPw]    = useState('');
  const [showPw,       setShowPw]       = useState(false);
  const [showConfirm,  setShowConfirm]  = useState(false);
  const [termsAccepted,setTermsAccepted]= useState(false);
  const [countryModal, setCountryModal] = useState(false);
  const [errors,       setErrors]       = useState<Record<string, string>>({});

  const strength = pwStrength(password);

  const maxDob = new Date();
  maxDob.setFullYear(maxDob.getFullYear() - 11);

  const formatDob = (d: Date) =>
    d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  const clr = (key: string) =>
    setErrors(prev => { const n = { ...prev }; delete n[key]; return n; });

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!fullName.trim())        e.fullName  = 'Full name is required';
    if (!email.trim()) {
      e.email = 'Email is required';
    } else {
      const domain = email.split('@')[1]?.toLowerCase() ?? '';
      if (!ALLOWED_DOMAINS.includes(domain))
        e.email = 'Only Gmail, Outlook or Yahoo accepted';
    }
    if (!phone.trim() || phone.length < 7) e.phone = 'Enter a valid phone number';
    if (!role)           e.role     = 'Please select a role';
    if (!gender)         e.gender   = 'Please select your gender';
    if (!dob)            e.dob      = 'Date of birth is required';
    if (password.length < 6) e.password = 'Password must be at least 6 characters';
    if (password !== confirmPw) e.confirmPw = 'Passwords do not match';
    if (!termsAccepted)  e.terms    = 'You must accept the Terms & Conditions';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    navigation.navigate('Verification', { role, fullName });
  };

  return (
    <SafeAreaView style={s.safe} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />

      {/* ── Header ── */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Text style={s.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Create Account</Text>
        <View style={{ width: 36 }} />
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent}
          showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

          {/* ── Full Name ── */}
          <Field label="Full Name">
            <TextInput
              style={[s.input, errors.fullName ? s.inputErr : null]}
              placeholder="Enter your full name" placeholderTextColor="#52525B"
              value={fullName} maxLength={30} autoCapitalize="words"
              onChangeText={t => { setFullName(t); clr('fullName'); }}
            />
            <View style={s.metaRow}>
              <ErrText msg={errors.fullName} />
              <Text style={s.charCount}>{fullName.length}/30</Text>
            </View>
          </Field>

          {/* ── Email ── */}
          <Field label="Email Address">
            <TextInput
              style={[s.input, errors.email ? s.inputErr : null]}
              placeholder="you@gmail.com" placeholderTextColor="#52525B"
              value={email} keyboardType="email-address"
              autoCapitalize="none" autoCorrect={false}
              onChangeText={t => { setEmail(t.toLowerCase()); clr('email'); }}
            />
            <ErrText msg={errors.email} />
            <Text style={s.hint}>Accepted: Gmail · Outlook · Yahoo</Text>
          </Field>

          {/* ── Phone ── */}
          <Field label="Phone Number">
            <View style={[s.phoneRow, errors.phone ? s.inputErr : null]}>
              <TouchableOpacity style={s.countryBtn} onPress={() => setCountryModal(true)}>
                <Text style={s.flag}>{country.flag}</Text>
                <Text style={s.dialCode}>{country.dial}</Text>
                <Text style={s.chevron}>▾</Text>
              </TouchableOpacity>
              <View style={s.phoneDivider} />
              <TextInput
                style={s.phoneInput} placeholder="Enter number"
                placeholderTextColor="#52525B" value={phone}
                keyboardType="number-pad" maxLength={15}
                onChangeText={t => { setPhone(t.replace(/\D/g, '')); clr('phone'); }}
              />
            </View>
            <ErrText msg={errors.phone} />
          </Field>

          {/* ── Role ── */}
          <Field label="I am a...">
            <View style={s.roleRow}>
              {ROLES.map(r => (
                <TouchableOpacity key={r.id}
                  style={[s.roleCard, role === r.id && s.roleCardOn]}
                  onPress={() => { setRole(r.id); clr('role'); }} activeOpacity={0.8}>
                  <Text style={s.roleIcon}>{r.icon}</Text>
                  <Text style={[s.roleLabel, role === r.id && s.roleLabelOn]}>{r.label}</Text>
                  <Text style={s.roleDesc}>{r.desc}</Text>
                  {role === r.id && (
                    <View style={s.roleCheck}>
                      <Text style={s.roleCheckTxt}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
            <ErrText msg={errors.role} />
          </Field>

          {/* ── Gender ── */}
          <Field label="Gender">
            <View style={s.genderRow}>
              {GENDERS.map(g => (
                <TouchableOpacity key={g.id}
                  style={[s.genderPill, gender === g.id && s.genderPillOn]}
                  onPress={() => { setGender(g.id); clr('gender'); }} activeOpacity={0.8}>
                  <Text style={[s.genderTxt, gender === g.id && s.genderTxtOn]}>{g.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <ErrText msg={errors.gender} />
          </Field>

          {/* ── Date of Birth ── */}
          <Field label={
            <Text style={s.label}>
              Date of Birth{'  '}
              <Text style={s.labelNote}>Must be 11 or older</Text>
            </Text>
          }>
            <TouchableOpacity
              style={[s.input, s.dobBtn, errors.dob ? s.inputErr : null]}
              onPress={() => setShowDobPicker(true)}>
              <Text style={dob ? s.dobTxt : s.dobPlaceholder}>
                {dob ? formatDob(dob) : 'Select date of birth'}
              </Text>
              <Text style={s.dobIcon}>📅</Text>
            </TouchableOpacity>
            <ErrText msg={errors.dob} />
          </Field>

          {/* ── Password ── */}
          <Field label="Password">
            <View style={[s.pwRow, errors.password ? s.inputErr : null]}>
              <TextInput
                style={s.pwInput} placeholder="Minimum 6 characters"
                placeholderTextColor="#52525B" value={password}
                secureTextEntry={!showPw} autoCapitalize="none" autoCorrect={false}
                onChangeText={t => { setPassword(t); clr('password'); }}
              />
              <TouchableOpacity onPress={() => setShowPw(v => !v)} style={s.eyeBtn}>
                <Text style={s.eyeIcon}>{showPw ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>
            {password.length > 0 && (
              <View style={s.strengthWrap}>
                <View style={s.strengthBars}>
                  {[1, 2, 3, 4].map(i => (
                    <View key={i} style={[s.bar,
                      { backgroundColor: i <= strength.score ? strength.color : '#27272A' }]} />
                  ))}
                </View>
                <Text style={[s.strengthLbl, { color: strength.color }]}>{strength.label}</Text>
              </View>
            )}
            {password.length > 0 && strength.score < 4 && (
              <Text style={s.pwTip}>
                💡 Add uppercase letters, numbers & symbols for a stronger password
              </Text>
            )}
            <ErrText msg={errors.password} />
          </Field>

          {/* ── Confirm Password ── */}
          <Field label="Confirm Password">
            <View style={[s.pwRow, errors.confirmPw ? s.inputErr : null]}>
              <TextInput
                style={s.pwInput} placeholder="Re-enter your password"
                placeholderTextColor="#52525B" value={confirmPw}
                secureTextEntry={!showConfirm} autoCapitalize="none" autoCorrect={false}
                onChangeText={t => { setConfirmPw(t); clr('confirmPw'); }}
              />
              <TouchableOpacity onPress={() => setShowConfirm(v => !v)} style={s.eyeBtn}>
                <Text style={s.eyeIcon}>{showConfirm ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>
            {confirmPw.length > 0 && password === confirmPw && (
              <Text style={s.matchTxt}>✓ Passwords match</Text>
            )}
            <ErrText msg={errors.confirmPw} />
          </Field>

          {/* ── Terms ── */}
          <TouchableOpacity style={s.termsRow} activeOpacity={0.8}
            onPress={() => { setTermsAccepted(v => !v); clr('terms'); }}>
            <View style={[s.checkbox, termsAccepted && s.checkboxOn]}>
              {termsAccepted && <Text style={s.checkmark}>✓</Text>}
            </View>
            <Text style={s.termsTxt}>
              I agree to the{' '}
              <Text style={s.termsLink}>Terms of Service</Text>
              {' '}and{' '}
              <Text style={s.termsLink}>Privacy Policy</Text>
            </Text>
          </TouchableOpacity>
          <ErrText msg={errors.terms} />

          {/* ── Submit ── */}
          <TouchableOpacity style={s.submitBtn} onPress={handleSubmit} activeOpacity={0.88}>
            <Text style={s.submitTxt}>Create Account</Text>
          </TouchableOpacity>

          {/* ── Already have account ── */}
          <TouchableOpacity onPress={() => navigation.navigate('Login')} style={s.loginLink}>
            <Text style={s.loginLinkTxt}>
              Already have an account?{'  '}
              <Text style={s.loginLinkBold}>Log In</Text>
            </Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>

      {/* ── Country Code Modal ── */}
      <Modal visible={countryModal} transparent animationType="slide"
        onRequestClose={() => setCountryModal(false)}>
        <Pressable style={s.overlay} onPress={() => setCountryModal(false)}>
          <View style={s.countryModal}>
            <View style={s.countryModalHeader}>
              <Text style={s.countryModalTitle}>Select Country</Text>
              <TouchableOpacity onPress={() => setCountryModal(false)}>
                <Text style={s.countryModalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={COUNTRY_CODES}
              keyExtractor={item => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[s.countryItem, country.code === item.code && s.countryItemOn]}
                  onPress={() => { setCountry(item); setCountryModal(false); }}>
                  <Text style={s.countryFlag}>{item.flag}</Text>
                  <Text style={s.countryName}>{item.name}</Text>
                  <Text style={s.countryDial}>{item.dial}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </Pressable>
      </Modal>

      {/* ── Date of Birth Picker — iOS Modal ── */}
      {Platform.OS === 'ios' && (
        <Modal visible={showDobPicker} transparent animationType="slide"
          onRequestClose={() => setShowDobPicker(false)}>
          <Pressable style={s.overlay} onPress={() => setShowDobPicker(false)}>
            <View style={s.dobModal}>
              <View style={s.dobModalHeader}>
                <TouchableOpacity onPress={() => setShowDobPicker(false)}>
                  <Text style={s.dobCancel}>Cancel</Text>
                </TouchableOpacity>
                <Text style={s.dobModalTitle}>Date of Birth</Text>
                <TouchableOpacity onPress={() => setShowDobPicker(false)}>
                  <Text style={s.dobDone}>Done</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={dob || maxDob}
                mode="date"
                display="spinner"
                maximumDate={maxDob}
                minimumDate={new Date(1900, 0, 1)}
                onChange={(_, date) => { if (date) { setDob(date); clr('dob'); } }}
                themeVariant="dark"
                style={{ backgroundColor: '#111111' }}
              />
            </View>
          </Pressable>
        </Modal>
      )}

      {/* ── Date of Birth Picker — Android ── */}
      {Platform.OS === 'android' && showDobPicker && (
        <DateTimePicker
          value={dob || maxDob}
          mode="date"
          display="default"
          maximumDate={maxDob}
          minimumDate={new Date(1900, 0, 1)}
          onChange={(_, date) => {
            setShowDobPicker(false);
            if (date) { setDob(date); clr('dob'); }
          }}
        />
      )}

    </SafeAreaView>
  );
}

// ── Styles ──
const s = StyleSheet.create({
  safe:         { flex: 1, backgroundColor: '#0A0A0A' },

  // Header
  header:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.07)' },
  backBtn:      { width: 36 },
  backArrow:    { color: '#FFFFFF', fontSize: 22 },
  headerTitle:  { color: '#FFFFFF', fontSize: 17, fontWeight: '700', letterSpacing: 0.2 },

  // Scroll
  scroll:        { flex: 1 },
  scrollContent: { paddingHorizontal: 22, paddingTop: 24, paddingBottom: 60 },

  // Field
  fieldGroup:  { marginBottom: 22 },
  label:       { color: '#A1A1AA', fontSize: 11, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 },
  labelNote:   { color: '#52525B', textTransform: 'none', fontWeight: '400', fontSize: 11, letterSpacing: 0 },
  input:       { backgroundColor: '#111111', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', color: '#FFFFFF', fontSize: 15, paddingHorizontal: 16, height: 52 },
  inputErr:    { borderColor: '#EF4444' },
  metaRow:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 },
  charCount:   { color: '#52525B', fontSize: 11 },
  errTxt:      { color: '#EF4444', fontSize: 12, marginTop: 6 },
  hint:        { color: '#52525B', fontSize: 11, marginTop: 6 },

  // Phone
  phoneRow:    { flexDirection: 'row', alignItems: 'center', backgroundColor: '#111111', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', height: 52, overflow: 'hidden' },
  countryBtn:  { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, height: '100%', gap: 5 },
  flag:        { fontSize: 20 },
  dialCode:    { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
  chevron:     { color: '#71717A', fontSize: 10 },
  phoneDivider:{ width: 1, height: 28, backgroundColor: 'rgba(255,255,255,0.08)' },
  phoneInput:  { flex: 1, color: '#FFFFFF', fontSize: 15, paddingHorizontal: 14 },

  // Role
  roleRow:     { flexDirection: 'row', gap: 10 },
  roleCard:    { flex: 1, backgroundColor: '#111111', borderRadius: 14, padding: 14, alignItems: 'center', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.07)', position: 'relative' },
  roleCardOn:  { borderColor: '#10B981', backgroundColor: 'rgba(16,185,129,0.07)' },
  roleIcon:    { fontSize: 22, marginBottom: 6 },
  roleLabel:   { color: '#A1A1AA', fontSize: 13, fontWeight: '700' },
  roleLabelOn: { color: '#10B981' },
  roleDesc:    { color: '#52525B', fontSize: 10, marginTop: 3, textAlign: 'center' },
  roleCheck:   { position: 'absolute', top: 8, right: 8, width: 16, height: 16, borderRadius: 8, backgroundColor: '#10B981', alignItems: 'center', justifyContent: 'center' },
  roleCheckTxt:{ color: '#000', fontSize: 9, fontWeight: '900' },

  // Gender
  genderRow:    { flexDirection: 'row', gap: 10 },
  genderPill:   { flex: 1, height: 46, borderRadius: 12, backgroundColor: '#111111', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.07)', alignItems: 'center', justifyContent: 'center' },
  genderPillOn: { borderColor: '#10B981', backgroundColor: 'rgba(16,185,129,0.07)' },
  genderTxt:    { color: '#A1A1AA', fontSize: 14, fontWeight: '600' },
  genderTxtOn:  { color: '#10B981' },

  // DOB
  dobBtn:         { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 0 },
  dobTxt:         { color: '#FFFFFF', fontSize: 15 },
  dobPlaceholder: { color: '#52525B', fontSize: 15 },
  dobIcon:        { fontSize: 16 },
  dobModal:       { backgroundColor: '#111111', borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  dobModalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.07)' },
  dobModalTitle:  { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  dobCancel:      { color: '#71717A', fontSize: 15 },
  dobDone:        { color: '#10B981', fontSize: 15, fontWeight: '700' },

  // Password
  pwRow:       { flexDirection: 'row', alignItems: 'center', backgroundColor: '#111111', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', height: 52, overflow: 'hidden' },
  pwInput:     { flex: 1, color: '#FFFFFF', fontSize: 15, paddingHorizontal: 16 },
  eyeBtn:      { paddingHorizontal: 14, height: '100%', alignItems: 'center', justifyContent: 'center' },
  eyeIcon:     { fontSize: 18 },
  strengthWrap:{ flexDirection: 'row', alignItems: 'center', marginTop: 10, gap: 10 },
  strengthBars:{ flexDirection: 'row', gap: 4, flex: 1 },
  bar:         { flex: 1, height: 3, borderRadius: 2 },
  strengthLbl: { fontSize: 11, fontWeight: '700', width: 54, textAlign: 'right' },
  pwTip:       { color: '#71717A', fontSize: 11, marginTop: 6, lineHeight: 16 },
  matchTxt:    { color: '#10B981', fontSize: 12, marginTop: 6 },

  // Terms
  termsRow:   { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 6 },
  checkbox:   { width: 20, height: 20, borderRadius: 5, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  checkboxOn: { backgroundColor: '#10B981', borderColor: '#10B981' },
  checkmark:  { color: '#000', fontSize: 11, fontWeight: '900' },
  termsTxt:   { flex: 1, color: '#A1A1AA', fontSize: 13, lineHeight: 20 },
  termsLink:  { color: '#10B981', fontWeight: '600', textDecorationLine: 'underline' },

  // Submit
  submitBtn:     { backgroundColor: '#FFFFFF', borderRadius: 50, paddingVertical: 17, alignItems: 'center', marginTop: 26, shadowColor: '#FFFFFF', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 4 },
  submitTxt:     { color: '#0A0A0A', fontSize: 16, fontWeight: '700', letterSpacing: 0.2 },
  loginLink:     { alignItems: 'center', marginTop: 20, paddingBottom: 10 },
  loginLinkTxt:  { color: '#71717A', fontSize: 14 },
  loginLinkBold: { color: '#10B981', fontWeight: '700' },

  // Modals
  overlay:          { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  countryModal:     { backgroundColor: '#111111', borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '70%' },
  countryModalHeader:{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 18, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.07)' },
  countryModalTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  countryModalClose: { color: '#71717A', fontSize: 18, padding: 4 },
  countryItem:      { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 18, gap: 12 },
  countryItemOn:    { backgroundColor: 'rgba(16,185,129,0.07)' },
  countryFlag:      { fontSize: 22 },
  countryName:      { flex: 1, color: '#FFFFFF', fontSize: 15 },
  countryDial:      { color: '#10B981', fontSize: 14, fontWeight: '700' },
});
