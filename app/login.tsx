import React from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import LoginScreen from './screens/LoginScreen'
import { RootStackParamList } from '../types'

const USER_NAME_KEY = 'fundhive_user_name'
type Nav = NativeStackNavigationProp<RootStackParamList, 'Login'>

export default function LoginRoute(): React.JSX.Element {
  const navigation: Nav = {
    navigate: ((screen: keyof RootStackParamList, params?: RootStackParamList[keyof RootStackParamList]) => {
      if (screen === 'Register') {
        router.push('/register')
        return
      }

      if (screen === 'Dashboard') {
        const dashboardParams = params as RootStackParamList['Dashboard'] | undefined
        const name = dashboardParams?.userName?.trim() || 'Admin'
        void AsyncStorage.setItem(USER_NAME_KEY, name)
        router.replace('/(tabs)')
      }
    }) as Nav['navigate'],
    goBack: (() => router.back()) as Nav['goBack'],
  } as Nav

  return <LoginScreen navigation={navigation} />
}
