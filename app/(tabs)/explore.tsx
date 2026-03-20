import React, { useEffect, useRef, useState } from 'react'
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Image,
  Share,
  StatusBar,
  Animated,
  useWindowDimensions,
} from 'react-native'
import { VideoView, useVideoPlayer } from 'expo-video'
import {
  Heart,
  Bookmark,
  Share2,
  Volume2,
  VolumeX,
  Play,
  Pause,
  ChevronRight,
  ArrowRight,
  User,
} from 'lucide-react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

const stripeBeforeImg = require('../../assets/images/stripe-before.jpg')
const stripeAfterImg = require('../../assets/images/stripe-after.jpg')
const coinbaseBeforeImg = require('../../assets/images/coinbase-before.jpg')
const coinbaseAfterImg = require('../../assets/images/coinbase-after.jpg')
const dropboxBeforeImg = require('../../assets/images/dropbox-before.jpg')
const dropboxAfterImg = require('../../assets/images/dropbox-after.jpg')
const redditBeforeImg = require('../../assets/images/reddit-before.jpg')
const redditAfterImg = require('../../assets/images/reddit-after.jpg')
const spotifyVideo = require('../../assets/videos/spotify.mp4')
const rhodeVideo = require('../../assets/videos/rhode.mp4')
const starbucksVideo = require('../../assets/videos/starbucks.mp4')
const zetpoVideo = require('../../assets/videos/zepto.mp4')
const dysonVideo = require('../../assets/videos/dyson.mp4')

// ============================================
// INTERFACES
// ============================================

interface Reel {
  id: string
  video: number
  company: string
  tagline: string
  industry: string
  stage: string
  founded: string
  valuation: string
  founders: string
  story: string
  likes: number
  bookmarks: number
  accentColor: string
}

interface Story {
  id: string
  company: string
  tagline: string
  beforeImage: number
  afterImage: number
  beforeLabel: string
  afterLabel: string
  founded: string
  valuation: string
  growth: string
  founders: string
  story: string
}

interface NewsItem {
  id: string
  featured: boolean
  category: string
  categoryColor: string
  headline: string
  summary: string
  source: string
  time: string
}

// ============================================
// DATA
// ============================================

const REELS_DATA: Reel[] = [
  {
    id: 'r1',
    video: spotifyVideo,
    company: 'Spotify',
    tagline: 'From dorm room to 600 million users worldwide',
    industry: 'Music Tech',
    stage: 'Series A',
    founded: '2006',
    valuation: '$50B',
    founders: 'Daniel Ek, Martin Lorentzon',
    story:
      'Two Swedish entrepreneurs wanted to fight music piracy by making streaming easier than downloading illegally. Every major label rejected them. Today Spotify has over 600 million users.',
    likes: 24300,
    bookmarks: 8400,
    accentColor: '#1DB954',
  },
  {
    id: 'r2',
    video: rhodeVideo,
    company: 'Rhode Beauty',
    tagline: 'How Hailey Bieber built a beauty empire from scratch',
    industry: 'Beauty & Skincare',
    stage: 'Seed',
    founded: '2022',
    valuation: '$1B',
    founders: 'Hailey Bieber',
    story:
      'Rejected by multiple beauty investors who said the market was too crowded. Launched with just 3 products. Sold out in minutes. Now valued at over $1 billion in just 2 years.',
    likes: 41200,
    bookmarks: 12100,
    accentColor: '#F4A896',
  },
  {
    id: 'r3',
    video: starbucksVideo,
    company: 'Starbucks',
    tagline: 'From single store to global coffee giant',
    industry: 'Food & Beverage',
    stage: 'Series B',
    founded: '1971',
    valuation: '$120B',
    founders: 'Jerry Baldwin, Gordon Bowker, Zev Siegl',
    story:
      'Howard Schultz pitched his coffee shop vision to 242 investors. 217 said no. He borrowed money from his doctor and dentist to open the first store. Now 35,000 stores in 80 countries.',
    likes: 18700,
    bookmarks: 6200,
    accentColor: '#00704A',
  },
  {
    id: 'r4',
    video: zetpoVideo,
    company: 'Zepto',
    tagline: '10 minute grocery by two 19yr old dropouts',
    industry: 'Quick Commerce',
    stage: 'Series C',
    founded: '2021',
    valuation: '$5B',
    founders: 'Aadit Palicha, Kaivalya Vohra',
    story:
      'Aadit and Kaivalya dropped out of Stanford at 19 to solve grocery delivery in India. Every investor said 10 minutes was impossible. They proved them wrong and hit $5B valuation in just 3 years.',
    likes: 33800,
    bookmarks: 9700,
    accentColor: '#FF6B35',
  },
  {
    id: 'r5',
    video: dysonVideo,
    company: 'Dyson',
    tagline: '5126 prototypes before the first sale',
    industry: 'Consumer Technology',
    stage: 'Bootstrap',
    founded: '1991',
    valuation: '$25B',
    founders: 'James Dyson',
    story:
      'James Dyson spent 15 years and his entire savings building 5126 prototypes of his vacuum cleaner. Every manufacturer rejected him. He built his own factory and created a $25 billion empire.',
    likes: 29400,
    bookmarks: 11300,
    accentColor: '#C8102E',
  },
]

