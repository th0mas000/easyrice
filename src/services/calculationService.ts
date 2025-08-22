import type { RawData, Standard, RiceGrain, CompositionResult, DefectResult } from '../types';

export interface CalculationResult {
  composition: CompositionResult[];
  defects: DefectResult[];
  totalSample: number;
  imageURL: string;
}

export class CalculationService {

  static calculateInspectionResults(rawData: RawData, standard: Standard): CalculationResult {
    const grains = rawData.grains;
    const totalSample = grains.length;

    const composition = this.calculateComposition(grains, standard);

    const defects = this.calculateDefects(grains);

    return {
      composition,
      defects,
      totalSample,
      imageURL: rawData.imageURL
    };
  }


  private static calculateComposition(grains: RiceGrain[], standard: Standard): CompositionResult[] {
    const composition: CompositionResult[] = [];
    const totalWeight = grains.reduce((sum, grain) => sum + grain.weight, 0);

    for (const standardData of standard.standardData) {
   
      const matchingGrains = grains.filter(grain => {
 
        const lengthMatch = this.checkLengthCondition(
          grain.length,
          standardData.minLength,
          standardData.maxLength,
          standardData.conditionMin,
          standardData.conditionMax
        );
  
        const shapeMatch = standardData.shape.includes(grain.shape);
        
        return lengthMatch && shapeMatch;
      });

 
      const categoryWeight = matchingGrains.reduce((sum, grain) => sum + grain.weight, 0);
      const percentage = totalWeight > 0 ? (categoryWeight / totalWeight) * 100 : 0;


      const lengthRange = `${standardData.minLength} - ${standardData.maxLength} mm`;
      
      composition.push({
        name: standardData.name,
        length: lengthRange,
        actual: `${percentage.toFixed(2)}%`
      });
    }

    return composition;
  }


  private static calculateDefects(grains: RiceGrain[]): DefectResult[] {
    const totalWeight = grains.reduce((sum, grain) => sum + grain.weight, 0);
    
 
    const defectTypes = ['yellow', 'red', 'damage', 'paddy', 'chalky', 'glutinous'];
    const defectWeights: Record<string, number> = {};
    

    defectTypes.forEach(type => {
      defectWeights[type] = 0;
    });


    grains.forEach(grain => {
      if (grain.type !== 'white' && defectTypes.includes(grain.type)) {
        defectWeights[grain.type] += grain.weight;
      }
    });

    const defects: DefectResult[] = [];

  
    defectTypes.forEach(type => {
      const weight = defectWeights[type];
      const percentage = totalWeight > 0 ? (weight / totalWeight) * 100 : 0;
      defects.push({
        name: type,
        actual: `${percentage.toFixed(2)}%`
      });
    });


    const totalForeignWeight = Object.values(defectWeights).reduce((sum, weight) => sum + weight, 0);
    const totalForeignPercentage = totalWeight > 0 ? (totalForeignWeight / totalWeight) * 100 : 0;
    
    defects.push({
      name: 'total',
      actual: `${totalForeignPercentage.toFixed(2)}%`
    });

    return defects;
  }

 
  private static checkLengthCondition(
    length: number,
    minLength: number,
    maxLength: number,
    conditionMin: string,
    conditionMax: string
  ): boolean {
    let minCheck = true;
    let maxCheck = true;


    switch (conditionMin) {
      case 'GT': 
        minCheck = length > minLength;
        break;
      case 'GE':
        minCheck = length >= minLength;
        break;
      default:
        minCheck = true;
    }


    switch (conditionMax) {
      case 'LT':
        maxCheck = length < maxLength;
        break;
      case 'LE':
        maxCheck = length <= maxLength;
        break;
      default:
        maxCheck = true;
    }

    return minCheck && maxCheck;
  }

  static async loadRawData(): Promise<RawData> {
    try {
      const response = await fetch('/raw.json');
      if (!response.ok) {
        throw new Error(`Failed to load raw data: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error loading raw data:', error);
      throw error;
    }
  }


  static async loadStandards(): Promise<Standard[]> {
    try {
      const response = await fetch('/standards.json');
      if (!response.ok) {
        throw new Error(`Failed to load standards: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error loading standards:', error);
      throw error;
    }
  }
}
