export interface CSSGeneratorConfig {
    units: 'px' | 'rem';
    includePosition: boolean;
    includeSize: boolean;
    includeFontStyles: boolean;
    remBase: number;
    exportFormat: 'none' | 'html' | 'xml' | 'json';
  }
  
  export const defaultConfig: CSSGeneratorConfig = {
    units: 'px',
    includePosition: true,
    includeSize: true,
    includeFontStyles: true,
    remBase: 16,
    exportFormat: 'none'
  };
  
  let currentConfig: CSSGeneratorConfig = { ...defaultConfig };
  
  export function getConfig(): CSSGeneratorConfig {
    return { ...currentConfig };
  }
  
  export function setConfig(newConfig: Partial<CSSGeneratorConfig>): void {
    currentConfig = { ...currentConfig, ...newConfig };
  }