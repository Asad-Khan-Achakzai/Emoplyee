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

// Third party imports
import { ErrorMessage, Field } from 'formik';

/**
 * Function to provide text field for the form
 * @param {{
 *    as: Component, // Type of component eg: TextField
 *    identifier: String, // identifier for the field as name and id
 *    label: String, // Label for the field
 * }}
 */
export default function FormField({ as, identifier, label }) {
  return (
    <Field
      as={as}
      sx={{ marginTop: '2rem' }}
      required
      fullWidth
      id={identifier}
      name={identifier}
      label={label}
      helperText={
        <ErrorMessage
          color='red'
          name={identifier}
          render={(msg) => <div style={{ color: 'red' }}>{msg}</div>}
        />
      }
    />
  );
}
