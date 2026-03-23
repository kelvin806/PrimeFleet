const form = document.getElementById("loginForm");
const email = document.getElementById("email");
const password = document.getElementById("password");
const rememberMe = document.getElementById("rememberMe");

const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const generalError = document.getElementById("generalError");
const loginBtn = document.getElementById("loginBtn");

const togglePassword = document.getElementById("togglePassword");

const LOGIN_API = "https://primefleet-mvp.onrender.com/api/v1/auth/login";

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

/* SHOW ERROR MESSAGE */
const showError = (message) => {
  generalError.textContent = message;
  generalError.style.display = "block";
  setTimeout(() => {
    generalError.style.display = "none";
  }, 5000);
};

/* SET LOADING STATE */
const setLoading = (isLoading) => {
  loginBtn.disabled = isLoading;
  loginBtn.textContent = isLoading ? "Logging in..." : "Login";
};

/* FORM SUBMIT */
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  let isValid = true;

  // Reset all errors
  emailError.textContent = "";
  passwordError.textContent = "";
  generalError.style.display = "none";

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

  setLoading(true);

  try {
    const response = await fetch(LOGIN_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.value.trim(),
        password: password.value,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle API errors
      const errorMessage =
        data.message || data.error || "Login failed. Please try again.";
      showError(errorMessage);
      setLoading(false);
      return;
    }

    // Save email if remember me is checked
    if (rememberMe.checked) {
      localStorage.setItem("adminEmail", email.value);
    } else {
      localStorage.removeItem("adminEmail");
    }

    // Save token if provided
    if (data.token) {
      localStorage.setItem("adminToken", data.token);
    }

    // Redirect to dashboard
    showError("Login successful! Redirecting...");
    setTimeout(() => {
      window.location.href = "../../admin-booking-section/admin-booking.html";
    }, 1000);
  } catch (error) {
    console.error("Login error:", error);
    showError("Network error. Please check your connection and try again.");
    setLoading(false);
  }
});
