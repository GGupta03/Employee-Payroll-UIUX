const salaryRange = document.getElementById("salary");
const salaryValue = document.getElementById("salaryValue");

salaryValue.textContent = salaryRange.value;

salaryRange.addEventListener("input", () => {
  salaryValue.textContent = salaryRange.value;
});
