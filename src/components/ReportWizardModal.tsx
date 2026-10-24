import React, { useState, useEffect } from 'react';
import {
  X,
  Upload,
  Sparkles,
  ShieldCheck,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Lock,
} from 'lucide-react';
import {
  ReportType,
  ItemCategory,
  PriorityLevel,
  CustodyDesk,
  ItemReport,
  ItemImage,
} from '../types';
import { CampusMapView } from './CampusMapView';

interface ReportWizardModalProps {
  initialType: ReportType;
  initialCoords?: { lat: number; lng: number; label?: string };
  custodyDesks: CustodyDesk[];
  reports: ItemReport[];
  onClose: () => void;
  onSubmitReport: (payload: any) => Promise<{ report: ItemReport; matchesFoundCount: number }>;
}

const CATEGORIES: ItemCategory[] = [
  'Electronics',
  'Bags and backpacks',
  'Wallets and purses',
  'Keys',
  'Identity cards',
  'Documents',
  'Books and stationery',
  'Clothing',
  'Jewellery',
  'Accessories',
  'Water bottles',
  'Other',
];

const DRAFT_STORAGE_KEY = 'findora_report_draft_v1';

export const ReportWizardModal: React.FC<ReportWizardModalProps> = ({
  initialType,
  initialCoords,
  custodyDesks,
  reports,
  onClose,
  onSubmitReport,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [type, setType] = useState<ReportType>(initialType);
  const [priority, setPriority] = useState<PriorityLevel>('medium');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ItemCategory>('Electronics');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [color, setColor] = useState('');
  const [material, setMaterial] = useState('');
  const [distinguishingFeatures, setDistinguishingFeatures] = useState('');
  const [description, setDescription] = useState('');
  const [serialHint, setSerialHint] = useState('');

  // Step 2: Photos & Private Secret Identifying Characteristic (Found items)
  const [images, setImages] = useState<ItemImage[]>([]);
  const [secretCharacteristic, setSecretCharacteristic] = useState('');
  const [secretPromptQuestion, setSecretPromptQuestion] = useState(
    'What distinctive sticker, marking, or internal detail is on this item?'
  );
  const [analyzingPhoto, setAnalyzingPhoto] = useState(false);

  // Step 3: Location & Time
  const [campusZone, setCampusZone] = useState('Central Quad & Library Wing');
  const [buildingName, setBuildingName] = useState(
    initialCoords?.label || 'Central Academic Commons'
  );
  const [floorOrArea, setFloorOrArea] = useState('Main Study Floor');
  const [locationPrivacy, setLocationPrivacy] = useState<'approximate' | 'exact_authorized'>(
    'approximate'
  );
  const [coords, setCoords] = useState<{ lat: number; lng: number }>(
    initialCoords
      ? { lat: initialCoords.lat, lng: initialCoords.lng }
      : { lat: 37.4275, lng: -122.1697 }
  );
  const [incidentDate, setIncidentDate] = useState(new Date().toISOString().slice(0, 10));
  const [incidentTimeWindow, setIncidentTimeWindow] = useState('14:00 – 16:00');
  const [designatedCustodyDeskId, setDesignatedCustodyDeskId] = useState(
    custodyDesks[0]?.id || ''
  );

  // Step 4: Review & Submission
  const [agreedPrivacy, setAgreedPrivacy] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successResult, setSuccessResult] = useState<{
    report: ItemReport;
    matchesFoundCount: number;
  } | null>(null);

  // Load autosaved draft if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (saved && !initialCoords) {
        const parsed = JSON.parse(saved);
        if (parsed.title) setTitle(parsed.title);
        if (parsed.brand) setBrand(parsed.brand);
        if (parsed.color) setColor(parsed.color);
      }
    } catch {
      // ignore
    }
  }, [initialCoords]);

  // Autosave draft
  useEffect(() => {
    try {
      localStorage.setItem(
        DRAFT_STORAGE_KEY,
        JSON.stringify({ title, brand, color, category })
      );
    } catch {
      // ignore
    }
  }, [title, brand, color, category]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) {
        setError('Only valid image files (PNG, JPEG, WebP) are permitted.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        setImages((prev) => [
          ...prev,
          { id: `img-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`, url: dataUrl, caption: file.name },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAnalyzePhotoWithAi = async () => {
    if (images.length === 0) return;
    setAnalyzingPhoto(true);
    setError(null);
    try {
      const res = await fetch('/api/ai/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dataUrl: images[0].url }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Could not analyze image.');
        return;
      }
      const s = data.suggestion;
      if (s) {
        if (s.title) setTitle(s.title);
        if (s.category && CATEGORIES.includes(s.category)) setCategory(s.category);
        if (s.brand) setBrand(s.brand);
        if (s.color) setColor(s.color);
        if (s.material) setMaterial(s.material);
        if (s.distinguishingFeatures) setDistinguishingFeatures(s.distinguishingFeatures);
      }
    } catch {
      setError('Failed to reach AI photo analysis service.');
    } finally {
      setAnalyzingPhoto(false);
    }
  };

  const validateStep = (targetStep: number): boolean => {
    setError(null);
    if (targetStep > 1) {
      if (!title.trim() || !color.trim()) {
        setError('Please enter both the item name and its primary color before continuing.');
        return false;
      }
    }
    if (targetStep > 3) {
      if (!buildingName.trim()) {
        setError('Please specify the campus building or approximate location.');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedPrivacy) {
      setError('Please confirm the location privacy and verification policy.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const result = await onSubmitReport({
        type,
        priority,
        title,
        category,
        brand,
        model,
        color,
        material,
        distinguishingFeatures,
        description,
        serialHint,
        secretCharacteristic: type === 'found' ? secretCharacteristic : undefined,
        secretPromptQuestion: type === 'found' ? secretPromptQuestion : undefined,
        campusZone,
        buildingName,
        floorOrArea,
        locationPrivacy,
        lat: coords.lat,
        lng: coords.lng,
        incidentDate,
        incidentTimeWindow,
        designatedCustodyDeskId: type === 'found' ? designatedCustodyDeskId : undefined,
        images,
      });
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      setSuccessResult(result);
    } catch (err: any) {
      setError(err?.message || 'Failed to save report.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-xl my-8">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Guided 4-Step Reporting System · Step {step} of 4
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {type === 'lost' ? 'Report a Lost Belonging' : 'Report a Found Belonging'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {successResult ? (
          <div className="p-8 text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Report Persisted &amp; Indexed
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
              Your {successResult.report.type} report{' '}
              <span className="font-semibold text-slate-900 dark:text-white">
                &ldquo;{successResult.report.title}&rdquo;
              </span>{' '}
              has been saved to the Findora database.
            </p>
            <div className="p-4 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl max-w-md mx-auto text-sm text-blue-950 dark:text-blue-200 font-mono tabular-nums">
              Automatic Matching Engine Result: {successResult.matchesFoundCount} candidate match(es) identified.
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                View Dashboard &amp; Candidate Matches
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Step Progress Bar */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { num: 1, label: '01. Item Details' },
                { num: 2, label: '02. Photos & Secret Proof' },
                { num: 3, label: '03. Map & Time' },
                { num: 4, label: '04. Review & Save' },
              ].map((s) => (
                <button
                  key={s.num}
                  type="button"
                  onClick={() => {
                    if (validateStep(s.num)) setStep(s.num as 1 | 2 | 3 | 4);
                  }}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold text-left border transition-colors ${
                    step === s.num
                      ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-600 text-blue-700 dark:text-blue-300'
                      : step > s.num
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-500/50 text-emerald-700 dark:text-emerald-400'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {error && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-lg text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* STEP 1: ITEM INFORMATION */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setType('lost')}
                      className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                        type === 'lost'
                          ? 'bg-rose-600 text-white'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      I Lost an Item
                    </button>
                    <button
                      type="button"
                      onClick={() => setType('found')}
                      className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                        type === 'found'
                          ? 'bg-emerald-600 text-white'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      I Found an Item
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                      Urgency Priority:
                    </label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                      className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-slate-100"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High (ID / Keys / Essential Tech)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Item Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g., 14-inch MacBook Pro or Brown Leather Wallet"
                      className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Category *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as ItemCategory)}
                      className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Primary Color *
                    </label>
                    <input
                      type="text"
                      required
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      placeholder="e.g., Space Gray, Matte Navy, Dark Brown"
                      className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Brand &amp; Model
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        placeholder="Brand (e.g., Apple)"
                        className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100"
                      />
                      <input
                        type="text"
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        placeholder="Model (e.g., M3 14)"
                        className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Material / Surface
                    </label>
                    <input
                      type="text"
                      value={material}
                      onChange={(e) => setMaterial(e.target.value)}
                      placeholder="e.g., Aluminum, Stitched Leather, Stainless Steel"
                      className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Optional Serial Hint (Last 4 chars only)
                    </label>
                    <input
                      type="text"
                      value={serialHint}
                      onChange={(e) => setSerialHint(e.target.value)}
                      placeholder="e.g., Ends in K9Q2"
                      className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Distinguishing Features &amp; Public Description
                  </label>
                  <textarea
                    rows={3}
                    value={distinguishingFeatures}
                    onChange={(e) => {
                      setDistinguishingFeatures(e.target.value);
                      setDescription(e.target.value);
                    }}
                    placeholder="Describe visible characteristics, stickers, protective case, or context..."
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>
            )}

            {/* STEP 2: PHOTOS & SECRET OWNERSHIP CHARACTERISTIC */}
            {step === 2 && (
              <div className="space-y-5">
                <div className="p-4 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50/60 dark:bg-slate-950/60 text-center space-y-2">
                  <Upload className="w-6 h-6 text-blue-600 mx-auto" />
                  <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Upload Item Photos (Optional)
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Upload one or more clear photos. You can also run Gemini Vision to auto-suggest item attributes.
                  </p>
                  <div className="pt-1 flex items-center justify-center gap-3">
                    <label className="px-4 py-2 bg-slate-900 dark:bg-blue-600 text-white text-xs font-semibold rounded-lg cursor-pointer hover:opacity-90 transition-opacity">
                      Select Image Files
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                    {images.length > 0 && (
                      <button
                        type="button"
                        onClick={handleAnalyzePhotoWithAi}
                        disabled={analyzingPhoto}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-violet-600 text-white text-xs font-semibold rounded-lg hover:bg-violet-700 transition-colors"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        {analyzingPhoto ? 'Analyzing Photo...' : 'Auto-Fill Details with AI'}
                      </button>
                    )}
                  </div>
                </div>

                {images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {images.map((img) => (
                      <div
                        key={img.id}
                        className="relative border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden group"
                      >
                        <img
                          src={img.url}
                          alt={img.caption || 'Uploaded preview'}
                          className="w-full h-28 object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setImages((prev) => prev.filter((i) => i.id !== img.id))}
                          className="absolute top-1.5 right-1.5 p-1 bg-slate-900/80 text-white rounded hover:bg-rose-600"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {type === 'found' && (
                  <div className="p-4 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/70 rounded-xl space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-300">
                      <Lock className="w-4 h-4 text-amber-600" />
                      PRIVATE OWNERSHIP CHALLENGE (WITHHELD FROM PUBLIC VIEW)
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Record a hidden characteristic (e.g., an internal engraving, initials under a silicone boot, or a specific sticker). Findora stores this privately on the server and uses it to verify claimants.
                    </p>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Prompt Question Shown to Claimant
                      </label>
                      <input
                        type="text"
                        value={secretPromptQuestion}
                        onChange={(e) => setSecretPromptQuestion(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Secret Identifying Characteristic (Never Shown Publicly)
                      </label>
                      <input
                        type="text"
                        value={secretCharacteristic}
                        onChange={(e) => setSecretCharacteristic(e.target.value)}
                        placeholder="e.g., Embossed owl inside coin flap, or initials R.K. on base"
                        className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 3: LOCATION & TIME */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Campus Zone
                    </label>
                    <input
                      type="text"
                      value={campusZone}
                      onChange={(e) => setCampusZone(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Building or Landmark *
                    </label>
                    <input
                      type="text"
                      required
                      value={buildingName}
                      onChange={(e) => setBuildingName(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Floor / Room / Area
                    </label>
                    <input
                      type="text"
                      value={floorOrArea}
                      onChange={(e) => setFloorOrArea(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Incident Date
                    </label>
                    <input
                      type="date"
                      value={incidentDate}
                      onChange={(e) => setIncidentDate(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Time Window
                    </label>
                    <input
                      type="text"
                      value={incidentTimeWindow}
                      onChange={(e) => setIncidentTimeWindow(e.target.value)}
                      placeholder="14:00 – 16:00"
                      className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 font-mono"
                    />
                  </div>
                  {type === 'found' ? (
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Designated Custody Desk
                      </label>
                      <select
                        value={designatedCustodyDeskId}
                        onChange={(e) => setDesignatedCustodyDeskId(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100"
                      >
                        {custodyDesks.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Location Privacy
                      </label>
                      <select
                        value={locationPrivacy}
                        onChange={(e) =>
                          setLocationPrivacy(e.target.value as 'approximate' | 'exact_authorized')
                        }
                        className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100"
                      >
                        <option value="approximate">Approximate Public Radius</option>
                        <option value="exact_authorized">Authorized Staff Only</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* Interactive Google Map Picker */}
                <CampusMapView
                  reports={reports}
                  custodyDesks={custodyDesks}
                  onSelectReport={() => {}}
                  onReportLostClick={() => {}}
                  pickerMode
                  pickedCoords={coords}
                  onPickCoords={(next) => {
                    setCoords({ lat: next.lat, lng: next.lng });
                    if (next.placeName) setBuildingName(next.placeName);
                  }}
                />
              </div>
            )}

            {/* STEP 4: REVIEW & SUBMIT */}
            {step === 4 && (
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-bold uppercase text-blue-600 dark:text-blue-400">
                      {type} Report Preview
                    </span>
                    <span className="font-mono tabular-nums">
                      {incidentDate} · {incidentTimeWindow}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    {title} ({color})
                  </h3>
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    Category: {category} · Brand: {brand || 'Unspecified'} · Priority: {priority}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    Near {buildingName} ({floorOrArea}) · Coordinates:{' '}
                    <span className="font-mono tabular-nums">
                      {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
                    </span>
                  </div>
                  {type === 'found' && secretCharacteristic && (
                    <div className="text-xs text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" />
                      Private ownership challenge configured and hidden from public API responses.
                    </div>
                  )}
                </div>

                <label className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedPrivacy}
                    onChange={(e) => setAgreedPrivacy(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300"
                  />
                  <span>
                    I confirm this report is accurate. I understand that exact coordinates for sensitive items are masked publicly and that item handover requires verified ownership or Custody Desk validation.
                  </span>
                </label>
              </div>
            )}

            {/* Wizard Navigation Footer */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3 | 4)}
                  className="px-4 py-2 text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200"
                >
                  ← Previous Step
                </button>
              ) : (
                <div />
              )}

              {step < 4 ? (
                <button
                  type="button"
                  onClick={() => {
                    if (validateStep(step + 1)) {
                      setStep((s) => (s + 1) as 1 | 2 | 3 | 4);
                    }
                  }}
                  className="px-5 py-2 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Continue to Step {step + 1} →
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 text-xs font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Saving & Running Match Engine...' : 'Submit Report & Run Matching'}
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
