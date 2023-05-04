import { Scenes } from 'telegraf';
import { stepStart, stepSearch } from '../../views';

const startScene = new Scenes.WizardScene<Scenes.WizardContext>('startScene', stepStart);
const searchScene = new Scenes.WizardScene<Scenes.WizardContext>(
  'searchScene',
  stepSearch,
);

export const stage = new Scenes.Stage<Scenes.WizardContext>([startScene, searchScene]);
