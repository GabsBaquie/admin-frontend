"use client";

import { AuthContext } from "@/app/context/AuthContext";
import { fetchWithAuth } from "@/app/utils/fetchWithAuth";
import jwtDecode from "jwt-decode";
import React, { useContext, useEffect, useState } from "react";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  created_at: string;
}

interface DecodedToken {
  userId: number;
  username: string;
  email: string;
  role: string;
}

const UsersManager: React.FC = () => {
  const { token } = useContext(AuthContext);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<DecodedToken | null>(null);

  // États pour le formulaire de création
  const [createForm, setCreateForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
  });

  // États pour le formulaire d'édition
  const [editForm, setEditForm] = useState({
    username: "",
    email: "",
    role: "user",
  });

  useEffect(() => {
    // Récupérer les informations de l'utilisateur actuel
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        setCurrentUser(decoded);
      } catch (err) {
        console.error("Erreur lors du décodage du token:", err);
      }
    }

    const fetchUsers = async () => {
      try {
        const data: User[] = await fetchWithAuth("/admin/users", {
          method: "GET",
        });
        setUsers(data);
        setLoading(false);
      } catch (err) {
        if (err instanceof Error) {
          setError(
            err.message || "Erreur lors de la récupération des utilisateurs"
          );
          setLoading(false);
        }
      }
    };

    fetchUsers();
  }, [token]);

  // Fonctions de protection de sécurité
  const canDeleteUser = (userId: number): boolean => {
    if (!currentUser) return false;

    // Seuls les admins peuvent supprimer des utilisateurs
    if (currentUser.role !== "admin") {
      return false;
    }

    // L'utilisateur ne peut pas se supprimer lui-même
    if (currentUser.userId === userId) {
      return false;
    }

    // Vérifier qu'il reste au moins 2 admins
    const adminCount = users.filter((user) => user.role === "admin").length;
    const userToDelete = users.find((user) => user.id === userId);

    if (userToDelete?.role === "admin" && adminCount <= 2) {
      return false;
    }

    return true;
  };

  const canEditUser = (userId: number): boolean => {
    if (!currentUser) return false;

    // Seuls les admins peuvent modifier des utilisateurs
    if (currentUser.role !== "admin") {
      return false;
    }

    // L'utilisateur ne peut pas modifier son propre rôle
    if (currentUser.userId === userId) {
      return false;
    }

    return true;
  };

  const canCreateUser = (): boolean => {
    if (!currentUser) return false;

    // Seuls les admins peuvent créer des utilisateurs
    return currentUser.role === "admin";
  };

  const getDeleteErrorMessage = (userId: number): string | null => {
    if (!currentUser) return "Erreur d'authentification";

    if (currentUser.role !== "admin") {
      return "Seuls les administrateurs peuvent supprimer des utilisateurs";
    }

    if (currentUser.userId === userId) {
      return "Vous ne pouvez pas vous supprimer vous-même";
    }

    const userToDelete = users.find((user) => user.id === userId);
    const adminCount = users.filter((user) => user.role === "admin").length;

    if (userToDelete?.role === "admin" && adminCount <= 2) {
      return "Impossible de supprimer un administrateur (minimum 2 admins requis)";
    }

    return null;
  };

  const getEditErrorMessage = (userId: number): string | null => {
    if (!currentUser) return "Erreur d'authentification";

    if (currentUser.role !== "admin") {
      return "Seuls les administrateurs peuvent modifier des utilisateurs";
    }

    if (currentUser.userId === userId) {
      return "Vous ne pouvez pas modifier votre propre profil ici. Utilisez la section Profil.";
    }

    return null;
  };

  const getCreateErrorMessage = (): string | null => {
    if (!currentUser) return "Erreur d'authentification";

    if (currentUser.role !== "admin") {
      return "Seuls les administrateurs peuvent créer des utilisateurs";
    }

    return null;
  };

  const deleteUser = async (id: number) => {
    // Vérifications de sécurité
    if (!canDeleteUser(id)) {
      const errorMsg = getDeleteErrorMessage(id);
      setError(errorMsg || "Action non autorisée");
      return;
    }

    if (!confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?"))
      return;
    try {
      await fetchWithAuth(`/admin/users/${id}`, {
        method: "DELETE",
      });
      setUsers(users.filter((user) => user.id !== id));
    } catch (err) {
      if (err instanceof Error) {
        setError(
          err.message || "Erreur lors de la suppression de l'utilisateur"
        );
      }
    }
  };

  const handleCreateUser = async () => {
    // Vérifications de sécurité
    if (!canCreateUser()) {
      const errorMsg = getCreateErrorMessage();
      setError(errorMsg || "Action non autorisée");
      return;
    }

    try {
      const newUser = await fetchWithAuth("/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createForm),
      });

      setUsers([...users, newUser as User]);
      setShowCreateForm(false);
      setCreateForm({ username: "", email: "", password: "", role: "user" });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "Erreur lors de la création de l'utilisateur");
      }
    }
  };

  const handleEditUser = async () => {
    if (!editingUser) return;

    // Vérifications de sécurité supplémentaires
    if (!canEditUser(editingUser.id)) {
      const errorMsg = getEditErrorMessage(editingUser.id);
      setError(errorMsg || "Action non autorisée");
      return;
    }

    // Empêcher un admin de se dégrader lui-même
    if (currentUser?.userId === editingUser.id && editForm.role !== "admin") {
      setError("Vous ne pouvez pas vous dégrader vous-même");
      return;
    }

    // Vérifier qu'il reste au moins 2 admins si on dégrade un admin
    if (editingUser.role === "admin" && editForm.role !== "admin") {
      const adminCount = users.filter((user) => user.role === "admin").length;
      if (adminCount <= 2) {
        setError(
          "Impossible de dégrader un administrateur (minimum 2 admins requis)"
        );
        return;
      }
    }

    try {
      const updatedUser = await fetchWithAuth(
        `/admin/users/${editingUser.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editForm),
        }
      );

      setUsers(
        users.map((user) =>
          user.id === editingUser.id ? (updatedUser as User) : user
        )
      );
      setEditingUser(null);
      setEditForm({ username: "", email: "", role: "user" });
    } catch (err) {
      if (err instanceof Error) {
        setError(
          err.message || "Erreur lors de la mise à jour de l'utilisateur"
        );
      }
    }
  };

  const openEditForm = (user: User) => {
    // Vérifications de sécurité
    if (!canEditUser(user.id)) {
      const errorMsg = getEditErrorMessage(user.id);
      setError(errorMsg || "Action non autorisée");
      return;
    }

    setEditingUser(user);
    setEditForm({
      username: user.username,
      email: user.email,
      role: user.role,
    });
  };

  if (loading)
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
        <Typography ml={2}>Chargement...</Typography>
      </Box>
    );

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Gestion des Utilisateurs
      </Typography>
      <Box mb={3}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            if (!canCreateUser()) {
              const errorMsg = getCreateErrorMessage();
              setError(errorMsg || "Action non autorisée");
              return;
            }
            setShowCreateForm(true);
          }}
          disabled={!canCreateUser()}
          title={
            !canCreateUser()
              ? getCreateErrorMessage() || "Action non autorisée"
              : ""
          }
        >
          Ajouter un Utilisateur
        </Button>
      </Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Alert severity="info" sx={{ mb: 2 }}>
        <Typography variant="body2">
          <strong>Règles de sécurité :</strong>
          <br />• Seuls les administrateurs peuvent gérer les utilisateurs
          <br />• Vous ne pouvez pas vous supprimer ou modifier votre propre
          profil ici
          <br />• Impossible de supprimer un admin s&apos;il ne reste que 2
          admins
          <br />• Utilisez la section &quot;Profil&quot; pour modifier vos
          propres informations
        </Typography>
      </Alert>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nom d&apos;utilisateur</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Rôle</TableCell>
              <TableCell>Créé le</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user.id}
                sx={{
                  backgroundColor:
                    currentUser?.userId === user.id ? "#e3f2fd" : "inherit",
                  "&:hover": {
                    backgroundColor:
                      currentUser?.userId === user.id ? "#bbdefb" : "#f5f5f5",
                  },
                }}
              >
                <TableCell>
                  {user.id}
                  {currentUser?.userId === user.id && (
                    <Typography
                      variant="caption"
                      color="primary"
                      sx={{ ml: 1 }}
                    >
                      (Vous)
                    </Typography>
                  )}
                </TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  {new Date(user.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    className="mr-2"
                    onClick={() => openEditForm(user)}
                    disabled={!canEditUser(user.id)}
                    title={
                      !canEditUser(user.id)
                        ? getEditErrorMessage(user.id) || "Action non autorisée"
                        : ""
                    }
                  >
                    Éditer
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    size="small"
                    onClick={() => deleteUser(user.id)}
                    disabled={!canDeleteUser(user.id)}
                    title={
                      !canDeleteUser(user.id)
                        ? getDeleteErrorMessage(user.id) ||
                          "Action non autorisée"
                        : ""
                    }
                  >
                    Supprimer
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal de création d'utilisateur */}
      <Dialog
        open={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Créer un nouvel utilisateur</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Nom d'utilisateur"
              value={createForm.username}
              onChange={(e) =>
                setCreateForm({ ...createForm, username: e.target.value })
              }
              margin="normal"
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={createForm.email}
              onChange={(e) =>
                setCreateForm({ ...createForm, email: e.target.value })
              }
              margin="normal"
            />
            <TextField
              fullWidth
              label="Mot de passe"
              type="password"
              value={createForm.password}
              onChange={(e) =>
                setCreateForm({ ...createForm, password: e.target.value })
              }
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Rôle</InputLabel>
              <Select
                value={createForm.role}
                onChange={(e) =>
                  setCreateForm({ ...createForm, role: e.target.value })
                }
              >
                <MenuItem value="user">Utilisateur</MenuItem>
                <MenuItem value="admin">Administrateur</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCreateForm(false)}>Annuler</Button>
          <Button onClick={handleCreateUser} variant="contained">
            Créer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal d'édition d'utilisateur */}
      <Dialog
        open={!!editingUser}
        onClose={() => setEditingUser(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Modifier l&apos;utilisateur</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Nom d'utilisateur"
              value={editForm.username}
              onChange={(e) =>
                setEditForm({ ...editForm, username: e.target.value })
              }
              margin="normal"
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={editForm.email}
              onChange={(e) =>
                setEditForm({ ...editForm, email: e.target.value })
              }
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Rôle</InputLabel>
              <Select
                value={editForm.role}
                onChange={(e) =>
                  setEditForm({ ...editForm, role: e.target.value })
                }
              >
                <MenuItem value="user">Utilisateur</MenuItem>
                <MenuItem value="admin">Administrateur</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingUser(null)}>Annuler</Button>
          <Button onClick={handleEditUser} variant="contained">
            Modifier
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UsersManager;