const SUCCESS_STORIES: Story[] = [
  {
    id: 's1',
    company: 'Stripe',
    tagline: 'Two brothers who made payments simple',
    beforeImage: stripeBeforeImg,
    afterImage: stripeAfterImg,
    beforeLabel: '2010 - Dorm Room',
    afterLabel: '2024 - $65 Billion',
    founded: '2010',
    valuation: '$65B',
    growth: '1M+ businesses',
    founders: 'Patrick & John Collison',
    story: 'Started by two brothers in their early 20s. Rejected by investors who said payments were solved. Now processes hundreds of billions annually.',
  },
  {
    id: 's2',
    company: 'Coinbase',
    tagline: 'From a spare bedroom to biggest crypto exchange',
    beforeImage: coinbaseBeforeImg,
    afterImage: coinbaseAfterImg,
    beforeLabel: '2012 - Spare Bedroom',
    afterLabel: '2024 - $85 Billion',
    founded: '2012',
    valuation: '$85B',
    growth: '110M+ users',
    founders: 'Brian Armstrong, Fred Ehrsam',
    story: 'Brian wrote the first version after work hours. Y Combinator funded them with just $150K. Today the largest US crypto exchange.',
  },
  {
    id: 's3',
    company: 'Dropbox',
    tagline: 'A file sharing idea investors called pointless',
    beforeImage: dropboxBeforeImg,
    afterImage: dropboxAfterImg,
    beforeLabel: '2007 - Early Days',
    afterLabel: '2018 - NYSE IPO',
    founded: '2007',
    valuation: '$8B',
    growth: '700M+ users',
    founders: 'Drew Houston, Arash Ferdowsi',
    story: 'Drew forgot his USB on a bus and built Dropbox. Steve Jobs said it was a feature not a product. He ignored it and proved everyone wrong.',
  },
  {
    id: 's4',
    company: 'Reddit',
    tagline: 'Front page of internet started with fake users',
    beforeImage: redditBeforeImg,
    afterImage: redditAfterImg,
    beforeLabel: '2005 - Small Office',
    afterLabel: '2024 - NYSE IPO',
    founded: '2005',
    valuation: '$10B',
    growth: '1.5B monthly visits',
    founders: 'Steve Huffman, Alexis Ohanian',
    story: 'Launched with fake accounts to look active. Now third most visited site in the US and went public on NYSE in 2024.',
  },
]

