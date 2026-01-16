class EmployeePayrollData {
  constructor() {
    this._name = "";
    this._profilePic = "";
    this._gender = "";
    this._departments = [];
    this._salary = 0;
    this._startDate = null;
    this._notes = "";
  }

  set name(value) {
    const nameRegex = /^[A-Z][a-zA-Z]{2,}( [A-Z][a-zA-Z]{2,})*$/;
    if (!nameRegex.test(value.trim())) {
      throw new Error("Name must start with Capital and have minimum 3 characters");
    }
    this._name = value.trim();
  }

  get name() {
    return this._name;
  }

  set profilePic(value) {
    if (!value) throw new Error("Please select a profile image");
    this._profilePic = value;
  }

  get profilePic() {
    return this._profilePic;
  }

  set gender(value) {
    if (!value) throw new Error("Please select gender");
    this._gender = value;
  }

  get gender() {
    return this._gender;
  }

  set departments(value) {
    if (!Array.isArray(value) || value.length === 0) {
      throw new Error("Select at least one department");
    }
    this._departments = value;
  }

  get departments() {
    return this._departments;
  }

  set salary(value) {
    const salaryNum = Number(value);
    if (Number.isNaN(salaryNum) || salaryNum < 10000) {
      throw new Error("Salary must be valid and minimum ₹10000");
    }
    this._salary = salaryNum;
  }

  get salary() {
    return this._salary;
  }

  set startDate(dateObj) {
    if (!(dateObj instanceof Date) || Number.isNaN(dateObj.getTime())) {
      throw new Error("Please select a valid start date");
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selected = new Date(dateObj);
    selected.setHours(0, 0, 0, 0);

    if (selected > today) {
      throw new Error("Start Date cannot be future date");
    }

    const diffTime = today.getTime() - selected.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 30) {
      throw new Error("Start Date should be within 30 days of joining");
    }

    this._startDate = selected;
  }

  get startDate() {
    return this._startDate;
  }

  set notes(value) {
    const trimmed = value.trim();
    if (trimmed.length < 5) throw new Error("Notes must have at least 5 characters");
    this._notes = trimmed;
  }

  get notes() {
    return this._notes;
  }
}

const STORAGE_KEY = "employeePayrollList";
const EDIT_KEY = "editEmployeeIndex";

const salaryRange = document.getElementById("salary");
const salaryValue = document.getElementById("salaryValue");

const daySelect = document.getElementById("day");
const monthSelect = document.getElementById("month");
const yearSelect = document.getElementById("year");

const form = document.getElementById("payrollForm");

const nameInput = document.getElementById("name");
const notesInput = document.getElementById("notes");

const nameError = document.getElementById("nameError");
const notesError = document.getElementById("notesError");
const dateError = document.getElementById("dateError");
const successText = document.getElementById("successText");

const clearMessages = () => {
  nameError.textContent = "";
  notesError.textContent = "";
  dateError.textContent = "";
  successText.textContent = "";
};

salaryValue.textContent = salaryRange.value;

salaryRange.addEventListener("input", (e) => {
  salaryValue.textContent = e.target.value;
});

daySelect.innerHTML = `<option value="">Day</option>`;
for (let d = 1; d <= 31; d++) {
  const dd = String(d).padStart(2, "0");
  daySelect.innerHTML += `<option value="${dd}">${d}</option>`;
}

yearSelect.innerHTML = `<option value="">Year</option>`;
const currentYear = new Date().getFullYear();
for (let y = currentYear; y >= currentYear - 30; y--) {
  yearSelect.innerHTML += `<option value="${y}">${y}</option>`;
}

nameInput.addEventListener("input", () => {
  try {
    const temp = new EmployeePayrollData();
    temp.name = nameInput.value;
    nameError.textContent = "";
  } catch (e) {
    nameError.textContent = e.message;
  }
});

