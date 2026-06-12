// Constants & Targets
const TARGETS = {
    fat: 150,
    protein: 120,
    carbs: 30,
    water: 3000,
    caffeine: 400
};

// Unit Conversions (multiplier to convert to grams or ml)
const UNITS = {
    'g': 1, 'gram': 1, 'grams': 1,
    'oz': 28.35, 'ounce': 28.35, 'ounces': 28.35,
    'lb': 453.59, 'lbs': 453.59, 'pound': 453.59, 'pounds': 453.59,
    
    'ml': 1, 'milliliter': 1, 'milliliters': 1,
    'l': 1000, 'liter': 1000, 'liters': 1000,
    'tsp': 5, 'teaspoon': 5, 'teaspoons': 5,
    'tbsp': 15, 'tablespoon': 15, 'tablespoons': 15,
    'cup': 240, 'cups': 240,
    
    'shot': 30, 'shots': 30,
    'slice': 25, 'slices': 25,
    'can': 355, 'cans': 355
};

// Built-in Database (macros per 1g or 1ml)
const DB = {
    // Fats/Oils
    "butter": { f: 0.81, p: 0.01, c: 0, defaultUnit: 15 },
    "mct oil": { f: 1.0, p: 0, c: 0, defaultUnit: 15 },
    "olive oil": { f: 1.0, p: 0, c: 0, defaultUnit: 15 },
    "coconut oil": { f: 1.0, p: 0, c: 0, defaultUnit: 15 },
    "heavy cream": { f: 0.36, p: 0.02, c: 0.03, defaultUnit: 15 },
    "whipping cream": { f: 0.36, p: 0.02, c: 0.03, defaultUnit: 15 },
    "sour cream": { f: 0.20, p: 0.02, c: 0.03, defaultUnit: 15 },
    "cream cheese": { f: 0.34, p: 0.06, c: 0.04, defaultUnit: 28.35 },
    "tallow": { f: 1.0, p: 0, c: 0, defaultUnit: 15 },
    "lard": { f: 1.0, p: 0, c: 0, defaultUnit: 15 },
    "ghee": { f: 1.0, p: 0, c: 0, defaultUnit: 15 },
    "avocado oil": { f: 1.0, p: 0, c: 0, defaultUnit: 15 },
    
    // Meats/Proteins
    "ribeye": { f: 0.20, p: 0.24, c: 0, defaultUnit: 225 }, // ~8oz
    "steak": { f: 0.15, p: 0.25, c: 0, defaultUnit: 225 },
    "beef": { f: 0.15, p: 0.25, c: 0, defaultUnit: 115 }, // ~4oz
    "chicken breast": { f: 0.03, p: 0.31, c: 0, defaultUnit: 170 }, // ~6oz
    "chicken thigh": { f: 0.08, p: 0.24, c: 0, defaultUnit: 115 },
    "chicken": { f: 0.05, p: 0.27, c: 0, defaultUnit: 115 },
    "pork belly": { f: 0.53, p: 0.09, c: 0, defaultUnit: 115 },
    "bacon": { f: 0.42, p: 0.37, c: 0.01, defaultUnit: 25 }, // 1 slice
    "salmon": { f: 0.13, p: 0.20, c: 0, defaultUnit: 170 },
    "tuna": { f: 0.01, p: 0.24, c: 0, defaultUnit: 140 }, // 1 can
    "sausage": { f: 0.27, p: 0.14, c: 0.01, defaultUnit: 85 }, // 1 link
    
    // Dairy/Cheeses
    "cheddar": { f: 0.33, p: 0.25, c: 0.01, defaultUnit: 28.35 },
    "mozzarella": { f: 0.22, p: 0.22, c: 0.02, defaultUnit: 28.35 },
    "parmesan": { f: 0.28, p: 0.38, c: 0.04, defaultUnit: 28.35 },
    "cheese": { f: 0.30, p: 0.25, c: 0.02, defaultUnit: 28.35 },
    
    // Nuts/Seeds
    "almond": { f: 0.50, p: 0.21, c: 0.09, defaultUnit: 28.35 },
    "almonds": { f: 0.50, p: 0.21, c: 0.09, defaultUnit: 28.35 },
    "macadamia": { f: 0.76, p: 0.08, c: 0.05, defaultUnit: 28.35 },
    "walnut": { f: 0.65, p: 0.15, c: 0.07, defaultUnit: 28.35 },
    "walnuts": { f: 0.65, p: 0.15, c: 0.07, defaultUnit: 28.35 },
    "pecan": { f: 0.72, p: 0.09, c: 0.04, defaultUnit: 28.35 },
    "pecans": { f: 0.72, p: 0.09, c: 0.04, defaultUnit: 28.35 },
    "chia": { f: 0.31, p: 0.17, c: 0.08, defaultUnit: 15 },
    "flax": { f: 0.42, p: 0.18, c: 0.02, defaultUnit: 15 },

    // Veggies/Fruits
    "avocado": { f: 0.15, p: 0.02, c: 0.02, defaultUnit: 150 }, // 1 whole
    "spinach": { f: 0, p: 0.03, c: 0.01, defaultUnit: 30 }, // 1 cup raw
    "broccoli": { f: 0, p: 0.03, c: 0.04, defaultUnit: 90 }, // 1 cup chopped
    "cauliflower": { f: 0, p: 0.02, c: 0.03, defaultUnit: 100 }, // 1 cup chopped
    "zucchini": { f: 0, p: 0.01, c: 0.02, defaultUnit: 120 }, // 1 cup chopped
    "asparagus": { f: 0, p: 0.02, c: 0.02, defaultUnit: 130 }, // 1 cup
    "raspberry": { f: 0.01, p: 0.01, c: 0.05, defaultUnit: 120 }, // 1 cup
    "raspberries": { f: 0.01, p: 0.01, c: 0.05, defaultUnit: 120 },

    // Fixed Items
    "egg": { f: 5, p: 6, c: 0, base: 'item' },
    "eggs": { f: 5, p: 6, c: 0, base: 'item' },
    
    // Caffeine (per 1 ml)
    "coffee": { caff: 0.4, type: 'caff', defaultUnit: 240 }, 
    "espresso": { caff: 2.1, type: 'caff', defaultUnit: 30 }, 
    "cold brew": { caff: 0.8, type: 'caff', defaultUnit: 240 }, 
    "green tea": { caff: 0.15, type: 'caff', defaultUnit: 240 }, 
    "black tea": { caff: 0.2, type: 'caff', defaultUnit: 240 }, 
    "energy drink": { caff: 0.3, type: 'caff', defaultUnit: 500 }, 
    
    // Water
    "water": { w: 1, type: 'water', defaultUnit: 240 } // default 1 cup if none specified
};

