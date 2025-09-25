import { AppText } from '@/components/AppText'; // ✅ custom text
import { Screen } from '@/components/Screen'; // ✅ custom wrapper
import { supabase } from '@/lib/supabase';
import { buttonStyle, buttonTextStyle, COLORS, FONTS, GAP, inputStyle } from '@/lib/theme';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Pressable, Text, TextInput, View } from 'react-native';

export default function LoginScreen() {
  const [session, setSession] = useState<Session | null>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_e: AuthChangeEvent, s: Session | null) => setSession(s)
    );
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) router.replace('/welcome');
  }, [session]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function signUp() {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) Alert.alert('Sign up error', error.message);
    else router.replace('/welcome');
  }

  async function signIn() {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) Alert.alert('Sign in error', error.message);
    else router.replace('/welcome');
  }

  return (
    <Screen center>
      <AppText variant="heading" style={{ fontSize: 22, marginBottom: GAP }}>
        Login
      </AppText>

      <TextInput
        placeholder="Email"
        placeholderTextColor={COLORS.border}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={inputStyle}
      />

      <View style={{ height: GAP }} />

      <TextInput
        placeholder="Password"
        placeholderTextColor={COLORS.border}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={inputStyle}
      />

      <View style={{ height: GAP * 1.5 }} />

      <Pressable style={buttonStyle} onPress={signIn} android_ripple={{ color: COLORS.hover }}>
        <Text style={buttonTextStyle}>Sign In</Text>
      </Pressable>

      <View style={{ height: GAP }} />

      <Pressable
        style={[buttonStyle, { backgroundColor: COLORS.cta }]}
        onPress={signUp}
        android_ripple={{ color: COLORS.hover }}
      >
        <Text style={{ fontFamily: FONTS.heading, color: COLORS.text }}>Sign Up</Text>
      </Pressable>
    </Screen>
  );
}
