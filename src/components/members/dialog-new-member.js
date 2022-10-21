import { Dialog, Button, TextField, Box, DialogTitle, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useState } from 'react';
import { addMember} from 'src/utils/requests';
import { useData } from '../../utils/hooks';

export const NewMemberDialog = ({ open, handleClose, loadData, onAction, ...rest }) => {
    const [data, setData] = useData({
    name: "",
    c_id: "",
    email: "",
    organization: "",
    projects: null
  });
  const [type, setType] = useState("in");
  const [errors, setErrors] = useData({});

  const saveMember = async () => {
    console.log(data);

    addMember(data).then((data) => {
        handleClose();
        loadData();
      })
        .catch((error) => {
          setErrors(error.response.data)
          console.log(error.response.data)
        });

  };


  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth='xs'
      fullWidth={true}

    >
      <DialogTitle>{onAction === 'new_member' ? "Nuevo miembro" : "Editar miembro"}</DialogTitle>
      <Box
        sx={{ px: 2, mx: 2, display: "flex", flexDirection: "column" }}
      >
        <TextField
          sx={{ mt: 2}}
          label="Nombre"
          onChange={() => setData({ ["name"]: event.target.value })}
          fullWidth
          InputLabelProps={{ shrink: true }}
        />

        <FormControl sx={{ mt: 2}}>
          <InputLabel id="demo-simple-select-filled-label">Tipo</InputLabel>
          <Select
            labelId="demo-simple-select-filled-label"
            id="demo-simple-select-filled"
            value={type}
            onChange={(event) => {
              setType(event.target.value);
            }}
          >
            <MenuItem value={"out"}>Externo</MenuItem>
            <MenuItem value={'in'}>Interno</MenuItem>
          </Select>
        </FormControl>
        <TextField
          sx={{ mt: 2}}
          label="Correo"
          onChange={() => setData({ ["email"]: event.target.value })}
          fullWidth
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          sx={{ mt: 2}}
          label="CID"
          onChange={() => setData({ ["c_id"]: event.target.value })}
          fullWidth
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          sx={{ mt: 2}}
          label="Organizacion"
          onChange={() => setData({ ["organization"]: event.target.value })}
          fullWidth
          InputLabelProps={{ shrink: true }}
        />
        <Box
          sx={{ pt: 2, display: "flex", justifyContent: "right" }}
        >
          <Button
            onClick={handleClose}
          >
            Cancelar
          </Button>
          <Button
            onClick={saveMember}
          >
            Guardar
          </Button>
        </Box>
      </Box>
    </Dialog>
  );

};