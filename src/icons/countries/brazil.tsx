import * as React from 'react'
import Svg, {
  ClipPath,
  Defs,
  G,
  LinearGradient,
  Mask,
  Path,
  Stop,
  SvgProps,
} from 'react-native-svg'

export function BrazilIcon(props: SvgProps) {
  return (
    <Svg width={16} height={12} viewBox="0 0 16 12" fill="none" {...props}>
      <G clipPath="url(#clip0_25_238)">
        <Path fill="#fff" d="M0 0H16V12H0z" />
        <Path fillRule="evenodd" clipRule="evenodd" d="M0 0v12h16V0H0z" fill="#093" />
        <Mask
          id="a"
          style={{
            maskType: 'luminance',
          }}
          maskUnits="userSpaceOnUse"
          x={0}
          y={0}
          width={16}
          height={12}
        >
          <Path fillRule="evenodd" clipRule="evenodd" d="M0 0v12h16V0H0z" fill="#fff" />
        </Mask>
        <G mask="url(#a)">
          <G filter="url(#filter0_d_25_238)" fillRule="evenodd" clipRule="evenodd">
            <Path d="M7.963 1.852l6.101 4.252-6.184 3.982L1.904 6.02l6.06-4.169z" fill="#FFD221" />
            <Path
              d="M7.963 1.852l6.101 4.252-6.184 3.982L1.904 6.02l6.06-4.169z"
              fill="url(#paint0_linear_25_238)"
            />
          </G>
          <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8 8.6a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"
            fill="#2E42A5"
          />
          <Mask
            id="b"
            style={{
              maskType: 'luminance',
            }}
            maskUnits="userSpaceOnUse"
            x={5}
            y={3}
            width={6}
            height={6}
          >
            <Path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M8 8.6a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"
              fill="#fff"
            />
          </Mask>
          <G mask="url(#b)" fill="#F7FCFF">
            <Path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M7.19 7.285l-.112.059.022-.125-.09-.088.124-.018L7.19 7l.056.113.125.018-.09.088.02.125-.111-.059zM8.19 7.285l-.112.059.022-.125-.09-.088.124-.018L8.19 7l.056.113.125.018-.09.088.02.125-.111-.059zM8.19 7.885l-.112.059.022-.125-.09-.088.124-.018.056-.113.056.113.125.018-.09.088.02.125-.111-.059zM7.69 5.785l-.112.059.022-.125-.09-.088.124-.018.056-.113.056.113.125.018-.09.088.02.125-.111-.059zM7.69 6.785l-.112.059.022-.125-.09-.088.124-.018.056-.113.056.113.125.018-.09.088.02.125-.111-.059zM6.99 6.285l-.112.059.021-.125-.09-.088.125-.018L6.99 6l.056.113.125.018-.09.088.02.125-.111-.059zM6.29 6.685l-.112.059.022-.125-.09-.088.124-.018.056-.113.056.113.125.018-.09.088.02.125-.11-.059zM8.59 4.985l-.112.059.022-.125-.09-.088.124-.018.056-.113.056.113.125.018-.09.088.02.125-.111-.059z"
            />
            <Path d="M4.962 5.499l.076-.998c2.399.181 4.292.97 5.656 2.373l-.717.697C8.795 6.355 7.131 5.662 4.962 5.5z" />
          </G>
        </G>
      </G>
      <Defs>
        <LinearGradient
          id="paint0_linear_25_238"
          x1={16}
          y1={12}
          x2={16}
          y2={0}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#FFC600" />
          <Stop offset={1} stopColor="#FFDE42" />
        </LinearGradient>
        <ClipPath id="clip0_25_238">
          <Path fill="#fff" d="M0 0H16V12H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  )
}
