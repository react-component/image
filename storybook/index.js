/* eslint-disable import/no-webpack-loader-syntax */
import React from 'react';
import Markdown from 'react-markdown';
import { checkA11y } from '@storybook/addon-a11y';
import { storiesOf } from '@storybook/react';
import { withConsole } from '@storybook/addon-console';
import { withViewport } from '@storybook/addon-viewport';
import { withInfo } from '@storybook/addon-info';
import ErrorSource from 'rc-source-loader!../examples/error';
import RetinaSource from 'rc-source-loader!../examples/retina';
import SingleSource from 'rc-source-loader!../examples/single';
import ZoomSource from 'rc-source-loader!../examples/zoom';
import Error from '../examples/error';
import Retina from '../examples/retina';
import Single from '../examples/single';
import Zoom from '../examples/zoom';
import READMECode from '../README.md';

storiesOf('rc-img', module)
  .addDecorator(checkA11y)
  .addDecorator(withInfo)
  .addDecorator((storyFn, context) => withConsole()(storyFn)(context))
  .addDecorator(withViewport())
  .add(
    'readMe',
    () => (
      <div
        className="markdown-body entry-content"
        style={{
          padding: 24,
        }}
      >
        <Markdown escapeHtml={false} source={READMECode} />
      </div>
    ),
    {
      source: {
        code: READMECode,
      },
    },
  )
  .add('error', () => <Error />, {
    source: {
      code: ErrorSource,
    },
  })
  .add('retina', () => <Retina />, {
    source: {
      code: RetinaSource,
    },
  })
  .add('single', () => <Single />, {
    source: {
      code: SingleSource,
    },
  })
  .add('zoom', () => <Zoom />, {
    source: {
      code: ZoomSource,
    },
  });