// State
let data = {
    fat: 0,
    protein: 0,
    carbs: 0,
    water: 0,
    caffeine: 0,
    history: []
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    updateUI();
});

function loadData() {
    const saved = localStorage.getItem('deliberateKetoData');
    if (saved) {
        data = JSON.parse(saved);
        
        const lastDate = localStorage.getItem('deliberateKetoDate');
        const today = new Date().toDateString();
        if (lastDate !== today) {
            resetDay(false);
        }
    }
    localStorage.setItem('deliberateKetoDate', new Date().toDateString());
}

function saveData() {
    localStorage.setItem('deliberateKetoData', JSON.stringify(data));
}

// Smart Logging Logic
function handleSmartInput(e) {
    if (e.key === 'Enter') {
        processSmartLog();
    }
}

function processSmartLog() {
    const inputEl = document.getElementById('smart-input');
    const text = inputEl.value.toLowerCase().trim();
    if (!text) return;

    const clauses = text.split(/and|,|&/);
    let itemsFound = [];
    let logDelta = { f: 0, p: 0, c: 0, w: 0, caff: 0 };

    clauses.forEach(clause => {
        clause = clause.trim();
        if (!clause) return;

        // Extract Quantity
        const numMatch = clause.match(/([\d.]+)/);
        let qty = 1;
        if (numMatch) {
            qty = parseFloat(numMatch[1]);
        }

        // Extract Unit
        let unitMultiplier = null;
        let matchedUnitName = "";
        for (const [u, mult] of Object.entries(UNITS)) {
            // Regex to match the unit exactly as a word, right after the number or isolated
            const unitRegex = new RegExp(`\\b${u}\\b`, 'i');
            if (unitRegex.test(clause)) {
                unitMultiplier = mult;
                matchedUnitName = u;
                break;
            }
        }

        // Find Food/Drink Match
        let foundMatch = false;
        // Sort keys by length descending so "cream cheese" matches before "cheese"
        const dbKeys = Object.keys(DB).sort((a, b) => b.length - a.length);

        for (const key of dbKeys) {
            if (clause.includes(key)) {
                foundMatch = true;
                const val = DB[key];
                
                // Calculate Final Multiplier (Quantity * Unit in grams)
                let finalMultiplier = 1;
                
                if (val.base === 'item') {
                    // Eggs are just per item, ignore "grams" if they accidentally typed "3g eggs"
                    finalMultiplier = qty;
                } else {
                    if (unitMultiplier) {
                        finalMultiplier = qty * unitMultiplier;
                    } else {
                        // If no unit provided (e.g. "1 avocado"), use the default serving size multiplier
                        finalMultiplier = qty * (val.defaultUnit || 100);
                    }
                }

                // Apply to Totals
                if (val.type === 'caff') {
                    const addCaff = val.caff * finalMultiplier;
                    data.caffeine += addCaff;
                    logDelta.caff += addCaff;
                    itemsFound.push(`${qty}${matchedUnitName ? ' '+matchedUnitName : ''} ${key} (+${addCaff.toFixed(0)}mg caff)`);
                } else if (val.type === 'water') {
                    const addW = val.w * finalMultiplier;
                    data.water += addW;
                    logDelta.w += addW;
                    itemsFound.push(`${addW.toFixed(0)}ml ${key}`);
                } else {
                    // It's a standard food
                    const addF = val.f * finalMultiplier;
                    const addP = val.p * finalMultiplier;
                    const addC = val.c * finalMultiplier;
                    data.fat += addF;
                    data.protein += addP;
                    data.carbs += addC;
                    logDelta.f += addF;
                    logDelta.p += addP;
                    logDelta.c += addC;
                    itemsFound.push(`${qty}${matchedUnitName ? ' '+matchedUnitName : ''} ${key} (+${addF.toFixed(1)}g F)`);
                }
                break; // stop searching db for this clause
            }
        }
        
        if (!foundMatch) {
            itemsFound.push(`[Unknown: "${clause}"]`);
        }
    });

    logHistory(`Logged: ${itemsFound.join(' | ')}`, logDelta);
    inputEl.value = '';
    saveData();
    updateUI();
}

