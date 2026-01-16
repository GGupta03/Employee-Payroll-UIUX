const STORAGE_KEY = "employeePayrollList";
const DUMMY_LOADED_KEY = "dummyLoaded";
const EDIT_KEY = "editEmployeeIndex";

const ICON_DELETE = "https://cdn-icons-png.flaticon.com/512/484/484611.png";
const ICON_EDIT = "https://cdn-icons-png.flaticon.com/512/1159/1159633.png";

const getEmployeesFromStorage = () => {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
};

const setEmployeesToStorage = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

const renderTable = (list) => {
  if (!list || list.length === 0) {
    $("#employeeTableBody").html(`
      <tr>
        <td colspan="6" class="empty-row">No employees found. Add a new employee first.</td>
      </tr>
    `);
    return;
  }

  let rows = "";

  list.forEach((emp, index) => {
    const start = new Date(emp.startDate);
    const startDateFormatted = start.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });

    const deptBadges = emp.departments
      .map(d => `<span class="dept-badge">${d}</span>`)
      .join("");

    rows += `
      <tr>
        <td>
          <div class="name-box">
            <img class="profile-pic" src="${emp.profilePic}" alt="pic" />
            <span>${emp.name}</span>
          </div>
        </td>
        <td>${emp.gender}</td>
        <td>${deptBadges}</td>
        <td>₹ ${Number(emp.salary).toLocaleString("en-IN")}</td>
        <td>${startDateFormatted}</td>
        <td>
          <div class="action-icons">
            <img src="${ICON_DELETE}" onclick="deleteEmployee(${index})" />
            <img src="${ICON_EDIT}" onclick="editEmployee(${index})" />
          </div>
        </td>
      </tr>
    `;
  });

  $("#employeeTableBody").html(rows);
};

const loadDummyEmployeesOnce = () => {
  const alreadyLoaded = localStorage.getItem(DUMMY_LOADED_KEY);

  if (alreadyLoaded) {
    renderTable(getEmployeesFromStorage());
    return;
  }

  $.ajax({
    url: "employees.json",
    method: "GET",
    dataType: "json",
    success: function (dummyEmployees) {
      const existing = getEmployeesFromStorage();
      const merged = [...dummyEmployees, ...existing];
      setEmployeesToStorage(merged);
      localStorage.setItem(DUMMY_LOADED_KEY, "true");
      renderTable(merged);
    },
    error: function () {
      renderTable(getEmployeesFromStorage());
    }
  });
};

$(document).ready(function () {
  loadDummyEmployeesOnce();
});

function deleteEmployee(index) {
  const list = getEmployeesFromStorage();
  list.splice(index, 1);
  setEmployeesToStorage(list);
  renderTable(list);
}

function editEmployee(index) {
  localStorage.setItem(EDIT_KEY, index);
  window.location.href = "index.html";
}
