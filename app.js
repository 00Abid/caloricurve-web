// profile Pic code
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

    if (user && user.providerData[0].providerId === "google.com") {
        // Use Google profile picture
        profilePic.src = user.photoURL;
    } else {
        // Use default image from assets
        profilePic.src = "assets/profile.png";
    }
});



// Calculator and Cards Data
document.getElementById("calcToggleBtn").addEventListener("click", () => {
    document.getElementById("calcWidget").classList.toggle("hidden");
});

function closeCalculator() {
    document.getElementById("calcWidget").classList.add("hidden");
}

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

    // Calculate BMR
    let bmr;
    if (gender === "Male") {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
        bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    let calories = bmr * activity;

    // Adjust for goal
    if (goal === "lose") calories -= 500;
    else if (goal === "gain") calories += 500;

    const heightInMeters = height / 100;
    const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);

    document.getElementById("bmiValue").innerText = bmi;
    document.getElementById("calorieProgress").innerText = `0 / ${Math.round(calories)}`;
    document.getElementById("goalValue").innerText = goal.charAt(0).toUpperCase() + goal.slice(1);

    // Macros
    const protein = Math.round(weight * 2); // 2g per kg
    const fats = Math.round((0.8 * weight));
    const carbs = Math.round((calories - (protein * 4 + fats * 9)) / 4);
    const fiber = Math.round(weight * 0.3);

    // Micros - random estimations for demo
    const micronutrients = {
        iron: 18, zinc: 11, calcium: 1000, vitaminA: 900, vitaminB12: 2.4,
        vitaminC: 90, vitaminD: 15, omega3: 1.6, magnesium: 400,
        potassium: 3500, sodium: 1500, sugar: 25
    };

    // Show Result (in calculator panel)
    document.getElementById("calcResult").innerHTML = `
      <p><strong>Calories:</strong> ${Math.round(calories)} kcal</p>
      <p><strong>Protein:</strong> ${protein} g</p>
      <p><strong>Fats:</strong> ${fats} g</p>
      <p><strong>Carbs:</strong> ${carbs} g</p>
      <p><strong>Fibre:</strong> ${fiber} g</p>
    `;

    // Update Macronutrients UI with 0 g / [goal] g format
    document.querySelector(".macro-box:nth-child(1) p").innerText = `0 g / ${protein} g`;
    document.querySelector(".macro-box:nth-child(2) p").innerText = `0 g / ${carbs} g`;
    document.querySelector(".macro-box:nth-child(3) p").innerText = `0 g / ${fiber} g`;
    document.querySelector(".macro-box:nth-child(4) p").innerText = `0 g / ${fats} g`;


    // Update Micronutrients UI with IDs
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


    document.querySelectorAll(".micro-box p").forEach((el, idx) => {
        el.innerText = `0 / ${microGoals[idx]}`;
    });

}


// Store to localStorage
const calculatorData = {
    calories: Math.round(calories),
    protein,
    carbs,
    fats,
    fiber,
    micros: micronutrients,
    bmi: Math.round(weight / ((height / 100) * (height / 100))),
    goal: goal
};

localStorage.setItem("nutritionStats", JSON.stringify(calculatorData));












// DOM Updatation
document.addEventListener("DOMContentLoaded", () => {
    const data = JSON.parse(localStorage.getItem("nutritionStats"));

    if (data) {
        // Update macro
        document.getElementById("proteinText").innerText = `0 g / ${data.protein} g`;
        document.getElementById("carbsText").innerText = `0 g / ${data.carbs} g`;
        document.getElementById("fiberText").innerText = `0 g / ${data.fiber} g`;
        document.getElementById("fatsText").innerText = `0 g / ${data.fats} g`;

        // Update micros
        document.getElementById("ironText").innerText = `0 mg / ${data.micros.iron} mg`;
        document.getElementById("zincText").innerText = `0 mg / ${data.micros.zinc} mg`;
        document.getElementById("calciumText").innerText = `0 mg / ${data.micros.calcium} mg`;
        document.getElementById("vitaminAText").innerText = `0 mcg / ${data.micros.vitaminA} mcg`;
        document.getElementById("vitaminB12Text").innerText = `0 mcg / ${data.micros.vitaminB12} mcg`;
        document.getElementById("vitaminCText").innerText = `0 mcg / ${data.micros.vitaminC} mcg`;
        document.getElementById("vitaminDText").innerText = `0 mcg / ${data.micros.vitaminD} mcg`;
        document.getElementById("omega3Text").innerText = `0 g / ${data.micros.omega3} g`;
        document.getElementById("magnesiumText").innerText = `0 mg / ${data.micros.magnesium} mg`;
        document.getElementById("potassiumText").innerText = `0 mg / ${data.micros.potassium} mg`;
        document.getElementById("sodiumText").innerText = `0 mg / ${data.micros.sodium} mg`;
        document.getElementById("sugarText").innerText = `0 g / ${data.micros.sugar} g`;

        // Update Stats Section
        document.querySelector(".stats-box:nth-child(1) h2").innerText = data.bmi;
        document.querySelector(".stats-box:nth-child(2) h2").innerText = `0 / ${data.calories}`;
        document.querySelector(".stats-box:nth-child(3) h2").innerText = data.goal;
    }
});
