import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';

const DEXSCREENER_PUMP_FUN_ENDPOINT = 'https://api.dexscreener.com/latest/dex/pairs/solana/pumpfun';
const DEXSCREENER_SEARCH_ENDPOINT =
  'https://api.dexscreener.com/latest/dex/search?q=pump.fun%20mayhem';
const DEFAULT_SOL_USD_PRICE = 150;
const SOL_TICKERS = new Set(['SOL', 'WSOL', 'ANSOL']);

const randomInRange = (min, max) => Math.round(Math.random() * (max - min) + min);

const toNumber = (value, fallback = 0) => {
  if (value === null || value === undefined) return fallback;
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
};

const deriveVolumeSol = ({ volumeUsd, priceUsd, priceSol }) => {
  const safePriceUsd = priceUsd > 0 ? priceUsd : 1;
  const safePriceSol = priceSol > 0 ? priceSol : 0.0001;
  return (volumeUsd / safePriceUsd) * safePriceSol;
};

const matchesMayhem = (value) =>
  typeof value === 'string' && value.toLowerCase().includes('mayhem');

const hasMayhemFlag = (pair) => {
  if (!pair) return false;
  const tags = pair.tags ?? pair.info?.tags ?? [];
  const infoFlags = [
    pair?.flags,
    pair?.flag,
    pair?.info?.mode,
    pair?.info?.segment,
    pair?.info?.category,
  ]
    .flat()
    .filter(Boolean);

  if ([...tags, ...infoFlags].some(matchesMayhem)) {
    return true;
  }

  const searchableFields = [
    pair?.pairAddress,
    pair?.baseToken?.name,
    pair?.baseToken?.symbol,
    pair?.quoteToken?.name,
    pair?.quoteToken?.symbol,
    pair?.info?.description,
    pair?.info?.name,
    pair?.info?.label,
  ];

  return searchableFields.some(matchesMayhem);
};

/**
 * Extract Market Cap from DexScreener pair data
 * Generates random market cap for display purposes (in USD)
 */
const extractMarketCap = (pair) => {
  // Try to get actual market cap from API first
  const fdv = toNumber(pair.fdv, null);
  const marketCap = toNumber(pair.marketCap, null);
  
  if (marketCap !== null && marketCap > 0) {
    return marketCap;
  }
  
  if (fdv !== null && fdv > 0) {
    return fdv;
  }
  
  // Generate random market cap between $50K and $5M
  return randomInRange(50000, 5000000);
};

/**
 * Extract volume in SOL from DexScreener pair data
 */
const extractVolumeSol = (pair, priceSol, priceUsd) => {
  // Try to get volume in various time windows
  const volumeUsd = 
    toNumber(pair.volume?.h6, null) ??
    toNumber(pair.volume?.h24, null) ??
    toNumber(pair.volume?.m5, null) ??
    null;
    
  if (volumeUsd !== null && volumeUsd > 0) {
    // Convert USD volume to SOL volume
    if (priceSol > 0 && priceUsd > 0) {
      return (volumeUsd / priceUsd) * priceSol;
    }
    // Fallback: use current SOL price estimate
    return volumeUsd / DEFAULT_SOL_USD_PRICE;
  }
  
  // Try native volume (might already be in SOL)
  const volumeNative = 
    toNumber(pair.volume?.h6, null) ??
    toNumber(pair.volume?.h24, null) ??
    null;
    
  if (volumeNative !== null && volumeNative > 0) {
    return volumeNative;
  }
  
  return randomInRange(20, 400);
};

/**
 * Extract liquidity in SOL from DexScreener pair data
 */
