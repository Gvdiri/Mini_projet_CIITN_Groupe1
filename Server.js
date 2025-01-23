// Importation des modules nécessaires
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');

// Initialisation de l'application Express
const app = express();

// Configuration du middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Dossier public pour le côté client
app.use(express.static(path.join(__dirname, 'Public')));

// Configuration de la connexion à la base de données
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Remplacez par votre utilisateur MySQL
  password: '', // Remplacez par votre mot de passe MySQL
  database: 'bd_node_project', // Remplacez par le nom de votre base de données
});

// Connexion à la base de données
db.connect(err => {
  if (err) {
    console.error('Erreur de connexion à la base de données:', err);
    process.exit(1);
  }
  console.log('Connecté à la base de données MySQL.');
});

// Routes API pour gérer les données

// Ajouter une route pour la page d'accueil (si vous en avez besoin)
app.get('/', (req, res) => {
  res.send('Bienvenue sur l\'application de gestion des patients.');
});

// Routes pour gérer les patients
app.post('/Patient', (req, res) => {
  const { nom, prenom, dateDeNaissance, tel, sexe, nationalite } = req.body;
  const query = `
    INSERT INTO Patient (Nom, Prenom, Date_De_Naissance, Tel, Sexe, Nationalite)
    VALUES (?, ?, ?, ?, ?, ?)`;
  db.query(query, [nom, prenom, dateDeNaissance, tel, sexe, nationalite], (err, result) => {
    if (err) {
      console.error('Erreur lors de l\'ajout du patient:', err);
      res.status(500).send('Erreur serveur.');
    } else {
      res.status(201).send({ message: 'Patient ajouté avec succès.', id: result.insertId });
    }
  });
});

app.get('/Patient', (req, res) => {
  const query = 'SELECT * FROM Patient';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des patients:', err);
      res.status(500).send('Erreur serveur.');
    } else {
      res.status(200).send(results);
    }
  });
});

app.put('/Patient/:id', (req, res) => {
  const { id } = req.params;
  const { nom, prenom, dateDeNaissance, tel, sexe, nationalite } = req.body;
  const query = `
    UPDATE Patient
    SET Nom = ?, Prenom = ?, Date_De_Naissance = ?, Tel = ?, Sexe = ?, Nationalite = ?
    WHERE Id_Patient = ?`;
  db.query(query, [nom, prenom, dateDeNaissance, tel, sexe, nationalite, id], (err) => {
    if (err) {
      console.error('Erreur lors de la modification du patient:', err);
      res.status(500).send('Erreur serveur.');
    } else {
      res.status(200).send({ message: 'Patient modifié avec succès.' });
    }
  });
});

app.delete('/Patient/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM Patient WHERE Id_Patient = ?';
  db.query(query, [id], (err) => {
    if (err) {
      console.error('Erreur lors de la suppression du patient:', err);
      res.status(500).send('Erreur serveur.');
    } else {
      res.status(200).send({ message: 'Patient supprimé avec succès.' });
    }
  });
});

// Routes pour gérer les dossiers
app.post('/Dossier', (req, res) => {
  const { dateDeCreation, idPatient } = req.body;
  const query = `
    INSERT INTO Dossier (Date_De_Creation, Id_Patient)
    VALUES (?, ?)`;
  db.query(query, [dateDeCreation, idPatient], (err, result) => {
    if (err) {
      console.error("Erreur lors de l'ajout du dossier:", err);
      res.status(500).send('Erreur serveur.');
    } else {
      res.status(201).send({ message: 'Dossier ajouté avec succès.', id: result.insertId });
    }
  });
});

app.get('/Dossier', (req, res) => {
  const query = 'SELECT * FROM Dossier';
  db.query(query, (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération des dossiers:", err);
      res.status(500).send('Erreur serveur.');
    } else {
      res.status(200).send(results);
    }
  });
});

