import {
  useChangeEmail,
  useChangePassword,
  useProfile,
  useSendChangeEmailOtp,
  useUpdateProfile,
} from "@/api/hooks/useProfile";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControlLabel,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

type ProfileFormData = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  isTwoFactorEnabled: boolean;
};

type PasswordFormData = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export default function ProfilePage() {
  const { data: profile, isLoading, isError, refetch } = useProfile();
  const updateProfileMutation = useUpdateProfile();
  const changePasswordMutation = useChangePassword();
  const sendEmailOtpMutation = useSendChangeEmailOtp();
  const changeEmailMutation = useChangeEmail();

  const [profileSuccess, setProfileSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [emailStep, setEmailStep] = useState<"idle" | "otp-sent">("idle");
  const [newEmail, setNewEmail] = useState("");
  const [emailToken, setEmailToken] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailSuccess, setEmailSuccess] = useState(false);

  const profileForm = useForm<ProfileFormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      isTwoFactorEnabled: false,
    },
  });

  const passwordForm = useForm<PasswordFormData>({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (!profile) return;
    profileForm.reset({
      firstName: profile.name ?? "",
      lastName: profile.lastName ?? "",
      phoneNumber: profile.phoneNumber ?? "",
      isTwoFactorEnabled: profile.isTwoFactorEnabled,
    });
    updateProfileMutation.reset();
    setProfileSuccess(false);
  }, [profile, profileForm.reset]);

  const onProfileSubmit = (data: ProfileFormData) => {
    setProfileSuccess(false);
    updateProfileMutation.mutate(data, {
      onSuccess: () => setProfileSuccess(true),
    });
  };

  const onPasswordSubmit = (data: PasswordFormData) => {
    if (data.newPassword !== data.confirmPassword) {
      passwordForm.setError("confirmPassword", {
        message: "Passwords do not match",
      });
      return;
    }

    setPasswordSuccess(false);
    changePasswordMutation.mutate(data, {
      onSuccess: () => {
        setPasswordSuccess(true);
        passwordForm.reset();
      },
    });
  };

  const handleSendEmailOtp = () => {
    const trimmed = newEmail.trim();
    if (!trimmed) {
      setEmailError("Enter a new email address");
      return;
    }

    setEmailError("");
    sendEmailOtpMutation.mutate(trimmed, {
      onSuccess: () => setEmailStep("otp-sent"),
      onError: () => setEmailError("Failed to send verification code"),
    });
  };

  const handleConfirmEmail = () => {
    const trimmedEmail = newEmail.trim();
    const trimmedToken = emailToken.trim();

    if (!trimmedEmail || !trimmedToken) {
      setEmailError("Email and verification code are required");
      return;
    }

    setEmailError("");
    setEmailSuccess(false);
    changeEmailMutation.mutate(
      { newEmail: trimmedEmail, token: trimmedToken },
      {
        onSuccess: () => {
          setEmailStep("idle");
          setNewEmail("");
          setEmailToken("");
          setEmailSuccess(true);
          changeEmailMutation.reset();
        },
        onError: () => setEmailError("Failed to update email"),
      },
    );
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !profile) {
    return (
      <Alert severity="error" action={<Button onClick={() => refetch()}>Retry</Button>}>
        Failed to load profile.
      </Alert>
    );
  }

  return (
    <Box sx={{ maxWidth: 640 }}>
      <Typography variant="h4" component="h1" fontWeight={600} sx={{ mb: 3 }}>
        Profile
      </Typography>

      {profile.isNeedToChangePassword && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          You need to change your password.
        </Alert>
      )}

      <Stack spacing={3}>
        <Paper variant="outlined" sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Personal information
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Email: <strong>{profile.email ?? "—"}</strong>
          </Typography>

          {profileSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Profile updated successfully.
            </Alert>
          )}
          {updateProfileMutation.isError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Failed to update profile.
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={profileForm.handleSubmit(onProfileSubmit)}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <Controller
              control={profileForm.control}
              name="firstName"
              rules={{ required: "First name is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="First name"
                  fullWidth
                  error={Boolean(profileForm.formState.errors.firstName)}
                  helperText={profileForm.formState.errors.firstName?.message}
                />
              )}
            />
            <Controller
              control={profileForm.control}
              name="lastName"
              rules={{ required: "Last name is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Last name"
                  fullWidth
                  error={Boolean(profileForm.formState.errors.lastName)}
                  helperText={profileForm.formState.errors.lastName?.message}
                />
              )}
            />
            <Controller
              control={profileForm.control}
              name="phoneNumber"
              render={({ field }) => (
                <TextField {...field} label="Phone number" fullWidth />
              )}
            />
            <Controller
              control={profileForm.control}
              name="isTwoFactorEnabled"
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={field.value}
                      onChange={field.onChange}
                    />
                  }
                  label="Two-factor authentication"
                />
              )}
            />
            <Box>
              <Button
                type="submit"
                variant="contained"
                disabled={updateProfileMutation.isPending}
              >
                {updateProfileMutation.isPending ? "Saving..." : "Save profile"}
              </Button>
            </Box>
          </Box>
        </Paper>

        <Paper variant="outlined" sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Change password
          </Typography>

          {passwordSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Password changed successfully.
            </Alert>
          )}
          {changePasswordMutation.isError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Failed to change password. Check your current password.
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <Controller
              control={passwordForm.control}
              name="oldPassword"
              rules={{ required: "Current password is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Current password"
                  type="password"
                  fullWidth
                  autoComplete="current-password"
                  error={Boolean(passwordForm.formState.errors.oldPassword)}
                  helperText={passwordForm.formState.errors.oldPassword?.message}
                />
              )}
            />
            <Controller
              control={passwordForm.control}
              name="newPassword"
              rules={{
                required: "New password is required",
                minLength: { value: 6, message: "Minimum 6 characters" },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="New password"
                  type="password"
                  fullWidth
                  autoComplete="new-password"
                  error={Boolean(passwordForm.formState.errors.newPassword)}
                  helperText={passwordForm.formState.errors.newPassword?.message}
                />
              )}
            />
            <Controller
              control={passwordForm.control}
              name="confirmPassword"
              rules={{ required: "Confirm your new password" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Confirm new password"
                  type="password"
                  fullWidth
                  autoComplete="new-password"
                  error={Boolean(passwordForm.formState.errors.confirmPassword)}
                  helperText={
                    passwordForm.formState.errors.confirmPassword?.message
                  }
                />
              )}
            />
            <Box>
              <Button
                type="submit"
                variant="contained"
                disabled={changePasswordMutation.isPending}
              >
                {changePasswordMutation.isPending
                  ? "Updating..."
                  : "Change password"}
              </Button>
            </Box>
          </Box>
        </Paper>

        <Paper variant="outlined" sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Change email
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Current email: <strong>{profile.email ?? "—"}</strong>
          </Typography>

          {emailError && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setEmailError("")}>
              {emailError}
            </Alert>
          )}
          {emailStep === "otp-sent" && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Verification code sent to {newEmail}. Enter it below to confirm.
            </Alert>
          )}
          {emailSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Email updated successfully.
            </Alert>
          )}

          <Stack spacing={2}>
            <TextField
              label="New email"
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              fullWidth
              disabled={sendEmailOtpMutation.isPending}
            />
            <Button
              variant="outlined"
              onClick={handleSendEmailOtp}
              disabled={sendEmailOtpMutation.isPending}
              sx={{ alignSelf: "flex-start" }}
            >
              {sendEmailOtpMutation.isPending
                ? "Sending..."
                : "Send verification code"}
            </Button>

            {emailStep === "otp-sent" && (
              <>
                <Divider />
                <TextField
                  label="Verification code"
                  value={emailToken}
                  onChange={(e) => setEmailToken(e.target.value)}
                  fullWidth
                />
                <Button
                  variant="contained"
                  onClick={handleConfirmEmail}
                  disabled={changeEmailMutation.isPending}
                  sx={{ alignSelf: "flex-start" }}
                >
                  {changeEmailMutation.isPending
                    ? "Confirming..."
                    : "Confirm new email"}
                </Button>
              </>
            )}
          </Stack>
        </Paper>
      </Stack>
    </Box>
  );
}
