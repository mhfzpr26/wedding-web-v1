import { BookOpen, Calendar, Plus, Trash2 } from 'lucide-react';

export const StoriesTab = ({ config, updateWeddingData }) => {
  const storiesEnabled = config.storiesEnabled !== false;
  const stories = config.stories || [];

  const handleToggleStories = (enabled) => {
    updateWeddingData({ storiesEnabled: enabled });
  };

  const handleStoryChange = (index, field, value) => {
    const updated = [...stories];
    updated[index] = { ...updated[index], [field]: value };
    updateWeddingData({ stories: updated });
  };

  const handleAddStory = () => {
    const newStory = {
      year: new Date().getFullYear().toString(),
      title: 'Momen Berkesan',
      description: 'Tuliskan kisah indah dan bermakna tentang momen ini.',
    };
    updateWeddingData({ stories: [...stories, newStory] });
  };

  const handleDeleteStory = (index) => {
    const updated = stories.filter((_, i) => i !== index);
    updateWeddingData({ stories: updated });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-500" />
            <span>Kisah Cinta (Love Story Timeline)</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Bagikan momen perjalanan cinta Anda dari pertemuan pertama hingga
            hari pernikahan.
          </p>
        </div>

        <label className="inline-flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
          <input
            type="checkbox"
            checked={storiesEnabled}
            onChange={(e) => handleToggleStories(e.target.checked)}
            className="w-4 h-4 text-gold rounded border-slate-300 focus:ring-gold"
          />
          <span className="text-xs font-bold text-slate-700">
            {storiesEnabled ? 'Kisah Cinta Aktif' : 'Kisah Cinta Nonaktif'}
          </span>
        </label>
      </div>

      {storiesEnabled && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">
              Daftar Momen ({stories.length})
            </span>
            <button
              type="button"
              onClick={handleAddStory}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold/15 text-primary hover:bg-gold hover:text-white border border-gold/40 text-xs font-bold transition-all shadow-2xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Momen</span>
            </button>
          </div>

          {stories.map((story, index) => (
            <div
              key={index}
              className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3 relative"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-slate-100 text-slate-700">
                  Momen #{index + 1}
                </span>

                <button
                  type="button"
                  onClick={() => handleDeleteStory(index)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Hapus Momen Ini"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Tahun / Periode:
                  </label>
                  <div className="relative">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
                    <input
                      type="text"
                      value={story.year || ''}
                      onChange={(e) =>
                        handleStoryChange(index, 'year', e.target.value)
                      }
                      placeholder="2021"
                      className="w-full pl-8 pr-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Judul Momen:
                  </label>
                  <input
                    type="text"
                    value={story.title || ''}
                    onChange={(e) =>
                      handleStoryChange(index, 'title', e.target.value)
                    }
                    placeholder="Pertemuan Pertama"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Deskripsi / Cerita Momen:
                </label>
                <textarea
                  rows={2}
                  value={story.description || ''}
                  onChange={(e) =>
                    handleStoryChange(index, 'description', e.target.value)
                  }
                  placeholder="Ceritakan bagaimana momen ini terjadi..."
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-gold resize-none leading-relaxed"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
