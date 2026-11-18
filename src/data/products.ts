import { Product } from '@/types';

export const CATEGORIES: { id: Product['category']; label: string; description: string }[] = [
  { id: 'skincare', label: 'Уход за кожей', description: 'Сыворотки, кремы и эликсиры для сияния' },
  { id: 'makeup', label: 'Макияж', description: 'Шелковые текстуры и естественные оттенки' },
  { id: 'perfume', label: 'Парфюмерия', description: 'Нишевые ароматы с утонченным шлейфом' },
  { id: 'body', label: 'Тело и СПА', description: 'Масла, скрабы и бальзамы для бархатной кожи' },
  { id: 'sets', label: 'Подарочные сеты', description: 'Идеальные готовые коллекции красоты' },
];

export const PRODUCTS: Product[] = [
  {
    id: 'glow-radiance-serum',
    name: 'Rose Quartz Radiance Serum',
    subtitle: 'Антиоксидантная сыворотка с витамином C и розовой водой',
    category: 'skincare',
    categoryLabel: 'Уход за кожей',
    price: 48,
    originalPrice: 58,
    rating: 4.9,
    reviewCount: 142,
    volume: '30 мл',
    inStock: true,
    isBestSeller: true,
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1608248597359-5484831d1d86?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Культовая сыворотка с биоактивным экстрактом дамасской розы, ниацинамидом и стабильной формой витамина C 15%. Моментально пробуждает естественное сияние, выравнивает тон, стирает следы усталости и защищает кожу от оксидативного стресса.',
    benefits: [
      'Мгновенный эффект свежести и "glass skin"',
      'Осветление пигментации и постакне за 14 дней',
      'Глубокое увлажнение без липкости',
      'Подходит под макияж'
    ],
    ingredients: 'Aqua, Rosa Damascena Flower Water, 3-O-Ethyl Ascorbic Acid (15%), Niacinamide (5%), Sodium Hyaluronate, Panthenol, Glycerin, Camellia Sinensis Leaf Extract, Allantoin, Phenoxyethanol, Ethylhexylglycerin.',
    usageInstructions: 'Нанесите 3-4 капли на очищенную слегка влажную кожу лица и шеи утром и вечером. Завершите уход увлажняющим кремом.',
    skinType: ['Для всех типов', 'Тусклая кожа', 'Чувствительная']
  },
  {
    id: 'velvet-peony-cream',
    name: 'Velvet Peony Infusion Cream',
    subtitle: 'Ультрапитательный восстанавливающий крем с керамидами',
    category: 'skincare',
    categoryLabel: 'Уход за кожей',
    price: 54,
    rating: 4.8,
    reviewCount: 98,
    volume: '50 мл',
    inStock: true,
    isNew: true,
    images: [
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Нежный шелковистый крем с комплексом 5 керамидов, маслом ши и пептидами шелка. Восстанавливает липидный барьер, предотвращает обезвоживание и защищает кожу от сухости в любое время года.',
    benefits: [
      'Укрепление защитного барьера кожи на 78%',
      'Шелковистый бархатный финиш',
      'Снятие покраснений и шелушений',
      'Не забивает поры'
    ],
    ingredients: 'Aqua, Butyrospermum Parkii (Shea) Butter, Caprylic/Capric Triglyceride, Ceramide NP, Ceramide AP, Ceramide EOP, Phytosphingosine, Paeonia Lactiflora Root Extract, Squalane, Tocopherol.',
    usageInstructions: 'Небольшое количество крема разогрейте в ладонях и распределите массажными движениями по лицу и шее.',
    skinType: ['Сухая', 'Нормальная', 'Обезвоженная', 'Чувствительная']
  },
  {
    id: 'dewy-hydra-essence',
    name: 'Dewy Cloud Milky Toner',
    subtitle: 'Молочный успокаивающий тонер с центеллой и рисом',
    category: 'skincare',
    categoryLabel: 'Уход за кожей',
    price: 36,
    originalPrice: 42,
    rating: 4.9,
    reviewCount: 215,
    volume: '150 мл',
    inStock: true,
    isBestSeller: true,
    images: [
      'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Инновационный молочный тонер двойного действия. Объединяет силу увлажняющей сыворотки и комфорт легкого крема. Ферментированный рисовый экстракт и мадекассосид мгновенно устраняют стянутость после умывания.',
    benefits: [
      'Глубокое насыщение влагой на 24 часа',
      'Мягкое осветление и гладкая текстура',
      'Успокаивает раздражения за считанные минуты',
      'Гипоаллергенно, без отдушек'
    ],
    ingredients: 'Oryza Sativa (Rice) Bran Water, Butylene Glycol, Centella Asiatica Extract, Madecassoside, Betaine, Ceramide NP, Hydrogenated Lecithin, Trehalose.',
    usageInstructions: 'Встряхните флакон, нанесите пару капель на ладони и бережно прижмите к коже лица. Можно наслаивать 2-3 раза для эффекта «стеклянной кожи».',
    skinType: ['Все типы', 'Чувствительная', 'Склонная к раздражениям']
  },
  {
    id: 'silk-tint-lipstick',
    name: 'Silk Petal Cashmere Lipstick',
    subtitle: 'Бархатная помада с атласным финишем, оттенок Nude Petal',
    category: 'makeup',
    categoryLabel: 'Макияж',
    price: 32,
    rating: 4.7,
    reviewCount: 84,
    volume: '3.8 г',
    inStock: true,
    isBestSeller: true,
    images: [
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Роскошная помада с нежной кашемировой формулой. Обогащена маслом дикого манго и витамином E. Придает губам чувственный полуматовый оттенок с эффектом мягкого фокуса и держится до 8 часов без ощущения сухости.',
    benefits: [
      'Идеальный универсальный нюдовый оттенок',
      'Стойкость до 8 часов без растекания',
      'Магнитный золотой футляр с мягким щелчком',
      'Ухаживает и питает нежную кожу губ'
    ],
    ingredients: 'Octyldodecanol, Ricinus Communis Seed Oil, Silica, Candelilla Cera, Mangifera Indica Seed Butter, Tocopheryl Acetate, CI 77891, CI 77491, CI 77492, CI 15850.',
    usageInstructions: 'Нанесите прямо из стика или растушуйте подушечками пальцев для эффекта зацелованных губ.',
    skinType: ['Для всех']
  },
  {
    id: 'champagne-glow-highlighter',
    name: 'Luminous Silk Fluid Highlighter',
    subtitle: 'Жидкий хайлайтер с жемчужным сиянием, оттенок Champagne',
    category: 'makeup',
    categoryLabel: 'Макияж',
    price: 38,
    rating: 4.9,
    reviewCount: 167,
    volume: '20 мл',
    inStock: true,
    images: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Жидкий хайлайтер тончайшего помола без крупных блесток. Создает эффект благородной, влажной и подсвеченной изнутри кожи. Можно наносить точечно на выступающие зоны или смешивать с тональной основой.',
    benefits: [
      'Благородное свечение без эффекта жирности',
      'Стойкость в течение всего дня',
      'Легко растушевывается кистью, спонжем или пальцами'
    ],
    ingredients: 'Isododecane, Mica, Hydrogenated Polyisobutene, Synthetic Fluorphlogopite, Squalane, Tin Oxide, Tocopherol.',
    usageInstructions: 'Поставьте 1-2 точки на скулы, спинку носа и галочку над верхней губой. Мягко растушуйте.',
    skinType: ['Все типы']
  },
  {
    id: 'fleur-de-soie-perfume',
    name: 'Fleur De Soie Eau de Parfum',
    subtitle: 'Нишевая парфюмерная вода: белый пион, инжир и сандал',
    category: 'perfume',
    categoryLabel: 'Парфюмерия',
    price: 95,
    originalPrice: 115,
    rating: 5.0,
    reviewCount: 63,
    volume: '50 мл',
    inStock: true,
    isBestSeller: true,
    images: [
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Утонченная ода женственности и чистоте. Открывается искрящимися нотами розового перца и спелого инжира, переходя в сердце из лепестков французского пиона и завершаясь теплым шепотом кашмерана и белого сандала.',
    benefits: [
      'Высокая концентрация парфюмерных масел (22%)',
      'Стойкий шлейф более 12 часов',
      'Дизайнерский флакон из тяжелого стекла с магнитной крышкой'
    ],
    ingredients: 'Alcohol Denat., Parfum (Fragrance), Aqua, Alpha-Isomethyl Ionone, Benzyl Salicylate, Limonene, Linalool.',
    usageInstructions: 'Распылите на точки пульса: запястья, шею и сгиб локтя на расстоянии 15 см.',
    skinType: ['Для всех']
  },
  {
    id: 'amber-cashmere-perfume',
    name: 'Nuit Dorée Parfum Extract',
    subtitle: 'Экстракт духов: бурбонская ваниль, амбра и дымный ветивер',
    category: 'perfume',
    categoryLabel: 'Парфюмерия',
    price: 110,
    rating: 4.8,
    reviewCount: 45,
    volume: '50 мл',
    inStock: true,
    isNew: true,
    images: [
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Глубокий вечерний аромат с гурманским характером. Золотистая амбра, мадагаскарская ваниль и дымный ветивер создают гипнотическую атмосферу роскоши и уюта.',
    benefits: [
      'Стойкость более 16 часов на коже',
      'Индивидуальное раскрытие на каждом человеке',
      'Идеально подходит для вечерних выходов и прохладного сезона'
    ],
    ingredients: 'Alcohol Denat., Parfum, Coumarin, Benzyl Benzoate, Eugenol, Geraniol.',
    usageInstructions: 'Достаточно 1-2 нажатий на распылитель для стойкого шлейфа.',
    skinType: ['Для всех']
  },
  {
    id: 'rose-gold-body-oil',
    name: 'Shimmering Golden Body Nectar',
    subtitle: 'Мерцающее сухое масло для тела с маслом жожоба и золотой пудрой',
    category: 'body',
    categoryLabel: 'Тело и СПА',
    price: 44,
    rating: 4.9,
    reviewCount: 119,
    volume: '100 мл',
    inStock: true,
    images: [
      'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1556228722-d0b71f92e854?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Драгоценный уход для тела с микрочастицами золотистого жемчуга. Легкая текстура сухого масла быстро впитывается, оставляя кожу атласной, напитанной и волнующе сияющей без ощущения жирной пленки.',
    benefits: [
      'Мгновенно впитывается и не пачкает одежду',
      'Придает коже соблазнительный загарный блеск',
      'Аромат теплой ванили и кокосового молока'
    ],
    ingredients: 'Caprylic/Capric Triglyceride, Simmondsia Chinensis (Jojoba) Seed Oil, Argania Spinosa Kernel Oil, Mica, CI 77491, Parfum.',
    usageInstructions: 'Встряхните перед применением. Нанесите на ключицы, плечи, ноги и зону декольте.',
    skinType: ['Все типы кожи тела']
  },
  {
    id: 'botanical-bath-salts',
    name: 'Rose & Lavender Spa Salt Crystals',
    subtitle: 'Ароматическая соль Мертвого моря с бутонами дамасской розы',
    category: 'body',
    categoryLabel: 'Тело и СПА',
    price: 26,
    rating: 4.8,
    reviewCount: 77,
    volume: '350 г',
    inStock: true,
    images: [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Натуральная морская соль с добавлением магния, эфирного масла прованской лаванды и цельных лепестков розы. Снимает мышечное напряжение, расслабляет нервную систему и подготавливает ко сну.',
    benefits: [
      'Глубокая детоксикация и расслабление мышц',
      'Высокое содержание магния и микроэлементов',
      '100% органический состав'
    ],
    ingredients: 'Maris Sal (Dead Sea Salt), Magnesium Sulfate, Rosa Gallica Flower, Lavandula Angustifolia Oil, Pelargonium Graveolens Oil.',
    usageInstructions: 'Растворите 3-4 столовые ложки соли под струей теплой воды в ванне. Принимайте ванну 15-20 минут.',
    skinType: ['Все типы']
  },
  {
    id: 'ultimate-glow-gift-set',
    name: 'The Royal Glow Signature Collection',
    subtitle: 'Подарочный бокс: сыворотка, крем, помада и шелковая повязка',
    category: 'sets',
    categoryLabel: 'Подарочные сеты',
    price: 129,
    originalPrice: 155,
    rating: 5.0,
    reviewCount: 92,
    volume: 'Сет из 4 продуктов',
    inStock: true,
    isBestSeller: true,
    images: [
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Лимитированный подарочный сет в элегантной фирменной коробке с тиснением розовым золотом. Включает бестселлеры бренда для полного ритуала сияния и роскошную повязку из 100% натурального шелка Mulberry.',
    benefits: [
      'Экономия 26$ по сравнению с покупкой по отдельности',
      'Готовое подарочное оформление с атласной лентой',
      'Комплексный уход за кожей лица и губами'
    ],
    ingredients: 'Полные составы всех средств набора указаны на индивидуальной упаковке каждого продукта.',
    usageInstructions: 'Используйте поэтапно в утреннем и вечернем ритуалах заботы о себе.',
    skinType: ['Для всех типов']
  },
  {
    id: 'botanical-cleansing-balm',
    name: 'Camellia Melty Cleansing Balm',
    subtitle: 'Тающий гидрофильный бальзам для снятия стойкого макияжа',
    category: 'skincare',
    categoryLabel: 'Уход за кожей',
    price: 35,
    rating: 4.8,
    reviewCount: 130,
    volume: '100 мл',
    inStock: true,
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Шербетоподобный бальзам при контакте с кожей тает в нежнейшее шелковое масло, а при добавлении воды превращается в молочко. Мягко растворяет даже водостойкий макияж и солнцезащитные фильтры, не раздражая глаза.',
    benefits: [
      'Деликатно очищает без чувства стянутости',
      'Растворяет черные точки и сальные нити',
      'Содержит ценное масло японской камелии'
    ],
    ingredients: 'Ethylhexyl Palmitate, Cetyl Ethylhexanoate, PEG-20 Glyceryl Triisostearate, Camellia Japonica Seed Oil, Simmondsia Chinensis Seed Oil, Tocopherol.',
    usageInstructions: 'Нанесите шпателем на сухую кожу лица, помассируйте 1 минуту, добавьте каплю воды для эмульгации и смойте теплой водой.',
    skinType: ['Все типы', 'Стойкий макияж']
  },
  {
    id: 'silk-cushion-foundation',
    name: 'Petal Cushion SPF 50+ PA++++',
    subtitle: 'Увлажняющий тональный кушон со светоотражающими частицами',
    category: 'makeup',
    categoryLabel: 'Макияж',
    price: 42,
    rating: 4.7,
    reviewCount: 68,
    volume: '15 г + запасной блок',
    inStock: true,
    images: [
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Невесомый тональный кушон с эффектом естественного сияния. Обеспечивает максимальную защиту от UVA/UVB-лучей, маскирует поры и мелкие несовершенства, не скатываясь в морщинки.',
    benefits: [
      'Максимальная защита от фотостарения SPF 50+',
      'В комплекте сменный рефилл 15 г',
      'Антибактериальный каплевидный спонж'
    ],
    ingredients: 'Water, Titanium Dioxide, Cyclopentasiloxane, Ethylhexyl Methoxycinnamate, Niacinamide, Zinc Oxide, Adenosine, Royal Jelly Extract.',
    usageInstructions: 'Мягко нажмите спонжем на подушечку кушона и распределите похлопывающими движениями по коже лица.',
    skinType: ['Все типы кожи']
  }
];

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find(p => p.id === id);
}

export function getProductsByCategory(category?: string): Product[] {
  if (!category || category === 'all') return PRODUCTS;
  return PRODUCTS.filter(p => p.category === category);
}

// Convert USD price to approximate Uzbek Som (for Payme demonstration)
// Rate: 1 USD = 12,800 UZS (standard exchange rate)
export const USD_TO_UZS = 12800;

export function formatUSD(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatUZS(amountInUSD: number): string {
  const uzs = Math.round(amountInUSD * USD_TO_UZS);
  return new Intl.NumberFormat('ru-RU').format(uzs) + ' сум';
}
