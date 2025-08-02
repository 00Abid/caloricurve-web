// Firebase profile pic logic
const firebaseConfig = {
  apiKey: "AIzaSyAT2jy5PQSKKG4Y01m_h_4uIWt9Dhz9rBk",
  authDomain: "caloricurve-web.firebaseapp.com",
  projectId: "caloricurve-web",
  storageBucket: "caloricurve-web.appspot.com",
  messagingSenderId: "269996776796",
  appId: "1:269996776796:web:922a522a6aa687f4c6b599"
};
firebase.initializeApp(firebaseConfig);
firebase.auth().onAuthStateChanged(function (user) {
  const profilePic = document.getElementById("profilePic");
  profilePic.src = (user && user.providerData[0].providerId === "google.com")
    ? user.photoURL
    : "profile.png";
});



// Calculator toggle
document.getElementById("calcToggleBtn").addEventListener("click", () => {
  document.getElementById("calcWidget").classList.toggle("hidden");
});
function closeCalculator() {
  document.getElementById("calcWidget").classList.add("hidden");
}

// Nutrition calculator
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

  // BMR and calorie calculation
  const bmr = gender === "Male"
    ? 10 * weight + 6.25 * height - 5 * age + 5
    : 10 * weight + 6.25 * height - 5 * age - 161;

  let calories = bmr * activity;
  if (goal === "lose") calories -= 500;
  else if (goal === "gain") calories += 500;

  const heightInMeters = height / 100;
  const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);

  // Macros
  const protein = Math.round(weight * 2);
  const fats = Math.round(0.8 * weight);
  const carbs = Math.round((calories - (protein * 4 + fats * 9)) / 4);
  const fiber = Math.round(weight * 0.3);

  // Micros (static for now)
  const micronutrients = {
    iron: 18, zinc: 11, calcium: 1000, vitaminA: 900, vitaminB12: 2.4,
    vitaminC: 90, vitaminD: 15, omega3: 1.6, magnesium: 400,
    potassium: 3500, sodium: 1500, sugar: 25
  };

  // Calculator panel
  document.getElementById("calcResult").innerHTML = `
      <p><strong>Calories:</strong> ${Math.round(calories)} kcal</p>
      <p><strong>Protein:</strong> ${protein} g</p>
      <p><strong>Fats:</strong> ${fats} g</p>
      <p><strong>Carbs:</strong> ${carbs} g</p>
      <p><strong>Fibre:</strong> ${fiber} g</p>
    `;

  // Update stat cards
  document.getElementById("bmiValue").innerText = bmi;
  document.getElementById("calorieProgress").innerText = `0 / ${Math.round(calories)}`;
  document.getElementById("goalValue").innerText = goal.charAt(0).toUpperCase() + goal.slice(1);

  // Update macro UI
  document.getElementById("proteinText").innerText = `0 g / ${protein} g`;
  document.getElementById("carbsText").innerText = `0 g / ${carbs} g`;
  document.getElementById("fibreText").innerText = `0 g / ${fiber} g`;
  document.getElementById("fatsText").innerText = `0 g / ${fats} g`;

  // Update micro UI
  document.getElementById("ironText").innerText = `0 mg / ${micronutrients.iron} mg`;
  document.getElementById("zincText").innerText = `0 mg / ${micronutrients.zinc} mg`;
  document.getElementById("calciumText").innerText = `0 mg / ${micronutrients.calcium} mg`;
  document.getElementById("vitaminAText").innerText = `0 mcg / ${micronutrients.vitaminA} mcg`;
  document.getElementById("vitaminB12Text").innerText = `0 mcg / ${micronutrients.vitaminB12} mcg`;
  document.getElementById("vitaminCText").innerText = `0 mg / ${micronutrients.vitaminC} mg`;
  document.getElementById("vitaminDText").innerText = `0 mcg / ${micronutrients.vitaminD} mcg`;
  document.getElementById("omega3Text").innerText = `0 g / ${micronutrients.omega3} g`;
  document.getElementById("magnesiumText").innerText = `0 mg / ${micronutrients.magnesium} mg`;
  document.getElementById("potassiumText").innerText = `0 mg / ${micronutrients.potassium} mg`;
  document.getElementById("sodiumText").innerText = `0 mg / ${micronutrients.sodium} mg`;
  document.getElementById("sugarText").innerText = `0 g / ${micronutrients.sugar} g`;



  // Save to localStorage
  const stats = {
    bmi: parseFloat(bmi),
    calories: Math.round(calories),
    protein, carbs, fats, fiber,
    micros: micronutrients
  };
  localStorage.setItem("nutritionStats", JSON.stringify(stats));
  localStorage.setItem("userInputData", JSON.stringify({
    age, gender, height, weight, activity, goal
  }));
}

