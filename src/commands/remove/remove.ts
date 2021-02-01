import commander from 'commander';
import {ExtraTypes, getName, getExtraType} from '../common';
import {$workstation} from '../../services/workstation/workstation.service';

export default {
  install(program: commander.Command) {
    program
      .command('remove [type] [name]')
      .description('Removes an extras from your project')
      .action(async (type: ExtraTypes, name) => {
        const errMsg = await $workstation.syncConfig();

        if (errMsg) return console.log(errMsg);
        if (!type) type = await getExtraType();
        if (!name) name = await getName(name);

        switch (type) {
          case 'project':
            return $workstation.removeProject(name);
        }
      });
  }
}
