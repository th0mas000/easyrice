import React, { useState, useEffect } from 'react';
import type { HistoryItem } from '../types';
import { historyService } from '../services/historyService';

interface HistoryProps {
  onViewResult: (id: string) => void;
  onBack: () => void;
}

export const History: React.FC<HistoryProps> = ({ onViewResult, onBack }) => {
  const [historyData, setHistoryData] = useState<HistoryItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch history data on component mount
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await historyService.getHistory();
      setHistoryData(data);
    } catch (err) {
      console.error('Error fetching history:', err);
      setError('Failed to load history data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchHistory();
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await historyService.searchHistory(searchTerm);
      setHistoryData(data);
    } catch (err) {
      console.error('Error searching history:', err);
      setError('Failed to search history');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectItem = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedItems.size === historyData.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(historyData.map(item => item.id)));
    }
  };

  const handleDelete = async () => {
    if (selectedItems.size === 0) {
      alert('Please select items to delete');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete ${selectedItems.size} item(s)?`)) {
      return;
    }

    try {
      setLoading(true);
      await historyService.deleteHistory(Array.from(selectedItems));
      setSelectedItems(new Set());
      await fetchHistory(); // Refresh the list
      alert('Items deleted successfully');
    } catch (err) {
      console.error('Error deleting items:', err);
      alert('Failed to delete items');
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()} - ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">History</h1>
        
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={onBack}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium"
          >
            Back to Form
          </button>
        </div>

        {/* Search Section */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search by Inspection ID
              </label>
              <input
                id="search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter Inspection ID..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            
            <button
              onClick={handleSearch}
              disabled={loading}
              className="btn btn-submit"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
  
          </div>
        </div>

        {/* Actions Section */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center">
         
            
            <button
              onClick={handleDelete}
              disabled={selectedItems.size === 0 || loading}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                selectedItems.size === 0 || loading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'btn btn-delete'
              }`}
            >
              {loading ? 'Deleting...' : `Delete Selected`}
            </button>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* History Table */}
      <div className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-200">
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={historyData.length > 0 && selectedItems.size === historyData.length}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Create Date - Time</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Inspection ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Standard</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Note</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                    <span className="ml-2">Loading...</span>
                  </div>
                </td>
              </tr>
            ) : historyData.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  {searchTerm ? 'No history items found matching your search.' : 'No history items found.'}
                </td>
              </tr>
            ) : (
              historyData.map((item) => (
                <tr 
                  key={item.id} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => onViewResult(item.id)}
                >
                  <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedItems.has(item.id)}
                      onChange={() => handleSelectItem(item.id)}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {formatDateTime(item.createDate)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                    {item.id}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {item.standard}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {item.note}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      {historyData.length > 0 && (
        <div className="mt-6 text-sm text-gray-600">
          Showing {historyData.length} item(s)
          {searchTerm && ` matching "${searchTerm}"`}
          {selectedItems.size > 0 && ` | ${selectedItems.size} selected`}
        </div>
      )}
    </div>
  );
};
