import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Village } from '../../types';
import { Modal } from '../common/Modal';
import { Plus, Eye, Search, Building2, Droplets, Users, MapPin, CheckCircle2 } from 'lucide-react';

export const VillageManagement: React.FC = () => {
  const { villages, addVillage, farmers } = useApp();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedVillage, setSelectedVillage] = useState<Village | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    farmersCount: '',
    waterResources: '',
    acresUnderCultivation: '',
    district: '',
    panchayat: '',
  });
  const [formError, setFormError] = useState('');

  const filteredVillages = villages.filter(
    (v) =>
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.waterResources.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (v.district && v.district.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError('Village name is required');
      return;
    }
    if (!formData.waterResources.trim()) {
      setFormError('Water resources information is required');
      return;
    }
    if (!formData.acresUnderCultivation || Number(formData.acresUnderCultivation) < 0) {
      setFormError('Please enter valid acres under cultivation');
      return;
    }

    addVillage({
      name: formData.name.trim(),
      farmersCount: Number(formData.farmersCount) || 0,
      waterResources: formData.waterResources.trim(),
      acresUnderCultivation: Number(formData.acresUnderCultivation),
      district: formData.district.trim() || 'Varanasi',
      panchayat: formData.panchayat.trim() || `${formData.name.trim()} Gram Panchayat`,
    });

    // Reset and close
    setFormData({
      name: '',
      farmersCount: '',
      waterResources: '',
      acresUnderCultivation: '',
      district: '',
      panchayat: '',
    });
    setFormError('');
    setIsAddModalOpen(false);
  };

  // Associated farmers for selected village
  const associatedFarmers = selectedVillage
    ? farmers.filter((f) => f.village.toLowerCase() === selectedVillage.name.toLowerCase())
    : [];

  return (
    <div className="space-y-6">
      {/* Top Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Village Management</h1>
          <p className="text-xs sm:text-sm text-stone-700 mt-1">
            Track village agricultural coverage, irrigation networks, and cultivable land distribution.
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
          Add Village
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-3 rounded-xl border border-stone-200 flex items-center gap-2 shadow-xs">
        <Search className="w-4 h-4 text-stone-400 shrink-0 ml-2" />
        <input
          type="text"
          placeholder="Search village by name, water resources, or district..."
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

      {/* Village List/Table */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50/70 text-xs font-semibold text-stone-700 uppercase tracking-wider">
                <th className="px-5 py-3.5">Village Name</th>
                <th className="px-5 py-3.5 text-right">Farmers</th>
                <th className="px-5 py-3.5">Water Resources</th>
                <th className="px-5 py-3.5 text-right">Acres Under Cultivation</th>
                <th className="px-5 py-3.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-sm">
              {filteredVillages.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-stone-700">
                    No villages found matching your search.
                  </td>
                </tr>
              ) : (
                filteredVillages.map((village) => (
                  <tr key={village.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="px-5 py-4 font-semibold text-stone-900">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <div>
                          <span>{village.name}</span>
                          {village.district && (
                            <span className="block text-xs font-normal text-stone-700">
                              Dist: {village.district}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right font-medium text-stone-900">
                      {village.farmersCount}
                    </td>
                    <td className="px-5 py-4 text-stone-700 max-w-xs">
                      <div className="flex items-start gap-1.5">
                        <Droplets className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                        <span className="truncate block">{village.waterResources}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right font-semibold text-emerald-800">
                      {village.acresUnderCultivation.toLocaleString()} Acres
                    </td>
                    <td className="px-5 py-4 text-center">
                      <button
                        onClick={() => setSelectedVillage(village)}
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

      {/* ADD VILLAGE MODAL */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Village"
        subtitle="Register a new village cluster to the agriculture management system"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
              {formError}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
              Village Name *
            </label>
            <input
              type="text"
              name="name"
              placeholder="e.g. Rampur"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Number of Farmers
              </label>
              <input
                type="number"
                name="farmersCount"
                placeholder="e.g. 120"
                min="0"
                value={formData.farmersCount}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Acres Under Cultivation *
              </label>
              <input
                type="number"
                name="acresUnderCultivation"
                placeholder="e.g. 750"
                min="0"
                value={formData.acresUnderCultivation}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
              Water Resources *
            </label>
            <textarea
              name="waterResources"
              rows={2}
              placeholder="e.g. Canal network, 3 Community Tube-wells, River basin"
              value={formData.waterResources}
              onChange={handleInputChange}
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              required
            />
            <p className="text-[11px] text-stone-700 mt-0.5">
              Specify canals, borewells, check dams, ponds, or groundwater sources available.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                District
              </label>
              <input
                type="text"
                name="district"
                placeholder="e.g. Varanasi"
                value={formData.district}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Gram Panchayat
              </label>
              <input
                type="text"
                name="panchayat"
                placeholder="e.g. Rampur Panchayat"
                value={formData.panchayat}
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
              Save Village
            </button>
          </div>
        </form>
      </Modal>

      {/* VIEW VILLAGE DETAILS MODAL */}
      <Modal
        isOpen={!!selectedVillage}
        onClose={() => setSelectedVillage(null)}
        title={selectedVillage?.name || 'Village Details'}
        subtitle="Detailed agricultural and irrigation profile"
        maxWidth="lg"
      >
        {selectedVillage && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-stone-50 rounded-xl border border-stone-200/80 text-center">
              <div>
                <span className="text-xs text-stone-700 block">Total Farmers</span>
                <span className="text-lg font-bold text-stone-900">{selectedVillage.farmersCount}</span>
              </div>
              <div>
                <span className="text-xs text-stone-700 block">Cultivated Land</span>
                <span className="text-lg font-bold text-emerald-800">
                  {selectedVillage.acresUnderCultivation} Ac
                </span>
              </div>
              <div>
                <span className="text-xs text-stone-700 block">District</span>
                <span className="text-sm font-bold text-stone-900">{selectedVillage.district || 'Varanasi'}</span>
              </div>
              <div>
                <span className="text-xs text-stone-700 block">Panchayat</span>
                <span className="text-xs font-semibold text-stone-900 truncate block">
                  {selectedVillage.panchayat || `${selectedVillage.name} GP`}
                </span>
              </div>
            </div>

            {/* Water Resources card */}
            <div className="p-4 rounded-xl border border-sky-200 bg-sky-50/50">
              <div className="flex items-center gap-2 mb-1 text-sky-900 font-semibold text-sm">
                <Droplets className="w-4 h-4 text-sky-600" />
                Water & Irrigation Infrastructure
              </div>
              <p className="text-sm text-sky-950 font-medium">{selectedVillage.waterResources}</p>
            </div>

            {/* Registered Farmers in this Village */}
            <div>
              <h4 className="text-sm font-bold text-stone-900 mb-2 flex items-center justify-between">
                <span>Registered Farmers from {selectedVillage.name}</span>
                <span className="text-xs font-medium text-stone-700">
                  {associatedFarmers.length} registered in system
                </span>
              </h4>

              {associatedFarmers.length === 0 ? (
                <div className="p-4 rounded-lg bg-stone-50 text-center text-xs text-stone-700">
                  No individual farmer records linked yet for this village.
                </div>
              ) : (
                <div className="border border-stone-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-50 border-b border-stone-200 text-stone-700 font-semibold">
                      <tr>
                        <th className="p-2.5">Farmer Name</th>
                        <th className="p-2.5">Mobile</th>
                        <th className="p-2.5">Land Holding</th>
                        <th className="p-2.5">Primary Crop</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {associatedFarmers.map((farmer) => (
                        <tr key={farmer.id}>
                          <td className="p-2.5 font-medium text-stone-900">{farmer.name}</td>
                          <td className="p-2.5 text-stone-700">{farmer.mobile}</td>
                          <td className="p-2.5 text-stone-700">{farmer.landAcres || '-'} Acres</td>
                          <td className="p-2.5 text-stone-700">{farmer.primaryCrop || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-stone-200 flex justify-end">
              <button
                onClick={() => setSelectedVillage(null)}
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