document.addEventListener("DOMContentLoaded", () => {
  const stats = JSON.parse(localStorage.getItem("nutritionStats"));
  const inputData = JSON.parse(localStorage.getItem("userInputData"));

  // Restore input fields
  if (inputData) {
    document.getElementById("age").value = inputData.age;
    document.getElementById("gender").value = inputData.gender;
    document.getElementById("height").value = inputData.height;
    document.getElementById("weight").value = inputData.weight;
    document.getElementById("activity").value = inputData.activity;
    document.getElementById("goal").value = inputData.goal;
  }

  if (stats && stats.micros) {
    document.getElementById("bmiValue").innerText = stats.bmi;
    document.getElementById("calorieProgress").innerText = `0 / ${stats.calories}`;
    document.getElementById("goalValue").innerText = inputData?.goal || "Goal";

    // Macros
    document.getElementById("proteinText").innerText = `0 g / ${stats.protein} g`;
    document.getElementById("carbsText").innerText = `0 g / ${stats.carbs} g`;
    document.getElementById("fibreText").innerText = `0 g / ${stats.fiber} g`;
    document.getElementById("fatsText").innerText = `0 g / ${stats.fats} g`;

    // Micros
    const m = stats.micros;
    document.getElementById("ironText").innerText = `0 mg / ${m.iron} mg`;
    document.getElementById("zincText").innerText = `0 mg / ${m.zinc} mg`;
    document.getElementById("calciumText").innerText = `0 mg / ${m.calcium} mg`;
    document.getElementById("vitaminAText").innerText = `0 mcg / ${m.vitaminA} mcg`;
    document.getElementById("vitaminB12Text").innerText = `0 mcg / ${m.vitaminB12} mcg`;
    document.getElementById("vitaminCText").innerText = `0 mg / ${m.vitaminC} mg`;
    document.getElementById("vitaminDText").innerText = `0 mcg / ${m.vitaminD} mcg`;
    document.getElementById("omega3Text").innerText = `0 g / ${m.omega3} g`;
    document.getElementById("magnesiumText").innerText = `0 mg / ${m.magnesium} mg`;
    document.getElementById("potassiumText").innerText = `0 mg / ${m.potassium} mg`;
    document.getElementById("sodiumText").innerText = `0 mg / ${m.sodium} mg`;
    document.getElementById("sugarText").innerText = `0 g / ${m.sugar} g`;
  }
});



// For Reset
function resetCalories() {
  // Clear all localStorage data
  localStorage.removeItem("nutritionStats");
  localStorage.removeItem("userInputData");
  localStorage.removeItem("loggedFoods");

  // Clear input fields
  document.getElementById("age").value = "";
  document.getElementById("gender").value = "Male";
  document.getElementById("height").value = "";
  document.getElementById("weight").value = "";
  document.getElementById("activity").value = "1.2";
  document.getElementById("goal").value = "maintain";

  // Reset display values
  document.getElementById("bmiValue").innerText = "0";
  document.getElementById("calorieProgress").innerText = "0 / 0";
  document.getElementById("goalValue").innerText = "Goal";

  document.getElementById("proteinText").innerText = `0 g / 0 g`;
  document.getElementById("carbsText").innerText = `0 g / 0 g`;
  document.getElementById("fibreText").innerText = `0 g / 0 g`;
  document.getElementById("fatsText").innerText = `0 g / 0 g`;

  const microIds = [
    "ironText", "zincText", "calciumText", "vitaminAText", "vitaminB12Text",
    "vitaminCText", "vitaminDText", "omega3Text", "magnesiumText",
    "potassiumText", "sodiumText", "sugarText"
  ];

  microIds.forEach(id => {
    const unit = document.getElementById(id).innerText.includes("mcg") ? "mcg"
      : document.getElementById(id).innerText.includes("g") ? "g"
        : "mg";
    document.getElementById(id).innerText = `0 ${unit} / 0 ${unit}`;
  });

  // Clear all meals visually from UI
  document.getElementById("mealSection").innerHTML = "";

  // Reset internal macro/micro/calorie counters
  totalCalories = 0;
  totalMacros = { protein: 0, carbs: 0, fats: 0, fiber: 0 };
  totalMicros = {
    iron: 0, zinc: 0, calcium: 0, vitaminA: 0, vitaminB12: 0,
    vitaminC: 0, vitaminD: 0, omega3: 0, magnesium: 0,
    potassium: 0, sodium: 0, sugar: 0
  };
}




// Searching of foods
const foodInput = document.querySelector(".search-input");
const addFoodBtn = document.querySelector(".add-food-btn");
const mealSection = document.getElementById("mealSection");

let foodData = [];
let totalMacros = { protein: 0, carbs: 0, fats: 0, fiber: 0 };
let totalMicros = {
  iron: 0, zinc: 0, calcium: 0, vitaminA: 0, vitaminB12: 0,
  vitaminC: 0, vitaminD: 0, omega3: 0, magnesium: 0,
  potassium: 0, sodium: 0, sugar: 0
};
let totalCalories = 0;

const goalStats = JSON.parse(localStorage.getItem("nutritionStats") || "{}");

