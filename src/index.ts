import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { ISettingRegistry } from '@jupyterlab/settingregistry';

import { INotebookTracker, NotebookPanel, NotebookActions, Notebook } from '@jupyterlab/notebook';

import { ISessionContext } from '@jupyterlab/apputils';

import {
  Cell,
  ICellModel
} from "@jupyterlab/cells";

import {
  IOutputPrompt,
  IStdin,
  OutputArea,
  OutputPrompt,
  SimplifiedOutputArea,
  Stdin
} from '@jupyterlab/outputarea';


import {
  JSONObject,
  JSONValue,
  PartialJSONValue,
  PromiseDelegate,
  UUID
} from '@lumino/coreutils';

import { Kernel, KernelMessage } from '@jupyterlab/services';

import { requestAPI } from './handler';
import { IExecuteReplyMsg } from '@jupyterlab/services/lib/kernel/messages';

/**
 * Initialization data for the @educational-technology-collective/etc_jupyterlab_code_injection_example extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: '@educational-technology-collective/etc_jupyterlab_code_injection_example:plugin',
  autoStart: true,
  optional: [INotebookTracker, ISettingRegistry],
  activate: (app: JupyterFrontEnd, notebookTracker: INotebookTracker, settingRegistry: ISettingRegistry | null) => {
    console.log('JupyterLab extension @educational-technology-collective/etc_jupyterlab_code_injection_example is activated!');

    let executeFn = OutputArea.execute;

    NotebookActions.executionScheduled.connect((sender: any, args: { notebook: Notebook, cell: Cell<ICellModel> }) => {

      if (args.cell.model.metadata.has('inject')) {

        if (args.cell.model.metadata.get('inject') == true) {

          OutputArea.execute = (
            code: string,
            output: OutputArea,
            sessionContext: ISessionContext,
            metadata?: JSONObject | undefined
          ): Promise<IExecuteReplyMsg | undefined> => {

            code = `print('hello')\n${code}`;

            let promise = executeFn(code, output, sessionContext, metadata);

            OutputArea.execute = executeFn;

            return promise;
          }
        }
      }
    });

    // if (settingRegistry) {
    //   settingRegistry
    //     .load(plugin.id)
    //     .then(settings => {
    //       console.log('@educational-technology-collective/etc_jupyterlab_code_injection_example settings loaded:', settings.composite);
    //     })
    //     .catch(reason => {
    //       console.error('Failed to load settings for @educational-technology-collective/etc_jupyterlab_code_injection_example.', reason);
    //     });
    // }

    // requestAPI<any>('get_example')
    //   .then(data => {
    //     console.log(data);
    //   })
    //   .catch(reason => {
    //     console.error(
    //       `The etc_jupyterlab_code_injection_example server extension appears to be missing.\n${reason}`
    //     );
    //   });
  }
};

export default plugin;