const NEWS_DATA: NewsItem[] = [
  {
    id: 'n1',
    featured: true,
    category: 'FUNDING NEWS',
    categoryColor: '#10B981',
    headline: 'Indian Startups Raise Record $12B in Q1 2025 Despite Global Slowdown',
    summary:
      'Fintech and healthtech lead the charge as Indian startup ecosystem shows remarkable resilience with record funding numbers this quarter.',
    source: 'YourStory',
    time: '2h ago',
  },
  {
    id: 'n2',
    featured: false,
    category: 'INCUBATOR',
    categoryColor: '#6366F1',
    headline: 'T-Hub Hyderabad Opens Applications for Cohort 12 — 50 Spots Available',
    summary: 'Indias largest startup incubator opens doors for next batch.',
    source: 'T-Hub Official',
    time: '4h ago',
  },
  {
    id: 'n3',
    featured: false,
    category: 'SUCCESS',
    categoryColor: '#F59E0B',
    headline: 'Zepto Becomes Youngest Indian Startup to Hit $5B Valuation',
    summary: 'Quick commerce giant achieves milestone in record time.',
    source: 'Economic Times',
    time: '6h ago',
  },
  {
    id: 'n4',
    featured: false,
    category: 'AI STARTUP',
    categoryColor: '#8B5CF6',
    headline: 'Y Combinator W25 Batch Has Record 40% AI Startups',
    summary: 'Latest YC cohort reflects global shift toward AI-first companies.',
    source: 'TechCrunch',
    time: '8h ago',
  },
  {
    id: 'n5',
    featured: false,
    category: 'INDIA',
    categoryColor: '#EF4444',
    headline: 'Razorpay Crosses $1 Trillion in Total Payment Processing',
    summary: 'Indian fintech giant hits historic milestone.',
    source: 'Inc42',
    time: '10h ago',
  },
  {
    id: 'n6',
    featured: false,
    category: 'FUNDING',
    categoryColor: '#10B981',
    headline: 'IIT Madras Incubator Launches Rs 100 Crore Deep Tech Fund',
    summary: 'Fund targets hardware and deep tech startups from IIT ecosystem.',
    source: 'Hindu BusinessLine',
    time: '12h ago',
  },
]

// ============================================
// REEL COMPONENT
// ============================================

interface ReelItemProps {
  item: Reel
  isActive: boolean
  isMuted: boolean
  onMuteToggle: () => void
  reelHeight: number
  reelWidth: number
}

function formatCount(count: number): string {
  if (count > 999) {
    return `${(count / 1000).toFixed(1)}K`
  }

  return `${count}`
}

