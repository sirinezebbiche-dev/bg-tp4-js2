"use strict";

// Ici on stocke les personnes dans un tableau d'objets (slide 40).
const persons = [
  { nom: "nom-1", prenom: "prenom-1", points: 5 },
  { nom: "nom-2", prenom: "prenom-2", points: 10 },
  { nom: "nom-3", prenom: "prenom-3", points: 15 }
];

const form = document.getElementById("person-form");
const tableBody = document.getElementById("person-table-body");
const message = document.getElementById("message");
const consoleButton = document.getElementById("console-btn");

// Ici on parcourt les objets et on crée les lignes du tableau HTML (slides 44, 54 et 96).
function renderTable() {
  tableBody.textContent = "";

  persons.forEach((person, index) => {
    const row = document.createElement("tr");
    [index + 1, person.nom, person.prenom, person.points].forEach((value) => {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.appendChild(cell);
    });

    const selectCell = document.createElement("td");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.setAttribute("aria-label", `Sélectionner ${person.nom}`);
    selectCell.appendChild(checkbox);
    row.appendChild(selectCell);
    tableBody.appendChild(row);
  });
}

// Ici on ajoute un objet au tableau, puis on réaffiche les lignes (slides 40 et 96).
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const nom = document.getElementById("nom").value.trim();
  const prenom = document.getElementById("prenom").value.trim();
  const points = Number(document.getElementById("points").value);

  if (!nom || !prenom || !Number.isFinite(points) || points < 0) {
    message.textContent = "Veuillez saisir un nom, un prénom et un nombre de points valide.";
    return;
  }

  persons.push({ nom, prenom, points });
  form.reset();
  message.textContent = "Personne ajoutée au tableau d'objets.";
  renderTable();
});

// Ici on affiche le tableau persons dans la console (slide 33).
consoleButton.addEventListener("click", () => {
  console.log(persons);
  message.textContent = "Le tableau persons a été affiché dans la console.";
});

renderTable();
