import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MachineryRequest } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';
import { EmptyState } from '../common/EmptyState';
import {
  ClipboardList,
  Check,
  X,
  Eye,
  AlertTriangle,
  Calendar,
  Phone,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

export const VleRequestsList: React.FC = () => {
  const { activeVle, requests, updateRequestStatus } = useApp();

  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [selectedRequest, setSelectedRequest] = useState<MachineryRequest | null>(null);
  const [rejectingRequest, setRejectingRequest] = useState<MachineryRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const [actionFeedback, setActionFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  if (!activeVle) return null;

  // Filter requests that belong to this VLE
  const vleRequests = requests.filter((r) => r.vleId === activeVle.id);

  const filtered = vleRequests.filter((r) => {
    if (filterStatus === 'ALL') return true;
    return r.status === filterStatus;
  });

  const handleAccept = (req: MachineryRequest) => {
    setActionFeedback(null);
    const res = updateRequestStatus(req.id, 'Accepted');
    if (res.success) {
      setActionFeedback({ type: 'success', message: `Request from ${req.farmerName} has been Accepted.` });
      // Update selectedRequest modal if open
      if (selectedRequest?.id === req.id) {
        setSelectedRequest((prev) => (prev ? { ...prev, status: 'Accepted' } : null));
      }
    } else {
      setActionFeedback({ type: 'error', message: res.message });
    }
  };

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingRequest) return;

    const res = updateRequestStatus(
      rejectingRequest.id,
      'Rejected',
      rejectionReason.trim() || 'Machinery or crew unavailable on requested date'
    );

    if (res.success) {
      setActionFeedback({
        type: 'success',
        message: `Request from ${rejectingRequest.farmerName} has been marked as Rejected.`,
      });
      if (selectedRequest?.id === rejectingRequest.id) {
        setSelectedRequest((prev) =>
          prev ? { ...prev, status: 'Rejected', rejectionReason } : null
        );
      }
    } else {
      setActionFeedback({ type: 'error', message: res.message });
    }

    setRejectingRequest(null);
    setRejectionReason('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Farmer Machinery Requests</h1>
          <p className="text-xs sm:text-sm text-stone-700 mt-1">
            Review incoming bookings, verify inventory capacity, and accept or decline requests.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-stone-700 bg-white px-3 py-1.5 rounded-lg border border-stone-200 shadow-xs">
            Assigned Kendra: {activeVle.name} ({activeVle.village})
          </span>
        </div>
      </div>

      {/* Action feedback banner */}
      {actionFeedback && (
        <div
          className={`p-4 rounded-xl border text-sm flex items-center justify-between animate-in fade-in ${
            actionFeedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}
        >
          <div className="flex items-center gap-2">
            {actionFeedback.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <span>{actionFeedback.message}</span>
          </div>
          <button
            onClick={() => setActionFeedback(null)}
            className="text-xs font-bold text-stone-700 hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['ALL', 'Pending', 'Accepted', 'Rejected'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              filterStatus === st
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            {st === 'ALL' ? `All Received (${vleRequests.length})` : st}
          </button>
        ))}
      </div>

      {/* Requests Table / Cards */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No Requests in this View"
          description={`No farmer machinery requests found for status "${filterStatus}".`}
        />
      ) : (
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50/70 text-xs font-semibold text-stone-700 uppercase tracking-wider">
                  <th className="px-5 py-3.5">Farmer Name</th>
                  <th className="px-5 py-3.5">Village</th>
                  <th className="px-5 py-3.5">Machinery / Product</th>
                  <th className="px-5 py-3.5">Requested Date</th>
                  <th className="px-5 py-3.5">Quantity / Area</th>
                  <th className="px-5 py-3.5">Request Date</th>
                  <th className="px-5 py-3.5 text-center">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-sm">
                {filtered.map((req) => {
                  const stockItem = activeVle.machineryStock.find((m) => m.id === req.machineryId);
                  const isOutOfStock = stockItem ? stockItem.availableUnits <= 0 : false;
                  const isPending = req.status === 'Pending';

                  return (
                    <tr key={req.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="px-5 py-4 font-semibold text-stone-900">
                        <div className="space-y-0.5">
                          <span>{req.farmerName}</span>
                          <span className="block text-xs font-normal text-stone-700 font-mono">
                            +91 {req.farmerMobile}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-stone-700">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{req.farmerVillage}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-stone-900 font-medium">
                        <div>
                          <span>{req.machineryName}</span>
                          {isOutOfStock && isPending && (
                            <span className="flex items-center gap-1 text-[11px] font-semibold text-rose-600 mt-0.5">
                              <AlertTriangle className="w-3 h-3" />
                              0 Available in Fleet
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-stone-700 font-mono text-xs">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-stone-400" />
                          <span>{req.requestedDate}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-stone-800 font-medium">
                        {req.quantityOrArea}
                      </td>
                      <td className="px-5 py-4 text-stone-700 font-mono text-xs">
                        {req.requestDate}
                      </td>
                      <td className="px-5 py-4 text-center">
                        <StatusBadge status={req.status} size="sm" />
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View details */}
                          <button
                            onClick={() => setSelectedRequest(req)}
                            title="Open Request Details"
                            className="p-1.5 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Accept / Reject if pending */}
                          {isPending ? (
                            <>
                              <button
                                onClick={() => handleAccept(req)}
                                disabled={isOutOfStock}
                                title={
                                  isOutOfStock
                                    ? 'Cannot accept: Equipment is currently out of stock'
                                    : 'Accept and schedule this request'
                                }
                                className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                                  isOutOfStock
                                    ? 'bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed'
                                    : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs'
                                }`}
                              >
                                <Check className="w-3.5 h-3.5" />
                                Accept
                              </button>

                              <button
                                onClick={() => {
                                  setRejectingRequest(req);
                                  setRejectionReason('');
                                }}
                                title="Reject request"
                                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors"
                              >
                                <X className="w-3.5 h-3.5" />
                                Reject
                              </button>
                            </>
                          ) : (
                            <span className="text-xs font-medium text-stone-700 px-2 py-1">
                              Processed
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REQUEST DETAILS MODAL */}
      <Modal
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        title="Farmer Request Details"
        subtitle={`Booking #${selectedRequest?.id}`}
        maxWidth="md"
      >
        {selectedRequest && (
          <div className="space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <span className="text-xs font-semibold text-stone-700 uppercase">Booking Status</span>
              <StatusBadge status={selectedRequest.status} />
            </div>

            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3 p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                <div>
                  <span className="text-xs text-stone-700 block">Farmer Name</span>
                  <span className="font-bold text-stone-900">{selectedRequest.farmerName}</span>
                  <span className="text-xs text-stone-700 block font-mono mt-0.5">
                    +91 {selectedRequest.farmerMobile}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-stone-700 block">Farmer Village</span>
                  <span className="font-bold text-stone-900">{selectedRequest.farmerVillage}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                <div>
                  <span className="text-xs text-stone-700 block">Requested Machinery</span>
                  <span className="font-bold text-stone-900">{selectedRequest.machineryName}</span>
                </div>
                <div>
                  <span className="text-xs text-stone-700 block">Required Date</span>
                  <span className="font-bold text-stone-900 font-mono">
                    {selectedRequest.requestedDate}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-stone-700 block">Quantity / Area</span>
                  <span className="font-bold text-stone-900">{selectedRequest.quantityOrArea}</span>
                </div>
                <div>
                  <span className="text-xs text-stone-700 block">Submission Date</span>
                  <span className="font-semibold text-stone-700 font-mono">
                    {selectedRequest.requestDate}
                  </span>
                </div>
              </div>

              {selectedRequest.notes && (
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs">
                  <span className="font-semibold text-stone-700 block mb-0.5">Farmer Note:</span>
                  <p className="text-stone-800 italic">&ldquo;{selectedRequest.notes}&rdquo;</p>
                </div>
              )}

              {selectedRequest.rejectionReason && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800">
                  <span className="font-semibold block mb-0.5">Rejection Reason:</span>
                  <p>{selectedRequest.rejectionReason}</p>
                </div>
              )}
            </div>

            {/* In modal action buttons */}
            {selectedRequest.status === 'Pending' && (
              <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setRejectingRequest(selectedRequest);
                    setRejectionReason('');
                  }}
                  className="px-4 py-2 text-sm font-medium text-rose-700 hover:bg-rose-50 rounded-lg border border-rose-200 transition-colors"
                >
                  Reject Request
                </button>
                <button
                  type="button"
                  onClick={() => handleAccept(selectedRequest)}
                  className="px-5 py-2 text-sm font-medium bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg shadow-xs transition-colors"
                >
                  Accept Request
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* REJECT CONFIRMATION MODAL */}
      <Modal
        isOpen={!!rejectingRequest}
        onClose={() => setRejectingRequest(null)}
        title="Decline Farmer Request"
        subtitle={`Request for ${rejectingRequest?.machineryName}`}
        maxWidth="sm"
      >
        <form onSubmit={handleConfirmReject} className="space-y-4">
          <p className="text-xs text-stone-700">
            Please indicate why this machinery request cannot be fulfilled by your Kendra:
          </p>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Reason for Rejection
            </label>
            <textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Machinery already committed on that date; equipment undergoing routine maintenance."
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:border-rose-600 focus:ring-1 focus:ring-rose-600"
              required
            />
          </div>

          <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setRejectingRequest(null)}
              className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-medium bg-rose-700 hover:bg-rose-800 text-white rounded-lg shadow-xs transition-colors"
            >
              Confirm Rejection
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
