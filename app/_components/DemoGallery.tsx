import { Box, Typography, Grid, Card, CardContent, CardActions, Button, Chip } from "@mui/material";
import { useEffect, useState } from "react";

interface Dataset {
  id: string;
  title: string;
  notes: string;
  resources: {
    id: string;
    name: string;
    format: string;
    url: string;
  }[];
  tags: {
    name: string;
  }[];
  organization?: {
    title: string;
    image_url: string;
  };
}

export const DemoGallery = () => {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDatasets = async () => {
      try {
        // Fetching datasets related to "population" and "economy" as examples
        const response = await fetch(
          "https://data.gov.rs/api/3/action/package_search?q=statistika&rows=10"
        );
        const data = await response.json();
        if (data.success) {
          setDatasets(data.result.results);
        }
      } catch (error) {
        console.error("Error fetching datasets:", error);
        setError("Failed to load datasets. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDatasets();
  }, []);

  if (loading) {
    return <Typography>Loading datasets...</Typography>;
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

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
