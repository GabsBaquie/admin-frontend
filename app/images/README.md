# 🖼️ Gestion des Images Serveur

## 📋 Fonctionnalités

Cette section permet de gérer les images stockées sur le serveur :

### ✅ **Fonctionnalités disponibles :**

1. **📋 Lister les images** - Voir toutes les images disponibles sur le serveur
2. **🗑️ Supprimer une image** - Supprimer définitivement une image du serveur
3. **✏️ Renommer une image** - Changer le nom d'une image
4. **🔄 Actualiser** - Recharger la liste des images
5. **👁️ Prévisualisation** - Voir un aperçu de chaque image

### 🎯 **Utilisation :**

1. **Accès** : Cliquez sur "Images Serveur" dans la sidebar
2. **Suppression** : Cliquez sur l'icône 🗑️ rouge à côté de l'image
3. **Renommage** : Cliquez sur l'icône ✏️ et saisissez le nouveau nom
4. **Actualisation** : Cliquez sur le bouton "Actualiser" en haut à droite

### 🔧 **API Endpoints :**

- `GET /api/upload/list` - Lister toutes les images
- `DELETE /api/upload/image/:filename` - Supprimer une image
- `PUT /api/upload/image/:filename` - Renommer une image

### 📁 **Structure des fichiers :**

```
uploads/
└── images/
    ├── image1.jpg
    ├── image2.png
    └── ...
```

### ⚠️ **Notes importantes :**

- La suppression est **définitive** - pas de corbeille
- Le renommage ne peut pas utiliser un nom déjà existant
- Les images sont stockées dans `/uploads/images/` sur le serveur
- L'URL complète des images est construite automatiquement

### 🧪 **Test de l'API :**

Pour tester les fonctionnalités de l'API :

```bash
cd /Users/gabriellebaquie/Dev/nation-sounds-api
node test-image-management.js
```

### 🎨 **Interface utilisateur :**

- **Grille responsive** : Les images s'adaptent à la taille de l'écran
- **Actions rapides** : Boutons d'action directement sur chaque image
- **Feedback visuel** : Messages de confirmation et d'erreur
- **Chargement** : Indicateurs de progression pendant les opérations
