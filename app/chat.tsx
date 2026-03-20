import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  useWindowDimensions,
} from 'react-native'
import {
  ArrowLeft,
  Video,
  MoreVertical,
  Shield,
  Lock,
  Send,
  Paperclip,
  FileText,
  CheckCheck,
  Check,
  X,
  TrendingUp,
  Star,
} from 'lucide-react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

// ============================================
// TYPESCRIPT INTERFACES
// ============================================

interface Message {
  id: string
  senderId: 'me' | 'other' | 'system'
  text: string
  timestamp: string
  status: 'sent' | 'delivered' | 'read'
  type: 'text' | 'document' | 'nda' | 'system' | 'deal_update'
  documentName?: string
  documentSize?: string
}

interface ContactProfile {
  id: string
  name: string
  company: string
  role: 'Investor' | 'Incubator'
  initials: string
  avatarColor: string
  roleColor: string
  isOnline: boolean
  dealStage: 1 | 2 | 3 | 4
}

// ============================================
// STATIC DATA
// ============================================

const DEAL_STAGES = ['Connected', 'NDA Signed', 'Docs Shared', 'Meeting Set'] as const

const CONTACTS: ContactProfile[] = [
  {
    id: '1',
    name: 'Rahul Mehta',
    company: 'Sequoia Capital India',
    role: 'Investor',
    initials: 'RM',
    avatarColor: '#6366F1',
    roleColor: '#6366F1',
    isOnline: true,
    dealStage: 3,
  },
  {
    id: '2',
    name: 'Priya Reddy',
    company: 'T-Hub Hyderabad',
    role: 'Incubator',
    initials: 'PR',
    avatarColor: '#10B981',
    roleColor: '#10B981',
    isOnline: true,
    dealStage: 4,
  },
  {
    id: '3',
    name: 'Vikram Singh',
    company: 'Accel Partners',
    role: 'Investor',
    initials: 'VS',
    avatarColor: '#F59E0B',
    roleColor: '#F59E0B',
    isOnline: false,
    dealStage: 2,
  },
]

const MESSAGES: Message[] = [
  {
    id: 'm1',
    senderId: 'other',
    text: 'Hi! I came across your startup NeuroLend on FundHive. The AI credit scoring approach is very interesting.',
    timestamp: '10:30 AM',
    status: 'read',
    type: 'text',
  },
  {
    id: 'm2',
    senderId: 'me',
    text: 'Thank you so much! We have been working on this for 2 years. Our model achieves 89% accuracy using alternative data.',
    timestamp: '10:32 AM',
    status: 'read',
    type: 'text',
  },
  {
    id: 'sys1',
    senderId: 'system',
    text: 'Deal Room created. All messages are end-to-end encrypted.',
    timestamp: '10:30 AM',
    status: 'read',
    type: 'system',
  },
  {
    id: 'm3',
    senderId: 'other',
    text: 'Would you be able to share your pitch deck and financial projections? I would need to sign an NDA first.',
    timestamp: '10:35 AM',
    status: 'read',
    type: 'text',
  },
  {
    id: 'nda1',
    senderId: 'system',
    text: 'NDA Request',
    timestamp: '10:36 AM',
    status: 'read',
    type: 'nda',
  },
  {
    id: 'sys2',
    senderId: 'system',
    text: 'Rahul Mehta signed the NDA. Document sharing is now unlocked.',
    timestamp: '10:40 AM',
    status: 'read',
    type: 'system',
  },
  {
    id: 'm4',
    senderId: 'me',
    text: 'Perfect! I have shared the documents below. Let me know if you need anything else.',
    timestamp: '10:41 AM',
    status: 'read',
    type: 'text',
  },
  {
    id: 'doc1',
    senderId: 'me',
    text: 'Document shared',
    timestamp: '10:41 AM',
    status: 'read',
    type: 'document',
    documentName: 'NeuroLend_Pitch_Deck_2025.pdf',
    documentSize: '4.2 MB',
  },
  {
    id: 'doc2',
    senderId: 'me',
    text: 'Document shared',
    timestamp: '10:42 AM',
    status: 'read',
    type: 'document',
    documentName: 'Financial_Projections_FY26.xlsx',
    documentSize: '1.8 MB',
  },
  {
    id: 'm5',
    senderId: 'other',
    text: 'I reviewed your deck. Very impressed with the traction numbers. 18% MoM growth is exceptional.',
    timestamp: '2:15 PM',
    status: 'read',
    type: 'text',
  },
  {
    id: 'deal1',
    senderId: 'system',
    text: 'Deal stage updated to Meeting Scheduled',
    timestamp: '2:16 PM',
    status: 'read',
    type: 'deal_update',
  },
  {
    id: 'm6',
    senderId: 'other',
    text: 'Can we schedule a call this week to discuss potential investment terms?',
    timestamp: '2:17 PM',
    status: 'delivered',
    type: 'text',
  },
]

