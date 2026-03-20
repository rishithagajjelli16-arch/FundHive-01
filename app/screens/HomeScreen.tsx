import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  StatusBar,
  StyleSheet,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types';
import {
  Bell,
  Eye,
  Users,
  Share2,
  MessageCircle,
  Play,
  Sparkles,
  Upload,
  Compass,
  BarChart2,
  CheckCircle,
  ChevronRight,
  Home,
  Video,
  User,
  Star,
  TrendingUp,
  Zap,
} from 'lucide-react-native';

const { width: W } = Dimensions.get('window');
const CARD_W   = W * 0.60;
const CARD_GAP = 12;

type Nav   = NativeStackNavigationProp<RootStackParamList, 'Dashboard'>;
type Route = RouteProp<RootStackParamList, 'Dashboard'>;
interface Props { navigation: Nav; route: Route; }

// ═══════════════════════════════════════════════════════════════════════════════
// TypeScript Interfaces
// ═══════════════════════════════════════════════════════════════════════════════

interface VideoPitch {
  id: string;
  startupName: string;
  tagline: string;
  industry: string;
  duration: string;
  vouchCount: number;
  verified: boolean;
  bgColor: string;
  accentColor: string;
}

interface TrendingStartup {
  id: string;
  name: string;
  pitchLine: string;
  industry: string;
  fundingStage: string;
  vouchCount: number;
  initials: string;
  logoColor: string;
}

interface StatItem {
  id: string;
  value: number;
  label: string;
  color: string;
  Icon: React.ComponentType<{ size: number; color: string; strokeWidth?: number }>;
}

interface QuickAction {
  id: string;
  title: string;
  desc: string;
  color: string;
  bgColor: string;
  borderColor: string;
  Icon: React.ComponentType<{ size: number; color: string; strokeWidth?: number }>;
}

