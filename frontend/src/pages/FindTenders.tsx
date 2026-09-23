import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { TenderCard } from '../components/tender/TenderCard';

import { EmptyState } from '../components/common/EmptyState';
import { tenderService } from '../services/tenderService';
import { Tender } from '../types';
import { Search, Filter, ChevronDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function FindTenders() {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    department: '',
    state: '',
    category: '',
    minValue: '',
    maxValue: '',
    deadline: '',
    status: '',
  });
  const { t } = useLanguage();

  useEffect(() => {
    async function load() {
      const data = await tenderService.getAll();
      setTenders(data);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = tenders.filter((t) => {
    const matchesQuery =
      t.title.toLowerCase().includes(query.toLowerCase()) ||
      t.department.toLowerCase().includes(query.toLowerCase()) ||
      t.location.toLowerCase().includes(query.toLowerCase());
    
    const matchesDepartment = !filters.department || t.department === filters.department;
    const matchesState = !filters.state || t.location.includes(filters.state); // Assuming location contains state
    const matchesCategory = !filters.category || true; // Would need category field in tender
    const matchesMinValue = !filters.minValue || t.valueNumeric >= Number(filters.minValue);
    const matchesMaxValue = !filters.maxValue || t.valueNumeric <= Number(filters.maxValue);
    const matchesStatus = !filters.status || t.status === filters.status;
    
    return matchesQuery && matchesDepartment && matchesState && matchesCategory && matchesMinValue && matchesMaxValue && matchesStatus;
  });

  // Extract unique values for filter dropdowns
  const departments = Array.from(new Set(tenders.map((t) => t.department)));
  // Extract states from locations (simplified)
  const states = Array.from(new Set(tenders.map((t) => {
    const parts = t.location.split(',');
    return parts.length > 1 ? parts[1].trim() : '';
  }).filter(state => state)));
  const categories = ['Construction', 'Infrastructure', 'IT Services', 'Consulting', 'Equipment']; // Sample categories

  const clearFilters = () => {
    setFilters({
      department: '',
      state: '',
      category: '',
      minValue: '',
      maxValue: '',
      deadline: '',
      status: '',
    });
    setQuery('');
  };

  return (
    <AppLayout>
      <div className='space-y-6'>
        <div className='flex flex-col lg:flex-row lg:items-start lg:justify-between'>
          <div>
            <h1 className='text-2xl lg:text-3xl font-bold text-slate-900'>
              {t('findTenders.title')}
            </h1>
            <p className='mt-2 text-slate-600'>
              {t('findTenders.subtitle')}
            </p>
          </div>
          
          <div className='flex items-center gap-4'>
            <div className='relative flex-1 lg:w-64'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400' size={20} />
              <input
                type='text'
                placeholder={t('findTenders.searchPlaceholder')}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className='w-full rounded-lg border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className='flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50'
            >
              <Filter size={18} />
              {t('findTenders.filters')}
              <ChevronDown size={14} className='ml-1' />
            </button>
          </div>
        </div>

        {showFilters && (
          <div className='rounded-xl border border-slate-200 bg-white p-6'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-sm font-semibold text-slate-900'>
                {t('findTenders.filters')}
              </h3>
              <button onClick={clearFilters} className='text-xs text-blue-600 hover:text-blue-700'>
                {t('findTenders.clearAll')}
              </button>
            </div>
            
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
              <div>
                <label className='block text-xs font-medium text-slate-700 mb-1'>
                  {t('findTenders.department')}
                </label>
                <select
                  value={filters.department}
                  onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                  className='w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                  <option value=''>{t('findTenders.allDepartments')}</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className='block text-xs font-medium text-slate-700 mb-1'>
                  {t('findTenders.state')}
                </label>
                <select
                  value={filters.state}
                  onChange={(e) => setFilters({ ...filters, state: e.target.value })}
                  className='w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                  <option value=''>{t('findTenders.allStates')}</option>
                  {states.map((state) => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className='block text-xs font-medium text-slate-700 mb-1'>
                  {t('findTenders.category')}
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className='w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                  <option value=''>{t('findTenders.allCategories')}</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className='block text-xs font-medium text-slate-700 mb-1'>
                  {t('findTenders.minValue')}
                </label>
                <input
                  type='number'
                  placeholder={t('findTenders.minValue')}
                  value={filters.minValue}
                  onChange={(e) => setFilters({ ...filters, minValue: e.target.value })}
                  className='w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>
              
              <div>
                <label className='block text-xs font-medium text-slate-700 mb-1'>
                  {t('findTenders.maxValue')}
                </label>
                <input
                  type='number'
                  placeholder={t('findTenders.maxValue')}
                  value={filters.maxValue}
                  onChange={(e) => setFilters({ ...filters, maxValue: e.target.value })}
                  className='w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>
              
              <div>
                <label className='block text-xs font-medium text-slate-700 mb-1'>
                  {t('findTenders.status')}
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className='w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                  <option value=''>{t('findTenders.allStatus')}</option>
                  <option value='open'>{t('findTenders.open')}</option>
                  <option value='closing_soon'>{t('findTenders.closingSoon')}</option>
                  <option value='closed'>{t('findTenders.closed')}</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            <div className='h-48 bg-slate-100 rounded-lg'></div>
            <div className='h-48 bg-slate-100 rounded-lg'></div>
            <div className='h-48 bg-slate-100 rounded-lg'></div>
          </div>
        ) : filtered.length > 0 ? (
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {filtered.map((tender) => (
              <Link key={tender.id} to={`/tenders/${tender.id}`}>
                <TenderCard tender={tender} />
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Search size={48} />}
            title={t('findTenders.noTendersFound')}
            description={t('findTenders.noTendersDescription')}
            actionLabel={t('findTenders.clearSearch')}
            onAction={() => { setQuery(''); clearFilters(); }}
          />
        )}
      </div>
    </AppLayout>
  );
}
