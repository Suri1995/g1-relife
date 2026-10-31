"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { ArrowRight, ChevronDown, Flame, Sparkles, Target, Zap } from "lucide-react";
import { calculateBmi } from "@/lib/utils";
import SectionHeading from "./SectionHeading";

const BMI_MIN = 15;
const BMI_MAX = 40;

// Converts a BMI value into a 0-100 position along the *visible* half of
// the gauge (left = BMI_MIN, right = BMI_MAX). Used to rotate the needle.
const toGaugePct = (bmi: number) =>
  Math.min(100, Math.max(0, ((bmi - BMI_MIN) / (BMI_MAX - BMI_MIN)) * 100));

// Zone colors for the gauge bands. Kept in the same warm, earthy family
// as the rest of the palette rather than reaching for stock red/green.
const ZONE_COLORS = {
  underweight: "#A9C4A0",
  normal: "#D9A441",
  overweight: "#C97B3D",
  obese: "#8B4A3B",
};

const ZONES = [
  { id: "underweight", label: "Underweight", color: ZONE_COLORS.underweight },
  { id: "normal", label: "Normal", color: ZONE_COLORS.normal },
  { id: "overweight", label: "Overweight", color: ZONE_COLORS.overweight },
  { id: "obese", label: "Obese", color: ZONE_COLORS.obese },
] as const;

// The gauge is drawn as the top half of a full conic-gradient circle.
// Standard BMI thresholds (18.5 / 25 / 30, within a 15-40 display range)
// are converted to stops on that full circle (0-50%, since the bottom
// half is clipped away and never seen).
const gaugeBackground = `conic-gradient(from -90deg, ${ZONE_COLORS.underweight} 0%, ${ZONE_COLORS.underweight} 7%, ${ZONE_COLORS.normal} 7%, ${ZONE_COLORS.normal} 20%, ${ZONE_COLORS.overweight} 20%, ${ZONE_COLORS.overweight} 30%, ${ZONE_COLORS.obese} 30%, ${ZONE_COLORS.obese} 50%, transparent 50%, transparent 100%)`;

const ACTIVITY_LEVELS = [
  { id: "sedentary", label: "Sedentary", hint: "little or no exercise", multiplier: 1.2 },
  { id: "light", label: "Light", hint: "exercise 1-3 days/week", multiplier: 1.375 },
  { id: "moderate", label: "Moderate", hint: "exercise 3-5 days/week", multiplier: 1.55 },
  { id: "active", label: "Active", hint: "exercise 6-7 days/week", multiplier: 1.725 },
  { id: "veryActive", label: "Very active", hint: "physical job or 2x training", multiplier: 1.9 },
] as const;

type ActivityId = (typeof ACTIVITY_LEVELS)[number]["id"];
type Unit = "metric" | "imperial";
type Gender = "female" | "male";

function formatHeight(cm: number, unit: Unit) {
  if (unit === "metric") return `${cm} cm`;
  const totalInches = cm / 2.54;
  let feet = Math.floor(totalInches / 12);
  let inches = Math.round(totalInches % 12);
  if (inches === 12) {
    feet += 1;
    inches = 0;
  }
  return `${feet}'${inches}"`;
}

function formatWeight(kg: number, unit: Unit) {
  return unit === "metric" ? `${kg} kg` : `${Math.round(kg * 2.20462)} lb`;
}

/**
 * A number that eases toward each new value with a spring instead of
 * snapping instantly — a small, tactile "premium" detail used for every
 * calculated figure on this card.
 */
function AnimatedNumber({
  value,
  decimals = 1,
}: {
  value: number;
  decimals?: number;
}) {
  const spring = useSpring(value, { stiffness: 120, damping: 20, mass: 0.6 });
  useEffect(() => {
    spring.set(value);
  }, [value, spring]);
  const display = useTransform(spring, (v) => v.toFixed(decimals));
  return <motion.span>{display}</motion.span>;
}

