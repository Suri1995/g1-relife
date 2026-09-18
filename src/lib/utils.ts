export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/** BMI calculation — returns { bmi, category } */
export function calculateBmi(heightCm: number, weightKg: number) {
  if (!heightCm || !weightKg) return null;
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  const rounded = Math.round(bmi * 10) / 10;

  let category = "";
  let color = "";
  if (bmi < 18.5) {
    category = "Underweight";
    color = "#C68A34";
  } else if (bmi < 25) {
    category = "Healthy range";
    color = "#5A7754";
  } else if (bmi < 30) {
    category = "Overweight";
    color = "#C68A34";
  } else {
    category = "Obese";
    color = "#B0512E";
  }

  return { bmi: rounded, category, color };
}
