import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import type { Standard, SamplingPoint } from '../types';
import { standardService } from '../services/standardService';

// Validation schema using Zod
const inspectionSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  standard: z.string().min(1, 'Standard is required'),
  note: z.string(),
  price: z
    .number()
    .min(0, 'Price must be at least 0')
    .max(100000, 'Price must not exceed 100,000')
    .multipleOf(0.01, 'Price can have at most 2 decimal places')
    .optional(),
  samplingPoints: z.array(z.string()),
  dateTimeOfSampling: z.date().optional(),
  uploadFile: z.instanceof(File).optional(),
});

type FormData = z.infer<typeof inspectionSchema>;

const SAMPLING_POINTS: SamplingPoint[] = ['Front End', 'Back End', 'Other'];

interface InspectionFormProps {
  onSubmit?: (data: FormData) => Promise<void>;
  onViewHistory?: () => void;
}

export const InspectionForm: React.FC<InspectionFormProps> = ({ onSubmit: onSubmitProp, onViewHistory }) => {
  const [standards, setStandards] = useState<Standard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(inspectionSchema),
    defaultValues: {
      name: '',
      standard: '',
      note: '',
      samplingPoints: [],
    },
  });

  // Fetch standards on component mount
  useEffect(() => {
    const fetchStandards = async () => {
      try {
        setLoading(true);
        const fetchedStandards = await standardService.getStandards();
        setStandards(fetchedStandards);
      } catch (err) {
        setError('Failed to load standards');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStandards();
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      if (onSubmitProp) {
        await onSubmitProp(data);
      } else {
        console.log('Form Data:', data);
        alert('Inspection created successfully!');
      }
    } catch (err) {
      console.error('Error creating inspection:', err);
      alert('Failed to create inspection');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'application/json') {
        alert('Please upload a JSON file');
        return;
      }
      setValue('uploadFile', file);
    }
  };

  const handleSamplingPointChange = (point: SamplingPoint, checked: boolean) => {
    const currentPoints = watch('samplingPoints') || [];
    if (checked) {
      setValue('samplingPoints', [...currentPoints, point]);
    } else {
      setValue('samplingPoints', currentPoints.filter(p => p !== point));
    }
  };

  if (loading) {
    return (
      <div className="form-container">
        <div className="form-content">
          <h2 className="form-title">Create Inspection</h2>
          <div className="loading-container">
            <div className="loading-text">Loading standards...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="form-container">
      <div className="form-content">
        <div className="flex justify-between items-center mb-6">
          <h2 className="form-title">Create Inspection</h2>
          {onViewHistory && (
  <button
    type="button"
    onClick={onViewHistory}
    className="btn btn-submit"
  >
    View History
  </button>
)}
        </div>
        
        {error && (
          <div className="error-banner">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Name Field */}
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Name*
            </label>
            <input
              {...register('name')}
              type="text"
              id="name"
              className="form-input"
              placeholder="Please Holder"
            />
            {errors.name && (
              <p className="error-message">{errors.name.message}</p>
            )}
          </div>

          {/* Standard Field */}
          <div className="form-group">
            <label htmlFor="standard" className="form-label">
              Standard*
            </label>
            <select
              {...register('standard')}
              id="standard"
              className="form-select"
            >
              <option value="">Please Select Standard</option>
              {standards.map((standard) => (
                <option key={standard.id} value={standard.id}>
                  {standard.name}
                </option>
              ))}
            </select>
            {errors.standard && (
              <p className="error-message">{errors.standard.message}</p>
            )}
          </div>

          {/* Upload File Field */}
          <div className="form-group">
            <label htmlFor="uploadFile" className="form-label">
              Upload File
            </label>
            <input
              type="file"
              id="uploadFile"
              accept=".json"
              onChange={handleFileUpload}
              className="file-input"
              placeholder="raw1.json"
            />
          </div>

          {/* Note Field */}
          <div className="form-group">
            <label htmlFor="note" className="form-label">
              Note
            </label>
            <textarea
              {...register('note')}
              id="note"
              rows={3}
              className="form-textarea"
              placeholder="Please Holder"
            />
          </div>

          {/* Price Field */}
          <div className="form-group">
            <label htmlFor="price" className="form-label">
              Price
            </label>
            <input
              {...register('price', { 
                valueAsNumber: true,
                setValueAs: (value) => value === '' ? undefined : parseFloat(value)
              })}
              type="number"
              id="price"
              step="0.01"
              min="0"
              max="100000"
              className="form-input"
              placeholder="10,000"
            />
            {errors.price && (
              <p className="error-message">{errors.price.message}</p>
            )}
          </div>

          {/* Sampling Points */}
          <div className="form-group">
            <label className="form-label">
              Sampling Point
            </label>
            <div className="checkbox-group">
              {SAMPLING_POINTS.map((point) => (
                <label key={point} className="checkbox-item">
                  <input
                    type="checkbox"
                    className="checkbox-input"
                    onChange={(e) => handleSamplingPointChange(point, e.target.checked)}
                  />
                  <span className="checkbox-label">{point}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Date/Time of Sampling */}
          <div className="form-group">
            <label htmlFor="dateTimeOfSampling" className="form-label">
              Date/Time of Sampling
            </label>
            <Controller
              control={control}
              name="dateTimeOfSampling"
              render={({ field: { onChange, value } }) => (
                <DatePicker
                  selected={value}
                  onChange={onChange}
                  showTimeSelect
                  timeFormat="HH:mm:ss"
                  timeIntervals={1}
                  dateFormat="dd/MM/yyyy HH:mm:ss"
                  className="form-input"
                  placeholderText="12/08/2023 18:00:00"
                />
              )}
            />
          </div>

          {/* Submit and Cancel Buttons */}
          <div className="button-group">
            <button
              type="button"
              className="btn btn-cancel"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-submit"
            >
              {isSubmitting ? 'Creating...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