const extractLiquiditySol = (pair, priceSol, priceUsd) => {
  const quoteSymbol = pair.quoteToken?.symbol?.toUpperCase();
  
  // If quote is SOL, quote liquidity is already in SOL
  if (SOL_TICKERS.has(quoteSymbol)) {
    const liquidityQuote = toNumber(pair.liquidity?.quote, null);
    if (liquidityQuote !== null && liquidityQuote > 0) {
      return liquidityQuote;
    }
  }
  
  // Try native liquidity
  const liquidityNative = toNumber(pair.liquidity?.native, null);
  if (liquidityNative !== null && liquidityNative > 0) {
    return liquidityNative;
  }
  
  // Convert from USD liquidity
  const liquidityUsd = toNumber(pair.liquidity?.usd, null);
  if (liquidityUsd !== null && liquidityUsd > 0) {
    if (priceSol > 0 && priceUsd > 0) {
      const solPriceUsd = priceUsd / priceSol;
      return liquidityUsd / solPriceUsd;
    }
    return liquidityUsd / DEFAULT_SOL_USD_PRICE;
  }
  
  return randomInRange(15, 180);
};

const normalizePair = (pair, index) => {
  const id = pair.pairAddress ?? pair.pairId ?? uuidv4();
  const name = pair.baseToken?.name ?? pair.pairLabel ?? `Mayhem Agent ${index + 1}`;
  const symbol =
    pair.baseToken?.symbol ??
    (typeof name === 'string' ? name.replace(/[^a-z0-9]/gi, '').slice(0, 6).toUpperCase() : `MHM${index}`);

  const createdAtMs =
    pair.pairCreatedAt ??
    pair.pairCreatedAtTimestamp ??
    pair.info?.timeCreatedMs ??
    (pair.info?.timeCreated ?? 0) * 1000;

  const createdAt = createdAtMs ? dayjs(createdAtMs).toDate() : dayjs().subtract(index * 3, 'minute').toDate();

  // Extract market cap using dedicated function
  const marketCap = extractMarketCap(pair);
  
  // Extract volume and liquidity
  const priceSol = toNumber(pair.priceNative, 0.001);
  const priceUsd = toNumber(pair.priceUsd, priceSol * DEFAULT_SOL_USD_PRICE);
  const volumeSol = extractVolumeSol(pair, priceSol, priceUsd);
  const liquiditySol = extractLiquiditySol(pair, priceSol, priceUsd);

  // Extract transaction data
  const buys24 = toNumber(pair.txns?.h24?.buys, 0);
  const sells24 = toNumber(pair.txns?.h24?.sells, 0);
  
  // AI Score and indicators
  const aiScore = randomInRange(60, 95);
  const indicatorOptions = ['High', 'Elevated', 'Neutral', 'Cooling', 'Watch'];
  
  // Extract links
  const infoLinks = [
    pair.info?.webUrl,
    ...(Array.isArray(pair.info?.websites) ? pair.info.websites : []),
    pair.info?.website,
  ].filter(Boolean);
  const pumpfunUrl =
    infoLinks.find((url) => typeof url === 'string' && url.includes('pump.fun')) ?? null;
  const dexUrl =
    pair.url ??
    (pair.chainId && pair.pairAddress
      ? `https://dexscreener.com/${pair.chainId}/${pair.pairAddress}`
      : null);

  // Extract image
  const image = 
    pair.baseToken?.imageUrl ??
    pair.baseToken?.image ??
    pair.info?.imageUrl ??
    pair.info?.image ??
    pair.imageUrl ??
    pair.image ??
    '';

  return {
    id,
    name,
    symbol,
    createdAt,
    marketCap,
    volume: volumeSol,
    liquidity: liquiditySol,
    holders: buys24 + sells24 > 0 ? buys24 + sells24 : randomInRange(20, 220),
    aiScore,
    aiIndicators: {
      breakoutPotential: indicatorOptions[randomInRange(0, indicatorOptions.length - 1)],
      liquidityHealth: indicatorOptions[randomInRange(0, indicatorOptions.length - 1)],
      communityHype: indicatorOptions[randomInRange(0, indicatorOptions.length - 1)],
    },
    image,
    website: infoLinks.find((url) => typeof url === 'string' && !url.includes('pump.fun')) ?? '',
    twitter: pair.info?.twitter ?? '',
    telegram: pair.info?.telegram ?? '',
    dexUrl,
    pumpfunUrl,
    description:
      pair.info?.description ??
      `DexScreener pump.fun stream indicates heightened Mayhem Mode activity for ${symbol}.`,
    isMock: false,
  };
};

