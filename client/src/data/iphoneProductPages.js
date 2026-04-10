import { getColorways } from './compareModels.js'
import { iphoneModels } from './iphoneModels.js'

function modelName(modelId) {
  return iphoneModels.find((m) => m.id === modelId)?.name ?? `iPhone ${modelId}`
}

/** Shared “Take a closer look” imagery for Pro models (`/public/iphone-models`). */
const PRO_EXPLORE_IMAGES = {
  /** Hero for Colors tab — does not swap with finish swatches */
  colors: '/iphone-models/first-card.png',
  'aluminum-unibody': '/iphone-models/unibody-design-promo.png',
  'vapor-chamber': '/iphone-models/third-card.png',
  'ceramic-shield': '/iphone-models/fourth-card.png',
  display: '/iphone-models/design-closer-look-reference.png',
  'camera-control': '/iphone-models/second-card.png',
  'action-button': '/iphone-models/fifth-card.png',
}

const PRO_EXPLORE_ORDER = [
  'colors',
  'aluminum-unibody',
  'vapor-chamber',
  'ceramic-shield',
  'display',
  'camera-control',
  'action-button',
]

const PRO_EXPLORE_LABELS = {
  colors: 'Colors',
  'aluminum-unibody': 'Aluminum unibody',
  'vapor-chamber': 'Vapor chamber',
  'ceramic-shield': 'Ceramic Shield',
  display: 'Immersive pro display',
  'camera-control': 'Camera Control',
  'action-button': 'Action button',
}

function proDesignExplore(chipLabel, opts = {}) {
  const { staticCanvasImage } = opts
  return {
    defaultTab: 'vapor-chamber',
    order: PRO_EXPLORE_ORDER,
    labels: PRO_EXPLORE_LABELS,
    featureImages: PRO_EXPLORE_IMAGES,
    ...(staticCanvasImage ? { staticCanvasImage } : {}),
    featureCopy: {
      'aluminum-unibody': {
        title: 'Aluminum unibody.',
        body: 'Optimized for performance and battery. Aluminum alloy is remarkably light and has exceptional thermal conductivity.',
      },
      'vapor-chamber': {
        title: 'Vapor chamber.',
        body: `Deionized water sealed inside moves heat away from the ${chipLabel} chip, allowing for even higher sustained performance.`,
      },
      'ceramic-shield': {
        title: 'Ceramic Shield.',
        body: 'Tougher than typical smartphone glass, front and back, for added durability.',
      },
      display: {
        title: 'Immersive pro display.',
        body: 'ProMotion, always-on, and stunning color accuracy across a bright, power-efficient panel.',
      },
      'camera-control': {
        title: 'Camera Control.',
        body: 'A dedicated control for framing, zoom, and settings — right at your fingertips.',
      },
      'action-button': {
        title: 'Action button.',
        body: 'A customizable control for shortcuts, Silent mode, and more.',
      },
    },
  }
}

const NONPRO_EXPLORE_ORDER = ['colors', 'display', 'ceramic-shield', 'cameras', 'performance', 'battery']

const NONPRO_EXPLORE_LABELS = {
  colors: 'Colors',
  display: 'Display',
  'ceramic-shield': 'Ceramic Shield',
  cameras: 'Cameras',
  performance: 'Performance',
  battery: 'Battery',
}

const NONPRO_EXPLORE_IMAGES = {
  colors: '/iphone-models/fallback.png',
  display: '/iphone-models/design-closer-look-reference.png',
  'ceramic-shield': '/iphone-models/fourth-card.png',
  cameras: '/iphone-models/second-card.png',
  performance: '/iphone-models/third-card.png',
  battery: '/iphone-models/fifth-card.png',
}

