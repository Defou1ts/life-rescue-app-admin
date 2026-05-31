import type { Allergy } from "@/api/allergy/types";
import { useAllergies, useDeleteAllergy } from "@/api/hooks/useAllergies";
import { AllergyFormDialog } from "@/pages/admin/allergys/AllergyFormDialog";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useState } from "react";

export default function AllergysPage() {
  const { data: allergies = [], isLoading, isError, refetch } = useAllergies();
  const deleteMutation = useDeleteAllergy();

  const [formOpen, setFormOpen] = useState(false);
  const [editingAllergy, setEditingAllergy] = useState<Allergy | null>(null);
  const [deletingAllergy, setDeletingAllergy] = useState<Allergy | null>(null);

  const openCreate = () => {
    setEditingAllergy(null);
    setFormOpen(true);
  };

  const openEdit = (allergy: Allergy) => {
    setEditingAllergy(allergy);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingAllergy(null);
  };

  const confirmDelete = () => {
    if (!deletingAllergy) return;

    deleteMutation.mutate(deletingAllergy.id, {
      onSuccess: () => setDeletingAllergy(null),
    });
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1" fontWeight={600}>
          Allergys
        </Typography>
        <Button variant="contained" onClick={openCreate}>
          Add allergy
        </Button>
      </Box>

      {isError && (
        <Alert severity="error" sx={{ mb: 2 }} action={<Button onClick={() => refetch()}>Retry</Button>}>
          Failed to load allergies.
        </Alert>
      )}

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="right" width={180}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allergies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      No allergies yet. Add the first one.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                allergies.map((allergy) => (
                  <TableRow key={allergy.id} hover>
                    <TableCell>{allergy.name}</TableCell>
                    <TableCell align="right">
                      <Button size="small" onClick={() => openEdit(allergy)}>
                        Edit
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => setDeletingAllergy(allergy)}
                        sx={{ ml: 1 }}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <AllergyFormDialog
        open={formOpen}
        allergy={editingAllergy}
        onClose={closeForm}
      />

      <Dialog
        open={deletingAllergy !== null}
        onClose={() => !deleteMutation.isPending && setDeletingAllergy(null)}
      >
        <DialogTitle>Delete allergy</DialogTitle>
        <DialogContent>
          {deleteMutation.isError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Failed to delete allergy. Please try again.
            </Alert>
          )}
          <DialogContentText>
            Are you sure you want to delete &quot;{deletingAllergy?.name}&quot;?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeletingAllergy(null)}
            disabled={deleteMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={confirmDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