function logHistory(msg, delta) {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const id = Date.now().toString() + Math.floor(Math.random()*1000);
    data.history.unshift({ id, time, msg, delta });
    if (data.history.length > 15) data.history.pop();
}

function deleteLog(index) {
    if (index >= 0 && index < data.history.length) {
        const item = data.history[index];
        if (item.delta) {
            data.fat = Math.max(0, data.fat - (item.delta.f || 0));
            data.protein = Math.max(0, data.protein - (item.delta.p || 0));
            data.carbs = Math.max(0, data.carbs - (item.delta.c || 0));
            data.water = Math.max(0, data.water - (item.delta.w || 0));
            data.caffeine = Math.max(0, data.caffeine - (item.delta.caff || 0));
        }
        data.history.splice(index, 1);
        saveData();
        updateUI();
    }
}

function resetDay(promptUser = true) {
    if(!promptUser || confirm("Are you sure you want to reset all metrics for today?")) {
        data = { fat: 0, protein: 0, carbs: 0, water: 0, caffeine: 0, history: [] };
        saveData();
        updateUI();
    }
}

// UI Updates
function updateUI() {
    document.getElementById('fat-val').innerText = data.fat.toFixed(0);
    document.getElementById('protein-val').innerText = data.protein.toFixed(0);
    document.getElementById('carbs-val').innerText = data.carbs.toFixed(0);
    document.getElementById('water-val').innerText = data.water.toFixed(0);
    document.getElementById('caffeine-val').innerText = data.caffeine.toFixed(0);

    setCircularProgress('fat-progress', data.fat, TARGETS.fat, '#F5A623');
    setCircularProgress('protein-progress', data.protein, TARGETS.protein, '#E02020');
    setCircularProgress('carbs-progress', data.carbs, TARGETS.carbs, '#50E3C2');

    setLinearProgress('water-bar', data.water, TARGETS.water);
    setLinearProgress('caffeine-bar', data.caffeine, TARGETS.caffeine);

    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';
    data.history.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="log-msg">${item.msg}</span> 
            <div class="log-actions">
                <span class="log-time">${item.time}</span>
                <button class="delete-btn" onclick="deleteLog(${index})">✕</button>
            </div>
        `;
        historyList.appendChild(li);
    });
}

function setCircularProgress(elementId, current, target, color) {
    const el = document.getElementById(elementId);
    let percentage = (current / target) * 100;
    if (percentage > 100) percentage = 100; 
    el.style.background = `conic-gradient(${color} ${percentage * 3.6}deg, rgba(255,255,255,0.1) 0deg)`;
}

function setLinearProgress(elementId, current, target) {
    const el = document.getElementById(elementId);
    let percentage = (current / target) * 100;
    if (percentage > 100) percentage = 100;
    el.style.width = `${percentage}%`;
}
