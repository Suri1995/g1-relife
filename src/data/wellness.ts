
export const business = {
  name: "G1 RE-LIFE Wellness Zone",
  coachName: "Veena Jeevan",
  coachTitle: "Wellness Coach",
  phoneDisplay: "+91 99667 63679",
  phoneRaw: "+919966763679",
  whatsapp: "https://wa.me/919966763679",
  email: "veenag1.fitcoach@gmail.com",
  locationName: "Dilsukhnagar, Hyderabad",
  mapsUrl:
    "https://www.google.com/maps/place/G1+Re-Life+wellness+Zone+Dilshuknagar/@17.3696902,78.5484509,733m/data=!3m1!1e3!4m6!3m5!1s0x3bcb99089b38a29d:0x32d7b6927490e724!8m2!3d17.369709!4d78.5484122!16s%2Fg%2F11f6dksw9n",
  lat: 17.369709,
  lng: 78.5484122,
  social: {
    facebook: "https://www.facebook.com/veena.kolluru.7/",
    instagram: "https://www.instagram.com/veenag1fitcoach",
    youtube: "https://youtube.com/@g1relifewellnesszone",
  },
  coverImage:
    "https://mybusinessweb.in/uploads/vcards/covers/25341/WhatsApp-Image-2026-05-01-at-2.42.32-PM.jpeg",
  profileImage:
    "/veena-mam.webp",
  about: [
    "At G1 RE-LIFE Wellness Zone, we are dedicated to helping individuals achieve a healthier, more balanced lifestyle. Our mission is to promote overall well-being through personalized wellness solutions that focus on both physical and mental health.",
    "We believe that true wellness comes from a combination of proper nutrition, fitness, and a positive mindset. At G1 RE-LIFE Wellness Zone, we provide guidance, support, and effective wellness programs tailored to meet individual needs and goals.",
    "With a customer-first approach, we strive to create a comfortable and motivating environment where every individual feels encouraged to transform their lifestyle. Our team is committed to delivering quality service and continuous support throughout your wellness journey.",
  ],
};

export type ServiceCategory =
  | "weight-body"
  | "nutrition-vitality"
  | "life-stage"
  | "mind-rest";

export const serviceCategories: { id: ServiceCategory; label: string }[] = [
  { id: "weight-body", label: "Weight & Body" },
  { id: "nutrition-vitality", label: "Nutrition & Vitality" },
  { id: "life-stage", label: "Life Stage Care" },
  { id: "mind-rest", label: "Mind & Rest" },
];

export type Service = {
  id: string;
  title: string;
  description: string;
  image: string;
  category: ServiceCategory;
  details?: {
    heading: string;
    introduction: string;
    subheading: string;
    features: string[];
    benefitsHeading: string;
    benefits: string[];
    closingHeading: string;
    closingDescription: string;
  };
};

