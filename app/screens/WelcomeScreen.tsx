import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  StatusBar,
  Modal,
  Pressable,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';

const { width } = Dimensions.get('window');

type WelcomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Welcome'>;

interface Props {
  navigation: WelcomeScreenNavigationProp;
}

const slides = [
  {
    id: '1',
    type: 'image',
    // Startup team in a modern office — bold, premium look
    image: { uri: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=2160&q=100' },
    caption: 'Where bold ideas\nmeet bold capital.',
    accent: '#10B981',
  },
  {
    id: '2',
    type: 'quote',
    quote: 'The best investment you can make is in a founder who refuses to quit.',
    author: '— Reid Hoffman, Co-founder of LinkedIn',
    accent: '#10B981',
  },
  {
    id: '3',
    type: 'image',
    // Aerial city skyline at night — ambition, scale
    image: { uri: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2160&q=100' },
    caption: 'Build for the world.\nWe will fund it.',
    accent: '#A78BFA',
  },
  {
    id: '4',
    type: 'quote_image',
    // Modern finance / charts — investment theme
    image: { uri: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=2160&q=100' },
    quote: 'Every unicorn was once just a crazy idea looking for a believer.',
    author: '— FundHive',
    accent: '#F59E0B',
  },
];

const QuoteSlide = ({ slide }: { slide: typeof slides[0] }) => (
  <View style={[ss.container, { backgroundColor: '#0A0A0A' }]}>
    <LinearGradient colors={['#111111', '#0A0A0A']} style={StyleSheet.absoluteFill} />
    <Text style={[ss.quoteAccent, { color: slide.accent }]}>"</Text>
    <Text style={ss.quoteText}>{slide.quote}</Text>
    <View style={[ss.quoteDivider, { backgroundColor: slide.accent }]} />
    <Text style={ss.quoteAuthor}>{slide.author}</Text>
  </View>
);

const ImageSlide = ({ slide }: { slide: any }) => (
  <View style={ss.container}>
    <Image source={slide.image} style={StyleSheet.absoluteFill as any} resizeMode="cover" />
    <LinearGradient colors={['rgba(10,10,10,0.2)', 'rgba(10,10,10,0.75)']} style={StyleSheet.absoluteFill} />
    <View style={ss.captionWrapper}>
      <Text style={ss.captionText}>{slide.caption}</Text>
    </View>
  </View>
);

const QuoteImageSlide = ({ slide }: { slide: any }) => (
  <View style={ss.container}>
    <Image source={slide.image} style={StyleSheet.absoluteFill as any} resizeMode="cover" />
    <LinearGradient colors={['rgba(10,10,10,0.55)', 'rgba(10,10,10,0.88)']} style={StyleSheet.absoluteFill} />
    <View style={ss.quoteImageContent}>
      <View style={[ss.accentLine, { backgroundColor: slide.accent }]} />
      <Text style={ss.quoteImageText}>{slide.quote}</Text>
      <Text style={ss.quoteImageAuthor}>{slide.author}</Text>
    </View>
  </View>
);

const ImageQuoteSlide = ({ slide }: { slide: any }) => (
  <View style={ss.container}>
    <Image source={slide.image} style={ss.halfImage} resizeMode="cover" />
    <LinearGradient colors={['transparent', '#0A0A0A']} style={ss.halfGradient} />
    <View style={ss.imageQuoteBottom}>
      <View style={[ss.imageQuotePill, { borderColor: slide.accent }]}>
        <Text style={[ss.imageQuotePillText, { color: slide.accent }]}>FundHive</Text>
      </View>
      <Text style={ss.imageQuoteText}>{slide.quote}</Text>
    </View>
  </View>
);

export default function WelcomeScreen({ navigation }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const menuItems = [
    { label: 'About FundHive', onPress: () => setMenuOpen(false) },
    { label: 'How It Works', onPress: () => setMenuOpen(false) },
    { label: 'For Investors', onPress: () => setMenuOpen(false) },
    { label: 'For Founders', onPress: () => setMenuOpen(false) },
    { label: 'Contact Us', onPress: () => setMenuOpen(false) },
  ];

  const currentIndexRef = useRef(0);

  const startAutoPlay = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      const next = (currentIndexRef.current + 1) % slides.length;
      currentIndexRef.current = next;
      setActiveSlide(next);
      flatListRef.current?.scrollToIndex({ index: next, animated: true });
    }, 3500);
  };

  useEffect(() => {
    startAutoPlay();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const renderSlide = ({ item }: { item: typeof slides[0] }) => {
    if (item.type === 'quote') return <QuoteSlide slide={item} />;
    if (item.type === 'image') return <ImageSlide slide={item} />;
    if (item.type === 'quote_image') return <QuoteImageSlide slide={item} />;
    return <ImageQuoteSlide slide={item} />;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />

      <SafeAreaView edges={['top']} style={styles.header}>
        <Image source={require('../../assets/images/logo.png')} style={styles.logo} resizeMode="contain" />
        <TouchableOpacity style={styles.menuBtn} onPress={() => setMenuOpen(true)} activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <View style={styles.hamburgerLine} />
          <View style={[styles.hamburgerLine, { width: 18 }]} />
          <View style={styles.hamburgerLine} />
        </TouchableOpacity>
      </SafeAreaView>

      <Modal visible={menuOpen} transparent animationType="fade" onRequestClose={() => setMenuOpen(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setMenuOpen(false)}>
          <View style={styles.dropdown}>
            {menuItems.map((item, index) => (
              <TouchableOpacity key={index}
                style={[styles.dropdownItem, index < menuItems.length - 1 && styles.dropdownItemBorder]}
                onPress={item.onPress} activeOpacity={0.7}>
                <Text style={styles.dropdownItemText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>

      <View style={styles.heroSection}>
        <FlatList
          ref={flatListRef}
          data={slides}
          renderItem={renderSlide}
          keyExtractor={item => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScrollBeginDrag={() => { if (timerRef.current) clearInterval(timerRef.current); }}
          onMomentumScrollEnd={(e) => {
            const index = Math.round(e.nativeEvent.contentOffset.x / width);
            currentIndexRef.current = index;
            setActiveSlide(index);
            startAutoPlay();
          }}
          getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
          scrollEventThrottle={16}
        />

        <View style={styles.dotsWrapper}>
          {slides.map((_, i) => (
            <TouchableOpacity key={i} onPress={() => {
              if (timerRef.current) clearInterval(timerRef.current);
              currentIndexRef.current = i;
              flatListRef.current?.scrollToIndex({ index: i, animated: true });
              setActiveSlide(i);
              startAutoPlay();
            }}>
              <View style={[styles.dot, i === activeSlide && styles.dotActive]} />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.bottomSection}>
        <TouchableOpacity style={styles.createBtn} onPress={() => navigation.navigate('Register')} activeOpacity={0.88}>
          <Text style={styles.createBtnText}>Create Account</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginBtn} onPress={() => navigation.navigate('Login')} activeOpacity={0.88}>
          <Text style={styles.loginBtnText}>Log In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const ss = StyleSheet.create({
  container: { width, flex: 1, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  quoteAccent: { fontSize: 96, fontWeight: '900', lineHeight: 80, marginBottom: 8, alignSelf: 'flex-start', marginLeft: 28 },
  quoteText: { color: '#FFFFFF', fontSize: 22, fontWeight: '700', lineHeight: 34, paddingHorizontal: 28, letterSpacing: -0.3, textAlign: 'left' },
  quoteDivider: { width: 40, height: 3, borderRadius: 2, marginTop: 24, marginBottom: 14, alignSelf: 'flex-start', marginLeft: 28 },
  quoteAuthor: { color: '#A1A1AA', fontSize: 13, fontWeight: '500', paddingHorizontal: 28, alignSelf: 'flex-start', letterSpacing: 0.2 },
  captionWrapper: { position: 'absolute', bottom: 40, left: 28, right: 28 },
  captionText: { color: '#FFFFFF', fontSize: 26, fontWeight: '800', letterSpacing: -0.5, lineHeight: 34 },
  quoteImageContent: { position: 'absolute', bottom: 40, left: 28, right: 28 },
  accentLine: { width: 36, height: 3, borderRadius: 2, marginBottom: 16 },
  quoteImageText: { color: '#FFFFFF', fontSize: 20, fontWeight: '700', lineHeight: 30, letterSpacing: -0.2, marginBottom: 10 },
  quoteImageAuthor: { color: '#A1A1AA', fontSize: 13, fontWeight: '500' },
  halfImage: { position: 'absolute', top: 0, left: 0, right: 0, height: '60%', width },
  halfGradient: { position: 'absolute', top: '30%', left: 0, right: 0, height: '70%' },
  imageQuoteBottom: { position: 'absolute', bottom: 36, left: 28, right: 28 },
  imageQuotePill: { borderWidth: 1.5, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4, alignSelf: 'flex-start', marginBottom: 14 },
  imageQuotePillText: { fontSize: 11, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' },
  imageQuoteText: { color: '#FFFFFF', fontSize: 24, fontWeight: '800', lineHeight: 33, letterSpacing: -0.5 },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  header: { backgroundColor: '#0A0A0A', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.07)' },
  logo: { width: 100, height: 48 },
  menuBtn: { gap: 5, alignItems: 'flex-end', justifyContent: 'center', padding: 4 },
  hamburgerLine: { width: 24, height: 2, backgroundColor: '#FFFFFF', borderRadius: 2 },
  modalOverlay: { flex: 1, backgroundColor: 'transparent' },
  dropdown: { position: 'absolute', top: 90, right: 16, backgroundColor: '#FFFFFF', borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.18, shadowRadius: 20, elevation: 12, minWidth: 200, overflow: 'hidden' },
  dropdownItem: { paddingVertical: 15, paddingHorizontal: 20 },
  dropdownItemBorder: { borderBottomWidth: 1, borderBottomColor: '#F4F4F5' },
  dropdownItemText: { color: '#0A0A0A', fontSize: 15, fontWeight: '500' },
  heroSection: { flex: 1, backgroundColor: '#0A0A0A' },
  dotsWrapper: { position: 'absolute', bottom: 16, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.3)' },
  dotActive: { width: 22, height: 6, borderRadius: 3, backgroundColor: '#10B981' },
  bottomSection: { backgroundColor: '#0A0A0A', paddingHorizontal: 24, paddingTop: 16, paddingBottom: 44, gap: 12 },
  createBtn: { backgroundColor: '#FFFFFF', borderRadius: 50, paddingVertical: 17, alignItems: 'center', shadowColor: '#FFFFFF', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 6 },
  createBtnText: { color: '#0A0A0A', fontSize: 16, fontWeight: '700', letterSpacing: 0.2 },
  loginBtn: { borderRadius: 50, paddingVertical: 17, alignItems: 'center', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.25)' },
  loginBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600', letterSpacing: 0.2 },
});