const ReelItem = ({
  item,
  isActive,
  isMuted,
  onMuteToggle,
  reelHeight,
  reelWidth,
}: ReelItemProps): React.JSX.Element => {
  const player = useVideoPlayer(item.video, (videoPlayer) => {
    videoPlayer.loop = true
    videoPlayer.muted = isMuted
  })
  const [isPlaying, setIsPlaying] = useState(false)
  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)
  const [likeCount, setLikeCount] = useState(item.likes)
  const [showInfo, setShowInfo] = useState(false)
  const heartScale = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (isActive) {
      player.play()
      setIsPlaying(true)
    } else {
      player.pause()
      setIsPlaying(false)
      setShowInfo(false)
    }
  }, [isActive, player])

  useEffect(() => {
    player.muted = isMuted
  }, [isMuted, player])

  const handleDoubleTap = (): void => {
    if (!liked) {
      setLiked(true)
      setLikeCount((prev) => prev + 1)
    }

    Animated.sequence([
      Animated.spring(heartScale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 20,
      }),
      Animated.delay(600),
      Animated.spring(heartScale, {
        toValue: 0,
        useNativeDriver: true,
        speed: 20,
      }),
    ]).start()
  }

  const handleSingleTap = (): void => {
    if (isPlaying) {
      player.pause()
      setIsPlaying(false)
    } else {
      player.play()
      setIsPlaying(true)
    }
  }

  const handleShare = async (): Promise<void> => {
    try {
      await Share.share({
        message: `${item.company}: ${item.tagline}`,
      })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <View style={{ height: reelHeight, width: reelWidth, backgroundColor: '#000000' }}>
      <VideoView
        player={player}
        style={{ position: 'absolute', top: 0, left: 0, width: reelWidth, height: reelHeight }}
        contentFit="cover"
        nativeControls={false}
      />

      <LinearGradient
        colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.08)', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.65)']}
        locations={[0, 0.45, 0.75, 1]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: reelHeight,
        }}
      />

      <TouchableOpacity
        activeOpacity={1}
        onPress={handleSingleTap}
        onLongPress={handleDoubleTap}
        style={{ position: 'absolute', top: 0, left: 0, width: reelWidth, height: reelHeight }}
      />

      {!isPlaying && (
        <View
          style={{
            position: 'absolute',
            top: reelHeight / 2 - 30,
            left: reelWidth / 2 - 30,
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Play color="#FAFAFA" size={28} />
        </View>
      )}

      <Animated.View
        style={{
          position: 'absolute',
          top: reelHeight / 2 - 50,
          left: reelWidth / 2 - 50,
          width: 100,
          height: 100,
          justifyContent: 'center',
          alignItems: 'center',
          transform: [{ scale: heartScale }],
          pointerEvents: 'none',
        }}
      >
        <Heart color="#FAFAFA" size={80} fill="#FAFAFA" />
      </Animated.View>

      <TouchableOpacity
        onPress={onMuteToggle}
        style={{
          position: 'absolute',
          top: 50,
          right: 16,
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {isMuted ? <VolumeX color="#FAFAFA" size={18} /> : <Volume2 color="#FAFAFA" size={18} />}
      </TouchableOpacity>

      <View
        style={{
          position: 'absolute',
          top: 50,
          left: 16,
          backgroundColor: 'rgba(0,0,0,0.6)',
          borderRadius: 20,
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.2)',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: item.accentColor }} />
        <Text style={{ color: '#FAFAFA', fontSize: 12, fontWeight: '700' }}>{item.company}</Text>
      </View>

      <View style={{ position: 'absolute', right: 12, bottom: 120, alignItems: 'center', gap: 20 }}>
        <TouchableOpacity
          onPress={() => {
            setLiked(!liked)
            setLikeCount((prev) => (liked ? prev - 1 : prev + 1))
          }}
          style={{ alignItems: 'center' }}
        >
          <Heart color={liked ? '#EF4444' : '#FAFAFA'} fill={liked ? '#EF4444' : 'transparent'} size={30} />
          <Text style={{ color: '#FAFAFA', fontSize: 12, marginTop: 4, fontWeight: '600' }}>{formatCount(likeCount)}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setSaved(!saved)} style={{ alignItems: 'center' }}>
          <Bookmark color={saved ? '#10B981' : '#FAFAFA'} fill={saved ? '#10B981' : 'transparent'} size={28} />
          <Text style={{ color: '#FAFAFA', fontSize: 12, marginTop: 4, fontWeight: '600' }}>{formatCount(item.bookmarks)}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleShare} style={{ alignItems: 'center' }}>
          <Share2 color="#FAFAFA" size={28} />
          <Text style={{ color: '#FAFAFA', fontSize: 12, marginTop: 4, fontWeight: '600' }}>Share</Text>
        </TouchableOpacity>
      </View>

      <View style={{ position: 'absolute', bottom: 80, left: 16, right: 80 }}>
        <Text
          style={{
            color: '#FAFAFA',
            fontSize: 20,
            fontWeight: '800',
            textShadowColor: 'rgba(0,0,0,0.8)',
            textShadowOffset: { width: 0, height: 1 },
            textShadowRadius: 4,
          }}
        >
          {item.company}
        </Text>

        <Text
          style={{
            color: 'rgba(255,255,255,0.85)',
            fontSize: 13,
            marginTop: 4,
            lineHeight: 18,
            textShadowColor: 'rgba(0,0,0,0.8)',
            textShadowOffset: { width: 0, height: 1 },
            textShadowRadius: 4,
          }}
        >
          {item.tagline}
        </Text>

        <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
          <View
            style={{
              backgroundColor: 'rgba(0,0,0,0.6)',
              borderRadius: 50,
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.2)',
            }}
          >
            <Text style={{ color: '#FAFAFA', fontSize: 11, fontWeight: '600' }}>{item.industry}</Text>
          </View>
          <View
            style={{
              backgroundColor: 'rgba(0,0,0,0.6)',
              borderRadius: 50,
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.2)',
            }}
          >
            <Text style={{ color: '#FAFAFA', fontSize: 11, fontWeight: '600' }}>{item.stage}</Text>
          </View>
        </View>

        <TouchableOpacity onPress={() => setShowInfo(true)} style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Text style={{ color: '#10B981', fontSize: 13, fontWeight: '700' }}>View Full Story {'\u2192'}</Text>
        </TouchableOpacity>
      </View>

      <View style={{ position: 'absolute', bottom: 24, left: 0, right: 0, alignItems: 'center' }}>
        <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>Swipe up for next story</Text>
      </View>

      {showInfo && (
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setShowInfo(false)}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            justifyContent: 'flex-end',
          }}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => undefined}
            style={{
              backgroundColor: '#141414',
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: 20,
              paddingBottom: 40,
            }}
          >
            <View style={{ width: 40, height: 4, backgroundColor: '#525252', borderRadius: 2, alignSelf: 'center', marginBottom: 20 }} />

            <Text style={{ color: '#FAFAFA', fontSize: 22, fontWeight: '800' }}>{item.company}</Text>
            <Text style={{ color: '#A3A3A3', fontSize: 14, marginTop: 4 }}>{item.tagline}</Text>

            <View
              style={{
                flexDirection: 'row',
                marginTop: 20,
                borderTopWidth: 1,
                borderBottomWidth: 1,
                borderColor: '#1F1F1F',
                paddingVertical: 16,
              }}
            >
              {[
                { label: 'Founded', value: item.founded },
                { label: 'Valuation', value: item.valuation },
                { label: 'Stage', value: item.stage },
              ].map((stat, index) => (
                <View key={stat.label} style={{ flex: 1, alignItems: 'center', borderRightWidth: index < 2 ? 1 : 0, borderColor: '#1F1F1F' }}>
                  <Text style={{ color: '#FAFAFA', fontSize: 16, fontWeight: '700' }}>{stat.value}</Text>
                  <Text style={{ color: '#A3A3A3', fontSize: 11, marginTop: 2 }}>{stat.label}</Text>
                </View>
              ))}
            </View>

            <Text style={{ color: '#A3A3A3', fontSize: 14, lineHeight: 22, marginTop: 16 }}>{item.story}</Text>
            <Text style={{ color: '#525252', fontSize: 13, marginTop: 12 }}>Founders: {item.founders}</Text>

            <TouchableOpacity
              onPress={() => setShowInfo(false)}
              style={{
                marginTop: 20,
                height: 48,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: '#10B981',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#10B981', fontSize: 15, fontWeight: '700' }}>Close</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      )}
    </View>
  )
}

