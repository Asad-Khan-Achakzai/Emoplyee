/**
 Copyright (c) 2022, Xgrid Inc, http://xgrid.co

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */
// React imports
import * as React from 'react';

// Material imports
import {
  TextField,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
} from '@mui/material';

import FormField from '../formField';

// Third party imports
import { Formik, ErrorMessage, Field } from 'formik';
import * as yup from 'yup';

// Constant imports
import { constants } from '../../constants/constants';

const validationSchema = yup.object().shape({
  name: yup
    .string(constants.labels.projectNameHelperText)
    .required(constants.labels.projectNameRequired),
  fileUrl: yup
    .string(constants.labels.fileUrlHelperText)
    .required(constants.labels.fileUrlRequired),
  description: yup
    .string(constants.labels.descriptionHelperText)
    .required(constants.labels.descriptionRequired),
});

/**
 * Opens dialog box to add new project
 * @param {{
 *    open: Boolean, // Boolean to open/close dialog box
 *    setOpen: Function, // Function to set open's value
 *    saveProject: Function, // Function to add project
 *    restrictCancel: Boolean, // Boolean to restrict the closing of model
 * }}
 */
export default function AddProject({
  open,
  setOpen,
  saveProject,
  project,
  addUpdateLabel,
  isSubmitting,
  restrictCancel,
}) {
  const initialValues = {
    name: '',
    fileUrl: '',
    description: '',
  };

  // To update the project
  if (addUpdateLabel === constants.labels.update) {
    initialValues.name = project.name;
    initialValues.fileUrl = project.fileUrl;
    initialValues.description = project.description;
  }

  const onSubmit = (values) => {
    saveProject(values);
  };
  const handleClose = () => {
    if (!restrictCancel) {
      setOpen(false);
    }
  };
  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{addUpdateLabel} project</DialogTitle>
        <DialogContent>
          <Grid container item>
            <Formik
              initialValues={initialValues}
              onSubmit={onSubmit}
              validationSchema={validationSchema}
            >
              {({ handleSubmit, dirty }) => (
                <form onSubmit={handleSubmit}>
                  <FormField as={TextField} identifier='name' label='Name' />
                  <FormField
                    as={TextField}
                    identifier='fileUrl'
                    label='File URL'
                  />
                  <FormField
                    as={TextField}
                    identifier='description'
                    label='Description'
                  />
                  <Grid sx={{ textAlign: 'end' }}>
                    <Button
                      sx={{ margin: '1rem' }}
                      type='submit'
                      color='primary'
                      variant='contained'
                      disabled={isSubmitting || !dirty}
                    >
                      {isSubmitting ? 'Loading' : addUpdateLabel}
                    </Button>
                    <Button
                      sx={{ margin: '1rem' }}
                      color='primary'
                      variant='contained'
                      onClick={handleClose}
                    >
                      Cancel
                    </Button>
                  </Grid>
                </form>
              )}
            </Formik>
          </Grid>
        </DialogContent>
      </Dialog>
    </div>
  );
}
