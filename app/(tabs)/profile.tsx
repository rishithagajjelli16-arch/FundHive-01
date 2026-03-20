import React, { useMemo, useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native'
import {
  Settings,
  Camera,
  MapPin,
  Edit3,
  Plus,
  BadgeCheck,
  Mail,
  Linkedin,
  Globe,
  Building,
  Shield,
  CheckCircle,
} from 'lucide-react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

const SCREEN_WIDTH = Dimensions.get('window').width

// ============================================
// TYPESCRIPT INTERFACES
// ============================================

type UserRole = 'founder' | 'investor' | 'incubator'

interface Education {
  id: string
  degree: string
  institution: string
  year: string
  initials: string
  color: string
}

interface Experience {
  id: string
  role: string
  company: string
  duration: string
  initials: string
  color: string
  current: boolean
}

interface UserProfile {
  name: string
  role: UserRole
  tagline: string
  location: string
  bio: string
  email: string
  linkedin: string
  website: string
  avatarInitials: string
  avatarColor: string
  isVerified: boolean
  education: Education[]
  experience: Experience[]
  skills: string[]
  verified: {
    email: boolean
    linkedin: boolean
    id: boolean
    incubator: boolean
  }
}

interface StatItem {
  value: string | number
  label: string
  color: string
}

// ============================================
// ADMIN PROFILE DATA
// ============================================

const ADMIN_PROFILE: UserProfile = {
  name: 'Admin',
  role: 'founder',
  tagline: 'FundHive Platform Administrator',
  location: 'India',
  bio: 'Administrator managing FundHive platform. Overseeing ecosystem growth, user engagement, and startup funding opportunities.',
  email: 'admin@fundhive.com',
  linkedin: 'linkedin.com/in/fundhive',
  website: 'fundhive.in',
  avatarInitials: 'FH',
  avatarColor: '#10B981',
  isVerified: true,
  education: [
    {
      id: 'e1',
      degree: 'MBA Business Administration',
      institution: 'Premium Institute',
      year: '2020 - 2022',
      initials: 'PI',
      color: '#10B981',
    },
  ],
  experience: [
    {
      id: 'ex1',
      role: 'Platform Admin',
      company: 'FundHive',
      duration: '2025 - Present',
      initials: 'FH',
      color: '#10B981',
      current: true,
    },
  ],
  skills: ['Platform Management', 'User Growth', 'Ecosystem Building', 'Startup Funding', 'Community Management'],
  verified: {
    email: true,
    linkedin: true,
    id: true,
    incubator: true,
  },
}

// ============================================
// ADMIN STATS
// ============================================

const ADMIN_STATS = {
  activeUsers: '1.2K+',
  activePitches: 342,
  totalConnections: 856,
  successRate: '24%',
}

// ============================================
// HELPER FUNCTIONS
// ============================================

const getRoleAccent = (role: UserRole): string => {
  return '#10B981'
}

const getRoleLabel = (role: UserRole): string => {
  return 'Platform Admin'
}

const getStatsForRole = (role: UserRole): StatItem[] => {
  return [
    { value: ADMIN_STATS.activeUsers, label: 'Active Users', color: '#10B981' },
    { value: ADMIN_STATS.activePitches, label: 'Pitches', color: '#6366F1' },
    { value: ADMIN_STATS.totalConnections, label: 'Connections', color: '#F59E0B' },
    { value: ADMIN_STATS.successRate, label: 'Success Rate', color: '#10B981' },
  ]
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function ProfileScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets()

  // Use admin profile
  const currentRole: UserRole = 'founder'
  const profile = ADMIN_PROFILE

  const [activeTab, setActiveTab] = useState<'about' | 'portfolio' | 'activity'>('about')

  const roleAccent = getRoleAccent(currentRole)
  const stats = useMemo(() => getStatsForRole(currentRole), [currentRole])

  return (
    <SafeAreaView edges={['top', 'left', 'right']} className="flex-1 bg-[#0A0A0A]">
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />

      {/* ============================================ */}
      {/* TOP BAR */}
      {/* ============================================ */}
      <View className="flex-row items-center justify-between px-5 pb-1" style={{ paddingTop: 8 }}>
        <Text className="text-xl font-extrabold text-[#FAFAFA]">My Profile</Text>
        <View className="flex-row gap-2.5">
          <TouchableOpacity className="h-[38px] w-[38px] items-center justify-center rounded-full border border-[#1F1F1F] bg-[#141414]">
            <Edit3 color="#A3A3A3" size={17} />
          </TouchableOpacity>
          <TouchableOpacity className="h-[38px] w-[38px] items-center justify-center rounded-full border border-[#1F1F1F] bg-[#141414]">
            <Settings color="#A3A3A3" size={17} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ============================================ */}
        {/* LAYER 1: AVATAR AND NAME SECTION */}
        {/* ============================================ */}
        <View className="items-center px-5 pb-6 pt-2">
          <View className="relative mb-4">
            <View
              className="h-[90px] w-[90px] items-center justify-center rounded-full border-[3px]"
              style={{ backgroundColor: profile.avatarColor, borderColor: profile.avatarColor }}
            >
              <Text className="text-3xl font-extrabold text-[#FAFAFA]">{profile.avatarInitials}</Text>
            </View>

            <TouchableOpacity className="absolute bottom-0 right-0 h-7 w-7 items-center justify-center rounded-full border-2 border-[#0A0A0A] bg-[#141414]">
              <Camera color="#A3A3A3" size={13} />
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center gap-2">
            <Text className="text-[22px] font-extrabold text-[#FAFAFA]">{profile.name}</Text>
            {profile.isVerified ? <BadgeCheck color="#10B981" size={20} fill="rgba(16,185,129,0.2)" /> : null}
          </View>

          <View
            className="mt-2 rounded-full border px-4 py-1"
            style={{ backgroundColor: `${roleAccent}26`, borderColor: `${roleAccent}66` }}
          >
            <Text className="text-xs font-bold capitalize" style={{ color: roleAccent }}>
              {getRoleLabel(currentRole)}
            </Text>
          </View>

          <Text className="mt-2.5 px-5 text-center text-sm leading-5 text-[#A3A3A3]">{profile.tagline}</Text>

          <View className="mt-2 flex-row items-center gap-1">
            <MapPin color="#525252" size={13} />
            <Text className="text-[13px] text-[#525252]">{profile.location}</Text>
          </View>

          <View className="mt-4 flex-row gap-2.5">
            <TouchableOpacity className="h-10 flex-1 items-center justify-center rounded-full bg-[#10B981]">
              <Text className="text-sm font-bold text-[#FAFAFA]">Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full border border-[#1F1F1F] bg-[#141414]">
              <Globe color="#A3A3A3" size={17} />
            </TouchableOpacity>
            <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full border border-[#1F1F1F] bg-[#141414]">
              <Linkedin color="#A3A3A3" size={17} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ============================================ */}
        {/* LAYER 2: STATS ROW */}
        {/* ============================================ */}
        <View
          className="mx-5 mb-6 flex-row overflow-hidden rounded-2xl border border-[#1F1F1F] bg-[#141414]"
          style={{ width: SCREEN_WIDTH - 40 }}
        >
          {stats.map((stat, index) => (
            <View
              key={stat.label}
              className="flex-1 items-center py-4"
              style={{ borderRightWidth: index < stats.length - 1 ? 1 : 0, borderRightColor: '#1F1F1F' }}
            >
              <Text className="text-lg font-extrabold" style={{ color: stat.color }}>
                {stat.value}
              </Text>
              <Text className="mt-0.5 text-center text-[10px] text-[#525252]">{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* ============================================ */}
        {/* LAYER 3: VERIFICATION BADGES */}
        {/* ============================================ */}
        <View className="mx-5 mb-6">
          <Text className="mb-3 text-[11px] font-bold tracking-[1px] text-[#525252]">VERIFICATION STATUS</Text>
          <View className="flex-row gap-2.5">
            {[
              { label: 'Email', verified: profile.verified.email, icon: Mail },
              { label: 'LinkedIn', verified: profile.verified.linkedin, icon: Linkedin },
              { label: 'ID', verified: profile.verified.id, icon: Shield },
              { label: 'Incubator', verified: profile.verified.incubator, icon: Building },
            ].map((badge) => (
              <View
                key={badge.label}
                className="flex-1 items-center gap-1 rounded-xl border py-2.5"
                style={{ borderColor: badge.verified ? 'rgba(16,185,129,0.4)' : '#1F1F1F', backgroundColor: '#141414' }}
              >
                <badge.icon color={badge.verified ? '#10B981' : '#525252'} size={16} />
                <Text className="text-[10px] font-semibold" style={{ color: badge.verified ? '#10B981' : '#525252' }}>
                  {badge.label}
                </Text>
                {badge.verified ? <CheckCircle color="#10B981" size={10} fill="rgba(16,185,129,0.2)" /> : null}
              </View>
            ))}
          </View>
        </View>

        {/* ============================================ */}
        {/* LAYER 4: TAB SWITCHER */}
        {/* ============================================ */}
        <View className="mx-5 mb-4 flex-row gap-2">
          {[
            { key: 'about', label: 'About' },
            { key: 'portfolio', label: 'Stats' },
            { key: 'activity', label: 'Activity' },
          ].map((tab) => {
            const active = activeTab === tab.key
            return (
              <TouchableOpacity
                key={tab.key}
                onPress={() => setActiveTab(tab.key as 'about' | 'portfolio' | 'activity')}
                className="rounded-full border px-4 py-1.5"
                style={{
                  backgroundColor: active ? '#10B981' : '#141414',
                  borderColor: active ? '#10B981' : '#1F1F1F',
                }}
              >
                <Text className="text-[13px] font-semibold" style={{ color: active ? '#FAFAFA' : '#A3A3A3' }}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>

        {/* ============================================ */}
        {/* LAYER 5: ABOUT / BIO */}
        {/* ============================================ */}
        {activeTab === 'about' ? (
          <>
            <View className="mx-5 mb-6">
              <Text className="mb-2.5 text-[11px] font-bold tracking-[1px] text-[#525252]">ABOUT</Text>
              <Text className="text-sm leading-[22px] text-[#A3A3A3]">{profile.bio}</Text>
            </View>

            {/* ============================================ */}
            {/* LAYER 6: EDUCATION */}
            {/* ============================================ */}
            <View className="mx-5 mb-6">
              <View className="mb-3 flex-row items-center justify-between">
                <Text className="text-[11px] font-bold tracking-[1px] text-[#525252]">EDUCATION</Text>
                <TouchableOpacity>
                  <Plus color="#10B981" size={18} />
                </TouchableOpacity>
              </View>

              {profile.education.map((edu) => (
                <View key={edu.id} className="mb-3.5 flex-row items-start gap-3">
                  <View className="h-11 w-11 items-center justify-center rounded-[10px]" style={{ backgroundColor: edu.color }}>
                    <Text className="text-[13px] font-extrabold text-[#FAFAFA]">{edu.initials}</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-[15px] font-semibold text-[#FAFAFA]">{edu.degree}</Text>
                    <Text className="mt-0.5 text-[13px] text-[#A3A3A3]">{edu.institution}</Text>
                    <Text className="mt-0.5 text-xs text-[#525252]">{edu.year}</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* ============================================ */}
            {/* LAYER 7: EXPERIENCE */}
            {/* ============================================ */}
            <View className="mx-5 mb-6">
              <View className="mb-3 flex-row items-center justify-between">
                <Text className="text-[11px] font-bold tracking-[1px] text-[#525252]">EXPERIENCE</Text>
                <TouchableOpacity>
                  <Plus color="#10B981" size={18} />
                </TouchableOpacity>
              </View>

              {profile.experience.map((exp) => (
                <View key={exp.id} className="mb-3.5 flex-row items-start gap-3">
                  <View className="h-11 w-11 items-center justify-center rounded-[10px]" style={{ backgroundColor: exp.color }}>
                    <Text className="text-[13px] font-extrabold text-[#FAFAFA]">{exp.initials}</Text>
                  </View>
                  <View className="flex-1">
                    <View className="flex-row items-center gap-2">
                      <Text className="text-[15px] font-semibold text-[#FAFAFA]">{exp.role}</Text>
                      {exp.current ? (
                        <View className="rounded-full border border-[#10B9814D] bg-[#10B98126] px-2 py-0.5">
                          <Text className="text-[10px] font-bold text-[#10B981]">Current</Text>
                        </View>
                      ) : null}
                    </View>
                    <Text className="mt-0.5 text-[13px] text-[#A3A3A3]">{exp.company}</Text>
                    <Text className="mt-0.5 text-xs text-[#525252]">{exp.duration}</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* ============================================ */}
            {/* LAYER 8: SKILLS */}
            {/* ============================================ */}
            <View className="mx-5 mb-6">
              <View className="mb-3 flex-row items-center justify-between">
                <Text className="text-[11px] font-bold tracking-[1px] text-[#525252]">SKILLS</Text>
                <TouchableOpacity>
                  <Plus color="#10B981" size={18} />
                </TouchableOpacity>
              </View>

              <View className="flex-row flex-wrap gap-2">
                {profile.skills.map((skill) => (
                  <View key={skill} className="rounded-full border border-[#1F1F1F] bg-[#141414] px-3.5 py-1.5">
                    <Text className="text-[13px] text-[#A3A3A3]">{skill}</Text>
                  </View>
                ))}
              </View>
            </View>
          </>
        ) : null}

        {/* ============================================ */}
        {/* LAYER 9: PLATFORM STATS */}
        {/* ============================================ */}
        {activeTab === 'portfolio' ? (
          <View className="mx-5 mb-6">
            <Text className="mb-3 text-[11px] font-bold tracking-[1px] text-[#525252]">PLATFORM OVERVIEW</Text>

            <View className="rounded-2xl border border-[#1F1F1F] bg-[#141414] p-4" style={{ borderLeftWidth: 3, borderLeftColor: '#10B981' }}>
              <View className="mb-4">
                <Text className="text-lg font-bold text-[#FAFAFA]">FundHive Statistics</Text>
                <Text className="mt-1 text-sm text-[#A3A3A3]">Platform growth and engagement metrics</Text>
              </View>

              <View className="flex-row flex-wrap gap-3">
                <View className="flex-1 rounded-xl border border-[#1F1F1F] bg-[#0A0A0A] p-3">
                  <Text className="text-[13px] text-[#525252]">Active Users</Text>
                  <Text className="mt-1.5 text-xl font-bold text-[#10B981]">{ADMIN_STATS.activeUsers}</Text>
                </View>

                <View className="flex-1 rounded-xl border border-[#1F1F1F] bg-[#0A0A0A] p-3">
                  <Text className="text-[13px] text-[#525252]">Active Pitches</Text>
                  <Text className="mt-1.5 text-xl font-bold text-[#6366F1]">{ADMIN_STATS.activePitches}</Text>
                </View>

                <View className="flex-1 rounded-xl border border-[#1F1F1F] bg-[#0A0A0A] p-3">
                  <Text className="text-[13px] text-[#525252]">Connections</Text>
                  <Text className="mt-1.5 text-xl font-bold text-[#F59E0B]">{ADMIN_STATS.totalConnections}</Text>
                </View>

                <View className="flex-1 rounded-xl border border-[#1F1F1F] bg-[#0A0A0A] p-3">
                  <Text className="text-[13px] text-[#525252]">Success Rate</Text>
                  <Text className="mt-1.5 text-xl font-bold text-[#10B981]">{ADMIN_STATS.successRate}</Text>
                </View>
              </View>
            </View>
          </View>
        ) : null}

        {/* ============================================ */}
        {/* LAYER 10: ACTIVITY */}
        {/* ============================================ */}
        {activeTab === 'activity' ? (
          <View className="mx-5 mb-6">
            <Text className="mb-3 text-[11px] font-bold tracking-[1px] text-[#525252]">RECENT ACTIVITY</Text>

            {[
              'Admin profile updated',
              'Platform monitoring active',
              'User engagement review completed',
            ].map((item, index) => (
              <View key={item} className="mb-2.5 rounded-xl border border-[#1F1F1F] bg-[#141414] p-3.5">
                <Text className="text-sm text-[#FAFAFA]">{item}</Text>
                <Text className="mt-1 text-xs text-[#525252]">{index === 0 ? '2h ago' : index === 1 ? 'Yesterday' : '2 days ago'}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {/* ============================================ */}
        {/* BOTTOM SPACER */}
        {/* ============================================ */}
        <View className="h-24" />
      </ScrollView>
    </SafeAreaView>
  )
}
