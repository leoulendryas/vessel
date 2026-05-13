const PROGRAM = {
  days: [
    {
      id: 'mon',
      label: 'Mon',
      tabName: 'Chest / Tris / Shoulders',
      title: 'Chest, triceps & shoulders',
      badges: ['Push day'],
      tip: "Hammer Strength gives you an independent arm press — if one side is stronger it can't compensate for the other. Start heavy and focused. Triceps are already warm from pressing so save them for last.",
      sections: [
        {
          label: 'Chest',
          exercises: [
            {
              id: 'hammer-chest-press',
              name: 'Hammer Strength chest press',
              note: 'Main compound — independent arms, natural pressing path',
              sets: '4 × 5–6',
              rpe: 'RPE 8–9',
              rest: '2–3 min',
              restSec: 150,
              restHint: "CNS-heavy — don't rush. Breathe fully before each set.",
              prog: 'Add a plate when you hit 6 clean reps on all 4 sets.',
              numSets: 4
            },
            {
              id: 'hammer-incline-press',
              name: 'Hammer Strength incline press',
              note: 'Upper chest — independent arms, different angle',
              sets: '3 × 8–10',
              rpe: 'RPE 7–8',
              rest: '90 sec',
              restSec: 90,
              restHint: "Moderate rest — enough to recover but keep intensity up.",
              prog: 'Add weight when 10 reps feel controlled on all 3 sets.',
              numSets: 3
            },
            {
              id: 'cable-fly-low-high',
              name: 'Cable fly (low to high)',
              note: 'Full stretch — constant tension throughout',
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
              id: 'shoulder-press-machine',
              name: 'Shoulder press machine',
              note: 'Stable path — focus on pushing hard',
              sets: '3 × 8–10',
              rpe: 'RPE 7–8',
              rest: '90 sec',
              restSec: 90,
              restHint: "Give shoulders time — they fatigue faster than chest.",
              prog: 'Add weight when you nail 10 reps across all 3 sets.',
              numSets: 3
            },
            {
              id: 'lateral-raise-machine',
              name: 'Lateral raise machine (standing)',
              note: '3-second slow negative every rep',
              sets: '4 × 12–15',
              rpe: 'RPE 7',
              rest: '60 sec',
              restSec: 60,
              restHint: "60 sec max — the burn is part of it.",
              prog: 'Add one step when all 4 sets reach 15 reps with control.',
              numSets: 4
            },
            {
              id: 'reverse-pec-deck',
              name: 'Reverse pec deck',
              note: 'Best rear delt machine — never skip it',
              sets: '3 × 15',
              rpe: 'RPE 6–7',
              rest: '60 sec',
              restSec: 60,
              restHint: "Light weight, short rest. Pure isolation.",
              prog: 'Small jumps only. Add one step when 15 reps feel easy.',
              numSets: 3
            }
          ]
        },
        {
          label: 'Triceps',
          exercises: [
            {
              id: 'weighted-tricep-dips',
              name: 'Weighted tricep dips',
              note: 'Upright torso — keep it tricep focused',
              sets: '3 × 8–10',
              rpe: 'RPE 7–8',
              rest: '90 sec',
              restSec: 90,
              restHint: "Add a dumbbell between legs or use a dip belt.",
              prog: 'Add a dumbbell between legs when bodyweight gets easy.',
              numSets: 3
            },
            {
              id: 'cable-overhead-ext',
              name: 'Cable overhead tricep extension',
              note: 'Long head emphasis — the biggest part of the tricep',
              sets: '3 × 10–12',
              rpe: 'RPE 7',
              rest: '60–75 sec',
              restSec: 67,
              restHint: "Triceps are already pre-fatigued from pressing — 60 sec is enough.",
              prog: 'Add one plate when you hit 12 reps on all 3 sets.',
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
              id: 'chest-supported-tbar-row',
              name: 'Chest-supported T-bar row',
              note: 'Main compound — zero lower back stress',
              sets: '4 × 6–8',
              rpe: 'RPE 8–9',
              rest: '2–3 min',
              restSec: 150,
              restHint: "This is your heaviest back work. Full recovery between sets.",
              prog: 'Add a plate when you hit 8 clean reps on all 4 sets.',
              numSets: 4
            },
            {
              id: 'hammer-iso-row',
              name: 'Hammer Strength iso-lateral row',
              note: 'One arm at a time — fixes left/right imbalances',
              sets: '3 × 8–10',
              rpe: 'RPE 7–8',
              rest: '90 sec',
              restSec: 90,
              restHint: "Controlled tempo — feel the full range on each side.",
              prog: 'Add weight when all 3 sets reach 10 clean reps.',
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
              id: 'ez-preacher-curl',
              name: 'EZ-bar preacher curl',
              note: 'Locked arm — no cheating possible',
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
      tip: "Hack squat is your main quad lift. No lower back loading at all — just pure quad work. Go deep, go heavy, and everything after is just volume.",
      sections: [
        {
          label: 'Quads',
          exercises: [
            {
              id: 'hack-squat-machine',
              name: 'Hack squat machine',
              note: 'Main quad compound — no lower back loading',
              sets: '4 × 6–8',
              rpe: 'RPE 8–9',
              rest: '3 min',
              restSec: 180,
              restHint: "The most taxing thing on Wednesday. Take 3 full minutes.",
              prog: 'Add a plate when you hit 8 solid reps on all 4 sets.',
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
              id: 'leg-extension',
              name: 'Leg extension machine',
              note: 'Quad isolation finisher',
              sets: '3 × 12–15',
              rpe: 'RPE 7',
              rest: '60 sec',
              restSec: 60,
              restHint: "Pure isolation — short rest keeps the quad pump alive.",
              prog: 'Add one step when 15 reps feel comfortable on all sets.',
              numSets: 3
            }
          ]
        },
        {
          label: 'Hamstrings',
          exercises: [
            {
              id: 'rdl',
              name: 'Romanian deadlift',
              note: 'Moderate weight — push hips back and feel the stretch',
              sets: '3 × 10–12',
              rpe: 'RPE 7',
              rest: '90 sec',
              restSec: 90,
              restHint: "Keep weight moderate. Only add when form is perfect.",
              prog: 'Add weight gradually. Prioritize stretch and feel over load.',
              numSets: 3
            },
            {
              id: 'lying-leg-curl',
              name: 'Lying leg curl machine',
              note: '3-second negative on every rep',
              sets: '3 × 12–15',
              rpe: 'RPE 7',
              rest: '75 sec',
              restSec: 75,
              restHint: "Isolation — short rest keeps the pump going.",
              prog: 'Add one step when all 3 sets reach 15 smooth reps.',
              numSets: 3
            }
          ]
        },
        {
          label: 'Calves',
          exercises: [
            {
              id: 'standing-calf-raise-machine',
              name: 'Standing calf raise machine',
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
              note: "Weighted — don't just crunch air",
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
      badges: ['Chest & shoulder focus', 'Light back only'],
      tip: "Back only had 1 day rest since Tuesday — keep rows moderate weight and high control. Different chest movements from Monday so you hit new angles.",
      sections: [
        {
          label: 'Chest',
          exercises: [
            {
              id: 'pec-deck-machine',
              name: 'Pec deck machine',
              note: 'Different stimulus from Monday pressing',
              sets: '3 × 12–15',
              rpe: 'RPE 7–8',
              rest: '75 sec',
              restSec: 75,
              restHint: "Not a max effort day — 75 sec keeps intensity steady.",
              prog: 'Add one step when 15 reps feel easy on all 3 sets.',
              numSets: 3
            },
            {
              id: 'weighted-dips',
              name: 'Weighted dips',
              note: 'Lean forward slightly — lower chest focus today',
              sets: '3 × 8–12',
              rpe: 'RPE 7–8',
              rest: '90 sec',
              restSec: 90,
              restHint: "Full dip depth — lean slightly forward for lower chest.",
              prog: 'Add 2.5kg belt weight when you hit 12 reps on all 3 sets.',
              numSets: 3
            }
          ]
        },
        {
          label: 'Shoulders',
          exercises: [
            {
              id: 'lateral-raise-machine-thu',
              name: 'Lateral raise machine (standing)',
              note: 'Second hit this week — controlled reps',
              sets: '4 × 15',
              rpe: 'RPE 7',
              rest: '60 sec',
              restSec: 60,
              restHint: "Short rest amplifies the lateral delt burn — embrace it.",
              prog: 'Add one step when all 4 sets reach 15 controlled reps.',
              numSets: 4
            },
            {
              id: 'reverse-pec-deck-thu',
              name: 'Reverse pec deck',
              note: 'Shoulder health — never skip it',
              sets: '3 × 15–20',
              rpe: 'RPE 6',
              rest: '60 sec',
              restSec: 60,
              restHint: "This is prehab as much as training. Never skip.",
              prog: 'Small increments only. Add one step when 20 reps feel easy.',
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
              name: 'Superset: preacher curl + cable overhead extension',
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
              name: 'Rope pushdown (finisher)',
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
      title: 'Legs & abs — hamstring focus',
      badges: ['Legs day 2'],
      tip: "Leg press with high feet is your main compound today. Hyperextension bench is the hidden gem here — it directly strengthens your lower back and hamstrings with zero spinal compression.",
      sections: [
        {
          label: 'Main compound',
          exercises: [
            {
              id: 'leg-press-fri',
              name: 'Leg press (feet high and wide)',
              note: 'High foot placement shifts load toward hamstrings',
              sets: '4 × 8–10',
              rpe: 'RPE 8–9',
              rest: '2–3 min',
              restSec: 150,
              restHint: "This is your main compound today. Take full recovery.",
              prog: 'Add one plate per side when all 4 sets hit 10 reps.',
              numSets: 4
            }
          ]
        },
        {
          label: 'Hamstrings & posterior chain',
          exercises: [
            {
              id: 'rdl-fri',
              name: 'Romanian deadlift',
              note: 'Controlled — hinge and feel every inch of stretch',
              sets: '3 × 10–12',
              rpe: 'RPE 7',
              rest: '90 sec',
              restSec: 90,
              restHint: "Keep weight moderate. Only increase when form is perfect.",
              prog: 'Only increase when form is perfect and back feels strong.',
              numSets: 3
            },
            {
              id: 'seated-leg-curl',
              name: 'Seated leg curl machine',
              note: 'Different machine from Wednesday — hits a different angle',
              sets: '3 × 10–12',
              rpe: 'RPE 7–8',
              rest: '75 sec',
              restSec: 75,
              restHint: "Different angle than Wednesday's lying curl.",
              prog: 'Add one step when all 3 sets reach 12 smooth reps.',
              numSets: 3
            },
            {
              id: 'hyperextension-bench',
              name: 'Hyperextension bench',
              note: "Lower back + hamstrings — your back's best friend",
              sets: '3 × 12–15',
              rpe: 'RPE 7',
              rest: '60 sec',
              restSec: 60,
              restHint: "Zero spinal compression. Directly strengthens your lower back.",
              prog: 'Add a plate when 15 reps feel easy. Never rush this.',
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
              note: 'Unilateral — fixes left/right imbalances',
              sets: '3 × 10 each',
              rpe: 'RPE 7–8',
              rest: '90 sec',
              restSec: 90,
              restHint: "Rest is per leg pair — not per leg. Take the full 90 sec.",
              prog: 'Add 2–4kg dumbbells when 10 reps feel stable on both legs.',
              numSets: 3
            }
          ]
        },
        {
          label: 'Calves',
          exercises: [
            {
              id: 'seated-calf-raise-machine',
              name: 'Seated calf raise machine',
              note: 'Hits soleus — different muscle from standing calf raise',
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
              id: 'cable-crunch-fri',
              name: 'Cable crunch',
              note: "Weighted — treat abs like any other muscle",
              sets: '3 × 15–20',
              rpe: 'RPE 7',
              rest: '60 sec',
              restSec: 60,
              restHint: "Treat abs like any other muscle — rest, then work.",
              prog: 'Add one plate when 20 reps feel easy across all 3 sets.',
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
