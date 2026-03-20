import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  Share,
  Text,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Bookmark,
  Building2,
  Check,
  FileText,
  Pause,
  Play,
  Share2,
  Sparkles,
} from 'lucide-react-native';
import YoutubeIframe from 'react-native-youtube-iframe';

import { FEATURED_PITCHES } from '../data/featuredPitches';
import type { Pitch } from '../types';

const SCREEN_WIDTH = Dimensions.get('window').width;
const AI_SUMMARY_POINTS = [
  'Strong market opportunity identified',
  'Clear revenue model presented',
  'Experienced founding team',
];

export default function PitchPlayerScreen(): React.JSX.Element {
  const { pitchData } = useLocalSearchParams<{ pitchData?: string }>();
  const [playing, setPlaying] = useState<boolean>(false);

  // Section: Build a simple entrance animation for the player screen content.
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateAnim = useRef(new Animated.Value(24)).current;

  // Section: Parse the serialized pitch object from route params with a safe fallback.
  const pitch = useMemo<Pitch | null>(() => {
    try {
      return JSON.parse(pitchData as string) as Pitch;
    } catch {
      return null;
    }
  }, [pitchData]);

  // Section: Select three related pitches from the same source array for the recommendation row.
  const similarPitches = useMemo(
    () => FEATURED_PITCHES.filter((item) => item.id !== pitch?.id).slice(0, 3),
    [pitch?.id],
  );

  useEffect(() => {
    // Section: Animate the details pane into view after the screen mounts.
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 450,
        useNativeDriver: true,
      }),
      Animated.timing(translateAnim, {
        toValue: 0,
        duration: 450,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, translateAnim]);

  // Section: Share the currently viewed pitch as a standard YouTube link.
  const handleShare = async (): Promise<void> => {
    if (!pitch) {
      return;
    }

    await Share.share({
      message: `${pitch.startupName} pitch: https://www.youtube.com/watch?v=${pitch.videoId}`,
    });
  };

  // Section: Keep custom playback UI in sync with the embedded YouTube player.
  const handleStateChange = (state: string): void => {
    if (state === 'ended' || state === 'paused') {
      setPlaying(false);
    }

    if (state === 'playing') {
      setPlaying(true);
    }
  };

  // Section: Render compact cards for related pitches in the recommendation row.
  const renderSimilarPitch = (item: Pitch): React.JSX.Element => (
    <Pressable
      key={item.id}
      onPress={() =>
        router.push({
          pathname: '/pitch-player',
          params: { pitchData: JSON.stringify(item) },
        })
      }
      className="mr-4 w-[220px] overflow-hidden rounded-3xl border border-[#1F1F1F] bg-[#141414]"
    >
      {/* Section: Thumbnail preview for a similar pitch recommendation. */}
      <View className="relative h-32 w-full overflow-hidden">
        <Image source={{ uri: item.thumbnail }} className="h-full w-full" resizeMode="cover" />
        <View className="absolute inset-0 bg-black/20" />
        <View className="absolute bottom-3 left-3 rounded-full bg-black/70 px-3 py-1">
          <Text className="text-xs font-semibold text-[#FAFAFA]">{item.duration}</Text>
        </View>
        <View className="absolute inset-0 items-center justify-center">
          <View className="h-11 w-11 items-center justify-center rounded-full bg-[#10B981]">
            <Play size={18} color="#FFFFFF" fill="#FFFFFF" />
          </View>
        </View>
      </View>

      {/* Section: Summary details for each recommendation card. */}
      <View className="p-4">
        <Text className="text-base font-bold text-[#FAFAFA]">{item.startupName}</Text>
        <Text className="mt-1 text-sm text-[#A3A3A3]">{item.tagline}</Text>
      </View>
    </Pressable>
  );

  if (!pitch) {
    return (
      <SafeAreaView className="flex-1 bg-[#0A0A0A]">
        <StatusBar style="dark" />

        {/* Section: Fallback state when the pitch payload is unavailable or invalid. */}
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-2xl font-bold text-[#FAFAFA]">Pitch unavailable</Text>
          <Text className="mt-3 text-center text-sm text-[#A3A3A3]">
            This pitch could not be loaded from the current route parameters.
          </Text>
          <Pressable
            onPress={() => router.back()}
            className="mt-6 rounded-full bg-[#10B981] px-5 py-3"
          >
            <Text className="font-semibold text-white">Go Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#0A0A0A]">
      <StatusBar style="dark" />

      {/* Section: Top navigation bar with back, title, and share actions. */}
      <View className="flex-row items-center justify-between px-5 pb-4 pt-2">
        <Pressable
          onPress={() => router.back()}
          className="h-11 w-11 items-center justify-center rounded-full border border-[#1F1F1F] bg-[#141414]"
        >
          <ArrowLeft size={18} color="#FAFAFA" />
        </Pressable>

        <Text className="text-lg font-semibold text-[#FAFAFA]">Pitch Room</Text>

        <Pressable
          onPress={handleShare}
          className="h-11 w-11 items-center justify-center rounded-full border border-[#1F1F1F] bg-[#141414]"
        >
          <Share2 size={18} color="#FAFAFA" />
        </Pressable>
      </View>

      <Animated.View
        className="flex-1"
        style={{ opacity: fadeAnim, transform: [{ translateY: translateAnim }] }}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          {/* Section: Full-width embedded YouTube player with custom playback control. */}
          <View>
            <YoutubeIframe
              height={220}
              width={SCREEN_WIDTH}
              videoId={pitch.videoId}
              play={playing}
              onChangeState={handleStateChange}
              initialPlayerParams={{ controls: false, modestbranding: true, rel: false }}
            />

            <View className="px-5 pt-4">
              <Pressable
                onPress={() => setPlaying((current) => !current)}
                className="flex-row items-center justify-center rounded-2xl bg-[#10B981] px-4 py-3"
              >
                {playing ? (
                  <Pause size={18} color="#FFFFFF" />
                ) : (
                  <Play size={18} color="#FFFFFF" fill="#FFFFFF" />
                )}
                <Text className="ml-2 text-sm font-semibold text-white">
                  {playing ? 'Pause Pitch' : 'Play Pitch'}
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Section: Startup identity block with founder and funding context. */}
          <View className="px-5 pt-6">
            <Text className="text-3xl font-bold text-[#FAFAFA]">{pitch.startupName}</Text>

            <View className="mt-4 flex-row items-center flex-wrap">
              <Text className="mr-3 text-sm text-[#A3A3A3]">{pitch.founderName}</Text>
              <View className="rounded-full border border-[#1F1F1F] bg-[#141414] px-3 py-1">
                <Text className="text-xs text-[#A3A3A3]">{pitch.industry}</Text>
              </View>
            </View>

            <View className="mt-4 flex-row flex-wrap">
              {pitch.verified ? (
                <View className="mr-2 mb-2 flex-row items-center rounded-full bg-[#10B981] px-3 py-1.5">
                  <Check size={14} color="#FFFFFF" strokeWidth={3} />
                  <Text className="ml-2 text-xs font-semibold text-white">Verified</Text>
                </View>
              ) : null}

              {pitch.vouched ? (
                <View className="mb-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5">
                  <Text className="text-xs font-semibold text-[#10B981]">Vouched ✓</Text>
                </View>
              ) : null}
            </View>

            <View className="mt-4 flex-row items-center">
              <Building2 size={18} color="#10B981" />
              <Text className="ml-2 text-sm text-[#A3A3A3]">{pitch.incubator}</Text>
            </View>

            <Text className="mt-5 text-3xl font-bold text-[#10B981]">{pitch.askAmount}</Text>

            <View className="mt-3 self-start rounded-full border border-[#1F1F1F] bg-[#141414] px-3 py-1.5">
              <Text className="text-xs text-[#A3A3A3]">{pitch.fundingStage}</Text>
            </View>

            <View className="mt-6 h-px bg-[#1F1F1F]" />
          </View>

          {/* Section: About block using the startup tagline as the pitch summary description. */}
          <View className="px-5 pt-6">
            <Text className="text-lg font-semibold text-[#FAFAFA]">About this Pitch</Text>
            <Text className="mt-3 text-sm leading-6 text-[#A3A3A3]">{pitch.tagline}</Text>
          </View>

          {/* Section: AI summary card with placeholder bullets and model attribution. */}
          <View className="px-5 pt-6">
            <View className="rounded-3xl border border-emerald-500/20 bg-[#141414] p-5">
              <View className="flex-row items-center">
                <View className="mr-3 rounded-2xl bg-emerald-500/10 p-3">
                  <Sparkles size={18} color="#10B981" />
                </View>
                <Text className="text-lg font-semibold text-[#10B981]">AI Summary</Text>
              </View>

              {AI_SUMMARY_POINTS.map((summaryPoint) => (
                <Text key={summaryPoint} className="mt-4 text-sm leading-6 text-[#A3A3A3]">
                  • {summaryPoint}
                </Text>
              ))}

              <Text className="mt-4 text-xs text-[#525252]">Powered by Gemini AI</Text>
            </View>
          </View>

          {/* Section: Primary investor actions for document requests and bookmarking. */}
          <View className="px-5 pt-6">
            <View className="flex-row">
              <Pressable className="mr-3 flex-1 flex-row items-center justify-center rounded-2xl bg-[#10B981] px-4 py-3.5">
                <FileText size={18} color="#FFFFFF" />
                <Text className="ml-2 text-sm font-semibold text-white">Request Documents</Text>
              </Pressable>

              <Pressable className="flex-1 flex-row items-center justify-center rounded-2xl border border-[#1F1F1F] bg-[#141414] px-4 py-3.5">
                <Bookmark size={18} color="#FAFAFA" />
                <Text className="ml-2 text-sm font-semibold text-[#FAFAFA]">Bookmark</Text>
              </Pressable>
            </View>
          </View>

          {/* Section: Recommendation rail for related startup pitches from the shared dataset. */}
          <View className="pt-8">
            <View className="mb-4 px-5">
              <Text className="text-xl font-bold text-[#FAFAFA]">More Like This</Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
              {similarPitches.map(renderSimilarPitch)}
            </ScrollView>
          </View>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}