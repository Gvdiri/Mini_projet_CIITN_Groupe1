const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcrypt');
const session= require('express-session');

// Créer une instance d'Express
const app = express();
const port = 3000;

// Utiliser les middleware

app.use(bodyParser.json());
app.use(session({
  secret: 'tonSecret',  // Clé secrète pour signer les cookies de session
  resave: false,        // Ne pas réinitialiser la session si elle n'a pas changé
  saveUninitialized: false,  // Ne pas sauvegarder les sessions si elles sont vides
  cookie: { secure: false }  // Pour les cookies non sécurisés (il faudra true si tu utilises HTTPS)
}));
app.use(express.static(path.join(__dirname, 'public')));




// Connexion à la base de données MySQL
const db = mysql.createConnection({
  host: 'localhost',
    user: 'root', // Remplace par ton utilisateur MySQL
    password: '', // Remplace par ton mot de passe MySQL
    database: 'bd_node_project' // Remplace par le nom de ta base de données
});




db.connect(err => {
    if (err) {
        console.error('Erreur de connexion à la base de données:', err);
        return;
    }
    console.log('Connecté à la base de données MySQL');
});




// Ajout d'un patient
app.post('/patients', (req, res) => {
  const { Nom, Prenom, DateNaissance, Telephone, Sexe, Nationalite } = req.body;
  db.query('INSERT INTO Patient (Nom, Prenom, DateNaissance, Telephone, Sexe, Nationalite) VALUES (?, ?, ?, ?, ?, ?)', 
  [Nom, Prenom, DateNaissance, Telephone, Sexe, Nationalite], 
  (err, result) => {
      if (err) {
          res.status(500).json({ message: 'Erreur lors de l\'ajout du patient' });
          return;
      }
      res.status(201).json({ message: 'Patient ajouté avec succès', IdPatient: result.insertId });
  });
});




// Modifier un patient
app.put('/patients/:id', (req, res) => {
  const idPatient = req.params.id;
  const { Nom, Prenom, DateNaissance, Telephone, Sexe, Nationalite } = req.body;
  db.query('SELECT * FROM Patient WHERE IdPatient = ?', [idPatient], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Erreur dans la recherche du patient' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Patient non trouvé' });
    }
    db.query('UPDATE Patient SET Nom = ?, Prenom = ?, DateNaissance = ?, Telephone = ?, Sexe = ?, Nationalite = ? WHERE IdPatient = ?', 
    [Nom, Prenom, DateNaissance, Telephone, Sexe, Nationalite, idPatient],
    (err, result) => {
      if (err) {
          return res.status(500).json({ message: 'Erreur lors de la modification du patient' });
      }
      res.json({ message: 'Patient modifié avec succès' });
  });
});
});




// Supprimer un patient
app.delete('/patients/:id', (req, res) => {
  const idPatient = req.params.id;
  db.query('SELECT * FROM Patient WHERE IdPatient = ?', [idPatient], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Erreur dans la recherche du patient' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Patient non trouvé' });
    }
    db.query('DELETE FROM Patient WHERE IdPatient = ?', [idPatient], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur lors de la suppression du patient' });
        }
        res.json({ message: 'Patient supprimé avec succès' });
    });
  });
});



// Récupérer tous les patients
app.get('/patients', (req, res) => {
    db.query('SELECT * FROM Patient', (err, results) => {
        if (err) {
            res.status(500).json({ message: 'Erreur dans la récupération des patients' });
            return;
        }
        res.json(results);
    });
});



// Récupérer les dossiers d'un patient
app.get('/dossiers/:idPatient', (req, res) => {
    const idPatient = req.params.idPatient;
    db.query('SELECT * FROM Dossier WHERE IdPatient = ?', [idPatient], (err, results) => {
        if (err) {
            res.status(500).json({ message: 'Erreur dans la récupération des dossiers' });
            return;
        }
        res.json(results);
    });
});



// Ajout d'un dossier
app.post('/dossiers', (req, res) => {
  const { IdPatient, DateCreation } = req.body;
  db.query('SELECT * FROM Patient WHERE IdPatient = ?', [IdPatient], (err, results) => {
    if (err) {
      res.status(500).json({ message: 'Erreur dans la vérification du patient' });
      return;
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Patient non trouvé' });
    }
    db.query('INSERT INTO Dossier (IdPatient, DateCreation) VALUES (?, ?)', 
    [IdPatient, DateCreation], 
    (err, result) => {
        if (err) {
    res.status(500).json({ message: 'Erreur lors de l\'ajout du dossier' });
            return;
        }
        res.status(201).json({ message: 'Dossier ajouté avec succès', IdDossier: result.insertId });
    });
  });
});