export const services: Service[] = [
  {
  id: "weight-fat-loss",
  title: "Weight & Fat Loss",
  description:
    "A personalized plan to help you burn fat, lose excess weight, and improve overall health safely.",
  image:
    "https://mybusinessweb.in/uploads/vcards/services/25342/WhatsApp-Image-2026-05-01-at-2.54.36-PM.jpeg",
  category: "weight-body",
  details: {
    heading:
      "Achieve Your Weight Loss Goals with Healthy Nutrition and Lifestyle Changes",
    introduction:
      "At G1 Re-Life Wellness Zone, we help you work towards your weight loss goals through personalized nutrition guidance, healthy eating habits, and lifestyle improvement. Our approach focuses on gradual, sustainable progress while supporting your overall wellness.",
    subheading: "Our Weight Loss Services",
    features: [
      "Personalized Nutrition Guidance: Nutrition plans tailored to your lifestyle and individual needs.",
      "Healthy Weight Management: Guidance to help you work towards a healthy weight.",
      "Body Composition Analysis: Understand your weight, body fat percentage, muscle mass, and other body composition measurements.",
      "Healthy Eating Habits: Learn portion control, balanced nutrition, and better food choices.",
      "Lifestyle Correction: Build healthy daily routines with physical activity, hydration, and quality sleep.",
      "Regular Progress Monitoring: Track your progress and receive ongoing wellness guidance.",
      "Personal Wellness Counselling: Get support and motivation throughout your wellness journey.",
    ],
    benefitsHeading: "Why Choose G1 Re-Life Wellness Zone?",
    benefits: [
      "Personalized wellness support",
      "Practical and sustainable lifestyle guidance",
      "Regular progress tracking",
      "Friendly nutrition counselling",
      "Online and offline wellness support",
    ],
    closingHeading: "Start Your Wellness Journey Today!",
    closingDescription:
      "Take the first step towards healthier habits, improved fitness, and better overall well-being.",
  },
},
  {
  id: "muscle-gain",
  title: "Muscle Gain",
  description:
    "The process of increasing muscle mass through strength training, proper nutrition, and recovery.",
  image:
    "https://mybusinessweb.in/uploads/vcards/services/25343/WhatsApp-Image-2026-05-01-at-2.56.17-PM.jpeg",
  category: "weight-body",
  details: {
    heading: "Muscle Gain Program – Build Strength, Build Confidence!",
    introduction:
      "Achieve Your Muscle-Building Goals with Balanced Nutrition and Healthy Lifestyle Habits. At G1 Re-Life Wellness Zone, we provide personalized nutrition guidance to help you work towards your muscle gain goals, improve strength, and support a healthy body composition. Our approach combines balanced nutrition, proper exercise, and consistent lifestyle habits.",
    subheading: "Our Muscle Gain Services",
    features: [
      "Personalized Nutrition Guidance: Nutrition plans based on your individual needs and goals.",
      "Healthy Weight Gain: Guidance to help you gain weight in a balanced and healthy way.",
      "Muscle Development Support: Nutrition guidance to support muscle growth along with appropriate strength training.",
      "Body Composition Analysis: Monitor weight, muscle mass, body fat percentage, and other measurements.",
      "Protein and Balanced Nutrition: Learn about protein-rich foods and essential nutrients for muscle development.",
      "Progress Monitoring: Track your progress with regular wellness assessments.",
      "Lifestyle Guidance: Improve hydration, sleep, physical activity, and daily eating habits.",
    ],
    benefitsHeading: "Why Choose G1 Re-Life Wellness Zone?",
    benefits: [
      "Personalized nutrition support",
      "Healthy weight and muscle gain guidance",
      "Regular body composition monitoring",
      "Practical food and lifestyle advice",
      "Online and offline wellness support",
    ],
    closingHeading: "Start Building a Stronger You!",
    closingDescription:
      "Take the first step towards your muscle gain goals with the right nutrition, consistent exercise, and healthy lifestyle habits.",
  },
},
  {
  id: "weight-management",
  title: "Weight Management",
  description:
    "Maintaining a healthy body weight through balanced diet, regular exercise, and lifestyle habits.",
  image:
    "https://mybusinessweb.in/uploads/vcards/services/25344/WhatsApp-Image-2026-05-01-at-2.57.23-PM.jpeg",
  category: "weight-body",
  details: {
    heading: "Achieve a Healthier You!",
    introduction:
      "Maintain a Healthy Weight with Balanced Nutrition, Physical Activity, and Sustainable Lifestyle Changes! At G1 Re-Life Wellness Zone, we provide personalized nutrition guidance to help you work towards your weight goals. Whether you want to lose weight, gain weight, or maintain your current weight, we support you in developing healthy eating habits and a balanced lifestyle.",
    subheading: "Why Is Weight Management Important?",
    features: [
      "Healthy Body Composition: Understand your weight, body fat, and muscle mass.",
      "Energy & Fitness: Support your daily activities with balanced nutrition and exercise.",
      "Healthy Eating Habits: Learn portion control and make nutritious food choices.",
      "Muscle Support: Include adequate protein and suitable physical activity in your routine.",
      "Lifestyle Improvement: Develop healthy habits for sleep, hydration, and exercise.",
      "Long-Term Wellness: Focus on gradual, sustainable progress rather than crash diets.",
    ],
    benefitsHeading: "Our Weight Management Services",
    benefits: [
      "Personalized weight loss guidance",
      "Healthy weight gain support",
      "Weight maintenance counselling",
      "Body composition analysis",
      "Balanced diet and portion-control education",
      "Lifestyle correction and fitness guidance",
      "Regular progress monitoring",
      "Online and offline wellness support",
    ],
    closingHeading: "Start Your Weight Management Journey Today!",
    closingDescription:
      "Your goals deserve the right guidance and consistent effort. Let us help you build healthy habits and work towards a healthier lifestyle.",
  },
},
  {
  id: "digestive-health",
  title: "Digestive Health",
  description:
    "Efficient functioning of the digestive system to properly break down food, absorb nutrients, and eliminate waste.",
  image:
    "https://mybusinessweb.in/uploads/vcards/services/25345/WhatsApp-Image-2026-05-01-at-2.58.30-PM.jpeg",
  category: "nutrition-vitality",
  details: {
    heading: "Support Your Gut Health Naturally!",
    introduction:
      "Improve Your Digestive Health with Healthy Nutrition and Lifestyle Habits. At G1 Re-Life Wellness Zone, we provide personalized nutrition guidance to help you develop healthy digestion habits and support your overall digestive wellness. A healthy digestive system helps your body break down food, absorb essential nutrients, and eliminate waste.",
    subheading: "Our Digestive Wellness Services",
    features: [
      "Digestive Health Guidance: Learn healthy habits to support your digestive system.",
      "Balanced Nutrition: Understand how to include fiber-rich foods, fruits, vegetables, and whole grains in your diet.",
      "Healthy Eating Habits: Learn about meal timing, portion sizes, and mindful eating.",
      "Hydration Guidance: Understand the importance of drinking enough water.",
      "Gut Health Education: Learn about fiber and beneficial gut bacteria.",
      "Lifestyle Improvement: Build healthy routines with regular physical activity, adequate sleep, and stress management.",
      "Personalized Wellness Counselling: Get nutrition guidance based on your individual needs.",
    ],
    benefitsHeading: "Why Choose G1 Re-Life Wellness Zone?",
    benefits: [
      "Personalized nutrition guidance",
      "Healthy eating education",
      "Digestive wellness awareness",
      "Lifestyle improvement support",
      "Online and offline wellness guidance",
    ],
    closingHeading: "Take Care of Your Digestive Health!",
    closingDescription:
      "Start building healthy eating habits to support digestion and improve your overall well-being.",
  },
},
  {
  id: "heart-health",
  title: "Heart Health",
  description:
    "Proper functioning of the heart and blood vessels, supported by a healthy lifestyle, diet, and regular physical activity.",
  image:
    "https://mybusinessweb.in/uploads/vcards/services/25346/WhatsApp-Image-2026-05-01-at-2.59.22-PM.jpeg",
  category: "nutrition-vitality",
  details: {
    heading: "Heart Health – Care for Your Heart, Care for Your Life!",
    introduction:
      "Support Your Heart Health with Balanced Nutrition and Healthy Lifestyle Habits. At G1 Re-Life Wellness Zone, we provide personalized nutrition guidance and lifestyle education to help you develop heart-healthy habits. Balanced nutrition, regular physical activity, quality sleep, and stress management all play an important role in supporting cardiovascular health.",
    subheading: "Our Heart Health Services",
    features: [
      "Heart-Healthy Nutrition: Learn to choose balanced meals with vegetables, fruits, whole grains, and healthy fats.",
      "Healthy Weight Management: Get guidance on maintaining a healthy weight.",
      "Blood Pressure Awareness: Understand the importance of monitoring blood pressure.",
      "Cholesterol Awareness: Learn about healthy food choices that support healthy cholesterol levels.",
      "Lifestyle Improvement: Develop healthy habits through regular exercise, good sleep, and stress management.",
      "Body Composition Analysis: Understand your body composition and track your wellness progress.",
      "Personalized Wellness Counselling: Receive nutrition guidance according to your individual needs.",
    ],
    benefitsHeading: "Why Choose G1 Re-Life Wellness Zone?",
    benefits: [
      "Personalized nutrition guidance",
      "Heart-health awareness",
      "Healthy lifestyle education",
      "Regular wellness progress monitoring",
      "Online and offline wellness support",
    ],
    closingHeading: "Make Heart Health a Priority!",
    closingDescription:
      "Small, healthy changes today can support your heart health for years to come.",
  },
},
  {
  id: "bone-joint-support",
  title: "Bone & Joint Support",
  description:
    "Maintaining strong bones and flexible joints through proper nutrition, exercise, and healthy lifestyle habits.",
  image:
    "https://mybusinessweb.in/uploads/vcards/services/25347/WhatsApp-Image-2026-05-01-at-3.00.12-PM.jpeg",
  category: "nutrition-vitality",
  details: {
    heading: "Build Strong Bones and Support Healthy Joints!",
    introduction:
      "At G1 Re-Life Wellness Zone, we provide personalized nutrition guidance and lifestyle education to help you support bone strength, joint mobility, and overall wellness. Balanced nutrition, suitable physical activity, and healthy daily habits play an important role in maintaining an active lifestyle.",
    subheading: "Our Joint & Bone Health Services",
    features: [
      "Bone Health Nutrition: Learn about calcium, vitamin D, protein, and other nutrients important for bone health.",
      "Joint Health Support: Understand healthy habits that support joint function and mobility.",
      "Muscle Strength Support: Learn how balanced nutrition and suitable exercises help maintain muscle strength.",
      "Weight Management: Get guidance on maintaining a healthy weight to support joint comfort.",
      "Lifestyle Guidance: Understand the importance of physical activity, sunlight exposure, and adequate sleep.",
      "Body Composition Analysis: Monitor body composition as part of your overall wellness journey.",
      "Personalized Nutrition Counselling: Receive guidance based on your individual nutritional needs.",
    ],
    benefitsHeading: "Why Choose G1 Re-Life Wellness Zone?",
    benefits: [
      "Personalized nutrition guidance",
      "Bone and joint health awareness",
      "Healthy lifestyle education",
      "Support for active living",
      "Online and offline wellness support",
    ],
    closingHeading: "Take a Step Towards Stronger Bones!",
    closingDescription:
      "Build healthy habits today to support strength, mobility, and an active lifestyle.",
  },
},
  {
  id: "energy-fitness",
  title: "Energy & Fitness",
  description:
    "The body's ability to stay active, perform daily tasks efficiently, and maintain overall physical stamina and vitality.",
  image:
    "https://mybusinessweb.in/uploads/vcards/services/25348/WhatsApp-Image-2026-05-01-at-3.01.09-PM.jpeg",
  category: "weight-body",
  details: {
    heading: "Energy & Fitness – Feel Active, Stay Fit, Live Better!",
    introduction:
      "Boost Your Daily Energy and Support Your Fitness Goals with Balanced Nutrition and Healthy Lifestyle Habits. At G1 Re-Life Wellness Zone, we provide personalized nutrition guidance and lifestyle education to help you build healthy habits, maintain daily energy, and work towards your fitness goals. Balanced nutrition, regular physical activity, proper hydration, and quality sleep are essential for an active and healthy lifestyle.",
    subheading: "Our Energy & Fitness Services",
    features: [
      "Energy Management: Learn healthy habits to support your daily energy levels.",
      "Fitness Nutrition: Understand how balanced meals support physical activity and fitness.",
      "Healthy Weight Management: Get guidance to work towards your weight goals.",
      "Muscle Strength Support: Learn the importance of protein and suitable physical activity.",
      "Hydration Guidance: Understand the role of water in maintaining normal body function.",
      "Lifestyle Improvement: Build healthy routines for sleep, exercise, and stress management.",
      "Personalized Wellness Counselling: Receive nutrition guidance based on your individual needs.",
      "Progress Monitoring: Track your wellness journey with regular body composition assessments.",
    ],
    benefitsHeading: "Why Choose G1 Re-Life Wellness Zone?",
    benefits: [
      "Personalized nutrition guidance",
      "Healthy fitness habits",
      "Energy and lifestyle awareness",
      "Body composition monitoring",
      "Online and offline wellness support",
    ],
    closingHeading: "Feel More Active, Every Day!",
    closingDescription:
      "Build healthy daily habits with balanced nutrition, regular activity, and consistent lifestyle choices to support your overall well-being.",
  },
},
  {
  id: "sports-nutrition",
  title: "Sports Nutrition",
  description:
    "Fueling the body with the right nutrients to enhance athletic performance, recovery, and endurance.",
  image:
    "https://mybusinessweb.in/uploads/vcards/services/25349/WhatsApp-Image-2026-05-01-at-3.01.56-PM.jpeg",
  category: "nutrition-vitality",
  details: {
    heading: "Sports Nutrition – Fuel Your Body, Boost Your Performance!",
    introduction:
      "Improve Your Fitness, Support Muscle Recovery, and Reach Your Sports Goals with Proper Nutrition! At G1 Re-Life Wellness Zone, we provide nutrition guidance to support athletes, sports enthusiasts, and fitness lovers in achieving their performance goals. The right balance of carbohydrates, protein, healthy fats, vitamins, minerals, and water helps fuel physical activity, support muscle recovery, and maintain overall health.",
    subheading: "Why Is Sports Nutrition Important?",
    features: [
      "Energy & Stamina: Provides fuel for workouts, training, and sports activities.",
      "Muscle Growth & Strength: Protein supports muscle development and repair.",
      "Workout Recovery: Balanced nutrition helps the body recover after exercise.",
      "Hydration Support: Replacing fluids helps maintain normal body function during physical activity.",
      "Endurance & Performance: Proper fueling supports sustained activity and training.",
      "Healthy Body Composition: Supports healthy weight and muscle management.",
      "Overall Wellness: Essential nutrients help maintain general health and fitness.",
    ],
    benefitsHeading: "Our Sports Nutrition Services",
    benefits: [
      "Personalized sports nutrition guidance",
      "Pre-workout and post-workout food education",
      "Protein and balanced diet guidance",
      "Hydration and recovery awareness",
      "Muscle gain and healthy weight management support",
      "Body composition progress monitoring",
      "Nutrition guidance for active lifestyles",
    ],
    closingHeading: "Take Your Performance to the Next Level!",
    closingDescription:
      "Build healthy eating habits, train consistently, and give your body the nutrition it needs to support your fitness goals.",
  },
},
  {
  id: "childrens-nutrition",
  title: "Children's Nutrition",
  description:
    "Balanced nutrients essential for a child's growth, development, and overall health.",
  image:
    "https://mybusinessweb.in/uploads/vcards/services/25350/WhatsApp-Image-2026-05-01-at-3.03.00-PM.jpeg",
  category: "life-stage",
  details: {
    heading: "Children’s Nutrition – Healthy Kids, Bright Future!",
    introduction:
      "Give Your Children the Nutrition They Need to Grow, Learn, and Thrive! At G1 Re-Life Wellness Zone, we believe that good nutrition during childhood is essential for healthy growth and development. A balanced diet provides children with the energy and nutrients they need for strong bones, muscle development, immunity, concentration, and active daily lives.",
    subheading: "Why Is Children’s Nutrition Important?",
    features: [
      "Healthy Growth: Supports normal height, weight, and physical development.",
      "Strong Bones & Teeth: Calcium, vitamin D, and other nutrients help build strong bones and teeth.",
      "Brain Development: Essential nutrients support learning, memory, and concentration.",
      "Immune System Support: A balanced diet helps maintain normal immune function.",
      "Energy & Fitness: Nutritious foods provide energy for playing, learning, and daily activities.",
      "Healthy Digestion: Fiber-rich foods support regular bowel movements and digestive health.",
      "Healthy Eating Habits: Encourages children to develop good food choices from an early age.",
    ],
    benefitsHeading: "Our Children’s Nutrition Services",
    benefits: [
      "Personalized nutrition guidance for children",
      "Balanced food and healthy meal education",
      "Healthy growth and development awareness",
      "Guidance on fruits, vegetables, protein, and whole grains",
      "Support for healthy eating habits",
      "Parent counselling on children’s nutrition",
    ],
    closingHeading: "Give Your Child a Healthy Start!",
    closingDescription:
      "Small, healthy food choices today can help build a stronger foundation for tomorrow.",
  },
},
  {
  id: "senior-nutrition",
  title: "Senior (Old Age) Nutrition",
  description:
    "Tailored intake of nutrients that supports healthy aging, maintains strength, and helps manage age-related health changes.",
  image:
    "https://mybusinessweb.in/uploads/vcards/services/25351/WhatsApp-Image-2026-05-01-at-3.04.22-PM.jpeg",
  category: "life-stage",
  details: {
    heading: "Senior Nutrition – Healthy Ageing, Happy Living!",
    introduction:
      "Stay Active, Maintain Strength, and Enjoy Every Stage of Life with Balanced Nutrition! At G1 Re-Life Wellness Zone, we provide nutrition guidance to support the health and well-being of senior adults. As we age, our nutritional needs may change. Balanced meals, adequate protein, essential vitamins and minerals, hydration, and healthy lifestyle habits can help support strength, mobility, and independence.",
    subheading: "Why Is Senior Nutrition Important?",
    features: [
      "Bone Health: Calcium and vitamin D help maintain strong bones.",
      "Muscle Strength: Adequate protein supports muscle maintenance and physical strength.",
      "Heart Health: Balanced food choices support cardiovascular wellness.",
      "Digestive Health: Fiber-rich foods help support regular bowel movements.",
      "Immune Support: Essential nutrients help maintain normal immune function.",
      "Energy & Mobility: Balanced nutrition supports daily activities and an active lifestyle.",
      "Healthy Weight Management: Helps support a healthy weight and overall well-being.",
      "Hydration: Drinking enough fluids helps maintain normal body functions.",
    ],
    benefitsHeading: "Our Senior Nutrition Services",
    benefits: [
      "Personalized nutrition guidance",
      "Healthy ageing and balanced diet education",
      "Bone and muscle health awareness",
      "Digestive wellness guidance",
      "Healthy weight management support",
      "Hydration and lifestyle counselling",
      "Body composition monitoring",
    ],
    closingHeading: "Enjoy a Healthier, More Active Life!",
    closingDescription:
      "Small, consistent healthy habits can make a positive difference in your daily life. Let us support your journey towards healthy ageing and better well-being.",
  },
},
  {
    id: "mens-womens-health",
    title: "Men's & Women's Health",
    description:
      "Supporting gender-specific nutritional and lifestyle needs to maintain overall well-being and prevent health issues.",
    image:
      "https://mybusinessweb.in/uploads/vcards/services/25352/WhatsApp-Image-2026-05-01-at-3.05.58-PM.jpeg",
    category: "life-stage",
    details: {
      heading: "Nutrition and Lifestyle Support for Every Life Stage",
      introduction:
        "Men and women can have different nutritional and lifestyle needs throughout life. At G1 Re-Life Wellness Zone, we offer practical wellness guidance to help you build balanced habits that support your overall well-being.",
      subheading: "Areas We Can Support",
      features: [
        "Personalized nutrition guidance based on your goals, preferences, and daily routine.",
        "Balanced eating habits with practical ideas for meals and portion awareness.",
        "Lifestyle guidance to support regular movement, hydration, and quality sleep.",
        "Wellness support through changing routines and life stages.",
        "Body composition and progress monitoring as part of your wellness journey.",
        "Ongoing coaching to help you build consistent, sustainable habits.",
      ],
      benefitsHeading: "A Practical, Personalized Approach",
      benefits: [
        "Guidance shaped around your individual needs",
        "Healthy habits that fit your daily routine",
        "Support for nutrition, movement, hydration, and rest",
        "Regular check-ins and progress tracking",
        "A welcoming space for your wellness journey",
      ],
      closingHeading: "Take a Positive Step for Your Well-Being",
      closingDescription:
        "Start with small, sustainable choices. We can help you explore habits and wellness goals that suit your needs and everyday life.",
    },
  },
  {
  id: "stress-management",
  title: "Stress Management",
  description:
    "Using techniques like healthy habits, relaxation, and exercise to reduce stress and improve mental well-being.",
  image:
    "https://mybusinessweb.in/uploads/vcards/services/25353/WhatsApp-Image-2026-05-01-at-3.08.52-PM.jpeg",
  category: "mind-rest",
  details: {
    heading: "Stress Management – Relax Your Mind, Refresh Your Life!",
    introduction:
      "Find Balance, Build Resilience, and Support Your Well-Being with Healthy Lifestyle Habits! At G1 Re-Life Wellness Zone, we provide wellness guidance to help you understand stress and develop healthy ways to manage everyday challenges. A balanced lifestyle, nutritious food, regular physical activity, quality sleep, and relaxation techniques can support emotional well-being and a healthier life.",
    subheading: "Why Is Stress Management Important?",
    features: [
      "Mental Wellness: Learn healthy ways to handle everyday challenges.",
      "Better Sleep: Develop relaxing bedtime routines for quality rest.",
      "Energy & Focus: Healthy habits can support concentration and daily activities.",
      "Emotional Balance: Practice techniques to respond to stressful situations.",
      "Healthy Lifestyle: Make time for exercise, balanced meals, and relaxation.",
      "Mind-Body Wellness: Understand the connection between stress and physical well-being.",
      "Positive Habits: Build routines that encourage calmness, confidence, and balance.",
    ],
    benefitsHeading: "Our Stress Management Services",
    benefits: [
      "Healthy lifestyle guidance",
      "Relaxation and breathing techniques",
      "Nutrition and hydration guidance",
      "Sleep routine improvement",
      "Physical activity and wellness education",
      "Personal wellness counselling",
      "Support for building healthy daily habits",
    ],
    closingHeading: "Take a Moment for Yourself!",
    closingDescription:
      "Small steps such as deep breathing, walking, spending time with loved ones, and getting enough sleep can help you manage everyday stress.",
  },
},
  {
  id: "skin-health",
  title: "Skin Health",
  description:
    "Maintaining clear, strong, and hydrated skin through proper nutrition, hydration, protection, and skincare habits.",
  image:
    "https://mybusinessweb.in/uploads/vcards/services/25354/WhatsApp-Image-2026-05-01-at-3.10.08-PM.jpeg",
  category: "nutrition-vitality",
  details: {
    heading: "Skin Health – Nourish Your Skin, Glow with Confidence!",
    introduction:
      "Support Healthy, Radiant Skin with Balanced Nutrition and Good Daily Habits! At G1 Re-Life Wellness Zone, we provide nutrition guidance and lifestyle education to support healthy skin from within. Balanced nutrition, adequate hydration, quality sleep, and proper skincare habits all contribute to maintaining healthy-looking skin.",
    subheading: "Why Is Skin Health Important?",
    features: [
      "Healthy Skin: Essential nutrients support normal skin function.",
      "Skin Hydration: Drinking enough water helps maintain overall hydration.",
      "Skin Elasticity: Protein and vitamin C support normal collagen formation.",
      "Antioxidant Support: Fruits and vegetables provide nutrients that help protect cells from oxidative stress.",
      "Skin Nourishment: Vitamins, minerals, healthy fats, and protein support skin health.",
      "Healthy Lifestyle: Quality sleep and stress management support overall skin wellness.",
      "Daily Skin Protection: Appropriate skincare and sun protection help protect your skin.",
    ],
    benefitsHeading: "Our Skin Health Services",
    benefits: [
      "Personalized nutrition guidance",
      "Healthy eating and hydration education",
      "Skin wellness lifestyle counselling",
      "Guidance on nutrient-rich foods",
      "Healthy lifestyle habit improvement",
      "General wellness and body composition assessments",
    ],
    closingHeading: "Nourish Your Skin from Within!",
    closingDescription:
      "Make healthy food choices, stay hydrated, protect your skin from excessive sun exposure, and follow a consistent skincare routine for healthier-looking skin.",
  },
},
  {
  id: "immune-health",
  title: "Immune Health",
  description:
    "Supporting the immune system through balanced nutrition, healthy lifestyle choices, and stress management.",
  image:
    "https://mybusinessweb.in/uploads/vcards/services/25343/WhatsApp-Image-2026-05-01-at-2.56.17-PM.jpeg",
  category: "nutrition-vitality",
  details: {
    heading: "Immunity Health – Build Healthy Habits, Support Your Body!",
    introduction:
      "Support Your Immune System with Balanced Nutrition and a Healthy Lifestyle! At G1 Re-Life Wellness Zone, we provide personalized nutrition guidance and lifestyle education to help you maintain overall wellness and support normal immune function. A balanced diet, adequate sleep, regular physical activity, hydration, and good hygiene are important parts of a healthy lifestyle.",
    subheading: "Why Is Immunity Health Important?",
    features: [
      "Immune System Support: Essential nutrients help your immune system function normally.",
      "Balanced Nutrition: Fruits, vegetables, whole grains, and protein-rich foods provide important nutrients.",
      "Vitamin & Mineral Intake: Vitamins A, C, D, E, zinc, and other nutrients play roles in normal immune function.",
      "Gut Health: Fiber-rich foods support digestive health and a healthy gut environment.",
      "Quality Sleep: Adequate sleep supports normal immune function.",
      "Stress Management: Healthy ways to manage stress support overall well-being.",
      "Active Lifestyle: Regular physical activity contributes to general health.",
    ],
    benefitsHeading: "Our Immunity Wellness Services",
    benefits: [
      "Personalized nutrition guidance",
      "Balanced diet education",
      "Healthy food selection guidance",
      "Hydration and sleep routine counselling",
      "Lifestyle improvement support",
      "Body composition and wellness assessments",
      "Healthy habit development",
    ],
    closingHeading: "Make Your Health a Priority!",
    closingDescription:
      "Choose nutritious foods, sleep well, stay active, maintain good hygiene, and follow recommended vaccinations to support your overall health.",
  },
},
  {
  id: "sleep-management",
  title: "Sleep Management",
  description:
    "Maintaining healthy sleep patterns through consistent routines, relaxation practices, and good sleep hygiene.",
  image:
    "https://mybusinessweb.in/uploads/vcards/services/25355/WhatsApp-Image-2026-05-01-at-3.11.26-PM.jpeg",
  category: "mind-rest",
  details: {
    heading: "Sleep Management – Sleep Better, Live Healthier!",
    introduction:
      "Improve Your Sleep Quality and Support Your Overall Wellness with Healthy Daily Habits! At G1 Re-Life Wellness Zone, we provide lifestyle guidance to help you develop healthy sleep routines and improve your overall well-being. Quality sleep is important for physical recovery, mental focus, energy levels, mood, and maintaining a healthy lifestyle.",
    subheading: "Why Is Sleep Management Important?",
    features: [
      "Energy & Freshness: Good sleep helps you feel refreshed and ready for the day.",
      "Brain Health: Sleep supports memory, learning, and concentration.",
      "Muscle Recovery: Adequate rest supports recovery after physical activity.",
      "Emotional Wellness: Healthy sleep habits support mood and emotional balance.",
      "Healthy Weight Management: Sleep plays a role in appetite regulation and metabolism.",
      "Immune Support: Quality sleep helps maintain normal immune function.",
      "Daily Performance: Better sleep habits support focus and productivity.",
    ],
    benefitsHeading: "Our Sleep Management Services",
    benefits: [
      "Healthy sleep routine guidance",
      "Relaxation and stress management techniques",
      "Nutrition and hydration education",
      "Guidance on bedtime habits",
      "Physical activity and lifestyle counselling",
      "Personalized wellness guidance",
      "Support for building a balanced daily routine",
    ],
    closingHeading: "Make Quality Sleep a Priority!",
    closingDescription:
      "Maintain a regular sleep schedule, reduce screen time before bedtime, limit late-evening caffeine, and create a comfortable sleeping environment.",
  },
},
];

