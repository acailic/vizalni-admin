import CheckIcon from '@mui/icons-material/CheckCircleOutline';
import { Chip } from '@mui/material';

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
