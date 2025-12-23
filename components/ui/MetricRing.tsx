// components/metric-ring.tsx (FIXED)
import { useTheme } from "@/theme/useTheme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

interface MetricRingProps {
	value: number;
	size?: "sm" | "md" | "lg";
	label?: string;
	showValue?: boolean;
}

export function MetricRing({ value, size = "md", label, showValue = true }: MetricRingProps) {
	const { colors } = useTheme();

	const sizes = {
		sm: { ring: 32, stroke: 3, fontSize: 10 },
		md: { ring: 48, stroke: 4, fontSize: 12 },
		lg: { ring: 64, stroke: 5, fontSize: 14 },
	};

	const { ring, stroke, fontSize } = sizes[size];

	const radius = (ring - stroke) / 2;
	const circumference = 2 * Math.PI * radius;
	const progress = Math.min(Math.max(value, 0), 100);
	const offset = circumference * (1 - progress / 100);

	const getColor = (val: number) => {
		if (val >= 90) return colors.statusOffline;
		if (val >= 75) return colors.statusWarning;
		return colors.statusOnline;
	};

	const color = getColor(progress);

	return (
		<View style={styles.container}>
			<View style={{ width: ring, height: ring }}>
				<Svg
					width={ring}
					height={ring}>
					{/* Background */}
					<Circle
						cx={ring / 2}
						cy={ring / 2}
						r={radius}
						stroke={colors.muted}
						strokeOpacity={0.3}
						strokeWidth={stroke}
						fill='none'
					/>

					{/* Progress */}
					<Circle
						cx={ring / 2}
						cy={ring / 2}
						r={radius}
						stroke={color}
						strokeWidth={stroke}
						strokeDasharray={[circumference]} // ✅ NUMBER ARRAY
						strokeDashoffset={offset} // ✅ NUMBER
						strokeLinecap='round'
						fill='none'
					/>
				</Svg>

				{showValue && (
					<View style={styles.valueContainer}>
						<Text style={[styles.valueText, { fontSize, color: colors.foreground }]}>{progress}%</Text>
					</View>
				)}
			</View>

			{label && <Text style={[styles.label, { color: colors.mutedForeground }]}>{label}</Text>}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		gap: 4,
	},
	valueContainer: {
		...StyleSheet.absoluteFillObject,
		justifyContent: "center",
		alignItems: "center",
	},
	valueText: {
		fontWeight: "600",
	},
	label: {
		fontSize: 12,
	},
});
