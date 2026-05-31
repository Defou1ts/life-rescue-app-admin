import type { ImageDto } from "@/api/kyc/types";
import { getKycImageSrc } from "@/pages/admin/kyc/kycImage";
import { Box, Typography } from "@mui/material";

type KycImagePreviewProps = {
  title: string;
  image: ImageDto | null | undefined;
};

export function KycImagePreview({ title, image }: KycImagePreviewProps) {
  const src = getKycImageSrc(image);

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        {title}
      </Typography>
      {src ? (
        <Box
          component="img"
          src={src}
          alt={image?.fileName ?? title}
          sx={{
            width: "100%",
            maxHeight: 280,
            objectFit: "contain",
            borderRadius: 1,
            border: 1,
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        />
      ) : (
        <Typography color="text.secondary" variant="body2">
          No image provided
        </Typography>
      )}
    </Box>
  );
}
