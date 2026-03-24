'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center gap-8">
      {/* Animated bike SVG */}
      <div className="w-72 h-36">
        <svg
          viewBox="0 0 160 80"
          xmlns="http://www.w3.org/2000/svg"
          overflow="hidden"
          aria-hidden="true"
          width="100%"
          height="100%"
        >
          {/* Road — single static line */}
          <line
            x1="0"
            y1="80"
            x2="160"
            y2="80"
            stroke="#9ca3af"
            strokeWidth="2"
          />

          {/* Rear wheel */}
          <g
            style={{
              animation: 'wheel-spin 2s linear infinite',
              transformOrigin: '52px 64px',
            }}
          >
            <circle
              cx="52"
              cy="64"
              r="15"
              fill="none"
              stroke="#00224d"
              strokeWidth="2.5"
            />
            <line
              x1="52"
              y1="49"
              x2="52"
              y2="79"
              stroke="#00224d"
              strokeWidth="1.5"
            />
            <line
              x1="37"
              y1="64"
              x2="67"
              y2="64"
              stroke="#00224d"
              strokeWidth="1.5"
            />
            <line
              x1="41"
              y1="53"
              x2="63"
              y2="75"
              stroke="#00224d"
              strokeWidth="1.5"
            />
            <line
              x1="41"
              y1="75"
              x2="63"
              y2="53"
              stroke="#00224d"
              strokeWidth="1.5"
            />
            <circle cx="52" cy="64" r="3" fill="#ff204e" />
          </g>

          {/* Front wheel */}
          <g
            style={{
              animation: 'wheel-spin 2s linear infinite',
              transformOrigin: '108px 64px',
            }}
          >
            <circle
              cx="108"
              cy="64"
              r="15"
              fill="none"
              stroke="#00224d"
              strokeWidth="2.5"
            />
            <line
              x1="108"
              y1="49"
              x2="108"
              y2="79"
              stroke="#00224d"
              strokeWidth="1.5"
            />
            <line
              x1="93"
              y1="64"
              x2="123"
              y2="64"
              stroke="#00224d"
              strokeWidth="1.5"
            />
            <line
              x1="97"
              y1="53"
              x2="119"
              y2="75"
              stroke="#00224d"
              strokeWidth="1.5"
            />
            <line
              x1="97"
              y1="75"
              x2="119"
              y2="53"
              stroke="#00224d"
              strokeWidth="1.5"
            />
            <circle cx="108" cy="64" r="3" fill="#ff204e" />
          </g>

          {/* Seat tube: bottom bracket → seat tube top */}
          <line
            x1="73"
            y1="61"
            x2="70"
            y2="39"
            stroke="#00224d"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Top tube: seat tube top → head tube top */}
          <line
            x1="70"
            y1="39"
            x2="101"
            y2="38"
            stroke="#00224d"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Down tube: bottom bracket → head tube bottom */}
          <line
            x1="73"
            y1="61"
            x2="102"
            y2="38"
            stroke="#00224d"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Chain stay: bottom bracket → rear axle */}
          <line
            x1="73"
            y1="61"
            x2="52"
            y2="64"
            stroke="#00224d"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Seat stay: seat tube top → rear axle */}
          <line
            x1="70"
            y1="39"
            x2="52"
            y2="64"
            stroke="#00224d"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Fork: head tube bottom → front axle */}
          <line
            x1="102"
            y1="37"
            x2="108"
            y2="64"
            stroke="#00224d"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Seat post: seat tube top → saddle base */}
          <line
            x1="70"
            y1="39"
            x2="70"
            y2="33"
            stroke="#00224d"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Saddle: horizontal line at top of seat post */}
          <line
            x1="64"
            y1="32"
            x2="76"
            y2="32"
            stroke="#ff204e"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Handlebar stem: head tube top → stem tip */}
          <line
            x1="101"
            y1="38"
            x2="105"
            y2="32"
            stroke="#00224d"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Handlebar bar: vertical bar at stem tip */}
          <line
            x1="103"
            y1="29"
            x2="107"
            y2="35"
            stroke="#00224d"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Crank hub */}
          <circle cx="73" cy="61" r="3" fill="#ff204e" />
        </svg>
      </div>

      {/* 404 heading */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-8xl font-black text-primary"
      >
        404
      </motion.h1>

      {/* Message */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="text-xl text-base-content/60 max-w-sm"
      >
        {t('notFoundMessage')}
      </motion.p>

      {/* Go home button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Link href="/" className="btn btn-primary btn-lg">
          {t('goHome')}
        </Link>
      </motion.div>
    </div>
  );
}
