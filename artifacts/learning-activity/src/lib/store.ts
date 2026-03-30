// Simple wrapper for localStorage interactions to maintain typed keys
export const store = {
  get username() { return localStorage.getItem("la_username"); },
  set username(v: string | null) { v ? localStorage.setItem("la_username", v) : localStorage.removeItem("la_username"); },

  get program() { return localStorage.getItem("la_program"); },
  set program(v: string | null) { v ? localStorage.setItem("la_program", v) : localStorage.removeItem("la_program"); },

  get progress() { return localStorage.getItem("la_progress"); },
  set progress(v: string | null) { v ? localStorage.setItem("la_progress", v) : localStorage.removeItem("la_progress"); },

  get testGroup() { return localStorage.getItem("la_testGroup"); },
  set testGroup(v: string | null) { v ? localStorage.setItem("la_testGroup", v) : localStorage.removeItem("la_testGroup"); },

  clear() {
    localStorage.removeItem("la_username");
    localStorage.removeItem("la_program");
    localStorage.removeItem("la_progress");
    localStorage.removeItem("la_testGroup");
  }
};
