import React from 'react'
import { router } from 'expo-router'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import RegisterScreen from './screens/RegisterScreen'
import { RootStackParamList } from '../types'

type Nav = NativeStackNavigationProp<RootStackParamList, 'Register'>

export default function RegisterRoute(): React.JSX.Element {
  const navigation: Nav = {
    navigate: ((screen: keyof RootStackParamList, params?: RootStackParamList[keyof RootStackParamList]) => {
      if (screen === 'Login') {
        router.push('/login')
        return
      }

      if (screen === 'Verification') {
        const verificationParams = params as RootStackParamList['Verification'] | undefined
        router.push({
          pathname: '/verification',
          params: {
            role: verificationParams?.role ?? 'founder',
            fullName: verificationParams?.fullName ?? 'User',
          },
        })
      }
    }) as Nav['navigate'],
    goBack: (() => router.back()) as Nav['goBack'],
  } as Nav

  return <RegisterScreen navigation={navigation} />
}
