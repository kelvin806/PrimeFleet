const form = document.getElementById("loginForm");
const email = document.getElementById("email");
const password = document.getElementById("password");
const rememberMe = document.getElementById("rememberMe");

const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");

const togglePassword = document.getElementById("togglePassword");

/* SHOW / HIDE PASSWORD */
togglePassword.addEventListener("click", () => {
  if (password.type === "password") {
    password.type = "text";
  } else {
    password.type = "password";
  }
});

/* LOAD SAVED EMAIL */
window.addEventListener("load", () => {
  const savedEmail = localStorage.getItem("adminEmail");

  if (savedEmail) {
    email.value = savedEmail;
    rememberMe.checked = true;
  }
});

/* FORM SUBMIT */
form.addEventListener("submit", (e) => {
  e.preventDefault();

  let isValid = true;

  // Reset errors
  emailError.textContent = "";
  passwordError.textContent = "";

  // Validate email
  if (email.value.trim() === "") {
    emailError.textContent = "Email is required";
    isValid = false;
  }

  // Validate password
  if (password.value.trim() === "") {
    passwordError.textContent = "Password is required";
    isValid = false;
  }

  if (!isValid) return;

  // Save email
  if (rememberMe.checked) {
    localStorage.setItem("adminEmail", email.value);
  } else {
    localStorage.removeItem("adminEmail");
  }

  // FAKE LOGIN
  if (email.value === "admin@gmail.com" && password.value === "123456") {
    alert("Login successful!");
    window.location.href = "dashboard.html";
  } else {
    alert("Invalid login details");
  }
});