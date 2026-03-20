import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Modal,
  Pressable,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Login'>;
interface Props { navigation: Nav; }

const ALLOWED_DOMAINS = ['gmail.com', 'outlook.com', 'hotmail.com', 'yahoo.com', 'yahoo.in', 'yahoo.co.uk'];

function isValidIdentifier(val: string): boolean {
  // Phone — digits only, 7-15 chars
  if (/^\d{7,15}$/.test(val)) return true;
  // Email — allowed domains
  const domain = val.split('@')[1]?.toLowerCase() ?? '';
  return ALLOWED_DOMAINS.includes(domain);
}

export default function LoginScreen({ navigation }: Props) {
  const [identifier,    setIdentifier]    = useState('');
  const [password,      setPassword]      = useState('');
  const [showPw,        setShowPw]        = useState(false);
  const [errors,        setErrors]        = useState<Record<string, string>>({});
  const [forgotModal,   setForgotModal]   = useState(false);
  const [resetEmail,    setResetEmail]    = useState('');
  const [resetSent,     setResetSent]     = useState(false);

  const clr = (key: string) =>
    setErrors(prev => { const n = { ...prev }; delete n[key]; return n; });

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!identifier.trim())
      e.identifier = 'Enter your email or phone number';
    else if (!isValidIdentifier(identifier.trim()))
      e.identifier = 'Enter a valid email (Gmail/Outlook/Yahoo) or phone number';
    if (!password)
      e.password = 'Password is required';
    else if (password.length < 6)
      e.password = 'Password must be at least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const ADMIN_EMAIL    = 'admin@fundhive.com';
  const ADMIN_PASSWORD = 'Admin@123';

  const handleLogin = () => {
    // ── Admin quick-access bypass ──
    if (
      identifier.trim().toLowerCase() === ADMIN_EMAIL &&
      password === ADMIN_PASSWORD
    ) {
      navigation.navigate('Dashboard', { userName: 'Admin', role: 'founder' });
      return;
    }
    if (!validate()) return;
    Alert.alert('Logging in…', 'Supabase auth will be wired here.');
  };

  const handleAdminLogin = () => {
    navigation.navigate('Dashboard', { userName: 'Admin', role: 'founder' });
  };

  const handleForgotSubmit = () => {
    const domain = resetEmail.split('@')[1]?.toLowerCase() ?? '';
    if (!resetEmail.trim() || !ALLOWED_DOMAINS.includes(domain)) {
      Alert.alert('Invalid email', 'Enter a valid Gmail, Outlook or Yahoo address.');
      return;
    }
    setResetSent(true);
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
        <Text style={s.headerTitle}>Log In</Text>
        <View style={{ width: 36 }} />
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>

          {/* ── Logo + Greeting ── */}
          <View style={s.greetingSection}>
            <Image
              source={require('../../assets/images/logo.png')}
              style={s.logo}
              resizeMode="contain"
            />
            <Text style={s.greeting}>Welcome back</Text>
            <Text style={s.subGreeting}>Sign in to continue building the future.</Text>
          </View>

          {/* ── Email / Phone ── */}
          <View style={s.fieldGroup}>
            <Text style={s.label}>Email or Phone Number</Text>
            <TextInput
              style={[s.input, errors.identifier ? s.inputErr : null]}
              placeholder="you@gmail.com or +91 98765 43210"
              placeholderTextColor="#52525B"
              value={identifier}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              onChangeText={t => { setIdentifier(t.toLowerCase().trim()); clr('identifier'); }}
            />
            {errors.identifier ? <Text style={s.errTxt}>{errors.identifier}</Text> : null}
          </View>

          {/* ── Password ── */}
          <View style={s.fieldGroup}>
            <View style={s.labelRow}>
              <Text style={s.label}>Password</Text>
              <TouchableOpacity onPress={() => setForgotModal(true)}>
                <Text style={s.forgotLink}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>
            <View style={[s.pwRow, errors.password ? s.inputErr : null]}>
              <TextInput
                style={s.pwInput}
                placeholder="Enter your password"
                placeholderTextColor="#52525B"
                value={password}
                secureTextEntry={!showPw}
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={t => { setPassword(t); clr('password'); }}
              />
              <TouchableOpacity onPress={() => setShowPw(v => !v)} style={s.eyeBtn}>
                <Text style={s.eyeIcon}>{showPw ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>
            {errors.password ? <Text style={s.errTxt}>{errors.password}</Text> : null}
          </View>

          {/* ── Login Button ── */}
          <TouchableOpacity style={s.loginBtn} onPress={handleLogin} activeOpacity={0.88}>
            <Text style={s.loginBtnTxt}>Log In</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Register')} style={s.signupNudge}>
            <Text style={s.signupNudgeTxt}>
              Don't have an account?{'  '}
              <Text style={s.signupNudgeBold}>Sign Up</Text>
            </Text>
          </TouchableOpacity>

          {/* ── Admin Preview Card ── */}
          <View style={s.adminCard}>
            <View style={s.adminCardHeader}>
              <Text style={s.adminCardIcon}>🛡️</Text>
              <Text style={s.adminCardTitle}>Admin Preview</Text>
            </View>
            <Text style={s.adminCardDesc}>
              Quick-access credentials to preview the full app UI
            </Text>
            <View style={s.adminCredRow}>
              <Text style={s.adminCredLabel}>Email</Text>
              <Text style={s.adminCredValue}>admin@fundhive.com</Text>
            </View>
            <View style={s.adminCredRow}>
              <Text style={s.adminCredLabel}>Password</Text>
              <Text style={s.adminCredValue}>Admin@123</Text>
            </View>
            <TouchableOpacity style={s.adminBtn} onPress={handleAdminLogin} activeOpacity={0.85}>
              <Text style={s.adminBtnTxt}>⚡  Enter as Admin</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>

      {/* ── Forgot Password Modal ── */}
      <Modal visible={forgotModal} transparent animationType="slide"
        onRequestClose={() => { setForgotModal(false); setResetSent(false); setResetEmail(''); }}>
        <Pressable style={s.overlay}
          onPress={() => { setForgotModal(false); setResetSent(false); setResetEmail(''); }}>
          <View style={s.forgotModal}>
            {!resetSent ? (
              <>
                <Text style={s.forgotTitle}>Reset Password</Text>
                <Text style={s.forgotSub}>
                  Enter the email address linked to your account and we'll send you a reset link.
                </Text>
                <TextInput
                  style={[s.input, { marginTop: 20 }]}
                  placeholder="you@gmail.com"
                  placeholderTextColor="#52525B"
                  value={resetEmail}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  onChangeText={setResetEmail}
                />
                <TouchableOpacity style={s.resetBtn} onPress={handleForgotSubmit} activeOpacity={0.88}>
                  <Text style={s.resetBtnTxt}>Send Reset Link</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setForgotModal(false); setResetEmail(''); }}
                  style={s.cancelBtn}>
                  <Text style={s.cancelBtnTxt}>Cancel</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={s.sentIcon}>📩</Text>
                <Text style={s.forgotTitle}>Check your inbox</Text>
                <Text style={s.forgotSub}>
                  A password reset link has been sent to{'\n'}
                  <Text style={{ color: '#10B981', fontWeight: '600' }}>{resetEmail}</Text>
                </Text>
                <TouchableOpacity style={s.resetBtn}
                  onPress={() => { setForgotModal(false); setResetSent(false); setResetEmail(''); }}
                  activeOpacity={0.88}>
                  <Text style={s.resetBtnTxt}>Done</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </Pressable>
      </Modal>

    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: '#0A0A0A' },

  // Header
  header:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.07)' },
  backBtn:     { width: 36 },
  backArrow:   { color: '#FFFFFF', fontSize: 22 },
  headerTitle: { color: '#FFFFFF', fontSize: 17, fontWeight: '700', letterSpacing: 0.2 },

  // Scroll
  scroll: { paddingHorizontal: 22, paddingTop: 32, paddingBottom: 60 },

  // Greeting
  greetingSection: { alignItems: 'center', marginBottom: 40 },
  logo:            { width: 90, height: 46, marginBottom: 24 },
  greeting:        { color: '#FFFFFF', fontSize: 28, fontWeight: '800', letterSpacing: -0.5 },
  subGreeting:     { color: '#71717A', fontSize: 14, marginTop: 6, textAlign: 'center' },

  // Fields
  fieldGroup: { marginBottom: 22 },
  label:      { color: '#A1A1AA', fontSize: 11, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 },
  labelRow:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  forgotLink: { color: '#10B981', fontSize: 12, fontWeight: '600' },
  input:      { backgroundColor: '#111111', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', color: '#FFFFFF', fontSize: 15, paddingHorizontal: 16, height: 52 },
  inputErr:   { borderColor: '#EF4444' },
  errTxt:     { color: '#EF4444', fontSize: 12, marginTop: 6 },

  // Password
  pwRow:   { flexDirection: 'row', alignItems: 'center', backgroundColor: '#111111', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', height: 52, overflow: 'hidden' },
  pwInput: { flex: 1, color: '#FFFFFF', fontSize: 15, paddingHorizontal: 16 },
  eyeBtn:  { paddingHorizontal: 14, height: '100%', alignItems: 'center', justifyContent: 'center' },
  eyeIcon: { fontSize: 18 },

  // Buttons
  loginBtn:     { backgroundColor: '#FFFFFF', borderRadius: 50, paddingVertical: 17, alignItems: 'center', marginTop: 8, shadowColor: '#FFFFFF', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.12, shadowRadius: 12, elevation: 4 },
  loginBtnTxt:  { color: '#0A0A0A', fontSize: 16, fontWeight: '700', letterSpacing: 0.2 },
  // Sign up nudge
  signupNudge:    { alignItems: 'center', marginTop: 20 },
  signupNudgeTxt: { color: '#71717A', fontSize: 14 },
  signupNudgeBold:{ color: '#10B981', fontWeight: '700' },

  // Forgot Modal
  overlay:      { flex: 1, backgroundColor: 'rgba(0,0,0,0.65)', justifyContent: 'flex-end' },
  forgotModal:  { backgroundColor: '#111111', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 28, paddingBottom: 44 },
  sentIcon:     { fontSize: 44, textAlign: 'center', marginBottom: 12 },
  forgotTitle:  { color: '#FFFFFF', fontSize: 20, fontWeight: '800', marginBottom: 10, textAlign: 'center' },
  forgotSub:    { color: '#A1A1AA', fontSize: 14, lineHeight: 22, textAlign: 'center' },
  resetBtn:     { backgroundColor: '#FFFFFF', borderRadius: 50, paddingVertical: 16, alignItems: 'center', marginTop: 24 },
  resetBtnTxt:  { color: '#0A0A0A', fontSize: 15, fontWeight: '700' },
  cancelBtn:    { alignItems: 'center', marginTop: 14 },
  cancelBtnTxt: { color: '#71717A', fontSize: 14 },

  // Admin Preview Card
  adminCard:       { marginTop: 32, marginBottom: 16, backgroundColor: '#0D1A12', borderRadius: 16, borderWidth: 1.5, borderColor: 'rgba(16,185,129,0.3)', padding: 18 },
  adminCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  adminCardIcon:   { fontSize: 18 },
  adminCardTitle:  { color: '#10B981', fontSize: 14, fontWeight: '800', letterSpacing: 0.3 },
  adminCardDesc:   { color: '#4B5563', fontSize: 12, lineHeight: 18, marginBottom: 14 },
  adminCredRow:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  adminCredLabel:  { color: '#6B7280', fontSize: 12, fontWeight: '600' },
  adminCredValue:  { color: '#FAFAFA', fontSize: 12, fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace' },
  adminBtn:        { marginTop: 16, backgroundColor: 'rgba(16,185,129,0.15)', borderRadius: 12, borderWidth: 1.5, borderColor: '#10B981', paddingVertical: 13, alignItems: 'center' },
  adminBtnTxt:     { color: '#10B981', fontSize: 14, fontWeight: '800', letterSpacing: 0.3 },
});
