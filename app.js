// -------------------- Firebase Auth --------------------
const firebaseConfig = {
  apiKey: "AIzaSyAT2jy5PQSKKG4Y01m_h_4uIWt9Dhz9rBk",
  authDomain: "caloricurve-web.firebaseapp.com",
  projectId: "caloricurve-web",
  storageBucket: "caloricurve-web.appspot.com",
  messagingSenderId: "269996776796",
  appId: "1:269996776796:web:922a522a6aa687f4c6b599"
};
firebase.initializeApp(firebaseConfig);

firebase.auth().onAuthStateChanged(user => {
  const profilePic = document.getElementById("profilePic");
  profilePic.src = user && user.providerData[0].providerId === "google.com"
    ? user.photoURL
    : "assets/profile.png";

  const signUpButton = document.querySelector('a[href="signup.html"] .menu-btn');
  if (user) {
    profilePic.classList.remove("hidden");
    signUpButton.classList.add("hidden");
  } else {
    profilePic.classList.add("hidden");
    signUpButton.classList.remove("hidden");
  }
});

// -------------------- Calculator Toggle --------------------
document.getElementById("calcToggleBtn").addEventListener("click", () => {
  document.getElementById("calcWidget").classList.toggle("hidden");
});
function closeCalculator() {
  document.getElementById("calcWidget").classList.add("hidden");
}

// -------------------- Nutrition Calculator --------------------
function calculateNutrition() {
  const age = parseInt(document.getElementById("age").value);
  const gender = document.getElementById("gender").value;
  const height = parseInt(document.getElementById("height").value);
  const weight = parseFloat(document.getElementById("weight").value);
  const activity = parseFloat(document.getElementById("activity").value);
  const goal = document.getElementById("goal").value;

  if (!age || !height || !weight) {
    alert("Please fill all values!");
    return;
  }

  const bmr = gender === "Male"
    ? 10 * weight + 6.25 * height - 5 * age + 5
    : 10 * weight + 6.25 * height - 5 * age - 161;

  let calories = bmr * activity;
  if (goal === "lose") calories -= 500;
  else if (goal === "gain") calories += 500;

  const bmi = (weight / ((height / 100) ** 2)).toFixed(1);
  const protein = Math.round(weight * 2);
  const fats = Math.round(0.8 * weight);
  const carbs = Math.round((calories - (protein * 4 + fats * 9)) / 4);
  const fiber = Math.round(weight * 0.3);

  const micronutrients = {
    iron: 18, zinc: 11, calcium: 1000, vitaminA: 900, vitaminB12: 2.4,
    vitaminC: 90, vitaminD: 15, omega3: 1.6, magnesium: 400,
    potassium: 3500, sodium: 1500, sugar: 25
  };

  // Update UI
  document.getElementById("calcResult").innerHTML = `
      <p><strong>Calories:</strong> ${Math.round(calories)} kcal</p>
      <p><strong>Protein:</strong> ${protein} g</p>
      <p><strong>Fats:</strong> ${fats} g</p>
      <p><strong>Carbs:</strong> ${carbs} g</p>
      <p><strong>Fibre:</strong> ${fiber} g</p>
  `;

  document.getElementById("bmiValue").innerText = bmi;
  document.getElementById("calorieProgress").innerText = `0 / ${Math.round(calories)}`;
  document.getElementById("goalValue").innerText = goal.charAt(0).toUpperCase() + goal.slice(1);

  document.getElementById("proteinText").innerText = `0 g / ${protein} g`;
  document.getElementById("carbsText").innerText = `0 g / ${carbs} g`;
  document.getElementById("fibreText").innerText = `0 g / ${fiber} g`;
  document.getElementById("fatsText").innerText = `0 g / ${fats} g`;

  const units = { iron: "mg", zinc: "mg", calcium: "mg", vitaminA: "mcg", vitaminB12: "mcg", vitaminC: "mg", vitaminD: "mcg", omega3: "g", magnesium: "mg", potassium: "mg", sodium: "mg", sugar: "g" };
  for (const key in micronutrients) {
    document.getElementById(key + "Text").innerText = `0 ${units[key]} / ${micronutrients[key]} ${units[key]}`;
  }

  // Save to localStorage
  const stats = { bmi: parseFloat(bmi), calories: Math.round(calories), protein, carbs, fats, fiber, micros: micronutrients, goal };
  localStorage.setItem("nutritionStats", JSON.stringify(stats));
  localStorage.setItem("userInputData", JSON.stringify({ age, gender, height, weight, activity, goal }));
}