interface TabItem {
  id: string;
  label: string;
  Icon: React.ComponentType<{ size: number; color: string; strokeWidth?: number }>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// Mock Data
// ═══════════════════════════════════════════════════════════════════════════════

const VIDEO_PITCHES: VideoPitch[] = [
  {
    id: '1', startupName: 'NeuroLend',
    tagline: 'AI-powered credit scoring for emerging markets',
    industry: 'FinTech', duration: '2:34', vouchCount: 47, verified: true,
    bgColor: '#0A1628', accentColor: '#10B981',
  },
  {
    id: '2', startupName: 'GreenChain',
    tagline: 'Blockchain-verified carbon credit marketplace',
    industry: 'CleanTech', duration: '3:12', vouchCount: 31, verified: true,
    bgColor: '#0A1A0A', accentColor: '#22C55E',
  },
  {
    id: '3', startupName: 'MediLink',
    tagline: 'Rural healthcare meets intelligent telemedicine',
    industry: 'HealthTech', duration: '1:58', vouchCount: 22, verified: false,
    bgColor: '#1A0A1C', accentColor: '#A855F7',
  },
  {
    id: '4', startupName: 'SpaceAgri',
    tagline: 'Satellite-powered precision farming at scale',
    industry: 'AgriTech', duration: '4:01', vouchCount: 58, verified: true,
    bgColor: '#1C1A0A', accentColor: '#F59E0B',
  },
];

const TRENDING: TrendingStartup[] = [
  {
    id: '1', name: 'NeuroLend',
    pitchLine: 'Making credit fair with AI — ₹50Cr seed round open',
    industry: 'FinTech', fundingStage: 'Seed', vouchCount: 47,
    initials: 'NL', logoColor: '#10B981',
  },
  {
    id: '2', name: 'GreenChain',
    pitchLine: 'Every tree planted on-chain. Carbon markets, reimagined.',
    industry: 'CleanTech', fundingStage: 'Pre-Seed', vouchCount: 31,
    initials: 'GC', logoColor: '#22C55E',
  },
  {
    id: '3', name: 'MediLink',
    pitchLine: 'Zero-gap healthcare for Tier 3 India',
    industry: 'HealthTech', fundingStage: 'Series A', vouchCount: 22,
    initials: 'ML', logoColor: '#A855F7',
  },
  {
    id: '4', name: 'SpaceAgri',
    pitchLine: 'From satellite to soil — precision at scale',
    industry: 'AgriTech', fundingStage: 'Seed', vouchCount: 58,
    initials: 'SA', logoColor: '#F59E0B',
  },
  {
    id: '5', name: 'CryptoKart',
    pitchLine: "India's first decentralised commerce layer",
    industry: 'Web3', fundingStage: 'Series A', vouchCount: 38,
    initials: 'CK', logoColor: '#3B82F6',
  },
];

const STATS: StatItem[] = [
  { id: '1', value: 1284, label: 'Profile Views',     color: '#10B981', Icon: Eye           },
  { id: '2', value: 43,   label: 'Investor Requests', color: '#3B82F6', Icon: Users         },
  { id: '3', value: 127,  label: 'Docs Shared',       color: '#A855F7', Icon: Share2        },
  { id: '4', value: 18,   label: 'Active Chats',      color: '#F59E0B', Icon: MessageCircle },
];

const QUICK_ACTIONS: QuickAction[] = [
  { id: '1', title: 'Upload Pitch',   desc: 'Share your vision',  color: '#10B981', bgColor: 'rgba(16,185,129,0.08)',  borderColor: 'rgba(16,185,129,0.2)',  Icon: Upload        },
  { id: '2', title: 'Find Investors', desc: 'Smart matching',     color: '#3B82F6', bgColor: 'rgba(59,130,246,0.08)',  borderColor: 'rgba(59,130,246,0.2)',  Icon: Compass       },
  { id: '3', title: 'Messages',       desc: '18 unread',          color: '#F59E0B', bgColor: 'rgba(245,158,11,0.08)',  borderColor: 'rgba(245,158,11,0.2)',  Icon: MessageCircle },
  { id: '4', title: 'My Analytics',   desc: 'Pitch performance',  color: '#A855F7', bgColor: 'rgba(168,85,247,0.08)',  borderColor: 'rgba(168,85,247,0.2)',  Icon: BarChart2     },
];

const TABS: TabItem[] = [
  { id: 'home',     label: 'Home',     Icon: Home          },
  { id: 'discover', label: 'Discover', Icon: Compass       },
  { id: 'pitch',    label: 'Pitches',  Icon: Video         },
  { id: 'messages', label: 'Chats',    Icon: MessageCircle },
  { id: 'profile',  label: 'Profile',  Icon: User          },
];

// ═══════════════════════════════════════════════════════════════════════════════
// Helpers
// ═══════════════════════════════════════════════════════════════════════════════

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
}

