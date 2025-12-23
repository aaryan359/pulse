import { Stack } from 'expo-router';


export default function AuthRoutesLayout(){
 
  return (
  
  <Stack screenOptions={{ headerShown: false }}> 
           
      <Stack.Screen name="index" />
      <Stack.Screen name="landing" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="onboarding" />
    </Stack>);
}