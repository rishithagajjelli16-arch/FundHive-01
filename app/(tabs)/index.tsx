import React, { useEffect, useRef, useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  Bell,
  Search,
  SlidersHorizontal,
  Play,
  CheckCircle,
  Building,
  Sparkles,
  ChevronRight,
  Upload,
  Compass,
  MessageCircle,
  BarChart2,
} from 'lucide-react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

interface Pitch {
  id: string
  videoId: string
  company: string
  tagline: string
  industry: string
  stage: string
  incubator: string
  vouched: boolean
  verified: boolean
  duration: string
  vouches: number
  thumbnail: string
  description: string
  founded: string
  valuation: string
  founders: string
}

interface Quote {
  text: string
  author: string
}

interface QuickAction {
  id: string
  title: string
  subtitle: string
  bgTint: string
  iconColor: string
  Icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>
}

const QUOTES: Quote[] = [
  {
    text: 'The only way to do great work\nis to love what you do.',
    author: '\u2014 Steve Jobs, Apple',
  },
  {
    text: 'Make every detail perfect and limit\nthe number of details to perfect.',
    author: '\u2014 Jack Dorsey, Twitter',
  },
  {
    text: 'If you are not embarrassed by the\nfirst version of your product,\nyou have launched too late.',
    author: '\u2014 Reid Hoffman, LinkedIn',
  },
  {
    text: 'The best startups come from\nsomebody needing to scratch an itch.',
    author: '\u2014 Michael Arrington, TechCrunch',
  },
  {
    text: 'Do not be embarrassed by your\nfailures, learn from them and start again.',
    author: '\u2014 Richard Branson, Virgin',
  },
  {
    text: 'Move fast and learn things.\nSpeed is the currency of startups.',
    author: '\u2014 Mark Zuckerberg, Meta',
  },
]

const FEATURED_PITCHES: Pitch[] = [
  {
    id: '1',
    videoId: 'RBUlVSzgPco',
    company: 'Airbnb',
    tagline: 'Book unique homes around the world',
    industry: 'Travel',
    stage: 'Seed',
    incubator: 'Y Combinator',
    vouched: true,
    verified: true,
    duration: '2:14',
    vouches: 1240,
    thumbnail: 'https://img.youtube.com/vi/RBUlVSzgPco/maxresdefault.jpg',
    description:
      'Airbnb connects travelers with local hosts offering unique accommodations worldwide.',
    founded: '2008',
    valuation: '$75 Billion',
    founders: 'Brian Chesky, Joe Gebbia, Nathan Blecharczyk',
  },
  {
    id: '2',
    videoId: 'O3dDjYabkuY',
    company: 'Dropbox',
    tagline: 'Your files anywhere on any device',
    industry: 'SaaS',
    stage: 'Series A',
    incubator: 'Y Combinator',
    vouched: true,
    verified: true,
    duration: '3:14',
    vouches: 980,
    thumbnail: 'https://img.youtube.com/vi/O3dDjYabkuY/maxresdefault.jpg',
    description:
      'Dropbox revolutionized cloud storage by making file sharing effortless across all devices.',
    founded: '2007',
    valuation: '$8 Billion',
    founders: 'Drew Houston, Arash Ferdowsi',
  },
  {
    id: '3',
    videoId: 'ukYXtUFZ664',
    company: 'Uber',
    tagline: 'Everyone needs a ride on demand',
    industry: 'Transport',
    stage: 'Seed',
    incubator: 'TechCrunch Disrupt',
    vouched: true,
    verified: true,
    duration: '1:58',
    vouches: 2100,
    thumbnail: 'https://img.youtube.com/vi/ukYXtUFZ664/maxresdefault.jpg',
    description: 'Uber transformed urban transportation by connecting riders with drivers.',
    founded: '2009',
    valuation: '$72 Billion',
    founders: 'Travis Kalanick, Garrett Camp',
  },
  {
    id: '4',
    videoId: 'oTahLEX3NXo',
    company: 'Notion',
    tagline: 'All in one workspace for your team',
    industry: 'Productivity',
    stage: 'Series B',
    incubator: 'Y Combinator',
    vouched: true,
    verified: true,
    duration: '4:20',
    vouches: 756,
    thumbnail: 'https://img.youtube.com/vi/oTahLEX3NXo/maxresdefault.jpg',
    description:
      'Notion combines notes, docs, wikis and project management in one workspace.',
    founded: '2016',
    valuation: '$10 Billion',
    founders: 'Ivan Zhao, Simon Last',
  },
  {
    id: '5',
    videoId: 'CdXliXtIjx0',
    company: 'Figma',
    tagline: 'Design together in real time',
    industry: 'Design',
    stage: 'Series A',
    incubator: 'Sequoia Capital',
    vouched: true,
    verified: true,
    duration: '3:45',
    vouches: 634,
    thumbnail: 'https://img.youtube.com/vi/CdXliXtIjx0/maxresdefault.jpg',
    description: 'Figma brought collaborative design to the browser for entire teams.',
    founded: '2012',
    valuation: '$20 Billion',
    founders: 'Dylan Field, Evan Wallace',
  },
]

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'upload',
    title: 'Upload Pitch',
    subtitle: 'Share your vision',
    bgTint: 'rgba(16,185,129,0.15)',
    iconColor: '#10B981',
    Icon: Upload,
  },
  {
    id: 'investors',
    title: 'Find Investors',
    subtitle: 'Smart matching',
    bgTint: 'rgba(99,102,241,0.15)',
    iconColor: '#6366F1',
    Icon: Compass,
  },
  {
    id: 'messages',
    title: 'Messages',
    subtitle: '18 unread',
    bgTint: 'rgba(245,158,11,0.15)',
    iconColor: '#F59E0B',
    Icon: MessageCircle,
  },
  {
    id: 'analytics',
    title: 'My Analytics',
    subtitle: 'Pitch performance',
    bgTint: 'rgba(139,92,246,0.15)',
    iconColor: '#8B5CF6',
    Icon: BarChart2,
  },
]

