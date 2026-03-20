import React, { useMemo, useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Dimensions,
} from 'react-native'
import {
  Shield,
  Lock,
  Unlock,
  Search,
  Plus,
  CheckCheck,
  Check,
  MessageCircle,
  BadgeCheck,
} from 'lucide-react-native'
import { router } from 'expo-router'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

const SCREEN_WIDTH = Dimensions.get('window').width

// ============================================
// TYPESCRIPT INTERFACES
// ============================================

interface Conversation {
  id: string
  name: string
  company: string
  role: 'investor' | 'incubator' | 'founder'
  initials: string
  avatarColor: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  isOnline: boolean
  isVerified: boolean
  ndaStatus: 'not_signed' | 'pending' | 'signed'
  dealStage: 1 | 2 | 3 | 4
  isPinned: boolean
  isTyping: boolean
  messageStatus: 'sent' | 'delivered' | 'read'
}

interface FilterOption {
  key: 'all' | 'investors' | 'incubators'
  label: string
}

interface NDAInfo {
  color: string
  label: string
  icon: 'unlocked' | 'pending' | 'locked'
}

// ============================================
// DEMO DATA
// ============================================

const CONVERSATIONS: Conversation[] = [
  {
    id: '1',
    name: 'Rahul Mehta',
    company: 'Sequoia Capital India',
    role: 'investor',
    initials: 'RM',
    avatarColor: '#6366F1',
    lastMessage: 'I reviewed your deck. Very impressed with the traction numbers.',
    lastMessageTime: '2m',
    unreadCount: 3,
    isOnline: true,
    isVerified: true,
    ndaStatus: 'signed',
    dealStage: 3,
    isPinned: true,
    isTyping: false,
    messageStatus: 'read',
  },
  {
    id: '2',
    name: 'Priya Reddy',
    company: 'T-Hub Hyderabad',
    role: 'incubator',
    initials: 'PR',
    avatarColor: '#10B981',
    lastMessage: 'Congratulations! You have been selected for Cohort 12.',
    lastMessageTime: '1h',
    unreadCount: 1,
    isOnline: true,
    isVerified: true,
    ndaStatus: 'signed',
    dealStage: 4,
    isPinned: true,
    isTyping: false,
    messageStatus: 'read',
  },
  {
    id: '3',
    name: 'Vikram Singh',
    company: 'Accel Partners',
    role: 'investor',
    initials: 'VS',
    avatarColor: '#F59E0B',
    lastMessage: 'Can you share the financial projections for next 3 years?',
    lastMessageTime: '3h',
    unreadCount: 0,
    isOnline: false,
    isVerified: true,
    ndaStatus: 'pending',
    dealStage: 2,
    isPinned: false,
    isTyping: false,
    messageStatus: 'delivered',
  },
  {
    id: '4',
    name: 'Ananya Sharma',
    company: 'IIT Madras ICSR',
    role: 'incubator',
    initials: 'AS',
    avatarColor: '#8B5CF6',
    lastMessage: 'We would love to have NeuroLend in our next cohort.',
    lastMessageTime: '5h',
    unreadCount: 0,
    isOnline: false,
    isVerified: true,
    ndaStatus: 'not_signed',
    dealStage: 1,
    isPinned: false,
    isTyping: false,
    messageStatus: 'sent',
  },
  {
    id: '5',
    name: 'Arjun Kapoor',
    company: 'Blume Ventures',
    role: 'investor',
    initials: 'AK',
    avatarColor: '#EF4444',
    lastMessage: 'Let us schedule a call this week to discuss terms.',
    lastMessageTime: '1d',
    unreadCount: 0,
    isOnline: false,
    isVerified: false,
    ndaStatus: 'signed',
    dealStage: 3,
    isPinned: false,
    isTyping: true,
    messageStatus: 'read',
  },
  {
    id: '6',
    name: 'Meera Nair',
    company: 'NASSCOM Startup',
    role: 'incubator',
    initials: 'MN',
    avatarColor: '#06B6D4',
    lastMessage: 'Your application has been received. We will review shortly.',
    lastMessageTime: '2d',
    unreadCount: 0,
    isOnline: false,
    isVerified: true,
    ndaStatus: 'not_signed',
    dealStage: 1,
    isPinned: false,
    isTyping: false,
    messageStatus: 'read',
  },
]

const DEAL_STAGES = ['Connected', 'NDA Signed', 'Docs Shared', 'Meeting Set'] as const

