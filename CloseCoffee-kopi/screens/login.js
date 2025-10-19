// anton
import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/database';
import { colors } from '../styles/styles';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState(null);
//laver login + fejl meddelseser
  const onSignIn = async () => {
    setMsg(null);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);

    } catch (e) {
      setMsg(friendlyError(e));
    }
  };

  const onRegister = async () => {
    setMsg(null);
    try {
      await createUserWithEmailAndPassword(auth, email.trim(), password);
    } catch (e) {
      setMsg(friendlyError(e));
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.primaryText }]}>Welcome</Text>

      <TextInput
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="Email"
        placeholderTextColor={colors.mutedText}
        value={email}
        onChangeText={setEmail}
        style={[styles.input, { color: colors.primaryText, borderColor: colors.cardBackground }]}
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor={colors.mutedText}
        value={password}
        onChangeText={setPassword}
        style={[styles.input, { color: colors.primaryText, borderColor: colors.cardBackground }]}
      />

      {!!msg && <Text style={[styles.msg, { color: colors.primaryText }]}>{msg}</Text>}

      <TouchableOpacity onPress={onSignIn} style={[styles.btn, { backgroundColor: colors.accent }]}>
        <Text style={[styles.btnText, { color: colors.primaryText }]}>Sign in</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onRegister} style={[styles.btnSecondary, { borderColor: colors.accent }]}>
        <Text style={[styles.btnTextSecondary, { color: colors.primaryText }]}>Create account</Text>
      </TouchableOpacity>
    </View>
  );
}

function friendlyError(e) {
  const code = e?.code || '';
  if (code.includes('invalid-email')) return 'That email looks invalid.';
  if (code.includes('user-not-found')) return 'No account with that email.';
  if (code.includes('wrong-password')) return 'Wrong password.';
  if (code.includes('weak-password')) return 'Password should be at least 6 characters.';
  if (code.includes('email-already-in-use')) return 'Email already registered.';
  return 'Something went wrong. Try again.';
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 24, textAlign: 'center' },
  input: { borderWidth: 1, borderRadius: 12, padding: 14, marginBottom: 12 },
  msg: { marginBottom: 12, textAlign: 'center' },
  btn: { padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 4 },
  btnText: { fontWeight: '600' },
  btnSecondary: { padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 10, borderWidth: 1 },
  btnTextSecondary: { fontWeight: '600' },
});