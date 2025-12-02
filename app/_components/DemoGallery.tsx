import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

// internal imports
import { staticGalleryDatasets, GalleryDataset } from "@/data/static-gallery-data";



export const DemoGallery = ({ datasets = staticGalleryDatasets }: { datasets?: GalleryDataset[] }) => {




  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h2" gutterBottom>
        Serbia Open Data Gallery
      </Typography>
      <Typography variant="body1" sx={{ mb: 4 }}>
        Exploring datasets from data.gov.rs
      </Typography>

      <Grid container spacing={3}>
        {datasets.map((dataset) => (
          <Grid item xs={12} md={6} lg={4} key={dataset.id}>
            <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5" component="div" gutterBottom>
                  {dataset.title}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  {dataset.organization?.title || "Unknown Organization"}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    mb: 2,
                  }}
                >
                  {dataset.notes}
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {dataset.tags.slice(0, 5).map((tag) => (
                    <Chip key={tag.name} label={tag.name} size="small" />
                  ))}
                </Box>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  href={`https://data.gov.rs/sr/datasets/${dataset.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on Portal
                </Button>
                {dataset.resources.length > 0 && (
                  <Button
                    size="small"
                    href={dataset.resources[0].url}
                    target="_blank"
                    rel="noopener noreferrer"
                    color="primary"
                  >
                    Download {dataset.resources[0].format}
                  </Button>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
