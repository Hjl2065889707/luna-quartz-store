export type CrystalProductSeed = {
  name: string
  category: string
  price: number
  description: string
  image: string
  stock: number
  imagePrompt: string
}

export const productImages = {
  amethystCalmBracelet: '/products/amethyst-calm-bracelet.webp',
  roseQuartzHeartBracelet: '/products/rose-quartz-heart-bracelet.webp',
  amazoniteFlowBracelet: '/products/amazonite-flow-bracelet.webp',
  blackTourmalineShieldBracelet:
    '/products/black-tourmaline-shield-bracelet.webp',
  citrineConfidenceBracelet: '/products/citrine-confidence-bracelet.webp',
  aquamarineTideBracelet: '/products/aquamarine-tide-bracelet.webp',
  roseQuartzTumbledStone: '/products/rose-quartz-tumbled-stone.webp',
  clearQuartzTumbledStone: '/products/clear-quartz-tumbled-stone.webp',
  labradoriteFlashTumbledStone:
    '/products/labradorite-flash-tumbled-stone.webp',
  blackObsidianTumbledStone: '/products/black-obsidian-tumbled-stone.webp',
  carnelianSparkTumbledStone: '/products/carnelian-spark-tumbled-stone.webp',
  clearQuartzClarityPoint: '/products/clear-quartz-clarity-point.webp',
  amethystDreamPoint: '/products/amethyst-dream-point.webp',
  roseQuartzHeartPoint: '/products/rose-quartz-heart-point.webp',
  fluoriteFocusPoint: '/products/fluorite-focus-point.webp',
  labradoriteAuroraPoint: '/products/labradorite-aurora-point.webp',
  beginnerCrystalRitualSet: '/products/beginner-crystal-ritual-set.webp',
  loveSelfCareCrystalSet: '/products/love-self-care-crystal-set.webp',
  protectionCrystalSet: '/products/protection-crystal-set.webp',
  sevenChakraCrystalSet: '/products/seven-chakra-crystal-set.webp',
  moonlightPrismSuncatcher: '/products/moonlight-prism-suncatcher.webp',
  goldenHoopCrystalSuncatcher:
    '/products/golden-hoop-crystal-suncatcher.webp',
  celestialStarsSuncatcher: '/products/celestial-stars-suncatcher.webp',
  infinityLightSuncatcher: '/products/infinity-light-suncatcher.webp',
} as const

