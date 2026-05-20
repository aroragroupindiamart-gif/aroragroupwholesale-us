#!/usr/bin/env node
/**
 * Project Ornament — Seed Script (Arora Group Wholesale)
 * Uses better-sqlite3 for synchronous, high-performance DB access.
 * Run: node scripts/seed.js
 */
import Database from 'better-sqlite3';
import { readFileSync, mkdirSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_PATH = path.join(DATA_DIR, 'ornament.db');
const SCHEMA_PATH = path.join(DATA_DIR, 'schema.sql');

if (!existsSync(DATA_DIR)) {
  mkdirSync(DATA_DIR, { recursive: true });
}

console.log('Opening database at:', DB_PATH);
const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('synchronous = NORMAL');

// Initialize schema
const schema = readFileSync(SCHEMA_PATH, 'utf-8');
db.exec(schema);
console.log('Schema initialized.');

// ─── DATA ──────────────────────────────────────────────────────────────────

const NICHES = [
  { niche_key: 'korean-jewellery', display_name: 'Korean Jewellery' },
  { niche_key: 'fashion-jewellery', display_name: 'Fashion Jewellery' },
  { niche_key: 'anti-tarnish-jewellery', display_name: 'Anti Tarnish Jewellery' },
  { niche_key: '18k-gold-plated-jewellery', display_name: '18k Gold Plated Jewellery' },
  { niche_key: 'demi-fine-jewellery', display_name: 'Demi Fine Jewellery' },
  { niche_key: 'western-jewellery', display_name: 'Western Jewellery' },
];

const INTENTS = ['wholesaler', 'supplier', 'manufacturer', 'importer'];

// 36 Indian states and union territories (static — no separate DB table)
const STATES = [
  { state_name: 'Delhi', state_slug: 'delhi', region: 'North' },
  { state_name: 'Haryana', state_slug: 'haryana', region: 'North' },
  { state_name: 'Himachal Pradesh', state_slug: 'himachal-pradesh', region: 'North' },
  { state_name: 'Jammu and Kashmir', state_slug: 'jammu-and-kashmir', region: 'North' },
  { state_name: 'Ladakh', state_slug: 'ladakh', region: 'North' },
  { state_name: 'Punjab', state_slug: 'punjab', region: 'North' },
  { state_name: 'Rajasthan', state_slug: 'rajasthan', region: 'North' },
  { state_name: 'Uttar Pradesh', state_slug: 'uttar-pradesh', region: 'North' },
  { state_name: 'Uttarakhand', state_slug: 'uttarakhand', region: 'North' },
  { state_name: 'Chandigarh', state_slug: 'chandigarh', region: 'North' },
  { state_name: 'Andhra Pradesh', state_slug: 'andhra-pradesh', region: 'South' },
  { state_name: 'Karnataka', state_slug: 'karnataka', region: 'South' },
  { state_name: 'Kerala', state_slug: 'kerala', region: 'South' },
  { state_name: 'Lakshadweep', state_slug: 'lakshadweep', region: 'South' },
  { state_name: 'Puducherry', state_slug: 'puducherry', region: 'South' },
  { state_name: 'Tamil Nadu', state_slug: 'tamil-nadu', region: 'South' },
  { state_name: 'Telangana', state_slug: 'telangana', region: 'South' },
  { state_name: 'Andaman and Nicobar Islands', state_slug: 'andaman-and-nicobar-islands', region: 'South' },
  { state_name: 'Dadra and Nagar Haveli and Daman and Diu', state_slug: 'dadra-nagar-haveli-daman-diu', region: 'West' },
  { state_name: 'Goa', state_slug: 'goa', region: 'West' },
  { state_name: 'Gujarat', state_slug: 'gujarat', region: 'West' },
  { state_name: 'Maharashtra', state_slug: 'maharashtra', region: 'West' },
  { state_name: 'Bihar', state_slug: 'bihar', region: 'East' },
  { state_name: 'Jharkhand', state_slug: 'jharkhand', region: 'East' },
  { state_name: 'Odisha', state_slug: 'odisha', region: 'East' },
  { state_name: 'West Bengal', state_slug: 'west-bengal', region: 'East' },
  { state_name: 'Chhattisgarh', state_slug: 'chhattisgarh', region: 'Central' },
  { state_name: 'Madhya Pradesh', state_slug: 'madhya-pradesh', region: 'Central' },
  { state_name: 'Arunachal Pradesh', state_slug: 'arunachal-pradesh', region: 'North-East' },
  { state_name: 'Assam', state_slug: 'assam', region: 'North-East' },
  { state_name: 'Manipur', state_slug: 'manipur', region: 'North-East' },
  { state_name: 'Meghalaya', state_slug: 'meghalaya', region: 'North-East' },
  { state_name: 'Mizoram', state_slug: 'mizoram', region: 'North-East' },
  { state_name: 'Nagaland', state_slug: 'nagaland', region: 'North-East' },
  { state_name: 'Sikkim', state_slug: 'sikkim', region: 'North-East' },
  { state_name: 'Tripura', state_slug: 'tripura', region: 'North-East' },
];

// 122 Indian cities
const CITIES = [
  // North — 38
  { city_name: 'New Delhi', state_name: 'Delhi', city_slug: 'new-delhi', state_slug: 'delhi', region: 'North' },
  { city_name: 'Noida', state_name: 'Uttar Pradesh', city_slug: 'noida', state_slug: 'uttar-pradesh', region: 'North' },
  { city_name: 'Gurgaon', state_name: 'Haryana', city_slug: 'gurgaon', state_slug: 'haryana', region: 'North' },
  { city_name: 'Faridabad', state_name: 'Haryana', city_slug: 'faridabad', state_slug: 'haryana', region: 'North' },
  { city_name: 'Ghaziabad', state_name: 'Uttar Pradesh', city_slug: 'ghaziabad', state_slug: 'uttar-pradesh', region: 'North' },
  { city_name: 'Agra', state_name: 'Uttar Pradesh', city_slug: 'agra', state_slug: 'uttar-pradesh', region: 'North' },
  { city_name: 'Lucknow', state_name: 'Uttar Pradesh', city_slug: 'lucknow', state_slug: 'uttar-pradesh', region: 'North' },
  { city_name: 'Kanpur', state_name: 'Uttar Pradesh', city_slug: 'kanpur', state_slug: 'uttar-pradesh', region: 'North' },
  { city_name: 'Varanasi', state_name: 'Uttar Pradesh', city_slug: 'varanasi', state_slug: 'uttar-pradesh', region: 'North' },
  { city_name: 'Prayagraj', state_name: 'Uttar Pradesh', city_slug: 'prayagraj', state_slug: 'uttar-pradesh', region: 'North' },
  { city_name: 'Meerut', state_name: 'Uttar Pradesh', city_slug: 'meerut', state_slug: 'uttar-pradesh', region: 'North' },
  { city_name: 'Bareilly', state_name: 'Uttar Pradesh', city_slug: 'bareilly', state_slug: 'uttar-pradesh', region: 'North' },
  { city_name: 'Moradabad', state_name: 'Uttar Pradesh', city_slug: 'moradabad', state_slug: 'uttar-pradesh', region: 'North' },
  { city_name: 'Aligarh', state_name: 'Uttar Pradesh', city_slug: 'aligarh', state_slug: 'uttar-pradesh', region: 'North' },
  { city_name: 'Gorakhpur', state_name: 'Uttar Pradesh', city_slug: 'gorakhpur', state_slug: 'uttar-pradesh', region: 'North' },
  { city_name: 'Mathura', state_name: 'Uttar Pradesh', city_slug: 'mathura', state_slug: 'uttar-pradesh', region: 'North' },
  { city_name: 'Firozabad', state_name: 'Uttar Pradesh', city_slug: 'firozabad', state_slug: 'uttar-pradesh', region: 'North' },
  { city_name: 'Jaipur', state_name: 'Rajasthan', city_slug: 'jaipur', state_slug: 'rajasthan', region: 'North' },
  { city_name: 'Jodhpur', state_name: 'Rajasthan', city_slug: 'jodhpur', state_slug: 'rajasthan', region: 'North' },
  { city_name: 'Udaipur', state_name: 'Rajasthan', city_slug: 'udaipur', state_slug: 'rajasthan', region: 'North' },
  { city_name: 'Kota', state_name: 'Rajasthan', city_slug: 'kota', state_slug: 'rajasthan', region: 'North' },
  { city_name: 'Ajmer', state_name: 'Rajasthan', city_slug: 'ajmer', state_slug: 'rajasthan', region: 'North' },
  { city_name: 'Bikaner', state_name: 'Rajasthan', city_slug: 'bikaner', state_slug: 'rajasthan', region: 'North' },
  { city_name: 'Chandigarh', state_name: 'Chandigarh', city_slug: 'chandigarh-city', state_slug: 'chandigarh', region: 'North' },
  { city_name: 'Amritsar', state_name: 'Punjab', city_slug: 'amritsar', state_slug: 'punjab', region: 'North' },
  { city_name: 'Ludhiana', state_name: 'Punjab', city_slug: 'ludhiana', state_slug: 'punjab', region: 'North' },
  { city_name: 'Jalandhar', state_name: 'Punjab', city_slug: 'jalandhar', state_slug: 'punjab', region: 'North' },
  { city_name: 'Patiala', state_name: 'Punjab', city_slug: 'patiala', state_slug: 'punjab', region: 'North' },
  { city_name: 'Shimla', state_name: 'Himachal Pradesh', city_slug: 'shimla', state_slug: 'himachal-pradesh', region: 'North' },
  { city_name: 'Dehradun', state_name: 'Uttarakhand', city_slug: 'dehradun', state_slug: 'uttarakhand', region: 'North' },
  { city_name: 'Haridwar', state_name: 'Uttarakhand', city_slug: 'haridwar', state_slug: 'uttarakhand', region: 'North' },
  { city_name: 'Roorkee', state_name: 'Uttarakhand', city_slug: 'roorkee', state_slug: 'uttarakhand', region: 'North' },
  { city_name: 'Srinagar', state_name: 'Jammu and Kashmir', city_slug: 'srinagar', state_slug: 'jammu-and-kashmir', region: 'North' },
  { city_name: 'Jammu', state_name: 'Jammu and Kashmir', city_slug: 'jammu', state_slug: 'jammu-and-kashmir', region: 'North' },
  { city_name: 'Rohtak', state_name: 'Haryana', city_slug: 'rohtak', state_slug: 'haryana', region: 'North' },
  { city_name: 'Panipat', state_name: 'Haryana', city_slug: 'panipat', state_slug: 'haryana', region: 'North' },
  { city_name: 'Karnal', state_name: 'Haryana', city_slug: 'karnal', state_slug: 'haryana', region: 'North' },
  { city_name: 'Manali', state_name: 'Himachal Pradesh', city_slug: 'manali', state_slug: 'himachal-pradesh', region: 'North' },
  // South — 28
  { city_name: 'Bengaluru', state_name: 'Karnataka', city_slug: 'bengaluru', state_slug: 'karnataka', region: 'South' },
  { city_name: 'Mysuru', state_name: 'Karnataka', city_slug: 'mysuru', state_slug: 'karnataka', region: 'South' },
  { city_name: 'Hubli', state_name: 'Karnataka', city_slug: 'hubli', state_slug: 'karnataka', region: 'South' },
  { city_name: 'Mangalore', state_name: 'Karnataka', city_slug: 'mangalore', state_slug: 'karnataka', region: 'South' },
  { city_name: 'Belagavi', state_name: 'Karnataka', city_slug: 'belagavi', state_slug: 'karnataka', region: 'South' },
  { city_name: 'Chennai', state_name: 'Tamil Nadu', city_slug: 'chennai', state_slug: 'tamil-nadu', region: 'South' },
  { city_name: 'Coimbatore', state_name: 'Tamil Nadu', city_slug: 'coimbatore', state_slug: 'tamil-nadu', region: 'South' },
  { city_name: 'Madurai', state_name: 'Tamil Nadu', city_slug: 'madurai', state_slug: 'tamil-nadu', region: 'South' },
  { city_name: 'Tiruchirappalli', state_name: 'Tamil Nadu', city_slug: 'tiruchirappalli', state_slug: 'tamil-nadu', region: 'South' },
  { city_name: 'Salem', state_name: 'Tamil Nadu', city_slug: 'salem', state_slug: 'tamil-nadu', region: 'South' },
  { city_name: 'Tiruppur', state_name: 'Tamil Nadu', city_slug: 'tiruppur', state_slug: 'tamil-nadu', region: 'South' },
  { city_name: 'Erode', state_name: 'Tamil Nadu', city_slug: 'erode', state_slug: 'tamil-nadu', region: 'South' },
  { city_name: 'Tirunelveli', state_name: 'Tamil Nadu', city_slug: 'tirunelveli', state_slug: 'tamil-nadu', region: 'South' },
  { city_name: 'Vellore', state_name: 'Tamil Nadu', city_slug: 'vellore', state_slug: 'tamil-nadu', region: 'South' },
  { city_name: 'Hyderabad', state_name: 'Telangana', city_slug: 'hyderabad', state_slug: 'telangana', region: 'South' },
  { city_name: 'Warangal', state_name: 'Telangana', city_slug: 'warangal', state_slug: 'telangana', region: 'South' },
  { city_name: 'Karimnagar', state_name: 'Telangana', city_slug: 'karimnagar', state_slug: 'telangana', region: 'South' },
  { city_name: 'Kochi', state_name: 'Kerala', city_slug: 'kochi', state_slug: 'kerala', region: 'South' },
  { city_name: 'Thiruvananthapuram', state_name: 'Kerala', city_slug: 'thiruvananthapuram', state_slug: 'kerala', region: 'South' },
  { city_name: 'Kozhikode', state_name: 'Kerala', city_slug: 'kozhikode', state_slug: 'kerala', region: 'South' },
  { city_name: 'Thrissur', state_name: 'Kerala', city_slug: 'thrissur', state_slug: 'kerala', region: 'South' },
  { city_name: 'Kannur', state_name: 'Kerala', city_slug: 'kannur', state_slug: 'kerala', region: 'South' },
  { city_name: 'Visakhapatnam', state_name: 'Andhra Pradesh', city_slug: 'visakhapatnam', state_slug: 'andhra-pradesh', region: 'South' },
  { city_name: 'Vijayawada', state_name: 'Andhra Pradesh', city_slug: 'vijayawada', state_slug: 'andhra-pradesh', region: 'South' },
  { city_name: 'Guntur', state_name: 'Andhra Pradesh', city_slug: 'guntur', state_slug: 'andhra-pradesh', region: 'South' },
  { city_name: 'Tirupati', state_name: 'Andhra Pradesh', city_slug: 'tirupati', state_slug: 'andhra-pradesh', region: 'South' },
  { city_name: 'Nellore', state_name: 'Andhra Pradesh', city_slug: 'nellore', state_slug: 'andhra-pradesh', region: 'South' },
  { city_name: 'Puducherry', state_name: 'Puducherry', city_slug: 'pondicherry', state_slug: 'puducherry', region: 'South' },
  // West — 22
  { city_name: 'Mumbai', state_name: 'Maharashtra', city_slug: 'mumbai', state_slug: 'maharashtra', region: 'West' },
  { city_name: 'Pune', state_name: 'Maharashtra', city_slug: 'pune', state_slug: 'maharashtra', region: 'West' },
  { city_name: 'Nagpur', state_name: 'Maharashtra', city_slug: 'nagpur', state_slug: 'maharashtra', region: 'West' },
  { city_name: 'Nashik', state_name: 'Maharashtra', city_slug: 'nashik', state_slug: 'maharashtra', region: 'West' },
  { city_name: 'Aurangabad', state_name: 'Maharashtra', city_slug: 'aurangabad', state_slug: 'maharashtra', region: 'West' },
  { city_name: 'Kolhapur', state_name: 'Maharashtra', city_slug: 'kolhapur', state_slug: 'maharashtra', region: 'West' },
  { city_name: 'Thane', state_name: 'Maharashtra', city_slug: 'thane', state_slug: 'maharashtra', region: 'West' },
  { city_name: 'Solapur', state_name: 'Maharashtra', city_slug: 'solapur', state_slug: 'maharashtra', region: 'West' },
  { city_name: 'Amravati', state_name: 'Maharashtra', city_slug: 'amravati', state_slug: 'maharashtra', region: 'West' },
  { city_name: 'Navi Mumbai', state_name: 'Maharashtra', city_slug: 'navi-mumbai', state_slug: 'maharashtra', region: 'West' },
  { city_name: 'Ahmedabad', state_name: 'Gujarat', city_slug: 'ahmedabad', state_slug: 'gujarat', region: 'West' },
  { city_name: 'Surat', state_name: 'Gujarat', city_slug: 'surat', state_slug: 'gujarat', region: 'West' },
  { city_name: 'Vadodara', state_name: 'Gujarat', city_slug: 'vadodara', state_slug: 'gujarat', region: 'West' },
  { city_name: 'Rajkot', state_name: 'Gujarat', city_slug: 'rajkot', state_slug: 'gujarat', region: 'West' },
  { city_name: 'Bhavnagar', state_name: 'Gujarat', city_slug: 'bhavnagar', state_slug: 'gujarat', region: 'West' },
  { city_name: 'Gandhinagar', state_name: 'Gujarat', city_slug: 'gandhinagar', state_slug: 'gujarat', region: 'West' },
  { city_name: 'Jamnagar', state_name: 'Gujarat', city_slug: 'jamnagar', state_slug: 'gujarat', region: 'West' },
  { city_name: 'Anand', state_name: 'Gujarat', city_slug: 'anand', state_slug: 'gujarat', region: 'West' },
  { city_name: 'Morbi', state_name: 'Gujarat', city_slug: 'morbi', state_slug: 'gujarat', region: 'West' },
  { city_name: 'Junagadh', state_name: 'Gujarat', city_slug: 'junagadh', state_slug: 'gujarat', region: 'West' },
  { city_name: 'Panaji', state_name: 'Goa', city_slug: 'panaji', state_slug: 'goa', region: 'West' },
  { city_name: 'Margao', state_name: 'Goa', city_slug: 'margao', state_slug: 'goa', region: 'West' },
  // East — 20
  { city_name: 'Kolkata', state_name: 'West Bengal', city_slug: 'kolkata', state_slug: 'west-bengal', region: 'East' },
  { city_name: 'Howrah', state_name: 'West Bengal', city_slug: 'howrah', state_slug: 'west-bengal', region: 'East' },
  { city_name: 'Durgapur', state_name: 'West Bengal', city_slug: 'durgapur', state_slug: 'west-bengal', region: 'East' },
  { city_name: 'Asansol', state_name: 'West Bengal', city_slug: 'asansol', state_slug: 'west-bengal', region: 'East' },
  { city_name: 'Siliguri', state_name: 'West Bengal', city_slug: 'siliguri', state_slug: 'west-bengal', region: 'East' },
  { city_name: 'Burdwan', state_name: 'West Bengal', city_slug: 'burdwan', state_slug: 'west-bengal', region: 'East' },
  { city_name: 'Malda', state_name: 'West Bengal', city_slug: 'malda', state_slug: 'west-bengal', region: 'East' },
  { city_name: 'Patna', state_name: 'Bihar', city_slug: 'patna', state_slug: 'bihar', region: 'East' },
  { city_name: 'Gaya', state_name: 'Bihar', city_slug: 'gaya', state_slug: 'bihar', region: 'East' },
  { city_name: 'Muzaffarpur', state_name: 'Bihar', city_slug: 'muzaffarpur', state_slug: 'bihar', region: 'East' },
  { city_name: 'Bhagalpur', state_name: 'Bihar', city_slug: 'bhagalpur', state_slug: 'bihar', region: 'East' },
  { city_name: 'Ranchi', state_name: 'Jharkhand', city_slug: 'ranchi', state_slug: 'jharkhand', region: 'East' },
  { city_name: 'Jamshedpur', state_name: 'Jharkhand', city_slug: 'jamshedpur', state_slug: 'jharkhand', region: 'East' },
  { city_name: 'Dhanbad', state_name: 'Jharkhand', city_slug: 'dhanbad', state_slug: 'jharkhand', region: 'East' },
  { city_name: 'Bokaro', state_name: 'Jharkhand', city_slug: 'bokaro', state_slug: 'jharkhand', region: 'East' },
  { city_name: 'Bhubaneswar', state_name: 'Odisha', city_slug: 'bhubaneswar', state_slug: 'odisha', region: 'East' },
  { city_name: 'Cuttack', state_name: 'Odisha', city_slug: 'cuttack', state_slug: 'odisha', region: 'East' },
  { city_name: 'Rourkela', state_name: 'Odisha', city_slug: 'rourkela', state_slug: 'odisha', region: 'East' },
  { city_name: 'Sambalpur', state_name: 'Odisha', city_slug: 'sambalpur', state_slug: 'odisha', region: 'East' },
  { city_name: 'Berhampur', state_name: 'Odisha', city_slug: 'berhampur', state_slug: 'odisha', region: 'East' },
  // Central — 8
  { city_name: 'Bhopal', state_name: 'Madhya Pradesh', city_slug: 'bhopal', state_slug: 'madhya-pradesh', region: 'Central' },
  { city_name: 'Indore', state_name: 'Madhya Pradesh', city_slug: 'indore', state_slug: 'madhya-pradesh', region: 'Central' },
  { city_name: 'Gwalior', state_name: 'Madhya Pradesh', city_slug: 'gwalior', state_slug: 'madhya-pradesh', region: 'Central' },
  { city_name: 'Jabalpur', state_name: 'Madhya Pradesh', city_slug: 'jabalpur', state_slug: 'madhya-pradesh', region: 'Central' },
  { city_name: 'Ujjain', state_name: 'Madhya Pradesh', city_slug: 'ujjain', state_slug: 'madhya-pradesh', region: 'Central' },
  { city_name: 'Raipur', state_name: 'Chhattisgarh', city_slug: 'raipur', state_slug: 'chhattisgarh', region: 'Central' },
  { city_name: 'Bilaspur', state_name: 'Chhattisgarh', city_slug: 'bilaspur', state_slug: 'chhattisgarh', region: 'Central' },
  { city_name: 'Durg', state_name: 'Chhattisgarh', city_slug: 'durg', state_slug: 'chhattisgarh', region: 'Central' },
  // North-East — 6
  { city_name: 'Guwahati', state_name: 'Assam', city_slug: 'guwahati', state_slug: 'assam', region: 'North-East' },
  { city_name: 'Dibrugarh', state_name: 'Assam', city_slug: 'dibrugarh', state_slug: 'assam', region: 'North-East' },
  { city_name: 'Imphal', state_name: 'Manipur', city_slug: 'imphal', state_slug: 'manipur', region: 'North-East' },
  { city_name: 'Shillong', state_name: 'Meghalaya', city_slug: 'shillong', state_slug: 'meghalaya', region: 'North-East' },
  { city_name: 'Agartala', state_name: 'Tripura', city_slug: 'agartala', state_slug: 'tripura', region: 'North-East' },
  { city_name: 'Aizawl', state_name: 'Mizoram', city_slug: 'aizawl', state_slug: 'mizoram', region: 'North-East' },
];

const NICHE_DISPLAY = {
  'korean-jewellery': 'Korean Jewellery',
  'fashion-jewellery': 'Fashion Jewellery',
  'anti-tarnish-jewellery': 'Anti Tarnish Jewellery',
  '18k-gold-plated-jewellery': '18k Gold Plated Jewellery',
  'demi-fine-jewellery': 'Demi Fine Jewellery',
  'western-jewellery': 'Western Jewellery',
};

const INTENT_DISPLAY = {
  wholesaler: 'Wholesaler',
  supplier: 'Supplier',
  manufacturer: 'Manufacturer',
  importer: 'Importer',
};

// ─── SEED ──────────────────────────────────────────────────────────────────

// Clear old data to ensure clean re-seed with new niches
db.exec('DELETE FROM programmatic_pages');
db.exec('DELETE FROM keywords');
db.exec('DELETE FROM locations');
console.log('Cleared existing data for clean re-seed.');

const insertLocation = db.prepare(`
  INSERT OR IGNORE INTO locations (city_name, state_name, city_slug, state_slug, region) VALUES (?, ?, ?, ?, ?)
`);
const insertKeyword = db.prepare(`
  INSERT OR IGNORE INTO keywords (raw_phrase, niche_key, intent_type) VALUES (?, ?, ?)
`);
const insertPage = db.prepare(`
  INSERT OR IGNORE INTO programmatic_pages
    (page_type, slug, title, h1_heading, niche_key, intent_type, target_city, target_state, state_slug, region)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const BRAND = 'Arora Group Wholesale';

const seedAll = db.transaction(() => {
  // 0. Wipe existing data so re-runs always produce a clean state
  db.exec('DELETE FROM programmatic_pages; DELETE FROM keywords; DELETE FROM locations;');
  console.log('Wiped existing data.');

  // 1. Cities (locations table)
  for (const c of CITIES) {
    insertLocation.run(c.city_name, c.state_name, c.city_slug, c.state_slug, c.region);
  }
  console.log(`Inserted ${CITIES.length} cities.`);

  // 2. Keywords
  for (const niche of NICHES) {
    for (const intent of INTENTS) {
      insertKeyword.run(
        `${NICHE_DISPLAY[niche.niche_key]} ${INTENT_DISPLAY[intent]}`,
        niche.niche_key,
        intent
      );
    }
  }
  console.log(`Inserted ${NICHES.length * INTENTS.length} keywords.`);

  // 3. City pages: 6 × 4 × 122 = 2,928
  let cityCount = 0;
  for (const niche of NICHES) {
    for (const intent of INTENTS) {
      for (const city of CITIES) {
        const nd = NICHE_DISPLAY[niche.niche_key];
        const id = INTENT_DISPLAY[intent];
        const slug = `${niche.niche_key}-${intent}-${city.city_slug}`;
        const title = `${nd} ${id} in ${city.city_name} | ${BRAND}`;
        const h1 = `${BRAND} — Direct ${nd} ${id} Serving ${city.city_name}, ${city.state_name}`;
        insertPage.run('city', slug, title, h1, niche.niche_key, intent, city.city_name, city.state_name, city.state_slug, city.region);
        cityCount++;
      }
    }
  }
  console.log(`Inserted ${cityCount} city pages.`);

  // 4. State pages: 6 × 4 × 36 = 864
  let stateCount = 0;
  for (const niche of NICHES) {
    for (const intent of INTENTS) {
      for (const state of STATES) {
        const nd = NICHE_DISPLAY[niche.niche_key];
        const id = INTENT_DISPLAY[intent];
        const slug = `${niche.niche_key}-${intent}-${state.state_slug}`;
        const title = `${nd} ${id}s in ${state.state_name} | ${BRAND}`;
        const h1 = `${BRAND} — ${nd} ${id}s Across ${state.state_name}`;
        insertPage.run('state', slug, title, h1, niche.niche_key, intent, null, state.state_name, state.state_slug, state.region);
        stateCount++;
      }
    }
  }
  console.log(`Inserted ${stateCount} state pages.`);
});

seedAll();

const pageRow = db.prepare('SELECT COUNT(*) as count FROM programmatic_pages').get();
console.log(`\n✅ Seed complete. Total programmatic pages: ${pageRow.count}`);
db.close();
