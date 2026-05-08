const PROGRAM = {
  days: [
    {
      id: 'mon',
      label: 'Mon',
      tabName: 'Chest / Tris / Shoulders',
      title: 'Chest, triceps & shoulders',
      badges: ['Push day'],
      tip: "Start heavy on bench while you're completely fresh. Keep shoulder pressing strict — no leg drive. Your triceps are already warm from pressing so save them for last.",
      sections: [
        {
          label: 'Chest',
          exercises: [
            {
              id: 'flat-barbell-bench',
              name: 'Flat barbell bench press',
              note: 'Main strength lift — go heavy',
              sets: '4 × 5–6',
              rpe: 'RPE 8–9',
              rest: '2–3 min',
              restSec: 150,
              restHint: "CNS-heavy — don't rush. Breathe fully before each set.",
              prog: 'Add 2.5kg when you hit 6 reps on all 4 sets cleanly.',
              numSets: 4
            },
            {
              id: 'incline-db-press',
              name: 'Incline dumbbell press',
              note: 'Upper chest emphasis',
              sets: '3 × 8–10',
              rpe: 'RPE 7–8',
              rest: '90 sec',
              restSec: 90,
              restHint: "Moderate rest — enough to recover but keep intensity up.",
              prog: 'Move up one dumbbell size when you hit 10 reps on all 3 sets.',
              numSets: 3
            },
            {
              id: 'cable-fly-low-high',
              name: 'Cable fly (low to high)',
              note: 'Full stretch at the bottom',
              sets: '3 × 12–15',
              rpe: 'RPE 7',
              rest: '60 sec',
              restSec: 60,
              restHint: "Short rest is fine here — it's a pump movement.",
              prog: 'Add one plate when you reach 15 reps comfortably on all sets.',
              numSets: 3
            }
          ]
        },
        {
          label: 'Shoulders',
          exercises: [
            {
              id: 'seated-db-ohp',
              name: 'Seated dumbbell overhead press',
              note: 'Controlled, full range of motion',
              sets: '3 × 8–10',
              rpe: 'RPE 7–8',
              rest: '90 sec',
              restSec: 90,
              restHint: "Give shoulders time — they fatigue faster than chest.",
              prog: 'Move up one dumbbell size when you nail 10 reps across all sets.',
              numSets: 3
            },
            {
              id: 'lateral-raises',
              name: 'Lateral raises',
              note: '3-second slow negative every rep',
              sets: '4 × 12–15',
              rpe: 'RPE 7',
              rest: '60 sec',
              restSec: 60,
              restHint: "60 sec max — the burn is part of it.",
              prog: 'Add 2kg when all 4 sets reach 15 reps with control.',
              numSets: 4
            },
            {
              id: 'rear-delt-fly',
              name: 'Rear delt fly (cable or DB)',
              note: 'Often skipped — never skip it',
              sets: '3 × 15',
              rpe: 'RPE 6–7',
              rest: '60 sec',
              restSec: 60,
              restHint: "Light weight, short rest. Pure isolation.",
              prog: 'Small jumps only. Add 2kg or one pin when 15 reps feel easy.',
              numSets: 3
            }
          ]
        },
        {
          label: 'Triceps',
          exercises: [
            {
              id: 'overhead-cable-ext',
              name: 'Overhead cable tricep extension',
              note: 'Long head emphasis — huge stretch',
              sets: '3 × 10–12',
              rpe: 'RPE 7',
              rest: '60–75 sec',
              restSec: 67,
              restHint: "Triceps are already pre-fatigued from pressing — 60 sec is enough.",
              prog: 'Add one plate when you hit 12 reps on all 3 sets.',
              numSets: 3
            },
            {
              id: 'cable-pushdown-rope',
              name: 'Cable pushdown (rope)',
              note: 'Spread the rope at the bottom',
              sets: '3 × 12–15',
              rpe: 'RPE 7',
              rest: '60 sec',
              restSec: 60,
              restHint: "Finisher — short rest, pump the muscle.",
              prog: 'Add one plate when 15 reps feel easy across all sets.',
              numSets: 3
            }
          ]
        }
      ]
    },
    {
      id: 'tue',
      label: 'Tue',
      tabName: 'Back / Biceps',
      title: 'Back & biceps',
      badges: ['Pull day'],
      tip: "Think elbows to hips — not hands pulling. This recruits your lats far more than gripping hard. Biceps are secondary today; let them assist, don't lead with them.",
      sections: [
        {
          label: 'Back — thickness',
          exercises: [
            {
              id: 'barbell-row',
              name: 'Barbell row (Pendlay or bent-over)',
              note: 'Heaviest back movement of the week',
              sets: '4 × 5–6',
              rpe: 'RPE 8–9',
              rest: '2–3 min',
              restSec: 150,
              restHint: "Treat this like a squat. Full recovery between sets.",
              prog: 'Add 2.5–5kg when you hit 6 reps on all 4 sets with strict form.',
              numSets: 4
            },
            {
              id: 'seated-cable-row',
              name: 'Seated cable row (close grip)',
              note: 'Full stretch forward, full squeeze back',
              sets: '3 × 8–10',
              rpe: 'RPE 7–8',
              rest: '90 sec',
              restSec: 90,
              restHint: "Controlled tempo — don't rush the rest.",
              prog: 'Add one plate when all 3 sets reach 10 clean reps.',
              numSets: 3
            },
            {
              id: 'chest-supported-db-row',
              name: 'Chest-supported dumbbell row',
              note: 'No momentum — completely strict',
              sets: '3 × 10–12',
              rpe: 'RPE 7',
              rest: '75 sec',
              restSec: 75,
              restHint: "Support eliminates cheating — focus on the contraction.",
              prog: 'Move up one dumbbell when 12 reps feel controlled on all sets.',
              numSets: 3
            }
          ]
        },
        {
          label: 'Back — width',
          exercises: [
            {
              id: 'weighted-pullups',
              name: 'Weighted pull-ups or lat pulldown',
              note: 'Pull-ups if you can do 6+ reps',
              sets: '4 × 6–8',
              rpe: 'RPE 8',
              rest: '2 min',
              restSec: 120,
              restHint: "Width work is demanding — don't cut rest short.",
              prog: 'Add 2.5kg belt weight (pull-ups) or one plate (pulldown) at 8 reps.',
              numSets: 4
            },
            {
              id: 'straight-arm-pulldown',
              name: 'Straight-arm cable pulldown',
              note: 'Great lat isolation finisher',
              sets: '3 × 12–15',
              rpe: 'RPE 6–7',
              rest: '60 sec',
              restSec: 60,
              restHint: "Low intensity finisher — short rest is the point.",
              prog: 'Add one plate when 15 reps feel effortless.',
              numSets: 3
            }
          ]
        },
        {
          label: 'Biceps',
          exercises: [
            {
              id: 'barbell-curl',
              name: 'Barbell or EZ-bar curl',
              note: 'Strict form — no swinging',
              sets: '3 × 8–10',
              rpe: 'RPE 7–8',
              rest: '75 sec',
              restSec: 75,
              restHint: "Biceps recover quickly but still need 60–75 sec.",
              prog: 'Add 2.5kg when you hit 10 clean reps on all 3 sets.',
              numSets: 3
            },
            {
              id: 'incline-db-curl',
              name: 'Incline dumbbell curl',
              note: 'Use light weight — the stretch is extreme',
              sets: '3 × 10–12',
              rpe: 'RPE 7',
              rest: '60–75 sec',
              restSec: 67,
              restHint: "Don't rush — the stretch position is where gains happen.",
              prog: 'Move up one DB when you hit 12 controlled reps on all sets.',
              numSets: 3
            },
            {
              id: 'hammer-curl',
              name: 'Hammer curl',
              note: 'Brachialis and forearm builder',
              sets: '2 × 12',
              rpe: 'RPE 7',
              rest: '60 sec',
              restSec: 60,
              restHint: "Finisher — short rest, stay pumped.",
              prog: 'Move up one DB when 12 reps feel comfortable on both sets.',
              numSets: 2
            }
          ]
        }
      ]
    },
    {
      id: 'wed',
      label: 'Wed',
      tabName: 'Legs / Abs',
      title: 'Legs & abs — quad focus',
      badges: ['Legs day 1'],
      tip: "This is your heavy quad day. Squat first while your CNS is completely fresh — the quality of your squats depends on it. Everything after is just volume.",
      sections: [
        {
          label: 'Quads',
          exercises: [
            {
              id: 'back-squat',
              name: 'Barbell back squat',
              note: 'No shortcuts. Full depth, full effort.',
              sets: '4 × 5–6',
              rpe: 'RPE 8–9',
              rest: '3 min',
              restSec: 180,
              restHint: "Squats are the most taxing thing you'll do all week. 3 full minutes.",
              prog: 'Add 2.5–5kg when you hit 6 solid reps on all 4 sets.',
              numSets: 4
            },
            {
              id: 'leg-press',
              name: 'Leg press',
              note: 'Feet low and close for more quad',
              sets: '3 × 10–12',
              rpe: 'RPE 8',
              rest: '2 min',
              restSec: 120,
              restHint: "Legs recover slower than upper body. Take the full 2 min.",
              prog: 'Add one plate per side when all 3 sets hit 12 reps.',
              numSets: 3
            },
            {
              id: 'hack-squat',
              name: 'Hack squat or sissy squat',
              note: 'Brutal quad finisher',
              sets: '3 × 12–15',
              rpe: 'RPE 7–8',
              rest: '90 sec',
              restSec: 90,
              restHint: "You're already fatigued — 90 sec is plenty.",
              prog: 'Add one plate or 5kg when 15 reps feel manageable on all sets.',
              numSets: 3
            }
          ]
        },
        {
          label: 'Hamstrings & glutes',
          exercises: [
            {
              id: 'rdl',
              name: 'Romanian deadlift',
              note: 'Push hips back — feel every inch of stretch',
              sets: '3 × 8–10',
              rpe: 'RPE 7–8',
              rest: '90 sec',
              restSec: 90,
              restHint: "Let the hamstrings fully tighten before the next set.",
              prog: 'Add 5kg when you hit 10 reps on all 3 sets with control.',
              numSets: 3
            },
            {
              id: 'lying-leg-curl',
              name: 'Lying leg curl',
              note: '3-second negative on every rep',
              sets: '3 × 12–15',
              rpe: 'RPE 7',
              rest: '75 sec',
              restSec: 75,
              restHint: "Isolation — short rest keeps the pump going.",
              prog: 'Add one plate when all 3 sets reach 15 smooth reps.',
              numSets: 3
            }
          ]
        },
        {
          label: 'Calves',
          exercises: [
            {
              id: 'standing-calf-raise',
              name: 'Standing calf raise',
              note: 'Full stretch at bottom, 1-sec pause at top',
              sets: '4 × 15–20',
              rpe: 'RPE 8',
              rest: '60 sec',
              restSec: 60,
              restHint: "Calves are dense — short rest forces more adaptation.",
              prog: "Add weight when 20 reps feel easy. Don't skip the stretch.",
              numSets: 4
            }
          ]
        },
        {
          label: 'Abs',
          exercises: [
            {
              id: 'cable-crunch',
              name: 'Cable crunch',
              note: 'Weighted — don\'t just crunch air',
              sets: '3 × 15–20',
              rpe: 'RPE 7',
              rest: '60 sec',
              restSec: 60,
              restHint: "Treat abs like any other muscle — rest, then work.",
              prog: 'Add one plate when 20 reps feel easy across all 3 sets.',
              numSets: 3
            },
            {
              id: 'hanging-leg-raise',
              name: 'Hanging leg raise',
              note: 'Control the swing — no kipping',
              sets: '3 × 12–15',
              rpe: 'RPE 7',
              rest: '60 sec',
              restSec: 60,
              restHint: "If grip gives out, use straps.",
              prog: 'Add ankle weights or slow down the tempo when 15 reps is easy.',
              numSets: 3
            }
          ]
        }
      ]
    },
    {
      id: 'thu',
      label: 'Thu',
      tabName: 'Upper Body',
      title: 'Upper body',
      badges: ["Chest & shoulder focus", "Light back only"],
      tip: "Back only had 1 day rest since Tuesday — keep rows moderate weight and high control. Chest and shoulders are fully recovered, so push those hard.",
      sections: [
        {
          label: 'Chest',
          exercises: [
            {
              id: 'incline-press',
              name: 'Incline barbell or dumbbell press',
              note: 'Different angle from Monday — upper chest',
              sets: '4 × 8–10',
              rpe: 'RPE 7–8',
              rest: '90 sec',
              restSec: 90,
              restHint: "Not a max effort day — 90 sec keeps intensity steady.",
              prog: 'Add 2.5kg or move up one DB when 10 reps land on all 4 sets.',
              numSets: 4
            },
            {
              id: 'weighted-dips',
              name: 'Weighted dips',
              note: 'Lower chest + tricep strength',
              sets: '3 × 8–12',
              rpe: 'RPE 7–8',
              rest: '90 sec',
              restSec: 90,
              restHint: "Full dip depth — chest forward, lean slightly.",
              prog: 'Add 2.5kg belt weight when you hit 12 reps on all 3 sets.',
              numSets: 3
            },
            {
              id: 'pec-deck',
              name: 'Pec deck or cable fly',
              note: 'Squeeze and hold 1 sec at peak',
              sets: '3 × 12–15',
              rpe: 'RPE 7',
              rest: '60 sec',
              restSec: 60,
              restHint: "Pure stretch and squeeze. Short rest is fine.",
              prog: 'Add one plate when 15 reps feel easy on all sets.',
              numSets: 3
            }
          ]
        },
        {
          label: 'Shoulders',
          exercises: [
            {
              id: 'cable-lateral-raise',
              name: 'Cable lateral raise',
              note: 'Better constant tension than dumbbells',
              sets: '4 × 15',
              rpe: 'RPE 7',
              rest: '60 sec',
              restSec: 60,
              restHint: "Short rest amplifies the lateral delt burn — embrace it.",
              prog: 'Add one plate when all 4 sets reach 15 controlled reps.',
              numSets: 4
            },
            {
              id: 'face-pull',
              name: 'Face pull',
              note: 'Shoulder health — do this every session',
              sets: '3 × 15–20',
              rpe: 'RPE 6',
              rest: '60 sec',
              restSec: 60,
              restHint: "This is prehab as much as training. Never skip.",
              prog: 'Small increments only. Add one plate when 20 reps feel easy.',
              numSets: 3
            }
          ]
        },
        {
          label: 'Light back',
          exercises: [
            {
              id: 'db-row-light',
              name: 'Single-arm dumbbell row',
              note: 'Moderate weight — back had 1 day rest',
              sets: '3 × 12',
              rpe: 'RPE 6–7',
              rest: '60 sec',
              restSec: 60,
              restHint: "Easy today. Full range, feel the lat. Don't ego lift.",
              prog: "Don't push progression here. Keep it moderate every Thursday.",
              numSets: 3
            },
            {
              id: 'lat-pulldown-light',
              name: 'Lat pulldown (wide grip)',
              note: 'Controlled — not heavy today',
              sets: '3 × 12–15',
              rpe: 'RPE 6–7',
              rest: '60 sec',
              restSec: 60,
              restHint: "Width work with light load. Focus on the mind-muscle connection.",
              prog: "Match Tuesday's weight when back is fully recovered. Today stays lighter.",
              numSets: 3
            }
          ]
        },
        {
          label: 'Arms',
          exercises: [
            {
              id: 'arm-superset',
              name: 'Superset: DB curl + skull crusher',
              note: 'Back to back, 15 sec between moves',
              sets: '3 × 10–12 each',
              rpe: 'RPE 7',
              rest: '90 sec',
              restSec: 90,
              restHint: "Rest after completing both moves. Burns efficiently.",
              prog: 'Increase either the curl or the extension when both hit 12 reps.',
              numSets: 3
            },
            {
              id: 'tricep-finisher',
              name: 'Tricep pushdown (pump finisher)',
              note: 'High rep, short rest — pure pump',
              sets: '2 × 15',
              rpe: 'RPE 6–7',
              rest: '45 sec',
              restSec: 45,
              restHint: "Finisher. Don't overthink it — just pump the muscle.",
              prog: 'Not a main lift — keep it light and feel every rep.',
              numSets: 2
            }
          ]
        }
      ]
    },
    {
      id: 'fri',
      label: 'Fri',
      tabName: 'Legs / Abs',
      title: 'Legs & abs — hip & hamstring focus',
      badges: ['Legs day 2'],
      tip: "Opposite focus from Wednesday — hips and hamstrings lead today. Deadlift is the main event of the whole week. Everything after is supports it.",
      sections: [
        {
          label: 'Hinge & hamstrings',
          exercises: [
            {
              id: 'deadlift',
              name: 'Conventional deadlift',
              note: 'Heaviest lift of the entire week',
              sets: '4 × 4–5',
              rpe: 'RPE 8–9',
              rest: '3–4 min',
              restSec: 210,
              restHint: "Deadlifts are uniquely taxing on the nervous system. Take every second of rest.",
              prog: 'Add 5kg when you hit 5 crisp reps on all 4 sets. Never grind ugly reps.',
              numSets: 4
            },
            {
              id: 'hip-thrust',
              name: 'Barbell hip thrust',
              note: 'Best glute builder — go heavy here',
              sets: '4 × 8–10',
              rpe: 'RPE 8',
              rest: '2 min',
              restSec: 120,
              restHint: "Heavy glute work needs real recovery. 2 full minutes.",
              prog: 'Add 5kg when you hit 10 reps on all 4 sets with a full lockout.',
              numSets: 4
            },
            {
              id: 'nordic-curl',
              name: 'Nordic curl or seated leg curl',
              note: 'Hamstring lengthening — eccentric focus',
              sets: '3 × 8–12',
              rpe: 'RPE 7–8',
              rest: '90 sec',
              restSec: 90,
              restHint: "Eccentric work causes more soreness — rest well and hydrate.",
              prog: 'Add ankle weight (Nordics) or one plate (machine) at 12 reps.',
              numSets: 3
            }
          ]
        },
        {
          label: 'Quad accessory',
          exercises: [
            {
              id: 'split-squat',
              name: 'Bulgarian split squat',
              note: 'Unilateral balance + quad depth',
              sets: '3 × 10 each',
              rpe: 'RPE 7–8',
              rest: '90 sec',
              restSec: 90,
              restHint: "Rest is per leg pair — not per leg. Take the full 90 sec.",
              prog: 'Add 2–4kg dumbbells when 10 reps feel stable on both legs.',
              numSets: 3
            },
            {
              id: 'leg-extension',
              name: 'Leg extension',
              note: 'Quad isolation finisher',
              sets: '3 × 15',
              rpe: 'RPE 7',
              rest: '60 sec',
              restSec: 60,
              restHint: "Pure isolation — short rest keeps the quad pump alive.",
              prog: 'Add one plate when 15 reps feel comfortable on all sets.',
              numSets: 3
            }
          ]
        },
        {
          label: 'Calves',
          exercises: [
            {
              id: 'seated-calf-raise',
              name: 'Seated calf raise',
              note: 'Hits soleus — different from standing',
              sets: '4 × 15–20',
              rpe: 'RPE 8',
              rest: '60 sec',
              restSec: 60,
              restHint: "Short rest, high reps. Soleus responds well to volume.",
              prog: 'Add weight when 20 reps feel easy. Prioritize the stretch.',
              numSets: 4
            }
          ]
        },
        {
          label: 'Abs',
          exercises: [
            {
              id: 'decline-situp',
              name: 'Weighted decline sit-up',
              note: 'Add a plate when bodyweight is easy',
              sets: '3 × 12–15',
              rpe: 'RPE 7',
              rest: '60 sec',
              restSec: 60,
              restHint: "Controlled descent — don't flop down.",
              prog: 'Hold a 5kg plate when 15 bodyweight reps feel easy.',
              numSets: 3
            },
            {
              id: 'plank',
              name: 'Plank variation',
              note: 'Side plank, RKC, or standard',
              sets: '3 × 45 sec',
              rpe: 'RPE 7',
              rest: '45 sec',
              restSec: 45,
              restHint: "Short rest amplifies core fatigue — that's the point.",
              prog: 'Increase hold to 60 sec, then add weight vest or elevate feet.',
              numSets: 3
            },
            {
              id: 'ab-wheel',
              name: 'Ab wheel rollout',
              note: 'Slow and fully controlled',
              sets: '3 × 10–12',
              rpe: 'RPE 7',
              rest: '60 sec',
              restSec: 60,
              restHint: "One of the hardest ab moves — don't rush.",
              prog: 'Increase range of motion over time, or add reps.',
              numSets: 3
            }
          ]
        }
      ]
    },
    {
      id: 'sat',
      label: 'Sat',
      tabName: 'Rest',
      title: 'Saturday Rest',
      badges: ['Rest day'],
      tip: "Recovery is just as important as the work. Feed your muscles and rest up.",
      sections: []
    },
    {
      id: 'sun',
      label: 'Sun',
      tabName: 'Rest',
      title: 'Sunday Rest',
      badges: ['Rest day'],
      tip: "Prep your meals and get ready for the week ahead.",
      sections: []
    }
  ]
};
