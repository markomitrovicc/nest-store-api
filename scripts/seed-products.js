const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

function loadEnvFile() {
  const envFilePath = path.resolve(__dirname, '..', '.env');

  if (!fs.existsSync(envFilePath)) {
    return;
  }

  const content = fs.readFileSync(envFilePath, 'utf8');

  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) {
      continue;
    }

    const separatorIndex = trimmed.indexOf('=');
    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();

    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  }
}

loadEnvFile();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined in .env');
  process.exit(1);
}

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true },
    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },
    stock: { type: Number, required: true, min: 0 },
    brand: { type: String, trim: true, default: '' },
  },
  { timestamps: true },
);

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

const imageUrls = [
  'https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80',
];

const baseProducts = [
  { name: 'Northpeak Trail Daypack', category: 'Hiking', brand: 'Northpeak', price: 89, stock: 32 },
  { name: 'Northpeak Trekking Poles', category: 'Hiking', brand: 'Northpeak', price: 49, stock: 28 },
  { name: 'Northpeak Stormproof Shell Jacket', category: 'Outdoor', brand: 'Northpeak', price: 129, stock: 24 },
  { name: 'Northpeak Insulated Bottle', category: 'Travel', brand: 'Northpeak', price: 34, stock: 40 },
  { name: 'Northpeak Camp Mug Kit', category: 'Camping', brand: 'Northpeak', price: 29, stock: 45 },
  { name: 'Northpeak Lightweight Tent', category: 'Camping', brand: 'Northpeak', price: 179, stock: 18 },
  { name: 'Northpeak Travel Duffel', category: 'Travel', brand: 'Northpeak', price: 69, stock: 38 },
  { name: 'Northpeak Sleeping Pad', category: 'Camping', brand: 'Northpeak', price: 54, stock: 27 },
  { name: 'Northpeak Trail Cooking Set', category: 'Camping', brand: 'Northpeak', price: 59, stock: 31 },
  { name: 'Northpeak Waterproof Map Case', category: 'Hiking', brand: 'Northpeak', price: 22, stock: 50 },
  { name: 'Northpeak Foldable Camp Stool', category: 'Camping', brand: 'Northpeak', price: 39, stock: 35 },
  { name: 'Northpeak Trail Hat', category: 'Hiking', brand: 'Northpeak', price: 27, stock: 42 },
  { name: 'Northpeak Portable Camp Table', category: 'Camping', brand: 'Northpeak', price: 94, stock: 21 },
  { name: 'Northpeak Dry Bag Set', category: 'Travel', brand: 'Northpeak', price: 36, stock: 53 },
  { name: 'Northpeak Trail Snack Carrier', category: 'Travel', brand: 'Northpeak', price: 19, stock: 61 },
  { name: 'Northpeak Trekking Gaiters', category: 'Hiking', brand: 'Northpeak', price: 33, stock: 37 },
  { name: 'Northpeak Compact Camp Shower', category: 'Camping', brand: 'Northpeak', price: 46, stock: 29 },
  { name: 'Northpeak Travel Towel', category: 'Travel', brand: 'Northpeak', price: 24, stock: 55 },
  { name: 'Northpeak Rain Cover', category: 'Outdoor', brand: 'Northpeak', price: 41, stock: 34 },
  { name: 'Northpeak Adventure Journal Kit', category: 'Travel', brand: 'Northpeak', price: 18, stock: 65 },
];

const suffixes = ['', ' Pro', ' Plus', ' Max', ' Ultra'];

function buildProducts() {
  const products = [];

  for (let i = 0; i < 100; i += 1) {
    const baseIndex = i % baseProducts.length;
    const stepIndex = Math.floor(i / baseProducts.length);
    const suffix = suffixes[stepIndex % suffixes.length];
    const template = baseProducts[baseIndex];

    const name = `${template.name}${suffix}`;
    const description = `${template.name} is part of the Northpeak collection, bringing together durable hiking, camping, and travel essentials built for real adventures and everyday reliability.`;

    products.push({
      name,
      description,
      price: template.price + stepIndex * 8,
      category: template.category,
      brand: template.brand,
      stock: template.stock + ((stepIndex + 1) % 7),
      imageUrl: imageUrls[i % imageUrls.length],
    });
  }

  return products;
}

async function main() {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 15000,
    });

    console.log('Connected to MongoDB');

    const products = buildProducts();

    await Product.deleteMany({});
    const inserted = await Product.insertMany(products);

    console.log(`Inserted ${inserted.length} products successfully.`);
  } catch (error) {
    console.error('Failed to seed products:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

main();
