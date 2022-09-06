const modal = document.getElementById("modal");
const searchField = document.getElementById("search");
const employeesContainer = document.getElementById("employees");
const container = document.querySelector(".container");
const loader = document.getElementById("loader");
const formElement = document.querySelector(".form");
const buttonEl = document.getElementById("refetch");

let employees = [];

document.addEventListener("DOMContentLoaded", function (event) {
  fetchEmployees();
});

async function fetchEmployees() {
  try {
    loader.style.display = "block";
    const response = await fetch("https://randomuser.me/api/?results=12");
    const { results } = await response.json();
    employees = results;
    renderEmployees(results);
    loader.style.display = "none";
  } catch (error) {
    console.error("failed to fetch employees ", error);
    loader.style.display = "none";
    alert("Error occurred while fetching employees\n try again!\n");
  }
}

function renderEmployees(_employees) {
  if (!_employees.length) return;

  for (let i = 0; i < _employees.length; i++) {
    const _employee = _employees[i];

    const employeeHtml = `
        <div class="employee" data-username=${_employee.login.username}>
          <div class="img-container">
            <img
              src=${_employee.picture.large}
              alt="img"
            />
          </div>
          <div class="name">${_employee.name.first} ${_employee.name.last}</div>
          <div class="email">${_employee.email}</div>
        </div>
    `;
    employeesContainer.insertAdjacentHTML("beforeend", employeeHtml);
  }
}

formElement.addEventListener("submit", (e) => {
  e.preventDefault();
});

searchField.addEventListener("keyup", (e) => {
  e.preventDefault();
  const employeesEl = document.querySelectorAll(".employee");
  const value = e.target.value.toLowerCase();
  const arrEl = Array.from(employeesEl);
  if (!value) arrEl.forEach((el) => (el.style.display = "inline-block"));

  if (!arrEl.length) return;
  arrEl.forEach((employeeEl) => {
    const name = employeeEl.querySelector(".name").innerHTML.toLowerCase();
    const email = employeeEl.querySelector(".email").innerHTML.toLowerCase();
    if ((value && name.includes(value)) || email.includes(value)) {
      employeeEl.style.display = "inline-block";
    } else {
      employeeEl.style.display = "none";
    }
  });
});

buttonEl.addEventListener("click", () => {
  employeesContainer.innerHTML = "";
  fetchEmployees();
});

employeesContainer.addEventListener("click", (e) => {
  if (
    e.target.parentElement.className === "employee" ||
    e.target.className === "name" ||
    e.target.className === "email" ||
    e.target.tagName === "IMG" ||
    e.target.className === "img-container"
  ) {
    const closestEl = e.target.closest("div.employee");
    // console.log(closestEl)
    // if (!closestEl) return;

    const [foundEmployee] = employees.filter(
      (em) => em.login.username === closestEl.dataset.username
    );
    if (!foundEmployee) return;
      console.log('foundEmployee ', foundEmployee.name.last)
    modal.style.display = "block";
    const modalContent = `
      <div class="employee" id="employee-detail">
        <div class="img-container">
          <img style="width:200px;height:200px" src=${foundEmployee.picture.large} alt="img" />
        </div>
          <div class="name">${foundEmployee.name.first} ${foundEmployee.name.last}</div>
          <div class="email">${foundEmployee.email}</div>
          <div >${foundEmployee.cell}</div>
          <div >${foundEmployee.location.country}</div>
          <div >${foundEmployee.location.city}</div>
      </div>
    `;
    modal.innerHTML = ""
    modal.insertAdjacentHTML("afterbegin", modalContent);
  }
});

window.onclick = (e) => {
  if (e.target == modal) {
    modal.style.display = "none";
  }
};
