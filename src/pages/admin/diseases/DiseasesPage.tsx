import type { Disease } from "@/api/disease/types";
import { useDeleteDisease, useDiseases } from "@/api/hooks/useDiseases";
import { DiseaseFormDialog } from "@/pages/admin/diseases/DiseaseFormDialog";
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

export default function DiseasesPage() {
  const { data: diseases = [], isLoading, isError, refetch } = useDiseases();
  const deleteMutation = useDeleteDisease();

  const [formOpen, setFormOpen] = useState(false);
  const [editingDisease, setEditingDisease] = useState<Disease | null>(null);
  const [deletingDisease, setDeletingDisease] = useState<Disease | null>(null);

  const openCreate = () => {
    setEditingDisease(null);
    setFormOpen(true);
  };

  const openEdit = (disease: Disease) => {
    setEditingDisease(disease);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingDisease(null);
  };

  const confirmDelete = () => {
    if (!deletingDisease) return;

    deleteMutation.mutate(deletingDisease.id, {
      onSuccess: () => setDeletingDisease(null),
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
          Diseases
        </Typography>
        <Button variant="contained" onClick={openCreate}>
          Add disease
        </Button>
      </Box>

      {isError && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          action={<Button onClick={() => refetch()}>Retry</Button>}
        >
          Failed to load diseases.
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
              {diseases.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      No diseases yet. Add the first one.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                diseases.map((disease) => (
                  <TableRow key={disease.id} hover>
                    <TableCell>{disease.name}</TableCell>
                    <TableCell align="right">
                      <Button size="small" onClick={() => openEdit(disease)}>
                        Edit
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => setDeletingDisease(disease)}
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

      <DiseaseFormDialog
        open={formOpen}
        disease={editingDisease}
        onClose={closeForm}
      />

      <Dialog
        open={deletingDisease !== null}
        onClose={() => !deleteMutation.isPending && setDeletingDisease(null)}
      >
        <DialogTitle>Delete disease</DialogTitle>
        <DialogContent>
          {deleteMutation.isError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Failed to delete disease. Please try again.
            </Alert>
          )}
          <DialogContentText>
            Are you sure you want to delete &quot;{deletingDisease?.name}&quot;?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeletingDisease(null)}
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
