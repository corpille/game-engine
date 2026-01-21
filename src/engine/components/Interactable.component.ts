export default class Interactable {
  prompt: string;
  radius: number;

  constructor(prompt = 'Press E', radius = 32) {
    this.prompt = prompt;
    this.radius = radius;
  }
}
