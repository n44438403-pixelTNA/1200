const fs = require('fs');
let content = fs.readFileSync('constants.ts', 'utf8');

const newFeatures = `export const NSTA_DEFAULT_FEATURES = [
    { category: '🎬 VIDEO', id: 'UNIVERSAL_VIDEO', label: 'Universal Video', visible: true, allowedTiers: ['FREE', 'BASIC', 'ULTRA'], limits: { free: 2, basic: 5, ultra: undefined }, creditCost: 0 },
    { category: '🎬 VIDEO', id: 'FREE_VIDEO', label: 'Free Video', visible: true, allowedTiers: ['FREE', 'BASIC', 'ULTRA'], limits: { free: 5, basic: 10, ultra: 20 }, creditCost: 0 },
    { category: '🎧 AUDIO', id: 'AUDIO_LIBRARY', label: 'Audio Only', visible: true, allowedTiers: ['ULTRA'], limits: {}, creditCost: 0 },
    { category: '📑 NOTES', id: 'HISTORY_SAVE_NOTES', label: 'History Save Notes', visible: true, allowedTiers: ['BASIC', 'ULTRA'], limits: { basic: undefined, ultra: undefined }, creditCost: 0 },
    { category: '📝 LOGS', id: 'HISTORY_ACTIVITY_LOG', label: 'History Activity Log', visible: true, allowedTiers: ['FREE', 'BASIC', 'ULTRA'], limits: { free: undefined, basic: undefined, ultra: undefined }, creditCost: 0 },
    { category: '🤖 AI HUB', id: 'AI_TOUR', label: 'AI Tour', visible: true, allowedTiers: ['FREE', 'BASIC', 'ULTRA'], limits: { free: 1, basic: 2, ultra: 5 }, creditCost: 0 },
    { category: '🔄 REVISION', id: 'REVISION_HUB', label: 'Revision Hub', visible: true, allowedTiers: ['FREE', 'BASIC', 'ULTRA'], limits: { free: undefined, basic: 2, ultra: undefined }, creditCost: 0 },
    { category: '📑 NOTES', id: 'QUICK_NOTES', label: 'Quick Notes', visible: true, allowedTiers: ['FREE', 'BASIC', 'ULTRA'], limits: { free: undefined, basic: undefined, ultra: undefined }, creditCost: 0 },
    { category: '📑 NOTES', id: 'DETAILED_NOTES', label: 'Detailed Notes', visible: true, allowedTiers: ['FREE', 'BASIC', 'ULTRA'], limits: {}, creditCost: 5 },
    { category: '🤖 AI HUB', id: 'MEMORY_MODE_EXTRA', label: 'Memory Mode & Extra', visible: true, allowedTiers: ['ULTRA'], limits: {}, creditCost: 0 },
    { category: '📝 MCQ', id: 'PRACTICE_MCQ', label: 'Practice MCQ', visible: true, allowedTiers: ['FREE', 'BASIC', 'ULTRA'], limits: { free: 30, basic: 50, ultra: 100 }, creditCost: 0 },
    { category: '📝 MCQ', id: 'PREMIUM_TEST', label: 'Premium Test', visible: true, allowedTiers: ['BASIC', 'ULTRA'], limits: { basic: 30, ultra: 50 }, creditCost: 0 },
    { category: '📊 ANALYSIS', id: 'TOPIC_ANALYSIS', label: 'Topic Analysis', visible: true, allowedTiers: ['FREE', 'BASIC', 'ULTRA'], limits: { free: 10, basic: 30, ultra: undefined }, creditCost: 0 },
    { category: '📊 ANALYSIS', id: 'DETAILED_SOLUTION', label: 'Detailed Solution', visible: true, allowedTiers: ['FREE', 'BASIC', 'ULTRA'], limits: { free: undefined, basic: undefined, ultra: undefined }, creditCost: 0 },
    { category: '🎁 REWARDS', id: 'REDEEM_CODE', label: 'Redeem Code', visible: true, allowedTiers: ['FREE', 'BASIC', 'ULTRA'], limits: { free: 2, basic: 5, ultra: 10 }, creditCost: 0 }
];`;

content = content.replace(/export const NSTA_DEFAULT_FEATURES = \[\s*\{.*?\s*\};\s*\];/s, newFeatures);

fs.writeFileSync('constants.ts', content);
console.log('Constants updated');