function fmt(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

// ═══════════════════════════════════════════════════════════════════════════════
// HomeScreen Component
// ═══════════════════════════════════════════════════════════════════════════════

export default function HomeScreen({ navigation, route }: Props) {
  const insets    = useSafeAreaInsets();
  const userName  = route.params?.userName ?? 'Founder';
  const firstName = userName.split(' ')[0];

  const [activeTab,  setActiveTab]  = useState('home');
  const [statCounts, setStatCounts] = useState(STATS.map(() => 0));

  // ── Animated Values ──────────────────────────────────────────────────────────
  const progressAnim = useRef(new Animated.Value(0)).current;   // 0-100 → bar width %
  const glowAnim     = useRef(new Animated.Value(0)).current;   // 0-1 → AI banner glow
  const statAnims    = useRef(STATS.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    // 1. Profile strength bar animates to 75 on mount
    Animated.timing(progressAnim, {
      toValue: 75,
      duration: 1500,
      delay: 350,
      useNativeDriver: false,
    }).start();

    // 2. AI insight banner pulsing glow loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 1800, useNativeDriver: false }),
        Animated.timing(glowAnim, { toValue: 0, duration: 1800, useNativeDriver: false }),
      ]),
    ).start();

    // 3. Stats count-up — listener converts raw value to rounded integer
    statAnims.forEach((anim, i) => {
      anim.addListener(({ value }) => {
        setStatCounts(prev => {
          const next = [...prev];
          next[i] = Math.round(value);
          return next;
        });
      });
      Animated.timing(anim, {
        toValue: STATS[i].value,
        duration: 1400,
        delay: 500 + i * 140,
        useNativeDriver: false,
      }).start();
    });

    return () => statAnims.forEach(a => a.removeAllListeners());
  }, []);

  // Interpolated animated styles
  const progressBarWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });
  const aiBorderColor = glowAnim.interpolate({
    inputRange:  [0, 1],
    outputRange: ['rgba(16,185,129,0.15)', 'rgba(16,185,129,0.65)'],
  });
  const aiShadowOpacity = glowAnim.interpolate({
    inputRange:  [0, 1],
    outputRange: [0.05, 0.45],
  });
  const aiShadowRadius = glowAnim.interpolate({
    inputRange:  [0, 1],
    outputRange: [4, 22],
  });

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />

      {/* ═════════════════════════════════════════════════════════════════════
          SCROLLABLE BODY
      ═════════════════════════════════════════════════════════════════════ */}
      <ScrollView
        style={s.scroll}
        contentContainerStyle={[s.content, { paddingBottom: 80 + (insets.bottom || 12) }]}
        showsVerticalScrollIndicator={false}>

        {/* ───────────────────────────────────────────────────────────────────
            1. HEADER — greeting + bell + avatar + profile strength bar
        ─────────────────────────────────────────────────────────────────── */}
        <View style={s.header}>
          {/* Left: Greeting */}
          <View>
            <Text style={s.greetingLabel}>{getGreeting()} 👋</Text>
            <Text style={s.greetingName}>{firstName}</Text>
          </View>

          {/* Right: Bell + Avatar */}
          <View style={s.headerRight}>
            {/* Notification bell with red dot */}
            <TouchableOpacity style={s.iconBtn} activeOpacity={0.75}>
              <Bell size={20} color="#FAFAFA" strokeWidth={1.8} />
              <View style={s.notifDot} />
            </TouchableOpacity>

            {/* Profile avatar initials circle */}
            <TouchableOpacity style={s.avatar} activeOpacity={0.8}>
              <Text style={s.avatarTxt}>{firstName.charAt(0).toUpperCase()}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile Strength — animated emerald progress bar */}
        <View style={s.strengthCard}>
          <View style={s.strengthTop}>
            <View style={s.strengthLabelRow}>
              <Zap size={13} color="#10B981" strokeWidth={2.2} />
              <Text style={s.strengthLabel}>Profile Strength</Text>
            </View>
            <Text style={s.strengthPct}>75%</Text>
          </View>
          <View style={s.strengthTrack}>
            <Animated.View style={[s.strengthFill, { width: progressBarWidth }]} />
          </View>
          <Text style={s.strengthTip}>📹  Add a pitch video to reach 100%</Text>
        </View>

        {/* ───────────────────────────────────────────────────────────────────
            2. FEATURED VIDEO PITCHES — horizontal snap scroll
        ─────────────────────────────────────────────────────────────────── */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Featured Pitches</Text>
          <TouchableOpacity style={s.seeAllBtn} activeOpacity={0.7}>
            <Text style={s.seeAllTxt}>See all</Text>
            <ChevronRight size={13} color="#10B981" strokeWidth={2.5} />
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.pitchListContent}
          decelerationRate="fast"
          snapToInterval={CARD_W + CARD_GAP}
          snapToAlignment="start">
          {VIDEO_PITCHES.map(item => (
            <TouchableOpacity
              key={item.id}
              style={[s.pitchCard, { width: CARD_W }]}
              activeOpacity={0.88}>

              {/* Thumbnail with gradient + play overlay */}
              <View style={[s.thumbnail, { backgroundColor: item.bgColor }]}>
                {/* Decorative accent orb */}
                <View style={[s.thumbOrb, { backgroundColor: item.accentColor + '28' }]} />

                {/* Play button centre */}
                <View style={s.playCircle}>
                  <Play size={18} color="#FAFAFA" strokeWidth={2} />
                </View>

                {/* Duration badge bottom-left */}
                <View style={s.durationBadge}>
                  <Text style={s.durationTxt}>{item.duration}</Text>
                </View>

                {/* Verified tick top-right */}
                {item.verified && (
                  <View style={s.verifiedBadge}>
                    <CheckCircle size={15} color="#10B981" strokeWidth={2.2} />
                  </View>
                )}

                {/* Bottom fade gradient */}
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.72)']}
                  style={s.thumbGradient}
                />
              </View>

              {/* Card body */}
              <View style={s.pitchBody}>
                <Text style={s.pitchName}>{item.startupName}</Text>
                <Text style={s.pitchTagline} numberOfLines={2}>{item.tagline}</Text>
                <View style={s.pitchMeta}>
                  <View style={[s.industryTag, { borderColor: item.accentColor + '55' }]}>
                    <Text style={[s.industryTagTxt, { color: item.accentColor }]}>
                      {item.industry}
                    </Text>
                  </View>
                  <View style={s.vouchRow}>
                    <Star size={10} color="#F59E0B" strokeWidth={1.5} />
                    <Text style={s.vouchTxt}>{item.vouchCount} vouches</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ───────────────────────────────────────────────────────────────────
            3. LIVE STATS BAR — count-up animated pill cards
        ─────────────────────────────────────────────────────────────────── */}
        <View style={[s.sectionHeader, { marginTop: 30 }]}>
          <Text style={s.sectionTitle}>Your Live Stats</Text>
          <View style={s.liveIndicator}>
            <View style={s.livePulse} />
            <Text style={s.liveTxt}>LIVE</Text>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.statsContent}>
          {STATS.map((item, idx) => (
            <View
              key={item.id}
              style={[s.statPill, { borderColor: item.color + '35' }]}>
              {/* Coloured icon */}
              <View style={[s.statIconWrap, { backgroundColor: item.color + '18' }]}>
                <item.Icon size={17} color={item.color} strokeWidth={2} />
              </View>
              {/* Count-up number */}
              <Text style={[s.statNum, { color: item.color }]}>
                {fmt(statCounts[idx])}
              </Text>
              <Text style={s.statLabel}>{item.label}</Text>
            </View>
          ))}
        </ScrollView>

        {/* ───────────────────────────────────────────────────────────────────
            4. TRENDING STARTUPS — vertical list with industry + stage pills
        ─────────────────────────────────────────────────────────────────── */}
        <View style={[s.sectionHeader, { marginTop: 30 }]}>
          <Text style={s.sectionTitle}>Trending This Week 🔥</Text>
          <TouchableOpacity style={s.seeAllBtn} activeOpacity={0.7}>
            <Text style={s.seeAllTxt}>See all</Text>
            <ChevronRight size={13} color="#10B981" strokeWidth={2.5} />
          </TouchableOpacity>
        </View>

        {TRENDING.map(item => (
          <TouchableOpacity key={item.id} style={s.startupCard} activeOpacity={0.85}>
            {/* Startup logo circle */}
            <View style={[s.logoCircle, {
              backgroundColor: item.logoColor + '1A',
              borderColor: item.logoColor + '45',
            }]}>
              <Text style={[s.logoTxt, { color: item.logoColor }]}>{item.initials}</Text>
            </View>

            {/* Name + pitch line + pills */}
            <View style={s.startupInfo}>
              <Text style={s.startupName}>{item.name}</Text>
              <Text style={s.startupPitch} numberOfLines={1}>{item.pitchLine}</Text>
              <View style={s.startupPills}>
                <View style={s.stagePill}>
                  <Text style={s.stageTxt}>{item.fundingStage}</Text>
                </View>
                <View style={s.domainPill}>
                  <Text style={s.domainTxt}>{item.industry}</Text>
                </View>
                <View style={s.vouchRow}>
                  <Star size={10} color="#F59E0B" strokeWidth={1.5} />
                  <Text style={s.vouchTxt}>{item.vouchCount}</Text>
                </View>
              </View>
            </View>

            {/* View Pitch button */}
            <TouchableOpacity style={s.viewBtn} activeOpacity={0.8}>
              <Text style={s.viewBtnTxt}>View</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}

        {/* ───────────────────────────────────────────────────────────────────
            5. AI INSIGHT BANNER — pulsing emerald glow card
        ─────────────────────────────────────────────────────────────────── */}
        <TouchableOpacity activeOpacity={0.88} style={{ marginTop: 30, marginHorizontal: 20 }}>
          <Animated.View style={[
            s.aiBannerWrap,
            {
              borderColor: aiBorderColor,
              shadowOpacity: Platform.OS === 'ios' ? aiShadowOpacity : undefined,
              shadowRadius:  Platform.OS === 'ios' ? aiShadowRadius  : undefined,
            },
          ]}>
            <LinearGradient
              colors={['#0C1F16', '#0E0E0E']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={s.aiGradient}>
              {/* Icon */}
              <View style={s.aiIconWrap}>
                <Sparkles size={22} color="#10B981" strokeWidth={1.8} />
              </View>

              {/* Content */}
              <View style={{ flex: 1 }}>
                <Text style={s.aiEyebrow}>AI INSIGHT</Text>
                <Text style={s.aiHeadline}>
                  Your pitch score is{' '}
                  <Text style={s.aiScore}>7.2</Text>
                  <Text style={s.aiScoreOf}>/10</Text>
                </Text>
                <Text style={s.aiSubtext}>
                  Add financial projections to boost to 8.5+
                </Text>
              </View>

              <ChevronRight size={18} color="#10B981" strokeWidth={2} />
            </LinearGradient>
          </Animated.View>
        </TouchableOpacity>

        {/* ───────────────────────────────────────────────────────────────────
            6. QUICK ACTIONS GRID — 2×2 coloured icon cards
        ─────────────────────────────────────────────────────────────────── */}
        <View style={[s.sectionHeader, { marginTop: 30 }]}>
          <Text style={s.sectionTitle}>Quick Actions</Text>
        </View>

        <View style={s.actionsGrid}>
          {QUICK_ACTIONS.map(item => (
            <TouchableOpacity
              key={item.id}
              style={[s.actionCard, {
                backgroundColor: item.bgColor,
                borderColor: item.borderColor,
              }]}
              activeOpacity={0.82}>
              <View style={[s.actionIconWrap, { backgroundColor: item.color + '22' }]}>
                <item.Icon size={22} color={item.color} strokeWidth={1.8} />
              </View>
              <Text style={s.actionTitle}>{item.title}</Text>
              <Text style={s.actionDesc}>{item.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>

      {/* ═════════════════════════════════════════════════════════════════════
          7. BOTTOM TAB BAR — fixed, Home/Discover/Pitches/Chats/Profile
             Active tab: emerald icon + dot indicator
             Inactive:   grey icon
      ═════════════════════════════════════════════════════════════════════ */}
      <View style={[s.tabBar, { paddingBottom: (insets.bottom || 8) + 4 }]}>
        {TABS.map(tab => {
          const active = activeTab === tab.id;
          const color  = active ? '#10B981' : '#4B5563';
          return (
            <TouchableOpacity
              key={tab.id}
              style={s.tabItem}
              activeOpacity={0.7}
              onPress={() => setActiveTab(tab.id)}>
              <tab.Icon
                size={22}
                color={color}
                strokeWidth={active ? 2.2 : 1.7}
              />
              <Text style={[s.tabLabel, { color }]}>{tab.label}</Text>
              {active && <View style={s.tabDot} />}
            </TouchableOpacity>
          );
        })}
      </View>

    </SafeAreaView>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Styles
// ═══════════════════════════════════════════════════════════════════════════════

const s = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: '#0A0A0A' },
  scroll:  { flex: 1 },
  content: { paddingTop: 6 },

  // ── 1. HEADER ───────────────────────────────────────────────────────────────
  header:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 4 },
  greetingLabel: { color: '#6B7280', fontSize: 13, fontWeight: '500', marginBottom: 1 },
  greetingName:  { color: '#FAFAFA', fontSize: 26, fontWeight: '800', letterSpacing: -0.5 },
  headerRight:   { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconBtn:       { width: 40, height: 40, borderRadius: 12, backgroundColor: '#141414', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#1F1F1F', position: 'relative' },
  notifDot:      { position: 'absolute', top: 7, right: 7, width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444', borderWidth: 1.5, borderColor: '#0A0A0A' },
  avatar:        { width: 40, height: 40, borderRadius: 20, backgroundColor: '#10B981', alignItems: 'center', justifyContent: 'center' },
  avatarTxt:     { color: '#000000', fontSize: 17, fontWeight: '800' },

  // Profile strength bar
  strengthCard:     { marginHorizontal: 20, marginTop: 16, backgroundColor: '#141414', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#1F1F1F' },
  strengthTop:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  strengthLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  strengthLabel:    { color: '#A3A3A3', fontSize: 12, fontWeight: '600' },
  strengthPct:      { color: '#10B981', fontSize: 13, fontWeight: '800' },
  strengthTrack:    { height: 5, backgroundColor: '#1F1F1F', borderRadius: 3, overflow: 'hidden' },
  strengthFill:     { height: 5, backgroundColor: '#10B981', borderRadius: 3 },
  strengthTip:      { color: '#4B5563', fontSize: 11, marginTop: 10 },

  // ── SECTION HEADERS (shared) ─────────────────────────────────────────────────
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginTop: 28, marginBottom: 14 },
  sectionTitle:  { color: '#FAFAFA', fontSize: 17, fontWeight: '700' },
  seeAllBtn:     { flexDirection: 'row', alignItems: 'center', gap: 3 },
  seeAllTxt:     { color: '#10B981', fontSize: 13, fontWeight: '600' },

  // ── 2. VIDEO PITCH CARDS ─────────────────────────────────────────────────────
  pitchListContent: { paddingLeft: 20, paddingRight: 8, gap: CARD_GAP },
  pitchCard:        { backgroundColor: '#141414', borderRadius: 16, borderWidth: 1, borderColor: '#1F1F1F', overflow: 'hidden' },

  // Thumbnail area
  thumbnail:    { height: 150, justifyContent: 'center', alignItems: 'center', position: 'relative', overflow: 'hidden' },
  thumbOrb:     { position: 'absolute', top: -30, right: -30, width: 130, height: 130, borderRadius: 65 },
  playCircle:   { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.16)', alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.28)' },
  durationBadge:{ position: 'absolute', bottom: 9, left: 10, backgroundColor: 'rgba(0,0,0,0.72)', borderRadius: 6, paddingHorizontal: 7, paddingVertical: 3 },
  durationTxt:  { color: '#FAFAFA', fontSize: 11, fontWeight: '600' },
  verifiedBadge:{ position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 8, padding: 3 },
  thumbGradient:{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 60 },

  // Card body
  pitchBody:    { padding: 13 },
  pitchName:    { color: '#FAFAFA', fontSize: 15, fontWeight: '700', marginBottom: 3 },
  pitchTagline: { color: '#6B7280', fontSize: 12, lineHeight: 18, marginBottom: 10 },
  pitchMeta:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  industryTag:  { borderWidth: 1, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  industryTagTxt:{ fontSize: 10, fontWeight: '700' },
  vouchRow:     { flexDirection: 'row', alignItems: 'center', gap: 3 },
  vouchTxt:     { color: '#6B7280', fontSize: 11 },

  // ── 3. STATS BAR ─────────────────────────────────────────────────────────────
  statsContent:  { paddingLeft: 20, paddingRight: 8, gap: 10 },
  statPill:      { backgroundColor: '#141414', borderRadius: 14, borderWidth: 1, paddingHorizontal: 16, paddingVertical: 14, alignItems: 'center', minWidth: 110 },
  statIconWrap:  { width: 36, height: 36, borderRadius: 11, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  statNum:       { fontSize: 22, fontWeight: '800', letterSpacing: -0.5 },
  statLabel:     { color: '#6B7280', fontSize: 11, marginTop: 3, textAlign: 'center' },

  // Live indicator
  liveIndicator: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  livePulse:     { width: 7, height: 7, borderRadius: 4, backgroundColor: '#10B981' },
  liveTxt:       { color: '#10B981', fontSize: 10, fontWeight: '800', letterSpacing: 1.2 },

  // ── 4. TRENDING STARTUPS ─────────────────────────────────────────────────────
  startupCard:  { flexDirection: 'row', alignItems: 'center', backgroundColor: '#141414', marginHorizontal: 20, marginBottom: 10, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#1F1F1F', gap: 12 },
  logoCircle:   { width: 46, height: 46, borderRadius: 13, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5 },
  logoTxt:      { fontSize: 15, fontWeight: '800' },
  startupInfo:  { flex: 1 },
  startupName:  { color: '#FAFAFA', fontSize: 14, fontWeight: '700', marginBottom: 3 },
  startupPitch: { color: '#6B7280', fontSize: 12, lineHeight: 17, marginBottom: 7 },
  startupPills: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  stagePill:    { backgroundColor: 'rgba(16,185,129,0.12)', borderRadius: 5, paddingHorizontal: 7, paddingVertical: 2 },
  stageTxt:     { color: '#10B981', fontSize: 10, fontWeight: '700' },
  domainPill:   { backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 5, paddingHorizontal: 7, paddingVertical: 2 },
  domainTxt:    { color: '#A3A3A3', fontSize: 10, fontWeight: '600' },
  viewBtn:      { borderWidth: 1, borderColor: '#10B981', borderRadius: 8, paddingHorizontal: 13, paddingVertical: 7 },
  viewBtnTxt:   { color: '#10B981', fontSize: 12, fontWeight: '700' },

  // ── 5. AI INSIGHT BANNER ─────────────────────────────────────────────────────
  aiBannerWrap: {
    borderRadius: 16,
    borderWidth: 1.5,
    overflow: 'hidden',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 0 },
  },
  aiGradient:  { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 14 },
  aiIconWrap:  { width: 44, height: 44, borderRadius: 13, backgroundColor: 'rgba(16,185,129,0.15)', alignItems: 'center', justifyContent: 'center' },
  aiEyebrow:   { color: '#10B981', fontSize: 9, fontWeight: '800', letterSpacing: 1.5, marginBottom: 4 },
  aiHeadline:  { color: '#FAFAFA', fontSize: 16, fontWeight: '700' },
  aiScore:     { color: '#10B981', fontSize: 20, fontWeight: '800' },
  aiScoreOf:   { color: '#6B7280', fontSize: 14 },
  aiSubtext:   { color: '#6B7280', fontSize: 12, marginTop: 3 },

  // ── 6. QUICK ACTIONS 2×2 ─────────────────────────────────────────────────────
  actionsGrid:    { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 20, gap: 12 },
  actionCard:     { width: (W - 40 - 12) / 2, borderRadius: 16, padding: 18, borderWidth: 1 },
  actionIconWrap: { width: 46, height: 46, borderRadius: 13, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  actionTitle:    { color: '#FAFAFA', fontSize: 14, fontWeight: '700', marginBottom: 4 },
  actionDesc:     { color: '#6B7280', fontSize: 12 },

  // ── 7. BOTTOM TAB BAR ────────────────────────────────────────────────────────
  tabBar:  { backgroundColor: '#0D0D0D', borderTopWidth: 1, borderTopColor: '#1A1A1A', flexDirection: 'row', paddingTop: 10 },
  tabItem: { flex: 1, alignItems: 'center', gap: 3, position: 'relative' },
  tabLabel:{ fontSize: 10, fontWeight: '600' },
  tabDot:  { position: 'absolute', bottom: -4, width: 4, height: 4, borderRadius: 2, backgroundColor: '#10B981' },
});
