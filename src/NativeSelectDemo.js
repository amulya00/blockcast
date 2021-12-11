import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';

export default function NativeSelectDemo( { setChatroom } ) {
  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl>
        <InputLabel variant="standard" htmlFor="uncontrolled-native">
          Room ID
        </InputLabel>
              <NativeSelect
                  defaultValue={1}
                  onChange={(ev) => setChatroom(ev.target.value)}
                inputProps={{
                name: 'age',
                id: 'uncontrolled-native',
            }}
        >
          <option value={1}>Room 1</option>
          <option value={2}>Room 2</option>
          <option value={3}>Room 3</option>
        </NativeSelect>
      </FormControl>
    </Box>
  );
}