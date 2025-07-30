// === Firebase Auth Profile Picture ===
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


// === Calculator Panel Toggle ===
document.getElementById("calcToggleBtn").addEventListener("click", () => {
    document.getElementById("calcWidget").classList.toggle("hidden");
});
function closeCalculator() {
    document.getElementById("calcWidget").classList.add("hidden");
}


// === Nutrition Calculator ===
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

    // === BMR & Calorie Calculation ===
    let bmr = gender === "Male"
        ? 10 * weight + 6.25 * height - 5 * age + 5
        : 10 * weight + 6.25 * height - 5 * age - 161;

    let calories = bmr * activity;
    if (goal === "lose") calories -= 500;
    else if (goal === "gain") calories += 500;

    const heightM = height / 100;
    const bmi = (weight / (heightM * heightM)).toFixed(1);

    // === Macros Calculation ===
    const protein = Math.round(weight * 2);
    const fats = Math.round(weight * 0.8);
    const carbs = Math.round((calories - (protein * 4 + fats * 9)) / 4);
    const fiber = Math.round(weight * 0.3);

    // === Micros (fixed for demo) ===
    const micronutrients = {
        iron: 18, zinc: 11, calcium: 1000, vitaminA: 900, vitaminB12: 2.4,
        vitaminC: 90, vitaminD: 15, omega3: 1.6, magnesium: 400,
        potassium: 3500, sodium: 1500, sugar: 25
    };

    // === Update UI Cards ===
    document.getElementById("bmiValue").innerText = bmi;
    document.getElementById("calorieProgress").innerText = `0 / ${Math.round(calories)}`;
    document.getElementById("goalValue").innerText = goal.charAt(0).toUpperCase() + goal.slice(1);

    // Macros UI
    document.getElementById("proteinText").innerText = `0 g / ${protein} g`;
    document.getElementById("carbsText").innerText = `0 g / ${carbs} g`;
    document.getElementById("fibreText").innerText = `0 g / ${fiber} g`;
    document.getElementById("fatsText").innerText = `0 g / ${fats} g`;

    // Micros UI
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

    // === Show Result (Calculator Panel) ===
    document.getElementById("calcResult").innerHTML = `
    <p><strong>Calories:</strong> ${Math.round(calories)} kcal</p>
    <p><strong>Protein:</strong> ${protein} g</p>
    <p><strong>Fats:</strong> ${fats} g</p>
    <p><strong>Carbs:</strong> ${carbs} g</p>
    <p><strong>Fibre:</strong> ${fiber} g</p>
  `;

    // === Save to localStorage ===
    const stats = {
        bmi: parseFloat(bmi),
        calories: Math.round(calories),
        protein,
        carbs,
        fats,
        fiber,
        micros: micronutrients
    };
    localStorage.setItem("nutritionStats", JSON.stringify(stats));
    console.log("✅ Saved to localStorage", stats);
}


// === On Page Load: Restore from localStorage ===
document.addEventListener("DOMContentLoaded", () => {
    const stats = JSON.parse(localStorage.getItem("nutritionStats"));
    if (!stats || !stats.micros) return;

    document.getElementById("bmiValue").innerText = stats.bmi;
    document.getElementById("calorieProgress").innerText = `0 / ${stats.calories}`;
    document.getElementById("goalValue").innerText = savedInput?.goal || "Goal";


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
});