function updateProgress() {
  document.getElementById("proteinText").innerText = `${totalMacros.protein} g / ${goalStats.protein || 0} g`;
  document.getElementById("carbsText").innerText = `${totalMacros.carbs} g / ${goalStats.carbs || 0} g`;
  document.getElementById("fatsText").innerText = `${totalMacros.fats} g / ${goalStats.fats || 0} g`;
  document.getElementById("fibreText").innerText = `${totalMacros.fiber} g / ${goalStats.fiber || 0} g`;
  document.getElementById("calorieProgress").innerText = `${totalCalories} / ${goalStats.calories || 0}`;

  const m = goalStats.micros || {};
  const units = {
    iron: "mg", zinc: "mg", calcium: "mg", vitaminA: "mcg", vitaminB12: "mcg",
    vitaminC: "mg", vitaminD: "mcg", omega3: "g", magnesium: "mg",
    potassium: "mg", sodium: "mg", sugar: "g"
  };

  for (const key in totalMicros) {
    const el = document.getElementById(`${key}Text`);
    if (el && m[key] !== undefined) {
      el.innerText = `${totalMicros[key]} ${units[key]} / ${m[key]} ${units[key]}`;
    }
  }
}

function createMealBlock(food) {
  const meal = document.createElement("div");
  meal.className = "meal";
  meal.innerHTML = `
    <p>${food.name}</p>
    <span class="meal-info">${food.portion} · ${food.calories} kcal</span>
    <button class="delete-meal">×</button>
  `;
  mealSection.appendChild(meal);

  totalCalories += food.calories;
  totalMacros.protein += food.protein;
  totalMacros.carbs += food.carbs;
  totalMacros.fats += food.fats;
  totalMacros.fiber += food.fiber;

  for (const key in totalMicros) {
    totalMicros[key] += food[key] || 0;
  }

  updateProgress();

  meal.querySelector(".delete-meal").addEventListener("click", () => {
    meal.remove();
    totalCalories -= food.calories;
    totalMacros.protein -= food.protein;
    totalMacros.carbs -= food.carbs;
    totalMacros.fats -= food.fats;
    totalMacros.fiber -= food.fiber;
    for (const key in totalMicros) {
      totalMicros[key] -= food[key] || 0;
    }
    updateProgress();

    const logs = JSON.parse(localStorage.getItem("loggedFoods") || "[]");
    const index = logs.findIndex(x => x.name === food.name);
    if (index > -1) {
      logs.splice(index, 1);
      localStorage.setItem("loggedFoods", JSON.stringify(logs));
    }
  });
}

async function loadFoodData() {
  const res = await fetch("/indianFoods.json");
  foodData = await res.json();
}

function showSuggestions(query) {
  const suggestions = document.getElementById("suggestions");
  suggestions.innerHTML = "";

  const matches = foodData
    .map(f => f.name)
    .filter(name => name.toLowerCase().startsWith(query.toLowerCase()))
    .slice(0, 5);

  matches.forEach(match => {
    const div = document.createElement("div");
    div.className = "suggestion-item";
    div.innerText = match;
    div.onclick = () => {
      foodInput.value = match;
      suggestions.innerHTML = "";
    };
    suggestions.appendChild(div);
  });
}

// Add food
addFoodBtn.addEventListener("click", () => {
  const query = foodInput.value.trim().toLowerCase();
  const food = foodData.find(f => f.name.toLowerCase() === query);

  if (!food) return alert("Food not found!");

  createMealBlock(food);

  const logs = JSON.parse(localStorage.getItem("loggedFoods") || "[]");
  logs.push(food);
  localStorage.setItem("loggedFoods", JSON.stringify(logs));

  foodInput.value = "";
  document.getElementById("suggestions").innerHTML = "";
});

// Suggest as you type
foodInput.addEventListener("input", (e) => {
  showSuggestions(e.target.value);
});

// Load on page
document.addEventListener("DOMContentLoaded", async () => {
  await loadFoodData();
  const saved = JSON.parse(localStorage.getItem("loggedFoods") || "[]");
  saved.forEach(createMealBlock);
});


// Auto reset on new day
function isNewDay() {
  const today = new Date().toISOString().split('T')[0]; // e.g. "2025-08-01"
  const lastDate = localStorage.getItem("lastLoggedDate");
  return today !== lastDate;
}

function resetDayIfNeeded() {
  if (isNewDay()) {
    // Clear only food logs
    localStorage.removeItem("loggedFoods");
    localStorage.setItem("lastLoggedDate", new Date().toISOString().split('T')[0]);

    // Reset macro/micro totals
    totalMacros = { protein: 0, carbs: 0, fats: 0, fiber: 0 };
    totalMicros = {
      iron: 0, zinc: 0, calcium: 0, vitaminA: 0, vitaminB12: 0,
      vitaminC: 0, vitaminD: 0, omega3: 0, magnesium: 0,
      potassium: 0, sodium: 0, sugar: 0
    };

    // Clear meal section from UI
    document.getElementById("mealSection").innerHTML = "";

    // Reset UI progress
    updateProgress();
  }
}


document.addEventListener("DOMContentLoaded", () => {
  resetDayIfNeeded(); // 👈 add this first

  // Load old meals (if any left from same day)
  const saved = JSON.parse(localStorage.getItem("loggedFoods") || "[]");
  saved.forEach(food => createMealBlock(food));
});
