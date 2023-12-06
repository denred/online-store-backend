import { type RenderParameter } from '~/packages/mail/libs/types/types.js';

interface IView {
  render(parameters: RenderParameter): string;
}

export { type IView };