function nonProDesignExplore(chipLabel, opts = {}) {
  const { colorsExploreImage, staticCanvasImage } = opts
  return {
    defaultTab: 'display',
    order: NONPRO_EXPLORE_ORDER,
    labels: NONPRO_EXPLORE_LABELS,
    featureImages: {
      ...NONPRO_EXPLORE_IMAGES,
      ...(colorsExploreImage ? { colors: colorsExploreImage } : {}),
    },
    ...(staticCanvasImage ? { staticCanvasImage } : {}),
    featureCopy: {
      display: {
        title: 'Brilliant display.',
        body: 'True Tone, wide color, and exceptional brightness for photos, video, and everyday use.',
      },
      'ceramic-shield': {
        title: 'Ceramic Shield.',
        body: 'Tougher than typical smartphone glass for added durability against bumps and scratches.',
      },
      cameras: {
        title: 'Advanced cameras.',
        body: 'Capture sharp photos and detailed video with smart HDR and Night mode across lenses.',
      },
      performance: {
        title: 'Fast performance.',
        body: `The ${chipLabel} chip delivers responsive speed for apps, games, and multitasking with efficient power use.`,
      },
      battery: {
        title: 'All-day battery.',
        body: 'Optimized hardware and software work together for battery life that keeps up with your day.',
      },
    },
  }
}

function overviewSlides17Pro() {
  return [
    {
      key: 'ov-design',
      caption: 'Heat‑forged aluminum unibody design for exceptional pro capability.',
      video: '/videos/overview-slide-1.mp4',
      image: '/iphone-models/first-card.png',
    },
    {
      key: 'ov-chip',
      caption:
        'A19 Pro, vapor cooled for lightning-fast performance. Breakthrough battery life.',
      image: '/iphone-models/third-card.png',
      videos: ['/videos/overview-ov-chip-a.mp4', '/videos/overview-ov-chip-b.mp4'],
    },
    {
      key: 'ov-camera',
      caption:
        'The ultimate pro camera system. All 48MP Fusion rear cameras. And powerful zoom for creative shots.',
      video: '/videos/overview-ov-camera.mp4',
      image: '/iphone-models/second-card.png',
    },
    {
      key: 'ov-center',
      caption:
        'New Center Stage front camera. Flexible ways to frame your shot. Smarter group selfies.',
      video: '/videos/overview-ov-center.mp4',
      image: '/iphone-models/fourth-card.png',
    },
    {
      key: 'ov-ios',
      caption: 'iOS on iPhone. New look. Even more magic.',
      image: '/iphone-models/fifth-card.png',
    },
  ]
}

/** iPhone Air — “Take a closer look” topics aligned with [Apple iPhone Air](https://www.apple.com/iphone-air/). */
function airDesignExplore() {
  return {
    defaultTab: 'colors',
    colorsLead: 'Available in four breathtaking colors.',
    staticCanvasImage: '/iphone-models/iphone-air-colors-lineup.png',
    order: [
      'colors',
      'titanium-frame',
      'internal-design',
      'display',
      'ceramic-shield',
      'camera-control',
      'action-button',
      'accessories',
    ],
    labels: {
      colors: 'Colors',
      'titanium-frame': 'Titanium frame',
      'internal-design': 'Innovative internal design',
      display: 'Immersive pro display',
      'ceramic-shield': 'Ceramic Shield',
      'camera-control': 'Camera Control',
      'action-button': 'Action button',
      accessories: 'Accessories',
    },
    featureImages: {
      colors: '/iphone-models/iphone-air-colors-lineup.png',
      'titanium-frame': '/iphone-models/iphone-air.png',
      'internal-design': '/iphone-models/third-card.png',
      display: '/iphone-models/design-closer-look-reference.png',
      'ceramic-shield': '/iphone-models/fourth-card.png',
      'camera-control': '/iphone-models/second-card.png',
      'action-button': '/iphone-models/fifth-card.png',
      accessories: '/iphone-models/first-card.png',
    },
    featureCopy: {
      'titanium-frame': {
        title: 'Titanium frame.',
        body:
          'A Grade 5 titanium frame built with 80 percent recycled titanium makes iPhone Air as strong as it is stunning.',
      },
      'internal-design': {
        title: 'Innovative internal design.',
        body:
          'Multiple technologies are housed in the plateau of iPhone Air, maximizing performance and creating space for a large, high‑density battery.',
      },
      display: {
        title: 'Immersive pro display.',
        body:
          '6.5‑inch Super Retina XDR display — our best ever. 3000 nits peak brightness. ProMotion up to 120Hz. And better anti‑reflection.',
      },
      'ceramic-shield': {
        title: 'Ceramic Shield.',
        body:
          'Protects the back of iPhone Air, making it 4x more resistant to cracks. New Ceramic Shield 2 on the front has 3x better scratch resistance.',
      },
      'camera-control': {
        title: 'Camera Control.',
        body:
          'Instantly take a photo, record video, adjust settings, and more. So you never miss a moment.',
      },
      'action-button': {
        title: 'Action button.',
        body:
          'A customizable fast track to your favorite feature. Long press to launch the action you want — Silent mode, Translation, Shortcuts, and more.',
      },
      accessories: {
        title: 'Accessories.',
        body:
          'The new Crossbody Strap lets you wear your iPhone Air hands‑free so you can go with the float.',
      },
    },
  }
}