// -------------------- Load Previous Inputs --------------------
document.addEventListener("DOMContentLoaded", () => {
  const stats = JSON.parse(localStorage.getItem("nutritionStats") || "{}");
  const inputData = JSON.parse(localStorage.getItem("userInputData") || "{}");

  if (inputData) {
    document.getElementById("age").value = inputData.age;
    document.getElementById("gender").value = inputData.gender;
    document.getElementById("height").value = inputData.height;
    document.getElementById("weight").value = inputData.weight;
    document.getElementById("activity").value = inputData.activity;
    document.getElementById("goal").value = inputData.goal;
  }

  // Ensure Goal text reflects saved goal (maintain/lose/gain)
  const savedGoal = (stats.goal || inputData.goal || "").toString();
  if (savedGoal) {
    document.getElementById("goalValue").innerText = savedGoal.charAt(0).toUpperCase() + savedGoal.slice(1);
  }

  if (stats && stats.micros) {
    document.getElementById("bmiValue").innerText = stats.bmi;
    document.getElementById("calorieProgress").innerText = `0 / ${stats.calories}`;

    document.getElementById("proteinText").innerText = `0 g / ${stats.protein} g`;
    document.getElementById("carbsText").innerText = `0 g / ${stats.carbs} g`;
    document.getElementById("fibreText").innerText = `0 g / ${stats.fiber} g`;
    document.getElementById("fatsText").innerText = `0 g / ${stats.fats} g`;

    // Define units locally for this block
    const units = { iron: "mg", zinc: "mg", calcium: "mg", vitaminA: "mcg", vitaminB12: "mcg", vitaminC: "mg", vitaminD: "mcg", omega3: "g", magnesium: "mg", potassium: "mg", sodium: "mg", sugar: "g" };
    const m = stats.micros;
    for (const key in m) {
      const unit = units[key];
      document.getElementById(key + "Text").innerText = `0 ${unit} / ${m[key]} ${unit}`;
    }
  }
});

// -------------------- Food Logging --------------------
const foodInput = document.querySelector(".search-input");
const addFoodBtn = document.querySelector(".add-food-btn");
const mealSection = document.getElementById("mealSection");

// Trigger day-end auto reset if needed on load, and check periodically
resetDayIfNeeded();
setInterval(resetDayIfNeeded, 60 * 1000);

// Backend base URL (Render)
const API_BASE = "https://caloricurve-backend.onrender.com";

// Warm up Render backend (helps avoid cold-start empty responses)
async function warmUpBackend() {
  try {
    await fetch(`${API_BASE}/api/health`, { method: "GET", cache: "no-store" });
  } catch (e) {
    // ignore warm-up failures
  }
}