export const crystalProducts: CrystalProductSeed[] = [
  {
    name: 'Amethyst Calm Bracelet',
    category: 'Bracelets',
    price: 34.95,
    description:
      'A polished amethyst bead bracelet designed for quiet evenings, journaling, and mindful routines. Amethyst is traditionally associated with calm, clarity, and emotional balance.',
    image: productImages.amethystCalmBracelet,
    stock: 18,
    imagePrompt:
      'Square ecommerce product photo of a polished amethyst bead bracelet, 8mm purple crystal beads, arranged in a soft circle on warm ivory linen, natural daylight, subtle shadow, premium crystal shop aesthetic, no text, no logo.',
  },
  {
    name: 'Rose Quartz Heart Bracelet',
    category: 'Bracelets',
    price: 34.95,
    description:
      'A soft pink rose quartz bracelet for everyday wear and gentle self-care rituals. Rose quartz is traditionally associated with compassion, love, and heart-centred intention.',
    image: productImages.roseQuartzHeartBracelet,
    stock: 22,
    imagePrompt:
      'Square ecommerce product photo of a rose quartz bead bracelet, pale pink polished round beads, styled on cream ceramic tray with a small linen pouch, soft natural light, clean premium product photography, no text, no logo.',
  },
  {
    name: 'Amazonite Flow Bracelet',
    category: 'Bracelets',
    price: 34.95,
    description:
      'A soothing blue-green amazonite bracelet with natural colour variation in every bead. Amazonite is traditionally associated with communication, ease, and speaking with honesty.',
    image: productImages.amazoniteFlowBracelet,
    stock: 16,
    imagePrompt:
      'Square ecommerce product photo of an amazonite bead bracelet, blue green polished crystal beads with natural marbling, on a white stone surface, soft daylight, minimal Australian boutique styling, no text, no logo.',
  },
  {
    name: 'Black Tourmaline Shield Bracelet',
    category: 'Bracelets',
    price: 34.95,
    description:
      'A grounding black tourmaline bracelet with a simple unisex profile. Black tourmaline is traditionally associated with protection, energetic boundaries, and steady focus.',
    image: productImages.blackTourmalineShieldBracelet,
    stock: 14,
    imagePrompt:
      'Square ecommerce product photo of a black tourmaline bead bracelet, matte and glossy black crystal beads, styled on charcoal slate with warm side light, elegant minimal product photography, no text, no logo.',
  },
  {
    name: 'Citrine Confidence Bracelet',
    category: 'Bracelets',
    price: 36.95,
    description:
      'A golden citrine bracelet made for bright days and confident starts. Citrine is traditionally associated with optimism, abundance, and creative momentum.',
    image: productImages.citrineConfidenceBracelet,
    stock: 20,
    imagePrompt:
      'Square ecommerce product photo of a citrine bead bracelet, translucent honey yellow crystal beads, styled on warm cream background with sunlight highlights, premium crystal boutique look, no text, no logo.',
  },
  {
    name: 'Aquamarine Tide Bracelet',
    category: 'Bracelets',
    price: 44.95,
    description:
      'A pale ocean-toned aquamarine bracelet with a refined, airy finish. Aquamarine is traditionally associated with calm communication, courage, and emotional steadiness.',
    image: productImages.aquamarineTideBracelet,
    stock: 9,
    imagePrompt:
      'Square ecommerce product photo of an aquamarine bead bracelet, pale blue sea glass tones, polished round beads on white linen with a small shell accent, soft coastal daylight, no text, no logo.',
  },
  {
    name: 'Rose Quartz Tumbled Stone',
    category: 'Tumbled Stones',
    price: 7.95,
    description:
      'A smooth rose quartz tumble for pockets, bedside tables, and small ritual bowls. Each piece carries a soft pink tone and is traditionally linked with self-love and kindness.',
    image: productImages.roseQuartzTumbledStone,
    stock: 48,
    imagePrompt:
      'Square ecommerce product photo of several polished rose quartz tumbled stones, soft pale pink crystals on a clean ivory background, natural daylight, gentle reflections, no text, no logo.',
  },
  {
    name: 'Clear Quartz Tumbled Stone',
    category: 'Tumbled Stones',
    price: 6.95,
    description:
      'A bright clear quartz tumble with natural inclusions and a glassy finish. Clear quartz is traditionally associated with clarity, focus, and amplifying intention.',
    image: productImages.clearQuartzTumbledStone,
    stock: 56,
    imagePrompt:
      'Square ecommerce product photo of polished clear quartz tumbled stones, translucent crystal pieces with natural inclusions, white background, crisp daylight, premium product style, no text, no logo.',
  },
  {
    name: 'Labradorite Flash Tumbled Stone',
    category: 'Tumbled Stones',
    price: 9.95,
    description:
      'A polished labradorite tumble selected for its blue-green flash. Labradorite is traditionally associated with intuition, transformation, and creative insight.',
    image: productImages.labradoriteFlashTumbledStone,
    stock: 32,
    imagePrompt:
      'Square ecommerce product photo of labradorite tumbled stones, grey crystals with blue green iridescent flash, dark neutral stone surface, soft directional light, no text, no logo.',
  },
  {
    name: 'Black Obsidian Tumbled Stone',
    category: 'Tumbled Stones',
    price: 6.95,
    description:
      'A glossy black obsidian tumble with a smooth mirror-like surface. Black obsidian is traditionally associated with grounding, reflection, and energetic clearing.',
    image: productImages.blackObsidianTumbledStone,
    stock: 41,
    imagePrompt:
      'Square ecommerce product photo of polished black obsidian tumbled stones, glossy deep black crystals on warm beige sand-textured background, minimal premium lighting, no text, no logo.',
  },
  {
    name: 'Carnelian Spark Tumbled Stone',
    category: 'Tumbled Stones',
    price: 7.95,
    description:
      'A warm orange carnelian tumble for desks, creative spaces, and daily carry. Carnelian is traditionally associated with motivation, confidence, and creative energy.',
    image: productImages.carnelianSparkTumbledStone,
    stock: 37,
    imagePrompt:
      'Square ecommerce product photo of carnelian tumbled stones, warm orange and red polished crystals, arranged on cream linen with soft sunlight, clean ecommerce style, no text, no logo.',
  },
  {
    name: 'Clear Quartz Clarity Point',
    category: 'Crystal Points',
    price: 29.95,
    description:
      'A polished clear quartz point for desks, shelves, or meditation corners. Its bright faceted shape makes it a versatile display piece for clarity-focused spaces.',
    image: productImages.clearQuartzClarityPoint,
    stock: 12,
    imagePrompt:
      'Square ecommerce product photo of a clear quartz crystal point tower, transparent polished six-sided point with natural inclusions, standing on white stone, soft studio light, no text, no logo.',
  },
  {
    name: 'Amethyst Dream Point',
    category: 'Crystal Points',
    price: 34.95,
    description:
      'A polished amethyst point with layered violet tones and natural patterning. Amethyst is traditionally associated with rest, intuition, and peaceful evening routines.',
    image: productImages.amethystDreamPoint,
    stock: 11,
    imagePrompt:
      'Square ecommerce product photo of an amethyst crystal point tower, deep purple polished facets with natural white bands, standing on ivory linen, soft moody daylight, no text, no logo.',
  },
  {
    name: 'Rose Quartz Heart Point',
    category: 'Crystal Points',
    price: 32.95,
    description:
      'A polished rose quartz point with a gentle pink glow. This piece brings a soft decorative accent to bedside tables, vanities, and self-care corners.',
    image: productImages.roseQuartzHeartPoint,
    stock: 13,
    imagePrompt:
      'Square ecommerce product photo of a rose quartz crystal point tower, pale pink polished facets, standing on cream ceramic surface with soft warm light, premium boutique look, no text, no logo.',
  },
  {
    name: 'Fluorite Focus Point',
    category: 'Crystal Points',
    price: 39.95,
    description:
      'A rainbow fluorite point with bands of green, purple, and clear tones. Fluorite is traditionally associated with focus, order, and mental clarity.',
    image: productImages.fluoriteFocusPoint,
    stock: 8,
    imagePrompt:
      'Square ecommerce product photo of a rainbow fluorite crystal point tower, polished green purple and clear bands, standing on white marble, soft studio light, no text, no logo.',
  },
  {
    name: 'Labradorite Aurora Point',
    category: 'Crystal Points',
    price: 49.95,
    description:
      'A polished labradorite point chosen for its shifting blue and gold flash. Labradorite is traditionally associated with intuition, change, and inner guidance.',
    image: productImages.labradoriteAuroraPoint,
    stock: 6,
    imagePrompt:
      'Square ecommerce product photo of a labradorite crystal point tower, grey polished stone with vivid blue gold flash, dark neutral backdrop, dramatic soft light, premium product photography, no text, no logo.',
  },
  {
    name: 'Beginner Crystal Ritual Set',
    category: 'Crystal Sets',
    price: 29.95,
    description:
      'A simple starter set with clear quartz, amethyst, rose quartz, black tourmaline, and citrine. Designed for gifting, display bowls, and first crystal collections.',
    image: productImages.beginnerCrystalRitualSet,
    stock: 20,
    imagePrompt:
      'Square ecommerce product photo of a beginner crystal set, clear quartz amethyst rose quartz black tourmaline citrine stones in a small linen pouch and tray, warm natural light, no text, no logo.',
  },
  {
    name: 'Love & Self-Care Crystal Set',
    category: 'Crystal Sets',
    price: 34.95,
    description:
      'A gentle set featuring rose quartz, rhodonite, clear quartz, and pink opal inspired stones. Curated for self-care rituals, journaling, and heartfelt gifting.',
    image: productImages.loveSelfCareCrystalSet,
    stock: 16,
    imagePrompt:
      'Square ecommerce product photo of a pink self care crystal set, rose quartz rhodonite clear quartz and pink stones arranged on cream linen with a small card, soft daylight, no text, no logo.',
  },
  {
    name: 'Protection Crystal Set',
    category: 'Crystal Sets',
    price: 36.95,
    description:
      'A grounding set with black tourmaline, smoky quartz, hematite, and clear quartz. Created for entryways, work desks, and boundary-setting routines.',
    image: productImages.protectionCrystalSet,
    stock: 15,
    imagePrompt:
      'Square ecommerce product photo of a protection crystal set, black tourmaline smoky quartz hematite clear quartz, arranged on dark slate with linen pouch, soft studio light, no text, no logo.',
  },
  {
    name: 'Seven Chakra Crystal Set',
    category: 'Crystal Sets',
    price: 42.95,
    description:
      'A colourful seven-piece set inspired by the chakra system. Each stone is selected for colour, texture, and easy display in meditation or wellness spaces.',
    image: productImages.sevenChakraCrystalSet,
    stock: 14,
    imagePrompt:
      'Square ecommerce product photo of a seven chakra crystal set, seven colourful polished stones arranged in a neat line on warm ivory background, clean boutique lighting, no text, no logo.',
  },
  {
    name: 'Moonlight Prism Suncatcher',
    category: 'Suncatchers',
    price: 39.95,
    description:
      'A crescent-inspired suncatcher with faceted crystal prisms for sunny windows. Designed to cast small rainbow reflections through bedrooms, studios, and reading corners.',
    image: productImages.moonlightPrismSuncatcher,
    stock: 10,
    imagePrompt:
      'Square ecommerce product photo of a crescent moon crystal prism suncatcher, gold metal moon frame with clear faceted prisms, hanging near a sunlit window, rainbow reflections, no text, no logo.',
  },
  {
    name: 'Golden Hoop Crystal Suncatcher',
    category: 'Suncatchers',
    price: 34.95,
    description:
      'A minimal hoop suncatcher with a single clear prism drop. Perfect for clean interiors, small windows, and subtle rainbow light in the afternoon sun.',
    image: productImages.goldenHoopCrystalSuncatcher,
    stock: 12,
    imagePrompt:
      'Square ecommerce product photo of a minimal golden hoop suncatcher with one clear faceted crystal prism, hanging on a white wall with rainbow light patterns, premium decor photography, no text, no logo.',
  },
  {
    name: 'Celestial Stars Suncatcher',
    category: 'Suncatchers',
    price: 49.95,
    description:
      'A decorative celestial suncatcher with star charms and dangling crystal prisms. Made for gifting, nursery windows, and light-filled creative spaces.',
    image: productImages.celestialStarsSuncatcher,
    stock: 8,
    imagePrompt:
      'Square ecommerce product photo of a celestial star crystal suncatcher, gold chain with small star charms and dangling clear prisms, sunlight casting rainbows on a neutral wall, no text, no logo.',
  },
  {
    name: 'Infinity Light Suncatcher',
    category: 'Suncatchers',
    price: 54.95,
    description:
      'A statement suncatcher with an infinity-inspired frame and layered crystal drops. Designed as a bright feature piece for windows, balconies, and sacred spaces.',
    image: productImages.infinityLightSuncatcher,
    stock: 7,
    imagePrompt:
      'Square ecommerce product photo of an infinity shaped crystal suncatcher, gold metal infinity frame with layered clear prism drops, bright window light, rainbow reflections, elegant home decor style, no text, no logo.',
  },
]

export const crystalProductsForSeed = crystalProducts.map((product) => ({
  name: product.name,
  category: product.category,
  price: product.price,
  description: product.description,
  image: product.image,
  stock: product.stock,
}))