function overviewSlidesAir() {
  return [
    {
      key: 'air-design',
      topic: 'design',
      caption: 'Super thin. Strikingly light.\nShockingly strong.',
      video: '/videos/iphone-air-highlights-design.mp4',
      image: '/iphone-models/iphone-air.png',
    },
    {
      key: 'air-center-stage',
      topic: 'Center Stage front camera',
      caption:
        'New Center Stage front camera. Flexible ways to frame your shot. Smarter group selfies. And so much more.',
      image: '/iphone-models/fourth-card.png',
      backgroundVideo:
        'https://www.apple.com/105/media/us/iphone-air/2025/731189b1-a606-493f-afa4-7c766a8fd08d/anim/highlights-front-camera/medium_2x.mp4',
    },
    {
      key: 'air-fusion',
      topic: 'Fusion Main camera',
      caption:
        '48MP Fusion Main camera. Two advanced cameras in one. Super‑high resolution by default.',
      image: '/iphone-models/second-card.png',
      /** Apple overview still — full-card background for this highlight */
      backgroundImage:
        'https://www.apple.com/v/iphone-air/e/images/overview/highlights/highlights_rear_camera__fwea7ndmxeq2_medium_2x.jpg',
    },
    {
      key: 'air-ios',
      topic: 'iOS 26',
      caption: 'iOS 26. New look. Even more magic.',
      image: '/iphone-models/fifth-card.png',
    },
  ]
}

function overviewSlides16Pro() {
  return [
    {
      key: 'ov-design',
      caption: 'Premium titanium design and pro display — built for demanding everyday use.',
      video: '/videos/overview-slide-1.mp4',
      image: '/iphone-models/first-card.png',
    },
    {
      key: 'ov-chip',
      caption: 'A18 Pro delivers blazing-fast performance and efficient power for games and pro apps.',
      image: '/iphone-models/third-card.png',
      videos: ['/videos/overview-ov-chip-a.mp4', '/videos/overview-ov-chip-b.mp4'],
    },
    {
      key: 'ov-camera',
      caption: 'Pro camera system with flexible focal lengths for photos and video you will want to share.',
      video: '/videos/overview-ov-camera.mp4',
      image: '/iphone-models/second-card.png',
    },
    {
      key: 'ov-center',
      caption: 'Center Stage and advanced front camera features for calls, streams, and selfies.',
      video: '/videos/overview-ov-center.mp4',
      image: '/iphone-models/fourth-card.png',
    },
    {
      key: 'ov-ios',
      caption: 'iOS on iPhone — intuitive, capable, and designed to work seamlessly with your devices.',
      image: '/iphone-models/fifth-card.png',
    },
  ]
}

