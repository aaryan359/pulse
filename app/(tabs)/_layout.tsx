import { LiquidTabBar } from "@/components/LiquidNav";
import { LinearGradient } from "expo-linear-gradient";
import { Tabs } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function Layout() {
	return (
		<View style={{ flex: 1 }}>
			<LinearGradient
				colors={["#373c7e8d", "#8e50a7a8", "#442172ca"]}
				style={StyleSheet.absoluteFill}
			/>

			<Tabs
				tabBar={(props) => <LiquidTabBar {...props} />}
				screenOptions={{
					headerShown: false,
					tabBarStyle: {
						position: "absolute",
						backgroundColor: "transparent",
						borderTopWidth: 0,
						elevation: 0,
						height: 10,
					},
					sceneStyle: { backgroundColor: "transparent" },
				}}>
            <Tabs.Screen
              name='dashboard'
              options={{ title: "Home" }}
            />

            <Tabs.Screen
              name='servers'
              options={{ title: "Servers" }}
            />

            <Tabs.Screen
              name='events'
              options={{ title: "Events" }}
            />

            <Tabs.Screen
              name='terminal'
              options={{ title: "Terminal" }}
            />
            
            <Tabs.Screen
              name='setting'
              options={{ title: "Settings" }}
            />
			</Tabs>
		</View>
	);
}
