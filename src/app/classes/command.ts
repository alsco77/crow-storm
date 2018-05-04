export class Command {

    constructor(command: string) {
      this.containsCommand = command !== null;
      this.command = command;
    }
    containsCommand: boolean;
    command: string;
  }