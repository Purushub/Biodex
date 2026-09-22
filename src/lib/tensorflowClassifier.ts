/**
 * In-browser species classification using TensorFlow.js MobileNet.
 * No API keys required — runs entirely on-device.
 */

import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';

let model: mobilenet.MobileNet | null = null;
let isLoading = false;
let loadPromise: Promise<mobilenet.MobileNet> | null = null;

/**
 * Load and cache the MobileNet model. Downloads ~16MB on first call,
 * then cached by the browser for instant reuse.
 */
export async function loadModel(): Promise<mobilenet.MobileNet> {
  if (model) return model;
  if (loadPromise) return loadPromise;

  isLoading = true;
  loadPromise = (async () => {
    try {
      // Use WebGL backend for GPU acceleration in browser
      await tf.ready();
      console.log('[BioDex AI] TensorFlow.js backend:', tf.getBackend());
      
      const loaded = await mobilenet.load({
        version: 2,
        alpha: 1.0,
      });
      model = loaded;
      isLoading = false;
      console.log('[BioDex AI] MobileNet v2 loaded successfully');
      return loaded;
    } catch (err) {
      isLoading = false;
      loadPromise = null;
      console.error('[BioDex AI] Failed to load MobileNet:', err);
      throw err;
    }
  })();

  return loadPromise;
}

export function isModelLoading(): boolean {
  return isLoading;
}

export function isModelReady(): boolean {
  return model !== null;
}

export interface ClassificationResult {
  className: string;
  probability: number;
}

/**
 * Classify an image from a video element, img element, or canvas.
 * Returns top N predictions sorted by probability.
 */
export async function classifyImage(
  source: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement,
  topK: number = 5
): Promise<ClassificationResult[]> {
  const net = await loadModel();
  const predictions = await net.classify(source, topK);
  return predictions.map((p) => ({
    className: p.className,
    probability: p.probability,
  }));
}

/**
 * Maps raw ImageNet class names to clean species-friendly common names.
 * MobileNet returns labels like "golden retriever" or "monarch, monarch butterfly".
 * This normalizes them into usable species hints.
 */
export function mapToSpeciesHint(predictions: ClassificationResult[]): {
  bestMatch: string;
  confidence: number;
  category: 'Flora' | 'Fauna' | 'Object' | 'Unknown';
  allPredictions: ClassificationResult[];
} {
  if (!predictions.length) {
    return { bestMatch: '', confidence: 0, category: 'Unknown', allPredictions: [] };
  }

  const top = predictions[0];
  const label = top.className.toLowerCase();
  const confidence = Math.round(top.probability * 100 * 10) / 10;

  // Determine category from ImageNet class label
  const category = categorizeLabel(label);

  // Clean up the label for species matching
  const cleanName = cleanLabel(top.className);

  return {
    bestMatch: cleanName,
    confidence,
    category,
    allPredictions: predictions,
  };
}

// Flora-related ImageNet classes
const FLORA_KEYWORDS = [
  'daisy', 'sunflower', 'rose', 'tulip', 'orchid', 'lily', 'lotus',
  'dandelion', 'poppy', 'hibiscus', 'jasmine', 'lavender', 'marigold',
  'mushroom', 'agaric', 'bolete', 'coral fungus', 'hen-of-the-woods',
  'banana', 'orange', 'lemon', 'pineapple', 'strawberry', 'fig',
  'pomegranate', 'apple', 'custard apple', 'jackfruit', 'mango',
  'acorn', 'ear', 'corn', 'head cabbage', 'broccoli', 'cauliflower',
  'zucchini', 'cucumber', 'artichoke', 'bell pepper', 'cardoon',
  'mushroom', 'granny smith', 'rapeseed', 'hay',
];

const FAUNA_KEYWORDS = [
  'dog', 'cat', 'bird', 'fish', 'snake', 'lizard', 'frog', 'turtle',
  'rabbit', 'mouse', 'hamster', 'squirrel', 'fox', 'wolf', 'bear',
  'lion', 'tiger', 'leopard', 'cheetah', 'elephant', 'giraffe', 'zebra',
  'monkey', 'gorilla', 'panda', 'koala', 'deer', 'horse', 'cow', 'sheep',
  'goat', 'pig', 'chicken', 'duck', 'goose', 'eagle', 'hawk', 'owl',
  'parrot', 'peacock', 'flamingo', 'penguin', 'dolphin', 'whale', 'shark',
  'octopus', 'jellyfish', 'starfish', 'crab', 'lobster', 'snail', 'slug',
  'butterfly', 'bee', 'ant', 'spider', 'scorpion', 'beetle', 'dragonfly',
  'mosquito', 'grasshopper', 'cricket', 'caterpillar', 'ladybug', 'moth',
  'retriever', 'shepherd', 'terrier', 'bulldog', 'poodle', 'beagle',
  'husky', 'collie', 'spaniel', 'dachshund', 'corgi', 'mastiff',
  'tabby', 'siamese', 'persian', 'maine coon',
  'hummingbird', 'robin', 'sparrow', 'finch', 'cardinal', 'warbler',
  'jackal', 'coyote', 'dingo', 'hyena', 'weasel', 'otter', 'badger',
  'gazelle', 'antelope', 'bison', 'buffalo', 'ibex', 'chamois',
  'iguana', 'chameleon', 'gecko', 'salamander', 'newt', 'toad',
  'crocodile', 'alligator', 'python', 'cobra', 'viper', 'rattlesnake',
  'hare', 'porcupine', 'armadillo', 'sloth', 'anteater', 'pangolin',
  'macaw', 'toucan', 'pelican', 'stork', 'crane', 'heron', 'ibis',
  'vulture', 'condor', 'kite', 'falcon', 'osprey',
  'salmon', 'trout', 'tuna', 'clownfish', 'goldfish', 'stingray',
  'sea turtle', 'tortoise', 'terrapin',
  'monarch', 'swallowtail', 'admiral', 'skipper',
  'wasp', 'hornet', 'bumblebee', 'firefly',
  'hermit crab', 'shrimp', 'prawn', 'krill',
  'coral', 'anemone', 'sea urchin', 'sea cucumber',
];

function categorizeLabel(label: string): 'Flora' | 'Fauna' | 'Object' | 'Unknown' {
  const lower = label.toLowerCase();
  
  if (FAUNA_KEYWORDS.some(k => lower.includes(k))) return 'Fauna';
  if (FLORA_KEYWORDS.some(k => lower.includes(k))) return 'Flora';
  
  // Some broader patterns
  if (/\b(puppy|kitten|cub|chick|hatchling|pup)\b/.test(lower)) return 'Fauna';
  if (/\b(flower|petal|leaf|stem|root|seed|fruit|vegetable|plant|tree|shrub|vine|grass|fern|moss|algae)\b/.test(lower)) return 'Flora';
  
  return 'Object';
}

function cleanLabel(raw: string): string {
  // MobileNet often returns "class1, class2, class3" — take the first
  const parts = raw.split(',').map(s => s.trim());
  let name = parts[0];
  
  // Capitalize each word
  name = name.replace(/\b\w/g, c => c.toUpperCase());
  
  return name;
}
