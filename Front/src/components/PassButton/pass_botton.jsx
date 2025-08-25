import {useState} from 'react';
import api from '../../services/api';
import Button from '@mui/material/Button';

export const handleClick = async ({match_id, setMovCounter, setUsedMov, setReload}) => {
  try {
      await api.putData(`matches/${match_id}/next_turn`, {});
      console.log('Turno pasado');
      setReload(true);
      setMovCounter(0);
      setUsedMov([]);
      
  } catch (error) {
      console.error('Error al pasar el turno:', error);
  }
};


export function PassBotton({ match_id, setMovCounter, setUsedMov, setReload}) {

    return (
      <Button
        variant="contained"
        color="primary"
        style={{
          position: 'absolute',
          bottom: '3vh',
          right: '25vw',
        }}
        onClick={() => handleClick({match_id, setMovCounter, setUsedMov, setReload})} // Se pasa la función sin paréntesis
      >
        Pass Turn
      </Button>
    );
}

