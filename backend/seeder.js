const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const products = [
  {
    _id: 'alchemy-water',
    name: 'Rosemary Alchemy Water',
    price: 299,
    originalPrice: 299,
    description: 'A potent Rosemary infusion for hair growth and scalp health. Crafted with traditional Ayurvedic heritage and clinically proven ingredients to reduce hair fall, stimulate follicles, and restore scalp health.',
    image: 'https://8upload.com/image/c687fcd4a74c72d7/IMG_4138__1_.jpg',
    category: 'Hair Care',
    countInStock: 20,
    rating: 4.9,
    numReviews: 127,
    features: [
      'Stimulates hair growth',
      'Reduces hair fall',
      'Controls dandruff',
      'Strengthens roots',
      '100% Natural & Chemical Free'
    ],
    benefits: [
      {
        title: 'Hair Growth Stimulation',
        description: 'Rosemary + Clove + Kalonji work together to stimulate dormant follicles',
        points: [
          'Improves blood circulation to hair follicles',
          'Delivers more oxygen and nutrients to roots',
          'Activates dormant hair follicles'
        ]
      },
      {
        title: 'Hair Fall Control',
        description: 'Fenugreek + Bhringraj strengthen roots from within',
        points: [
          'Strengthens hair roots and prevents shedding',
          'Reduces premature hair fall',
          'Nourishes weak and damaged roots'
        ]
      },
      {
        title: 'Scalp Health & Dandruff Control',
        description: 'All ingredients combined fight dandruff and improve scalp health',
        points: [
          'Antibacterial and antifungal properties',
          'Reduces scalp inflammation and irritation',
          'Cleans scalp and removes buildup'
        ]
      },
      {
        title: 'Hair Thickness & Shine',
        description: 'Fenugreek + Bhringraj improve hair density and texture',
        points: [
          'Adds volume and thickness to hair',
          'Makes hair soft, smooth, and frizz-free',
          'Improves overall hair texture and shine'
        ]
      }
    ],
    ingredients: [
      {
        name: 'Rosemary',
        description: 'Dried Rosemary Leaves - The main active ingredient',
        points: [
          'Stimulates hair growth: Improves blood circulation to hair follicles',
          'Reduces hair fall: Strengthens hair roots and prevents premature shedding',
          'DHT control: May help block DHT (a hormone linked to hair loss)',
          'Fights dandruff: Has antifungal and antibacterial properties',
          'Prevents premature greying: Antioxidants reduce oxidative stress'
        ]
      },
      {
        name: 'Bhringraj',
        description: 'Known as "King of Hair" in Ayurveda',
        points: [
          'Promotes new hair growth: Activates dormant hair follicles',
          'Reduces hair thinning: Improves hair density and volume',
          'Controls hair fall: Strengthens roots from within',
          'Delays greying: Supports melanin production',
          'Soothes scalp: Has natural cooling and anti-inflammatory effect'
        ]
      },
      {
        name: 'Fenugreek',
        description: 'Methi Seeds - Natural conditioner + strengthening agent',
        points: [
          'Strengthens hair shaft: High protein helps repair damaged hair',
          'Reduces hair fall: Nourishes weak roots',
          'Deep conditioning: Makes hair soft, smooth, and frizz-free',
          'Fights dandruff: Reduces dryness and flakiness',
          'Adds shine: Improves overall hair texture'
        ]
      },
      {
        name: 'Black Seeds',
        description: 'Kalonji / Nigella sativa - Scalp healing and follicle stimulation',
        points: [
          'Boosts hair growth: Stimulates follicles and improves density',
          'Reduces hair thinning: Strengthens roots and prevents breakage',
          'Fights scalp infections: Strong antibacterial and antifungal properties',
          'Improves scalp health: Reduces inflammation and irritation',
          'May help with bald patches: Supports regrowth when used consistently'
        ]
      },
      {
        name: 'Clove',
        description: 'Circulation booster + scalp cleanser',
        points: [
          'Improves blood circulation: Helps nutrients reach hair roots faster',
          'Promotes faster hair growth: Stimulates follicles',
          'Antimicrobial: Fights dandruff and scalp infections',
          'Strengthens roots: Reduces breakage and shedding',
          'Adds mild warmth: Activates scalp (used in moderation)'
        ]
      }
    ],
    usageTips: [
      'Use 2-3 times per week initially (not daily if the formula is strong)',
      'Store in refrigerator for freshness (max 5-6 days)',
      'Always strain properly to avoid residue buildup on scalp',
      'Do a patch test before regular use',
      'Apply on clean, damp scalp and massage gently for 5 minutes',
      'Leave it in for best results, or wash after 30 minutes'
    ]
  },
  {
    _id: 'neem-comb',
    name: 'Neem Wood Comb',
    price: 199,
    originalPrice: 199,
    description: 'Eco-friendly Neem wood comb for anti-dandruff and healthy scalp. Natural medicinal properties that plastic combs cant match.',
    image: 'https://i.ibb.co/ycfwLBYm/IMG-4139-1.jpg',
    category: 'Accessories',
    countInStock: 50,
    rating: 4.8,
    numReviews: 89,
    features: [
      'Natural & Chemical-Free',
      'Antibacterial & Anti-fungal',
      'Improves Blood Circulation',
      'Reduces Frizz & Static',
      'Distributes Natural Oils'
    ],
    benefits: [
      {
        title: 'Natural & Chemical-Free',
        description: 'Made from neem wood with no plastic or toxins',
        points: [
          'Safe for scalp, especially if you have sensitivity',
          'No harmful chemicals or synthetic materials',
          'Environmentally sustainable choice'
        ]
      },
      {
        title: 'Antibacterial & Anti-fungal',
        description: 'Neem has natural medicinal properties',
        points: [
          'Helps reduce dandruff',
          'Fights scalp infections',
          'Relieves itching and irritation'
        ]
      },
      {
        title: 'Improves Blood Circulation',
        description: 'Wooden teeth gently massage the scalp',
        points: [
          'Stimulates hair follicles',
          'Promotes hair growth',
          'Increases blood flow to roots'
        ]
      },
      {
        title: 'Reduces Frizz & Static',
        description: 'No static electricity unlike plastic',
        points: [
          'Hair becomes smoother and more manageable',
          'Reduces frizz and flyaways',
          'Gentle on hair texture'
        ]
      },
      {
        title: 'Distributes Natural Oils',
        description: 'Spreads scalp oils evenly from root to tip',
        points: [
          'Gives natural shine to hair',
          'Prevents oil buildup at roots',
          'Conditions hair naturally'
        ]
      },
      {
        title: 'Less Hair Breakage',
        description: 'Wide and smooth teeth reduce pulling',
        points: [
          'Gentle on hair strands',
          'Reduces hair fall during combing',
          'Suitable for all hair types'
        ]
      }
    ],
    usageTips: [
      'Use daily for best results',
      'Clean the comb weekly with warm water',
      'Store in a dry place to prevent moisture damage',
      'Replace every 6-12 months for optimal hygiene',
      'Use gently - do not press hard on scalp',
      'Perfect for distributing hair oil and serums'
    ]
  },
  {
    _id: 'scalp-massager',
    name: 'Manual Scalp Massager',
    price: 199,
    originalPrice: 199,
    description: 'Soft silicone scalp massager to stimulate blood flow and deep clean. Experience instant relaxation and faster hair growth.',
    image: 'https://i.ibb.co/Y4frtT58/IMG-4140-1.jpg',
    category: 'Accessories',
    countInStock: 30,
    rating: 4.7,
    numReviews: 64,
    features: [
      'Improves Blood Circulation',
      'Reduces Hair Fall',
      'Better Product Absorption',
      'Cleans Scalp Better',
      'Relieves Stress'
    ],
    benefits: [
      {
        title: 'Improves Blood Circulation',
        description: 'Massage increases blood flow to hair follicles',
        points: [
          'More oxygen reaches roots',
          'More nutrients delivered to follicles',
          'Helps faster hair growth'
        ]
      },
      {
        title: 'Reduces Hair Fall',
        description: 'Stronger blood supply means stronger roots',
        points: [
          'Reduces hair shedding',
          'Strengthens weak roots',
          'Prevents premature hair loss'
        ]
      },
      {
        title: 'Better Product Absorption',
        description: 'Massage helps products penetrate deeper',
        points: [
          'Rosemary water penetrates deeper',
          'Hair oil reaches scalp better',
          'Maximizes product effectiveness'
        ]
      },
      {
        title: 'Cleans Scalp Better',
        description: 'Helps remove dirt, oil buildup, and dead skin',
        points: [
          'Deep cleans during hair wash',
          'Removes product buildup',
          'Improves scalp health over time'
        ]
      },
      {
        title: 'Relieves Stress & Tension',
        description: 'Scalp massage relaxes nerves',
        points: [
          'Reduces stress (a major cause of hair fall!)',
          'Instant relaxation feeling',
          'Improves mental well-being'
        ]
      },
      {
        title: 'Promotes Thicker Hair',
        description: 'Stimulates dormant hair follicles',
        points: [
          'Activates inactive follicles',
          'Improves hair density over time',
          'Natural way to boost volume'
        ]
      }
    ],
    usageTips: [
      'Use with Rosemary Water: Spray on scalp, use massager gently for 5 minutes',
      'Do not press too hard - be gentle on the scalp',
      'Use 2-3 times per week for best results',
      'Use during hair wash for deep cleansing',
      'Use before applying hair oil for better absorption',
      'Clean the massager regularly with warm soapy water'
    ]
  },
  {
    _id: 'alchemy-combo',
    name: 'Reverse Ritual Combo',
    price: 399,
    originalPrice: 697,
    description: 'The complete Reverse Ritual for total hair transformation. Includes Rosemary Alchemy Water, Neem Wood Comb, and Manual Scalp Massager at a special value.',
    image: 'https://i.ibb.co/VYCykJtD/all-combo.jpg',
    category: 'Combo',
    countInStock: 10,
    rating: 4.9,
    numReviews: 156,
    features: [
      'Complete Hair Care Routine',
      'Saves 40% compared to buying separately',
      'All-natural ingredients',
      'Easy to use system',
      'Visible results in 21 days'
    ],
    benefits: [
      {
        title: 'Complete Hair Care System',
        description: 'Everything you need for healthy hair in one package',
        points: [
          'Rosemary Alchemy Water for growth',
          'Neem Comb for scalp health',
          'Massager for circulation'
        ]
      },
      {
        title: 'Synergistic Effects',
        description: 'Products work together for better results',
        points: [
          'Massager helps water absorb better',
          'Comb distributes natural oils',
          'All products enhance each other'
        ]
      },
      {
        title: 'Cost Effective',
        description: 'Save money while getting all products',
        points: [
          '40% discount vs buying separately',
          'Everything you need in one order',
          'Free shipping on combo'
        ]
      }
    ],
    usageTips: [
      'Step 1: Use Neem Comb to detangle and stimulate scalp',
      'Step 2: Spray Rosemary Alchemy Water on clean scalp',
      'Step 3: Use Massager to massage for 5 minutes',
      'Step 4: Leave water in or wash after 30 minutes',
      'Use 2-3 times per week initially',
      'Store water in refrigerator (5-6 days shelf life)'
    ]
  },
  {
    _id: 'rosemary-comb-combo',
    name: 'Rosemary & Neem Comb Combo',
    price: 349,
    originalPrice: 498,
    description: 'Grow your hair with Rosemary Alchemy Water and maintain scalp health with the Neem Wood Comb. Perfect for hair growth and scalp care.',
    image: 'https://i.ibb.co/5X3N5jjc/rosemary-adn-comb.jpg',
    category: 'Combo',
    countInStock: 15,
    rating: 4.8,
    numReviews: 45,
    features: [
      'Hair Growth + Scalp Health',
      'Saves ₹50 compared to buying separately',
      'Natural ingredients',
      'Easy to use',
      'Visible results in 21 days'
    ],
    benefits: [
      {
        title: 'Hair Growth Stimulation',
        description: 'Rosemary Alchemy Water stimulates hair follicles',
        points: [
          'Improves blood circulation to roots',
          'Activates dormant follicles',
          'Reduces hair fall'
        ]
      },
      {
        title: 'Scalp Health',
        description: 'Neem Comb keeps scalp clean and healthy',
        points: [
          'Antibacterial properties fight dandruff',
          'Distributes natural oils evenly',
          'Reduces scalp irritation'
        ]
      },
      {
        title: 'Cost Effective',
        description: 'Save money while getting both products',
        points: [
          '₹50 savings vs buying separately',
          'Everything you need in one order'
        ]
      }
    ],
    usageTips: [
      'Use Neem Comb daily to stimulate scalp',
      'Apply Rosemary Water 2-3 times per week',
      'Store water in refrigerator (5-6 days)',
      'Use massager after applying water for best results'
    ]
  },
  {
    _id: 'rosemary-massager-combo',
    name: 'Rosemary & Massager Combo',
    price: 349,
    originalPrice: 498,
    description: 'Boost hair growth with Rosemary Alchemy Water and improve absorption with the Manual Scalp Massager. Perfect for faster results.',
    image: 'https://i.ibb.co/Z6DHHXdh/rosemary-adn-sclap.jpg',
    category: 'Combo',
    countInStock: 15,
    rating: 4.8,
    numReviews: 38,
    features: [
      'Hair Growth + Better Absorption',
      'Saves ₹100 compared to buying separately',
      'Natural ingredients',
      'Deep scalp massage',
      'Visible results in 21 days'
    ],
    benefits: [
      {
        title: 'Hair Growth',
        description: 'Rosemary Alchemy Water stimulates follicles',
        points: [
          'Improves blood circulation',
          'Activates dormant hair follicles',
          'Strengthens roots'
        ]
      },
      {
        title: 'Better Absorption',
        description: 'Massager helps products penetrate deeper',
        points: [
          'Water reaches scalp better',
          'More effective results',
          'Deep cleansing during wash'
        ]
      },
      {
        title: 'Cost Effective',
        description: 'Save ₹100 while getting both products',
        points: [
          'Great value combo',
          'Everything you need in one order'
        ]
      }
    ],
    usageTips: [
      'Spray Rosemary Water on clean scalp',
      'Use Massager for 5 minutes',
      'Use 2-3 times per week',
      'Store water in refrigerator'
    ]
  },
  {
    _id: 'comb-massager-combo',
    name: 'Neem Comb & Massager Combo',
    price: 299,
    originalPrice: 398,
    description: 'The perfect duo for scalp health and blood circulation. Neem Comb for scalp care + Massager for better circulation.',
    image: 'https://i.ibb.co/b5hB1X7K/IMG-7421.jpg',
    category: 'Combo',
    countInStock: 20,
    rating: 4.7,
    numReviews: 32,
    features: [
      'Scalp Health + Circulation',
      'Saves ₹100 compared to buying separately',
      'Natural & chemical-free',
      'Easy to use',
      'Daily use recommended'
    ],
    benefits: [
      {
        title: 'Scalp Health',
        description: 'Neem Comb fights dandruff naturally',
        points: [
          'Antibacterial properties',
          'Reduces scalp irritation',
          'Distributes natural oils'
        ]
      },
      {
        title: 'Better Circulation',
        description: 'Massager improves blood flow to roots',
        points: [
          'More nutrients reach follicles',
          'Stimulates hair growth',
          'Relieves stress'
        ]
      },
      {
        title: 'Cost Effective',
        description: 'Save ₹100 while getting both products',
        points: [
          'Great value combo',
          'Everything you need in one order'
        ]
      }
    ],
    usageTips: [
      'Use Neem Comb daily',
      'Use Massager 2-3 times per week',
      'Clean both products regularly',
      'Store in dry place'
    ]
  }, {
    _id: 'rosemary-massager-combo-sample',
    name: 'Sample',
    price: 1,
    originalPrice: 498,
    description: 'Boost hair growth with Rosemary Alchemy Water and improve absorption with the Manual Scalp Massager. Perfect for faster results.',
    image: 'https://i.ibb.co/Z6DHHXdh/rosemary-adn-sclap.jpg',
    category: 'Combo',
    countInStock: 15,
    rating: 4.8,
    numReviews: 38,
    features: [
      'Hair Growth + Better Absorption',
      'Saves ₹100 compared to buying separately',
      'Natural ingredients',
      'Deep scalp massage',
      'Visible results in 21 days'
    ],
    benefits: [
      {
        title: 'Hair Growth',
        description: 'Rosemary Alchemy Water stimulates follicles',
        points: [
          'Improves blood circulation',
          'Activates dormant hair follicles',
          'Strengthens roots'
        ]
      },
      {
        title: 'Better Absorption',
        description: 'Massager helps products penetrate deeper',
        points: [
          'Water reaches scalp better',
          'More effective results',
          'Deep cleansing during wash'
        ]
      },
      {
        title: 'Cost Effective',
        description: 'Save ₹100 while getting both products',
        points: [
          'Great value combo',
          'Everything you need in one order'
        ]
      }
    ],
    usageTips: [
      'Spray Rosemary Water on clean scalp',
      'Use Massager for 5 minutes',
      'Use 2-3 times per week',
      'Store water in refrigerator'
    ]
  },
];

const importData = async () => {
  try {
    await connectDB();
    mongoose.set('bufferTimeoutMS', 30000);

    
    await Product.deleteMany({});
    console.log('Previous data cleared');

    const adminUser = await User.create({
      name: 'Admin User',
      email: 'greensignaltamil@gmail.com',
      password: '123321',
      isAdmin: true,
    });
    console.log('Admin created');

    const sampleProducts = products.map((product) => {
      return { ...product, user: adminUser._id };
    });

    await Product.insertMany(sampleProducts);
    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// const destroyData = async () => {
//   try {


//     console.log('Data Destroyed!');
//     process.exit();
//   } catch (error) {
//     console.error(`${error}`);
//     process.exit(1);
//   }
// };

// if (process.argv[2] === '-d') {
//   destroyData();
// } else {
//   importData();
// }

importData();