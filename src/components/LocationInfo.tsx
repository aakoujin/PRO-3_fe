import React from 'react';
import { Typography, Box } from '@mui/material';
import MapIcon from '@mui/icons-material/Map';

interface Location {
  id_location: number;
  id_listing: number;
  country: string;
  state: string | null;
  city: string;
  street: string | null;
  postalCode: string | null;
}

interface Props {
  locations: Location[];
}

const LocationInfo: React.FC<Props> = ({ locations }) => {
  if (locations.length === 0) {
    return <Typography variant="body1">No locations to display.</Typography>;
  }

  const firstLocation = locations[0];

  const excludedFields = ['id_location', 'id_listing'];

  const nonNullFields = Object.entries(firstLocation)
    .filter(([key, value]) => !excludedFields.includes(key) && value !== null && value !== '')
    .map(([key, value]) => (
      <Box key={key} 
      display="flex" 
      margin={1}
      >
        <Typography variant="body1" >
            {capitalizeFirstLetter(key)}
        </Typography>
        <Typography variant="body1">: { value}</Typography>
      </Box>
    ));

  return (
    <>
      <Typography variant="h6">Location Information {<MapIcon/>}</Typography>
      {nonNullFields}
    </>
  );
};

export default LocationInfo;

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