export const opportunity = {
  title: "Earn Extra Income In Your Free Time As A Nutrition Advisor",
  description:
    "A wellness opportunity from G1 RE-LIFE Wellness Zone — turn your passion for health into an income stream by guiding others on their own wellness journeys, on your own schedule.",
  image:
    "https://mybusinessweb.in/uploads/vcards/services/25450/WhatsApp-Image-2026-05-01-at-6.32.07-PM.jpeg",
};

export const gallery = [
  "https://mybusinessweb.in/uploads/vcards/gallery/25357/WhatsApp-Image-2026-05-01-at-12.23.16-PM.jpeg",
  "https://mybusinessweb.in/uploads/vcards/gallery/25358/WhatsApp-Image-2026-05-01-at-12.37.32-PM.jpeg",
  "https://mybusinessweb.in/uploads/vcards/gallery/25359/WhatsApp-Image-2026-05-01-at-12.37.55-PM.jpeg",
  "https://mybusinessweb.in/uploads/vcards/gallery/25360/WhatsApp-Image-2026-05-01-at-12.38.29-PM.jpeg",
  "https://mybusinessweb.in/uploads/vcards/gallery/25361/WhatsApp-Image-2026-05-01-at-12.39.24-PM.jpeg",
];

export const journeySteps = [
  {
    step: "01",
    title: "Share your goals",
    description:
      "Tell us about your health, lifestyle, and what a healthier version of you looks like.",
  },
  {
    step: "02",
    title: "Get a personalized plan",
    description:
      "Veena builds a wellness program around your body, your schedule, and your goals.",
  },
  {
    step: "03",
    title: "Follow with support",
    description:
      "Ongoing guidance and check-ins keep you consistent, motivated, and on track.",
  },
  {
    step: "04",
    title: "Transform & sustain",
    description:
      "Build habits that last well beyond the program — a lifestyle, not a quick fix.",
  },
];

export const whyChooseUs = [
  {
    title: "Personalized, not generic",
    description:
      "Every plan is built around your body, your goals, and your daily life — not a one-size-fits-all template.",
  },
  {
    title: "Whole-person approach",
    description:
      "We address nutrition, fitness, and mindset together, because lasting wellness needs all three.",
  },
  {
    title: "Continuous support",
    description:
      "Your coach stays with you throughout the journey — not just at the start.",
  },
  {
    title: "A comfortable, motivating space",
    description:
      "A customer-first environment where you're encouraged, never judged.",
  },
];