export function getProductPage(modelId) {
  const colors = getColorways(modelId)
  const name = modelName(modelId)

  const isPro = String(modelId).includes('pro')

  const base = {
    id: modelId,
    name,
    colors,
    hero: {
      eyebrow: name,
      title: isPro ? name.replace(/^iPhone\s+/, 'iPhone\n') : name,
      subtitle: 'Powerful. Personal. Built to last.',
    },
    highlights: [
      {
        key: 'design',
        title: 'Design',
        pill: 'Premium',
        description: 'A refined silhouette with finishes that feel just right in your hand.',
      },
      {
        key: 'camera',
        title: 'Cameras',
        pill: 'Pro',
        description: 'Capture crisp photos and smooth video with flexible focal lengths.',
      },
      {
        key: 'performance',
        title: 'Performance',
        pill: 'Fast',
        description: 'Responsive day-to-day speed for apps, games, and multitasking.',
      },
      {
        key: 'battery',
        title: 'Battery',
        pill: 'All‑day',
        description: 'Designed for long days, from morning calls to late-night streaming.',
      },
    ],
  }

  if (modelId === 'air') {
    return {
      ...base,
      /** Thin promo bar — mirrors copy structure on [Apple iPhone Air](https://www.apple.com/iphone-air/). */
      tradeInPromo:
        'Get credit toward your next iPhone when you trade in an eligible device.',
      hero: {
        ...base.hero,
        title: 'iPhone Air',
        subtitle: 'The thinnest iPhone ever.\nWith the power of pro inside.',
      },
      sharedFeaturesSection: {
        eyebrow: 'All in the family',
        headline: 'All the must-haves.\nAll on iPhone.',
        lead:
          'The latest iPhone models come with helpful Apple Intelligence tools, fast Wi‑Fi 7 and Bluetooth 6 enabled by N1, 5G and eSIM, and safety features designed for peace of mind.',
        items: [
          {
            title: 'iOS 26. New look. Even more magic.',
            body:
              'Liquid Glass, a more vibrant Lock Screen, Call Screening, Hold Assist, and more.',
          },
          {
            title: 'Apple Intelligence.',
            body:
              'Visual intelligence, Live Translation, Clean Up, Genmoji, Writing Tools, and more — on device.',
          },
          {
            title: 'Connectivity.',
            body:
              'Stay connected with Wi‑Fi 7, Bluetooth 6, Thread, 5G, and eSIM.',
          },
        ],
      },
      highlights: [
        { ...base.highlights[0], description: 'A clean, lightweight build that disappears in your pocket.' },
        { ...base.highlights[1], description: 'Beautiful photos with a camera that keeps up with your life.' },
        { ...base.highlights[2], description: 'Snappy performance with efficient power for everyday tasks.' },
        { ...base.highlights[3], description: 'More time between charges — ready when you are.' },
      ],
      overviewCarouselSlides: overviewSlidesAir(),
      topBannerImage: '/iphone-models/iphone-air.png',
      heroVideoSrc: '/iphone-models/iphone-air-hero.mp4',
      designSection: {
        eyebrow: 'Design',
        headline: 'So this is what\nthe future feels like.',
        body:
          'The all-new iPhone Air is so impossibly thin and light that it nearly disappears in your hand. At 5.6 mm and weighing just 165 grams, it’s the thinnest iPhone ever — even with a large, immersive 6.5‑inch display and the power of the A19 Pro chip. It’s a paradox you have to hold to believe.',
        image: '/iphone-models/iphone-air-future-feels-like.png',
      },
      designExplore: airDesignExplore(),
      camerasSection: {
        eyebrow: 'Cameras',
        headline: 'New front. New rear.\nNew cam‑era.',
        subline:
          'An all‑new camera system means you can snap amazing selfies, take incredible portraits and landscapes, and capture pro-level videos.',
        stats: [
          { value: '18MP', label: 'Center Stage front camera' },
          { value: '48MP', label: 'Fusion Main camera' },
          { value: '4K 60 fps', label: 'Dolby Vision' },
          { value: '4 lenses', label: 'in your pocket' },
        ],
      },
      performanceSection: {
        eyebrow: 'Performance and battery life',
        headline: 'Power in a new light.',
        body:
          'iPhone Air was designed to deliver pro performance in the thinnest iPhone ever. Bringing together the power of our latest-generation Apple silicon and the efficiency of the A19 Pro chip, advanced features like Clean Up in Photos, Apple Intelligence, or graphics-intensive gaming happen smoothly and effortlessly.',
        chips: ['A19 Pro chip', 'N1 chip', 'C1X modem'],
      },
      whatsInTheBoxImage: '/iphone-models/iphone-air-whats-in-the-box.png',
    }
  }

  if (modelId.includes('pro')) {
    const proPage = {
      ...base,
      hero: {
        ...base.hero,
        subtitle: 'Pro-level capability with advanced cameras and powerful performance.',
      },
      highlights: [
        { ...base.highlights[0], pill: 'Pro', description: 'Premium materials and thoughtful details across every edge.' },
        { ...base.highlights[1], pill: 'Zoom', description: 'A versatile camera system tuned for clarity and control.' },
        { ...base.highlights[2], pill: 'Chip', description: 'Sustained speed for demanding workflows and graphics.' },
        { ...base.highlights[3], pill: 'Pro', description: 'Big battery life for long shoots, long flights, and long days.' },
      ],
    }

    if (modelId === '17-pro') {
      return {
        ...proPage,
        topBannerImage: '/images/iphone-17-pro-top-hero.png',
        heroVideoSrc: '/videos/iphone-17-pro-hero.mp4',
        overviewCarouselSlides: overviewSlides17Pro(),
        designSection: {
          eyebrow: 'Design',
          headline: 'Unibody enclosure. Makes a strong case for itself.',
          body: `Introducing ${name} and iPhone 17 Pro Max, designed from the inside out to be among the most powerful iPhone models ever made. At the core of the new design is a heat-forged aluminum unibody enclosure that maximizes performance, battery capacity, and durability.`,
          image: '/iphone-models/unibody-design-promo.png',
        },
        designExplore: proDesignExplore('A19 Pro', {
          staticCanvasImage: '/iphone-models/iphone-17-pro-colors-trio.png',
        }),
        whatsInTheBoxImage: '/iphone-models/iphone-17-pro-whats-in-the-box.png',
      }
    }

    if (modelId === '17-pro-max') {
      return {
        ...proPage,
        topBannerImage: '/images/iphone-17-pro-top-hero.png',
        heroVideoSrc: '/videos/iphone-17-pro-hero.mp4',
        overviewCarouselSlides: overviewSlides17Pro(),
        designSection: {
          eyebrow: 'Design',
          headline: 'Unibody enclosure. Makes a strong case for itself.',
          body: `Introducing iPhone 17 Pro and ${name}, designed from the inside out to be among the most powerful iPhone models ever made. The largest Pro display yet pairs with a heat-forged aluminum unibody built for performance, battery capacity, and durability.`,
          image: '/iphone-models/unibody-design-promo.png',
        },
        designExplore: proDesignExplore('A19 Pro', {
          staticCanvasImage: '/iphone-models/iphone-17-pro-colors-trio.png',
        }),
        whatsInTheBoxImage: '/iphone-models/iphone-17-pro-max-whats-in-the-box.png',
      }
    }

    if (modelId === '16-pro' || modelId === '16-pro-max') {
      return {
        ...proPage,
        topBannerImage: '/iphone-models/iphone-16-pro-max.png',
        overviewCarouselSlides: overviewSlides16Pro(),
        designSection: {
          eyebrow: 'Design',
          headline: 'Pro strength. Pro cameras. Pro display.',
          body: `${name} combines a premium titanium design with a pro camera system and a display made for HDR content, gaming, and productivity.`,
          image: '/iphone-models/iphone-16-pro-max.png',
        },
        designExplore: proDesignExplore('A18 Pro'),
      }
    }

    return proPage
  }

  if (modelId === '17') {
    return {
      ...base,
      designIntroSection: {
        eyebrow: 'Design.',
        headline: 'Even more delightful.\nEven more durable.',
        body:
          'Meet the new iPhone 17. Designed with contoured edges, thinner borders, and durable materials like Ceramic Shield 2 on the front, it looks and stays beautiful. You can see and do more on a 6.3-inch Super Retina XDR display and enjoy smoother scrolling and more immersive gaming with ProMotion, with an adaptive refresh rate up to 120Hz. Take it for a spin.',
      },
      overviewCarouselSlides: [
        {
          key: 'design',
          caption: 'A refined silhouette with finishes that feel just right in your hand.',
          video: '/videos/iphone-17-overview-design.mp4',
          image: '/iphone-models/iphone-17.png',
        },
        {
          key: 'camera',
          caption: 'Capture crisp photos and smooth video with flexible focal lengths.',
          image: '/iphone-models/iphone-17-overview-camera.png',
          /** Full-bleed still on dark overview cards */
          backgroundImage: '/iphone-models/iphone-17-overview-camera.png',
        },
        {
          key: 'performance',
          caption: 'Responsive day-to-day speed for apps, games, and multitasking.',
          image: '/iphone-models/iphone-17-overview-performance.png',
          backgroundImage: '/iphone-models/iphone-17-overview-performance.png',
        },
        {
          key: 'battery',
          caption: 'Designed for long days, from morning calls to late-night streaming.',
          image: '/iphone-models/iphone-17-overview-battery.png',
          backgroundImage: '/iphone-models/iphone-17-overview-battery.png',
          captionBarLight: true,
        },
      ],
      topBannerImage: '/images/iphone-17-hero-banner.png',
      heroVideoSrc: '/videos/iphone-17-hero.mp4',
      designSection: {
        eyebrow: 'Design',
        headline: 'Beautiful. Durable. Made for every day.',
        body: `${name} brings advanced cameras, a brilliant display, and all-day battery life in a colorful design you will love.`,
        image: '/iphone-models/iphone-17.png',
      },
      designExplore: nonProDesignExplore('A19', {
        colorsExploreImage: '/iphone-models/iphone-17.png',
        staticCanvasImage: '/iphone-models/iphone-17-colors-lineup.png',
      }),
      whatsInTheBoxImage: '/iphone-models/iphone-17-whats-in-the-box.png',
    }
  }

  if (modelId === '16') {
    return {
      ...base,
      overviewCarouselSlides: [
        {
          key: 'design',
          caption: 'A refined silhouette with finishes that feel just right in your hand.',
          video: '/videos/iphone-16-overview-design-v4.mp4',
          image: '/iphone-models/iphone-16.png',
        },
        {
          key: 'camera',
          caption: 'Capture crisp photos and smooth video with flexible focal lengths.',
          video: '/videos/iphone-16-overview-design-v5.mp4',
          image: '/iphone-models/second-card.png',
        },
        {
          key: 'performance',
          caption: 'Responsive day-to-day speed for apps, games, and multitasking.',
          video: '/videos/iphone-16-overview-performance-v1.mp4',
          image: '/iphone-models/third-card.png',
        },
        {
          key: 'battery',
          caption: 'Designed for long days, from morning calls to late-night streaming.',
          image: '/iphone-models/iphone-16-overview-battery.png',
          backgroundImage: '/iphone-models/iphone-16-overview-battery.png',
        },
      ],
      topBannerImage: '/iphone-models/iphone-16.png',
      heroVideoSrc: '/videos/iphone-16-hero.mp4',
      designSection: {
        eyebrow: 'Design',
        headline: 'Power and value. In your hands.',
        body: `${name} delivers a gorgeous display, versatile cameras, and reliable all-day battery — everything you need in a modern iPhone.`,
        image: '/iphone-models/iphone-16-highlights-blue.png',
      },
      designExplore: nonProDesignExplore('A18', {
        colorsExploreImage: '/iphone-models/iphone-16.png',
        staticCanvasImage: '/iphone-models/iphone-16-colors-lineup.png',
      }),
      whatsInTheBoxImage: '/iphone-models/iphone-16-whats-in-the-box.png',
    }
  }

  return {
    ...base,
    designSection: {
      eyebrow: 'Design',
      headline: 'Designed to delight.',
      body: `${name} combines advanced features with the ease of iPhone — in a design built to last.`,
      image: '/iphone-models/fallback.png',
    },
    designExplore: nonProDesignExplore('A18'),
  }
}
