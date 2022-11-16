export class TopBarAction {
  constructor(icon: string) {
    this.icon = icon;
  }

  icon: string = '';
  act: () => void = () => {
  };
}
