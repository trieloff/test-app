/*
 * Copyright 2022 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

async function tag({
  applications, subsystems, tagname, iconUrl, date, API_KEY, hostname = 'coralogix.com',
}) {
  // semantic-release is using CJS, helix-fetch is using ESM, this is a workaround
  const { context, h1 } = await import('@adobe/helix-fetch');
  /* c8 ignore next 7 */
  const { fetch } = process.env.HELIX_FETCH_FORCE_HTTP1
    ? h1({
      userAgent: 'helix-fetch', // static user-agent for recorded tests
    })
    : context({
      userAgent: 'helix-fetch', // static user-agent for recorded tests
    });

  const serviceurl = new URL(`https://webapi.${hostname}/api/v1/addTag`);
  const res = await fetch(serviceurl, {
    method: 'POST',
    body: JSON.stringify({
      iconUrl,
      name: tagname,
      date,
      application: applications,
      subsystem: subsystems,
    }),
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  });
  if (res.ok) {
    return true;
  }
  throw new Error(await res.text());
}

module.exports = tag;
