import React from 'react';
import type { InspectionResult } from '../types';

interface ResultViewProps {
  result: InspectionResult;
  onBack: () => void;
  onEdit: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({ result, onBack, onEdit }) => {
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()} - ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white">
    <div className="mb-8">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">Inspection</h1>
      </div>


      <div className="flex gap-8">

        <div className="flex-shrink-0">
          <img 
            src="https://easyrice-es-trade-data.s3.ap-southeast-1.amazonaws.com/example-rice.webp" 
            alt="Rice sample" 
            className="w-72 h-96 object-cover rounded-lg border border-gray-300"
          />
          <div className="flex gap-3 mt-4">
            <button
              onClick={onBack}
              className="btn btn-submit px-8"
            >
              Back
            </button>
            <button
              onClick={onEdit}
              className="btn btn-submit px-8"
            >
              Edit
            </button>
          </div>
        </div>

      
        <div className="flex-1">
    
          <div className="bg-gray-100 rounded-lg p-6 mb-6">
            <div className="grid-cols-2 gap-8" style={{ display: 'grid' }}>
    
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-1">Create Date - Time</h3>
                  <p className="text-gray-900 font-medium">{formatDateTime(result.createdAt)}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-1">Standard</h3>
                  <p className="text-gray-900 font-medium">{result.standardName}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-1">Update Date - Time</h3>
                  <p className="text-gray-900 font-medium">{formatDateTime(result.updatedAt)}</p>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-1">Inspection ID</h3>
                  <p className="text-gray-900 font-medium">{result.id}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-1">Total Sample</h3>
                  <p className="text-gray-900 font-medium">{result.totalSample} kernai</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Information Grid */}
          <div className="bg-gray-100 rounded-lg p-6 mb-8">
            <div className="grid-cols-3 gap-8" style={{ display: 'grid' }}>
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">Note</h3>
                <p className="text-gray-900 font-medium">{result.note || 'abcdefghijk'}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">Price</h3>
                <p className="text-gray-900 font-medium">{result.price ? result.price.toLocaleString() : '12,345'}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">Date/Time of Sampling</h3>
                <p className="text-gray-900 font-medium">{result.dateTimeOfSampling ? formatDateTime(result.dateTimeOfSampling) : '22 ก.ค 2023 18:00:00'}</p>
                <h3 className="text-sm font-medium text-gray-600 mb-1 mt-3">Sampling Point</h3>
                <p className="text-gray-900 font-medium">{result.samplingPoint || 'Front End, Other'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tables Section */}
      <div className="space-y-8">
        {/* Composition Table */}
        <div className="bg-gray-100 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Composition</h3>
          <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Length</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Actual</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {result.composition.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">{item.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 text-right">{item.length}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 text-right font-medium">{item.actual}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Defect Rice Table */}
        <div className="bg-gray-100 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Defect Rice</h3>
          <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Actual</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {result.defectRice.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">{item.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 text-right font-medium">{item.actual}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};