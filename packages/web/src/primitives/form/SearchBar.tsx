import React from 'react';
import Input from './Input';
import Box from '@material-ui/core/Box';
import { Search as SearchIcon, Close as CloseIcon } from '@material-ui/icons';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';

type Props = {
  value: string;
  setState: React.Dispatch<React.SetStateAction<string>>;
};

const SearchBar: React.FC<Props> = ({ value, setState }) => {
  return (
    <Box display="flex" mb={2}>
      <Input
        value={value}
        changeState={setState}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              {!!value && (
                <IconButton onClick={() => setState('')}>
                  <CloseIcon />
                </IconButton>
              )}
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};

export default SearchBar;
