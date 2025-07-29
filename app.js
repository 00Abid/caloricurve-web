const firebaseConfig = {
    apiKey: "AIzaSyAT2jy5PQSKKG4Y01m_h_4uIWt9Dhz9rBk",
    authDomain: "caloricurve-web.firebaseapp.com",
    projectId: "caloricurve-web",
    storageBucket: "caloricurve-web.appspot.com",
    messagingSenderId: "269996776796",
    appId: "1:269996776796:web:922a522a6aa687f4c6b599"
};

// Initialize Firebase
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



// Calculator
document.getElementById("calcToggleBtn").onclick = () => {
    document.getElementById("calcWidget").classList.toggle("hidden");
};

function closeCalculator() {
    document.getElementById("calcWidget").classList.add("hidden");
}

function calculateNutrition() {
    const age = +document.getElementById("age").value;
    const gender = document.getElementById("gender").value;
    const height = +document.getElementById("height").value;
    const weight = +document.getElementById("weight").value;
    const activity = +document.getElementById("activity").value;
    const goal = document.getElementById("goal").value;

    let bmr;
    if (gender === "Male") {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
        bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    let tdee = bmr * activity;
    if (goal === "lose") tdee -= 500;
    else if (goal === "gain") tdee += 300;

    const protein = (tdee * 0.2) / 4; // 20% calories from protein
    const carbs = (tdee * 0.5) / 4;   // 50% from carbs
    const fat = (tdee * 0.3) / 9;     // 30% from fats

    const result = `
    Calories: ${Math.round(tdee)} kcal<br>
    Protein: ${Math.round(protein)}g<br>
    Carbs: ${Math.round(carbs)}g<br>
    Fat: ${Math.round(fat)}g
  `;

    document.getElementById("calcResult").innerHTML = result;
    localStorage.setItem("userMacros", JSON.stringify({ tdee, protein, carbs, fat }));
}






























































