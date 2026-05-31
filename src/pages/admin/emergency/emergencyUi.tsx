import type { Location, SymptomTreeItem } from "@/api/emergency/types";
import {
  Box,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import type { ReactNode } from "react";

function isEmpty(value: ReactNode) {
  return value === null || value === undefined || value === "";
}

export function DetailRow({
  label,
  value,
  monospace = false,
  fullWidth = false,
}: {
  label: string;
  value: ReactNode;
  monospace?: boolean;
  fullWidth?: boolean;
}) {
  const display = isEmpty(value) ? "—" : value;

  return (
    <Grid size={{ xs: 12, sm: fullWidth ? 12 : 6 }}>
      <Box
        sx={{
          height: "100%",
          p: 1.5,
          borderRadius: 1,
          bgcolor: "action.hover",
          border: 1,
          borderColor: "divider",
        }}
      >
        <Typography
          variant="caption"
          color="text.secondary"
          fontWeight={600}
          sx={{ textTransform: "uppercase", letterSpacing: 0.4 }}
        >
          {label}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            mt: 0.75,
            wordBreak: "break-word",
            ...(monospace && {
              fontFamily: "monospace",
              fontSize: "0.8rem",
              lineHeight: 1.5,
            }),
          }}
        >
          {display}
        </Typography>
      </Box>
    </Grid>
  );
}

export function DetailSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography
        variant="subtitle2"
        fontWeight={700}
        sx={{
          mb: 1.5,
          pb: 1,
          borderBottom: 2,
          borderColor: "primary.main",
          color: "text.primary",
        }}
      >
        {title}
      </Typography>
      <Grid container spacing={1.5}>
        {children}
      </Grid>
    </Box>
  );
}

export function DetailPersonRow({
  label,
  name,
  id,
}: {
  label: string;
  name: string | null | undefined;
  id: string | null | undefined;
}) {
  if (!name && !id) {
    return <DetailRow label={label} value={null} />;
  }

  return (
    <Grid size={{ xs: 12, sm: 6 }}>
      <Box
        sx={{
          height: "100%",
          p: 1.5,
          borderRadius: 1,
          bgcolor: "action.hover",
          border: 1,
          borderColor: "divider",
        }}
      >
        <Typography
          variant="caption"
          color="text.secondary"
          fontWeight={600}
          sx={{ textTransform: "uppercase", letterSpacing: 0.4 }}
        >
          {label}
        </Typography>
        {name && (
          <Typography variant="body2" fontWeight={600} sx={{ mt: 0.75 }}>
            {name}
          </Typography>
        )}
        {id && (
          <Typography
            variant="caption"
            sx={{
              display: "block",
              mt: name ? 0.25 : 0.75,
              fontFamily: "monospace",
              color: "text.secondary",
              wordBreak: "break-all",
            }}
          >
            {id}
          </Typography>
        )}
      </Box>
    </Grid>
  );
}

export function formatLocation(location: Location | null | undefined) {
  if (!location) return null;
  return `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`;
}

export function formatDate(value: string | null | undefined) {
  if (!value) return null;
  return new Date(value).toLocaleString();
}

export function DeclinedParamedicCard({
  title,
  reason,
  explanation,
  subtitle,
}: {
  title: string;
  reason: string;
  explanation?: string | null;
  subtitle: string;
}) {
  return (
    <Paper variant="outlined" sx={{ p: 1.5 }}>
      <Typography variant="body2" fontWeight={600}>
        {title}
      </Typography>
      <Typography variant="body2" sx={{ mt: 0.5 }}>
        {reason}
      </Typography>
      {explanation && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {explanation}
        </Typography>
      )}
      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
        {subtitle}
      </Typography>
    </Paper>
  );
}

export function SymptomTreeView({ items }: { items: SymptomTreeItem[] }) {
  if (items.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No symptom data
      </Typography>
    );
  }

  return (
    <Stack spacing={1.5}>
      {items.map((item) => (
        <SymptomTreeNode key={item.questionId} item={item} depth={0} />
      ))}
    </Stack>
  );
}

function SymptomTreeNode({
  item,
  depth,
}: {
  item: SymptomTreeItem;
  depth: number;
}) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 1.5,
        ml: depth * 2,
        bgcolor: depth === 0 ? "background.paper" : "action.hover",
      }}
    >
      <Typography variant="subtitle2" fontWeight={600} color="primary">
        {item.questionText}
      </Typography>
      <Stack spacing={0.75} sx={{ mt: 1 }}>
        {item.selectedAnswers.map((answer) => (
          <Box key={answer.answerId}>
            <Typography variant="body2">• {answer.answerText}</Typography>
            {answer.childrenQuestion.length > 0 && (
              <Stack spacing={1} sx={{ mt: 1 }}>
                {answer.childrenQuestion.map((child) => (
                  <SymptomTreeNode
                    key={child.questionId}
                    item={child}
                    depth={depth + 1}
                  />
                ))}
              </Stack>
            )}
          </Box>
        ))}
      </Stack>
    </Paper>
  );
}
