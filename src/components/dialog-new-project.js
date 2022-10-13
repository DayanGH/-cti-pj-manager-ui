import { Dialog, Button, TextField, Box, DialogTitle, FormControl, InputLabel, Select, MenuItem, InputAdornment } from '@mui/material';
import { useState } from 'react';
import { useToggleState, useData } from 'src/utils/hooks';
import { fetchPrograms, fetchChiefs, addProject, editProject } from 'src/utils/requests';
import Autocomplete from '@mui/material/Autocomplete'
import CircularProgress from '@mui/material/CircularProgress'
import { useAsync } from "react-async";


export const NewProjectDialog = ({ open, loadData, onClose, onAction, instance, ...rest }) => {
  const [data, setData] = useData({
    documents: [],
    document_groups: [],
    members: [],
    chief: null,
    project_classification: "",
    pj_type: "",
    name: "",
    project_code: "",
    program_code: "",
    main_entity: "",
    entities: "",
    start_date: "",
    end_date: "",
    financing: 0,
    program: null,
    ...instance,
  });
  const projectTypesNAP = [
    { key: 'pnap_di', value: 'Proyectos No Asociados a Programas Demanda Interna' },
    { key: 'pnap_de', value: 'Proyectos No Asociados a Programas Demanda Externa' }]
  const projectsClass = [
    { key: 'i_bas', value: 'De Investigación Básica' },
    { key: 'i_d', value: 'Aplicada y de Desarrollo' },
    { key: 'inn', value: 'Innovación' }]

  const [togglePrograms, openPrograms, closePrograms] = useToggleState();
  const [toggleChief, openChiefs, closeChiefs] = useToggleState();
  const [errors, setErrors] = useData({});
  const [ptype, setPtype] = useState(data.pj_type === "pnap_di" || data.pj_type === "pnap_de" || data.pj_type === "" ? 'none' : data.pj_type)
  const [value, setValue] = useState(data.program !== null ? { id: data?.program, name: instance?.program_name } : null)
  const [inputValue, setInputValue] = useState('')
  const [pnapType, setPnapType] = useState(data.pj_type === "pnap_di" ? "pnap_di" : data.pj_type === "pnap_de" ? "pnap_de" : "")
  const [pClass, setpClass] = useState("")

  const [valueChief, setValueChief] = useState(data.chief !== null ? { id: instance.chief_id, name: data?.chief } : null)
  const [inputValueChief, setInputValueChief] = useState('')

  let component;

  const programsAsyncData = useAsync({
    deferFn: fetchPrograms,
  });
  const chiefsAsyncData = useAsync({
    deferFn: fetchChiefs,
  });


  function handleOpenPrograms() {
    openPrograms();
    programsAsyncData.run();
  }
  function handleClosePrograms() {
    closePrograms();
  }
  function handleOpenChiefs() {
    openChiefs();
    chiefsAsyncData.run();
  }
  function handleClosechiefs() {
    closeChiefs();
  }

  function handleChangeField(value, field) {
    setData({ [field]: value });
  }
  function handleAddProject(data) {
    const func = onAction === 'new' ? addProject : editProject;
    func(data)
      .then((data) => {
        onClose();
        loadData();
      })
      .catch((error) => {
        setErrors(error.response.data)
      });
  }

  if (ptype === 'nac' || (data.pj_type === 'papn' && ptype !== 'none')) {
    component = <TextField
      sx={{ mt: 1 }}
      label="Tipo"
      variant="standard"
      contentEditable={false}
      value='Proyectos Asociados a Programas Nacional'
    />
  } else if (ptype === 'sec' || (data.pj_type === 'paps' && ptype !== 'none')) {
    component = <TextField
      sx={{ mt: 1 }}
      label="Tipo"
      variant="standard"
      contentEditable={false}
      value='Proyectos Asociados a Programas Sectorial'
    />
  } else if (ptype === 'ter' || (data.pj_type === 'papt' && ptype !== 'none')) {
    component = <TextField
      sx={{ mt: 1 }}
      label="Tipo"
      variant="standard"
      contentEditable={false}
      value='Proyectos Asociados a Programas Territorial'
    />
  }
  else if (ptype === 'none') {
    component = <FormControl
      variant="standard"
      sx={{ mt: 1 }}
      error={'pj_type' in errors}
      helpertext={errors.pj_typen}>
      <InputLabel id="demo-simple-select-filled-label">Tipo</InputLabel>
      <Select
        labelId="demo-simple-select-filled-label"
        id="demo-simple-select-filled"
        value={pnapType}
        onChange={(event) => {
          handleChangeField(event.target.value, 'pj_type')
          setPnapType(event.target.value)
        }}
      >
        {projectTypesNAP.map((type) => (
          <MenuItem value={type.key}
            key={type.key}>{type.value}</MenuItem>
        ))}
      </Select>
    </FormControl>
  }
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth='xs'
      fullWidth={true}

    >
      <DialogTitle>{onAction === 'new' ? "Nuevo proyecto" : "Editar proyecto"}</DialogTitle>
      <Box
        sx={{ px: 1, mx: 2, display: "flex", flexDirection: "column" }}
      >
        <TextField
          sx={{ mt: 1 }}
          label="Nombre"
          value={data.name}
          variant="standard"
          error={'name' in errors}
          helperText={errors.name}
          onChange={(event) => {
            handleChangeField(event.target.value, 'name')
          }} />
        <TextField
          sx={{ mt: 1 }}
          label="Código"
          value={data.project_code}
          variant="standard"
          error={'project_code' in errors}
          helperText={errors.project_code}
          onChange={(event) => {
            handleChangeField(event.target.value, 'project_code')

          }} />
        <Autocomplete
          sx={{ mt: 1 }}
          id="select-program"
          open={togglePrograms}
          onOpen={handleOpenPrograms}
          value={value}
          onClose={handleClosePrograms}
          onChange={(_, value) => {
            handleChangeField(value?.id, 'program')
            handleChangeField(value?.program_code, 'program_code')
            setValue(value)
            setPtype(value?.ptype)
            if (value === null) {
              setPtype('none')
              handleChangeField(null, 'program')
              handleChangeField("", 'program_code')
            }
            if (value?.ptype === 'nac') {
              handleChangeField('papn', 'pj_type')
            } else if (value?.ptype === 'sec') {
              handleChangeField('paps', 'pj_type')
            } else if (value?.ptype === 'ter') {
              handleChangeField('papt', 'pj_type')
            }
          }}
          inputValue={inputValue}
          onInputChange={(_, value) => {
            setInputValue(value)
          }}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          getOptionLabel={(option) => option.name}
          options={programsAsyncData.data || []}
          loading={programsAsyncData.isLoading}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Programa"
              variant="standard"
              error={'program' in errors}
              helperText={errors.program}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <div>
                    {programsAsyncData.isLoading ? (
                      <CircularProgress
                        color="inherit"
                        size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </div>
                ),
              }}
            />
          )}
        />
        {component}
        <Autocomplete
          sx={{ mt: 1 }}
          id="select-chief"
          open={toggleChief}
          onOpen={handleOpenChiefs}
          onClose={handleClosechiefs}
          value={valueChief}
          onChange={(_, value) => {
            if (value !== null) {
              handleChangeField(value?.id, 'chief')
              setValueChief(value)
            }

          }}
          inputValue={inputValueChief}
          onInputChange={(_, value) => {
            setInputValueChief(value)
          }}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          getOptionLabel={(option) => option.name}
          options={chiefsAsyncData.data || []}
          loading={chiefsAsyncData.isLoading}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Jefe"
              variant="standard"
              error={'chief' in errors}
              helperText={errors.chief}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <div>
                    {chiefsAsyncData.isLoading ? (
                      <CircularProgress
                        color="inherit"
                        size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </div>
                ),
              }}
            />
          )}
        />
        <TextField
          sx={{ mt: 1 }}
          label="Financiamiento"
          type="number"
          inputProps={{ min: 0 }}
          error={'financing' in errors}
          helperText={errors.financing}
          onChange={(evt) =>
            handleChangeField(evt.target.value, "financing")
          }
          variant="standard"
          fullWidth
          value={data.financing}
          InputProps={{ startAdornment: <InputAdornment position='start'>$</InputAdornment> }}
        />
        <FormControl
          variant="standard"
          error={'project_classification' in errors}
          helpertext={errors.project_classification}>
          <InputLabel id="p_clasification">Clasificación</InputLabel>
          <Select
            labelId="p_clasification"
            id="demo-simple-select-filled"
            value={data.project_classification}
            onChange={(event) => {
              handleChangeField(event.target.value, 'project_classification')
              setpClass(event.target.value)
            }}
          >
            {projectsClass.map((classif) => (
              <MenuItem value={classif.key}
                key={classif.key}>{classif.value}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box sx={{ display: "flex", flexDirection: 'row' }} >
          <TextField
            sx={{ mr: 1, mt: 1 }}
            label="Fecha de inicio"
            type="date"
            value={data.start_date}
            error={'start_date' in errors}
            helperText={errors.start_date}
            onChange={(evt) => handleChangeField(evt.target.value, 'start_date')}
            variant="standard"
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            sx={{ mr: 1, mt: 1 }}
            label="Fecha de culminación"
            type="date"
            value={data.end_date}
            error={'end_date' in errors}
            helperText={errors.end_date}
            onChange={(evt) => handleChangeField(evt.target.value, 'end_date')}
            variant="standard"
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Box>
        <TextField
          sx={{ mr: 1, mt: 1 }}
          label="Entidad principal"
          type='text'
          value={data.main_entity}
          error={'main_entity' in errors}
          helperText={errors.main_entity}
          onChange={(evt) => handleChangeField(evt.target.value, 'main_entity')}
          variant="standard"
          fullWidth
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          sx={{ mr: 1, mt: 1 }}
          label="Entidades participantes"
          multiline
          value={data.entities}
          maxRows={4}
          type='text'
          error={'entities' in errors}
          helperText={errors.entities}
          onChange={(evt) => handleChangeField(evt.target.value, 'entities')}
          variant="standard"
          fullWidth
          InputLabelProps={{ shrink: true }}
        />
        <Box
          sx={{ pt: 2, display: "flex", justifyContent: "right" }}
        >
          <Button onClick={() => onClose()}>
            Cancelar
          </Button>
          <Button onClick={() => {
            handleAddProject(data)
          }}>
            Guardar
          </Button>
        </Box>
      </Box>
    </Dialog >
  );

};