notesInput.addEventListener("input", () => {
  try {
    const temp = new EmployeePayrollData();
    temp.notes = notesInput.value;
    notesError.textContent = "";
  } catch (e) {
    notesError.textContent = e.message;
  }
});

const validateStartDateLive = () => {
  try {
    const day = daySelect.value;
    const month = monthSelect.value;
    const year = yearSelect.value;

    if (!day || !month || !year) {
      dateError.textContent = "";
      return;
    }

    const dateObj = new Date(`${year}-${month}-${day}`);
    const temp = new EmployeePayrollData();
    temp.startDate = dateObj;

    dateError.textContent = "";
  } catch (e) {
    dateError.textContent = e.message;
  }
};

daySelect.addEventListener("change", validateStartDateLive);
monthSelect.addEventListener("change", validateStartDateLive);
yearSelect.addEventListener("change", validateStartDateLive);

form.addEventListener("reset", () => {
  salaryValue.textContent = salaryRange.value;
  clearMessages();
  localStorage.removeItem(EDIT_KEY);
});

const fillFormForEdit = () => {
  const editIndex = localStorage.getItem(EDIT_KEY);
  if (editIndex === null) return;

  const list = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  const emp = list[Number(editIndex)];
  if (!emp) return;

  nameInput.value = emp.name;

  const profileRadio = document.querySelector(`input[name="profile"][value="${emp.profilePic}"]`);
  if (profileRadio) profileRadio.checked = true;

  const genderRadio = document.querySelector(`input[name="gender"][value="${emp.gender}"]`);
  if (genderRadio) genderRadio.checked = true;

  document.querySelectorAll(`input[name="department"]`).forEach(cb => cb.checked = false);
  emp.departments.forEach(dep => {
    const deptBox = document.querySelector(`input[name="department"][value="${dep}"]`);
    if (deptBox) deptBox.checked = true;
  });

  salaryRange.value = emp.salary;
  salaryValue.textContent = emp.salary;

  const date = new Date(emp.startDate);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear());

  daySelect.value = day;
  monthSelect.value = month;
  yearSelect.value = year;

  notesInput.value = emp.notes;
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  clearMessages();

  try {
    const empPayroll = new EmployeePayrollData();

    empPayroll.name = nameInput.value;

    const selectedProfile = document.querySelector("input[name='profile']:checked");
    empPayroll.profilePic = selectedProfile ? selectedProfile.value : "";

    const selectedGender = document.querySelector("input[name='gender']:checked");
    empPayroll.gender = selectedGender ? selectedGender.value : "";

    const selectedDepartments = Array.from(
      document.querySelectorAll("input[name='department']:checked")
    ).map((d) => d.value);
    empPayroll.departments = selectedDepartments;

    empPayroll.salary = salaryRange.value;

    const day = daySelect.value;
    const month = monthSelect.value;
    const year = yearSelect.value;
    const dateObj = new Date(`${year}-${month}-${day}`);
    empPayroll.startDate = dateObj;

    empPayroll.notes = notesInput.value;

    const list = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    const empObj = {
      name: empPayroll.name,
      profilePic: empPayroll.profilePic,
      gender: empPayroll.gender,
      departments: empPayroll.departments,
      salary: empPayroll.salary,
      startDate: empPayroll.startDate.toISOString(),
      notes: empPayroll.notes
    };

    const editIndex = localStorage.getItem(EDIT_KEY);

    if (editIndex !== null) {
      list[Number(editIndex)] = empObj;
      localStorage.removeItem(EDIT_KEY);
    } else {
      list.push(empObj);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    window.location.href = "employee-list.html";
  } catch (err) {
    const message = err.message || "Something went wrong";

    if (message.toLowerCase().includes("name")) nameError.textContent = message;
    else if (message.toLowerCase().includes("notes")) notesError.textContent = message;
    else if (message.toLowerCase().includes("date")) dateError.textContent = message;
    else successText.textContent = message;
  }
});

fillFormForEdit();
