// Fonction pour afficher un message dans une alerte
function showMessage(message, type = 'success') {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = message;
    messageDiv.style.color = type === 'success' ? 'green' : 'red';
  }
  
  // Ajouter un patient
  async function addPatient(event) {
    event.preventDefault();
  
    const formData = {
      nom: document.getElementById('nom').value,
      prenom: document.getElementById('prenom').value,
      dateDeNaissance: document.getElementById('dateDeNaissance').value,
      tel: document.getElementById('tel').value,
      sexe: document.getElementById('sexe').value,
      nationalite: document.getElementById('nationalite').value
    };
  
    try {
      const response = await fetch('/Patient', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
  
      const result = await response.json();
  
      if (response.ok) {
        showMessage(result.message);
        document.getElementById('patientForm').reset();
      } else {
        showMessage(result.message || 'Erreur lors de l\'ajout du patient.', 'error');
      }
    } catch (error) {
      console.error('Erreur:', error);
      showMessage('Erreur de connexion au serveur.', 'error');
    }
  }
  
  // Récupérer tous les patients
  async function fetchPatients() {
    try {
      const response = await fetch('/Patient');
      const patients = await response.json();
  
      if (response.ok) {
        const tableBody = document.getElementById('patientsTableBody');
        tableBody.innerHTML = '';
  
        patients.forEach(patient => {
          const row = `
            <tr>
              <td>${patient.Id_Patient}</td>
              <td>${patient.Nom}</td>
              <td>${patient.Prenom}</td>
              <td>${patient.Date_De_Naissance}</td>
              <td>${patient.Tel || 'N/A'}</td>
              <td>${patient.Sexe}</td>
              <td>${patient.Nationalite}</td>
              <td>
                <button onclick="deletePatient(${patient.Id_Patient})">Supprimer</button>
              </td>
            </tr>
          `;
          tableBody.insertAdjacentHTML('beforeend', row);
        });
      } else {
        showMessage('Erreur lors de la récupération des patients.', 'error');
      }
    } catch (error) {
      console.error('Erreur:', error);
      showMessage('Erreur de connexion au serveur.', 'error');
    }
  }
  
  // Supprimer un patient
  async function deletePatient(id) {
    try {
      const response = await fetch(`/Patient/${id}`, {
        method: 'DELETE'
      });
  
      const result = await response.json();
  
      if (response.ok) {
        showMessage(result.message);
        fetchPatients(); // Actualiser la liste des patients
      } else {
        showMessage(result.message || 'Erreur lors de la suppression du patient.', 'error');
      }
    } catch (error) {
      console.error('Erreur:', error);
      showMessage('Erreur de connexion au serveur.', 'error');
    }
  }
  
  // Ajouter les gestionnaires d'événements au chargement de la page
  document.addEventListener('DOMContentLoaded', () => {
    // Associer le formulaire d'ajout de patient
    const patientForm = document.getElementById('patientForm');
    if (patientForm) {
      patientForm.addEventListener('submit', addPatient);
    }
  
    // Charger la liste des patients si la table existe
    const patientsTable = document.getElementById('patientsTableBody');
    if (patientsTable) {
      fetchPatients();
    }
  });
  