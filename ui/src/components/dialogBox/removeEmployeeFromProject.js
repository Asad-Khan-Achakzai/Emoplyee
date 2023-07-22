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
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

/**
 * Opens dialog box for the confirmation to remove employee
 * @param {{
 *    open: Boolean, // Boolean to open/close dialog box
 *    setOpen: Function, // Function to set open's value
 *    removeEmployee: Function, // Function to remove employee
 *    employeeName: String, // Name of the employee to be removed
 *    employeeId: String, // Id of the employee to be removed
 *
 * }}
 */
export const RemoveEmployee = ({
  open,
  setOpen,
  removeEmployee,
  employeeId,
  employeeName,
}) => {

  /**
   * Calls removeEmployee function and closes the dialog box
   */
  const save = () => {
    removeEmployee(employeeId);
    setOpen(false);
  };

  /**
   * Closes the dialog box
   */
  const cancelModel = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={cancelModel}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>{'Confirmation'}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Are you sure to remove {employeeName}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelModel}>Cancel</Button>
          <Button onClick={save} autoFocus>
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
