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
        : "assets/profile.png";
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
    // Clear localStorage
    localStorage.removeItem("nutritionStats");
    localStorage.removeItem("userInputData");

    // Clear input fields
    document.getElementById("age").value = "";
    document.getElementById("gender").value = "Male";
    document.getElementById("height").value = "";
    document.getElementById("weight").value = "";
    document.getElementById("activity").value = "1.2";
    document.getElementById("goal").value = "maintain";

    // Reset stat values
    document.getElementById("bmiValue").innerText = "0";
    document.getElementById("calorieProgress").innerText = "0 / 0";
    document.getElementById("goalValue").innerText = "Goal";

    // Reset macro display
    document.getElementById("proteinText").innerText = `0 g / 0 g`;
    document.getElementById("carbsText").innerText = `0 g / 0 g`;
    document.getElementById("fibreText").innerText = `0 g / 0 g`;
    document.getElementById("fatsText").innerText = `0 g / 0 g`;

    // Reset micro display
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
}

// Searching Foods
let indianFoods = [];

fetch("assets/indianfoods.json")
    .then(res => res.json())
    .then(data => {
        indianFoods = data;
    })
    .catch(err => console.error("Failed to load food data:", err));

document.querySelector(".add-food-btn").addEventListener("click", () => {
    const input = document.querySelector(".search-input").value.trim().toLowerCase();
    if (!input || indianFoods.length === 0) return;

    const match = indianFoods.find(food => food.name.toLowerCase() === input);
    if (!match) {
        alert("Food not found!");
        return;
    }

    // Create meal block
    const mealSection = document.getElementById("mealSection");
    const mealDiv = document.createElement("div");
    mealDiv.classList.add("meal");

    // Create meal content
    mealDiv.innerHTML = `
    <p>${match.name}</p>
    <span class="meal-info">${match.calories} kcal · ${match.portion}</span>
    <button class="remove-meal">✖</button>
  `;

    // Append to DOM
    mealSection.appendChild(mealDiv);

    // Save data to the element for tracking
    mealDiv.dataset.calories = match.calories;
    mealDiv.dataset.protein = match.protein;
    mealDiv.dataset.carbs = match.carbs;
    mealDiv.dataset.fats = match.fat;
    mealDiv.dataset.fiber = match.fiber;

    // Update totals
    updateStatsFromMeals();
});

// Handle meal removal
document.getElementById("mealSection").addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-meal")) {
        e.target.parentElement.remove();
        updateStatsFromMeals();
    }
});

function updateStatsFromMeals() {
    const meals = document.querySelectorAll(".meal-section .meal");
    let totalCalories = 0, protein = 0, carbs = 0, fats = 0, fiber = 0;

    meals.forEach(meal => {
        totalCalories += Number(meal.dataset.calories || 0);
        protein += Number(meal.dataset.protein || 0);
        carbs += Number(meal.dataset.carbs || 0);
        fats += Number(meal.dataset.fats || 0);
        fiber += Number(meal.dataset.fiber || 0);
    });

    // Read target goals from localStorage
    const saved = JSON.parse(localStorage.getItem("nutritionStats")) || {};

    document.getElementById("calorieProgress").innerText = `${totalCalories} / ${saved.calories || 0}`;

    document.getElementById("proteinText").innerText = `${protein} g / ${saved.protein || 0} g`;
    document.getElementById("carbsText").innerText = `${carbs} g / ${saved.carbs || 0} g`;
    document.getElementById("fibreText").innerText = `${fiber} g / ${saved.fiber || 0} g`;
    document.getElementById("fatsText").innerText = `${fats} g / ${saved.fats || 0} g`;
}
