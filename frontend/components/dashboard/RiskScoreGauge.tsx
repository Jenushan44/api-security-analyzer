function RiskScoreGauge({ score }: { score: number }) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const progress = score / 100;
  const dashOffset = circumference * (1 - progress);

  let strokeColour = "#22C55E";

  if (score >= 76) {
    strokeColour = "#EF4444";
  } else if (score >= 51) {
    strokeColour = "#F97316";
  } else if (score >= 26) {
    strokeColour = "#EAB308";
  }

  return (
    <div className='relative w-28 h-28 flex items-center justify-center'>
      <svg className='-rotate-90 w-28 h-28' viewBox='0 0 100 100'>
        <circle cx="50" cy="50" r={radius} fill="none" stroke="#1E293B" strokeWidth="8" />
        <circle cx="50" cy="50" r={radius} fill="none" stroke={strokeColour} strokeWidth="8" strokeDasharray={circumference} strokeDashoffset={dashOffset} strokeLinecap="round" />
      </svg>

      <div className='absolute flex flex-col items-center'>
        <p className='text-3xl font-semibold text-white'>{score}</p>
        <p className='text-sm text-gray-400'>/100</p>
      </div>
    </div>
  )
}

export default RiskScoreGauge