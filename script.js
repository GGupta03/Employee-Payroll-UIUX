class EmployeePayrollData {
  constructor() {
    this._name = "";
    this._profilePic = "";
    this._gender = "";
    this._departments = [];
    this._salary = 0;
    this._startDate = "";
    this._notes = "";
  }

  get name() {
    return this._name;
  }

  set name(value) {
    const nameRegex = /^[A-Z][a-zA-Z]{2,}( [A-Z][a-zA-Z]{2,})*$/;
    if (!nameRegex.test(value.trim())) {
      throw new Error("Name must start with capital and have minimum 3 letters");
    }
    this._name = value.trim();
  }

  get profilePic() {
    return this._profilePic;
  }

  set profilePic(value) {
    if (!value) {
      throw new Error("Please select a profile image");
    }
    this._profilePic = value;
  }

  get gender() {
    return this._gender;
  }

  set gender(value) {
    if (!value) {
      throw new Error("Please select gender");
    }
    this._gender = value;
  }

  get departments() {
    return this._departments;
  }

  set departments(value) {
    if (!Array.isArray(value) || value.length === 0) {
      throw new Error("Select at least one department");
    }
    this._departments = value;
  }

  get salary() {
    return this._salary;
  }

  set salary(value) {
    const salaryNum = Number(value);
    if (Number.isNaN(salaryNum) || salaryNum < 10000) {
      throw new Error("Salary must be valid and minimum ₹10000");
    }
    this._salary = salaryNum;
  }

  get startDate() {
    return this._startDate;
  }

  set startDate(value) {
    if (!value) {
      throw new Error("Please select a valid start date");
    }
    this._startDate = value;
  }

  get notes() {
    return this._notes;
  }

  set notes(value) {
    const trimmed = value.trim();
    if (trimmed.length < 5) {
      throw new Error("Notes must have at least 5 characters");
    }
    this._notes = trimmed;
  }

  toString() {
    return JSON.stringify({
      name: this._name,
      profilePic: this._profilePic,
      gender: this._gender,
      departments: this._departments,
      salary: this._salary,
      startDate: this._startDate,
      notes: this._notes
    }, null, 2);
  }
}

const salaryRange = document.getElementById("salary");
const salaryValue = document.getElementById("salaryValue");
const daySelect = document.getElementById("day");
const yearSelect = document.getElementById("year");
const form = document.getElementById("payrollForm");
const successText = document.getElementById("successText");

const nameInput = document.getElementById("name");
const notesInput = document.getElementById("notes");

const nameError = document.getElementById("nameError");
const notesError = document.getElementById("notesError");

const clearMessages = () => {
  nameError.textContent = "";
  notesError.textContent = "";
  successText.textContent = "";
};

const setSalaryText = (value) => {
  salaryValue.textContent = value;
};

setSalaryText(salaryRange.value);

salaryRange.addEventListener("input", (e) => {
  setSalaryText(e.target.value);
});

daySelect.innerHTML = `<option value="">Day</option>`;
for (let d = 1; d <= 31; d++) {
  daySelect.innerHTML += `<option value="${d}">${d}</option>`;
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

form.addEventListener("reset", () => {
  setSalaryText(salaryRange.value);
  clearMessages();
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  clearMessages();

  try {
    const empPayroll = new EmployeePayrollData();

    empPayroll.name = document.getElementById("name").value;

    const selectedProfile = document.querySelector("input[name='profile']:checked");
    empPayroll.profilePic = selectedProfile ? selectedProfile.value : "";

    const selectedGender = document.querySelector("input[name='gender']:checked");
    empPayroll.gender = selectedGender ? selectedGender.value : "";

    const selectedDepartments = Array.from(
      document.querySelectorAll("input[name='department']:checked")
    ).map((d) => d.value);
    empPayroll.departments = selectedDepartments;

    empPayroll.salary = document.getElementById("salary").value;

    const day = document.getElementById("day").value;
    const month = document.getElementById("month").value;
    const year = document.getElementById("year").value;
    empPayroll.startDate = `${day}-${month}-${year}`;

    empPayroll.notes = document.getElementById("notes").value;

    console.log("Employee Payroll Data Object:");
    console.log(empPayroll.toString());

    successText.textContent = "Employee payroll saved successfully";
    form.reset();
  } catch (err) {
    const message = err.message || "Something went wrong";

    if (message.toLowerCase().includes("name")) nameError.textContent = message;
    else if (message.toLowerCase().includes("notes")) notesError.textContent = message;
    else successText.textContent = message;
  }
});
