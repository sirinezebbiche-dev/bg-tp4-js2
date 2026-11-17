"use strict";

// Ici on récupère le formulaire et le corps du tableau dans le DOM (slide 61).
const form = document.getElementById("person-form");
const tableBody = document.getElementById("person-table-body");
const message = document.getElementById("message");

// Ici on insère directement une nouvelle ligne à partir des champs du formulaire (slides 91 et 96).
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const numero = Number(document.getElementById("numero").value);
  const nom = document.getElementById("nom").value.trim();
  const prenom = document.getElementById("prenom").value.trim();
  const points = Number(document.getElementById("points").value);

  if (!Number.isInteger(numero) || numero < 1 || !nom || !prenom || !Number.isFinite(points) || points < 0) {
    message.textContent = "Veuillez saisir un numéro, un nom, un prénom et un nombre de points valides.";
    return;
  }

  const row = document.createElement("tr");
  [numero, nom, prenom, points].forEach((value) => {
    const cell = document.createElement("td");
    cell.textContent = value;
    row.appendChild(cell);
  });

  const selectCell = document.createElement("td");
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.setAttribute("aria-label", `Sélectionner ${nom}`);
  selectCell.appendChild(checkbox);
  row.appendChild(selectCell);
  tableBody.appendChild(row);
  form.reset();
  message.textContent = "Ligne ajoutée.";
});
