import React, { useState } from 'react';
import type { InspectionResult } from '../types';

interface EditResultProps {
  result: InspectionResult;
  onSave: (updatedResult: InspectionResult) => void;
  onCancel: () => void;
}

export const EditResult: React.FC<EditResultProps> = ({ result, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    note: result.note || '',
    price: result.price?.toString() || '',
    samplingPoints: result.samplingPoint ? [result.samplingPoint] : [] as string[],
    dateTimeOfSampling: result.dateTimeOfSampling ? 
      result.dateTimeOfSampling.slice(0, 16) : // Format: YYYY-MM-DDTHH:mm
      ''
  });

  const handleSamplingPointChange = (point: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      samplingPoints: checked 
        ? [...prev.samplingPoints, point]
        : prev.samplingPoints.filter(p => p !== point)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedResult: InspectionResult = {
      ...result,
      note: formData.note,
      price: formData.price ? parseFloat(formData.price) : undefined,
      samplingPoint: formData.samplingPoints[0] || undefined,
      dateTimeOfSampling: formData.dateTimeOfSampling ? 
        new Date(formData.dateTimeOfSampling).toISOString() : undefined,
      updatedAt: new Date().toISOString()
    };
    
    onSave(updatedResult);
  };

  return (
    <div className="py-12 bg-gray-50" style={{ minHeight: '100vh' }}>
      <div className="mx-auto form-container">
        <div className="form-content">
          <h1 className="form-title">
            Edit Inspection ID : {result.id}
          </h1>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">
                Note
              </label>
              <input
                type="text"
                value={formData.note}
                onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
                className="form-input"
                placeholder="Enter inspection note"
              />
            </div>

            <div className="button-group">
              <button
                type="button"
                onClick={onCancel}
                className="btn btn-cancel"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-submit"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};