const FILTER_OPTIONS: FilterOption[] = [
  { key: 'all', label: 'All Deals' },
  { key: 'investors', label: 'Investors' },
  { key: 'incubators', label: 'Incubators' },
]

// ============================================
// HELPER FUNCTIONS
// ============================================

const getRoleColor = (role: Conversation['role']): string => {
  if (role === 'investor') return '#6366F1'
  if (role === 'incubator') return '#10B981'
  return '#F59E0B'
}

const getNDAInfo = (status: Conversation['ndaStatus']): NDAInfo => {
  if (status === 'signed') {
    return { color: '#10B981', label: 'NDA Signed', icon: 'unlocked' }
  }

  if (status === 'pending') {
    return { color: '#F59E0B', label: 'NDA Pending', icon: 'pending' }
  }

  return { color: '#525252', label: 'NDA Required', icon: 'locked' }
}

// ============================================
// MAIN SCREEN COMPONENT
// ============================================

export default function MessagesScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets()
  const [activeFilter, setActiveFilter] = useState<FilterOption['key']>('all')
  const [searchText, setSearchText] = useState('')
  const [searchActive, setSearchActive] = useState(false)

  // ============================================
  // FILTERED LISTS
  // ============================================

  const filteredConversations = useMemo(() => {
    return CONVERSATIONS.filter((conv) => {
      const matchesFilter =
        activeFilter === 'all' ||
        (activeFilter === 'investors' && conv.role === 'investor') ||
        (activeFilter === 'incubators' && conv.role === 'incubator')

      const q = searchText.trim().toLowerCase()
      const matchesSearch =
        q.length === 0 || conv.name.toLowerCase().includes(q) || conv.company.toLowerCase().includes(q)

      return matchesFilter && matchesSearch
    })
  }, [activeFilter, searchText])

  const pinnedConversations = useMemo(
    () => filteredConversations.filter((conversation) => conversation.isPinned),
    [filteredConversations],
  )

  const regularConversations = useMemo(
    () => filteredConversations.filter((conversation) => !conversation.isPinned),
    [filteredConversations],
  )

  const onlineUsers = useMemo(() => CONVERSATIONS.filter((conversation) => conversation.isOnline), [])

  // ============================================
  // SCREEN LAYOUT
  // ============================================

  return (
    <SafeAreaView edges={['top', 'left', 'right']} className="flex-1 bg-[#0A0A0A]">
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />

      {/* ============================================ */}
      {/* HEADER */}
      {/* ============================================ */}
      <View className="px-5 pb-1 pt-1">
        <View className="flex-row items-center justify-between">
          <View>
            <View className="flex-row items-center gap-2">
              <Text className="text-[26px] font-extrabold text-[#FAFAFA]">Deal Room</Text>
              <View className="rounded-full bg-[#10B98126] p-1">
                <Shield color="#10B981" size={14} />
              </View>
            </View>
            <Text className="mt-0.5 text-[11px] text-[#525252]">End-to-end encrypted conversations</Text>
          </View>

          <View className="flex-row items-center gap-2.5">
            <TouchableOpacity
              onPress={() => setSearchActive((prev) => !prev)}
              className="h-[38px] w-[38px] items-center justify-center rounded-full border border-[#1F1F1F] bg-[#141414]"
            >
              <Search color="#A3A3A3" size={18} />
            </TouchableOpacity>
            <TouchableOpacity className="h-[38px] w-[38px] items-center justify-center rounded-full bg-[#10B981]">
              <Plus color="#FAFAFA" size={20} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ============================================ */}
        {/* SECURITY BANNER */}
        {/* ============================================ */}
        <View className="mt-3.5 flex-row items-center gap-2 rounded-xl border border-[#10B98133] bg-[#10B98114] px-3 py-2">
          <Shield color="#10B981" size={14} />
          <Text className="flex-1 text-[11px] font-semibold text-[#10B981]">
            Zero-knowledge encryption • Messages auto-delete after 90 days • NDA protected
          </Text>
          <View className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
        </View>

        {/* ============================================ */}
        {/* SEARCH BAR */}
        {/* ============================================ */}
        {searchActive ? (
          <View className="mt-3 h-11 flex-row items-center gap-2 rounded-full border border-[#1F1F1F] bg-[#141414] px-3.5">
            <Search color="#525252" size={16} />
            <TextInput
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Search conversations..."
              placeholderTextColor="#525252"
              className="flex-1 text-sm text-[#FAFAFA]"
              autoFocus
            />
          </View>
        ) : null}

        {/* ============================================ */}
        {/* FILTER PILLS */}
        {/* ============================================ */}
        <View className="mb-1 mt-3.5 flex-row gap-2">
          {FILTER_OPTIONS.map((filterOption) => {
            const active = activeFilter === filterOption.key
            return (
              <TouchableOpacity
                key={filterOption.key}
                onPress={() => setActiveFilter(filterOption.key)}
                className="rounded-full border px-4 py-1.5"
                style={{
                  backgroundColor: active ? '#10B981' : '#141414',
                  borderColor: active ? '#10B981' : '#1F1F1F',
                }}
              >
                <Text className="text-[13px] font-semibold" style={{ color: active ? '#FAFAFA' : '#A3A3A3' }}>
                  {filterOption.label}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>
      </View>

      {/* ============================================ */}
      {/* MAIN CONTENT */}
      {/* ============================================ */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Math.max(insets.bottom + 26, 36) }}
      >
        {/* ============================================ */}
        {/* ACTIVE NOW */}
        {/* ============================================ */}
        {onlineUsers.length > 0 ? (
          <View className="mt-4">
            <Text className="mb-2.5 px-5 text-[11px] font-bold tracking-[1px] text-[#525252]">ACTIVE NOW</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 20, gap: 16 }}
            >
              {onlineUsers.map((user) => (
                <TouchableOpacity
                  key={user.id}
                  className="items-center"
                  onPress={() =>
                    router.push({
                      pathname: '/chat',
                      params: { conversationId: user.id },
                    })
                  }
                >
                  <View className="relative">
                    <View
                      className="h-[52px] w-[52px] items-center justify-center rounded-full border-2 border-[#10B981]"
                      style={{ backgroundColor: user.avatarColor }}
                    >
                      <Text className="text-base font-bold text-[#FAFAFA]">{user.initials}</Text>
                    </View>
                    <View className="absolute bottom-[1px] right-[1px] h-3 w-3 rounded-full border-2 border-[#0A0A0A] bg-[#10B981]" />
                  </View>
                  <Text className="mt-1.5 max-w-[52px] text-center text-[11px] text-[#A3A3A3]" numberOfLines={1}>
                    {user.name.split(' ')[0]}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        ) : null}

        {/* ============================================ */}
        {/* PINNED CONVERSATIONS */}
        {/* ============================================ */}
        {pinnedConversations.length > 0 ? (
          <View className="mt-5">
            <Text className="mb-2 px-5 text-[11px] font-bold tracking-[1px] text-[#525252]">PINNED DEALS</Text>
            {pinnedConversations.map((conversation) => (
              <ConversationCard key={conversation.id} conversation={conversation} />
            ))}
          </View>
        ) : null}

        {/* ============================================ */}
        {/* ALL CONVERSATIONS */}
        {/* ============================================ */}
        <View className="mt-5">
          <Text className="mb-2 px-5 text-[11px] font-bold tracking-[1px] text-[#525252]">ALL CONVERSATIONS</Text>
          {regularConversations.map((conversation) => (
            <ConversationCard key={conversation.id} conversation={conversation} />
          ))}
        </View>

        {/* ============================================ */}
        {/* EMPTY STATE */}
        {/* ============================================ */}
        {filteredConversations.length === 0 ? (
          <View className="items-center px-10 pb-2 pt-20">
            <View className="mb-4 h-20 w-20 items-center justify-center rounded-full border border-[#1F1F1F] bg-[#141414]">
              <MessageCircle color="#525252" size={36} />
            </View>
            <Text className="text-center text-lg font-bold text-[#FAFAFA]">No deal conversations yet</Text>
            <Text className="mt-2 text-center text-sm leading-5 text-[#525252]">
              Connect with investors and incubators to start secure deal conversations
            </Text>
            <TouchableOpacity className="mt-6 rounded-full bg-[#10B981] px-6 py-3">
              <Text className="text-sm font-bold text-[#FAFAFA]">Find Investors</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        <View className="h-6" style={{ width: SCREEN_WIDTH }} />
      </ScrollView>
    </SafeAreaView>
  )
}

// ============================================
// CONVERSATION CARD COMPONENT
// ============================================

const ConversationCard = ({ conversation }: { conversation: Conversation }): React.JSX.Element => {
  const ndaInfo = getNDAInfo(conversation.ndaStatus)
  const roleColor = getRoleColor(conversation.role)

  return (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: '/chat',
          params: { conversationId: conversation.id },
        })
      }
      className="flex-row items-center gap-3 px-5 py-3"
      style={{
        backgroundColor: conversation.unreadCount > 0 ? 'rgba(16,185,129,0.04)' : 'transparent',
        borderLeftWidth: conversation.unreadCount > 0 ? 3 : 0,
        borderLeftColor: '#10B981',
      }}
      activeOpacity={0.7}
    >
      {/* ============================================ */}
      {/* AVATAR + ONLINE INDICATOR */}
      {/* ============================================ */}
      <View className="relative">
        <View
          className="h-[54px] w-[54px] items-center justify-center rounded-full"
          style={{ backgroundColor: conversation.avatarColor }}
        >
          <Text className="text-lg font-bold text-[#FAFAFA]">{conversation.initials}</Text>
        </View>
        {conversation.isOnline ? (
          <View className="absolute bottom-[1px] right-[1px] h-[13px] w-[13px] rounded-full border-2 border-[#0A0A0A] bg-[#10B981]" />
        ) : null}
      </View>

      {/* ============================================ */}
      {/* MAIN CONTENT */}
      {/* ============================================ */}
      <View className="flex-1">
        <View className="flex-row items-center gap-1.5">
          <Text className="max-w-[45%] text-[15px] text-[#FAFAFA]" numberOfLines={1}>
            {conversation.name}
          </Text>

          {conversation.isVerified ? <BadgeCheck color="#10B981" size={14} /> : null}

          <View
            className="rounded-full border px-1.5 py-0.5"
            style={{ backgroundColor: `${roleColor}20`, borderColor: `${roleColor}40` }}
          >
            <Text className="text-[10px] font-bold capitalize" style={{ color: roleColor }}>
              {conversation.role}
            </Text>
          </View>
        </View>

        <Text className="mt-0.5 text-xs text-[#525252]">{conversation.company}</Text>

        {conversation.isTyping ? (
          <Text className="mt-1 text-[13px] italic text-[#10B981]">typing...</Text>
        ) : (
          <View className="mt-1 flex-row items-center gap-1">
            {conversation.messageStatus === 'read' ? <CheckCheck color="#10B981" size={13} /> : null}
            {conversation.messageStatus === 'delivered' ? <CheckCheck color="#525252" size={13} /> : null}
            {conversation.messageStatus === 'sent' ? <Check color="#525252" size={13} /> : null}
            <Text
              className="flex-1 text-[13px]"
              style={{
                color: conversation.unreadCount > 0 ? '#A3A3A3' : '#525252',
                fontWeight: conversation.unreadCount > 0 ? '500' : '400',
              }}
              numberOfLines={1}
            >
              {conversation.lastMessage}
            </Text>
          </View>
        )}

        <View className="mt-1.5 flex-row items-center gap-1">
          {[1, 2, 3, 4].map((stage) => (
            <View
              key={stage}
              className="h-[3px] flex-1 rounded"
              style={{ backgroundColor: stage <= conversation.dealStage ? '#10B981' : '#1F1F1F' }}
            />
          ))}
          <Text className="ml-1 text-[10px] font-semibold text-[#10B981]">{DEAL_STAGES[conversation.dealStage - 1]}</Text>
        </View>
      </View>

      {/* ============================================ */}
      {/* META COLUMN */}
      {/* ============================================ */}
      <View className="items-end gap-1.5">
        <Text
          className="text-xs"
          style={{ color: conversation.unreadCount > 0 ? '#10B981' : '#525252', fontWeight: conversation.unreadCount > 0 ? '600' : '400' }}
        >
          {conversation.lastMessageTime}
        </Text>

        {conversation.unreadCount > 0 ? (
          <View className="h-5 w-5 items-center justify-center rounded-full bg-[#10B981]">
            <Text className="text-[11px] font-bold text-[#FAFAFA]">{conversation.unreadCount}</Text>
          </View>
        ) : null}

        <View className="flex-row items-center gap-1">
          {ndaInfo.icon === 'unlocked' ? (
            <Unlock color="#10B981" size={12} />
          ) : (
            <Lock color={ndaInfo.icon === 'pending' ? '#F59E0B' : '#525252'} size={12} />
          )}
          <Text className="text-[9px] font-semibold" style={{ color: ndaInfo.color }}>
            {ndaInfo.label}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}
