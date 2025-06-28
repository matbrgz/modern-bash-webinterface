/**
 * Renders a command template with provided arguments
 * Replaces {{ argName }} with the corresponding value
 */
export function renderCommand(template: string, args: Record<string, any>): string {
  return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, argName) => {
    if (argName in args) {
      const value = args[argName];
      // Escape shell special characters
      return escapeShellArg(String(value));
    }
    return match;
  });
}

/**
 * Escapes shell arguments to prevent injection
 */
export function escapeShellArg(arg: string): string {
  // If arg is empty, return empty quotes
  if (arg === '') return "''";
  
  // Check if escaping is needed
  if (!/[^A-Za-z0-9_\-.,:\/@]/.test(arg)) {
    return arg;
  }
  
  // Escape single quotes and wrap in single quotes
  return "'" + arg.replace(/'/g, "'\\''") + "'";
} 
