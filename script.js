const payrollForm = document.getElementById("payrollForm");
const output = document.getElementById("output");

payrollForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("empName").value;
  const salary = document.getElementById("salary").value;
  const department = document.getElementById("department").value;
  const startDate = document.getElementById("startDate").value;

  output.textContent = `Employee Added: ${name} | ₹${salary} | ${department} | ${startDate}`;

  payrollForm.reset();
});