app.put('/Dossier/:id', (req, res) => {
  const { id } = req.params;
  const { dateDeCreation, idPatient } = req.body;
  const query = `
    UPDATE Dossier
    SET Date_De_Creation = ?, Id_Patient = ?
    WHERE Id_Dossier = ?`;
  db.query(query, [dateDeCreation, idPatient, id], (err) => {
    if (err) {
      console.error("Erreur lors de la modification du dossier:", err);
      res.status(500).send('Erreur serveur.');
    } else {
      res.status(200).send({ message: 'Dossier modifié avec succès.' });
    }
  });
});

app.delete('/Dossier/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM Dossier WHERE Id_Dossier = ?';
  db.query(query, [id], (err) => {
    if (err) {
      console.error("Erreur lors de la suppression du dossier:", err);
      res.status(500).send('Erreur serveur.');
    } else {
      res.status(200).send({ message: 'Dossier supprimé avec succès.' });
    }
  });
});

// Routes pour gérer les examens
app.post('/Examen', (req, res) => {
  const { nom, dateDeResultat, resultat, idDossier } = req.body;
  const query = `
    INSERT INTO Examen (Nom, Date_De_Resultat, Resultat, Id_Dossier)
    VALUES (?, ?, ?, ?)`;
  db.query(query, [nom, dateDeResultat, resultat, idDossier], (err, result) => {
    if (err) {
      console.error("Erreur lors de l'ajout de l'examen:", err);
      res.status(500).send('Erreur serveur.');
    } else {
      res.status(201).send({ message: 'Examen ajouté avec succès.', id: result.insertId });
    }
  });
});

app.get('/Examen', (req, res) => {
  const query = 'SELECT * FROM Examen';
  db.query(query, (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération des examens:", err);
      res.status(500).send('Erreur serveur.');
    } else {
      res.status(200).send(results);
    }
  });
});

app.put('/Examen/:id', (req, res) => {
  const { id } = req.params;
  const { nom, dateDeResultat, resultat, idDossier } = req.body;
  const query = `
    UPDATE Examen
    SET Nom = ?, Date_De_Resultat = ?, Resultat = ?, Id_Dossier = ?
    WHERE Id_Examen = ?`;
  db.query(query, [nom, dateDeResultat, resultat, idDossier, id], (err) => {
    if (err) {
      console.error("Erreur lors de la modification de l'examen:", err);
      res.status(500).send('Erreur serveur.');
    } else {
      res.status(200).send({ message: 'Examen modifié avec succès.' });
    }
  });
});

app.delete('/Examen/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM Examen WHERE Id_Examen = ?';
  db.query(query, [id], (err) => {
    if (err) {
      console.error("Erreur lors de la suppression de l'examen:", err);
      res.status(500).send('Erreur serveur.');
    } else {
      res.status(200).send({ message: 'Examen supprimé avec succès.' });
    }
  });
});

// Routes pour gérer les utilisateurs
app.post('/User', (req, res) => {
  const { nom, prenom, login, motDePasse } = req.body;
  const query = `
    INSERT INTO Utilisateur (Nom, Prenom, Login, Mot_De_Passe)
    VALUES (?, ?, ?, ?)`;
  db.query(query, [nom, prenom, login, motDePasse], (err, result) => {
    if (err) {
      console.error("Erreur lors de l'ajout de l'utilisateur:", err);
      res.status(500).send('Erreur serveur.');
    } else {
      res.status(201).send({ message: 'Utilisateur ajouté avec succès.', id: result.insertId });
    }
  });
});


app.get('/User', (req, res) => {
  const query = 'SELECT * FROM Utilisateur';
  db.query(query, (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération des utilisateurs:", err);
      res.status(500).send('Erreur serveur.');
    } else {
      res.status(200).send(results);
    }
  });
});

app.delete('/User/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM Utilisateur WHERE Id_Utilisateur = ?';
  db.query(query, [id], (err) => {
    if (err) {
      console.error("Erreur lors de la suppression de l'utilisateur:", err);
      res.status(500).send('Erreur serveur.');
    } else {
      res.status(200).send({ message: 'Utilisateur supprimé avec succès.' });
    }
  });
});


// Lancer le serveur
const PORT = 3000; // Remplacez par le port que vous souhaitez utiliser
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});