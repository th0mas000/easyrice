import { useState } from 'react';
import { InspectionForm, ResultView, EditResult, History } from './components';
import { CalculationService } from './services/calculationService';
import { standardService } from './services/standardService';
import { historyService } from './services/historyService';
import type { InspectionResult } from './types';
import './App.css';

type AppView = 'form' | 'result' | 'edit' | 'history';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('form');
  const [inspectionResult, setInspectionResult] = useState<InspectionResult | null>(null);

  const handleFormSubmit = async (formData: any) => {
    try {
      // Load raw data and get the selected standard
      const [rawData, standards] = await Promise.all([
        CalculationService.loadRawData(),
        standardService.getStandards()
      ]);

      const selectedStandard = standards.find((s: any) => s.id === formData.standard);
      if (!selectedStandard) {
        throw new Error('Selected standard not found');
      }

      // Save the inspection result to history and get calculation results
      const { id, result } = await historyService.saveInspectionResult(
        formData,
        selectedStandard,
        rawData
      );

      // Create inspection result object for display
      const inspectionResult: InspectionResult = {
        id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        standardName: selectedStandard.name,
        totalSample: result.totalSample,
        note: formData.note || '',
        price: formData.price,
        dateTimeOfSampling: formData.dateTimeOfSampling?.toISOString(),
        samplingPoint: formData.samplingPoints?.join(', '),
        composition: result.composition,
        defectRice: result.defects
      };

      setInspectionResult(inspectionResult);
      setCurrentView('result');
    } catch (error) {
      console.error('Error processing inspection:', error);
      alert('Failed to process inspection. Please try again.');
    }
  };

  const handleBack = () => {
    setCurrentView('form');
    setInspectionResult(null);
  };

  const handleEdit = () => {
    setCurrentView('edit');
  };

  const handleSaveEdit = (updatedResult: InspectionResult) => {
    setInspectionResult(updatedResult);
    setCurrentView('result');
  };

  const handleCancelEdit = () => {
    setCurrentView('result');
  };

  const handleViewHistory = () => {
    setCurrentView('history');
  };

  const handleViewResult = async (id: string) => {
    try {
      // In a real implementation, this would fetch the full inspection result
      const result = await historyService.getInspectionResultById(id);
      if (result) {
        setInspectionResult(result);
        setCurrentView('result');
      } else {
        alert('Inspection result not found. This would typically fetch from the backend.');
      }
    } catch (error) {
      console.error('Error fetching inspection result:', error);
      alert('Failed to load inspection result.');
    }
  };

  const handleBackFromHistory = () => {
    setCurrentView('form');
  };

  const renderView = () => {
    switch (currentView) {
      case 'result':
        return inspectionResult ? (
          <ResultView
            result={inspectionResult}
            onBack={handleBack}
            onEdit={handleEdit}
          />
        ) : null;
      case 'edit':
        return inspectionResult ? (
          <EditResult
            result={inspectionResult}
            onSave={handleSaveEdit}
            onCancel={handleCancelEdit}
          />
        ) : null;
      case 'history':
        return (
          <History
            onViewResult={handleViewResult}
            onBack={handleBackFromHistory}
          />
        );
      case 'form':
      default:
        return (
          <InspectionForm 
            onSubmit={handleFormSubmit}
            onViewHistory={handleViewHistory}
          />
        );
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <header className="header">
        <h1>EASYRICE TEST</h1>
      </header>
      <div style={{ padding: '2rem 0' }}>
        {renderView()}
      </div>
    </div>
  );
}

export default App;
