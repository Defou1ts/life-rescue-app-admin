import { useLogout } from "@/api/hooks/useLogout";
import { adminNavItems } from "@/config/adminNav";
import LogoutIcon from "@mui/icons-material/Logout";
import {
  Box,
  Button,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import { NavLink, Outlet } from "react-router";

const drawerWidth = 240;

export default function AdminLayout() {
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <Toolbar>
          <Typography variant="subtitle1" fontWeight={600} noWrap>
            Life Rescue Admin
          </Typography>
        </Toolbar>
        <List component="nav" disablePadding sx={{ flex: 1 }}>
          {adminNavItems.map((item) => (
            <ListItemButton
              key={item.path}
              component={NavLink}
              to={item.path}
              sx={{
                "&.active": {
                  bgcolor: "action.selected",
                },
              }}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
        <Box sx={{ p: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            color="inherit"
            startIcon={<LogoutIcon />}
            disabled={isLoggingOut}
            onClick={() => logout()}
          >
            Logout
          </Button>
        </Box>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          bgcolor: "background.default",
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