// ============================================
// CHAT SCREEN COMPONENT
// ============================================

export default function ChatScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets()
  const { width } = useWindowDimensions()
  const { conversationId } = useLocalSearchParams<{ conversationId?: string }>()
  const [messageText, setMessageText] = useState('')
  const [messages, setMessages] = useState<Message[]>(MESSAGES)
  const [showNDA, setShowNDA] = useState(false)
  const scrollViewRef = useRef<ScrollView>(null)
  const compactStageLabels = width < 390

  // ============================================
  // CURRENT CONTACT DATA
  // ============================================

  const contact = useMemo(() => {
    const found = CONTACTS.find((entry) => entry.id === conversationId)
    return found ?? CONTACTS[0]
  }, [conversationId])

  // ============================================
  // AUTO SCROLL ON MOUNT
  // ============================================

  useEffect(() => {
    const timeout = setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: false })
    }, 120)

    return () => clearTimeout(timeout)
  }, [])

  // ============================================
  // SEND MESSAGE ACTION
  // ============================================

  const sendMessage = (): void => {
    if (!messageText.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      text: messageText.trim(),
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      status: 'sent',
      type: 'text',
    }

    setMessages((previous) => [...previous, newMessage])
    setMessageText('')

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true })
    }, 100)
  }

  return (
    <SafeAreaView edges={['top', 'left', 'right']} className="flex-1 bg-[#0A0A0A]">
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />

      {/* ============================================ */}
      {/* CHAT TOP BAR */}
      {/* ============================================ */}
      <View className="flex-row items-center gap-3 border-b border-[#1F1F1F] px-4 py-2.5">
        <TouchableOpacity
          onPress={() => router.back()}
          className="h-9 w-9 items-center justify-center rounded-full bg-[#141414]"
        >
          <ArrowLeft color="#FAFAFA" size={18} />
        </TouchableOpacity>

        <View
          className="h-10 w-10 items-center justify-center rounded-full"
          style={{ backgroundColor: contact.avatarColor }}
        >
          <Text className="text-sm font-bold text-[#FAFAFA]">{contact.initials}</Text>
        </View>

        <View className="flex-1">
          <View className="flex-row items-center gap-1.5">
            <Text className="text-base font-bold text-[#FAFAFA]">{contact.name}</Text>
            <Star color="#10B981" size={13} fill="#10B981" />
            <View className="rounded-full px-2 py-0.5" style={{ backgroundColor: `${contact.roleColor}33` }}>
              <Text className="text-[10px] font-bold" style={{ color: contact.roleColor }}>
                {contact.role}
              </Text>
            </View>
          </View>
          <Text className="mt-0.5 text-[11px] text-[#10B981]">
            {contact.isOnline ? 'Online' : 'Away'} • {contact.company}
          </Text>
        </View>

        <View className="flex-row gap-2">
          <TouchableOpacity className="h-9 w-9 items-center justify-center rounded-full border border-[#10B981] bg-[#141414]">
            <Video color="#10B981" size={17} />
          </TouchableOpacity>
          <TouchableOpacity className="h-9 w-9 items-center justify-center rounded-full border border-[#1F1F1F] bg-[#141414]">
            <MoreVertical color="#A3A3A3" size={17} />
          </TouchableOpacity>
        </View>
      </View>

      {/* ============================================ */}
      {/* DEAL PROGRESS BAR */}
      {/* ============================================ */}
      <View className="border-b border-[#1F1F1F] bg-[#141414] px-4 py-2.5">
        <View className="mb-2 flex-row items-center justify-between">
          <Text className="text-[10px] font-bold tracking-[1px] text-[#525252]">DEAL PROGRESS</Text>
          <Text className="text-[11px] font-semibold text-[#10B981]">
            Stage {contact.dealStage}: {DEAL_STAGES[contact.dealStage - 1]}
          </Text>
        </View>

        <View className="flex-row items-center gap-1.5">
          {DEAL_STAGES.map((stage, index) => {
            const completed = index + 1 <= contact.dealStage
            const active = index + 1 === contact.dealStage

            return (
              <React.Fragment key={stage}>
                <View className="items-center gap-1">
                  <View
                    className="h-[22px] w-[22px] items-center justify-center rounded-full"
                    style={{
                      backgroundColor: completed ? '#10B981' : '#1F1F1F',
                      borderColor: active ? '#10B981' : 'transparent',
                      borderWidth: active ? 2 : 0,
                    }}
                  >
                    {completed ? (
                      <Check color="#FAFAFA" size={12} />
                    ) : (
                      <Text className="text-[10px] font-bold text-[#525252]">{index + 1}</Text>
                    )}
                  </View>
                  <Text className="max-w-[62px] text-center text-[9px] font-semibold" style={{ color: completed ? '#10B981' : '#525252' }}>
                    {compactStageLabels
                      ? stage === 'Connected'
                        ? 'Connect'
                        : stage === 'NDA Signed'
                          ? 'NDA'
                          : stage === 'Docs Shared'
                            ? 'Docs'
                            : 'Meeting'
                      : stage}
                  </Text>
                </View>

                {index < DEAL_STAGES.length - 1 ? (
                  <View
                    className="mb-3 h-0.5 flex-1"
                    style={{ backgroundColor: index + 1 < contact.dealStage ? '#10B981' : '#1F1F1F' }}
                  />
                ) : null}
              </React.Fragment>
            )
          })}
        </View>
      </View>

      {/* ============================================ */}
      {/* ENCRYPTION BANNER */}
      {/* ============================================ */}
      <View className="flex-row items-center justify-center gap-1.5 bg-[#10B9810D] py-1.5">
        <Shield color="#10B981" size={11} />
        <Text className="text-[11px] text-[#525252]">End-to-end encrypted • Zero knowledge</Text>
      </View>

      {/* ============================================ */}
      {/* MESSAGE STREAM + INPUT */}
      {/* ============================================ */}
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={0}>
        <ScrollView
          ref={scrollViewRef}
          className="flex-1"
          contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 18 }}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} onPressSignNDA={() => setShowNDA(true)} />
          ))}
        </ScrollView>

        {/* ============================================ */}
        {/* NDA SLIDE PANEL */}
        {/* ============================================ */}
        {showNDA ? (
          <View className="mx-4 mb-2 rounded-2xl border border-[#1F1F1F] bg-[#141414] p-4">
            <View className="mb-2 flex-row items-start justify-between">
              <View className="flex-row items-center gap-2">
                <Lock color="#10B981" size={16} />
                <Text className="text-sm font-bold text-[#FAFAFA]">NDA Confirmed</Text>
              </View>
              <TouchableOpacity onPress={() => setShowNDA(false)} className="h-6 w-6 items-center justify-center rounded-full bg-[#0A0A0A]">
                <X color="#A3A3A3" size={14} />
              </TouchableOpacity>
            </View>
            <Text className="text-xs leading-5 text-[#A3A3A3]">
              This conversation is now document-enabled and protected under mutual confidentiality terms.
            </Text>
          </View>
        ) : null}

        {/* ============================================ */}
        {/* INPUT BAR */}
        {/* ============================================ */}
        <View
          className="flex-row items-center gap-2.5 border-t border-[#1F1F1F] bg-[#0A0A0A] px-4 pt-2.5"
          style={{ paddingBottom: Math.max(insets.bottom, 10) }}
        >
          <TouchableOpacity className="h-[38px] w-[38px] items-center justify-center rounded-full border border-[#1F1F1F] bg-[#141414]">
            <Paperclip color="#A3A3A3" size={18} />
          </TouchableOpacity>

          <View className="min-h-[44px] flex-1 justify-center rounded-full border border-[#1F1F1F] bg-[#141414] px-4 py-2">
            <TextInput
              value={messageText}
              onChangeText={setMessageText}
              placeholder="Type a secure message..."
              placeholderTextColor="#525252"
              className="text-sm text-[#FAFAFA]"
              multiline
              maxLength={1200}
            />
          </View>

          <TouchableOpacity
            onPress={sendMessage}
            disabled={!messageText.trim()}
            className="h-11 w-11 items-center justify-center rounded-full border"
            style={{
              backgroundColor: messageText.trim() ? '#10B981' : '#141414',
              borderColor: messageText.trim() ? '#10B981' : '#1F1F1F',
            }}
          >
            <Send color={messageText.trim() ? '#FAFAFA' : '#525252'} size={18} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

