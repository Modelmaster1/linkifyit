// pages/api/renderComponent.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { renderToString } from 'react-dom/server';
import { createElement } from 'react';
import GridPage, { GridPageProps } from "~/app/edit/test/2/page";

export default (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        const props: GridPageProps = req.body;  // Assuming the body contains the props
        const html = renderToString(createElement(GridPage, props));
        
        // Render the component with the provided props
        res.status(200).send(html);
      } else {
        res.status(405).send('Method Not Allowed');
      }
};