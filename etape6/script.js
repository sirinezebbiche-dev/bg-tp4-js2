"use strict";

// Ici on initialise un tableau d'objets représentant les personnes (slide 40).
const persons = [
  { id: 1, nom: "nom-1", prenom: "prenom-1", points: 5, selected: false },
  { id: 2, nom: "nom-2", prenom: "prenom-2", points: 10, selected: false },
  { id: 3, nom: "nom-3", prenom: "prenom-3", points: 15, selected: false }
];
let nextId = 4;

const form = document.getElementById("person-form");
const tableBody = document.getElementById("person-table-body");
const message = document.getElementById("message");
const lineCount = document.getElementById("line-count");
const totalPoints = document.getElementById("total-points");
const consoleButton = document.getElementById("console-btn");
const deleteSelectedButton = document.getElementById("delete-selected-btn");

function showMessage(text) {
  message.textContent = text;
}

// Ici on calcule les informations de résumé à partir du tableau (slide 40).
function updateSummary() {
  const total = persons.reduce((sum, person) => sum + person.points, 0);
  lineCount.textContent = `${persons.length} ligne(s)`;
  totalPoints.textContent = `Total point(s)= ${total}`;
}

// Ici on crée les lignes et les cases à cocher avec le DOM (slides 54, 92 et 96).
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
    checkbox.className = "person-select";
    checkbox.dataset.id = person.id;
    checkbox.setAttribute("aria-label", `Sélectionner ${person.nom}`);
    checkbox.checked = person.selected;
    selectCell.appendChild(checkbox);
    row.appendChild(selectCell);
    tableBody.appendChild(row);
  });

  updateSummary();
}

// Ici on ajoute une personne dans le tableau de données (slides 40 et 136).
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const nom = document.getElementById("nom").value.trim();
  const prenom = document.getElementById("prenom").value.trim();
  const points = Number(document.getElementById("points").value);

  if (!nom || !prenom || !Number.isFinite(points) || points < 0) {
    showMessage("Veuillez saisir un nom, un prénom et un nombre de points valide.");
    return;
  }

  persons.push({ id: nextId, nom, prenom, points, selected: false });
  nextId += 1;
  form.reset();
  showMessage("Personne ajoutée.");
  renderTable();
});

// Ici on synchronise l'état des cases avec les objets du tableau (slides 92 et 136).
tableBody.addEventListener("change", (event) => {
  const checkbox = event.target;
  if (!(checkbox instanceof HTMLInputElement) || !checkbox.classList.contains("person-select")) {
    return;
  }

  const person = persons.find((item) => item.id === Number(checkbox.dataset.id));
  if (person) {
    person.selected = checkbox.checked;
  }
});

// Ici on supprime en partant de la fin pour conserver les indices du tableau (slide 40).
deleteSelectedButton.addEventListener("click", () => {
  const selectedCount = persons.filter((person) => person.selected).length;
  if (selectedCount === 0) {
    showMessage("Sélectionnez au moins une ligne à supprimer.");
    return;
  }

  for (let index = persons.length - 1; index >= 0; index -= 1) {
    if (persons[index].selected) {
      persons.splice(index, 1);
    }
  }

  showMessage(`${selectedCount} ligne(s) supprimée(s).`);
  renderTable();
});

// Ici on affiche le contenu complet du tableau dans la console (slide 33).
consoleButton.addEventListener("click", () => {
  console.table(persons);
  showMessage("Le tableau a été affiché dans la console.");
});

renderTable();
