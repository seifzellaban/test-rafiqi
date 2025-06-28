// Utility to load prompts
import rpr01Prompt from './prompts/rpr01.txt?raw';
import rpr01pPrompt from './prompts/rpr01p.txt?raw';
import rpr01nPrompt from './prompts/rpr01n.txt?raw';
import ruhm01Prompt from './prompts/ruhm01.txt?raw';

// Map of model IDs to their prompts
const prompts = {
  rpr01: rpr01Prompt,
  rpr01p: rpr01pPrompt,
  rpr01n: rpr01nPrompt,
  ruhm01: ruhm01Prompt
} as const;

export default prompts;