// Modifier un dossier
app.put('/dossier/:idDossier', (req, res) => {
  const idDossier = req.params.idDossier;
  const { DateCreation, IdPatient } = req.body;
  db.query('SELECT * FROM Dossier WHERE IdDossier = ?', [idDossier], (err, results) => {
    if (err) {
      res.status(500).json({ message: 'Erreur dans la recherche du dossier' });
      return;
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Dossier non trouvé' });
    }
    const query = "UPDATE Dossier SET DateCreation = ?, IdPatient = ? WHERE IdDossier = ?";
    const values = [DateCreation, IdPatient, idDossier];
    db.query(query, values, (err, results) => {
      if (err) {
        res.status(500).json({ message: "Erreur lors de la mise à jour du dossier" });
        return;
      }
      res.json({ message: 'Dossier mis à jour avec succès' });
    });
  });
});




// Supprimer un dossier
app.delete('/dossier/:idDossier', (req, res) => {
  const idDossier = req.params.idDossier;
  db.query('SELECT * FROM Dossier WHERE IdDossier = ?', [idDossier], (err, results) => {
    if (err) {
      res.status(500).json({ message: "Erreur dans la recherche du dossier" });
      return;
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Dossier non trouvé' });
    }
    const query = "DELETE FROM Dossier WHERE IdDossier = ?";
    db.query(query, [idDossier], (err, results) => {
      if (err) {
  res.status(500).json({ message: "Erreur lors de la suppression du dossier" });
        return;
      }
      res.json({ message: 'Dossier supprimé avec succès' });
    });
  });
});


// Récupérer les examens d'un dossier
app.get('/examen/:idDossier', (req, res) => {
  const idDossier = req.params.idDossier;  // On récupère l'ID du dossier depuis les paramètres de l'URL
  db.query('SELECT * FROM Examen WHERE IdDossier = ?', [idDossier], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Erreur lors de la récupération des examens', error: err });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Aucun examen trouvé pour ce dossier' });
    }
    res.json(results);
  });
});


// Ajout d'un examen
app.post('/examen', (req, res) => {
  const { Nom, DateResultat, Resultats, IdDossier } = req.body;
  db.query('SELECT * FROM Dossier WHERE IdDossier = ?', [IdDossier], (err, results) => {
    if (err) {
      res.status(500).json({ message: "Erreur lors de la vérification du dossier" });
      return;
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Dossier non trouvé' });
    }
    const query = "INSERT INTO Examen (Nom, DateResultat, Resultats, IdDossier) VALUES (?, ?, ?, ?)";
    const values = [Nom, DateResultat, Resultats, IdDossier];
    db.query(query, values, (err, results) => {
      if (err) {
  res.status(500).json({ message: "Erreur lors de l'ajout de l'examen" });
        return;
      }
      res.status(201).json({ message: 'Examen ajouté avec succès' });
    });
  });
});



// modifier un examen
app.put('/examen/:idExamen', (req, res) => {
  const idExamen = req.params.idExamen;
  const { Nom, DateResultat, Resultats } = req.body;
  db.query('SELECT * FROM Examen WHERE IdExamen = ?', [idExamen], (err, results) => {
    if (err) {
      res.status(500).json({ message: "Erreur dans la recherche de l'examen" });
      return;
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Examen non trouvé' });
    }
    const query = "UPDATE Examen SET Nom = ?, DateResultat = ?, Resultats = ? WHERE IdExamen = ?";
    const values = [Nom, DateResultat, Resultats, idExamen];
    db.query(query, values, (err, results) => {
      if (err) {
        res.status(500).json({ message: "Erreur lors de la mise à jour de l'examen" });
        return;
      }
      res.json({ message: 'Examen mis à jour avec succès' });
    });
  });
});




// Supprimer un examen
app.delete('/examen/:idExamen', (req, res) => {
  const idExamen = req.params.idExamen;
  db.query('SELECT * FROM Examen WHERE IdExamen = ?', [idExamen], (err, results) => {
    if (err) {
      res.status(500).json({ message: "Erreur dans la recherche de l'examen" });
      return;
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Examen non trouvé' });
    }
    const query = "DELETE FROM Examen WHERE IdExamen = ?";
    db.query(query, [idExamen], (err, results) => {
      if (err) {
        res.status(500).json({ message: "Erreur lors de la suppression de l'examen" });
        return;
      }
res.json({ message: 'Examen supprimé avec succès' });
    });
  });
});