// ============================================
// SUCCESS STORY CARD
// ============================================

function SuccessStoryCard({ story }: { story: Story }): React.JSX.Element {
  return (
    <View className="mb-5 w-full overflow-hidden rounded-[20px] border border-[#1F1F1F] bg-[#141414]">
      {/* Section A: Company Header */}
      <View className="flex-row items-center justify-between p-4">
        <Text className="text-[20px] font-bold text-[#FAFAFA]">{story.company}</Text>
        <View className="rounded-full bg-[#1F1F1F] px-3 py-1">
          <Text className="text-xs text-[#A3A3A3]">Est. {story.founded}</Text>
        </View>
      </View>

      {/* Section B: Before Label */}
      <View className="mb-2 flex-row items-center px-4" style={{ gap: 8 }}>
        <View className="h-2 w-2 rounded-full bg-[#525252]" />
        <Text className="text-[11px] font-bold tracking-[1.5px] text-[#A3A3A3]">BEFORE</Text>
      </View>

      {/* Section B/C/D: Side-by-side Before and After */}
      <View className="mb-3 flex-row px-4">
        <View className="relative h-[240px] flex-1 overflow-hidden rounded-l-xl border border-[#1F1F1F] border-r-0">
          <Image source={story.beforeImage} className="h-full w-full" resizeMode="cover" />
          <LinearGradient
            colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.8)']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 80 }}
          />
          <View className="absolute bottom-[10px] left-3 rounded-lg border border-[#ffffff20] bg-[rgba(0,0,0,0.75)] px-3 py-[5px]">
            <Text className="text-[11px] font-bold text-[#FAFAFA]">{story.beforeLabel}</Text>
          </View>
        </View>

        <View className="h-[240px] w-10 items-center justify-center bg-[#0A0A0A]">
          <View className="h-8 w-8 items-center justify-center rounded-full bg-[#10B981]">
            <ArrowRight size={16} color="#FAFAFA" strokeWidth={2.4} />
          </View>
        </View>

        <View className="relative h-[240px] flex-1 overflow-hidden rounded-r-xl border border-[#1F1F1F] border-l-0">
          <Image source={story.afterImage} className="h-full w-full" resizeMode="cover" />
          <View className="absolute left-0 right-0 top-0 bottom-0 bg-[rgba(16,185,129,0.08)]" />
          <View className="absolute bottom-[10px] right-3 rounded-lg bg-[rgba(16,185,129,0.85)] px-3 py-[5px]">
            <Text className="text-[11px] font-bold text-[#FAFAFA]">{story.afterLabel}</Text>
          </View>
        </View>
      </View>

      <View className="mb-2 flex-row items-center px-4" style={{ gap: 8 }}>
        <View className="h-2 w-2 rounded-full bg-[#10B981]" />
        <Text className="text-[11px] font-bold tracking-[1.5px] text-[#10B981]">AFTER</Text>
      </View>

      {/* Section E: Story Details */}
      <View className="p-4">
        <Text className="mb-[14px] text-sm italic text-[#A3A3A3]">{story.tagline}</Text>

        <View className="flex-row items-center">
          <View className="flex-1 items-center">
            <Text className="text-[18px] font-bold text-[#FAFAFA]">{story.valuation}</Text>
            <Text className="mt-0.5 text-[11px] text-[#A3A3A3]">Valuation</Text>
          </View>
          <View className="h-10 w-px bg-[#1F1F1F]" />
          <View className="flex-1 items-center">
            <Text className="text-[18px] font-bold text-[#FAFAFA]">{story.growth}</Text>
            <Text className="mt-0.5 text-[11px] text-[#A3A3A3]">Reach</Text>
          </View>
          <View className="h-10 w-px bg-[#1F1F1F]" />
          <View className="flex-1 items-center">
            <Text className="text-[18px] font-bold text-[#FAFAFA]">{story.founded}</Text>
            <Text className="mt-0.5 text-[11px] text-[#A3A3A3]">Founded</Text>
          </View>
        </View>

        <View className="my-[14px] h-px bg-[#1F1F1F]" />

        <Text className="text-[13px] leading-5 text-[#A3A3A3]">{story.story}</Text>

        <View className="mt-3 flex-row items-center" style={{ gap: 6 }}>
          <User size={14} color="#A3A3A3" strokeWidth={2.2} />
          <Text className="text-xs text-[#A3A3A3]">{story.founders}</Text>
        </View>

        <View className="mb-1 mt-[14px]">
          <TouchableOpacity className="h-[42px] items-center justify-center rounded-[10px] border border-[#10B981]">
            <Text className="text-sm font-bold text-[#10B981]">Read Full Story {'\u2192'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

// ============================================
// NEWS CARD
// ============================================

function NewsCard({ news }: { news: NewsItem }): React.JSX.Element {
  if (news.featured) {
    return (
      <View className="mb-4 overflow-hidden rounded-2xl border border-[#1F1F1F] bg-[#141414]">
        <LinearGradient
          colors={[news.categoryColor, '#0A2A1F']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ height: 8 }}
        />

        <View className="p-4">
          <View
            style={{ backgroundColor: `${news.categoryColor}26` }}
            className="w-fit rounded-full px-2.5 py-1"
          >
            <Text className="text-[10px] font-bold tracking-widest" style={{ color: news.categoryColor }}>
              {news.category}
            </Text>
          </View>

          <Text className="mt-2 text-base font-bold text-[#FAFAFA]" style={{ lineHeight: 24 }}>
            {news.headline}
          </Text>

          <Text className="mt-1.5 text-xs text-[#A3A3A3]" numberOfLines={3}>
            {news.summary}
          </Text>

          <View className="mt-3 flex-row items-center justify-between">
            <View className="flex-row items-center gap-1">
              <Text className="text-xs text-[#A3A3A3]">{news.source}</Text>
              <Text className="text-[10px] text-[#525252]">•</Text>
              <Text className="text-xs text-[#A3A3A3]">{news.time}</Text>
            </View>
            <Text className="text-xs text-[#10B981]">Read →</Text>
          </View>
        </View>
      </View>
    )
  }

  return (
    <View className="mb-3 flex-row overflow-hidden rounded-2xl border border-[#1F1F1F] bg-[#141414] p-3">
      <View className="flex-1">
        <View
          style={{ backgroundColor: `${news.categoryColor}26` }}
          className="w-fit rounded-full px-2 py-0.5"
        >
          <Text className="text-[9px] font-bold" style={{ color: news.categoryColor }}>
            {news.category}
          </Text>
        </View>

        <Text className="mt-1.5 text-sm font-bold text-[#FAFAFA]" numberOfLines={2}>
          {news.headline}
        </Text>

        <View className="mt-1.5 flex-row items-center gap-1">
          <Text className="text-[10px] text-[#A3A3A3]">{news.source}</Text>
          <Text className="text-[9px] text-[#525252]">•</Text>
          <Text className="text-[10px] text-[#A3A3A3]">{news.time}</Text>
        </View>
      </View>

      <View className="ml-3 h-[70px] w-[70px] rounded-xl bg-[#1F1F1F]" />
    </View>
  )
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function ExploreScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets()
  const { width: windowWidth, height: windowHeight } = useWindowDimensions()
  const [activeTab, setActiveTab] = useState<'reels' | 'stories' | 'news'>('reels')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [headerHeight, setHeaderHeight] = useState(0)
  const reelViewportHeight = Math.max(1, Math.floor(windowHeight - headerHeight))
  const clampReelIndex = (index: number): number => {
    return Math.max(0, Math.min(index, REELS_DATA.length - 1))
  }

  useEffect(() => {
    // Keep active index in bounds after orientation/size updates to prevent edge-case reel crashes.
    setCurrentIndex((prev) => Math.max(0, Math.min(prev, REELS_DATA.length - 1)))
  }, [windowHeight, windowWidth])

  return (
    <SafeAreaView edges={['left', 'right']} className="flex-1 bg-[#0A0A0A]">
      <StatusBar
        hidden={activeTab === 'reels'}
        barStyle="light-content"
        backgroundColor="#0A0A0A"
      />

      {/* Sticky Header */}
      <View
        className="bg-[#0A0A0A] px-5"
        style={{
          paddingTop: insets.top + 10,
          borderBottomWidth: activeTab === 'reels' ? 0 : 1,
          borderBottomColor: '#1F1F1F',
        }}
        onLayout={(event) => {
          const measuredHeight = event.nativeEvent.layout.height
          if (measuredHeight !== headerHeight) {
            setHeaderHeight(measuredHeight)
          }
        }}
      >
        <Text className="text-2xl font-bold text-[#FAFAFA]">Explore</Text>

        {/* Tabs */}
        <View className="mt-3 flex-row gap-2 pb-4">
          {(['reels', 'stories', 'news'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              className={`rounded-full px-[18px] py-[7px] ${
                activeTab === tab ? 'bg-[#10B981]' : 'border border-[#1F1F1F] bg-[#141414]'
              }`}
            >
              <Text
                className={`text-[13px] font-bold capitalize ${
                  activeTab === tab ? 'text-[#FAFAFA]' : 'text-[#A3A3A3]'
                }`}
              >
                {tab === 'reels' ? 'Reels' : tab === 'stories' ? 'Success Stories' : 'Latest News'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* REELS TAB */}
      {activeTab === 'reels' ? (
        <View style={{ flex: 1, backgroundColor: '#000000' }}>
          <FlatList
            key={`reels-${Math.round(reelViewportHeight)}-${Math.round(windowWidth)}`}
            data={REELS_DATA}
            keyExtractor={(item) => item.id}
            pagingEnabled
            showsVerticalScrollIndicator={false}
            bounces={false}
            overScrollMode="never"
            snapToInterval={reelViewportHeight}
            snapToAlignment="start"
            decelerationRate="fast"
            initialNumToRender={1}
            maxToRenderPerBatch={1}
            windowSize={3}
            removeClippedSubviews={false}
            onMomentumScrollEnd={(event) => {
              const offsetY = event.nativeEvent.contentOffset.y
              const nextIndex = clampReelIndex(Math.round(offsetY / reelViewportHeight))
              if (nextIndex !== currentIndex) {
                setCurrentIndex(nextIndex)
              }
            }}
            renderItem={({ item, index }) => (
              <ReelItem
                item={item}
                isActive={index === currentIndex}
                isMuted={isMuted}
                onMuteToggle={() => setIsMuted(!isMuted)}
                reelHeight={reelViewportHeight}
                reelWidth={windowWidth}
              />
            )}
            getItemLayout={(_, index) => ({
              length: reelViewportHeight,
              offset: reelViewportHeight * index,
              index,
            })}
          />
        </View>
      ) : null}

      {/* SUCCESS STORIES TAB */}
      {activeTab === 'stories' ? (
        <ScrollView className="flex-1 bg-[#0A0A0A]" showsVerticalScrollIndicator={false}>
          <View className="px-4 pb-[100px] pt-4">
            <Text className="text-xl font-bold text-[#FAFAFA]">From Garage to Billions</Text>
            <Text className="mt-1 text-xs text-[#A3A3A3]">Real startup transformation stories</Text>

            <View className="mt-5">
              {SUCCESS_STORIES.map((story) => (
                <SuccessStoryCard key={story.id} story={story} />
              ))}
            </View>
          </View>
        </ScrollView>
      ) : null}

      {/* NEWS TAB */}
      {activeTab === 'news' ? (
        <ScrollView className="flex-1 bg-[#0A0A0A]" showsVerticalScrollIndicator={false}>
          <View className="px-4 pb-10 pt-4">
            <Text className="text-xl font-bold text-[#FAFAFA]">Startup World Today</Text>
            <Text className="mt-1 text-xs text-[#A3A3A3]">What is happening right now</Text>

            <View className="mt-5">
              {NEWS_DATA.map((news) => (
                <NewsCard key={news.id} news={news} />
              ))}
            </View>
          </View>
        </ScrollView>
      ) : null}
    </SafeAreaView>
  )
}