// Fetch helper with timeout and retry
async function fetchJsonWithRetry(url, options = {}, retries = 2, timeoutMs = 10000) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timer);

      const contentType = (res.headers.get("content-type") || "").toLowerCase();
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Request failed (${res.status})`);
      }

      if (contentType.includes("application/json")) {
        return await res.json();
      } else {
        const text = await res.text();
        const start = text.indexOf("{");
        const end = text.lastIndexOf("}");
        if (start !== -1 && end !== -1) {
          return JSON.parse(text.slice(start, end + 1));
        }
        throw new Error("Non-JSON response");
      }
    } catch (err) {
      clearTimeout(timer);
      if (attempt < retries) {
        // small delay before retrying (backend may be waking up)
        await new Promise(r => setTimeout(r, 1500));
        continue;
      }
      throw err;
    }
  }
}

// Kick off a background warm-up as the page loads
setTimeout(() => { warmUpBackend(); }, 0);
let totalCalories = 0;
let totalMacros = { protein: 0, carbs: 0, fats: 0, fiber: 0 };
let totalMicros = { iron: 0, zinc: 0, calcium: 0, vitaminA: 0, vitaminB12: 0,
    vitaminC: 0, vitaminD: 0, omega3: 0, cholesterol: 0, magnesium: 0,
    potassium: 0, sodium: 0, sugar: 0
  };

  // Load full logged foods if present
  let loggedFoods = JSON.parse(localStorage.getItem("mealsFull") || "[]");
  if (loggedFoods.length > 0) {
    loggedFoods.forEach(food => {
      createMealBlock(food);
      updateTotals(food);
    });
    updateProgress();
  }

  addFoodBtn.addEventListener("click", async () => {
    const query = foodInput.value.trim();
    if (!query) {
      alert("Please enter a food name.");
      return;
    }
  
    addFoodBtn.disabled = true;
    addFoodBtn.textContent = "Loading...";
  
    try {
      await warmUpBackend();
      const url = `${API_BASE}/api/food?query=${encodeURIComponent(query)}`;
      const data = await fetchJsonWithRetry(
        url,
        {
          method: "GET",
          mode: "cors",
          cache: "no-store",
          credentials: "omit",
          headers: { "Accept": "application/json" }
        },
        2,
        12000
      );
  
      // Attach timestamp and a simple id to the item before logging and rendering
      const nowIso = new Date().toISOString();
      const item = { ...data, takenAt: nowIso, id: `${nowIso}-${Math.random().toString(36).slice(2,8)}` };
  
      createMealBlock(item);
      updateTotals(item);
      loggedFoods.push(item);
      saveToLocalStorage(loggedFoods, totalCalories, totalMacros, totalMicros);
      updateProgress();
  
      foodInput.value = "";
    } catch (err) {
      console.error(err);
      const isTimeout = err?.name === "AbortError";
      const msg = isTimeout
        ? "Request timed out. Backend may be waking up. Please try again in a moment."
        : "Error fetching nutrition data: " + err.message;
      alert(msg);
    } finally {
      addFoodBtn.disabled = false;
      addFoodBtn.textContent = "Add Food";
    }
  });

  function createMealBlock(food) {
    const mealDiv = document.createElement("div");
    mealDiv.classList.add("meal-card");

    // Format timestamp (if available)
    const timeLabel = food.takenAt
      ? new Date(food.takenAt).toLocaleString([], { hour: "2-digit", minute: "2-digit" })
      : new Date().toLocaleString([], { hour: "2-digit", minute: "2-digit" });

    mealDiv.innerHTML = `
      <p>${food.name}</p>
      <p>${food.portion} ${food.calories} kcal <br> <span class="meal-time">${timeLabel}</span></p>
      <button class="delete-meal">×</button>
    `;
    mealSection.appendChild(mealDiv);

    mealDiv.querySelector(".delete-meal").addEventListener("click", () => {
      mealDiv.remove();
      subtractTotals(food);
      // Remove from loggedFoods using id when available, fallback to name/portion/calories match
      loggedFoods = loggedFoods.filter(f => {
        if (food.id && f.id) return f.id !== food.id;
        return !(f.name === food.name && f.portion === food.portion && f.calories === food.calories);
      });
      saveToLocalStorage(loggedFoods, totalCalories, totalMacros, totalMicros);
      updateProgress();
    });
  }

  function updateTotals(food) {
    totalCalories += Number(food.calories || 0);
    totalMacros.protein += Number(food.protein || 0);
    totalMacros.carbs += Number(food.carbs || 0);
    totalMacros.fats += Number(food.fats || 0);
    totalMacros.fiber += Number(food.fiber || 0);
    Object.keys(totalMicros).forEach(k => { totalMicros[k] += Number(food[k] || 0); });
  }
  function subtractTotals(food) {
    totalCalories -= Number(food.calories || 0);
    totalMacros.protein -= Number(food.protein || 0);
    totalMacros.carbs -= Number(food.carbs || 0);
    totalMacros.fats -= Number(food.fats || 0);
    totalMacros.fiber -= Number(food.fiber || 0);
    Object.keys(totalMicros).forEach(k => { totalMicros[k] -= Number(food[k] || 0); });
    // Clamp to zero to avoid negative totals or accidental resets
    totalCalories = Math.max(0, totalCalories);
    totalMacros.protein = Math.max(0, totalMacros.protein);
    totalMacros.carbs = Math.max(0, totalMacros.carbs);
    totalMacros.fats = Math.max(0, totalMacros.fats);
    totalMacros.fiber = Math.max(0, totalMacros.fiber);
    Object.keys(totalMicros).forEach(k => { if (totalMicros[k] < 0) totalMicros[k] = 0; });
  }

  function saveToLocalStorage(mealsFull, calories, macros, micros) {
    localStorage.setItem("mealsFull", JSON.stringify(mealsFull));
    localStorage.setItem("totals", JSON.stringify({ calories, macros, micros }));
  }

  function updateProgress() {
    const goals = JSON.parse(localStorage.getItem("nutritionStats") || "{}");
    const goalCalories = goals.calories || 0;
    const goalProtein = goals.protein || 0;
    const goalCarbs = goals.carbs || 0;
    const goalFiber = goals.fiber || 0;
    const goalFats = goals.fats || 0;

    document.getElementById("calorieProgress").textContent = `${totalCalories.toFixed(0)} / ${goalCalories}`;
    document.getElementById("proteinText").textContent = `${totalMacros.protein.toFixed(1)} g / ${goalProtein} g`;
    document.getElementById("carbsText").textContent = `${totalMacros.carbs.toFixed(1)} g / ${goalCarbs} g`;
    document.getElementById("fibreText").textContent = `${totalMacros.fiber.toFixed(1)} g / ${goalFiber} g`;
    document.getElementById("fatsText").textContent = `${totalMacros.fats.toFixed(1)} g / ${goalFats} g`;

    // Update MicroNutrient cards
    const microKeys = [
      "iron", "zinc", "calcium", "vitaminA", "vitaminB12",
      "vitaminC", "vitaminD", "omega3", "magnesium",
      "potassium", "sodium", "sugar"
    ];
    const microUnits = {
      iron: "mg", zinc: "mg", calcium: "mg", vitaminA: "mcg",
      vitaminB12: "mcg", vitaminC: "mg", vitaminD: "mcg",
      omega3: "g", magnesium: "mg",
      potassium: "mg", sodium: "mg", sugar: "g"
    };
    const goalsMicros = goals.micros || {};
    microKeys.forEach((k) => {
      const unit = microUnits[k];
      const val = Number(totalMicros[k] || 0);
      const goal = Number(goalsMicros[k] || 0);
      const decimals = unit === "mcg" ? 0 : 1;
      const el = document.getElementById(`${k}Text`);
      if (el) {
        el.textContent = `${val.toFixed(decimals)} ${unit} / ${goal} ${unit}`;
      }
    });
  }

// -------------------- Auto reset on new day --------------------
function isNewDay() {
  const today = new Date().toISOString().split('T')[0]; // e.g. "2025-10-11"
  const lastDate = localStorage.getItem("lastLoggedDate");
  return today !== lastDate;
}

function resetDayIfNeeded() {
  if (isNewDay()) {
    // Clear only food logs
    localStorage.removeItem("mealsFull");
    localStorage.removeItem("meals");
    localStorage.removeItem("totals");
    localStorage.setItem("lastLoggedDate", new Date().toISOString().split('T')[0]);

    // Reset macro/micro totals
    totalCalories = 0;
    totalMacros = { protein: 0, carbs: 0, fats: 0, fiber: 0 };
    totalMicros = {
      iron: 0, zinc: 0, calcium: 0, vitaminA: 0, vitaminB12: 0,
      vitaminC: 0, vitaminD: 0, omega3: 0, cholesterol: 0, magnesium: 0,
      potassium: 0, sodium: 0, sugar: 0
    };

    // Clear meal section from UI
    document.getElementById("mealSection").innerHTML = "";

    // Reset UI progress
    updateProgress();
  }
}

// -------------------- Enter key to add food --------------------
foodInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addFoodBtn.click();
});

// -------------------- Save to localStorage --------------------
function saveMealsSnapshot() {
  const meals = Array.from(mealSection.children).map(card => {
    const name = card.querySelector("strong").textContent;
    const portion = card.querySelector("p:nth-child(2)").textContent.split(" · ")[0];
    const calories = parseFloat(card.querySelector("p:nth-child(2)").textContent.split(" · ")[1]);
    return { name, portion, calories };
  });
  // Save a quick snapshot; full persistence is handled in the main DOMContentLoaded block
  localStorage.setItem("meals", JSON.stringify(meals));
}

// Progress UI is updated via updateProgress() inside the DOMContentLoaded handler.

function resetCalories() {
  // Clear LS for meals and totals
  localStorage.removeItem("mealsFull");
  localStorage.removeItem("meals");
  localStorage.removeItem("totals");
  // Also clear saved calculator stats and inputs
  localStorage.removeItem("nutritionStats");
  localStorage.removeItem("userInputData");
  localStorage.setItem("lastLoggedDate", new Date().toISOString().split('T')[0]);

  // Reset runtime totals
  totalCalories = 0;
  totalMacros = { protein: 0, carbs: 0, fats: 0, fiber: 0 };
  totalMicros = {
    iron: 0, zinc: 0, calcium: 0, vitaminA: 0, vitaminB12: 0,
    vitaminC: 0, vitaminD: 0, omega3: 0, cholesterol: 0, magnesium: 0,
    potassium: 0, sodium: 0, sugar: 0
  };

  // Clear meals UI
  const section = document.getElementById("mealSection");
  if (section) section.innerHTML = "";

  // Reset calculator inputs and result
  const ageEl = document.getElementById("age");
  const genderEl = document.getElementById("gender");
  const heightEl = document.getElementById("height");
  const weightEl = document.getElementById("weight");
  const activityEl = document.getElementById("activity");
  const goalEl = document.getElementById("goal");
  const calcResultEl = document.getElementById("calcResult");
  if (ageEl) ageEl.value = "";
  if (genderEl) genderEl.value = "Male";
  if (heightEl) heightEl.value = "";
  if (weightEl) weightEl.value = "";
  if (activityEl) activityEl.value = "1.2";
  if (goalEl) goalEl.value = "maintain";
  if (calcResultEl) calcResultEl.innerHTML = "";

  // Reset stats UI (macros, micros, BMI, goal)
  const units = { iron: "mg", zinc: "mg", calcium: "mg", vitaminA: "mcg", vitaminB12: "mcg", vitaminC: "mg", vitaminD: "mcg", omega3: "g", magnesium: "mg", potassium: "mg", sodium: "mg", sugar: "g" };
  const statIds = ["proteinText", "carbsText", "fibreText", "fatsText"]; // macros
  document.getElementById("bmiValue") && (document.getElementById("bmiValue").innerText = "0");
  document.getElementById("calorieProgress") && (document.getElementById("calorieProgress").innerText = "0 / 0");
  document.getElementById("goalValue") && (document.getElementById("goalValue").innerText = "");
  const macroDefaults = { proteinText: "0 g / 0 g", carbsText: "0 g / 0 g", fibreText: "0 g / 0 g", fatsText: "0 g / 0 g" };
  statIds.forEach(id => { const el = document.getElementById(id); if (el) el.innerText = macroDefaults[id]; });
  Object.keys(units).forEach(k => {
    const el = document.getElementById(k + "Text");
    if (el) el.innerText = `0 ${units[k]} / 0 ${units[k]}`;
  });

  // Update progress UI
  updateProgress();
}
