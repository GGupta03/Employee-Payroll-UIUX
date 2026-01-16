const salaryRange = document.getElementById("salary");
const salaryValue = document.getElementById("salaryValue");
const daySelect = document.getElementById("day");
const yearSelect = document.getElementById("year");
const form = document.getElementById("payrollForm");
const successText = document.getElementById("successText");

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

form.addEventListener("submit", (e) => {
  e.preventDefault();
  successText.textContent = "Employee payroll details submitted successfully ✅";
  form.reset();
  setSalaryText(salaryRange.value);
});
