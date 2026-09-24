import { Check, Layout } from 'lucide-react';
import { useWedding } from '../../context/WeddingContext';
import { TEMPLATES } from '../../templates/registry';

export const TemplateSelector = () => {
  const { activeTemplateId, setActiveTemplateId } = useWedding();

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
          <Layout className="w-4 h-4 text-gold" />
          <span>Katalog Template Undangan</span>
        </h4>
        <p className="text-[11px] text-muted mt-0.5">
          Pilih template dasar untuk klien ini. Template baru (termasuk 3D)
          dapat ditambahkan ke sistem tanpa merusak data klien.
        </p>
      </div>

      <div className="space-y-2.5">
        {Object.values(TEMPLATES).map((tmpl) => {
          const isActive = activeTemplateId === tmpl.id;
          const isPlaceholder = tmpl.isPlaceholder;

          return (
            <div
              key={tmpl.id}
              onClick={() => {
                if (!isPlaceholder) setActiveTemplateId(tmpl.id);
              }}
              className={`p-3.5 rounded-xl border transition-all ${
                isPlaceholder
                  ? 'opacity-65 bg-slate-50 border-dashed border-slate-300 cursor-not-allowed'
                  : isActive
                    ? 'bg-base-surface border-gold shadow-sm ring-1 ring-gold cursor-pointer'
                    : 'bg-white border-slate-200 hover:border-gold/50 cursor-pointer'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-primary">
                      {tmpl.name}
                    </span>
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                        tmpl.tag === 'Best Seller'
                          ? 'bg-amber-100 text-amber-800'
                          : tmpl.tag === 'Premium Tier'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {tmpl.tag}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted mt-1 leading-relaxed">
                    {tmpl.description}
                  </p>
                </div>

                {isActive && (
                  <span className="p-1 rounded-full bg-emerald-100 text-emerald-700 ml-2">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
