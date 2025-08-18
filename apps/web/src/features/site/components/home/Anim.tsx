"use client";
import { motion } from "motion/react";
export const HeroGlob = () => {
  return (
    <>
      <motion.div
        className="relative aspect-square w-[80%] max-w-80 min-w-8"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          type: "spring",
          damping: 100,
          stiffness: 1000,
          mass: 10,
        }}
      >
        <svg
          width="520"
          height="521"
          viewBox="0 0 520 521"
          style={{
            width: "100%",
            height: "100%",
          }}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_174_880)" filter="url(#filter0_d_174_880)">
            <circle
              cx="260"
              cy="256.5"
              r="256"
              fill="url(#paint0_linear_174_880)"
              fillOpacity="0.2"
            />
            <g filter="url(#filter1_f_174_880)">
              <motion.circle
                cx="260"
                cy="256.5"
                r="210"
                fill="url(#paint1_linear_174_880)"
                fillOpacity="0.3"
                initial={{ scale: 1 }}
                animate={{ scale: 0.8 }}
                transition={{
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 8,
                }}
              />
            </g>
            <circle cx="260" cy="256.5" r="28.8" fill="white" />
            <motion.path
              d="M260 256.5L89.4413 382.229L315.26 482.334M260 256.5L61.5049 163.394M260 256.5L427.005 182.018"
              stroke="white"
              strokeWidth="4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                delay: 0,
                duration: 4,
                type: "spring",
              }}
            />
            <circle cx="315.299" cy="482.334" r="19.2" fill="white" />
            <circle cx="427.005" cy="182.899" r="19.2" fill="white" />
            <circle cx="61.5047" cy="163.394" r="19.2" fill="white" />
            <circle cx="88.8738" cy="381.871" r="19.2" fill="white" />
          </g>
          <defs>
            <filter
              id="filter0_d_174_880"
              x="0"
              y="0.5"
              width="520"
              height="520"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="4" />
              <feGaussianBlur stdDeviation="2" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_174_880"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_174_880"
                result="shape"
              />
            </filter>
            <filter
              id="filter1_f_174_880"
              x="46"
              y="42.5"
              width="428"
              height="428"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                stdDeviation="2"
                result="effect1_foregroundBlur_174_880"
              />
            </filter>
            <linearGradient
              id="paint0_linear_174_880"
              x1="4"
              y1="0.5"
              x2="516"
              y2="512.5"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#4F46E5" />
              <stop offset="1" stopColor="#14B8A6" />
            </linearGradient>
            <linearGradient
              id="paint1_linear_174_880"
              x1="50"
              y1="46.5"
              x2="470"
              y2="466.5"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#4F46E5" />
              <stop offset="1" stopColor="#14B8A6" />
            </linearGradient>
            <clipPath id="clip0_174_880">
              <rect
                width="512"
                height="512"
                fill="white"
                transform="translate(4 0.5)"
              />
            </clipPath>
          </defs>
        </svg>
      </motion.div>
    </>
  );
};
