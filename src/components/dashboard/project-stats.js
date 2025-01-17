import { ProjectsBySectors } from "./projects-by-sector"
import { ProjectsByTypology } from "./projects-by-typology"
import { ProjectsByEntity } from "./projects-by-entity"
import { Box, Card, CardContent, CardHeader, Divider, Typography, useTheme, FormControl, InputLabel, Select, MenuItem, IconButton, Tooltip } from '@mui/material';
import { useEffect, useState } from 'react';
import { CopyIcon } from "../../icons/copy"
import { useTargetAction } from 'src/utils/hooks';
import html2canvas from 'html2canvas';



export const ProjectStats = ({ sectorsData, typologyData, entitiesData, setSnackOpen, }) => {
  const theme = useTheme();
  const [showBy, setShowBy] = useState("typology");
  const [action, target, handleAction] = useTargetAction();

  let component = showBy == "typology" ? <ProjectsByTypology typologyData={typologyData} /> : (showBy === "sector" ? <ProjectsBySectors sectorsData={sectorsData} /> : <ProjectsByEntity entitiesData={entitiesData} />)

  function imageToClipboard(id) {
    html2canvas(document.getElementById(id))
      .then((canvas) => {
        console.log(canvas)
        canvas.toBlob((blob) => {
          console.log(blob)
          navigator.clipboard.write([
            new ClipboardItem(
              Object.defineProperty({}, blob.type, {
                value: blob,
                enumerable: true
              })
            )
          ])
        })
      }).catch((err) => {
        console.log(err)
      })

    setSnackOpen(true)
  }
  return (
    <>
      <Card
      >
        <Box sx={{ display: "flex", alignItems: "center", mr: 1 }}>
          <CardHeader title="Proyectos"
            sx={{ flexGrow: 1 }} />
          <FormControl>
            <InputLabel id="demo-simple-select-filled-label">Datos</InputLabel>
            <Select
              labelId="demo-simple-select-filled-label"
              id="demo-simple-select-filled"
              value={showBy}
              label='Datos'
              onChange={(event) => {
                setShowBy(event.target.value);
              }}
            >
              <MenuItem value={'typology'}>Por tipología</MenuItem>
              <MenuItem value={'sector'}>Por sector estratégico</MenuItem>
              <MenuItem value={'faculty'}>Por facultades</MenuItem>
            </Select>
          </FormControl>
          <Tooltip title="Copiar al portapapeles">
            <Box>
              <IconButton
                onClick={() => imageToClipboard("projecti")}
                size="small"
                title='Copiar'>
                <CopyIcon fontSize="small" />
              </IconButton>
            </Box>
          </Tooltip>
        </Box>
        <Divider />
        <CardContent id="projecti">
          {component}
        </CardContent>
      </Card>
    </>
  );
};