// ============================================
// MESSAGE BUBBLE COMPONENT
// ============================================

interface MessageBubbleProps {
  message: Message
  onPressSignNDA: () => void
}

const MessageBubble = ({ message, onPressSignNDA }: MessageBubbleProps): React.JSX.Element => {
  const isMe = message.senderId === 'me'
  const isSystem = message.senderId === 'system'

  // ============================================
  // SYSTEM MESSAGE
  // ============================================
  if (isSystem && message.type === 'system') {
    return (
      <View className="my-1 items-center">
        <View className="flex-row items-center gap-1.5 rounded-full border border-[#1F1F1F] bg-[#141414] px-3.5 py-1.5">
          <Shield color="#10B981" size={11} />
          <Text className="text-[11px] text-[#525252]">{message.text}</Text>
        </View>
      </View>
    )
  }

  // ============================================
  // DEAL UPDATE MESSAGE
  // ============================================
  if (message.type === 'deal_update') {
    return (
      <View className="my-1 items-center">
        <View className="flex-row items-center gap-2 rounded-xl border border-[#10B9814D] bg-[#10B9811A] px-4 py-2">
          <TrendingUp color="#10B981" size={14} />
          <Text className="text-xs font-semibold text-[#10B981]">{message.text}</Text>
        </View>
      </View>
    )
  }

  // ============================================
  // NDA CARD MESSAGE
  // ============================================
  if (message.type === 'nda') {
    return (
      <View className="my-2 items-center">
        <View className="w-[85%] items-center gap-2 rounded-2xl border border-[#1F1F1F] bg-[#141414] p-4">
          <Lock color="#10B981" size={24} />
          <Text className="text-[15px] font-bold text-[#FAFAFA]">NDA Agreement</Text>
          <Text className="text-center text-xs leading-[18px] text-[#A3A3A3]">
            Sign to unlock document sharing and access pitch materials
          </Text>
          <TouchableOpacity onPress={onPressSignNDA} className="mt-1 rounded-full bg-[#10B981] px-6 py-2.5">
            <Text className="text-[13px] font-bold text-[#FAFAFA]">Sign NDA</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  // ============================================
  // DOCUMENT CARD MESSAGE
  // ============================================
  if (message.type === 'document') {
    return (
      <View className="my-0.5 max-w-[75%]" style={{ alignSelf: isMe ? 'flex-end' : 'flex-start' }}>
        <View
          className="flex-row items-center gap-2.5 rounded-2xl border p-3"
          style={{
            backgroundColor: isMe ? 'rgba(16,185,129,0.15)' : '#141414',
            borderColor: isMe ? 'rgba(16,185,129,0.4)' : '#1F1F1F',
          }}
        >
          <View
            className="h-10 w-10 items-center justify-center rounded-lg"
            style={{ backgroundColor: isMe ? 'rgba(16,185,129,0.2)' : '#1F1F1F' }}
          >
            <FileText color="#10B981" size={20} />
          </View>

          <View className="flex-1">
            <Text className="text-[13px] font-semibold text-[#FAFAFA]" numberOfLines={1}>
              {message.documentName}
            </Text>
            <Text className="mt-0.5 text-[11px] text-[#525252]">{message.documentSize}</Text>
          </View>

          <TouchableOpacity>
            <Text className="text-xs font-bold text-[#10B981]">View</Text>
          </TouchableOpacity>
        </View>

        <Text className="mt-0.5 text-[10px] text-[#525252]" style={{ alignSelf: isMe ? 'flex-end' : 'flex-start' }}>
          {message.timestamp}
        </Text>
      </View>
    )
  }

  // ============================================
  // REGULAR TEXT MESSAGE
  // ============================================
  return (
    <View className="my-0.5 max-w-[78%]" style={{ alignSelf: isMe ? 'flex-end' : 'flex-start' }}>
      <View
        className="border px-3.5 py-2.5"
        style={{
          backgroundColor: isMe ? '#10B981' : '#141414',
          borderColor: isMe ? '#10B981' : '#1F1F1F',
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          borderBottomLeftRadius: isMe ? 16 : 4,
          borderBottomRightRadius: isMe ? 4 : 16,
        }}
      >
        <Text className="text-sm leading-5 text-[#FAFAFA]">{message.text}</Text>
      </View>

      <View className="mt-0.5 flex-row items-center gap-1" style={{ alignSelf: isMe ? 'flex-end' : 'flex-start' }}>
        <Text className="text-[10px] text-[#525252]">{message.timestamp}</Text>
        {isMe ? (
          message.status === 'read' ? (
            <CheckCheck color="#10B981" size={13} />
          ) : message.status === 'delivered' ? (
            <CheckCheck color="#525252" size={13} />
          ) : (
            <Check color="#525252" size={13} />
          )
        ) : null}
      </View>
    </View>
  )
}
