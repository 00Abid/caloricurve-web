// For Current year in footer
let footerText = document.querySelector('.footer-text');
footerText.textContent = "© " + new Date().getFullYear() + " CaloriCurve by Abid Khan";


// For Downloading APK
document.querySelector('#download-apk').onclick = function () {
  window.location.href = 'assets/CaloriCurve.apk';
};
