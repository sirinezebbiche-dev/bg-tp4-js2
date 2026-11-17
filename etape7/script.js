"use strict";

// Ici on initialise le tableau d'objets utilisé comme source de données (slide 40).
const persons = [
  { id: 1, nom: "nom-1", prenom: "prenom-1", points: 5, selected: false },
  { id: 2, nom: "nom-2", prenom: "prenom-2", points: 10, selected: false },
  { id: 3, nom: "nom-3", prenom: "prenom-3", points: 15, selected: false }
];
let nextId = 4;
let editingId = null;
let sortAscending = true;

const form = document.getElementById("person-form");
const tableBody = document.getElementById("person-table-body");
const message = document.getElementById("message");
const lineCount = document.getElementById("line-count");
const totalPoints = document.getElementById("total-points");
const searchInput = document.getElementById("search");
const sortButton = document.getElementById("sort-btn");
const editButton = document.getElementById("edit-selected-btn");
const deleteButton = document.getElementById("delete-selected-btn");
const consoleButton = document.getElementById("console-btn");
const submitButton = document.getElementById("submit-btn");
const cancelEditButton = document.getElementById("cancel-edit-btn");

function showMessage(text) {
  message.textContent = text;
}

// Ici on met à jour le nombre de lignes et le total des points (slide 40).
function updateSummary() {
  const total = persons.reduce((sum, person) => sum + person.points, 0);
  lineCount.textContent = `${persons.length} ligne(s)`;
  totalPoints.textContent = `Total point(s)= ${total}`;
}

// Ici on construit les lignes et les cases du tableau avec le DOM (slides 54, 92 et 96).
function renderTable() {
  const query = searchInput.value.trim().toLocaleLowerCase("fr");
  // Ici on filtre les objets et vérifie leur nom pour la recherche (slide 40).
  const visiblePersons = persons.filter((person) => {
    const fullName = `${person.nom} ${person.prenom}`.toLocaleLowerCase("fr");
    return fullName.includes(query);
  });

  tableBody.textContent = "";
  visiblePersons.forEach((person, index) => {
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

// Ici on ajoute une personne ou on met à jour celle en cours de modification (slides 40 et 136).
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const nom = document.getElementById("nom").value.trim();
  const prenom = document.getElementById("prenom").value.trim();
  const points = Number(document.getElementById("points").value);

  if (!nom || !prenom || !Number.isFinite(points) || points < 0) {
    showMessage("Veuillez saisir un nom, un prénom et un nombre de points valide.");
    return;
  }

  if (editingId !== null) {
    const person = persons.find((item) => item.id === editingId);
    if (!person) {
      showMessage("La personne à modifier n'existe plus.");
      return;
    }

    person.nom = nom;
    person.prenom = prenom;
    person.points = points;
    person.selected = false;
    showMessage("Personne modifiée.");
    resetEditMode();
  } else {
    persons.push({ id: nextId, nom, prenom, points, selected: false });
    nextId += 1;
    form.reset();
    showMessage("Personne ajoutée.");
  }

  renderTable();
});

// Ici on lie l'état des cases aux personnes sélectionnées (slides 92 et 136).
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

// Fonctionnalité supplémentaire 1 : recherche en filtrant le tableau affiché.
searchInput.addEventListener("input", renderTable);

// Fonctionnalité supplémentaire 2 : modification de l'unique personne sélectionnée.
editButton.addEventListener("click", () => {
  const selectedPersons = persons.filter((person) => person.selected);
  if (selectedPersons.length !== 1) {
    showMessage("Sélectionnez exactement une personne à modifier.");
    return;
  }

  const person = selectedPersons[0];
  editingId = person.id;
  document.getElementById("nom").value = person.nom;
  document.getElementById("prenom").value = person.prenom;
  document.getElementById("points").value = person.points;
  submitButton.textContent = "Enregistrer";
  cancelEditButton.hidden = false;
  showMessage(`Modification de ${person.prenom} ${person.nom}.`);
  document.getElementById("nom").focus();
});

function resetEditMode() {
  editingId = null;
  form.reset();
  submitButton.textContent = "Ajouter";
  cancelEditButton.hidden = true;
}

cancelEditButton.addEventListener("click", () => {
  resetEditMode();
  showMessage("Modification annulée.");
  renderTable();
});

// Fonctionnalité supplémentaire 3 : tri croissant puis décroissant du tableau (slide 40).
sortButton.addEventListener("click", () => {
  const direction = sortAscending ? 1 : -1;
  persons.sort((first, second) => direction * (first.points - second.points));
  sortAscending = !sortAscending;
  sortButton.textContent = `Trier par points ${sortAscending ? "↑" : "↓"}`;
  renderTable();
});

// Ici on supprime les personnes cochées du tableau de données (slide 40).
deleteButton.addEventListener("click", () => {
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

  if (editingId !== null && !persons.some((person) => person.id === editingId)) {
    resetEditMode();
  }
  showMessage(`${selectedCount} ligne(s) supprimée(s).`);
  renderTable();
});

// Ici on affiche toutes les données du tableau dans la console (slide 33).
consoleButton.addEventListener("click", () => {
  console.table(persons);
  showMessage("Le tableau a été affiché dans la console.");
});

renderTable();
