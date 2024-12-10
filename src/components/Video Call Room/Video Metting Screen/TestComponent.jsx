import React from 'react';
import { Button } from '@mui/material';
import VideoCallIcon from '@mui/icons-material/VideoCall';

const TestComponent = () => (
  <div>
    <Button variant="contained" startIcon={<VideoCallIcon />}>
      Start Call
    </Button>
  </div>
);

export default TestComponent;
