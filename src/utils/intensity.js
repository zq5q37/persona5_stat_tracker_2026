// The one list of intensities. Dialogue renders the log buttons from it and the
// heatmap weights a day's effort by it, so adding one only means editing here.
export const INTENSITIES = [
  { label: 'Low', exp: 10 },
  { label: 'Medium', exp: 20 },
  { label: 'High', exp: 30 },
];

// exp per unit of heatmap effort, so Low/Medium/High weigh 1/2/3
const EXP_PER_UNIT = 10;

export const weightOf = (label) => {
  const intensity = INTENSITIES.find(i => i.label === label);
  return intensity ? intensity.exp / EXP_PER_UNIT : 1;
};
