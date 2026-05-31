import { useSignIn } from "@/api/hooks/useSignIn";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";

type SignInFormData = {
  email: string;
  password: string;
};

export default function SignInPage() {
  const { mutate, isPending, isError } = useSignIn();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: SignInFormData) => {
    mutate(data);
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          py: 4,
        }}
      >
        <Typography variant="h4" component="h1" fontWeight={600} sx={{ mb: 7 }}>
          Welcome Back
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ display: "flex", flexDirection: "column", gap: 4.5 }}
        >
          <Controller
            control={control}
            name="email"
            rules={{
              required: "Email is required",
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Email"
                type="email"
                autoComplete="email"
                autoCapitalize="none"
                fullWidth
                error={Boolean(errors.email)}
                helperText={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            rules={{
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Minimum 6 characters",
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Password"
                type="password"
                autoComplete="current-password"
                fullWidth
                error={Boolean(errors.password)}
                helperText={errors.password?.message}
              />
            )}
          />

          {isPending && (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <CircularProgress size={32} />
            </Box>
          )}

          {isError && (
            <Alert severity="error">Invalid email or password</Alert>
          )}

          <Link
            component="button"
            type="button"
            variant="body2"
            underline="always"
            sx={{ alignSelf: "flex-start", mt: 1 }}
            onClick={() => {}}
          >
            Forgot Password?
          </Link>

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={isPending}
            sx={{ mt: 1 }}
          >
            Log In
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