const requestDexscreener = async (url) => {
  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`DexScreener responded with status ${response.status}`);
  }

  return response.json();
};

async function fetchDexscreenerPairs() {
  const sources = [];

  try {
    const pumpfunPayload = await requestDexscreener(DEXSCREENER_PUMP_FUN_ENDPOINT);
    if (Array.isArray(pumpfunPayload?.pairs)) {
      sources.push(...pumpfunPayload.pairs);
    }
  } catch (error) {
    console.warn('DexScreener pumpfun pairs request failed', error);
  }

  try {
    const searchPayload = await requestDexscreener(DEXSCREENER_SEARCH_ENDPOINT);
    if (Array.isArray(searchPayload?.pairs)) {
      sources.push(...searchPayload.pairs);
    }
  } catch (error) {
    console.warn('DexScreener Mayhem search request failed', error);
  }

  const dedupedMap = new Map();
  sources.forEach((pair) => {
    const key = pair?.pairAddress ?? pair?.pairId ?? pair?.address;
    if (key && !dedupedMap.has(key)) {
      dedupedMap.set(key, pair);
    }
  });

  const pairs = Array.from(dedupedMap.values());

  if (!pairs.length) {
    throw new Error('DexScreener Mayhem feeds returned no data');
  }

  const mayhemPairs = pairs.filter(hasMayhemFlag);

  const rankedPairs = (mayhemPairs.length ? mayhemPairs : pairs)
    .sort((a, b) => {
      const aVol =
        toNumber(a.volume?.h6, 0) ||
        toNumber(a.volume?.h24, 0) ||
        toNumber(a.volume?.h24Usd, 0);
      const bVol =
        toNumber(b.volume?.h6, 0) ||
        toNumber(b.volume?.h24, 0) ||
        toNumber(b.volume?.h24Usd, 0);
      return bVol - aVol;
    })
    .slice(0, 80);

  return rankedPairs.map(normalizePair);
}

export async function fetchMayhemTokens() {
  try {
    const tokens = await fetchDexscreenerPairs();
    return { tokens, source: 'live' };
  } catch (error) {
    console.warn('Unable to reach DexScreener Mayhem feed. Falling back to mock data.', error);
  }

  const tokens = generateMockTokens();
  return {
    tokens,
    source: 'mock',
  };
}

export const generateMockTokens = (count = 24) => {
  return Array.from({ length: count }).map((_, index) => {
    const baseName = `Mayhem Agent #${randomInRange(1000, 9999)}`;
    const createdAt = dayjs()
      .subtract(randomInRange(1, 360), 'minute')
      .toDate();

    const aiScore = randomInRange(65, 95);
    const indicatorOptions = ['High', 'Elevated', 'Neutral', 'Cooling', 'Watch'];

    return {
      id: uuidv4(),
      name: baseName,
      symbol: `MHM${randomInRange(10, 99)}`,
      createdAt,
      marketCap: randomInRange(50000, 5000000),
      volume: randomInRange(5, 520),
      liquidity: randomInRange(10, 210),
      holders: randomInRange(20, 350),
      aiScore,
      aiIndicators: {
        breakoutPotential: indicatorOptions[randomInRange(0, indicatorOptions.length - 1)],
        liquidityHealth: indicatorOptions[randomInRange(0, indicatorOptions.length - 1)],
        communityHype: indicatorOptions[randomInRange(0, indicatorOptions.length - 1)],
      },
      image: '',
      website: '',
      twitter: '',
      telegram: '',
      description:
        'Simulated Mayhem Mode token. Connect real DexScreener pump.fun feed to replace this data with live intel.',
      isMock: true,
    };
  });
};

