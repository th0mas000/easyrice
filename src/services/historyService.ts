import type { HistoryItem, InspectionResult, InspectionFormData, Standard } from '../types';
import { CalculationService, type CalculationResult } from './calculationService';


const mockHistoryData: HistoryItem[] = [

];

const mockInspectionResults: Map<string, InspectionResult> = new Map();

export const historyService = {

  async getHistory(): Promise<HistoryItem[]> {
    try {
  
      await new Promise(resolve => setTimeout(resolve, 500));
      return Promise.resolve([...mockHistoryData]);
    } catch (error) {
      console.error('Error fetching history:', error);
      throw new Error('Failed to fetch history');
    }
  },

  //GET history[id]
  async getHistoryById(id: string): Promise<HistoryItem | null> {
    try {
 
      const historyItem = mockHistoryData.find(item => item.id === id);
      return Promise.resolve(historyItem || null);
    } catch (error) {
      console.error('Error fetching history by ID:', error);
      throw new Error('Failed to fetch history item');
    }
  },

 
  async searchHistory(searchTerm: string): Promise<HistoryItem[]> {
    try {
   
      await new Promise(resolve => setTimeout(resolve, 300));
      const filteredHistory = mockHistoryData.filter(item => 
        item.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
      return Promise.resolve([...filteredHistory]);
    } catch (error) {
      console.error('Error searching history:', error);
      throw new Error('Failed to search history');
    }
  },

  //delete history
  async deleteHistory(ids: string[]): Promise<void> {
    try {
      console.log('Deleting history items:', ids);
      

      for (let i = mockHistoryData.length - 1; i >= 0; i--) {
        if (ids.includes(mockHistoryData[i].id)) {
          const removedItem = mockHistoryData.splice(i, 1)[0];
  
          mockInspectionResults.delete(removedItem.id);
          console.log('Deleted history item:', removedItem.id);
        }
      }
      

      await new Promise(resolve => setTimeout(resolve, 300));
      return Promise.resolve();
    } catch (error) {
      console.error('Error deleting history:', error);
      throw new Error('Failed to delete history items');
    }
  },


  async getInspectionResultById(id: string): Promise<InspectionResult | null> {
    try {
  
      const storedResult = mockInspectionResults.get(id);
      if (storedResult) {
        return Promise.resolve(storedResult);
      }
      
    
      const historyItem = mockHistoryData.find(item => item.id === id);
      if (historyItem) {
   
        const basicResult: InspectionResult = {
          id: historyItem.id,
          createdAt: historyItem.createDate,
          updatedAt: historyItem.createDate,
          standardName: historyItem.standard,
          totalSample: 100,
          note: historyItem.note,
          price: 0,
          dateTimeOfSampling: historyItem.createDate,
          samplingPoint: 'Sample Point A',
          composition: [
            { name: 'Whole Milled', length: '≥5.5mm', actual: '85.0%' },
            { name: 'Broken Milled', length: '2.0-5.4mm', actual: '10.0%' },
            { name: 'Brewers Rice', length: '<2.0mm', actual: '3.0%' },
            { name: 'Chipped/Brokens', length: 'Various', actual: '2.0%' }
          ],
          defectRice: [
            { name: 'Damaged', actual: '1.0%' },
            { name: 'Discolored', actual: '0.5%' },
            { name: 'Chalky', actual: '2.0%' },
            { name: 'Foreign Matter', actual: '0.2%' },
            { name: 'Total Defects', actual: '3.7%' },
            { name: 'Immature', actual: '1.0%' },
            { name: 'Red Rice', actual: '0.3%' }
          ]
        };
        return Promise.resolve(basicResult);
      }
      
      return Promise.resolve(null);
    } catch (error) {
      console.error('Error fetching inspection result:', error);
      throw new Error('Failed to fetch inspection result');
    }
  },

 //post for create
  async saveInspectionResult(
    formData: InspectionFormData,
    standard: Standard,
    rawData: any
  ): Promise<{ id: string; result: CalculationResult }> {
    try {
    
      const calculationResult = CalculationService.calculateInspectionResults(rawData, standard);
      
   
      const inspectionId = this.generateInspectionId();
      

      const historyItem: HistoryItem = {
        id: inspectionId,
        name: formData.name,
        createDate: new Date().toISOString(),
        standard: standard.name,
        note: formData.note || ''
      };


      const completeResult: InspectionResult = {
        id: inspectionId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        standardName: standard.name,
        totalSample: calculationResult.totalSample,
        note: formData.note || '',
        price: formData.price,
        dateTimeOfSampling: formData.dateTimeOfSampling?.toISOString(),
        samplingPoint: formData.samplingPoints?.join(', '),
        composition: calculationResult.composition,
        defectRice: calculationResult.defects
      };


      mockHistoryData.unshift(historyItem);
      

      mockInspectionResults.set(inspectionId, completeResult);
      
      console.log('Saved inspection result:', {
        id: inspectionId,
        formData,
        standard: standard.name,
        calculationResult
      });

      return Promise.resolve({
        id: inspectionId,
        result: calculationResult
      });
    } catch (error) {
      console.error('Error saving inspection result:', error);
      throw new Error('Failed to save inspection result');
    }
  },


  generateInspectionId(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `INS${timestamp.toString().slice(-6)}${random}`;
  }
};
