import type { KycListItem } from "@/api/kyc/types";
import { useKycList } from "@/api/hooks/useKyc";
import { KycDetailDialog } from "@/pages/admin/kyc/KycDetailDialog";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { useState } from "react";

const PAGE_SIZE = 10;

export default function KycPage() {
  const [page, setPage] = useState(0);
  const [selectedKyc, setSelectedKyc] = useState<KycListItem | null>(null);

  const { data, isLoading, isError, refetch } = useKycList(page + 1, PAGE_SIZE);
  const items = data?.items ?? [];

  return (
    <Box>
      <Typography variant="h4" component="h1" fontWeight={600} sx={{ mb: 3 }}>
        KYC
      </Typography>

      {isError && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          action={<Button onClick={() => refetch()}>Retry</Button>}
        >
          Failed to load KYC applications.
        </Alert>
      )}

      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Account ID</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created at</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ py: 6 }}>
                  <CircularProgress size={32} />
                </TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    No KYC applications in progress.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              items.map((kyc) => (
                <TableRow
                  key={kyc.id}
                  hover
                  sx={{ cursor: "pointer" }}
                  onClick={() => setSelectedKyc(kyc)}
                >
                  <TableCell sx={{ fontFamily: "monospace", fontSize: 13 }}>
                    {kyc.accountId}
                  </TableCell>
                  <TableCell>
                    <Chip label={kyc.status} size="small" />
                  </TableCell>
                  <TableCell>
                    {new Date(kyc.createdAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={data?.totalCount ?? 0}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={PAGE_SIZE}
          rowsPerPageOptions={[PAGE_SIZE]}
        />
      </TableContainer>

      <KycDetailDialog
        kyc={selectedKyc}
        onClose={() => setSelectedKyc(null)}
        onActionComplete={() => refetch()}
      />
    </Box>
  );
}
