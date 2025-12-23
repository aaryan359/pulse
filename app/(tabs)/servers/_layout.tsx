import { Stack } from 'expo-router';


export default function ServerLayout(){
 
  return (
  
    <Stack screenOptions={{ headerShown: false }}> 
        <Stack.Screen name="index" />
        <Stack.Screen name="[serverId]" />
        <Stack.Screen name="events" />
    </Stack>);
}