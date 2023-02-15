export function normalizeCpf(cpf: string): string {
   return cpf
      .toString()
      .replace(/\./g, '')
      .replace(/-/g, '')
      .replace(/ /g, '')
      .padStart(11, '0');
}
