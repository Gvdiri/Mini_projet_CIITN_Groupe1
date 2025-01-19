// Importation des modules requis
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

// Initialisation de l'application Express
const app = express();
const port = 3000;

// Configuration de body-parser pour traiter les requêtes JSON et URL-encodées
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuration de la connexion à la base de données MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'nom_de_la_base', // Remplace par le nom de ta base de données
});

// Connexion à la base de données
db.connect((err) => {
  if (err) {
    console.error('Erreur de connexion :', err);
    return;
  }
  console.log('Connecté à la base de données MySQL.');
});

// Route de test
app.get('/', (req, res) => {
  res.send('Bienvenue sur le serveur Node.js !');
});

// -------------------------- Routes pour gérer les Patients --------------------------

// Récupérer tous les patients
app.get('/patients', (req, res) => {
  const query = 'SELECT * FROM Patient';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des patients :', err);
      res.status(500).send('Erreur serveur.');
    } else {
      res.json(results);
    }
  });
});

// Ajouter un nouveau patient
app.post('/patients', (req, res) => {
  const { Nom, Prenom, DateNaissance, Telephone, Sexe, Nationalite } = req.body;
  const query = 'INSERT INTO Patient (Nom, Prenom, DateNaissance, Telephone, Sexe, Nationalite) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(query, [Nom, Prenom, DateNaissance, Telephone, Sexe, Nationalite], (err, results) => {
    if (err) {
      console.error('Erreur lors de l\'insertion du patient :', err);
      res.status(500).send('Erreur serveur.');
    } else {
      res.status(201).send('Patient ajouté avec succès.');
    }
  });
});

// Modifier un patient
app.put('/patients/:id', (req, res) => {
  const { id } = req.params;
  const { Nom, Prenom, DateNaissance, Telephone, Sexe, Nationalite } = req.body;
  const query = 'UPDATE Patient SET Nom = ?, Prenom = ?, DateNaissance = ?, Telephone = ?, Sexe = ?, Nationalite = ? WHERE IdPatient = ?';
  db.query(query, [Nom, Prenom, DateNaissance, Telephone, Sexe, Nationalite, id], (err, results) => {
    if (err) {
      console.error('Erreur lors de la mise à jour du patient :', err);
      res.status(500).send('Erreur serveur.');
    } else if (results.affectedRows === 0) {
      res.status(404).send('Patient non trouvé.');
    } else {
      res.send('Patient mis à jour avec succès.');
    }
  });
});

// Supprimer un patient
app.delete('/patients/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM Patient WHERE IdPatient = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Erreur lors de la suppression du patient :', err);
      res.status(500).send('Erreur serveur.');
    } else if (results.affectedRows === 0) {
      res.status(404).send('Patient non trouvé.');
    } else {
      res.send('Patient supprimé avec succès.');
    }
  });
});

// -------------------------- Routes pour gérer les Dossiers --------------------------

// Récupérer tous les dossiers
app.get('/dossiers', (req, res) => {
  const query = 'SELECT * FROM Dossier';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des dossiers :', err);
      res.status(500).send('Erreur serveur.');
    } else {
      res.json(results);
    }
  });
});

// Ajouter un dossier
app.post('/dossiers', (req, res) => {
  const { DateCreation, IdPatient } = req.body;
  const query = 'INSERT INTO Dossier (DateCreation, IdPatient) VALUES (?, ?)';
  db.query(query, [DateCreation, IdPatient], (err, results) => {
    if (err) {
      console.error('Erreur lors de l\'insertion du dossier :', err);
      res.status(500).send('Erreur serveur.');
    } else {
      res.status(201).send('Dossier ajouté avec succès.');
    }
  });
});

// -------------------------- Routes pour gérer les Examens --------------------------

// Récupérer tous les examens
app.get('/examens', (req, res) => {
  const query = 'SELECT * FROM Examen';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des examens :', err);
      res.status(500).send('Erreur serveur.');
    } else {
      res.json(results);
    }
  });
});

// Ajouter un examen
app.post('/examens', (req, res) => {
  const { Nom, DateResultat, Resultats, IdDossier } = req.body;
  const query = 'INSERT INTO Examen (Nom, DateResultat, Resultats, IdDossier) VALUES (?, ?, ?, ?)';
  db.query(query, [Nom, DateResultat, Resultats, IdDossier], (err, results) => {
    if (err) {
      console.error('Erreur lors de l\'insertion de l\'examen :', err);
      res.status(500).send('Erreur serveur.');
    } else {
      res.status(201).send('Examen ajouté avec succès.');
    }
  });
});

// -------------------------- Routes pour gérer les Rendezvous --------------------------

// Récupérer tous les rendez-vous
app.get('/rendezvous', (req, res) => {
  const query = 'SELECT * FROM Rendezvous';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des rendez-vous :', err);
      res.status(500).send('Erreur serveur.');
    } else {
      res.json(results);
    }
  });
});

// Ajouter un rendez-vous
app.post('/rendezvous', (req, res) => {
  const { DateRendezvous, IdPatient, IdUtilisateur } = req.body;
  const query = 'INSERT INTO Rendezvous (DateRendezvous, IdPatient, IdUtilisateur) VALUES (?, ?, ?)';
  db.query(query, [DateRendezvous, IdPatient, IdUtilisateur], (err, results) => {
    if (err) {
      console.error('Erreur lors de l\'insertion du rendez-vous :', err);
      res.status(500).send('Erreur serveur.');
    } else {
      res.status(201).send('Rendez-vous ajouté avec succès.');
    }
  });
});

// -------------------------- Démarrage du serveur --------------------------

app.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur le port ${port}`);
});