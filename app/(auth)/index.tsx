import { useAppSelector } from "@/redux/hooks";
import { Redirect } from "expo-router";

export default function AuthIndex() {
  const { isAuthenticated } = useAppSelector(
    state => state.auth
  );


  console.log(" is auth ",isAuthenticated)
  

  if (isAuthenticated) {
    return <Redirect href="/(tabs)/dashboard" />;
  }

  return <Redirect href="/(auth)/landing" />;
}
