import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Farmer } from '../../types';
import { Modal } from '../common/Modal';
import { Plus, Eye, Search, Phone, MapPin, User, Calendar, Sprout, ClipboardList } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';

export const FarmerManagement: React.FC = () => {
  const { farmers, villages, addFarmer, requests, history } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null);

  // Add form state
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    village: villages[0]?.name || 'Rampur',
    landAcres: '',
    primaryCrop: '',
  });
  const [formError, setFormError] = useState('');

  const filteredFarmers = farmers.filter(
    (f) =>
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.mobile.includes(searchTerm) ||
      f.village.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError('Farmer name is required');
      return;
    }
    const cleanMobile = formData.mobile.replace(/\D/g, '');
    if (cleanMobile.length < 10) {
      setFormError('Please enter a valid 10-digit mobile number');
      return;
    }
    if (!formData.village.trim()) {
      setFormError('Please select or specify a village');
      return;
    }

    addFarmer({
      name: formData.name.trim(),
      mobile: cleanMobile,
      village: formData.village.trim(),
      landAcres: formData.landAcres ? Number(formData.landAcres) : undefined,
      primaryCrop: formData.primaryCrop.trim() || 'Wheat & Paddy',
    });

    setFormData({
      name: '',
      mobile: '',
      village: villages[0]?.name || 'Rampur',
      landAcres: '',
      primaryCrop: '',
    });
    setFormError('');
    setIsAddModalOpen(false);
  };

  // Farmer's requests and history for details modal
  const farmerRequests = selectedFarmer
    ? requests.filter((r) => r.farmerId === selectedFarmer.id)
    : [];

  const farmerHistory = selectedFarmer
    ? history.filter((h) => h.farmerId === selectedFarmer.id)
    : [];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Farmer Management</h1>
          <p className="text-xs sm:text-sm text-stone-700 mt-1">
            Maintain farmer identities, mobile contact verification, and agricultural parcels.
          </p>
        </div>

        <button
          onClick={() => {
            setFormError('');
            setIsAddModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-medium rounded-xl shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          Register Farmer
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-3 rounded-xl border border-stone-200 flex items-center gap-2 shadow-xs">
        <Search className="w-4 h-4 text-stone-400 shrink-0 ml-2" />
        <input
          type="text"
          placeholder="Search farmers by name, phone number, or village..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full text-sm bg-transparent border-none focus:outline-none text-stone-900 placeholder:text-stone-400"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="text-xs text-stone-400 hover:text-stone-700 px-2 py-1 rounded"
          >
            Clear
          </button>
        )}
      </div>

      {/* Farmer List/Table */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50/70 text-xs font-semibold text-stone-700 uppercase tracking-wider">
                <th className="px-5 py-3.5">Farmer Name</th>
                <th className="px-5 py-3.5">Mobile Number</th>
                <th className="px-5 py-3.5">Village</th>
                <th className="px-5 py-3.5">Land Holding</th>
                <th className="px-5 py-3.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-sm">
              {filteredFarmers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-stone-700">
                    No farmers found matching your search.
                  </td>
                </tr>
              ) : (
                filteredFarmers.map((farmer) => (
                  <tr key={farmer.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="px-5 py-4 font-semibold text-stone-900">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                          {farmer.name.charAt(0)}
                        </div>
                        <div>
                          <span>{farmer.name}</span>
                          {farmer.primaryCrop && (
                            <span className="block text-xs font-normal text-stone-700">
                              Crop: {farmer.primaryCrop}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-stone-700 font-mono text-xs sm:text-sm">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-stone-400" />
                        +91 {farmer.mobile}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-stone-700">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{farmer.village}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-stone-700">
                      {farmer.landAcres ? `${farmer.landAcres} Acres` : 'Smallholder'}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <button
                        onClick={() => setSelectedFarmer(farmer)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg border border-emerald-200 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD/REGISTER FARMER MODAL */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Register New Farmer"
        subtitle="Add a farmer record to the district agriculture database"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
              {formError}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
              Farmer Full Name *
            </label>
            <input
              type="text"
              name="name"
              placeholder="e.g. Ramesh Patel"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
              Mobile Number * (Used for OTP Login)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-sm text-stone-700 font-mono">+91</span>
              <input
                type="tel"
                name="mobile"
                maxLength={10}
                placeholder="10-digit number"
                value={formData.mobile}
                onChange={handleInputChange}
                className="w-full pl-12 pr-3.5 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 font-mono"
                required
              />
            </div>
            <p className="text-[11px] text-stone-700 mt-1">
              Farmers log in using this mobile number and the OTP verification flow.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
              Village *
            </label>
            <select
              name="village"
              value={formData.village}
              onChange={handleInputChange}
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 bg-white"
              required
            >
              {villages.map((v) => (
                <option key={v.id} value={v.name}>
                  {v.name} ({v.district || 'District'})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Land Size (Acres)
              </label>
              <input
                type="number"
                step="0.1"
                name="landAcres"
                placeholder="e.g. 4.5"
                value={formData.landAcres}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Primary Crops
              </label>
              <input
                type="text"
                name="primaryCrop"
                placeholder="e.g. Wheat, Mustard"
                value={formData.primaryCrop}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-medium bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg transition-colors shadow-xs"
            >
              Complete Registration
            </button>
          </div>
        </form>
      </Modal>

      {/* FARMER DETAILS MODAL / PAGE VIEW */}
      <Modal
        isOpen={!!selectedFarmer}
        onClose={() => setSelectedFarmer(null)}
        title={selectedFarmer?.name || 'Farmer Details'}
        subtitle={`Member from ${selectedFarmer?.village}`}
        maxWidth="lg"
      >
        {selectedFarmer && (
          <div className="space-y-6">
            {/* Quick Profile Summary */}
            <div className="flex items-center gap-4 p-4 bg-stone-50 rounded-xl border border-stone-200">
              <div className="w-14 h-14 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xl shrink-0">
                {selectedFarmer.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-stone-900">{selectedFarmer.name}</h3>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-700 mt-1">
                  <span className="flex items-center gap-1 font-mono">
                    <Phone className="w-3.5 h-3.5 text-stone-400" />
                    +91 {selectedFarmer.mobile}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    Village: {selectedFarmer.village}
                  </span>
                  {selectedFarmer.registeredDate && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-stone-400" />
                      Registered: {selectedFarmer.registeredDate}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Land & Crop Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl border border-stone-200 bg-white">
                <span className="text-xs font-semibold text-stone-700 block uppercase tracking-wider">
                  Land Holding
                </span>
                <span className="text-lg font-bold text-stone-900 mt-1 block">
                  {selectedFarmer.landAcres ? `${selectedFarmer.landAcres} Acres` : 'Not recorded'}
                </span>
              </div>
              <div className="p-3.5 rounded-xl border border-stone-200 bg-white">
                <span className="text-xs font-semibold text-stone-700 block uppercase tracking-wider">
                  Cultivated Crops
                </span>
                <span className="text-base font-bold text-emerald-800 mt-1 block">
                  {selectedFarmer.primaryCrop || 'Mixed Seasonal Crops'}
                </span>
              </div>
            </div>

            {/* Farmer's Machinery Requests */}
            <div>
              <h4 className="text-sm font-bold text-stone-900 mb-2 flex items-center justify-between">
                <span>Machinery Requests</span>
                <span className="text-xs text-stone-700">{farmerRequests.length} total requests</span>
              </h4>

              {farmerRequests.length === 0 ? (
                <div className="p-4 bg-stone-50 border border-stone-200 rounded-lg text-center text-xs text-stone-700">
                  No machinery requests logged yet for this farmer.
                </div>
              ) : (
                <div className="border border-stone-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-50 border-b border-stone-200 text-stone-700 font-semibold">
                      <tr>
                        <th className="p-2.5">Machinery</th>
                        <th className="p-2.5">VLE</th>
                        <th className="p-2.5">Requested Date</th>
                        <th className="p-2.5">Quantity/Area</th>
                        <th className="p-2.5 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {farmerRequests.map((req) => (
                        <tr key={req.id}>
                          <td className="p-2.5 font-medium text-stone-900">{req.machineryName}</td>
                          <td className="p-2.5 text-stone-700">{req.vleName}</td>
                          <td className="p-2.5 text-stone-700">{req.requestedDate}</td>
                          <td className="p-2.5 text-stone-700">{req.quantityOrArea}</td>
                          <td className="p-2.5 text-right">
                            <StatusBadge status={req.status} size="sm" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Farmer's Transaction / Service History */}
            <div>
              <h4 className="text-sm font-bold text-stone-900 mb-2 flex items-center justify-between">
                <span>Service & Purchase History</span>
                <span className="text-xs text-stone-700">{farmerHistory.length} transactions</span>
              </h4>

              {farmerHistory.length === 0 ? (
                <div className="p-4 bg-stone-50 border border-stone-200 rounded-lg text-center text-xs text-stone-700">
                  No service or product transactions on record.
                </div>
              ) : (
                <div className="border border-stone-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-50 border-b border-stone-200 text-stone-700 font-semibold">
                      <tr>
                        <th className="p-2.5">Product/Service</th>
                        <th className="p-2.5">VLE</th>
                        <th className="p-2.5">Date</th>
                        <th className="p-2.5">Qty</th>
                        <th className="p-2.5 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {farmerHistory.map((h) => (
                        <tr key={h.id}>
                          <td className="p-2.5 font-medium text-stone-900">{h.productOrService}</td>
                          <td className="p-2.5 text-stone-700">{h.vleName}</td>
                          <td className="p-2.5 text-stone-700">{h.date}</td>
                          <td className="p-2.5 text-stone-700">{h.quantity}</td>
                          <td className="p-2.5 text-right font-semibold text-stone-900">
                            ₹{h.amount.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-stone-200 flex justify-end">
              <button
                onClick={() => setSelectedFarmer(null)}
                className="px-4 py-2 text-sm font-medium bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
