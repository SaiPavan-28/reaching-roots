import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { VLE, MachineryItem } from '../../types';
import { Modal } from '../common/Modal';
import { Plus, Eye, Search, Phone, MapPin, Store, Wrench, Package, CheckCircle2 } from 'lucide-react';

export const VleManagement: React.FC = () => {
  const { vles, villages, addVLE } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedVle, setSelectedVle] = useState<VLE | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    village: villages[0]?.name || 'Rampur',
    centerName: '',
    machineryName: 'Tractor 45HP with Trolley',
    machineryUnits: '2',
  });
  const [formError, setFormError] = useState('');

  const filteredVles = vles.filter(
    (v) =>
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.centerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.village.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.mobile.includes(searchTerm)
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError('VLE name is required');
      return;
    }
    const cleanMobile = formData.mobile.replace(/\D/g, '');
    if (cleanMobile.length < 10) {
      setFormError('Please enter a valid 10-digit mobile number');
      return;
    }
    if (!formData.centerName.trim()) {
      setFormError('Kendra/Center name is required');
      return;
    }

    const initialMachinery: MachineryItem[] = [
      {
        id: `mach-${Date.now()}-1`,
        name: formData.machineryName,
        category: 'Field Equipment',
        availableUnits: Number(formData.machineryUnits) || 1,
        totalUnits: Number(formData.machineryUnits) || 1,
        rateDescription: '₹800 / hour',
      },
      {
        id: `mach-${Date.now()}-2`,
        name: 'Rotary Tiller (Rotavator)',
        category: 'Soil Tillage',
        availableUnits: 1,
        totalUnits: 1,
        rateDescription: '₹950 / acre',
      },
      {
        id: `mach-${Date.now()}-3`,
        name: 'Power Sprayer (16L Battery)',
        category: 'Crop Protection',
        availableUnits: 2,
        totalUnits: 2,
        rateDescription: '₹250 / day',
      },
    ];

    addVLE({
      name: formData.name.trim(),
      mobile: cleanMobile,
      village: formData.village.trim(),
      centerName: formData.centerName.trim(),
      totalFarmersServed: 0,
      machineryStock: initialMachinery,
    });

    setFormData({
      name: '',
      mobile: '',
      village: villages[0]?.name || 'Rampur',
      centerName: '',
      machineryName: 'Tractor 45HP with Trolley',
      machineryUnits: '2',
    });
    setFormError('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">VLE Management</h1>
          <p className="text-xs sm:text-sm text-stone-700 mt-1">
            Oversee Village Level Entrepreneurs, machinery rental fleets, and farmer outreach centers.
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
          Onboard VLE
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-3 rounded-xl border border-stone-200 flex items-center gap-2 shadow-xs">
        <Search className="w-4 h-4 text-stone-400 shrink-0 ml-2" />
        <input
          type="text"
          placeholder="Search VLE by entrepreneur name, center, or village..."
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

      {/* VLE List/Table */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50/70 text-xs font-semibold text-stone-700 uppercase tracking-wider">
                <th className="px-5 py-3.5">VLE Name & Center</th>
                <th className="px-5 py-3.5">Mobile Number</th>
                <th className="px-5 py-3.5">Village</th>
                <th className="px-5 py-3.5">Machinery & Stock Summary</th>
                <th className="px-5 py-3.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-sm">
              {filteredVles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-stone-700">
                    No VLE centers found matching your search.
                  </td>
                </tr>
              ) : (
                filteredVles.map((vle) => {
                  const totalUnits = vle.machineryStock.reduce((acc, m) => acc + m.totalUnits, 0);
                  const availableUnits = vle.machineryStock.reduce((acc, m) => acc + m.availableUnits, 0);

                  return (
                    <tr key={vle.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="px-5 py-4 font-semibold text-stone-900">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs shrink-0">
                            {vle.name.charAt(0)}
                          </div>
                          <div>
                            <span>{vle.name}</span>
                            <span className="block text-xs font-normal text-stone-700">
                              {vle.centerName}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-stone-700 font-mono text-xs sm:text-sm">
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-stone-400" />
                          +91 {vle.mobile}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-stone-700">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{vle.village}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-stone-700">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs">
                            <span className="font-semibold text-stone-800">
                              {vle.machineryStock.length} Types
                            </span>
                            <span className="text-stone-300">•</span>
                            <span className="text-emerald-700 font-medium">
                              {availableUnits}/{totalUnits} Units Available
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-700 truncate max-w-xs">
                            {vle.machineryStock.map((m) => m.name.split(' ')[0]).join(', ')}
                          </p>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <button
                          onClick={() => setSelectedVle(vle)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg border border-emerald-200 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ONBOARD VLE MODAL */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Onboard Village Level Entrepreneur (VLE)"
        subtitle="Register a new rural enterprise center"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
              {formError}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
              VLE Entrepreneur Name *
            </label>
            <input
              type="text"
              name="name"
              placeholder="e.g. Rajesh Kumar"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
              Center / Kendra Name *
            </label>
            <input
              type="text"
              name="centerName"
              placeholder="e.g. Rampur Kisan Seva Kendra"
              value={formData.centerName}
              onChange={handleInputChange}
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Mobile Number *
              </label>
              <input
                type="tel"
                name="mobile"
                maxLength={10}
                placeholder="10-digit number"
                value={formData.mobile}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Assigned Village *
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
                    {v.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-2 border-t border-stone-100">
            <span className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
              Initial Machinery Allocation
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <select
                  name="machineryName"
                  value={formData.machineryName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:border-emerald-600 bg-white"
                >
                  <option value="Tractor 45HP with Trolley">Tractor 45HP with Trolley</option>
                  <option value="Combine Harvester">Combine Harvester</option>
                  <option value="Multi-crop Thresher">Multi-crop Thresher</option>
                  <option value="Seed-cum-Fertilizer Drill">Seed-cum-Fertilizer Drill</option>
                  <option value="Laser Land Leveler">Laser Land Leveler</option>
                </select>
              </div>
              <div>
                <input
                  type="number"
                  min="1"
                  max="10"
                  name="machineryUnits"
                  placeholder="Units"
                  value={formData.machineryUnits}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>
            <p className="text-[11px] text-stone-700 mt-1">
              Standard implements (Rotavator, Power Sprayer) will be automatically assigned.
            </p>
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
              Onboard VLE
            </button>
          </div>
        </form>
      </Modal>

      {/* VLE DETAILS MODAL */}
      <Modal
        isOpen={!!selectedVle}
        onClose={() => setSelectedVle(null)}
        title={selectedVle?.name || 'VLE Details'}
        subtitle={selectedVle?.centerName}
        maxWidth="lg"
      >
        {selectedVle && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-stone-50 rounded-xl border border-stone-200">
              <div className="w-14 h-14 rounded-full bg-teal-700 text-white flex items-center justify-center font-bold text-xl shrink-0">
                {selectedVle.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-stone-900">{selectedVle.name}</h3>
                <p className="text-xs font-semibold text-emerald-800">{selectedVle.centerName}</p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-700 mt-1">
                  <span className="flex items-center gap-1 font-mono">
                    <Phone className="w-3.5 h-3.5 text-stone-400" />
                    +91 {selectedVle.mobile}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    Center Base: {selectedVle.village}
                  </span>
                  <span className="flex items-center gap-1 font-medium text-teal-800">
                    <Store className="w-3.5 h-3.5 text-teal-600" />
                    Farmers Served: {selectedVle.totalFarmersServed}
                  </span>
                </div>
              </div>
            </div>

            {/* Machinery & Stock Information Table */}
            <div>
              <h4 className="text-sm font-bold text-stone-900 mb-2 flex items-center justify-between">
                <span>Machinery Fleet & Inventory</span>
                <span className="text-xs text-stone-700">
                  {selectedVle.machineryStock.length} equipment types in stock
                </span>
              </h4>

              <div className="border border-stone-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-700 font-semibold">
                    <tr>
                      <th className="p-3">Equipment Name</th>
                      <th className="p-3">Category</th>
                      <th className="p-3 text-center">Available / Total</th>
                      <th className="p-3 text-right">Standard Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {selectedVle.machineryStock.map((m) => (
                      <tr key={m.id} className="hover:bg-stone-50/50">
                        <td className="p-3 font-semibold text-stone-900 flex items-center gap-2">
                          <Wrench className="w-3.5 h-3.5 text-stone-400" />
                          {m.name}
                        </td>
                        <td className="p-3 text-stone-700">{m.category}</td>
                        <td className="p-3 text-center">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-full font-bold ${
                              m.availableUnits > 0
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {m.availableUnits} / {m.totalUnits} Units
                          </span>
                        </td>
                        <td className="p-3 text-right font-medium text-stone-800">
                          {m.rateDescription || 'Standard rate'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-200 flex justify-end">
              <button
                onClick={() => setSelectedVle(null)}
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
