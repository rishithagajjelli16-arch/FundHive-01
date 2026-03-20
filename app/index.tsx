import React from 'react'
import { router } from 'expo-router'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import WelcomeScreen from './screens/WelcomeScreen'
import { RootStackParamList } from '../types'

type Nav = NativeStackNavigationProp<RootStackParamList, 'Welcome'>

export default function WelcomeRoute(): React.JSX.Element {
  const navigation: Nav = {
    navigate: ((screen: keyof RootStackParamList) => {
      if (screen === 'Register') {
        router.push('/register')
        return
      }

      if (screen === 'Login') {
        router.push('/login')
      }
    }) as Nav['navigate'],
    goBack: (() => router.back()) as Nav['goBack'],
  } as Nav

  return <WelcomeScreen navigation={navigation} />
}
