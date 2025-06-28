// Utility to load prompts from text files
import fs from 'fs';
import path from 'path';

// Map of model IDs to their prompt file names
const modelPromptFiles = {
  rpr01: 'rp01.txt',
  rpr01p: 'rpr01p.txt',
  rpr01n: 'rpr01n.txt',
  ruhm01: 'ruhm01.txt'
};

// Function to load a prompt from a text file
function loadPromptFile(modelId: string): string {
  try {
    const fileName = modelPromptFiles[modelId as keyof typeof modelPromptFiles];
    if (!fileName) {
      throw new Error(`No prompt file defined for model ${modelId}`);
    }
    
    const filePath = path.join(__dirname, 'prompts', fileName);
    return fs.readFileSync(filePath, 'utf-8');
  } catch (error) {
    console.error(`Error loading prompt for ${modelId}:`, error);
    // Return a default prompt or throw error based on your needs
    return '';
  }
}

// Create a proxy object that loads prompts on demand
const prompts = new Proxy({}, {
  get: (target: any, prop: string) => {
    if (prop in modelPromptFiles) {
      return loadPromptFile(prop);
    }
    return undefined;
  }
});

export default prompts;
