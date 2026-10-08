export function censorName(fullName: string | undefined): string {
  if (!fullName) return '';
  
  const lower = fullName.toLowerCase();
  if (lower.includes('equipo') || lower.includes('planta') || lower.includes('calidad') || lower.includes('auditor')) {
    return fullName;
  }
  
  const titles = ['ing', 'ing.', 'lic', 'lic.', 'dr', 'dr.', 'dra', 'dra.', 'arq', 'arq.'];
  const tokens = fullName.trim().split(/\s+/);
  
  if (tokens.length <= 1) return fullName;

  let startIndex = 0;
  if (titles.includes(tokens[0].toLowerCase())) {
    startIndex = 1;
  }

  const nameTokens = tokens.slice(startIndex);
  if (nameTokens.length <= 1) return fullName;

  const result = [];
  for (let i = 0; i < startIndex; i++) {
    result.push(tokens[i]);
  }

  const numNames = nameTokens.length;
  let numSurnamesToCensor = 1;
  if (numNames >= 3) {
      numSurnamesToCensor = 2; 
  }
  
  const startCensorIndex = numNames - numSurnamesToCensor;
  
  for (let i = 0; i < numNames; i++) {
      if (i >= startCensorIndex) {
          result.push(nameTokens[i].charAt(0).toUpperCase() + '.');
      } else {
          result.push(nameTokens[i]);
      }
  }

  return result.join(' ');
}
