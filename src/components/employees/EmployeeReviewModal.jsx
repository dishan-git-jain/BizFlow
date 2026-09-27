import React, { useState, useEffect } from 'react';
import { X, Star, ShieldCheck, AlertTriangle, UserCheck, ThumbsDown } from 'lucide-react';
import { useData } from '../../context/DataContext';

export const RETENTION_STATUSES = [
  { id: 'Capable & Retain', label: 'Capable & Retain (Top Performer)', color: 'bg-emerald-50 text-emerald-800 border-emerald-300', icon: ShieldCheck },
  { id: 'Satisfactory', label: 'Satisfactory (Meets Expectations)', color: 'bg-slate-100 text-slate-800 border-slate-300', icon: UserCheck },
  { id: 'Needs Improvement', label: 'Needs Improvement (Under Evaluation)', color: 'bg-amber-50 text-amber-800 border-amber-300', icon: AlertTriangle },
  { id: 'At Risk', label: 'At Risk (Unsatisfactory / Review Capability)', color: 'bg-red-50 text-red-800 border-red-300', icon: ThumbsDown }
];

export const EmployeeReviewModal = ({ isOpen, onClose, employee }) => {
  const { updateEmployee } = useData();

  const [rating, setRating] = useState(employee?.performanceRating || 4);
  const [retentionStatus, setRetentionStatus] = useState(employee?.retentionStatus || 'Capable & Retain');
  const [reviewNotes, setReviewNotes] = useState(employee?.reviewNotes || '');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (employee) {
      setRating(employee.performanceRating || 4);
      setRetentionStatus(employee.retentionStatus || 'Capable & Retain');
      setReviewNotes(employee.reviewNotes || '');
    }
  }, [employee]);

  if (!isOpen || !employee) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await updateEmployee(employee.id, {
        performanceRating: Number(rating),
        retentionStatus,
        reviewNotes: reviewNotes.trim(),
        lastReviewedDate: new Date().toISOString()
      });
      onClose();
    } catch (err) {
      console.error('Failed to update employee review:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full p-6 space-y-5">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">
              Review Work Capability & Performance
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Evaluating: <strong className="text-slate-800">{employee.name}</strong> ({employee.role})
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Performance Rating (1-5 Stars) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Overall Work Rating (1 to 5 Stars)
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 text-slate-300 hover:text-amber-500 transition-colors focus:outline-none"
                >
                  <Star
                    className={`w-7 h-7 ${
                      star <= rating
                        ? 'fill-amber-400 text-amber-500'
                        : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-bold text-slate-700 ml-2">
                {rating} / 5 Stars
              </span>
            </div>
          </div>

          {/* Retention & Capability Status */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Capability & Retention Status
            </label>
            <select
              value={retentionStatus}
              onChange={(e) => setRetentionStatus(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              {RETENTION_STATUSES.map((status) => (
                <option key={status.id} value={status.id}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          {/* Manager Work Evaluation Notes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Work Review & Capability Notes
            </label>
            <textarea
              rows={4}
              placeholder="Detail employee capabilities, work quality, task completion record, and reasons to retain or place under review..."
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
            >
              {submitting ? 'Saving Review...' : 'Save Performance Review'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