const USER_NAME_KEY = 'fundhive_user_name'
const DEFAULT_USER_NAME = 'Rishitha'
const WAVE_EMOJI = '\u{1F44B}'

function getGreetingText(): string {
  const hour = new Date().getHours()
  if (hour < 12) {
    return 'Good Morning'
  }

  if (hour <= 17) {
    return 'Good Afternoon'
  }

  return 'Good Evening'
}

function QuickActionCard({ action, width }: { action: QuickAction; width: number }): React.JSX.Element {
  const scaleAnim = useRef(new Animated.Value(1)).current

  const handlePressIn = (): void => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 24,
      bounciness: 2,
    }).start()
  }

  const handlePressOut = (): void => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 24,
      bounciness: 4,
    }).start()
  }

  return (
    <Animated.View style={{ width, transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        className="h-[100px] justify-between rounded-2xl border border-[#1F1F1F] bg-[#141414] p-4"
      >
        <View
          className="h-9 w-9 items-center justify-center rounded-xl"
          style={{ backgroundColor: action.bgTint }}
        >
          <action.Icon size={18} color={action.iconColor} strokeWidth={2.2} />
        </View>

        <View>
          <Text className="text-sm font-bold text-[#FAFAFA]">{action.title}</Text>
          <Text className="mt-0.5 text-[11px] text-[#A3A3A3]">{action.subtitle}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  )
}

export default function HomeTabScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets()
  const [searchText, setSearchText] = useState('')
  const [displayedQuoteIndex, setDisplayedQuoteIndex] = useState(0)
  const [userName, setUserName] = useState(DEFAULT_USER_NAME)
  const currentQuoteIndexRef = useRef(0)
  const fadeAnim = useRef(new Animated.Value(1)).current

  const actionCardWidth = (SCREEN_WIDTH - 40 - 12) / 2
  const greetingText = getGreetingText()

  useEffect(() => {
    const loadUserName = async (): Promise<void> => {
      try {
        const storedName = await AsyncStorage.getItem(USER_NAME_KEY)
        if (storedName && storedName.trim()) {
          setUserName(storedName.trim())
        }
      } catch (error) {
        console.error('Failed to load user name', error)
      }
    }

    void loadUserName()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentQuoteIndexRef.current + 1) % QUOTES.length

      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        currentQuoteIndexRef.current = nextIndex
        setDisplayedQuoteIndex(nextIndex)

        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start()
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [fadeAnim])

  const currentQuote = QUOTES[displayedQuoteIndex]

  return (
    <SafeAreaView edges={['left', 'right']} className="flex-1 bg-[#0A0A0A]">
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />

      <ScrollView
        className="flex-1 bg-[#0A0A0A]"
        showsVerticalScrollIndicator={false}
        bounces
        contentContainerStyle={{ paddingBottom: 30 + insets.bottom }}
      >
        <View className="flex-row items-center justify-between px-5" style={{ paddingTop: insets.top + 10 }}>
          <View className="flex-row items-center">
            <Image
              source={require('../../assets/images/logo.png')}
              style={{ width: 90, height: 46 }}
              resizeMode="contain"
            />
          </View>

          <View className="flex-row items-center">
            <TouchableOpacity
              activeOpacity={0.8}
              className="h-[38px] w-[38px] items-center justify-center rounded-full border border-[#1F1F1F] bg-[#141414]"
            >
              <Bell size={22} color="#FAFAFA" strokeWidth={2} />
              <View
                className="absolute right-0 top-0 h-2 w-2 rounded-full bg-[#EF4444]"
                style={{ borderWidth: 1.5, borderColor: '#FAFAFA' }}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View className="mt-4 px-5">
          <Text className="text-sm font-normal text-[#A3A3A3]">
            {greetingText}, {WAVE_EMOJI}
          </Text>
          <Text className="mt-1 text-2xl font-bold text-[#FAFAFA]">{userName}</Text>
        </View>

        <View className="mt-[14px] px-5">
          <View className="h-[46px] flex-row items-center rounded-full border border-[#1F1F1F] bg-[#141414] px-[14px]">
            <Search size={18} color="#525252" strokeWidth={2} />
            <TextInput
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Search startups, investors..."
              placeholderTextColor="#525252"
              className="ml-2 flex-1 bg-transparent text-sm text-[#FAFAFA]"
              style={{ paddingVertical: 0 }}
            />

            <View className="items-center justify-center rounded-full bg-[#1F1F1F] p-[6px]">
              <SlidersHorizontal size={18} color="#10B981" strokeWidth={2} />
            </View>
          </View>
        </View>

        <View className="mt-6 min-h-[100px] px-5">
          <Animated.View style={{ opacity: fadeAnim }}>
            <Text className="mb-[-8px] text-[40px] font-black leading-[40px] text-[#10B981]">&quot;</Text>

            <Text
              className="px-[10px] text-center text-[15px] italic text-[#FAFAFA]"
              style={{ lineHeight: 22 }}
            >
              {currentQuote.text}
            </Text>

            <Text className="mt-2 text-center text-[13px] text-[#A3A3A3]">{currentQuote.author}</Text>
          </Animated.View>

          <View className="mt-3 flex-row items-center justify-center" style={{ gap: 6 }}>
            {QUOTES.map((quote, index) => (
              <View
                key={quote.author}
                className="rounded-full"
                style={{
                  width: index === displayedQuoteIndex ? 20 : 6,
                  height: 6,
                  backgroundColor: index === displayedQuoteIndex ? '#10B981' : '#525252',
                }}
              />
            ))}
          </View>
        </View>

        <View className="mt-7 flex-row items-center justify-between px-5">
          <Text className="text-lg font-bold text-[#FAFAFA]">Featured Pitches</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text className="text-sm text-[#10B981]">{'See all \u203A'}</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={FEATURED_PITCHES}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: 20, paddingRight: 8, gap: 12, marginTop: 14 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.9}
              className="w-[240px] overflow-hidden rounded-2xl border border-[#1F1F1F] bg-[#141414]"
            >
              <View className="relative h-[140px] w-full">
                <Image source={{ uri: item.thumbnail }} resizeMode="cover" className="h-full w-full" />

                <LinearGradient
                  colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.85)']}
                  start={{ x: 0.5, y: 0 }}
                  end={{ x: 0.5, y: 1 }}
                  style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
                />

                <View className="absolute left-0 right-0 top-0 bottom-0 items-center justify-center">
                  <View className="h-12 w-12 items-center justify-center rounded-full bg-[rgba(255,255,255,0.1)]">
                    <View className="h-9 w-9 items-center justify-center rounded-full bg-[rgba(255,255,255,0.3)]">
                      <Play size={16} color="#FAFAFA" fill="#FAFAFA" strokeWidth={2} />
                    </View>
                  </View>
                </View>

                <View className="absolute bottom-2 left-2 rounded-md bg-[rgba(0,0,0,0.7)] px-[7px] py-[3px]">
                  <Text className="text-[11px] font-bold text-[#FAFAFA]">{item.duration}</Text>
                </View>

                {item.verified ? (
                  <View className="absolute right-2 top-2 h-[22px] w-[22px] items-center justify-center rounded-full bg-[#10B981]">
                    <CheckCircle size={12} color="#FAFAFA" strokeWidth={2.4} />
                  </View>
                ) : null}

                {item.vouched ? (
                  <View className="absolute left-2 top-2 rounded-full border border-[#10B981] bg-[rgba(16,185,129,0.2)] px-2 py-[3px]">
                    <Text className="text-[9px] font-bold text-[#10B981]">{'VOUCHED \u2713'}</Text>
                  </View>
                ) : null}
              </View>

              <View className="p-3">
                <Text className="text-[15px] font-bold text-[#FAFAFA]">{item.company}</Text>
                <Text className="mt-0.5 text-xs text-[#A3A3A3]" numberOfLines={1}>
                  {item.tagline}
                </Text>

                <View className="mt-2 flex-row" style={{ gap: 6 }}>
                  <View className="rounded-full bg-[#1F1F1F] px-[10px] py-[3px]">
                    <Text className="text-[11px] text-[#A3A3A3]">{item.industry}</Text>
                  </View>
                  <View className="rounded-full bg-[#1F1F1F] px-[10px] py-[3px]">
                    <Text className="text-[11px] text-[#A3A3A3]">{item.stage}</Text>
                  </View>
                </View>

                <View className="mt-2 flex-row items-center justify-between">
                  {item.vouched ? (
                    <View className="flex-row items-center">
                      <Building size={11} color="#A3A3A3" strokeWidth={2.2} />
                      <Text className="ml-1 text-[11px] text-[#A3A3A3]">{item.incubator}</Text>
                    </View>
                  ) : (
                    <View />
                  )}

                  <Text className="text-[11px] text-[#A3A3A3]">{'\u2605'} {item.vouches}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push('/ai-pitch-analyzer')}
          className="mt-6 mx-5 flex-row items-center rounded-2xl border border-[#10B981] bg-[#141414] p-4"
        >
          <View className="h-11 w-11 items-center justify-center rounded-xl bg-[rgba(16,185,129,0.15)]">
            <Sparkles size={22} color="#10B981" strokeWidth={2} />
          </View>

          <View className="mx-3 flex-1">
            <Text className="text-[10px] font-bold tracking-[1.5px] text-[#10B981]">AI INSIGHT</Text>
            <Text className="mt-1 text-[15px] font-bold text-[#FAFAFA]">Your pitch scores 7.2/10</Text>
            <Text className="mt-0.5 text-xs text-[#A3A3A3]">Tap to see how to improve it</Text>
          </View>

          <ChevronRight size={20} color="#525252" strokeWidth={2.2} />
        </TouchableOpacity>

        <View className="mt-6 px-5">
          <Text className="mb-[14px] text-lg font-bold text-[#FAFAFA]">Quick Actions</Text>

          <View className="flex-row" style={{ gap: 12 }}>
            <QuickActionCard action={QUICK_ACTIONS[0]} width={actionCardWidth} />
            <QuickActionCard action={QUICK_ACTIONS[1]} width={actionCardWidth} />
          </View>

          <View className="mt-3 flex-row" style={{ gap: 12 }}>
            <QuickActionCard action={QUICK_ACTIONS[2]} width={actionCardWidth} />
            <QuickActionCard action={QUICK_ACTIONS[3]} width={actionCardWidth} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
