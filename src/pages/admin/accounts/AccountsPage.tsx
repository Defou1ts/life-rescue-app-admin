import type { AccountListItem, Role } from "@/api/account/types";
import { useAccountsList, useRoles } from "@/api/hooks/useAccounts";
import { AccountDetailDialog } from "@/pages/admin/accounts/AccountDetailDialog";
import { CreateAccountDialog } from "@/pages/admin/accounts/CreateAccountDialog";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  FormControlLabel,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";

const PAGE_SIZE = 10;

export default function AccountsPage() {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<Role[]>([]);
  const [includeBlocked, setIncludeBlocked] = useState(true);
  const [includeDeleted, setIncludeDeleted] = useState(false);

  const [createOpen, setCreateOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<AccountListItem | null>(
    null,
  );

  const { data: roles = [] } = useRoles();

  const filterParams = useMemo(
    () => ({
      page: page + 1,
      pageSize: PAGE_SIZE,
      roles:
        selectedRoles.length > 0 ? selectedRoles.map((r) => r.id) : null,
      includeBlocked,
      includeDeleted,
      search: search.trim(),
    }),
    [page, selectedRoles, includeBlocked, includeDeleted, search],
  );

  const { data, isLoading, isError, refetch } = useAccountsList(filterParams);
  const items = data?.items ?? [];

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
          Accounts
        </Typography>
        <Button variant="contained" onClick={() => setCreateOpen(true)}>
          Create account
        </Button>
      </Box>

      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            alignItems: "center",
          }}
        >
          <TextField
            label="Search"
            size="small"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            sx={{ minWidth: 200 }}
          />
          <Autocomplete
            multiple
            size="small"
            options={roles}
            getOptionLabel={(option) => option.title}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={selectedRoles}
            onChange={(_, value) => {
              setSelectedRoles(value);
              setPage(0);
            }}
            sx={{ minWidth: 240, flex: 1 }}
            renderInput={(params) => <TextField {...params} label="Roles" />}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={includeBlocked}
                onChange={(e) => {
                  setIncludeBlocked(e.target.checked);
                  setPage(0);
                }}
              />
            }
            label="Include blocked"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={includeDeleted}
                onChange={(e) => {
                  setIncludeDeleted(e.target.checked);
                  setPage(0);
                }}
              />
            }
            label="Include deleted"
          />
        </Box>
      </Paper>

      {isError && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          action={<Button onClick={() => refetch()}>Retry</Button>}
        >
          Failed to load accounts.
        </Alert>
      )}

      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Roles</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                  <CircularProgress size={32} />
                </TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">No accounts found.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              items.map((account) => {
                const isDeleted = account.isDeleted;

                return (
                <TableRow
                  key={account.id}
                  hover={!isDeleted}
                  onClick={
                    isDeleted ? undefined : () => setSelectedAccount(account)
                  }
                  sx={{
                    cursor: isDeleted ? "default" : "pointer",
                    opacity: isDeleted ? 0.6 : 1,
                  }}
                >
                  <TableCell>{account.email}</TableCell>
                  <TableCell>
                    {[account.name, account.lastName].filter(Boolean).join(" ") ||
                      "—"}
                  </TableCell>
                  <TableCell>{account.phoneNumber ?? "—"}</TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {account.roles.map((role) => (
                        <Chip key={role.id} label={role.title} size="small" />
                      ))}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {account.isBlocked && (
                        <Chip label="Blocked" color="warning" size="small" />
                      )}
                      {account.isDeleted && (
                        <Chip label="Deleted" color="error" size="small" />
                      )}
                      {!account.isBlocked && !account.isDeleted && (
                        <Chip label="Active" color="success" size="small" variant="outlined" />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    {new Date(account.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
                );
              })
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

      <CreateAccountDialog
        open={createOpen}
        roles={roles}
        onClose={() => setCreateOpen(false)}
      />

      {selectedAccount && !selectedAccount.isDeleted && (
        <AccountDetailDialog
          account={selectedAccount}
          onClose={() => setSelectedAccount(null)}
          onActionComplete={() => refetch()}
        />
      )}
    </Box>
  );
}
