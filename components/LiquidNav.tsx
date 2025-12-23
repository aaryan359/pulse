import { Ionicons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import React, { useEffect, useState } from "react";
import { Dimensions, LayoutChangeEvent, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
const MARGIN = 16;
const TAB_BAR_WIDTH = width - MARGIN * 2;
const TAB_BAR_HEIGHT = 65;

export function LiquidTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
	const insets = useSafeAreaInsets();

	// Shared values for animation
	const translateX = useSharedValue(0);
	const [tabWidth, setTabWidth] = useState(0);

	// Calculate tab width dynamically
	const onLayout = (e: LayoutChangeEvent) => {
		setTabWidth(e.nativeEvent.layout.width / state.routes.length);
	};

	// Update position when tab changes
	useEffect(() => {
		if (tabWidth > 0) {
			translateX.value = withSpring(state.index * tabWidth, {
				mass: 0.5,
				damping: 15,
				stiffness: 120,
			});
		}
	}, [state.index, tabWidth]);

	// Animated Style for the Sliding Pill
	const animatedIndicatorStyle = useAnimatedStyle(() => ({
		transform: [{ translateX: translateX.value }],
		width: tabWidth - 8, // Slightly smaller than the tab area
	}));

	return (
		<View style={[styles.container, { paddingBottom: insets.bottom + 10 }]}>
			<View
				style={styles.tabBar}
				onLayout={onLayout}>
				{/* The Sliding Active Indicator */}
				{tabWidth > 0 && <Animated.View style={[styles.activeIndicator, animatedIndicatorStyle]} />}

				{state.routes.map((route, index) => {
					const { options } = descriptors[route.key];
					const isFocused = state.index === index;

					let iconName: any = "home";
					let label = "Home";

					if (route.name === "dashboard") {
						iconName = isFocused ? "home" : "home-outline";
						label = "Home";
					} else if (route.name === "servers") {
						iconName = isFocused ? "server" : "server-outline";
						label = "Servers";
					} else if (route.name === "events") {
						iconName = isFocused ? "flash" : "flash-outline";
						label = "Events";
					} else if (route.name === "terminal") {
						iconName = isFocused ? "code" : "code-outline";
						label = "Terminal";
					} else if (route.name === "setting") {
						iconName = isFocused ? "settings" : "settings-outline";
						label = "Settings";
					}

					const onPress = () => {
						//Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
						const event = navigation.emit({ type: "tabPress", target: route.key, canPreventDefault: true });
						if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name, route.params);
					};

					return (
						<TabItem
							key={route.key}
							onPress={onPress}
							isFocused={isFocused}
							iconName={iconName}
							label={label}
						/>
					);
				})}
			</View>
		</View>
	);
}

// Separate component to isolate animations for each icon
const TabItem = ({ onPress, isFocused, iconName, label }: any) => {
	const animatedIconStyle = useAnimatedStyle(() => ({
		transform: [{ scale: withTiming(isFocused ? 1.0 : 0.8, { duration: 200 }) }],
		opacity: withTiming(isFocused ? 1 : 0.5, { duration: 200 }),
	}));

	return (
		<Pressable
			onPress={onPress}
			style={styles.tabItem}>
			<Animated.View style={[styles.iconContainer, animatedIconStyle]}>
				<Ionicons
					name={iconName}
					size={24}
					color={isFocused ? "#fff" : "#ddd"}
				/>
			</Animated.View>
      <Text style = {{ fontSize:10 , fontWeight:'500'}}>
        {label}
      </Text>
			
		</Pressable>
	);
};

const styles = StyleSheet.create({
	container: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		alignItems: "center",
	},
	tabBar: {
		flexDirection: "row",
		width: TAB_BAR_WIDTH,
		height: TAB_BAR_HEIGHT,
		backgroundColor: "rgba(30, 30, 30, 0.6)",
		borderRadius: 35,
		justifyContent: "space-between",
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 10 },
		shadowOpacity: 0.3,
		shadowRadius: 20,
		elevation: 10,
		borderWidth: 1,
		borderColor: "rgba(255,255,255,0.1)",
		paddingHorizontal: 5,
	},
	activeIndicator: {
		position: "absolute",
		height: TAB_BAR_HEIGHT - 10,
		backgroundColor: "#aa7fb867",
		borderRadius: 30,
		marginLeft: 3,
	},
	tabItem: {
		flex: 1,
		height: "100%",
		justifyContent: "center",
		alignItems: "center",
		zIndex: 1, // Ensure icons are above the indicator
	},
	iconContainer: {
		justifyContent: "center",
		alignItems: "center",
	},
});
