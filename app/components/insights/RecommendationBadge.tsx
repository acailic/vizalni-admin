import { Chip } from '@mui/material';
import CheckIcon from '@mui/icons-material/CheckCircleOutline';

interface Props {
  text?: string;
}

export function RecommendationBadge({ text }: Props) {
  if (!text) return null;
  return (
    <Chip
      icon={<CheckIcon />}
      size="small"
      color="primary"
      variant="outlined"
      label={text}
      sx={{ mt: 1 }}
    />
  );
}
