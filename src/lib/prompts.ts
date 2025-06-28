// Utility to load prompts
import rpr01Prompt from './prompts/rp01.txt';
import rpr01pPrompt from './prompts/rpr01p.txt';
import rpr01nPrompt from './prompts/rpr01n.txt';
import ruhm01Prompt from './prompts/ruhm01.txt';

// Map of model IDs to their prompts
const prompts = {
  rpr01: rpr01Prompt,
  rpr01p: rpr01pPrompt,
  rpr01n: rpr01nPrompt,
  ruhm01: ruhm01Prompt
} as const;

export default prompts;
