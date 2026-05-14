import { useTheme } from '@/hooks/useTheme';
import React from 'react';
import Svg, { Path, Text as SvgText, TSpan } from 'react-native-svg';

interface Props {
  width?: number;
  height?: number;
  iconOnly?: boolean;
}

export const KipGoLogo = ({ width = 200, height = 60, iconOnly = false }: Props) => {
  const { colors } = useTheme();
  const viewBoxWidth = iconOnly ? 120 : 400;

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${viewBoxWidth} 120`}>
      <Path d="M40 20h15v35l30-35h18L72 58l35 42H88L55 68v32H40V20z" fill={colors.primary} />
      <Path d="M45 45c-8 0-15 7-15 15s15 30 15 30 15-22 15-30-7-15-15-15zm0 22a7 7 0 110-14 7 7 0 010 14z" fill={colors.warning} />
      <Path d="M60 55l40 10-10 10" fill="none" stroke={colors.warning} strokeWidth={viewBoxWidth * 0.02} strokeLinecap="round" strokeLinejoin="round" />
      {!iconOnly && (
        <SvgText x="130" y="95" fontFamily="Manrope" fontWeight="800" fontSize={72} fill={colors.textPrimary}>Kip<TSpan fill={colors.warning}>Go</TSpan>
        </SvgText>
      )}
    </Svg>
  );
};