export default function BMICalculator() {
  const [unit, setUnit] = useState<Unit>("metric");
  const [height, setHeight] = useState(165); // always stored in cm
  const [weight, setWeight] = useState(65); // always stored in kg
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [age, setAge] = useState(30);
  const [gender, setGender] = useState<Gender>("female");
  const [activity, setActivity] = useState<ActivityId>("moderate");

  const result = useMemo(() => calculateBmi(height, weight), [height, weight]);
  const gaugePct = result ? toGaugePct(result.bmi) : 0;
  const needleRotation = -90 + (gaugePct / 100) * 180;

  const extras = useMemo(() => {
    const heightM = height / 100;
    const healthyMin = 18.5 * heightM * heightM;
    const healthyMax = 24.9 * heightM * heightM;

    let rangeNote: { amount: number; direction: "lose" | "gain" } | null = null;
    if (weight > healthyMax) {
      rangeNote = { amount: weight - healthyMax, direction: "lose" };
    } else if (weight < healthyMin) {
      rangeNote = { amount: healthyMin - weight, direction: "gain" };
    }

    // Mifflin-St Jeor for resting energy needs, scaled by activity for
    // an estimated maintenance calorie target.
    const activityMultiplier =
      ACTIVITY_LEVELS.find((a) => a.id === activity)?.multiplier ?? 1.2;
    const bmrBase = 10 * weight + 6.25 * height - 5 * age;
    const bmr = gender === "male" ? bmrBase + 5 : bmrBase - 161;
    const tdee = bmr * activityMultiplier;

    // Devine formula for a quick ideal-weight reference point.
    const heightInches = height / 2.54;
    const inchesOver5ft = Math.max(0, heightInches - 60);
    const idealWeight = (gender === "male" ? 50 : 45.5) + 2.3 * inchesOver5ft;

    return { healthyMin, healthyMax, rangeNote, bmr, tdee, idealWeight };
  }, [height, weight, age, gender, activity]);

  return (
    <section id="bmi" className="section-pad bg-evergreen-dark">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="container-content flex flex-col items-center justify-center gap-10"
      >
        <div className="max-w-2xl flex flex-col items-center text-center">
          <div className="mx-auto mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-honey/15 ring-1 ring-honey/30">
            <Sparkles size={18} className="text-honey" />
          </div>
          <SectionHeading
            tone="light"
            align="center"
            title="Complete Body Analysis"
            description="A quick starting point for our conversation — not a diagnosis. Your coach will look at the full picture with you."
          />
        </div>

        <div className="w-full overflow-hidden rounded-[2rem] bg-cream shadow-[0_50px_100px_-30px_rgba(0,0,0,0.5)] ring-1 ring-black/5">
          {/* Thin accent bar for a touch of polish along the top edge */}
          <div className="h-1.5 w-full bg-gradient-to-r from-honey via-honey-dark to-evergreen" />

          <div className="p-7 sm:p-10 lg:p-12">
            {/* Unit switch */}
            <div className="flex items-center justify-between gap-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-moss/80">
                Your numbers
              </p>
              <div className="flex rounded-full bg-evergreen/[0.06] p-1">
                {(["metric", "imperial"] as Unit[]).map((u) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => setUnit(u)}
                    aria-pressed={unit === u}
                    className={`rounded-full px-3.5 py-1.5 text-[12px] font-medium capitalize transition-all duration-200 ${
                      unit === u
                        ? "bg-cream text-evergreen shadow-sm"
                        : "text-moss/70 hover:text-moss"
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>

            {/* Height / weight sliders */}
            <div className="mt-7 grid gap-7 sm:grid-cols-2 lg:gap-14">
              <label className="block">
                <div className="flex items-baseline justify-between">
                  <span className="text-[13px] font-medium text-moss">Height</span>
                  <span className="font-display text-2xl leading-none text-evergreen">
                    {formatHeight(height, unit)}
                  </span>
                </div>
                <input
                  type="range"
                  min={120}
                  max={210}
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="mt-4 w-full accent-honey"
                  aria-label="Height in centimeters"
                />
                <div className="mt-1.5 flex justify-between text-[11px] text-moss/50">
                  <span>{formatHeight(120, unit)}</span>
                  <span>{formatHeight(210, unit)}</span>
                </div>
              </label>

              <label className="block">
                <div className="flex items-baseline justify-between">
                  <span className="text-[13px] font-medium text-moss">Weight</span>
                  <span className="font-display text-2xl leading-none text-evergreen">
                    {formatWeight(weight, unit)}
                  </span>
                </div>
                <input
                  type="range"
                  min={30}
                  max={150}
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="mt-4 w-full accent-honey"
                  aria-label="Weight in kilograms"
                />
                <div className="mt-1.5 flex justify-between text-[11px] text-moss/50">
                  <span>{formatWeight(30, unit)}</span>
                  <span>{formatWeight(150, unit)}</span>
                </div>
              </label>
            </div>

            {result && (
              <div className="mt-8 rounded-[1.5rem] border border-evergreen/[0.06] bg-sand p-6 sm:p-8 lg:p-9">
                <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-center lg:justify-center lg:gap-14">
                {/* Semi-circular BMI gauge with zone bands and a needle */}
                <div className="flex shrink-0 flex-col items-center">
                  <div className="relative h-[116px] w-[232px]">
                    <div className="absolute left-0 top-0 h-[116px] w-[232px] overflow-hidden">
                      <div
                        className="absolute left-0 top-0 h-[232px] w-[232px] rounded-full drop-shadow-sm"
                        style={{ backgroundImage: gaugeBackground }}
                      />
                      <div className="absolute left-[16px] top-[16px] h-[200px] w-[200px] rounded-full bg-sand" />
                      <div
                        className="absolute bottom-0 left-1/2 h-[96px] w-[3px] origin-bottom rounded-full bg-evergreen shadow-[0_0_0_3px_rgba(255,255,255,0.35)]"
                        style={{
                          transform: `translateX(-50%) rotate(${needleRotation}deg)`,
                        }}
                      />
                      <div className="absolute bottom-[-8px] left-1/2 h-4 w-4 -translate-x-1/2 rounded-full border-[3px] border-sand bg-evergreen shadow-sm" />
                    </div>
                    <span className="absolute bottom-0 left-0 text-[10px] font-medium text-moss/50">
                      {BMI_MIN}
                    </span>
                    <span className="absolute bottom-0 right-0 text-[10px] font-medium text-moss/50">
                      {BMI_MAX}
                    </span>
                  </div>

                  <div className="-mt-1 flex items-baseline gap-1.5">
                    <span className="font-display text-6xl tracking-tight text-evergreen">
                      <AnimatedNumber value={result.bmi} decimals={1} />
                    </span>
                    <span className="text-[13px] font-medium text-moss">BMI</span>
                  </div>

                  <span
                    className="mt-3 rounded-full px-4 py-1.5 text-[13px] font-semibold text-cream shadow-sm"
                    style={{ backgroundColor: result.color }}
                  >
                    {result.category}
                  </span>

                  {/* Zone legend — quietly explains the gauge colors */}
                  <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5">
                    {ZONES.map((zone) => (
                      <span
                        key={zone.id}
                        className="flex items-center gap-1.5 text-[11px] font-medium text-moss/70"
                      >
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: zone.color }}
                        />
                        {zone.label}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="h-px w-full max-w-xs bg-evergreen/[0.08] lg:h-32 lg:w-px lg:max-w-none" />

                <div className="flex flex-col items-center lg:max-w-xs lg:items-start">
                  {/* Healthy range note */}
                  <p className="text-center text-[13px] leading-relaxed text-moss lg:text-left">
                    {extras.rangeNote ? (
                      <>
                        A healthy range for your height is{" "}
                        <span className="font-semibold text-evergreen">
                          {formatWeight(Math.round(extras.healthyMin), unit)}–
                          {formatWeight(Math.round(extras.healthyMax), unit)}
                        </span>{" "}
                        — about{" "}
                        <span className="font-semibold text-evergreen">
                          {formatWeight(Math.round(extras.rangeNote.amount), unit)}
                        </span>{" "}
                        to {extras.rangeNote.direction}.
                      </>
                    ) : (
                      <>
                        You are within the healthy range for your height (
                        <span className="font-semibold text-evergreen">
                          {formatWeight(Math.round(extras.healthyMin), unit)}–
                          {formatWeight(Math.round(extras.healthyMax), unit)}
                        </span>
                        ).
                      </>
                    )}
                  </p>

                  <a
                    href="#contact"
                    className="group mt-5 inline-flex items-center gap-1.5 rounded-full bg-evergreen px-5 py-2.5 text-[13px] font-semibold text-cream shadow-sm transition-all duration-200 hover:bg-evergreen-dark hover:shadow-md"
                  >
                    Talk to your coach
                    <ArrowRight
                      size={14}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </a>
                </div>
                </div>
              </div>
            )}

            {/* Personalize toggle — keeps the calculator uncluttered until
                someone wants the extra calculations. */}
            <button
              type="button"
              onClick={() => setShowAdvanced((v) => !v)}
              aria-expanded={showAdvanced}
              className="mt-6 flex w-full items-center justify-between rounded-xl border border-evergreen/10 px-4 py-3.5 text-[13px] font-semibold text-evergreen transition-colors duration-200 hover:border-evergreen/20 hover:bg-evergreen/[0.04]"
            >
              Personalize for calorie & weight insights
              <ChevronDown
                size={16}
                className={`transition-transform duration-300 ${
                  showAdvanced ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              className={`grid transition-[grid-template-rows] duration-500 ease-out ${
                showAdvanced ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <div className="mt-7 grid gap-6 border-t border-evergreen/10 pt-7 sm:grid-cols-2">
                  <label className="block">
                    <div className="flex items-baseline justify-between">
                      <span className="text-[13px] font-medium text-moss">Age</span>
                      <span className="font-display text-2xl leading-none text-evergreen">
                        {age} yrs
                      </span>
                    </div>
                    <input
                      type="range"
                      min={16}
                      max={80}
                      value={age}
                      onChange={(e) => setAge(Number(e.target.value))}
                      className="mt-4 w-full accent-honey"
                      aria-label="Age in years"
                    />
                  </label>

                  <div>
                    <span className="text-[13px] font-medium text-moss">Gender</span>
                    <div className="mt-4 flex gap-2">
                      {(["female", "male"] as Gender[]).map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setGender(g)}
                          aria-pressed={gender === g}
                          className={`flex-1 rounded-full px-4 py-2 text-[13px] font-medium capitalize transition-all duration-200 ${
                            gender === g
                              ? "bg-evergreen text-cream shadow-sm"
                              : "bg-evergreen/5 text-moss hover:text-evergreen"
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <span className="text-[13px] font-medium text-moss">Activity level</span>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {ACTIVITY_LEVELS.map((level) => (
                      <button
                        key={level.id}
                        type="button"
                        onClick={() => setActivity(level.id)}
                        title={level.hint}
                        aria-pressed={activity === level.id}
                        className={`rounded-full px-4 py-2 text-[13px] font-medium transition-all duration-200 ${
                          activity === level.id
                            ? "bg-honey text-evergreen-dark shadow-sm"
                            : "bg-evergreen/5 text-moss hover:text-evergreen"
                        }`}
                      >
                        {level.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-7 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-evergreen/[0.06] bg-evergreen/[0.04] p-5 transition-colors duration-200 hover:bg-evergreen/[0.06]">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-honey-dark/15">
                      <Flame size={15} className="text-honey-dark" />
                    </div>
                    <p className="mt-3 font-display text-2xl text-evergreen">
                      <AnimatedNumber value={extras.bmr} decimals={0} />
                    </p>
                    <p className="mt-0.5 text-[12px] leading-tight text-moss">
                      calories/day at rest (BMR)
                    </p>
                  </div>
                  <div className="rounded-2xl border border-evergreen/[0.06] bg-evergreen/[0.04] p-5 transition-colors duration-200 hover:bg-evergreen/[0.06]">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-honey/20">
                      <Zap size={15} className="text-honey-dark" />
                    </div>
                    <p className="mt-3 font-display text-2xl text-evergreen">
                      <AnimatedNumber value={extras.tdee} decimals={0} />
                    </p>
                    <p className="mt-0.5 text-[12px] leading-tight text-moss">
                      calories/day to maintain weight
                    </p>
                  </div>
                  <div className="rounded-2xl border border-evergreen/[0.06] bg-evergreen/[0.04] p-5 transition-colors duration-200 hover:bg-evergreen/[0.06]">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-evergreen/15">
                      <Target size={15} className="text-evergreen" />
                    </div>
                    <p className="mt-3 font-display text-2xl text-evergreen">
                      {formatWeight(Math.round(extras.idealWeight), unit)}
                    </p>
                    <p className="mt-0.5 text-[12px] leading-tight text-moss">
                      estimated ideal weight
                    </p>
                  </div>
                </div>

                <p className="mt-5 text-[12px] leading-relaxed text-moss/70">
                  These are estimates from standard formulas (Mifflin-St Jeor,
                  Devine) and vary by individual — a starting point for your
                  coach, not medical advice.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}