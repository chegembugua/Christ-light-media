// Public Supabase project settings. Never place service-role keys in frontend code.
const SUPABASE_URL = "https://kbuwignrgxlzcszriyqh.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_b2cv8iiGHvtvquh9zkyWBQ_68VSypyn";
const DASHBOARD_URL = "https://christlightmedia.live/dashboard.html";

// The CDN exposes the official v2 client as window.supabase.
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// Cache DOM references once so handlers stay small and readable.
const signinForm = document.querySelector("#signin-form");
const signupForm = document.querySelector("#signup-form");
const signinTab = document.querySelector("#signin-tab");
const signupTab = document.querySelector("#signup-tab");
const modeToggle = document.querySelector(".mode-toggle");
const title = document.querySelector("#auth-title");
const subtitle = document.querySelector("#auth-subtitle");
const alertRegion = document.querySelector("#alert-region");

// View metadata powers the animated tab switch and heading copy.
const views = {
  signin: {
    form: signinForm,
    tab: signinTab,
    title: "Welcome back",
    subtitle: "Sign in to continue to your ministry dashboard."
  },
  signup: {
    form: signupForm,
    tab: signupTab,
    title: "Create your account",
    subtitle: "Join In For Christ Media and confirm your email to get started."
  }
};

// Switch between forms while keeping ARIA tab state in sync.
function setMode(mode) {
  const isSignup = mode === "signup";

  Object.entries(views).forEach(([key, view]) => {
    const active = key === mode;
    view.form.hidden = !active;
    view.form.classList.toggle("active", active);
    view.tab.classList.toggle("active", active);
    view.tab.setAttribute("aria-selected", String(active));
  });

  modeToggle.classList.toggle("signup", isSignup);
  title.textContent = views[mode].title;
  subtitle.textContent = views[mode].subtitle;
  clearAllMessages();
}

// Render success/error alerts with textContent so user-controlled text is never parsed as HTML.
function showAlert(message, type = "success") {
  alertRegion.innerHTML = "";

  if (!message) {
    return;
  }

  const alert = document.createElement("p");
  alert.className = `alert ${type}`;
  alert.textContent = message;
  alertRegion.appendChild(alert);
}

// Field-level errors appear directly under each input and mark the input invalid.
function setFieldError(inputId, message) {
  const input = document.querySelector(`#${inputId}`);
  const error = document.querySelector(`#${inputId}-error`);

  input.setAttribute("aria-invalid", message ? "true" : "false");
  error.textContent = message;
}

// Form-level errors are used for Supabase responses such as invalid credentials.
function setFormError(formId, message) {
  document.querySelector(`#${formId}-global-error`).textContent = message;
}

// Clear messages before validation/submission so stale errors do not linger.
function clearFormMessages(form) {
  form.querySelectorAll("input").forEach((input) => {
    input.setAttribute("aria-invalid", "false");
  });

  form.querySelectorAll(".field-error, .form-error").forEach((message) => {
    message.textContent = "";
  });
}

function clearAllMessages() {
  clearFormMessages(signinForm);
  clearFormMessages(signupForm);
  showAlert("");
}

// Lightweight client-side email check. Supabase still performs authoritative validation.
function validateEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

// Convert technical backend messages into friendlier, user-facing language.
function friendlyAuthError(error) {
  const message = typeof error === "string" ? error : error?.message;
  const status = typeof error === "object" ? error?.status : null;
  const normalized = String(message || "").toLowerCase();

  if (normalized.includes("invalid login credentials")) {
    return "The email or password you entered is not correct.";
  }

  if (normalized.includes("email not confirmed")) {
    return "Please confirm your email address before signing in.";
  }

  if (normalized.includes("password")) {
    return "Please enter a valid password that meets the security requirements.";
  }

  if (status === 429 || normalized.includes("rate limit") || normalized.includes("too many")) {
    return "Too many attempts. Please wait a moment and try again.";
  }

  return message || "Something went wrong. Please try again.";
}

// Disable submit buttons during network requests to prevent duplicate submissions.
function setButtonLoading(button, loadingText, isLoading) {
  if (!button.dataset.defaultText) {
    button.dataset.defaultText = button.textContent.trim();
  }

  button.disabled = isLoading;
  button.textContent = isLoading ? loadingText : button.dataset.defaultText;
}

signinTab.addEventListener("click", () => setMode("signin"));
signupTab.addEventListener("click", () => setMode("signup"));

// Sign in existing users, then redirect to the live dashboard on success.
signinForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearFormMessages(signinForm);
  showAlert("");

  const email = document.querySelector("#signin-email").value.trim();
  const password = document.querySelector("#signin-password").value;
  const submitButton = document.querySelector("#signin-submit");
  let hasError = false;

  if (!validateEmail(email)) {
    setFieldError("signin-email", "Enter a valid email address.");
    hasError = true;
  }

  if (!password) {
    setFieldError("signin-password", "Enter your password.");
    hasError = true;
  }

  if (hasError) {
    return;
  }

  setButtonLoading(submitButton, "Signing in...", true);

  try {
    const { error } = await supabaseClient.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      setFormError("signin", friendlyAuthError(error));
      return;
    }

    window.location.assign(DASHBOARD_URL);
  } catch (error) {
    setFormError("signin", friendlyAuthError(error));
  } finally {
    setButtonLoading(submitButton, "", false);
  }
});

// Create a new Supabase auth user and ask them to confirm by email.
signupForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearFormMessages(signupForm);
  showAlert("");

  const email = document.querySelector("#signup-email").value.trim();
  const password = document.querySelector("#signup-password").value;
  const submitButton = document.querySelector("#signup-submit");
  let hasError = false;

  if (!validateEmail(email)) {
    setFieldError("signup-email", "Enter a valid email address.");
    hasError = true;
  }

  if (password.length < 6) {
    setFieldError("signup-password", "Use at least 6 characters for your password.");
    hasError = true;
  }

  if (hasError) {
    return;
  }

  setButtonLoading(submitButton, "Creating account...", true);

  try {
    const { error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: DASHBOARD_URL
      }
    });

    if (error) {
      setFormError("signup", friendlyAuthError(error));
      return;
    }

    signupForm.reset();
    showAlert("Account created. Please check your email inbox for the confirmation link from In For Christ Media.", "success");
  } catch (error) {
    setFormError("signup", friendlyAuthError(error));
  } finally {
    setButtonLoading(submitButton, "", false);
  }
});

// Session tracking hook requested for monitoring auth state transitions.
supabaseClient.auth.onAuthStateChange((event, session) => {
  console.log("Supabase auth state changed:", {
    event,
    userId: session?.user?.id || null
  });
});
