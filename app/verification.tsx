import React from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router, useLocalSearchParams } from 'expo-router'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RouteProp } from '@react-navigation/native'
import VerificationScreen from './screens/VerificationScreen'
import { RootStackParamList } from '../types'

const USER_NAME_KEY = 'fundhive_user_name'

type Nav = NativeStackNavigationProp<RootStackParamList, 'Verification'>
type VerificationRoute = RouteProp<RootStackParamList, 'Verification'>

export default function VerificationRouteScreen(): React.JSX.Element {
  const params = useLocalSearchParams<{ role?: string; fullName?: string }>()

  const navigation: Nav = {
    navigate: ((screen: keyof RootStackParamList, navigateParams?: RootStackParamList[keyof RootStackParamList]) => {
      if (screen === 'Dashboard') {
        const dashboardParams = navigateParams as RootStackParamList['Dashboard'] | undefined
        const name = dashboardParams?.userName?.trim() || params.fullName?.trim() || 'Admin'
        void AsyncStorage.setItem(USER_NAME_KEY, name)
        router.replace('/(tabs)')
      }
    }) as Nav['navigate'],
    goBack: (() => router.back()) as Nav['goBack'],
  } as Nav

  const route = {
    key: 'VerificationRoute',
    name: 'Verification',
    params: {
      role: params.role ?? 'founder',
      fullName: params.fullName ?? 'User',
    },
  } as VerificationRoute

  return <VerificationScreen navigation={navigation} route={route} />
}
