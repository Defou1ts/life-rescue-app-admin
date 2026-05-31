import { Box, Typography } from "@mui/material";

type PlaceholderPageProps = {
  title: string;
};

export function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <Box>
      <Typography variant="h4" component="h1" fontWeight={600} gutterBottom>
        {title}
      </Typography>
      <Typography color="text.secondary">
        This section is under development.
      </Typography>
    </Box>
  );
}