// ajouter un utilisateur (inscription)
app.post('/utilisateur', (req, res) => {
  const { Prenom, Nom, Login, MotDePasse } = req.body;
  if (!Prenom || !Nom || !Login || !MotDePasse) {
    return res.status(400).json({ message: 'Tous les champs doivent être remplis' });
  }
  if (MotDePasse.length < 6) {
    return res.status(400).json({ message: 'Le mot de passe doit avoir au moins 6 caractères' });
  }
  db.query('SELECT * FROM Utilisateur WHERE Login = ?', [Login], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Erreur de la base de données' });
    }
if (results.length > 0) {
  return res.status(400).json({ message: 'Cet utilisateur existe déjà' });
}
bcrypt.hash(MotDePasse, 10, (err, hashedPassword) => {
  if (err) {
    return res.status(500).json({ message: 'Erreur lors du hachage du mot de passe' });
  }
  const query = 'INSERT INTO Utilisateur (Prenom, Nom, Login, MotDePasse) VALUES (?, ?, ?, ?)';
  const values = [Prenom, Nom, Login, hashedPassword];
  db.query(query, values, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Erreur lors de l\'ajout de l\'utilisateur' });
    }
    res.status(201).json({ message: 'Utilisateur inscrit avec succès' });
  });
});
});
});




// Authentification
// Route de connexion (authentification)
app.post('/login', (req, res) => {
  const { Login, MotDePasse } = req.body;
  db.query('SELECT * FROM Utilisateur WHERE Login = ?', [Login], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Erreur de la base de données' });
    }
    if (results.length === 0) {
      return res.status(400).json({ message: 'Utilisateur non trouvé' });
    }
    const utilisateur = results[0];
    bcrypt.compare(MotDePasse, utilisateur.MotDePasse, (err, result) => {
      if (err || !result) {
        return res.status(400).json({ message: 'Mot de passe incorrect' });
      }
      req.session.userId = utilisateur.IdUtilisateur;  // Stocker l'ID utilisateur dans la session
      res.json({
      message: 'Connexion réussie',
      userId: utilisateur.IdUtilisateur
});
});
});
});



// Route protégée : récupérer les informations de l'utilisateur
app.get('/profil', (req, res) => {
if (!req.session.userId) {
return res.status(401).json({ message: 'Utilisateur non authentifié' });
}
const userId = req.session.userId;
db.query('SELECT Prenom, Nom, Login FROM Utilisateur WHERE IdUtilisateur = ?', [userId], (err, results) => {
if (err) {
return res.status(500).json({ message: 'Erreur lors de la récupération du profil' });
}
res.json(results[0]);
});
});


// Route de déconnexion
app.post('/logout', (req, res) => {
  // Supprimer la session (détruire la session de l'utilisateur)
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Erreur lors de la déconnexion' });
    }
    // Rediriger ou envoyer un message de succès
    res.json({ message: 'Déconnexion réussie' });
  });
});



// Verifier si l'utilisateur est deconnecté
app.get('/profil', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Utilisateur non authentifié. Veuillez vous reconnecter.' });
  }
  const userId = req.session.userId;
  db.query('SELECT Prenom, Nom, Login FROM Utilisateur WHERE IdUtilisateur = ?', [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Erreur lors de la récupération du profil' });
    }
    res.json(results[0]);
  });
});


// modifier un utilisateur
app.put('/utilisateur/:idUtilisateur', (req, res) => {
  const idUtilisateur = req.params.idUtilisateur;  // Récupérer l'ID de l'utilisateur à modifier
  const { Prenom, Nom, Login, MotDePasse } = req.body;

  // Si un mot de passe est fourni, on le hache avant de l'enregistrer
  let query = 'UPDATE Utilisateur SET Prenom = ?, Nom = ?, Login = ?';
  let values = [Prenom, Nom, Login];

  // Si un mot de passe est fourni, on le hache et on l'ajoute à la requête
  if (MotDePasse) {
    bcrypt.hash(MotDePasse, 10, (err, hashedPassword) => {
      if (err) {
        return res.status(500).json({ message: 'Erreur lors du hachage du mot de passe' });
      }
      query += ', MotDePasse = ?';
      values.push(hashedPassword);
      // Ajouter la condition WHERE pour identifier l'utilisateur à modifier
      query += ' WHERE IdUtilisateur = ?';
      values.push(idUtilisateur);

      // Effectuer la mise à jour
      db.query(query, values, (err, result) => {
        if (err) {
          return res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'utilisateur' });
        }
        if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        res.json({ message: 'Utilisateur mis à jour avec succès' });
      });
    });
  } else {
    // Si aucun mot de passe n'est fourni, on effectue juste la mise à jour des autres champs
    query += ' WHERE IdUtilisateur = ?';
    values.push(idUtilisateur);
    db.query(query, values, (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'utilisateur' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
      res.json({ message: 'Utilisateur mis à jour avec succès' });
    });
  }
});



// Supprimer un utilisateur
app.delete('/utilisateur/:idUtilisateur', (req, res) => {
  const idUtilisateur = req.params.idUtilisateur;  // Récupérer l'ID de l'utilisateur à supprimer
  
  // Effectuer la suppression de l'utilisateur
  db.query('DELETE FROM Utilisateur WHERE IdUtilisateur = ?', [idUtilisateur], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Erreur lors de la suppression de l\'utilisateur' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.json({ message: 'Utilisateur supprimé avec succès' });
  });
});


// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
