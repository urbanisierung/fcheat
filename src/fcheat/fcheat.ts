import * as inquirer from "inquirer";
import * as autocompleteprompt from "inquirer-autocomplete-prompt";

export interface item {
  title: string;
  tags?: string[];
  command: string;
}

export class FCheat {
  private cheatSheet: item[] = [
    {
      title: "kubectl connect to a pod",
      tags: ["kubectl", "k8s", "pod", "connect"],
      command: "kubectl exec -it -n ${namespace} ${pod} -- /bin/bash"
    },
    {
      title: "kubectl get current context",
      tags: ["kubectl", "k8s", "context"],
      command: "kubectl config current-context"
    }
  ];

  public async registerPrompt() {
    inquirer.registerPrompt("autocomplete", autocompleteprompt);
    inquirer
      .prompt([
        {
          name: "cheatsheet",
          message: "CheatSheet:",
          type: "autocomplete",
          pageSize: 10,
          source: async (answers, input) => await this.filter(input)
        }
      ])
      .then(a => console.log(`answers: ${JSON.stringify(a)}`));
  }

  private async filter(input: string): Promise<string[]> {
    if (input && input.length > 2) {
      return new Promise(resolve => {
        resolve(
          this.cheatSheet
            .filter(c => c.title.includes(input))
            .map(c => `${c.command} (${c.title})`)
        );
      });
    }
    return new Promise(resolve => {
      resolve(this.cheatSheet.map(c => `${c.command} (${c.title})`));
    });
  }
}
